from rest_framework import serializers


class SteamInitTxSerializer(serializers.Serializer):
    steam_id = serializers.CharField()


class SteamFinalizeTxSerializer(serializers.Serializer):
    order_id = serializers.CharField()
    player_id = serializers.CharField()
    steam_id = serializers.CharField()


class CancelAgreementSerializer(serializers.Serializer):
    agreement_id = serializers.CharField()
    steam_id = serializers.CharField()
