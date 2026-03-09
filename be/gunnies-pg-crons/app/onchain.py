import random
from os import environ

from eth_account import Account
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import aliased, joinedload
from sqlalchemy.sql import func
from web3 import Web3

from app import automation_session, db, pg_session
from app.models import ChestReward, OnChainCurrencyTxData, OnChainCurrencyTxLog, OnChainKillSummaryLog, OnChainKillTxData, OnChainKillTxLog, Reward
from app.models import User as GunniesUser
from app.models_dappradar import UserWallet
from app.models_pg import User as PgUser
from app.utils import get_utc_time, get_web3_instance_with_contract


def send_gas(w3, gas_price, to_address, amount, from_address, private_key):
    nonce = w3.eth.get_transaction_count(from_address, "pending")
    chain_id = w3.eth.chain_id
    tx = {
        "to": to_address,
        "value": amount,
        "gasPrice": gas_price,
        "gas": 21000,
        "nonce": nonce,
        "chainId": chain_id,
    }
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=600)
    return Web3.to_hex(receipt["transactionHash"])


def build_and_send_tx(w3, contract_func, tx_params, private_key):
    tx = contract_func.build_transaction(tx_params)
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash_raw = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash_raw, timeout=600)
    return Web3.to_hex(receipt["transactionHash"])


def check_and_add_whitelist(w3, contract, gas_price, user_address, minter_address, minter_private_key):
    try:
        if contract.functions.whitelisted(user_address).call():
            # print(f"User {user_address} is already whitelisted")
            return

        nonce = w3.eth.get_transaction_count(minter_address, "pending")
        build_and_send_tx(
            w3,
            contract.functions.toggleWhitelist(user_address),
            {"gasPrice": gas_price, "from": minter_address, "nonce": nonce},
            minter_private_key,
        )
        # print(f"User {user_address} whitelisted successfully")
    except Exception as e:
        print(f"Error whitelisting user {user_address}: {e}")


def resolve_user_wallet(tx, chain_id):
    gunnies_user = tx.user
    if gunnies_user.user_from == "automation":
        wallet = automation_session.query(UserWallet).filter(UserWallet.address == gunnies_user.mm_address).first()
        if not wallet or not wallet.key:
            return {
                "tx_data_id": tx.id,
                "chain_id": chain_id,
                "status": "failed",
                "detail": "No matching Automation user" if not wallet else "Wallet/key missing (Automation) ",
                "updated_at": get_utc_time(),
                "tx_hash": "",
            }
        private_key = Account.decrypt(wallet.key, environ.get("AUTOMATION_WALLET_PASSWORD"))
        return Web3.to_checksum_address(wallet.address), private_key

    pg_user = pg_session.query(PgUser).filter((PgUser.email == gunnies_user.email) | (PgUser.username == gunnies_user.username)).first()
    if not pg_user or not pg_user.wallet or not pg_user.wallet.key:
        return {
            "tx_data_id": tx.id,
            "chain_id": chain_id,
            "status": "failed",
            "detail": "No matching PG user" if not wallet else "Wallet/key missing",
            "updated_at": get_utc_time(),
            "tx_hash": "",
        }
    private_key = Account.decrypt(pg_user.wallet.key, environ.get("WALLET_PASSWORD"))
    return Web3.to_checksum_address(pg_user.wallet.address), private_key


