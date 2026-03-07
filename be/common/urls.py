"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path

from .views import (
    ActiveMissionsView,
    BunnyPumpRewardView,
    CheckRewardBalanceView,
    ChestEligibilityView,
    ChestOpenPrivateView,
    ChestOpenView,
    ClaimMissionRewardView,
    ConnectPGAccount,
    CreateEpicUser,
    CreateMatchSessionToken,
    CreateSteamUser,
    CreateUser,
    GenerateSteamUserToken,
    GenerateUserToken,
    GetPriceIdFromStripe,
    GetUserSubscriptionsFromStripe,
    KillRewardClaimView,
    ListAllMediaView,
    LootlockerLeaderboardSubmitView,
    MiniGameEligibilityView,
    MiniGameFinishSessionView,
    MiniGameStartSessionView,
    RewardLeaderboardView,
    SaveCurrencyDataView,
    SaveKillDataView,
    SendCoinRewardsView,
    SendLootlockerItemView,
    ShopPurchaseHistoryDetailView,
    ShopPurchaseHistoryView,
    StarsLeaderboardPublicView,
    StarsLeaderboardView,
    TaskResultDetailView,
    UpdateMissionProgressView,
    UpdateSubscriptionsFromStripe,
    UploadMediaView,
    UserAuthLogin,
    UserDailyRewards,
    UserInfo,
    UserRewardsV2View,
    UserRewardsView,
    UserWalletLogin,
    payment_webhook,
)

urlpatterns = [
    path("user/create", CreateUser.as_view()),
    path("user/create/epic", CreateEpicUser.as_view()),
    path("user/create/steam", CreateSteamUser.as_view()),
    path("user/token", GenerateUserToken.as_view()),
    path("user/token/steam", GenerateSteamUserToken.as_view()),
    path("user/auth/login", UserAuthLogin.as_view()),
    path("user/login/wallet", UserWalletLogin.as_view()),
    path("user/info", UserInfo.as_view()),
    path("user/connect_pg", ConnectPGAccount.as_view()),
    # path("user/lootlocker/token", SaveUserLootLockerToken.as_view()),
    path("user/daily_reward", UserDailyRewards.as_view()),
    path("payment/webhook", payment_webhook),
    path("payment/price/<str:price_id>", GetPriceIdFromStripe.as_view()),
    path("payment/subscriptions", GetUserSubscriptionsFromStripe.as_view()),
    path("payment/subscriptions/<str:sub_id>", UpdateSubscriptionsFromStripe.as_view()),
    path("chest/eligibility", ChestEligibilityView.as_view()),
    path("chest/open/<str:chest_type>", ChestOpenView.as_view()),
    path("private/chest/open", ChestOpenPrivateView.as_view()),
    path("stars/leaderboard", StarsLeaderboardView.as_view()),
    path("stars/leaderboard/public", StarsLeaderboardPublicView.as_view()),
    path("user/rewards", UserRewardsView.as_view()),
    path("user/rewards/v2", UserRewardsV2View.as_view()),
    path("task_status/<uuid:task_id>", TaskResultDetailView.as_view()),
    path("kill_reward_claim", KillRewardClaimView.as_view()),
    path("match/save_data", SendCoinRewardsView.as_view()),
    path("match/save_currency_data", SaveCurrencyDataView.as_view()),
    path("match/save_kill_data", SaveKillDataView.as_view()),
    path("match/create_session", CreateMatchSessionToken.as_view()),
    path("shop/purchase_history", ShopPurchaseHistoryView.as_view()),
    path("shop/purchase_detail/<order_id>", ShopPurchaseHistoryDetailView.as_view()),
    path("missions/active", ActiveMissionsView.as_view()),
    path("missions/<int:mission_id>/update", UpdateMissionProgressView.as_view()),
    path("missions/<int:mission_id>/claim", ClaimMissionRewardView.as_view()),
    path("minigame/eligibility", MiniGameEligibilityView.as_view()),
    path("minigame/start_session", MiniGameStartSessionView.as_view()),
    path("minigame/finish_session", MiniGameFinishSessionView.as_view()),
    path("reward_balance/<str:reward_type>", CheckRewardBalanceView.as_view()),
    path("leaderboard/<str:reward_type>", RewardLeaderboardView.as_view()),
    # path("send_reward", SendRewardView.as_view()),
    path("send_lootlocker_item", SendLootlockerItemView.as_view()),
    path("bunny_pump_reward", BunnyPumpRewardView.as_view()),
    path("media/list", ListAllMediaView.as_view()),
    path("media/upload", UploadMediaView.as_view()),
    path("lootlocker/leaderboard/submit", LootlockerLeaderboardSubmitView.as_view()),
]
