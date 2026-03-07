import hashlib
import json
import os
import uuid
from datetime import datetime, timedelta

import requests
import stripe
from celery import chain
from django.conf import settings
from django.db.models import Case, F, IntegerField, Q, Sum, When, Window
from django.db.models.functions import RowNumber
from django.http import HttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django_celery_results.models import TaskResult
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from common.tasks import modify_lootlocker_assets, remove_lootlocker_assets_by_instance, send_lootlocker_trigger, send_single_purchase_rewards, send_stripe_purchase_rewards, send_subscription_rewards, update_player_currency_balance

from .authentication import ApiKeyAuth, EncryptedTokenAuthentication, HasValidEncryptedToken, MyOwnTokenAuthentication
from .encryption import decrypt_data
from .lootlocker import LootLockerService
from .models import (
    ChestOpenData,
    ChestReward,
    DailyRewardData,
    GameSeason,
    HiddenObjectGamePoster,
    LootLockerUserToken,
    MiniGameSession,
    Mission,
    OnChainCurrencyTxData,
    OnChainCurrencyTxLog,
    OnChainKillTxData,
    OnChainKillTxLog,
    PaymentLog,
    Reward,
    ShopPurchaseHistory,
    ShopPurchaseItem,
    SubscriptionLog,
    User,
    UserMedia,
    UserMission,
    UserReferralDetail,
)
from .pagination import MyPageNumPagination
from .serializers import (
    BunnyPumpRewardSerializer,
    ChestOpenPrivateSerializer,
    ConnectPGAccountSerializer,
    CreateEpicUserSerializer,
    CreateSteamUserSerializer,
    CreateUserSerializer,
    EncryptedDataSerializer,
    GenerateSteamUserTokenSerializer,
    GenerateUserTokenSerializer,
    LootlockerLeaderboardSubmitSerializer,
    MatchSessionTokenSerializer,
    MiniGameSessionFinishSerializer,
    MiniGameSessionStartSerializer,
    RewardLeaderboardSerializer,
    SaveUserLootLockerTokenSerializer,
    SendLootlockerItemSerializer,
    SendRewardSerializer,
    ShopPurchaseHistoryDetailSerializer,
    ShopPurchaseHistorySerializer,
    StarsLeaderboardSerializer,
    SubscriptionUpdateSerializer,
    UpdateMissionProgressSerializer,
    UserInfoSerializer,
    UserMediaSerializer,
    UserMediaUploadSerializer,
    UserMissionSerializer,
    UserSerializer,
    UserWalletLoginSerializer,
)
from .utils import (
    check_signature,
    credit_reward_or_fail,
    generate_chest_rewards,
    generate_jwt_token,
    generate_unique_username,
    get_epic_user_info,
    get_pg_user_info,
    get_premium_user_status,
    is_user_vip,
    map_stripe_status_to_internal,
    seconds_to_hms,
    upload_file_to_gcs,
)

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateUser(GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        email = serializer.validated_data.get("email").lower()
        username = serializer.validated_data.get("username")
        mm_address = serializer.validated_data.get("mm_address")
        metamask_bind = serializer.validated_data.get("metamask_bind", True)
        lootlocker_player_id = serializer.validated_data.get("lootlocker_player_id")
        lootlocker_wallet_id = serializer.validated_data.get("lootlocker_wallet_id")
        lootlocker_player_ulid = serializer.validated_data.get("lootlocker_player_ulid")
        user_from = serializer.validated_data.get("user_from", "avalanche")

        user = User.objects.filter(Q(email__iexact=email) | Q(username=username) | Q(lootlocker_player_id=lootlocker_player_id) | Q(lootlocker_wallet_id=lootlocker_wallet_id) | Q(lootlocker_player_ulid=lootlocker_player_ulid)).first()
        if user:
            user_data = UserSerializer(user).data
            return Response({"status": True, "result": user_data})

        # Create user
        user = User.objects.create(
            email=email,
            username=username,
            mm_address=mm_address.lower() if mm_address else "",
            metamask_bind=metamask_bind,
            lootlocker_player_id=lootlocker_player_id,
            lootlocker_wallet_id=lootlocker_wallet_id,
            lootlocker_player_ulid=lootlocker_player_ulid,
            user_from=user_from,
        )

        # Create Stripe customer
        try:
            stripe_customer = stripe.Customer.create(
                name=user.username,
                email=user.email,
            )
            user.stripe_customer_id = stripe_customer["id"]
            user.save()
        except stripe.error.StripeError:
            return Response({"status": False, "message": "Stripe error"})

        user_data = UserSerializer(user).data
        return Response({"status": True, "result": user_data})


class CreateSteamUser(GenericAPIView):
    serializer_class = CreateSteamUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        steam_id = serializer.validated_data.get("steam_id")
        lootlocker_player_id = serializer.validated_data.get("lootlocker_player_id")
        lootlocker_wallet_id = serializer.validated_data.get("lootlocker_wallet_id")
        lootlocker_player_ulid = serializer.validated_data.get("lootlocker_player_ulid")

        user = User.objects.filter(Q(steam_id=steam_id) | Q(lootlocker_player_id=lootlocker_player_id) | Q(lootlocker_wallet_id=lootlocker_wallet_id) | Q(lootlocker_player_ulid=lootlocker_player_ulid)).first()
        if user:
            user_data = UserSerializer(user).data
            return Response({"status": True, "result": user_data})

        username = f"user{lootlocker_player_id!s}"

        # Create user
        user = User.objects.create(
            steam_id=steam_id,
            lootlocker_player_id=lootlocker_player_id,
            lootlocker_wallet_id=lootlocker_wallet_id,
            lootlocker_player_ulid=lootlocker_player_ulid,
            user_from="steam",
            username=username,
        )

        user_data = UserSerializer(user).data
        return Response({"status": True, "result": user_data})


class CreateEpicUser(GenericAPIView):
    serializer_class = CreateEpicUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        epic_id = serializer.validated_data.get("epic_id")
        lootlocker_player_id = serializer.validated_data.get("lootlocker_player_id")
        lootlocker_wallet_id = serializer.validated_data.get("lootlocker_wallet_id")
        lootlocker_player_ulid = serializer.validated_data.get("lootlocker_player_ulid")

        user = User.objects.filter(Q(epic_id=epic_id) | Q(lootlocker_player_id=lootlocker_player_id) | Q(lootlocker_wallet_id=lootlocker_wallet_id) | Q(lootlocker_player_ulid=lootlocker_player_ulid)).first()
        if user:
            user_data = UserSerializer(user).data
            return Response({"status": True, "result": user_data})

        username = f"user{lootlocker_player_id!s}"

        # Create user
        user = User.objects.create(
            epic_id=epic_id,
            lootlocker_player_id=lootlocker_player_id,
            lootlocker_wallet_id=lootlocker_wallet_id,
            lootlocker_player_ulid=lootlocker_player_ulid,
            user_from="epic",
            username=username,
        )

        user_data = UserSerializer(user).data
        return Response({"status": True, "result": user_data})


class GenerateUserToken(GenericAPIView):
    serializer_class = GenerateUserTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        token = serializer.validated_data.get("token")
        token_type = serializer.validated_data.get("token_type", "avalanche")

        if token_type == "avalanche":
            user_info = get_pg_user_info(token)
            if not user_info or "email" not in user_info:
                return Response({"status": False, "message": "User Account Not Found"})

            email = user_info["email"]
            metamask_bind = user_info["metamask_bind"]
            mm_address = user_info["mm_address"]
            user = User.objects.filter(email=email).first()

            if user and user.mm_address and user.mm_address != mm_address:
                user.mm_address = mm_address
                user.metamask_bind = metamask_bind
                user.save()

        elif token_type == "epic":
            user_info = get_epic_user_info(token)
            if not user_info or "epic_id" not in user_info:
                return Response({"status": False, "message": "User Account Not Found"})

            epic_id = user_info["epic_id"]
            user = User.objects.filter(epic_id=epic_id).first()

        if not user:
            return Response({"status": False, "message": "User Account Not Found"})

        encoded_token = generate_jwt_token(exp=24, payload={"id": user.id, "type": "access_token"})
        return Response({"status": True, "result": {"access_token": encoded_token}})


class GenerateSteamUserToken(GenericAPIView):
    serializer_class = GenerateSteamUserTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        steam_id = serializer.validated_data.get("steam_id")
        ticket = serializer.validated_data.get("ticket")

        key = settings.STEAM_API_KEY
        appid = settings.STEAM_APP_ID
        url = f"https://partner.steam-api.com/ISteamUserAuth/AuthenticateUserTicket/v1/?key={key}&appid={appid}&ticket={ticket}"

        response = requests.request("GET", url, timeout=60 * 3)
        if response.status_code != 200:
            return Response({"status": True, "message": "Steam auth failed", "result": response.text})

        user_steam_id = None
        try:
            response_json = response.json()
            result = response_json["response"]
            user_steam_id = result["params"]["steamid"]
        except:
            pass

        if user_steam_id != steam_id:
            return Response({"status": False, "message": "Steam auth failed"})

        user = User.objects.filter(steam_id=user_steam_id).first()
        if not user:
            return Response({"status": False, "message": "User Account Not Found"})

        encoded_token = generate_jwt_token(exp=24, payload={"id": user.id, "type": "access_token"})
        return Response({"status": True, "result": {"access_token": encoded_token}})


class UserAuthLogin(GenericAPIView):
    serializer_class = GenerateUserTokenSerializer

    @staticmethod
    def _send_referral_reward(user, referral_code):
        if not User.objects.filter(id=referral_code).exists():
            # print("Invalid referral code")
            return None

        _, created = UserReferralDetail.objects.get_or_create(user=user, defaults={"referral_code": referral_code})
        if not created:
            # print("Referral reward already claimed")
            return None

        reward_value = 10
        ChestReward.objects.create(user=user, reward_from="referral_reward", reward_type="pump", reward_value=reward_value, status="pending")
        return reward_value

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        token = serializer.validated_data.get("token")
        referral_code = serializer.validated_data.get("referral_code", "")
        referral_reward_earned = None

        user_info = get_pg_user_info(token)
        if not user_info or "email" not in user_info or "increment_id" not in user_info:
            return Response({"status": False, "message": "User Account Not Found"})

        email = user_info["email"]
        increment_id = user_info["increment_id"]
        username = user_info["username"]
        mm_address = user_info["mm_address"]
        metamask_bind = user_info["metamask_bind"]

        user = User.objects.filter(email=email).first()
        if user:
            if user.mm_address and user.mm_address != mm_address:
                user.mm_address = mm_address
                user.metamask_bind = metamask_bind
                user.save()

            encoded_token = generate_jwt_token(exp=24, payload={"id": user.id, "type": "access_token"})
            result = {"access_token": encoded_token, "user_data": UserSerializer(user).data}

            if referral_code:
                referral_reward_earned = self._send_referral_reward(user, referral_code)
            if referral_reward_earned:
                result["referral_reward_earned"] = referral_reward_earned

            return Response({"status": True, "result": result})

        lootlocker_email = f"{increment_id}@pen.com"
        lootlocker_password = f"Pen{increment_id}{abs(increment_id % 100)}"

        try:
            lootlocker_service = LootLockerService()
            login_data = lootlocker_service.login_user(lootlocker_email, lootlocker_password)
            if not login_data:
                lootlocker_service.signup_user(lootlocker_email, lootlocker_password)
                login_data = lootlocker_service.login_user(lootlocker_email, lootlocker_password)

            lootlocker_player_id = login_data["player_id"]
            lootlocker_wallet_id = login_data["wallet_id"]
            lootlocker_player_ulid = login_data["player_ulid"]

        except Exception as e:
            return Response({"status": False, "message": "LootLocker login/signup failed", "error": str(e)})

        user = User.objects.create(
            email=email,
            username=username,
            mm_address=mm_address,
            metamask_bind=metamask_bind,
            lootlocker_player_id=lootlocker_player_id,
            lootlocker_wallet_id=lootlocker_wallet_id,
            lootlocker_player_ulid=lootlocker_player_ulid,
        )

        try:
            stripe_customer = stripe.Customer.create(name=user.username, email=user.email)
            user.stripe_customer_id = stripe_customer["id"]
            user.save()
        except stripe.error.StripeError:
            return Response({"status": False, "message": "Stripe error"})

        encoded_token = generate_jwt_token(exp=24, payload={"id": user.id, "type": "access_token"})
        result = {"access_token": encoded_token, "user_data": UserSerializer(user).data}

        if referral_code:
            referral_reward_earned = self._send_referral_reward(user, referral_code)
        if referral_reward_earned:
            result["referral_reward_earned"] = referral_reward_earned

        return Response({"status": True, "result": result})


class UserWalletLogin(GenericAPIView):
    serializer_class = UserWalletLoginSerializer

    @staticmethod
    def _send_referral_reward(user, referral_code):
        if not User.objects.filter(id=referral_code).exists():
            # print("Invalid referral code")
            return None

        _, created = UserReferralDetail.objects.get_or_create(user=user, defaults={"referral_code": referral_code})
        if not created:
            # print("Referral reward already claimed")
            return None

        reward_value = 10
        ChestReward.objects.create(user=user, reward_from="referral_reward", reward_type="pump", reward_value=reward_value, status="pending")
        return reward_value

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        signature = serializer.validated_data.get("signature")
        address = serializer.validated_data.get("address")
        message = serializer.validated_data.get("message")
        referral_code = serializer.validated_data.get("referral_code", "")
        referral_reward_earned = None

        if not check_signature(message, address, signature):
            return Response({"status": False, "message": "Invalid Signature"})

        mm_address = address.lower()
        user = User.objects.filter(mm_address=mm_address).first()

        if user:
            encoded_token = generate_jwt_token(exp=24, payload={"id": user.id, "type": "access_token"})
            result = {"access_token": encoded_token, "user_data": UserSerializer(user).data}

            if referral_code:
                referral_reward_earned = self._send_referral_reward(user, referral_code)
            if referral_reward_earned:
                result["referral_reward_earned"] = referral_reward_earned

            return Response({"status": True, "result": result})

        hashd = hashlib.sha256(mm_address.encode()).hexdigest()
        lootlocker_email = f"{hashd[:16]}@pen.com"
        lootlocker_password = f"Pen{hashd[16:28]}"

        try:
            lootlocker_service = LootLockerService()
            login_data = lootlocker_service.login_user(lootlocker_email, lootlocker_password)
            if not login_data:
                lootlocker_service.signup_user(lootlocker_email, lootlocker_password)
                login_data = lootlocker_service.login_user(lootlocker_email, lootlocker_password)

            lootlocker_player_id = login_data["player_id"]
            lootlocker_wallet_id = login_data["wallet_id"]
            lootlocker_player_ulid = login_data["player_ulid"]

        except Exception as e:
            return Response({"status": False, "message": "LootLocker login/signup failed", "error": str(e)})

        username = f"user{lootlocker_player_id!s}"

        user = User.objects.create(
            mm_address=mm_address,
            lootlocker_player_id=lootlocker_player_id,
            lootlocker_wallet_id=lootlocker_wallet_id,
            lootlocker_player_ulid=lootlocker_player_ulid,
            user_from="web3",
            username=username,
        )

        try:
            stripe_customer = stripe.Customer.create(email=user.email)
            user.stripe_customer_id = stripe_customer["id"]
            user.save()
        except stripe.error.StripeError:
            return Response({"status": False, "message": "Stripe error"})

        encoded_token = generate_jwt_token(exp=24, payload={"id": user.id, "type": "access_token"})
        result = {"access_token": encoded_token, "user_data": UserSerializer(user).data}

        if referral_code:
            referral_reward_earned = self._send_referral_reward(user, referral_code)
        if referral_reward_earned:
            result["referral_reward_earned"] = referral_reward_earned

        return Response({"status": True, "result": result})


class UserInfo(GenericAPIView):
    serializer_class = UserInfoSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user)
        return Response({"status": True, "result": serializer.data})