def handle_currency_tx(tx, minter_address, minter_private_key, w3, contract, gas_price, chain_id):
    try:
        resolved = resolve_user_wallet(tx, chain_id)
        if isinstance(resolved, dict):
            return resolved

        user_address, private_key = resolved

        tx_type = tx.tx_type.lower()
        if tx_type not in ("claim", "spend"):
            return {
                "tx_data_id": tx.id,
                "chain_id": chain_id,
                "status": "failed",
                "detail": f"Unsupported tx_type '{tx_type}'",
                "updated_at": get_utc_time(),
                "tx_hash": "",
            }

        check_and_add_whitelist(w3, contract, gas_price, user_address, minter_address, minter_private_key)

        amount = Web3.to_wei(tx.amount, "ether")
        nonce = w3.eth.get_transaction_count(user_address, "pending")

        # Build function call
        func_call = contract.functions.claim(amount) if tx_type == "claim" else contract.functions.spend(contract.address, amount)

        # Estimate gas & check balance
        gas_estimate = func_call.estimate_gas({"from": user_address})
        estimated_cost_wei = gas_estimate * gas_price
        min_balance_required = estimated_cost_wei * 2

        user_balance = w3.eth.get_balance(user_address)
        # print(f"Receiver balance: {Web3.from_wei(user_balance, 'ether')}")
        # print(f"Required: {Web3.from_wei(min_balance_required, 'ether')}")

        if user_balance < min_balance_required:
            # print("Insufficient balance. Sending gas...")
            send_gas(
                w3,
                gas_price,
                user_address,
                min_balance_required,
                minter_address,
                minter_private_key,
            )
            # print("Gas transaction hash:", gas_tx)

        # send tx
        tx_hash = build_and_send_tx(
            w3,
            func_call,
            {"gasPrice": gas_price, "from": user_address, "nonce": nonce},
            private_key,
        )

        return {
            "tx_data_id": tx.id,
            "chain_id": chain_id,
            "status": "complete",
            "detail": "success",
            "updated_at": get_utc_time(),
            "tx_hash": tx_hash,
        }

    except Exception as exc:
        pg_session.rollback()
        print(f"[TX ERROR] handle_currency_tx tx_id={tx.id}: {exc}")
        return {
            "tx_data_id": tx.id,
            "chain_id": chain_id,
            "status": "failed",
            "detail": str(exc),
            "updated_at": get_utc_time(),
            "tx_hash": "",
        }

    except SQLAlchemyError as exc:
        pg_session.rollback()
        print(f"[DB ERROR] handle_currency_tx tx_id={tx.id}: {exc}")
        return {
            "tx_data_id": tx.id,
            "chain_id": chain_id,
            "status": "failed",
            "detail": f"DB error: {exc!s}",
            "updated_at": get_utc_time(),
            "tx_hash": "",
        }


currency_contract_mapping = {
    "coins": {
        "prefix": "COINS",
        "chains": {
            "skale": {
                "contract_address": environ.get("COINS_SKALE_CONTRACT_ADDRESS"),
                "chain_id": int(environ.get("COINS_SKALE_CHAIN_ID")),
            },
            "core": {
                "contract_address": environ.get("COINS_CORE_CONTRACT_ADDRESS"),
                "chain_id": int(environ.get("COINS_CORE_CHAIN_ID")),
            },
            "pen": {
                "contract_address": environ.get("COINS_PEN_CONTRACT_ADDRESS"),
                "chain_id": int(environ.get("COINS_PEN_CHAIN_ID")),
            },
        },
        "function_map": {"claim": "claim", "spend": "spend"},
    },
    "karrots": {
        "prefix": "KARROTS",
        "chains": {
            "skale": {
                "contract_address": environ.get("KARROTS_SKALE_CONTRACT_ADDRESS"),
                "chain_id": int(environ.get("KARROTS_SKALE_CHAIN_ID")),
            },
            "core": {
                "contract_address": environ.get("KARROTS_CORE_CONTRACT_ADDRESS"),
                "chain_id": int(environ.get("KARROTS_CORE_CHAIN_ID")),
            },
            "pen": {
                "contract_address": environ.get("KARROTS_PEN_CONTRACT_ADDRESS"),
                "chain_id": int(environ.get("KARROTS_PEN_CHAIN_ID")),
            },
        },
        "function_map": {"claim": "claim", "spend": "spend"},
    },
}


def should_skip_chain(user, chain_id):
    if user.user_from != "automation":
        return False
    raw = environ.get("AUTOMATION_SUPPORTED_CHAIN_ID", "")
    allowed = {int(x) for x in raw.split(",") if x.strip().isdigit()}
    return chain_id not in allowed


