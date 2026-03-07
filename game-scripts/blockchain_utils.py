import csv
import datetime
import json
import os
import secrets
import string
import uuid
from functools import lru_cache

import jwt
import requests
from django.conf import settings
from django.db.models import Sum
from django.utils import timezone
from eth_account import Account
from eth_account.messages import encode_defunct
from google.cloud import storage
from web3 import HTTPProvider, Web3
from web3.middleware import geth_poa_middleware

from .models import ChestReward, User, UserStars


def generate_jwt_token(exp=None, payload=None):
    alphabet = string.ascii_letters + string.digits
    random_string = "".join(secrets.choice(alphabet) for i in range(15))

    if payload is None:
        payload = {}

    if exp is None:
        payload = payload | {"random_string": random_string}
    else:
        exp_time = timezone.now() + datetime.timedelta(hours=exp)
        payload = payload | {"random_string": random_string, "exp": exp_time}

    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def get_pg_user_info(token):
    user_info = {}
    try:
        url = settings.PG_LOGIN_BACKEND_URL + "/user/info"
        headers = {
            "Authorization": f"Bearer {token}",
        }
        response = requests.request("GET", url, headers=headers, timeout=60 * 5)
        res_json = response.json()
        email = res_json["result"]["email"]
        increment_id = res_json["result"]["increment_id"]
        username = res_json["result"]["username"]
        mm_address = res_json["result"]["mm_address"]
        metamask_bind = res_json["result"]["metamask_bind"]

        user_info = {
            "email": email,
            "increment_id": increment_id,
            "username": username,
            "mm_address": mm_address,
            "metamask_bind": metamask_bind,
        }
    except:
        pass
    return user_info


def get_epic_user_info(token):
    user_info = {}
    try:
        url = "https://api.epicgames.dev/epic/oauth/v2/tokenInfo"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        payload = {"token": token}

        response = requests.request("POST", url, headers=headers, data=payload, timeout=60 * 5)
        res_json = response.json()
        epic_id = res_json["account_id"]

        user_info = {
            "epic_id": epic_id,
        }
    except:
        pass
    return user_info


def get_chain_details(chain_id):
    chain_list = [
        {
            "chain_name": "avax_fuji",
            "chain_id": 43113,
            "rpc_url": os.getenv("NODE_RPC_URL_AVAX_FUJI", ""),
        },
        {
            "chain_name": "avax_mainnet",
            "chain_id": 43114,
            "rpc_url": os.getenv("NODE_RPC_URL_AVAX", ""),
        },
        {
            "chain_name": "avax_mainnet",
            "chain_id": 43114,
            "rpc_url": os.getenv("NODE_RPC_URL_AVAX", ""),
        },
        {
            "chain_name": "avax_mainnet",
            "chain_id": 43114,
            "rpc_url": os.getenv("NODE_RPC_URL_AVAX", ""),
        },
    ]

    return next((item for item in chain_list if item["chain_id"] == chain_id), {})


def get_premium_user_status(user, chest_type):
    status = False
    try:
        chest_type = chest_type.upper()
        chain_id = int(os.getenv(f"PREMIUM_NFT_CHAIN_ID_{chest_type}"))
        contract_address = os.getenv(f"PREMIUM_NFT_CONTRACT_{chest_type}")

        chain_details = get_chain_details(chain_id)
        if chain_details:
            rpc = chain_details["rpc_url"]

        w3_instance = Web3(HTTPProvider(rpc))
        w3_instance.middleware_onion.inject(geth_poa_middleware, layer=0)

        if not w3_instance.is_connected():
            # print("connection failed....")
            return False

        user_address = Web3.to_checksum_address(user.mm_address)

        abi = json.loads(
            '[{"inputs": [{"internalType": "address", "name": "owner", "type": "address"}], "name": "balanceOf", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}]',
        )
        contract_checksum = Web3.to_checksum_address(contract_address)
        contract = w3_instance.eth.contract(abi=abi, address=contract_checksum)
        bal = contract.functions.balanceOf(user_address).call()
        if bal >= 1:
            status = True

    except Exception:
        pass

    return status


def generate_chest_rewards():
    chest_rewards = {
        1: {"percent": 350000000, "reward_type": "stars", "reward_value": 5},
        2: {"percent": 250000000, "reward_type": "stars", "reward_value": 10},
        3: {"percent": 100000000, "reward_type": "stars", "reward_value": 20},
        4: {"percent": 20000000, "reward_type": "stars", "reward_value": 40},
        5: {"percent": 160000000, "reward_type": "coins", "reward_value": 10},
        6: {"percent": 80000000, "reward_type": "coins", "reward_value": 20},
        7: {"percent": 40000000, "reward_type": "coins", "reward_value": 40},
        8: {"percent": 100000, "reward_type": "karrots", "reward_value": 10},
        9: {"percent": 10000, "reward_type": "karrots", "reward_value": 25},
        10: {"percent": 1000, "reward_type": "karrots", "reward_value": 100},
        # 11: {"percent": 10, "reward_type": "khaos", "reward_value": 100000, "max_per_month": 2},
        # 12: {"percent": 1, "reward_type": "usdt", "reward_value": 250, "max_per_month": 1},
    }

    max_weight = 0
    assigned_ranges = {}
    for rec in chest_rewards:
        assigned_ranges[rec] = range(max_weight, max_weight + int(chest_rewards[rec]["percent"]))
        max_weight += int(chest_rewards[rec]["percent"])

    random_number = secrets.randbelow(max_weight)
    chosen_loot = 0
    for id, a_range in assigned_ranges.items():
        if random_number in a_range:
            chosen_loot = id
            break

    reward_data = chest_rewards[chosen_loot]
    reward_type = reward_data["reward_type"]
    reward_value = reward_data["reward_value"]
    max_per_month = reward_data.get("max_per_month")

    if max_per_month is not None:
        now = timezone.now()
        first_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_count = ChestReward.objects.filter(reward_type=reward_type, reward_value=reward_value, created_at__gte=first_of_month).count()

        if monthly_count >= max_per_month:
            chosen_loot = 1
            reward_data = chest_rewards[chosen_loot]
            reward_type = reward_data["reward_type"]
            reward_value = reward_data["reward_value"]

    return reward_type, reward_value