class ConnectPGAccount(GenericAPIView):
    serializer_class = ConnectPGAccountSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        token = serializer.validated_data.get("token")

        if user.email and user.username:
            return Response({"status": False, "message": "PG Account already connected"})

        user_info = get_pg_user_info(token)
        if not user_info or "email" not in user_info:
            return Response({"status": False, "message": "User Account Not Found"})

        email = user_info["email"]
        username = user_info["username"]
        mm_address = user_info["mm_address"]
        metamask_bind = user_info["metamask_bind"]

        pg_user = User.objects.filter(Q(email=email) | Q(username=username)).first()
        if pg_user:
            user.is_deleted = True
            user.deleted_at = timezone.now()
            user.save()
            pg_user.epic_id = user.epic_id
            pg_user.steam_id = user.steam_id

            if pg_user.mm_address and pg_user.mm_address != mm_address:
                pg_user.mm_address = mm_address
                pg_user.metamask_bind = metamask_bind

            pg_user.save()

            # Resend failed rewards of user to pg_user
            OnChainCurrencyTxLog.objects.filter(tx_data__user=user, status="failed", tx_data__status__in=["pending", "partial"]).update(status="pending", detail="")
            OnChainCurrencyTxData.objects.filter(user=user, status="partial", logs__status="pending").update(status="pending", user=pg_user, detail="")

            OnChainKillTxLog.objects.filter(Q(tx_data__from_user=user) | Q(tx_data__to_user=user)).filter(status="failed", tx_data__status__in=["pending", "partial"]).update(status="pending", detail="")
            txs = OnChainKillTxData.objects.only("id", "from_user_id", "to_user_id", "status").filter(Q(from_user=user) | Q(to_user=user)).filter(status="partial", logs__status="pending").distinct()
            for tx in txs:
                update_fields = ["status", "updated_at", "detail"]
                if tx.from_user_id == user.id:
                    tx.from_user_id = pg_user.id
                    update_fields.append("from_user")
                else:
                    tx.to_user_id = pg_user.id
                    update_fields.append("to_user")
                tx.status = "pending"
                tx.detail = ""
                tx.save(update_fields=update_fields)

            ChestReward.objects.filter(user=user, reward_type="pump", status="failed").update(status="pending", user=pg_user, detail="")
            Reward.objects.filter(user=user, reward_type="gcn_shards", status="failed").update(status="pending", user=pg_user, detail="")

            return Response({"status": True})

        try:
            stripe_customer = stripe.Customer.create(
                name=user.username,
                email=user.email,
            )
        except stripe.error.StripeError:
            return Response({"status": False, "message": "Stripe error"})

        user.email = email
        user.username = username
        user.mm_address = mm_address
        user.metamask_bind = metamask_bind
        user.stripe_customer_id = stripe_customer["id"]
        user.save()

        # Resend failed rewards user
        OnChainCurrencyTxLog.objects.filter(tx_data__user=user, status="failed", tx_data__status__in=["pending", "partial"]).update(status="pending", detail="")
        OnChainCurrencyTxData.objects.filter(user=user, status="partial", logs__status="pending").update(status="pending", detail="")

        OnChainKillTxLog.objects.filter(Q(tx_data__from_user=user) | Q(tx_data__to_user=user)).filter(status="failed", tx_data__status__in=["pending", "partial"]).update(status="pending", detail="")
        OnChainKillTxData.objects.filter(Q(from_user=user) | Q(to_user=user)).filter(status="partial", logs__status="pending").update(status="pending", detail="")

        ChestReward.objects.filter(user=user, reward_type="pump", status="failed").update(status="pending", detail="")
        Reward.objects.filter(user=user, reward_type="gcn_shards", status="failed").update(status="pending", detail="")

        return Response({"status": True})