def send_currencies():
    minter_address = Web3.to_checksum_address(environ.get("MINTER_ADDRESS"))
    minter_private_key = environ.get("MINTER_PRIVATE_KEY")

    try:
        pending_txns = db.session.query(OnChainCurrencyTxData).options(joinedload(OnChainCurrencyTxData.user)).filter(OnChainCurrencyTxData.status == "pending").order_by(OnChainCurrencyTxData.id).limit(10).all()
        # print("pending_txns ==> ", pending_txns)
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"[DB ERROR] While fetching currency pending txns: {e}")
        return

    if not pending_txns:
        return

    for tx in pending_txns:
        failed_chains = []
        currency = tx.currency_type
        config = currency_contract_mapping.get(currency)
        if not config:
            # print(f"Skipping unknown currency: {currency}")
            continue

        for chain_conf in config["chains"].values():
            chain_id = chain_conf["chain_id"]

            if should_skip_chain(tx.user, chain_id):
                # print(f"Skipping chain_id={chain_id} for automation user {tx.user.id}")
                continue

            try:
                log = db.session.query(OnChainCurrencyTxLog).filter_by(tx_data_id=tx.id, chain_id=chain_id).first()
                if not log:
                    log = OnChainCurrencyTxLog(tx_data_id=tx.id, chain_id=chain_id)
                    db.session.add(log)

                if log.status == "complete":
                    # print(f"Already completed on this chain: {chain_id}")
                    continue

                w3, contract, gas_price = get_web3_instance_with_contract("app/currency_contract_abi.json", chain_conf["contract_address"], chain_id)
                if not w3:
                    log.status = "failed"
                    log.detail = "Web3 connection issue"
                    log.updated_at = get_utc_time()
                    failed_chains.append(str(chain_id))
                    continue

                update = handle_currency_tx(tx, minter_address, minter_private_key, w3, contract, gas_price, chain_id)

                log.tx_hash = update.get("tx_hash")
                log.status = update.get("status")
                log.detail = update.get("detail")
                log.updated_at = get_utc_time()

                if log.status != "complete":
                    failed_chains.append(str(chain_id))

            except Exception as e:
                db.session.rollback()
                failed_chains.append(str(chain_id))
                print(f"[CHAIN ERROR] {currency} on {chain_id}: {e}")

        # Determine parent tx status after processing all chains
        try:
            all_logs = db.session.query(OnChainCurrencyTxLog).filter_by(tx_data_id=tx.id).all()
            if all_logs and all(log.status == "complete" for log in all_logs):
                tx.status = "complete"
                tx.detail = "All chains complete"
            else:
                tx.status = "partial"
                tx.detail = f"Failed/Pending chains: {', '.join(failed_chains)}"

            tx.updated_at = get_utc_time()
            db.session.commit()

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"[DB ERROR] While updating parent tx_id={tx.id}: {e}")

    db.session.remove()
    pg_session.remove()


