import secrets
import string

import requests
from django.conf import settings
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from common.tasks import send_steam_subscription_rewards

from .serializers import CancelAgreementSerializer, SteamFinalizeTxSerializer, SteamInitTxSerializer


class SteamGetSubPrice(GenericAPIView):
    def get(self, request):
        price = settings.STEAM_SUB_PRICE
        return Response({"status": True, "price": price})


class SteamInitTx(GenericAPIView):
    serializer_class = SteamInitTxSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        steam_id = serializer.validated_data.get("steam_id")

        url = f"{settings.STEAM_API_URL}/InitTxn/v3/"

        order_id = "".join(secrets.choice(string.digits) for i in range(10))
        item_id = "648326283460"
        period = "Month"
        price = settings.STEAM_SUB_PRICE

        payload = {
            "key": settings.STEAM_API_KEY,
            "orderid": order_id,
            "steamid": steam_id,
            "appid": settings.STEAM_APP_ID,
            "itemcount": "1",
            "language": "en",
            "currency": "USD",
            "itemid[0]": item_id,
            "qty[0]": "1",
            "amount[0]": price,
            "description[0]": "Join Gunnies Gang Subscription",
            "billingtype[0]": "Steam",
            "period[0]": period,
            "frequency[0]": "1",
            "recurringamt[0]": price,
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        response = requests.request("POST", url, headers=headers, data=payload, timeout=60 * 3)
        if response.status_code != 200:
            return Response({"status": False, "result": response.text})

        return Response({"status": True, "result": response.json()})


class SteamQueryInitTx(GenericAPIView):
    def get(self, request, order_id):
        key = settings.STEAM_API_KEY
        appid = settings.STEAM_APP_ID

        url = f"{settings.STEAM_API_URL}/QueryTxn/v3/?key={key}&appid={appid}&orderid={order_id}"

        response = requests.request("GET", url, timeout=60 * 3)
        if response.status_code != 200:
            return Response({"status": True, "result": response.text})

        response_json = response.json()
        result = response_json["response"]

        return Response({"status": True, "result": result})


class SteamFinalizeTxn(GenericAPIView):
    serializer_class = SteamFinalizeTxSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        order_id = serializer.validated_data.get("order_id")
        player_id = serializer.validated_data.get("player_id")
        steam_id = serializer.validated_data.get("steam_id")

        url = f"{settings.STEAM_API_URL}/FinalizeTxn/v2/"

        payload = {"key": settings.STEAM_API_KEY, "orderid": order_id, "appid": settings.STEAM_APP_ID}
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        response = requests.request("POST", url, headers=headers, data=payload, timeout=60 * 3)
        if response.status_code != 200:
            return Response({"status": False, "result": response.text})

        response_json = response.json()
        result = response_json["response"]

        try:
            # Check Subscription
            key = settings.STEAM_API_KEY
            appid = settings.STEAM_APP_ID
            url = f"{settings.STEAM_API_URL}/GetUserAgreementInfo/v1/?key={key}&appid={appid}&steamid={steam_id}"

            ag_response = requests.request("GET", url, timeout=60 * 3)
            if ag_response.status_code != 200:
                return Response({"status": False, "result": ag_response.text})

            ag_response_json = ag_response.json()
            agreement = ag_response_json["response"]["params"]["agreements"]["agreement[0]"]

            # Send Rewards if Subscription is active
            if agreement["status"] == "Processing":
                send_steam_subscription_rewards.delay(agreement["agreementid"], player_id)
        except:
            pass

        return Response({"status": True, "result": result})


class SteamUserAgreementInfo(GenericAPIView):
    def get(self, request, steam_id):
        key = settings.STEAM_API_KEY
        appid = settings.STEAM_APP_ID

        url = f"{settings.STEAM_API_URL}/GetUserAgreementInfo/v1/?key={key}&appid={appid}&steamid={steam_id}"

        response = requests.request("GET", url, timeout=60 * 3)
        if response.status_code != 200:
            return Response({"status": True, "result": response.text})

        response_json = response.json()
        result = response_json["response"]

        return Response({"status": True, "result": result})


class SteamCancelAgreement(GenericAPIView):
    serializer_class = CancelAgreementSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response({"status": False, "message": "Validation error", "erorlist": serializer.errors})

        agreement_id = serializer.validated_data.get("agreement_id")
        steam_id = serializer.validated_data.get("steam_id")

        url = f"{settings.STEAM_API_URL}/CancelAgreement/v1/"

        payload = {"key": settings.STEAM_API_KEY, "appid": settings.STEAM_APP_ID, "agreementid": agreement_id, "steamid": steam_id}
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        response = requests.request("POST", url, headers=headers, data=payload, timeout=60 * 3)
        if response.status_code != 200:
            return Response({"status": True, "result": response.text})

        response_json = response.json()
        result = response_json["response"]

        return Response({"status": True, "result": result})
