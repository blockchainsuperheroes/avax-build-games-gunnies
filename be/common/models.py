import uuid

from django.db import models


class User(models.Model):
    email = models.CharField(max_length=50, blank=True)
    username = models.CharField(max_length=50, blank=True)
    mm_address = models.CharField(max_length=200, blank=True)
    lootlocker_player_id = models.IntegerField(null=True)
    lootlocker_wallet_id = models.CharField(max_length=100, blank=True)
    lootlocker_player_ulid = models.CharField(max_length=50, blank=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True)
    steam_id = models.CharField(max_length=100, blank=True)
    epic_id = models.CharField(max_length=100, blank=True)
    user_from = models.CharField(max_length=20, blank=True)
    metamask_bind = models.BooleanField(null=True)
    is_deleted = models.BooleanField(default=False, null=True)
    deleted_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = "user"

    @property
    def is_authenticated(self):
        return True


class LootLockerServerToken(models.Model):
    token = models.CharField(max_length=255, blank=True)
    expiry_time = models.DateTimeField(null=True)

    class Meta:
        db_table = "lootlocker_server_token"


class LootLockerUserToken(models.Model):
    user = models.ForeignKey(User, related_name="lootlocker_token", on_delete=models.CASCADE, null=True)
    token = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    expiry_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "lootlocker_user_token"