def handle_kill_tx(w3, contract, gas_price, tx, minter_address, minter_private_key, chain_id):
    try:
        from_gunnies_user = tx.from_user
        to_gunnies_user = tx.to_user

        from_pg_user = pg_session.query(PgUser).filter((PgUser.email == from_gunnies_user.email) | (PgUser.username == from_gunnies_user.username)).first()
        to_pg_user = pg_session.query(PgUser).filter((PgUser.email == to_gunnies_user.email) | (PgUser.username == to_gunnies_user.username)).first()

        errors = []
        if not from_pg_user:
            errors.append("From user not found in PG")
        elif not from_pg_user.wallet or not from_pg_user.wallet.key:
            errors.append("From user wallet/key missing")

        if not to_pg_user:
            errors.append("To user not found in PG")
        elif not to_pg_user.wallet or not to_pg_user.wallet.key:
            errors.append("To user wallet/key missing")

        if errors:
            return {
                "tx_data_id": tx.id,
                "chain_id": chain_id,
                "status": "failed",
                "detail": "; ".join(errors),
                "updated_at": get_utc_time(),
                "tx_hash": "",
            }

        user_wallet = from_pg_user.wallet
        user_address = Web3.to_checksum_address(user_wallet.address)
        private_key = Account.decrypt(user_wallet.key, environ.get("WALLET_PASSWORD"))

        to_user_wallet = to_pg_user.wallet
        to_user_address = Web3.to_checksum_address(to_user_wallet.address)

        check_and_add_whitelist(w3, contract, gas_price, user_address, minter_address, minter_private_key)

        match_id = tx.match_id
        # count = tx.count
        nonce = w3.eth.get_transaction_count(user_address, "pending")

        # Build function call
        func_call = contract.functions.kill(match_id, to_user_address)

        # Estimate gas & check balance
        gas_estimate = func_call.estimate_gas({"from": user_address})
        estimated_cost_wei = gas_estimate * gas_price
        min_balance_required = estimated_cost_wei * 2

        user_balance = w3.eth.get_balance(user_address)
        # print(f"Receiver balance: {Web3.from_wei(user_balance, 'ether')}")
        # print(f"Required: {Web3.from_wei(min_balance_required, 'ether')}")

        if user_balance < min_balance_required:
            # print("Insufficient balance. Sending gas...")
            send_gas(
                w3,
                gas_price,
                user_address,
                min_balance_required,
                minter_address,
                minter_private_key,
            )
            # print("Gas transaction hash:", gas_tx)

        tx_hash = build_and_send_tx(
            w3,
            func_call,
            {"gasPrice": gas_price, "from": user_address, "nonce": nonce},
            private_key,
        )

        return {
            "tx_data_id": tx.id,
            "chain_id": chain_id,
            "status": "complete",
            "detail": "success",
            "updated_at": get_utc_time(),
            "tx_hash": tx_hash,
        }

    except Exception as exc:
        pg_session.rollback()
        print(f"[TX ERROR] handle_kill_tx tx_id={tx.id}: {exc}")
        return {
            "tx_data_id": tx.id,
            "chain_id": chain_id,
            "status": "failed",
            "detail": str(exc),
            "updated_at": get_utc_time(),
            "tx_hash": "",
        }

    except SQLAlchemyError as exc:
        pg_session.rollback()
        print(f"[DB ERROR] handle_kill_tx tx_id={tx.id}: {exc}")
        return {
            "tx_data_id": tx.id,
            "chain_id": chain_id,
            "status": "failed",
            "detail": f"DB error: {exc!s}",
            "updated_at": get_utc_time(),
            "tx_hash": "",
        }


kill_contract_mapping = {
    "killer": {
        "chains": {
            "skale": {
                "contract_address": environ.get("GUNNIES_KILLER_SKALE_CONTRACT_ADDRESS"),
                "chain_id": int(environ.get("GUNNIES_KILLER_SKALE_CHAIN_ID")),
            },
            "pen": {
                "contract_address": environ.get("GUNNIES_KILLER_PEN_CONTRACT_ADDRESS"),
                "chain_id": int(environ.get("GUNNIES_KILLER_PEN_CHAIN_ID")),
            },
        },
    },
}


def send_kill_count():
    minter_address = Web3.to_checksum_address(environ.get("MINTER_ADDRESS"))
    minter_private_key = environ.get("MINTER_PRIVATE_KEY")

    from_user_alias = aliased(GunniesUser)
    to_user_alias = aliased(GunniesUser)

    try:
        pending_txns = db.session.query(OnChainKillTxData).join(from_user_alias, OnChainKillTxData.from_user_id == from_user_alias.id).join(to_user_alias, OnChainKillTxData.to_user_id == to_user_alias.id).filter(OnChainKillTxData.status == "pending").order_by(OnChainKillTxData.id).limit(50).all()
        # print("pending_txns ==> ", pending_txns)
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"[DB ERROR] while fetching kill txns: {e}")
        return

    if not pending_txns:
        return

    for tx in pending_txns:
        failed_chains = []

        for chain_conf in kill_contract_mapping["killer"]["chains"].values():
            chain_id = chain_conf["chain_id"]
            try:
                log = db.session.query(OnChainKillTxLog).filter_by(tx_data_id=tx.id, chain_id=chain_id).first()
                if not log:
                    log = OnChainKillTxLog(tx_data_id=tx.id, chain_id=chain_id)
                    db.session.add(log)

                if log.status == "complete":
                    continue

                w3, contract, gas_price = get_web3_instance_with_contract("app/kill_contract_abi.json", chain_conf["contract_address"], chain_id)
                if not w3:
                    log.status = "failed"
                    log.detail = "Web3 connection issue"
                    log.updated_at = get_utc_time()
                    failed_chains.append(str(chain_id))
                    continue

                update = handle_kill_tx(w3, contract, gas_price, tx, minter_address, minter_private_key, chain_id)

                log.tx_hash = update.get("tx_hash")
                log.status = update.get("status")
                log.detail = update.get("detail")
                log.updated_at = get_utc_time()

                if log.status != "complete":
                    failed_chains.append(str(chain_id))

            except Exception as e:
                db.session.rollback()
                failed_chains.append(str(chain_id))
                print(f"[CHAIN ERROR] kill on {chain_id}: {e}")

        try:
            all_logs = db.session.query(OnChainKillTxLog).filter_by(tx_data_id=tx.id).all()
            if all_logs and all(log.status == "complete" for log in all_logs):
                tx.status = "complete"
                tx.detail = "All chains complete"
            else:
                tx.status = "partial"
                tx.detail = f"Failed/Pending chains: {', '.join(failed_chains)}"

            tx.updated_at = get_utc_time()
            db.session.commit()

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"[DB ERROR] while updating kill tx parent: {e}")

    db.session.remove()
    pg_session.remove()