class SaveUserLootLockerToken(GenericAPIView):
    serializer_class = SaveUserLootLockerTokenSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        token = serializer.validated_data.get("token")
        LootLockerUserToken.objects.update_or_create(user=user, defaults={"token": token, "updated_at": timezone.now()})

        return Response({"status": True, "result": serializer.data})


def handle_subscription_event(event_type, data):
    subscription_id = data["id"]
    customer_id = data.get("customer")
    status = data["status"]
    price = data["items"]["data"][0]["plan"]

    defaults = {
        "stripe_customer_id": customer_id,
        "status": status,
        "current_period_start": datetime.fromtimestamp(data["current_period_start"]),
        "current_period_end": datetime.fromtimestamp(data["current_period_end"]),
        "cancel_at_period_end": data.get("cancel_at_period_end", False),
        "canceled_at": datetime.fromtimestamp(data["canceled_at"]) if data.get("canceled_at") else None,
        "ended_at": datetime.fromtimestamp(data["ended_at"]) if data.get("ended_at") else None,
        "price_id": price["id"],
        "product_id": price["product"],
        "metadata": data.get("metadata", {}),
    }

    SubscriptionLog.objects.update_or_create(
        stripe_subscription_id=subscription_id,
        defaults=defaults,
    )


def handle_payment_intent_event(event_type, data):
    payment_intent_id = data["id"]
    metadata = data.get("metadata", {})
    platform = metadata.get("platform")

    status = data["status"]
    internal_status = map_stripe_status_to_internal(status)
    customer_id = data.get("customer")
    amount = data.get("amount", 0) / 100
    currency = data.get("currency", "usd").upper()
    payment_method = data.get("payment_method")
    receipt_email = data.get("receipt_email")
    description = data.get("description")

    defaults = {
        "stripe_customer_id": customer_id,
        "status": internal_status,
        "amount": amount,
        "currency": currency,
        "payment_method": payment_method,
        "receipt_email": receipt_email,
        "description": description,
        "metadata": metadata,
    }

    if platform == "website":
        defaults["platform"] = "website"
        defaults["order_id"] = f"ORD_{uuid.uuid4().hex[:15].upper()}"

        purchase_history, created = ShopPurchaseHistory.objects.get_or_create(
            stripe_payment_intent_id=payment_intent_id,
            defaults=defaults,
        )

        # Selective field updating (only upgrade or fill missing)
        status_priority = {"Processing": 1, "Failed": 2, "Success": 3}

        updated = False
        if not purchase_history.payment_method and payment_method:
            purchase_history.payment_method = payment_method
            updated = True
        if not purchase_history.receipt_email and receipt_email:
            purchase_history.receipt_email = receipt_email
            updated = True
        if not purchase_history.description and description:
            purchase_history.description = description
            updated = True

        # Upgrade status
        if status_priority.get(internal_status, 0) > status_priority.get(purchase_history.status, 0):
            purchase_history.status = internal_status
            updated = True

        if updated:
            purchase_history.save()

        # Create items only if not already present
        if created or not purchase_history.items.exists():
            try:
                items = json.loads(metadata.get("priceData", "[]"))
            except json.JSONDecodeError:
                items = []

            for item in items:
                stripe_price_id = item.get("priceId")
                quantity = int(item.get("quantity", 1))
                price_data = stripe.Price.retrieve(stripe_price_id)

                ShopPurchaseItem.objects.get_or_create(
                    purchase_history=purchase_history,
                    stripe_price_id=stripe_price_id,
                    defaults={
                        "stripe_product_id": price_data["product"],
                        "quantity": quantity,
                        "unit_price": price_data["unit_amount"] / 100,
                        "total_price": (price_data["unit_amount"] * quantity) / 100,
                        "currency": price_data["currency"].upper(),
                        "metadata": {
                            **price_data.get("metadata", {}),
                            "walletId": metadata.get("walletId"),
                            "playerId": metadata.get("playerId"),
                        },
                    },
                )

        # Trigger reward logic only on success
        if event_type == "payment_intent.succeeded" and description != "Subscription creation":
            for item in purchase_history.items.all():
                send_stripe_purchase_rewards.delay(item.id)

    else:
        PaymentLog.objects.update_or_create(
            stripe_payment_intent_id=payment_intent_id,
            defaults=defaults,
        )

        if event_type == "payment_intent.succeeded" and description != "Subscription creation":
            send_single_purchase_rewards.delay(payment_intent_id, metadata)