class SubscriptionLog(models.Model):
    stripe_subscription_id = models.CharField(max_length=100, unique=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50)
    current_period_start = models.DateTimeField(null=True)
    current_period_end = models.DateTimeField(null=True)
    cancel_at_period_end = models.BooleanField(default=False, null=True)
    canceled_at = models.DateTimeField(null=True)
    ended_at = models.DateTimeField(null=True)
    price_id = models.CharField(max_length=100, blank=True, null=True)
    product_id = models.CharField(max_length=100, blank=True, null=True)
    metadata = models.JSONField(default=dict, null=True)
    lootlocker_assets_granted = models.BooleanField(default=False, null=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = "subscription_logs"


class PaymentLog(models.Model):
    stripe_payment_intent_id = models.CharField(max_length=100, unique=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    receipt_email = models.CharField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    metadata = models.JSONField(default=dict, null=True)
    lootlocker_assets_granted = models.BooleanField(default=False, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payment_logs"


class DailyRewardData(models.Model):
    user = models.ForeignKey(User, related_name="daily_reward_data", on_delete=models.CASCADE)
    claimed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "daily_reward_data"


class ChestOpenData(models.Model):
    user = models.ForeignKey(User, related_name="chest_open_data", on_delete=models.CASCADE)
    chest_type = models.CharField(max_length=50, blank=True)
    claimed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chest_open_data"


class ChestReward(models.Model):
    user = models.ForeignKey(User, related_name="chest_rewards", on_delete=models.CASCADE)
    chest_type = models.CharField(max_length=50, blank=True)
    reward_from = models.CharField(max_length=50, blank=True)
    reward_type = models.CharField(max_length=50)
    reward_value = models.IntegerField(default=0)
    tx_hash = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20)
    detail = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "chest_rewards"


class UserStars(models.Model):
    user = models.ForeignKey(User, related_name="rewards_stars", on_delete=models.CASCADE)
    count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_stars"


class ShopPurchaseHistory(models.Model):
    platform = models.CharField(max_length=10, blank=True)
    order_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    stripe_payment_intent_id = models.CharField(max_length=100, unique=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    receipt_email = models.CharField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    metadata = models.JSONField(default=dict, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "shop_purchase_history"


class ShopPurchaseItem(models.Model):
    purchase_history = models.ForeignKey(ShopPurchaseHistory, related_name="items", on_delete=models.CASCADE)
    stripe_product_id = models.CharField(max_length=100)
    stripe_price_id = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    metadata = models.JSONField(default=dict, null=True)
    lootlocker_assets_granted = models.BooleanField(default=False, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "shop_purchase_items"


class OnChainCurrencyTxData(models.Model):
    user = models.ForeignKey(User, related_name="onchain_currency_tx_data", on_delete=models.CASCADE)
    currency_type = models.CharField(max_length=20, blank=True)
    tx_type = models.CharField(max_length=20, blank=True)
    amount = models.FloatField(default=0)
    status = models.CharField(max_length=20)
    detail = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "onchain_currency_tx_data"


class OnChainCurrencyTxLog(models.Model):
    tx_data = models.ForeignKey(OnChainCurrencyTxData, related_name="logs", on_delete=models.CASCADE)
    chain_id = models.BigIntegerField()
    tx_hash = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, default="pending")
    detail = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "onchain_currency_tx_log"
        unique_together = ("tx_data", "chain_id")


class OnChainKillTxData(models.Model):
    from_user = models.ForeignKey(User, related_name="onchain_kill_from", on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name="onchain_kill_to", on_delete=models.CASCADE)
    match_id = models.CharField(max_length=200, blank=True)
    count = models.IntegerField(default=1)
    status = models.CharField(max_length=20)
    detail = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "onchain_kill_tx_data"


class OnChainKillTxLog(models.Model):
    tx_data = models.ForeignKey(OnChainKillTxData, related_name="logs", on_delete=models.CASCADE)
    chain_id = models.BigIntegerField()
    tx_hash = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, default="pending")
    detail = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "onchain_kill_tx_log"
        unique_together = ("tx_data", "chain_id")


class OnChainKillSummaryLog(models.Model):
    user = models.ForeignKey(User, related_name="onchain_kill_summary_logs", on_delete=models.CASCADE)
    total_kills = models.IntegerField()
    chain_id = models.BigIntegerField()
    tx_hash = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=20, default="pending")
    detail = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "onchain_kill_summary_log"


class Mission(models.Model):
    FREQUENCY_TYPES = [
        ("daily", "Daily"),
        ("weekly", "Weekly"),
        ("event", "Event"),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    type = models.CharField(max_length=50)
    target = models.IntegerField()
    frequency = models.CharField(max_length=20, choices=FREQUENCY_TYPES, default="daily")

    class Meta:
        db_table = "missions"

    def __str__(self):
        return f"{self.title} ({self.frequency})"


class MissionReward(models.Model):
    mission = models.ForeignKey(Mission, related_name="rewards", on_delete=models.CASCADE)
    reward_type = models.CharField(max_length=50)
    reward_amount = models.IntegerField()

    class Meta:
        db_table = "mission_rewards"


class UserMission(models.Model):
    user = models.ForeignKey(User, related_name="missions", on_delete=models.CASCADE)
    mission = models.ForeignKey(Mission, related_name="user_missions", on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    claimed = models.BooleanField(default=False)
    reset_at = models.DateTimeField()

    class Meta:
        db_table = "user_missions"

    def check_complete(self):
        if self.progress >= self.mission.target:
            self.completed = True


class MiniGameSession(models.Model):
    SESSION_STATUS = [
        ("active", "Active"),
        ("expired", "Expired"),
        ("completed", "Completed"),
    ]

    session_id = models.UUIDField(default=uuid.uuid4)
    user = models.ForeignKey(User, related_name="minigame_sessions", on_delete=models.CASCADE)
    game_type = models.CharField(max_length=50)
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=SESSION_STATUS, default="active")

    class Meta:
        db_table = "minigame_session"


class HiddenObjectGamePoster(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4)
    user = models.ForeignKey(User, related_name="hidden_object_game_posters", on_delete=models.CASCADE)
    found = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "hidden_object_game_poster"


class UserReferralDetail(models.Model):
    user = models.ForeignKey(User, related_name="referral_details", on_delete=models.CASCADE)
    referral_code = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_referral_details"


class UserRole(models.Model):
    user = models.ForeignKey(User, related_name="roles", on_delete=models.CASCADE)
    role_name = models.CharField(max_length=50)

    class Meta:
        db_table = "user_roles"


class UserMedia(models.Model):
    key = models.CharField(max_length=100, blank=True, unique=True)
    file_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_media"


class Reward(models.Model):
    user = models.ForeignKey(User, related_name="rewards", on_delete=models.CASCADE)
    reward_type = models.CharField(max_length=50, blank=True)
    reward_from = models.CharField(max_length=50, blank=True)
    reward_value = models.IntegerField(default=0)
    tx_hash = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, blank=True)
    detail = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rewards"


class GameSeason(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=20)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "game_seasons"