def handle_total_kills(w3, contract, gas_price, user, total_kills, minter_address, minter_private_key):
    try:
        pg_user = pg_session.query(PgUser).filter((PgUser.email == user.email) | (PgUser.username == user.username)).first()

        if not pg_user or not pg_user.wallet or not pg_user.wallet.key:
            return {
                "user_id": user.id,
                "status": "failed",
                "detail": "User not found in PG" if not pg_user else "User wallet/key missing",
                "updated_at": get_utc_time(),
                "tx_hash": "",
                "total_kills": total_kills,
                "chain_id": w3.eth.chain_id,
            }

        user_wallet = pg_user.wallet
        user_address = Web3.to_checksum_address(user_wallet.address)
        private_key = Account.decrypt(user_wallet.key, environ.get("WALLET_PASSWORD"))

        check_and_add_whitelist(w3, contract, gas_price, user_address, minter_address, minter_private_key)

        nonce = w3.eth.get_transaction_count(user_address, "pending")

        # Build function call
        func_call = contract.functions.killWithCount(total_kills)

        # Estimate gas & check balance
        gas_estimate = func_call.estimate_gas({"from": user_address})
        estimated_cost_wei = gas_estimate * gas_price
        min_balance_required = estimated_cost_wei * 2

        user_balance = w3.eth.get_balance(user_address)
        # print(f"Receiver balance: {Web3.from_wei(user_balance, 'ether')}")
        # print(f"Required: {Web3.from_wei(min_balance_required, 'ether')}")

        if user_balance < min_balance_required:
            # print("Insufficient balance. Sending gas...")
            send_gas(
                w3,
                gas_price,
                user_address,
                min_balance_required,
                minter_address,
                minter_private_key,
            )
            # print("Gas transaction hash:", gas_tx)

        tx_hash = build_and_send_tx(
            w3,
            func_call,
            {"gasPrice": gas_price, "from": user_address, "nonce": nonce},
            private_key,
        )

        return {
            "user_id": user.id,
            "status": "complete",
            "detail": "success",
            "updated_at": get_utc_time(),
            "tx_hash": tx_hash,
            "total_kills": total_kills,
            "chain_id": w3.eth.chain_id,
        }

    except Exception as exc:
        pg_session.rollback()
        print(f"[TX ERROR] handle_total_kills user_id={user.id}: {exc}")
        return {
            "user_id": user.id,
            "status": "failed",
            "detail": str(exc),
            "updated_at": get_utc_time(),
            "tx_hash": "",
            "total_kills": total_kills,
            "chain_id": w3.eth.chain_id,
        }

    except SQLAlchemyError as exc:
        pg_session.rollback()
        print(f"[DB ERROR] handle_total_kills user_id={user.id}: {exc}")
        return {
            "user_id": user.id,
            "status": "failed",
            "detail": f"DB error: {exc!s}",
            "updated_at": get_utc_time(),
            "tx_hash": "",
            "total_kills": total_kills,
            "chain_id": w3.eth.chain_id,
        }


