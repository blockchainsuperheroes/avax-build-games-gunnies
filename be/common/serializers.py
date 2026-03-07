from django.db.models import Sum
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer, SerializerMethodField

from .models import MissionReward, ShopPurchaseHistory, ShopPurchaseItem, User, UserMedia, UserMission


class CreateUserSerializer(Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    lootlocker_player_id = serializers.CharField()
    lootlocker_wallet_id = serializers.CharField()
    lootlocker_player_ulid = serializers.CharField()
    mm_address = serializers.CharField(required=False, allow_blank=True)
    user_from = serializers.CharField(required=False)
    metamask_bind = serializers.BooleanField(required=False)


class CreateSteamUserSerializer(Serializer):
    steam_id = serializers.CharField()
    lootlocker_player_id = serializers.CharField()
    lootlocker_wallet_id = serializers.CharField()
    lootlocker_player_ulid = serializers.CharField()


class CreateEpicUserSerializer(Serializer):
    epic_id = serializers.CharField()
    lootlocker_player_id = serializers.CharField()
    lootlocker_wallet_id = serializers.CharField()
    lootlocker_player_ulid = serializers.CharField()


class GenerateUserTokenSerializer(Serializer):
    token = serializers.CharField()
    token_type = serializers.CharField(required=False, allow_blank=True)
    referral_code = serializers.CharField(required=False)


class UserWalletLoginSerializer(Serializer):
    signature = serializers.CharField()
    address = serializers.CharField()
    message = serializers.CharField()
    referral_code = serializers.CharField(required=False)


class ConnectPGAccountSerializer(Serializer):
    token = serializers.CharField()


class GenerateSteamUserTokenSerializer(Serializer):
    steam_id = serializers.CharField()
    ticket = serializers.CharField()


class UserInfoSerializer(ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = "__all__"

    def get_roles(self, obj):
        return list(obj.roles.values_list("role_name", flat=True))


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class SaveUserLootLockerTokenSerializer(Serializer):
    token = serializers.CharField()


class SubscriptionUpdateSerializer(Serializer):
    cancel_at_period_end = serializers.BooleanField()


class StarsLeaderboardSerializer(Serializer):
    rank = serializers.IntegerField()
    username = serializers.CharField()
    total_count = serializers.IntegerField()


class EncryptedDataSerializer(Serializer):
    data = serializers.CharField()


class MatchSessionTokenSerializer(Serializer):
    id = serializers.CharField()


class ShopPurchaseHistorySerializer(ModelSerializer):
    product_ids = SerializerMethodField()
    total_items = SerializerMethodField()

    class Meta:
        model = ShopPurchaseHistory
        fields = ["order_id", "status", "amount", "currency", "product_ids", "total_items", "created_at", "updated_at"]

    def get_product_ids(self, obj):
        return list(obj.items.values_list("stripe_product_id", flat=True))

    def get_total_items(self, obj):
        return obj.items.aggregate(total=Sum("quantity"))["total"] or 0


class ShopPurchaseItemSerializer(ModelSerializer):
    class Meta:
        model = ShopPurchaseItem
        fields = ["stripe_product_id", "quantity", "unit_price", "total_price", "currency", "lootlocker_assets_granted", "created_at", "updated_at"]


class ShopPurchaseHistoryDetailSerializer(ModelSerializer):
    items = ShopPurchaseItemSerializer(many=True)

    class Meta:
        model = ShopPurchaseHistory
        fields = ["order_id", "status", "amount", "currency", "created_at", "updated_at", "items"]


class MissionRewardSerializer(ModelSerializer):
    class Meta:
        model = MissionReward
        fields = ["reward_type", "reward_amount"]


class UserMissionSerializer(ModelSerializer):
    mission_id = serializers.IntegerField(source="mission.id")
    title = serializers.CharField(source="mission.title")
    description = serializers.CharField(source="mission.description")
    type = serializers.CharField(source="mission.type")
    target = serializers.IntegerField(source="mission.target")
    frequency = serializers.CharField(source="mission.frequency")
    rewards = MissionRewardSerializer(source="mission.rewards", many=True)

    class Meta:
        model = UserMission
        fields = ["mission_id", "title", "description", "type", "target", "progress", "completed", "claimed", "frequency", "rewards"]


class UpdateMissionProgressSerializer(Serializer):
    progress = serializers.IntegerField()


class MiniGameSessionStartSerializer(Serializer):
    game_type = serializers.CharField()

    def validate_game_type(self, value):
        if value not in ["hidden_object"]:
            msg = f"{value} is not a valid game_type."
            raise serializers.ValidationError(msg)
        return value


class MiniGameSessionFinishSerializer(Serializer):
    session_id = serializers.UUIDField()
    amount = serializers.IntegerField()
    secret_hash = serializers.CharField()
    poster_found = serializers.BooleanField(required=False)


class RewardLeaderboardSerializer(Serializer):
    rank = serializers.IntegerField()
    username = serializers.CharField()
    total_count = serializers.IntegerField()


class SendRewardSerializer(Serializer):
    reward_type = serializers.CharField()
    reward_from = serializers.CharField()
    amount = serializers.IntegerField()
    user_id = serializers.IntegerField()

    def validate_reward_type(self, value):
        if value not in ["pump"]:
            msg = f"{value} is not a valid reward_type."
            raise serializers.ValidationError(msg)
        return value


class SendLootlockerItemSerializer(Serializer):
    item_type = serializers.CharField()
    item_id = serializers.CharField()
    amount = serializers.IntegerField()
    address = serializers.CharField()

    def validate_item_type(self, value):
        if value not in ["asset", "currency"]:
            msg = f"{value} is not a valid item_type."
            raise serializers.ValidationError(msg)
        return value


class BunnyPumpRewardSerializer(Serializer):
    bunny_name = serializers.CharField()
    amount = serializers.IntegerField(required=False, default=1)


class UserMediaUploadSerializer(Serializer):
    key = serializers.CharField()
    file = serializers.FileField()


class UserMediaSerializer(ModelSerializer):
    class Meta:
        model = UserMedia
        fields = "__all__"


class LootlockerLeaderboardSubmitSerializer(Serializer):
    leaderboard_id = serializers.IntegerField()
    player_id = serializers.CharField()
    score = serializers.IntegerField()
    metadata = serializers.CharField(required=False)


class ChestOpenPrivateSerializer(Serializer):
    address = serializers.CharField()
    chest_type = serializers.CharField()

    def validate_chest_type(self, value):
        if value not in ["avax_normal"]:
            msg = f"{value} is not a valid chest_type."
            raise serializers.ValidationError(msg)
        return value
