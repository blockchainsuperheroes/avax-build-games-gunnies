from os import environ

from web3 import Web3

from app import db
from app.models import ChestReward, OnChainCurrencyTxData, ScriptStates, User
from app.utils import get_utc_time, get_web3_instance_with_contract

from .lootlocker import LootLockerService


def build_and_send_tx(w3, contract_func, tx_params, private_key):
    tx = contract_func.build_transaction(tx_params)
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash_raw = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash_raw, timeout=600)
    return Web3.to_hex(receipt["transactionHash"])


def update_rewards_status(rewards, tx_hash, status, detail):
    return [
        {
            "id": reward_id,
            "tx_hash": tx_hash,
            "status": status,
            "detail": detail,
            "updated_at": get_utc_time(),
        }
        for reward_id in rewards
    ]


def send_bulk_rewards(onchain_list, contract_path, contract_env_prefix, contract_func_name):
    if not onchain_list:
        # print("No rewards to send.")
        return

    contract_address = environ.get(f"{contract_env_prefix}_CONTRACT_ADDRESS")
    contract_chain = int(environ.get(f"{contract_env_prefix}_CONTRACT_CHAIN"))
    minter_address = Web3.to_checksum_address(environ.get("MINTER_ADDRESS"))
    private_key = environ.get("MINTER_PRIVATE_KEY")

    w3, contract, gas_price = get_web3_instance_with_contract(contract_path, contract_address, contract_chain)
    if not w3:
        # print("Web3 connection issue")
        return

    is_bulk = contract_func_name == "bulkMint"
    reward_groups = [onchain_list[i : i + 20] for i in range(0, len(onchain_list), 20)] if is_bulk else [[r] for r in onchain_list]

    for group in reward_groups:
        reward_ids = []
        try:
            if is_bulk:
                user_addresses = [r["user_address"] for r in group]
                amounts = [r["amount"] for r in group]
                reward_ids = [r["reward_id"] for r in group]
                nonce = w3.eth.get_transaction_count(minter_address)
                tx_hash = build_and_send_tx(
                    w3,
                    contract.functions.bulkMint(user_addresses, amounts),
                    {"gasPrice": gas_price, "from": minter_address, "nonce": nonce},
                    private_key,
                )
            else:
                reward = group[0]
                reward_ids = [reward["reward_id"]]
                nonce = w3.eth.get_transaction_count(minter_address)
                tx_hash = build_and_send_tx(
                    w3,
                    contract.functions.transfer(reward["user_address"], reward["amount"]),
                    {"gasPrice": gas_price, "from": minter_address, "nonce": nonce},
                    private_key,
                )

            # print("tx_hash ===>", tx_hash)
            updates = update_rewards_status(reward_ids, tx_hash, "complete", "success")
        except Exception as exc:
            # print("Exception ===>", str(exc))
            updates = update_rewards_status(reward_ids, "", "failed", str(exc))

        if updates:
            db.session.bulk_update_mappings(ChestReward, updates)
            db.session.commit()


def send_chest_rewards():
    pending_rewards = db.session.query(ChestReward).join(User).filter(ChestReward.status == "pending").order_by(ChestReward.id).limit(150).all()
    # print("pending_rewards ==>", pending_rewards)

    if not pending_rewards:
        # print("No pending rewards")
        return

    lootlocker_rewards = {"coins": "01JAWJKDG6653JFZ1TTKZ6T6PT", "karrots": "01JCJHAZ5J6G70CT15W3XQE454"}
    # onchain_rewards = ["khaos", "usdt"]
    # onchain_khaos_skale = []
    # onchain_khaos_core = []
    # onchain_usdt = []
    update_obj = []

    ll_service = LootLockerService()

    for reward in pending_rewards:
        user = reward.user
        if not user:
            # print("User Not Found")
            continue

        if reward.reward_type in lootlocker_rewards:
            currency_id = lootlocker_rewards[reward.reward_type]
            status, detail = ll_service.send_currency(user.lootlocker_wallet_id, currency_id, str(reward.reward_value))
            update_obj.append(
                {
                    "id": reward.id,
                    "status": status,
                    "detail": detail,
                    "updated_at": get_utc_time(),
                },
            )
            tx_obj = OnChainCurrencyTxData(user=user, currency_type=reward.reward_type, tx_type="claim", amount=reward.reward_value, status="pending", detail="")
            db.session.add(tx_obj)
            db.session.commit()

        # elif reward.reward_type in onchain_rewards:
        #     reward_data = {
        #         "user_address": Web3.to_checksum_address(user.mm_address),
        #         "amount": Web3.to_wei(reward.reward_value, "ether"),
        #         "reward_id": reward.id,
        #     }
        #     if reward.reward_type == "khaos":
        #         base_chest_type = reward.chest_type.split("_")[0]
        #         if base_chest_type == "skale":
        #             onchain_khaos_skale.append(reward_data)
        #         elif base_chest_type == "core":
        #             onchain_khaos_core.append(reward_data)

        #     elif reward.reward_type == "usdt":
        #         onchain_usdt.append(reward_data)

    if update_obj:
        db.session.bulk_update_mappings(ChestReward, update_obj)
        db.session.commit()

    # print("onchain_khaos_skale ==> ", onchain_khaos_skale)
    # print("onchain_khaos_core ==> ", onchain_khaos_core)
    # print("onchain_usdt ==> ", onchain_usdt)

    # send_bulk_rewards(onchain_khaos_skale, "app/khaos_token_abi.json", "KHAOS_SKALE", "bulkMint")
    # send_bulk_rewards(onchain_khaos_core, "app/khaos_token_abi.json", "KHAOS_CORE", "bulkMint")
    # send_bulk_rewards(onchain_usdt, "app/usdt_token_abi.json", "USDT", "transfer")

    # Update script state
    script_state = ScriptStates.query.filter_by(name="chest_rewards").first()
    if not script_state:
        script_state = ScriptStates(name="chest_rewards")

    script_state.last_ran = get_utc_time()
    db.session.add(script_state)
    db.session.commit()

    # print("Finished sending chest rewards.")