def send_total_kills():
    minter_address = Web3.to_checksum_address(environ.get("MINTER_ADDRESS"))
    minter_private_key = environ.get("MINTER_PRIVATE_KEY")

    contract_address = environ.get("GUNNIES_KILLER_CORE_CONTRACT_ADDRESS")
    contract_chain = int(environ.get("GUNNIES_KILLER_CORE_CHAIN_ID"))

    w3, contract, gas_price = get_web3_instance_with_contract("app/kill_contract_abi.json", contract_address, contract_chain)
    if not w3:
        # print("Web3 connection issue")
        return

    try:
        from_user_alias = aliased(GunniesUser)
        kills_by_user = db.session.query(OnChainKillTxData.from_user_id, func.sum(OnChainKillTxData.count).label("total_kills")).join(from_user_alias, OnChainKillTxData.from_user_id == from_user_alias.id).filter(OnChainKillTxData.status == "complete").group_by(OnChainKillTxData.from_user_id).all()
        # print("kills_by_user ==> ", kills_by_user)
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"[DB ERROR] fetching user kill counts: {e}")
        return

    if not kills_by_user:
        # print("No kills to process")
        return

    updates = []
    for user_id, total_kills in kills_by_user:
        gunnies_user = db.session.query(GunniesUser).get(user_id)
        if not gunnies_user:
            continue

        update = handle_total_kills(w3, contract, gas_price, gunnies_user, total_kills, minter_address, minter_private_key)
        log = OnChainKillSummaryLog(user_id=user_id, total_kills=total_kills, chain_id=contract_chain, tx_hash=update["tx_hash"], status=update["status"], detail=update["detail"])
        updates.append(log)

    try:
        if updates:
            db.session.bulk_save_objects(updates)
            db.session.commit()
            # print(f"Processed {len(updates)} users for killWithCount")
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"[DB ERROR] kill summary logs batch update failed: {e}")

    db.session.remove()
    pg_session.remove()


def get_pump_dist_list(pending_txn):
    tx_list = []
    for tx in pending_txn:
        try:
            gunnies_user = tx.user
            pg_user = pg_session.query(PgUser).filter((PgUser.email == gunnies_user.email) | (PgUser.username == gunnies_user.username)).first()

            if not pg_user:
                log_failed_tx(tx.id, "No matching PG user")
                continue

            if not pg_user.wallet:
                log_failed_tx(tx.id, "Internal Wallet missing")
                continue

            user_wallet = pg_user.wallet
            user_address = Web3.to_checksum_address(user_wallet.address)
            amount = Web3.to_wei(tx.reward_value, "ether")

            tx_list.append(
                {
                    "user_address": user_address,
                    "amount": amount,
                    "reward_id": tx.id,
                },
            )

        except SQLAlchemyError as exc:
            pg_session.rollback()
            print(f"[DB ERROR] While mapping Pumpkin tx user {tx.id}: {exc}")
            log_failed_tx(tx.id, f"DB error: {exc}")
            continue

        except Exception as exc:
            print(f"[ERROR] Unexpected error for Pumpkin tx {tx.id}: {exc}")
            log_failed_tx(tx.id, f"Unexpected error: {exc}")
            continue

    return tx_list


def log_failed_tx(tx_id, detail):
    try:
        db.session.query(ChestReward).filter_by(id=tx_id).update(
            {
                "status": "failed",
                "detail": detail,
                "tx_hash": "",
                "updated_at": get_utc_time(),
            },
        )
        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"[DB ERROR] Pumpkin tx failed for {tx_id}: {e}")


def get_sorted_rewards(tx_list):
    user_addresses = [x["user_address"] for x in tx_list]
    amount_for_airdrop = [x["amount"] for x in tx_list]
    reward_ids = [x["reward_id"] for x in tx_list]
    return user_addresses, amount_for_airdrop, reward_ids