def handle_subscription_payment(data):
    customer_id = data.get("customer")
    subscription_id = data.get("subscription")
    payment_intent_id = data.get("payment_intent")
    metadata = data.get("metadata", {})

    send_subscription_rewards.delay(customer_id, subscription_id, payment_intent_id, metadata)


@csrf_exempt
def payment_webhook(request):
    payload = request.body.decode("utf-8")
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type.startswith("customer.subscription."):
        handle_subscription_event(event_type, data)

    elif event_type.startswith("payment_intent."):
        handle_payment_intent_event(event_type, data)

    if event_type == "invoice.paid" and data.get("billing_reason") in ["subscription_create", "subscription_cycle"]:
        handle_subscription_payment(data)

    return HttpResponse(status=200)


class GetPriceIdFromStripe(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        price_id = self.kwargs["price_id"]

        price = stripe.Price.retrieve(price_id)
        data = json.loads(json.dumps(price))

        return Response({"status": True, "result": data})


class GetUserSubscriptionsFromStripe(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        stripe_customer_id = user.stripe_customer_id

        subscriptions = stripe.Subscription.list(limit=3, customer=stripe_customer_id)
        data = json.loads(json.dumps(subscriptions))

        return Response({"status": True, "result": data})


class UpdateSubscriptionsFromStripe(GenericAPIView):
    serializer_class = SubscriptionUpdateSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        cancel_at_period_end = serializer.validated_data.get("cancel_at_period_end")
        sub_id = self.kwargs["sub_id"]

        subscription = stripe.Subscription.modify(sub_id, cancel_at_period_end=cancel_at_period_end)
        data = json.loads(json.dumps(subscription))

        return Response({"status": True, "result": data})


class ChestEligibilityView(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        start_of_day = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)

        normal_user = {}
        premium_user = {}
        for base_chest_type in ["avax"]:
            normal_chest_type = f"{base_chest_type}_normal"
            premium_chest_type = f"{base_chest_type}_premium"

            chest_opens = user.chest_open_data.filter(claimed_at__gte=start_of_day, claimed_at__lt=end_of_day)
            normal_opens = chest_opens.filter(chest_type=normal_chest_type).count()
            premium_opens = chest_opens.filter(chest_type=premium_chest_type).count()

            base_spins = 5
            normal_user[f"remaining_chest_today_{base_chest_type}"] = max(base_spins - normal_opens, 0)

            is_premium = get_premium_user_status(user, base_chest_type)
            if is_premium:
                bonus_spins = 5
                premium_user[f"remaining_chest_today_{base_chest_type}"] = max(bonus_spins - premium_opens, 0)

        remaining_chests = {"normal_user": normal_user}
        if premium_user:
            remaining_chests["premium_user"] = premium_user

        return Response({"status": True, "remaining_chests": remaining_chests})


class ChestOpenView(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        chest_type = self.kwargs["chest_type"]
        if chest_type not in ["avax_normal", "avax_premium"]:
            return Response({"status": False, "message": "Invalid chest type"})

        base_chest_type = chest_type.split("_")[0]
        if "premium" in chest_type:
            is_premium = get_premium_user_status(user, base_chest_type)
            if not is_premium:
                return Response({"status": False, "message": "Only premium users can open premium chests"})
        else:
            is_premium = False

        start_of_day = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        opens_today = user.chest_open_data.filter(chest_type=chest_type, claimed_at__gte=start_of_day, claimed_at__lt=end_of_day).count()

        base_spins = 5
        bonus_spins = 5 if is_premium else 0
        max_spins = base_spins if "normal" in chest_type else bonus_spins
        remaining_chest_today = max(max_spins - opens_today, 0)

        if opens_today >= max_spins:
            tomorrow_time = end_of_day - timezone.now()
            minute, sec = divmod(tomorrow_time.total_seconds(), 60)
            time_remaining = f"{int(minute // 60)}H {int(minute % 60)}M {int(sec)}S"
            return Response({"status": False, "message": "You already Opened A Chest", "time_remaining": time_remaining, "remaining_chest_today": 0})

        reward_type, reward_value = generate_chest_rewards()

        status = "pending"
        if reward_type == "stars":
            status = "complete"

        reward_status, reward_response = credit_reward_or_fail(user=user, reward_from="chest", reward_type=reward_type, reward_value=reward_value, status=status, chest_type=chest_type)
        # ChestReward.objects.create(user=user, reward_from="chest", chest_type=chest_type, reward_type=reward_type, reward_value=reward_value, status=status)
        if not reward_status:
            return Response(reward_response)

        ChestOpenData.objects.create(user=user, chest_type=chest_type, claimed_at=timezone.now())

        return Response({"status": True, "reward": {"reward_type": reward_type, "reward_value": reward_value}, "remaining_chest_today": remaining_chest_today - 1})


class ChestOpenPrivateView(GenericAPIView):
    serializer_class = ChestOpenPrivateSerializer
    permission_classes = [ApiKeyAuth]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        address = serializer.validated_data.get("address")
        chest_type = serializer.validated_data.get("chest_type")

        user = User.objects.filter(mm_address=address).first()
        if not user:
            username = generate_unique_username()
            if not username:
                return Response({"status": False, "message": "Unable to assign username"})

            user = User.objects.create(
                username=username,
                mm_address=address,
                user_from="automation",
            )

        start_of_day = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        opens_today = user.chest_open_data.filter(chest_type=chest_type, claimed_at__gte=start_of_day, claimed_at__lt=end_of_day).count()

        max_spins = 5
        remaining_chest_today = max(max_spins - opens_today, 0)

        if opens_today >= max_spins:
            return Response({"status": False, "message": "You already Opened A Chest"})

        reward_type, reward_value = generate_chest_rewards()

        reward_status, reward_response = credit_reward_or_fail(user=user, reward_from="chest", reward_type=reward_type, reward_value=reward_value, status="complete", chest_type=chest_type, detail="automation")
        # ChestReward.objects.create(user=user, reward_from="chest", chest_type=chest_type, reward_type=reward_type, reward_value=reward_value, status="complete", detail="automation")
        if not reward_status:
            return Response(reward_response)

        ChestOpenData.objects.create(user=user, chest_type=chest_type, claimed_at=timezone.now())

        if reward_type in ["coins", "karrots"]:
            OnChainCurrencyTxData.objects.create(user=user, currency_type=reward_type, tx_type="claim", amount=reward_value, status="pending")

        return Response({"status": True, "reward": {"reward_type": reward_type, "reward_value": reward_value}, "remaining_chest_today": remaining_chest_today - 1})


class BaseStarsLeaderboardView(ListAPIView):
    serializer_class = StarsLeaderboardSerializer
    pagination_class = MyPageNumPagination
    leaderboard_type_default = "season"
    include_my_data = False

    def get_monthly_range(self, now):
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        next_month = (start + timedelta(days=32)).replace(day=1)
        end = next_month - timedelta(microseconds=1)
        return start, end

    def get_season_range(self, now):
        season = GameSeason.objects.filter(Q(end_at__isnull=True) | Q(end_at__gt=now), start_at__lte=now).order_by("-start_at").first()
        if not season:
            return None, None
        return season.start_at, season.end_at or now

    def get_time_range(self):
        leaderboard_type = self.request.query_params.get("type", self.leaderboard_type_default)
        now = timezone.now()
        monthly_range = self.get_monthly_range(now)
        if leaderboard_type == "season":
            start, end = self.get_season_range(now)
            if start:
                return start, end
            return monthly_range
        return monthly_range

    def get_leaderboard_queryset(self, start_at, end_at):
        return (
            ChestReward.objects.filter(reward_type="stars", status="complete", created_at__gte=start_at, created_at__lt=end_at)
            .values(username=F("user__username"))
            .annotate(total_count=Sum("reward_value"))
            .annotate(rank=Window(expression=RowNumber(), order_by=F("total_count").desc()))
            .order_by("rank")
        )

    def get_my_data(self, leaderboard):
        user = self.request.user
        return leaderboard.filter(username=user.username).values("rank", "username", "total_count").first() or {"rank": 0, "username": user.username, "total_count": 0}
        # return next(
        #     (item for item in leaderboard if item["username"] == user.username),
        #     {"rank": 0, "username": user.username, "total_count": 0},
        # )

    def list(self, request, *args, **kwargs):
        start_at, end_at = self.get_time_range()
        leaderboard = self.get_leaderboard_queryset(start_at, end_at)

        page = self.paginate_queryset(leaderboard[:100])
        response = self.get_paginated_response(page)

        serializer = self.get_serializer(page, many=True)
        result = {"items": serializer.data, "total_item": response.data["count"], "total_page": response.data["total_pages"]}

        if self.include_my_data:
            result["my_data"] = self.get_my_data(leaderboard)

        return Response({"success": True, "result": result})


class StarsLeaderboardView(BaseStarsLeaderboardView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]
    leaderboard_type_default = "season"
    include_my_data = True


class StarsLeaderboardPublicView(BaseStarsLeaderboardView):
    leaderboard_type_default = "season"
    include_my_data = False


class UserDailyRewards(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def _should_trigger_reward(self, user):
        """Return True if user is eligible for rewards via NFT, Steam, or Stripe. Stops at first valid source."""
        if get_premium_user_status(user, "avax"):
            return True
        if get_premium_user_status(user, "core"):
            return True
        if get_premium_user_status(user, "pen"):
            return True
        if user.user_from == "steam":
            return self._is_steam_agreement_active(user.steam_id)
        return self._has_active_stripe_subscription(user.stripe_customer_id)

    def _is_steam_agreement_active(self, steam_id):
        """Check if the Steam user has an active agreement."""
        try:
            url = f"{settings.STEAM_API_URL}/GetUserAgreementInfo/v1/"
            params = {
                "key": settings.STEAM_API_KEY,
                "appid": settings.STEAM_APP_ID,
                "steamid": steam_id,
            }
            response = requests.get(url, params=params, timeout=180)
            data = response.json()
            agreement = data["response"]["params"]["agreements"]["agreement[0]"]
            # return agreement.get("status") == "Processing"
            return bool(agreement)
        except Exception:
            return False

    def _has_active_stripe_subscription(self, customer_id):
        """Check if the Stripe user has an active subscription."""
        try:
            subscriptions = stripe.Subscription.list(limit=10, customer=customer_id)
            return any(sub.status == "active" for sub in subscriptions.auto_paging_iter())
        except Exception:
            return False

    def post(self, request, *args, **kwargs):
        user = request.user
        task_ids = {
            "modify_assets": None,
            "trigger_reward": None,
        }

        today = timezone.now().date()
        if DailyRewardData.objects.filter(user=user, claimed_at__date=today).exists():
            return Response({"status": False, "message": "Reward already claimed today"})

        DailyRewardData.objects.create(user=user)

        has_subscription = self._should_trigger_reward(user)

        remove_ids_str = getattr(settings, "DAILY_REWARD_REMOVE_ASSET_IDS", "") or ""
        remove_asset_ids_list = [int(i) for i in remove_ids_str.split(",") if i.strip().isdigit()]

        add_asset_id = getattr(settings, "DAILY_REWARD_ADD_ASSET_ID", None)
        asset_id = int(add_asset_id) if add_asset_id and str(add_asset_id).isdigit() else None

        has_assets_to_modify = bool(remove_asset_ids_list or asset_id)

        # Prepare tasks
        if has_assets_to_modify:
            modify_task_sig = modify_lootlocker_assets.s(
                player_id=user.lootlocker_player_id,
                add_asset_id=asset_id,
                add_amount=3,
                remove_asset_ids=remove_asset_ids_list,
            )

            if has_subscription:
                trigger_keys = ["gunniesgang_dailyreward01"]
                trigger_task_sig = send_lootlocker_trigger.s(
                    player_id=user.lootlocker_player_id,
                    trigger_keys=trigger_keys,
                )

                # Chain both
                result = chain(modify_task_sig, trigger_task_sig).apply_async()
                task_ids["modify_assets"] = result.parent.id
                task_ids["trigger_reward"] = result.id
            else:
                result = modify_task_sig.apply_async()
                task_ids["modify_assets"] = result.id

        elif has_subscription:
            # Only trigger reward, no asset modification
            trigger_keys = ["gunniesgang_dailyreward01"]
            trigger_task = send_lootlocker_trigger.delay(
                None,
                player_id=user.lootlocker_player_id,
                trigger_keys=trigger_keys,
            )
            task_ids["trigger_reward"] = trigger_task.id

        return Response({"status": True, "task_ids": task_ids})


class UserRewardsView(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        rewards = ChestReward.objects.filter(user=user, status="complete").values("reward_type").annotate(total=Sum("reward_value"))
        result = {reward["reward_type"]: reward["total"] for reward in rewards}

        start_of_day = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)

        normal_user = {}
        premium_user = {}
        for base_chest_type in ["avax"]:
            normal_chest_type = f"{base_chest_type}_normal"
            premium_chest_type = f"{base_chest_type}_premium"

            chest_opens = user.chest_open_data.filter(claimed_at__gte=start_of_day, claimed_at__lt=end_of_day)
            normal_opens = chest_opens.filter(chest_type=normal_chest_type).count()
            premium_opens = chest_opens.filter(chest_type=premium_chest_type).count()

            base_spins = 5
            normal_user[f"remaining_chest_today_{base_chest_type}"] = max(base_spins - normal_opens, 0)

            is_premium = get_premium_user_status(user, base_chest_type)
            if is_premium:
                bonus_spins = 5
                premium_user[f"remaining_chest_today_{base_chest_type}"] = max(bonus_spins - premium_opens, 0)

        remaining_chests = {"normal_user": normal_user}
        if premium_user:
            remaining_chests["premium_user"] = premium_user

        return Response({"status": True, "rewards": result, "remaining_chests": remaining_chests})


class UserRewardsV2View(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        rewards = (
            ChestReward.objects.filter(user=user, status="complete")
            .values("reward_type")
            .annotate(
                earned=Sum(Case(When(reward_value__gt=0, then=F("reward_value")), default=0, output_field=IntegerField())),
                balance=Sum("reward_value"),
            )
        )
        balance = {}
        earned = {}

        for r in rewards:
            reward_type = r["reward_type"]
            balance[reward_type] = r["balance"] or 0
            earned[reward_type] = r["earned"] or 0

        return Response({"status": True, "result": {"balance": balance, "earned": earned}})


class TaskResultDetailView(GenericAPIView):
    def get(self, request, task_id):
        task = TaskResult.objects.filter(task_id=task_id).last()
        if not task:
            return Response({"status": False, "message": "Task not found"})

        result = {
            "task_id": task.task_id,
            "status": task.status,
            "result": task.result,
            "date_done": task.date_done,
            "task_name": task.task_name,
            "args": task.task_args,
            "kwargs": task.task_kwargs,
        }
        return Response({"status": True, "result": result})


class KillRewardClaimView(GenericAPIView):
    serializer_class = EncryptedDataSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        data = serializer.validated_data.get("data")
        try:
            decrypted_data = decrypt_data(data)
            kills = int(decrypted_data)
        except:
            return Response({"status": False, "message": "Invalid Data"})

        if kills <= 0:
            return Response({"status": False, "message": "Invalid kills count"})

        if kills > 30:
            return Response({"status": False, "message": "Max kills count is 30"})

        player_id = user.lootlocker_player_id
        ticket_id = 745836
        booster_id = 750738

        ll = LootLockerService()
        inventory = ll.get_instances_data_from_asset_ids(player_id, [ticket_id, booster_id])
        asset_instance_map = {item["asset_id"]: item["instance_id"] for item in inventory if "instance_id" in item}

        if ticket_id not in asset_instance_map:
            return Response({"status": False, "message": "User does not have a ticket"})

        if booster_id in asset_instance_map:
            stars = kills * 15
            instance_ids_to_remove = [asset_instance_map[ticket_id], asset_instance_map[booster_id]]
            detail = f"Used TICKET and BOOSTER | kills={kills}"
        else:
            stars = kills * 5
            instance_ids_to_remove = [asset_instance_map[ticket_id]]
            detail = f"Used only TICKET | kills={kills}"

        reward_status, reward_response = credit_reward_or_fail(user=user, reward_from="kills_claim", reward_type="stars", reward_value=stars, status="complete", detail=detail)
        # ChestReward.objects.create(user=user, reward_from="kills_claim", reward_type="stars", reward_value=stars, status="complete", detail=detail)
        if not reward_status:
            return Response(reward_response)

        remove_lootlocker_assets_by_instance.delay(player_id, instance_ids_to_remove)

        return Response({"status": True, "stars_awarded": stars})


class SendCoinRewardsView(GenericAPIView):
    serializer_class = EncryptedDataSerializer
    authentication_classes = [EncryptedTokenAuthentication]
    permission_classes = [HasValidEncryptedToken]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        raw_data = serializer.validated_data.get("data")
        auth_token = request.auth
        key = auth_token[-32:]
        ivc = raw_data[-16:]
        data = raw_data[:-16]

        try:
            decrypted_data = json.loads(decrypt_data(data, key=key, ivc=ivc))
        except:
            return Response({"status": False, "message": "Invalid Data format"})

        currency_id = "01JAWJKDG6653JFZ1TTKZ6T6PT"
        try:
            players = decrypted_data["players"]
            for player in players:
                wallet_id = player.get("wallet_id", None)
                coins = player.get("coins", None)
                if wallet_id and coins:
                    update_player_currency_balance.delay(wallet_id, currency_id, str(coins), "credit")

                    user = User.objects.filter(lootlocker_wallet_id=wallet_id).first()
                    if not user:
                        continue

                    OnChainCurrencyTxData.objects.create(user=user, currency_type="coins", tx_type="claim", amount=coins, status="pending")

        except:
            return Response({"status": False, "message": "Invalid Data content"})

        return Response({"status": True})


class SaveCurrencyDataView(GenericAPIView):
    serializer_class = EncryptedDataSerializer
    authentication_classes = [EncryptedTokenAuthentication]
    permission_classes = [HasValidEncryptedToken]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        raw_data = serializer.validated_data.get("data")
        auth_token = request.auth
        key = auth_token[-32:]
        ivc = raw_data[-16:]
        data = raw_data[:-16]

        try:
            decrypted_data = json.loads(decrypt_data(data, key=key, ivc=ivc))
        except:
            return Response({"status": False, "message": "Invalid Data format"})

        # lootlocker_rewards = {"coins": "01JAWJKDG6653JFZ1TTKZ6T6PT", "karrots": "01JCJHAZ5J6G70CT15W3XQE454"}
        players = decrypted_data["players"]

        for player in players:
            wallet_id = player.get("wallet_id", None)
            currency_type = player.get("currency_type", None)
            amount = player.get("amount", None)
            tx_type = player.get("type", None)

            # Send Lootlocker Rewards
            # if tx_type == "claim":
            #     api_type = "credit"
            # elif tx_type == "spend":
            #     api_type = "debit"

            # currency_id = lootlocker_rewards[currency_type]
            # update_player_currency_balance.delay(wallet_id, currency_id, str(amount), api_type)

            user = User.objects.filter(lootlocker_wallet_id=wallet_id).first()
            if not user:
                continue

            OnChainCurrencyTxData.objects.create(user=user, currency_type=currency_type, tx_type=tx_type, amount=amount, status="pending")
            if tx_type == "spend":
                ChestReward.objects.create(user=user, reward_type=currency_type, reward_value=-abs(amount), status="complete")

        return Response({"status": True})


class SaveKillDataView(GenericAPIView):
    serializer_class = EncryptedDataSerializer
    authentication_classes = [EncryptedTokenAuthentication]
    permission_classes = [HasValidEncryptedToken]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        raw_data = serializer.validated_data.get("data")
        auth_token = request.auth
        key = auth_token[-32:]
        ivc = raw_data[-16:]
        data = raw_data[:-16]

        try:
            decrypted_data = json.loads(decrypt_data(data, key=key, ivc=ivc))
        except:
            return Response({"status": False, "message": "Invalid Data format"})

        players = decrypted_data["players"]
        assignment_id = request.assignment_id

        for player in players:
            from_user_id = player.get("from", None)
            to_user_id = player.get("to", None)

            if not from_user_id or not to_user_id:
                continue

            from_user = User.objects.filter(lootlocker_player_id=int(from_user_id)).first()
            to_user = User.objects.filter(lootlocker_player_id=int(to_user_id)).first()

            if not from_user or not to_user:
                continue

            OnChainKillTxData.objects.create(from_user=from_user, to_user=to_user, match_id=assignment_id, status="pending")

        return Response({"status": True})


class CreateMatchSessionToken(GenericAPIView):
    serializer_class = MatchSessionTokenSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        assignment_id = serializer.validated_data.get("id")
        encoded_token = generate_jwt_token(exp=24, payload={"assignment_id": assignment_id, "type": "match_session_token"})

        return Response({"status": True, "token": encoded_token})


class ShopPurchaseHistoryView(ListAPIView):
    serializer_class = ShopPurchaseHistorySerializer
    pagination_class = MyPageNumPagination
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = request.user
        purchase_history = ShopPurchaseHistory.objects.filter(stripe_customer_id=user.stripe_customer_id)

        pgqs = self.paginate_queryset(purchase_history)
        ress = self.get_paginated_response(pgqs)

        total_items = ress.data["count"]
        total_pages = ress.data["total_pages"]

        serializer = self.get_serializer(pgqs, many=True)

        return Response({"success": True, "result": {"items": serializer.data, "total_item": total_items, "total_page": total_pages}})


class ShopPurchaseHistoryDetailView(ListAPIView):
    serializer_class = ShopPurchaseHistoryDetailSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        order_id = kwargs["order_id"]

        item = ShopPurchaseHistory.objects.filter(order_id=order_id).first()
        if not item:
            return Response({"status": False, "message": "Order not found"})

        serializer = self.get_serializer(item)
        return Response({"success": True, "result": serializer.data})


class ActiveMissionsView(GenericAPIView):
    serializer_class = UserMissionSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()

        mission_type = request.query_params.get("type", "all")  # daily | weekly | all
        missions = UserMission.objects.filter(user=user, reset_at__gt=now)

        # --- check daily ---
        daily_missions = missions.filter(mission__frequency="daily")
        if not daily_missions.exists():
            last_daily_ids = UserMission.objects.filter(user=user, mission__frequency="daily").order_by("-id").values_list("mission_id", flat=True)[:4]
            fixed_mission = Mission.objects.filter(frequency="daily", rewards__reward_type="gcn_shards").first()

            random_qs = Mission.objects.filter(frequency="daily").exclude(id__in=last_daily_ids)
            new_daily_missions = []

            if user.metamask_bind:
                if fixed_mission:
                    new_daily_missions.append(fixed_mission)
                    random_daily = random_qs.exclude(id=fixed_mission.id).order_by("?")[:3]
                else:
                    random_daily = random_qs.order_by("?")[:4]
            else:
                if fixed_mission:
                    random_qs = random_qs.exclude(id=fixed_mission.id)
                random_daily = random_qs.order_by("?")[:4]

            new_daily_missions.extend(random_daily)
            for m in new_daily_missions:
                UserMission.objects.create(user=user, mission=m, reset_at=now.replace(hour=23, minute=59, second=59))

        # --- check weekly ---
        weekly_missions = missions.filter(mission__frequency="weekly")
        if not weekly_missions.exists():
            last_weekly_ids = UserMission.objects.filter(user=user, mission__frequency="weekly").order_by("-id").values_list("mission_id", flat=True)[:6]
            weekly = Mission.objects.filter(frequency="weekly").exclude(id__in=last_weekly_ids).order_by("?")[:6]
            days_to_sunday = 6 - now.weekday()
            sunday = now + timedelta(days=days_to_sunday)
            for m in weekly:
                UserMission.objects.create(user=user, mission=m, reset_at=sunday.replace(hour=23, minute=59, second=59))

        missions = UserMission.objects.filter(user=user, reset_at__gt=now)
        if mission_type in ["daily", "weekly"]:
            missions = missions.filter(mission__frequency=mission_type)

        serializer = self.get_serializer(missions, many=True)
        return Response({"success": True, "result": serializer.data})


class UpdateMissionProgressView(GenericAPIView):
    serializer_class = UpdateMissionProgressSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, mission_id):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        progress = serializer.validated_data.get("progress")

        user_mission = UserMission.objects.filter(user=user, mission_id=mission_id, reset_at__gt=timezone.now()).first()
        if not user_mission:
            return Response({"status": False, "message": "Mission not found or expired"})

        if user_mission.completed:
            return Response({"status": False, "message": "Mission already completed"})

        user_mission.progress += int(progress)
        if user_mission.progress >= user_mission.mission.target:
            user_mission.completed = True
        user_mission.save()

        data = {"mission_id": user_mission.mission.id, "progress": user_mission.progress, "completed": user_mission.completed}
        return Response({"status": True, "result": data})


class ClaimMissionRewardView(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, mission_id):
        user = request.user

        user_mission = UserMission.objects.filter(user=user, mission_id=mission_id, reset_at__gt=timezone.now()).last()
        if not user_mission:
            return Response({"status": False, "message": "Mission not found or expired"})

        if not user_mission.completed:
            return Response({"status": False, "message": "Mission not completed"})

        if user_mission.claimed:
            return Response({"status": False, "message": "Reward already claimed"})

        user_mission.claimed = True
        user_mission.save()

        lootlocker_rewards = {"coins": "01JAWJKDG6653JFZ1TTKZ6T6PT", "karrots": "01JCJHAZ5J6G70CT15W3XQE454"}

        for reward in user_mission.mission.rewards.all():
            if reward.reward_type == "stars":
                detail = f"Mission completed | mission_id={reward.mission.id}"
                reward_status, reward_response = credit_reward_or_fail(user=user, reward_from="mission", reward_type="stars", reward_value=reward.reward_amount, status="complete", detail=detail)
                # ChestReward.objects.create(user=user, reward_from="mission", reward_type="stars", reward_value=reward.reward_amount, status="complete", detail=detail)
                if not reward_status:
                    return Response(reward_response)

            if reward.reward_type in ["coins", "karrots"]:
                currency_type = reward.reward_type
                amount = reward.reward_amount

                # Send Lootlocker Rewards
                currency_id = lootlocker_rewards[currency_type]
                update_player_currency_balance.delay(user.lootlocker_wallet_id, currency_id, str(amount), "credit")

                # Send Onchain Rewards
                OnChainCurrencyTxData.objects.create(user=user, currency_type=currency_type, tx_type="claim", amount=amount, status="pending")

            if reward.reward_type == "gcn_shards" and user.metamask_bind:
                reward_type = reward.reward_type
                amount = reward.reward_amount
                Reward.objects.create(user=user, reward_from="mission", reward_type=reward_type, reward_value=amount, status="pending")

        return Response({"status": True})


class MiniGameEligibilityView(GenericAPIView):
    serializer_class = MiniGameSessionStartSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        game_type = serializer.validated_data.get("game_type")

        is_vip = is_user_vip(user.mm_address)
        cooldown = timedelta(hours=8) if is_vip else timedelta(hours=24)
        # cooldown = timedelta(minutes=2)
        now = timezone.now()

        last_session = MiniGameSession.objects.filter(user=user, game_type=game_type).order_by("-started_at").first()
        poster_found = HiddenObjectGamePoster.objects.filter(user=user, found=True).exists()

        if last_session:
            next_allowed = last_session.started_at + cooldown
            if next_allowed > now:
                remaining = (next_allowed - now).total_seconds()
                return Response({"status": False, "message": "Cooldown active", "next_available_at": next_allowed.isoformat(), "time_remaining": seconds_to_hms(int(remaining)), "poster_found": poster_found})

        return Response({"status": True, "message": "Eligible", "next_available_at": None, "poster_found": poster_found})


class MiniGameStartSessionView(GenericAPIView):
    serializer_class = MiniGameSessionStartSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        game_type = serializer.validated_data.get("game_type")

        is_vip = is_user_vip(user.mm_address)
        cooldown = timedelta(hours=8) if is_vip else timedelta(hours=24)
        # cooldown = timedelta(minutes=2)
        now = timezone.now()
        last_session = MiniGameSession.objects.filter(user=user, game_type=game_type).order_by("-started_at").first()

        if last_session:
            next_allowed = last_session.started_at + cooldown
            if next_allowed > now:
                remaining = (next_allowed - now).total_seconds()
                return Response({"status": False, "message": "Cooldown active", "next_available_at": next_allowed.isoformat(), "time_remaining": seconds_to_hms(int(remaining))})

        session = MiniGameSession.objects.create(user=user, game_type=game_type, expires_at=now + timedelta(minutes=5))

        return Response({"status": True, "message": "Session started", "session_id": session.session_id, "expires_at": session.expires_at.isoformat()})


class MiniGameFinishSessionView(GenericAPIView):
    serializer_class = MiniGameSessionFinishSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        session_id = serializer.validated_data.get("session_id")
        amount = serializer.validated_data.get("amount")
        secret_hash = serializer.validated_data.get("secret_hash")
        poster_found = serializer.validated_data.get("poster_found", None)
        now = timezone.now()

        session = MiniGameSession.objects.filter(session_id=session_id, user=user).last()
        if not session:
            return Response({"status": False, "message": "Invalid session"})

        if session.status != "active":
            return Response({"status": False, "message": "Session already ended"})

        if now > session.expires_at:
            session.status = "expired"
            session.save()
            return Response({"status": False, "message": "Session expired"})

        expected_hash = hashlib.sha256(f"{session.session_id}{amount}{os.getenv('SECRET_HASH_KEY', '')}".encode()).hexdigest()
        if secret_hash != expected_hash:
            return Response({"status": False, "message": "Invalid signature"})

        if amount > 200:
            return Response({"status": False, "message": "Amount exceeds maximum limit"})

        session.status = "completed"
        session.ended_at = now
        session.save()

        ChestReward.objects.create(user=session.user, reward_from=f"minigame_{session.game_type}", reward_type="pump", reward_value=amount, status="pending")

        if poster_found is not None and poster_found:
            HiddenObjectGamePoster.objects.create(user=session.user, session_id=session.session_id)

        return Response({"status": True, "message": "Success", "reward": {"reward_type": "pump", "reward_value": amount}})


class CheckRewardBalanceView(GenericAPIView):
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        reward_type = self.kwargs["reward_type"]
        if reward_type not in ["pump"]:
            return Response({"status": False, "message": "Invalid reward type"})

        agg = ChestReward.objects.filter(user=user, reward_type__iexact=reward_type).aggregate(total=Sum("reward_value"))
        balance = agg["total"] or 0

        return Response({"status": True, "balance": int(balance)})


class RewardLeaderboardView(ListAPIView):
    serializer_class = RewardLeaderboardSerializer
    pagination_class = MyPageNumPagination
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = request.user
        reward_type = self.kwargs["reward_type"]
        if reward_type not in ["pump"]:
            return Response({"status": False, "message": "Invalid reward type"})

        now_time = timezone.now()
        month_start = now_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        next_month = (month_start + timedelta(days=32)).replace(day=1)
        month_end = next_month - timedelta(microseconds=1)

        leaderboard = (
            ChestReward.objects.filter(reward_type=reward_type, created_at__range=(month_start, month_end))
            .values(username=F("user__username"))
            .annotate(total_count=Sum("reward_value"))
            .order_by("-total_count")
            .annotate(rank=Window(expression=RowNumber(), order_by=F("total_count").desc()))
            .order_by("rank")
        )

        my_data = next(
            (item for item in leaderboard if item["username"] == user.username),
            {"rank": 0, "username": user.username, "total_count": 0},
        )

        top_100 = leaderboard[:100]
        pgqs = self.paginate_queryset(top_100)
        ress = self.get_paginated_response(pgqs)

        total_items = ress.data["count"]
        total_pages = ress.data["total_pages"]

        serializer = self.get_serializer(pgqs, many=True)

        return Response({"success": True, "result": {"my_data": my_data, "items": serializer.data, "total_item": total_items, "total_page": total_pages}})


class SendRewardView(GenericAPIView):
    serializer_class = SendRewardSerializer
    permission_classes = [ApiKeyAuth]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        reward_type = serializer.validated_data.get("reward_type")
        amount = serializer.validated_data.get("amount")
        reward_from = serializer.validated_data.get("reward_from")
        user_id = serializer.validated_data.get("user_id")

        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"status": False, "message": "User Not Found"})

        if amount > 50:
            return Response({"status": False, "message": "Amount exceeds maximum limit"})

        ChestReward.objects.create(user=user, reward_from=reward_from, reward_type=reward_type, reward_value=amount, status="pending")

        return Response({"status": True, "message": "Success", "reward": {"reward_type": reward_type, "reward_value": amount}})


class SendLootlockerItemView(GenericAPIView):
    serializer_class = SendLootlockerItemSerializer
    permission_classes = [ApiKeyAuth]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        item_type = serializer.validated_data.get("item_type")
        item_id = serializer.validated_data.get("item_id")
        amount = serializer.validated_data.get("amount")
        address = serializer.validated_data.get("address")

        supported_currencies = []
        supported_assets = ["817212"]

        user = User.objects.filter(mm_address=address).first()
        if not user:
            return Response({"status": False, "message": "User Not Found"})

        if item_type == "asset":
            if item_id not in supported_assets:
                return Response({"status": False, "message": "Invalid Asset Item"})
            modify_lootlocker_assets.delay(player_id=user.lootlocker_player_id, add_asset_id=item_id, add_amount=amount)
        elif item_type == "currency":
            if item_id not in supported_currencies:
                return Response({"status": False, "message": "Invalid Currency Item"})
            update_player_currency_balance.delay(user.lootlocker_wallet_id, item_id, str(amount), "credit")

        return Response({"status": True, "message": "Success"})


class BunnyPumpRewardView(GenericAPIView):
    serializer_class = BunnyPumpRewardSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    BUNNIES = [
        "nameless_merchant_gunnies_fps",
        "icevream_zombie",
        "veronica_gunnies_fps",
        "sunny_gunnies_fps",
        "jen",
    ]

    def post(self, request):
        user = request.user

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "errors": serializer.errors})

        bunny_name = serializer.validated_data.get("bunny_name")
        if bunny_name not in self.BUNNIES:
            return Response({"status": False, "message": "Invalid bunny name"})

        reward_from = f"talk_to_bunny_{bunny_name}"
        amount = 1
        cooldown = timedelta(hours=24)
        # cooldown = timedelta(minutes=2)
        last_reward = ChestReward.objects.filter(user=user, reward_from=reward_from, reward_type="pump").order_by("-created_at").first()

        if last_reward:
            now = timezone.now()
            next_allowed = last_reward.created_at + cooldown
            if next_allowed > now:
                remaining = (next_allowed - now).total_seconds()
                return Response({"status": False, "message": "Already claimed. Try again after cooldown.", "next_available_at": next_allowed.isoformat(), "time_remaining": seconds_to_hms(int(remaining))})

        ChestReward.objects.create(user=user, reward_from=reward_from, reward_type="pump", reward_value=amount, status="pending")

        return Response({"status": True, "message": "Pump reward granted", "reward": {"bunny_name": bunny_name, "amount": amount}})