def map_stripe_status_to_internal(status):
    if status == "succeeded":
        return "Success"
    if status in ["processing", "requires_action", "requires_capture", "requires_confirmation", "requires_payment_method"]:
        return "Processing"
    if status == "canceled":
        return "Failed"
    return "Failed"


def seconds_to_hms(seconds):
    hrs, rem = divmod(seconds, 3600)
    mins, secs = divmod(rem, 60)
    return f"{int(hrs)}H {int(mins)}M {int(secs)}S"


def is_user_vip(address):
    is_vip = False
    try:
        url = f"{os.getenv('PG_ROLE_URL', '')}?mm_address={address}"
        headers = {"api-key": os.getenv("PG_ROLE_API_KEY", "")}
        response = requests.get(url, headers=headers, timeout=60 * 2)
        api_data = response.json()
        roles = api_data["discord_roles"]
        if "VIP1" in roles or "VIP2" in roles or "VIP3" in roles:
            is_vip = True
    except Exception:
        pass
    return is_vip


def upload_file_to_gcs(folder_name, file):
    try:
        bucket_name = settings.GCS_BUCKET_NAME
        storage_client = storage.Client.from_service_account_json(settings.GCS_CREDENTIALS_FILE)
        bucket = storage_client.bucket(bucket_name)

        blob_path = f"{folder_name}/{uuid.uuid4()}_{file.name}"
        blob = bucket.blob(blob_path)
        blob.upload_from_file(file.file, content_type=file.content_type)
    except:
        return ""
    else:
        return f"https://storage.googleapis.com/{bucket_name}/{blob_path}"


def check_signature(message, address, signature):
    try:
        msg_list = message.split(",")
        if len(msg_list) > 1:
            timestamp = msg_list[-1]
            temp = datetime.datetime.fromtimestamp(int(timestamp), datetime.timezone.utc)
            date_time = temp + datetime.timedelta(minutes=5)
            if timezone.now() > date_time:
                return False

        message_hash = encode_defunct(text=message)
        signature_address = Account().recover_message(message_hash, signature=signature)

        return address.lower() == signature_address.lower()
    except:
        return False


MAX_USERNAME_RETRIES = 50


@lru_cache(maxsize=1)
def load_usernames():
    usernames: list[str] = []
    try:
        with open("random_usernames_100k.csv", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                username = row.get("username")
                if username:
                    usernames.append(username.strip())
    except Exception:
        return ()
    return tuple(usernames)


def get_random_username():
    usernames = load_usernames()
    if not usernames:
        return None
    return secrets.choice(usernames)


def generate_unique_username():
    for _ in range(MAX_USERNAME_RETRIES):
        username = get_random_username()
        if not username:
            return None
        if not User.objects.filter(username=username).exists():
            return username
    return None


DAILY_REWARD_LIMITS = {
    "stars": 1000,
    # "coins": 5000,
    # "karrots": 200,
}


def get_today_reward_total(user, reward_type):
    start_of_day = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + datetime.timedelta(days=1)
    total = ChestReward.objects.filter(user=user, reward_type=reward_type, created_at__gte=start_of_day, created_at__lt=end_of_day).aggregate(total=Sum("reward_value"))["total"]
    return total or 0


def credit_reward_or_fail(user, reward_from, reward_type, reward_value, status, chest_type="", detail=""):
    daily_limit = DAILY_REWARD_LIMITS.get(reward_type)
    if daily_limit is not None:
        today_total = get_today_reward_total(user, reward_type)
        if today_total + reward_value > daily_limit:
            return False, {"status": False, "message": f"Daily {reward_type} limit exceeded", "reward_type": reward_type, "daily_limit": daily_limit, "already_earned": today_total, "attempted": reward_value}

    ChestReward.objects.create(user=user, reward_from=reward_from, reward_type=reward_type, reward_value=reward_value, chest_type=chest_type, status=status, detail=detail)
    if reward_type == "stars":
        obj, _ = UserStars.objects.get_or_create(user=user)
        obj.count += reward_value
        obj.save()

    return True, {"status": True, "message": f"{reward_type.capitalize()} credited successfully"}
