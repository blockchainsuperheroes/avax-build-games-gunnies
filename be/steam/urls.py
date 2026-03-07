from django.urls import path

from .views import SteamCancelAgreement, SteamFinalizeTxn, SteamGetSubPrice, SteamInitTx, SteamQueryInitTx, SteamUserAgreementInfo

urlpatterns = [
    path("get_sub_price", SteamGetSubPrice.as_view()),
    path("init_txn", SteamInitTx.as_view()),
    path("query_txn/<str:order_id>", SteamQueryInitTx.as_view()),
    path("finalize_txn", SteamFinalizeTxn.as_view()),
    path("user_agreement_info/<str:steam_id>", SteamUserAgreementInfo.as_view()),
    path("cancel_agreement", SteamCancelAgreement.as_view()),
]