class ListAllMediaView(GenericAPIView):
    serializer_class = UserMediaSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        media = UserMedia.objects.all().order_by("-updated_at")
        serializer = self.get_serializer(media, many=True)
        return Response({"status": True, "result": serializer.data})


class UploadMediaView(GenericAPIView):
    serializer_class = UserMediaUploadSerializer
    authentication_classes = [MyOwnTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def user_has_role(self, user, allowed_roles):
        return user.roles.filter(role_name__in=allowed_roles).exists()

    def post(self, request):
        user = request.user

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "errors": serializer.errors})

        if not self.user_has_role(user, ["admin"]):
            return Response({"status": False, "message": "Not allowed"})

        key = serializer.validated_data.get("key")
        file = serializer.validated_data.get("file")

        file_url = upload_file_to_gcs("gunnies_media", file)
        if not file_url:
            return Response({"status": False, "message": "File upload failed"})

        media, _ = UserMedia.objects.update_or_create(key=key, defaults={"file_url": file_url})
        ser = UserMediaSerializer(media)

        return Response({"status": True, "result": ser.data})


class LootlockerLeaderboardSubmitView(GenericAPIView):
    serializer_class = LootlockerLeaderboardSubmitSerializer
    permission_classes = [ApiKeyAuth]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        leaderboard_id = serializer.validated_data.get("leaderboard_id")
        player_id = serializer.validated_data.get("player_id")
        score = serializer.validated_data.get("score")
        metadata = serializer.validated_data.get("metadata", "")

        ll = LootLockerService()
        status, _ = ll.submit_leaderboard(leaderboard_id, player_id, score, metadata)

        if not status:
            return Response({"status": False, "message": "Failed to submit leaderboard score"})

        return Response({"status": True, "message": "Success"})