def pumpkin_airdrop():
    minter_address = Web3.to_checksum_address(environ.get("MINTER_ADDRESS"))
    minter_private_key = environ.get("MINTER_PRIVATE_KEY")
    contract_address = environ.get("PUMPKIN_CONTRACT_ADDRESS")
    contract_chain = int(environ.get("PUMPKIN_CONTRACT_CHAIN_ID"))

    try:
        pending_txns = db.session.query(ChestReward).options(joinedload(ChestReward.user)).filter(ChestReward.reward_type == "pump", ChestReward.status == "pending").order_by(ChestReward.id).limit(150).all()
        # print("pending_txns ==> ", pending_txns)
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"[DB ERROR] while fetching pumpkin txns: {e}")
        return

    if not pending_txns:
        return

    mint_list = get_pump_dist_list(pending_txns)
    if not mint_list:
        return

    grouped_mint_list = [mint_list[i : i + 20] for i in range(0, len(mint_list), 20)]
    w3, contract, gas_price = get_web3_instance_with_contract("app/pumpkin_contract_abi.json", contract_address, contract_chain)
    if not w3:
        # print("Web3 connection issue")
        return

    for group in grouped_mint_list:
        try:
            user_addresses, amount_for_airdrop, reward_ids = get_sorted_rewards(group)
            nonce = w3.eth.get_transaction_count(minter_address, "pending")
            tx_hash = build_and_send_tx(
                w3,
                contract.functions.bulkMint(user_addresses, amount_for_airdrop),
                {"gasPrice": gas_price, "from": minter_address, "nonce": nonce},
                minter_private_key,
            )
            status, detail = "complete", "success"
        except Exception as exc:
            tx_hash, status, detail = "", "tx_fail", str(exc)

        update_obj = [
            {
                "id": reward_id,
                "tx_hash": tx_hash,
                "status": status,
                "detail": detail,
                "updated_at": get_utc_time(),
            }
            for reward_id in reward_ids
        ]

        try:
            if update_obj:
                db.session.bulk_update_mappings(ChestReward, update_obj)
                db.session.commit()

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"[DB ERROR] Pumpkin batch update failed: {e}")

    db.session.remove()
    pg_session.remove()


def extract_gcn_airdrop_data(pending_txns):
    tx_list = []
    for tx in pending_txns:
        user = tx.user
        tx_list.append(
            {
                "user_address": Web3.to_checksum_address(user.mm_address),
                "amount": tx.reward_value,
                "design_id": random.randint(1, 7),
                "reward_id": tx.id,
            },
        )

    # Slice into chunks of 20
    groups = [tx_list[i : i + 20] for i in range(0, len(tx_list), 20)]

    # Convert each grouped batch into sorted lists
    return [
        (
            [x["user_address"] for x in group],
            [x["design_id"] for x in group],
            [x["amount"] for x in group],
            [x["reward_id"] for x in group],
        )
        for group in groups
    ]


def gcn_shards_airdrop():
    minter_address = Web3.to_checksum_address(environ.get("MINTER_ADDRESS"))
    minter_private_key = environ.get("MINTER_PRIVATE_KEY")
    contract_address = environ.get("GCN_SHARDS_CONTRACT_ADDRESS")
    contract_chain = int(environ.get("GCN_SHARDS_CONTRACT_CHAIN_ID"))

    try:
        pending_txns = db.session.query(Reward).options(joinedload(Reward.user)).filter(Reward.reward_type == "gcn_shards", Reward.status == "pending").order_by(Reward.id).limit(150).all()
        # print("pending_txns ==> ", pending_txns)
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"[DB ERROR] while fetching GCN txns: {e}")
        return

    if not pending_txns:
        return

    grouped_batches = extract_gcn_airdrop_data(pending_txns)
    # print("Grouped Batches: ", grouped_batches)
    if not grouped_batches:
        return

    w3, contract, gas_price = get_web3_instance_with_contract("app/gcn_shards_contract_abi.json", contract_address, contract_chain)
    if not w3:
        # print("Web3 connection issue")
        return

    for user_addresses, design_ids, amounts, reward_ids in grouped_batches:
        try:
            nonce = w3.eth.get_transaction_count(minter_address, "pending")
            tx_hash = build_and_send_tx(
                w3,
                contract.functions.bulkMint(user_addresses, design_ids, amounts),
                {"gasPrice": gas_price, "from": minter_address, "nonce": nonce},
                minter_private_key,
            )
            status, detail = "complete", "success"
        except Exception as exc:
            tx_hash, status, detail = "", "tx_fail", str(exc)

        update_obj = [
            {
                "id": reward_id,
                "tx_hash": tx_hash,
                "status": status,
                "detail": detail,
                "updated_at": get_utc_time(),
            }
            for reward_id in reward_ids
        ]

        try:
            if update_obj:
                db.session.bulk_update_mappings(Reward, update_obj)
                db.session.commit()

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"[DB ERROR] GCN batch update failed: {e}")

    db.session.remove()
    # print("Finish")
