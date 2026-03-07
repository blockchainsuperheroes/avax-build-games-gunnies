import json

import stripe
from celery import shared_task
from django.conf import settings

from .lootlocker import LootLockerService
from .models import ShopPurchaseItem, User

stripe.api_key = settings.STRIPE_SECRET_KEY


@shared_task
def send_stripe_purchase_rewards(purchase_item_id):
    purchase_item = ShopPurchaseItem.objects.filter(id=purchase_item_id).first()
    metadata = purchase_item.metadata or {}

    wallet_id = metadata["walletId"]
    player_id = metadata["playerId"]
    items_raw = metadata.get("items")
    items = json.loads(items_raw)

    asset_items = [i for i in items if i.get("orderType") == "asset"]
    currency_items = [i for i in items if i.get("orderType") == "currency"]

    ll = LootLockerService()
    api_status, api_detail = False, {}

    if asset_items:
        add_assets_data = []
        for item in asset_items:
            item_id = item.get("id")
            order_amount = int(item.get("orderAmount", 1))
            order_type = item.get("orderType")

            if order_type == "asset":
                for _ in range(order_amount):
                    add_assets_data.append({"asset_id": item_id})

        if add_assets_data:
            api_status, api_detail = ll.remove_or_add_inventory_item(player_id, add_assets=add_assets_data, instance_id=[])

    elif currency_items:
        for item in currency_items:
            item_id = item.get("id")
            order_amount = int(item.get("orderAmount"))
            quantity = int(purchase_item.quantity or 1)
            order_amount = str(order_amount * quantity)
            api_status, api_detail = ll.update_currency(wallet_id, item_id, order_amount, "credit")

    if api_status and not purchase_item.lootlocker_assets_granted:
        purchase_item.lootlocker_assets_granted = True
        purchase_item.save()

    return {
        "purchase_item_id": purchase_item_id,
        "api_status": api_status,
        "api_detail": api_detail,
    }


@shared_task
def send_single_purchase_rewards(payment_intent_id, metadata):
    # print(f"Sending rewards for {payment_intent_id} and {metadata}")
    player_id = metadata["playerId"]
    price_id = metadata["priceId"]
    wallet_id = metadata["walletId"]

    price_data = stripe.Price.retrieve(price_id)
    price_metadata = price_data.get("metadata", {})

    currency_id = price_metadata.get("id")
    order_amount = price_metadata.get("orderAmount")
    order_type = price_metadata.get("orderType")
    order_item = price_metadata.get("orederItem")

    ll = LootLockerService()
    api_status, api_detail = ll.update_currency(wallet_id, currency_id, order_amount, "credit")
    # print("api_status ==> ", api_status)
    # print("api_detail ==> ", api_detail)

    return {
        "payment_intent_id": payment_intent_id,
        "stripe_price_id": price_id,
        "wallet_id": wallet_id,
        "player_id": player_id,
        "currency_id": currency_id,
        "order_amount": order_amount,
        "order_type": order_type,
        "order_item": order_item,
        "api_status": api_status,
        "api_detail": api_detail,
    }


@shared_task
def modify_lootlocker_assets(player_id, add_asset_id=None, add_amount=0, remove_asset_ids=None):
    # print(f"Modifying assets for {player_id}")
    ll = LootLockerService()

    # Step 1: Prepare remove instance IDs
    instance_ids = []
    if remove_asset_ids:
        instance_ids = ll.get_instances_from_asset_ids(player_id, remove_asset_ids)
    # print("instance_ids ==> ", instance_ids)

    # Step 2: Prepare add assets payload
    add_assets_data = []
    if add_asset_id and add_amount:
        add_assets_data = [{"asset_id": add_asset_id} for _ in range(add_amount)]

    # Step 3: Call unified add/remove method
    api_status, api_detail = ll.remove_or_add_inventory_item(player_id, add_assets=add_assets_data, instance_id=instance_ids)
    # print("api_status ==> ", api_status)
    # print("api_detail ==> ", api_detail)

    return {
        "player_id": player_id,
        "add_asset_id": add_asset_id,
        "add_amount": add_amount,
        "remove_asset_ids": remove_asset_ids,
        "instance_ids": instance_ids,
        "api_status": api_status,
        "api_detail": api_detail,
    }


@shared_task
def send_lootlocker_trigger(_, player_id, trigger_keys):
    # print(f"Sending trigger for {player_id} of keys {trigger_keys}")
    ll = LootLockerService()
    api_status, api_detail = ll.send_trigger(player_id, trigger_keys)
    # print("api_status ==> ", api_status)
    # print("api_detail ==> ", api_detail)

    return {
        "player_id": player_id,
        "trigger_keys": trigger_keys,
        "api_status": api_status,
        "api_detail": api_detail,
    }


@shared_task
def send_subscription_rewards(customer_id, subscription_id, payment_intent_id, metadata):
    # print(f"Sending trigger for successfull subscription {subscription_id} for {customer_id}")
    user = User.objects.filter(stripe_customer_id=customer_id).first()
    player_id = user.lootlocker_player_id
    trigger_keys = ["gunniesgang_starter_pack01"]
    ll = LootLockerService()
    api_status, api_detail = ll.send_trigger(player_id, trigger_keys)
    # print("api_status ==> ", api_status)
    # print("api_detail ==> ", api_detail)

    return {
        "customer_id": customer_id,
        "subscription_id": subscription_id,
        "payment_intent_id": payment_intent_id,
        "metadata": metadata,
        "player_id": player_id,
        "trigger_keys": trigger_keys,
        "api_status": api_status,
        "api_detail": api_detail,
    }


@shared_task
def send_steam_subscription_rewards(agreement_id, player_id):
    # print(f"Sending trigger for successfull steam subscription {agreement_id} for {player_id}")
    trigger_keys = ["gunniesgang_starter_pack01"]
    ll = LootLockerService()
    api_status, api_detail = ll.send_trigger(player_id, trigger_keys)
    # print("api_status ==> ", api_status)
    # print("api_detail ==> ", api_detail)

    return {
        "agreement_id": agreement_id,
        "player_id": player_id,
        "trigger_keys": trigger_keys,
        "api_status": api_status,
        "api_detail": api_detail,
    }


@shared_task
def remove_lootlocker_assets_by_instance(player_id, instance_ids):
    # print(f"Removing {instance_ids} for {player_id}")
    ll = LootLockerService()
    api_status, api_detail = ll.remove_or_add_inventory_item(player_id, add_assets=[], instance_id=instance_ids)
    # print("api_status ==> ", api_status)
    # print("api_detail ==> ", api_detail)

    return {
        "player_id": player_id,
        "remove_instance_ids": instance_ids,
        "api_status": api_status,
        "api_detail": api_detail,
    }


@shared_task
def update_player_currency_balance(wallet_id, currency_id, amount, api_type):
    # print(f"Sending Currency {currency_id} amount {amount} to {wallet_id}")
    ll = LootLockerService()
    api_status, api_detail = ll.update_currency(wallet_id, currency_id, amount, api_type)
    # print("api_status ==> ", api_status)
    # print("api_detail ==> ", api_detail)

    return {
        "wallet_id": wallet_id,
        "currency_id": currency_id,
        "amount": amount,
        "api_status": api_status,
        "api_detail": api_detail,
    }
