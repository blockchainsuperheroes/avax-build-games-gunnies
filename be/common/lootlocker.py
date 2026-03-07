from datetime import timedelta

import requests
from django.conf import settings
from django.utils.timezone import now

from .models import LootLockerServerToken, LootLockerUserToken, User


class LootLockerService:
    def __init__(self):
        self.server_url = settings.LOOTLOCKER_SERVER_URL
        self.server_key = settings.LOOTLOCKER_SERVER_KEY
        self.game_key = settings.LOOTLOCKER_GAME_KEY
        self.domain_key = settings.LOOTLOCKER_DOMAIN_KEY
        self.is_dev = settings.LOOTLOCKER_IS_DEV

    def _get_common_headers(self):
        return {
            "domain-key": self.domain_key,
            "is-development": str(self.is_dev).lower(),
            "Content-Type": "application/json",
        }

    def fetch_new_token_from_api(self) -> str:
        url = f"{self.server_url}/server/session"
        headers = {"LL-Version": "2021-03-01", "x-server-key": self.server_key}
        payload = {"game_version": "1.0.0.0"}
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                response_data = response.json()
                return response_data.get("token")
        except Exception:
            return None
        return None

    def get_server_token(self) -> str:
        try:
            token_obj = LootLockerServerToken.objects.first()

            if token_obj and token_obj.expiry_time and token_obj.expiry_time > now():
                return token_obj.token

            new_token = self.fetch_new_token_from_api()

            if new_token:
                expiry_time = now() + timedelta(hours=1)
                if token_obj:
                    token_obj.token = new_token
                    token_obj.expiry_time = expiry_time
                    token_obj.save()
                else:
                    LootLockerServerToken.objects.create(token=new_token, expiry_time=expiry_time)
                return new_token

        except Exception:
            return ""

    def fetch_new_user_token_from_api(self, player_ulid) -> str:
        url = f"{self.server_url}/client/v3/oauth/token?game_version=1.0.0.0"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        payload = {
            "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
            "actor_token_type": "urn:ietf:params:oauth:token-type:access_token",
            "subject_token_type": "lootlocker.v1.player",
            "subject_token": player_ulid,
            "actor_token": self.server_key,
        }
        try:
            response = requests.post(url, data=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                response_data = response.json()
                return response_data.get("access_token")
        except Exception:
            return None
        return None

    def get_user_token(self, player_id: int) -> str:
        try:
            user = User.objects.filter(lootlocker_player_id=player_id).first()
            if not user:
                return ""
            token_obj = LootLockerUserToken.objects.filter(user=user).first()

            if token_obj and token_obj.expiry_time and token_obj.expiry_time > now():
                return token_obj.token

            new_token = self.fetch_new_user_token_from_api(player_ulid=user.lootlocker_player_ulid)
            if new_token:
                expiry_time = now() + timedelta(hours=1)
                if token_obj:
                    token_obj.token = new_token
                    token_obj.expiry_time = expiry_time
                    token_obj.save()
                else:
                    LootLockerUserToken.objects.create(user=user, token=new_token, expiry_time=expiry_time)
                return new_token

        except Exception:
            pass
        return ""

    def remove_or_add_inventory_item(self, player_id: int, add_assets: list[dict], instance_id: list[int]) -> bool:
        try:
            auth_token = self.get_server_token()
            headers = {
                "LL-Version": "2021-03-01",
                "x-auth-token": auth_token,
            }
            payload = {
                "add": add_assets,
                "remove": instance_id,
            }
            url = f"{self.server_url}/server/player/{player_id}/inventory"
            response = requests.patch(url, json=payload, headers=headers, timeout=30)

            if response.status_code == 200:
                status, detail = True, response.json()
            else:
                status, detail = False, response.text

        except Exception as exc:
            # print("Exception ====> ", str(exc))
            status = False
            detail = str(exc)

        return status, detail

    def update_currency(self, wallet_id: str, currency_id: str, amount: str, api_type: str) -> bool:
        try:
            auth_token = self.get_server_token()
            headers = {
                "LL-Version": "2021-03-01",
                "x-auth-token": auth_token,
            }
            payload = {
                "wallet_id": wallet_id,
                "currency_id": currency_id,
                "amount": amount,
            }
            url = f"{self.server_url}/server/balances/{api_type}"
            response = requests.post(url, json=payload, headers=headers, timeout=30)

            if response.status_code == 200:
                status, detail = True, response.json()
            else:
                status, detail = False, response.text

        except Exception as exc:
            # print("Exception ====> ", str(exc))
            status = False
            detail = str(exc)

        return status, detail

    def get_instances_from_asset_ids(self, player_id: int, asset_ids: list[int]) -> list:
        instances = []
        try:
            auth_token = self.get_server_token()
            if not auth_token:
                return instances

            headers = {
                "LL-Version": "2021-03-01",
                "x-auth-token": auth_token,
            }

            url = f"{self.server_url}/server/player/{player_id}/inventory?count=100"
            has_more = True
            after_id = None

            while has_more:
                paginated_url = f"{url}&after={after_id}" if after_id else url
                response = requests.get(paginated_url, headers=headers, timeout=30)

                if response.status_code != 200:
                    break

                data = response.json()
                items = data.get("items", [])
                if not items:
                    break

                for item in items:
                    asset = item.get("asset", {})
                    if asset.get("id") in asset_ids:
                        instances.append(item.get("instance_id"))

                after_id = items[-1].get("instance_id") if items else None
                has_more = bool(after_id and len(items) == 100)

        except Exception:
            pass

        return instances

    def send_trigger(self, player_id: int, keys: list[str]) -> bool:
        try:
            user_token = self.get_user_token(player_id)
            headers = {
                "Content-Type": "application/json",
                "x-session-token": user_token,
            }
            payload = {"keys": keys}
            url = f"{self.server_url}/game/triggers/cozy-crusader/v1"
            response = requests.post(url, json=payload, headers=headers, timeout=30)

            if response.status_code == 200:
                status, detail = True, response.json()
            else:
                status, detail = False, response.text

        except Exception as exc:
            # print("Exception ====> ", str(exc))
            status = False
            detail = str(exc)

        return status, detail

    def signup_user(self, email: str, password: str) -> dict:
        try:
            url = f"{self.server_url}/white-label-login/sign-up"
            headers = self._get_common_headers()
            payload = {
                "email": email,
                "password": password,
                "remember": True,
            }
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                return response.json()
        except Exception:
            pass
        return {}

    def login_user(self, email: str, password: str) -> dict:
        try:
            login_url = f"{self.server_url}/white-label-login/login"
            headers = self._get_common_headers()
            payload = {
                "email": email,
                "password": password,
                "remember": True,
            }

            login_response = requests.post(login_url, json=payload, headers=headers, timeout=30)
            if login_response.status_code != 200:
                return {}

            session_token = login_response.json().get("session_token")
            if not session_token:
                return {}

            session_url = f"{self.server_url}/game/v2/session/white-label"
            payload = {
                "game_key": self.game_key,
                "email": email,
                "token": session_token,
                "game_version": "0.10.0.0",
            }
            headers = {
                "Content-Type": "application/json",
            }

            session_response = requests.post(session_url, json=payload, headers=headers, timeout=30)

            if session_response.status_code == 200:
                return session_response.json()

        except Exception:
            pass
        return {}

    def get_instances_data_from_asset_ids(self, player_id: int, asset_ids: list[int]) -> list:
        instances = []
        try:
            auth_token = self.get_server_token()
            headers = {"LL-Version": "2021-03-01", "x-auth-token": auth_token}
            url = f"{self.server_url}/server/player/{player_id}/inventory?count=100"
            after_id = None

            while True:
                paginated_url = f"{url}&after={after_id}" if after_id else url
                response = requests.get(paginated_url, headers=headers, timeout=30)
                if response.status_code != 200:
                    break

                data = response.json()
                items = data.get("items", [])
                if not items:
                    break

                for item in items:
                    asset = item.get("asset", {})
                    if asset.get("id") in asset_ids:
                        instances.append(
                            {
                                "asset_id": asset.get("id"),
                                "instance_id": item.get("instance_id"),
                            },
                        )

                after_id = items[-1].get("instance_id") if items else None
                if not after_id or len(items) < 100:
                    break

        except Exception:
            pass

        return instances

    def submit_leaderboard(self, leaderboard_id: int, player_id: str, score: int, metadata: str) -> bool:
        try:
            auth_token = self.get_server_token()
            headers = {
                "x-auth-token": auth_token,
            }
            payload = {
                "member_id": player_id,
                "score": score,
                "metadata": metadata,
            }
            url = f"{self.server_url}/server/leaderboards/{leaderboard_id}/submit"
            response = requests.post(url, json=payload, headers=headers, timeout=30)

            if response.status_code == 200:
                status, detail = True, response.json()
            else:
                status, detail = False, response.text

        except Exception as exc:
            # print("Exception ====> ", str(exc))
            status = False
            detail = str(exc)

        return status, detail
