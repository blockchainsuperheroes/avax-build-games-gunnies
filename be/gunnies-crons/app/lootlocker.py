from datetime import timedelta
from os import environ

import requests

from app import db
from app.utils import get_utc_time

from .models import LootLockerServerToken, LootLockerUserToken, User


class LootLockerService:
    def __init__(self):
        self.server_url = environ.get("LOOTLOCKER_SERVER_URL")
        self.server_key = environ.get("LOOTLOCKER_SERVER_KEY")

    def fetch_new_token_from_api(self) -> str:
        try:
            url = f"{self.server_url}/server/session"
            headers = {"LL-Version": "2021-03-01", "x-server-key": self.server_key}
            payload = {"game_version": "1.0.0.0"}
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                response_data = response.json()
                return response_data.get("token")
        except Exception:
            return None
        return None

    def get_server_token(self) -> str:
        try:
            token_obj = LootLockerServerToken.query.first()

            if token_obj and token_obj.expiry_time and token_obj.expiry_time > get_utc_time():
                return token_obj.token

            new_token = self.fetch_new_token_from_api()

            if new_token:
                expiry_time = get_utc_time() + timedelta(hours=1)
                if token_obj:
                    token_obj.token = new_token
                    token_obj.expiry_time = expiry_time
                else:
                    token_obj = LootLockerServerToken(token=new_token, expiry_time=expiry_time)
                    db.session.add(token_obj)

                db.session.commit()
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
            user = User.query.filter_by(lootlocker_player_id=player_id).first()
            token_obj = LootLockerUserToken.query.filter_by(user=user).first()
            if token_obj:
                return token_obj.token

            new_token = self.fetch_new_user_token_from_api(player_ulid=user.lootlocker_player_ulid)
            if new_token:
                token_obj = LootLockerUserToken(user=user, token=new_token)
                db.session.add(token_obj)
                db.session.commit()
                return new_token

        except Exception:
            pass
        return ""

    def send_currency(self, wallet_id: str, currency_id: str, amount: str) -> bool:
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
            url = f"{self.server_url}/server/balances/credit"
            response = requests.post(url, json=payload, headers=headers, timeout=30)

            if response.status_code == 200:
                status, detail = "complete", "success"
            else:
                status, detail = "failed", response.text

        except Exception as exc:
            # print("Exception ====> ", str(exc))
            status = "failed"
            detail = str(exc)

        return status, detail

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

    def store_user_ulid(self):
        users = User.query.all()
        auth_token = self.get_server_token()

        player_ids = [str(user.lootlocker_player_id) for user in users]
        if not player_ids:
            # print("No users found")
            return

        url = f"{self.server_url}/server/players/lookup/name"

        params = [("player_id", pid) for pid in player_ids]
        headers = {"x-auth-token": auth_token}

        response = requests.get(url, params=params, headers=headers, timeout=30)
        if response.status_code != 200:
            # print("Failed to fetch user ULIDs from LootLocker")
            return

        response_json = response.json()

        players = response_json.get("players", [])
        ulid_map = {int(p["player_id"]): p["ulid"] for p in players if "player_id" in p and "ulid" in p}
        if not ulid_map:
            return

        # Fetch user IDs from DB to make sure they exist
        users = User.query.with_entities(User.id, User.lootlocker_player_id).filter(User.lootlocker_player_id.in_(ulid_map.keys())).all()
        update_data = []

        for user_id, player_id in users:
            update_data.append(
                {
                    "id": user_id,
                    "lootlocker_player_ulid": ulid_map[player_id],
                },
            )

        db.session.bulk_update_mappings(User, update_data)
        db.session.commit()


def store_user_ulid():
    ll_service = LootLockerService()
    ll_service.store_user_ulid()
    # print("User ULIDs stored successfully.")
