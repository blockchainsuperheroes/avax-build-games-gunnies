from datetime import datetime, timezone
from os import environ

from web3 import HTTPProvider, Web3
from web3.middleware import geth_poa_middleware

from app import db
from app.models import KaboomTxHistory, NFTSyncStates, User
from app.utils import get_chain_details, get_contract_start_block_web3

from .lootlocker import LootLockerService


def get_chain_config(chain_name):
    if chain_name == "skale":
        return (
            int(environ.get("KABOOM_NFT_CHAIN_ID_SKALE")),
            environ.get("KABOOM_NFT_CONTRACT_SKALE"),
            "kaboom_nft_sync_skale",
        )
    if chain_name == "core":
        return (
            int(environ.get("KABOOM_NFT_CHAIN_ID_CORE")),
            environ.get("KABOOM_NFT_CONTRACT_CORE"),
            "kaboom_nft_sync_core",
        )
    if chain_name == "pen":
        return (
            int(environ.get("KABOOM_NFT_CHAIN_ID_PEN")),
            environ.get("KABOOM_NFT_CONTRACT_PEN"),
            "kaboom_nft_sync_pen",
        )
    # print("Invalid chain name provided")
    return None, None, None


def kaboom_nft_sync(chain_name):
    chain_id, contract_address, sync_name = get_chain_config(chain_name)
    # print(chain_id, contract_address, sync_name)
    if not chain_id or not contract_address:
        return

    chain_details = get_chain_details(chain_id)
    if not chain_details:
        # print("Chain details not found")
        return

    node_rpc_url = chain_details["rpc_url"]

    if not node_rpc_url:
        # print("Contract not found or Chain not supported")
        return

    # print("started....")
    w3_instance = Web3(HTTPProvider(node_rpc_url))
    w3_instance.middleware_onion.inject(geth_poa_middleware, layer=0)

    if not w3_instance.is_connected():
        # print("connection failed....")
        return

    contract_address = Web3.to_checksum_address(contract_address)

    lastblock_obj = NFTSyncStates.query.filter_by(name=sync_name).first()
    if not lastblock_obj:
        lastblock_obj = NFTSyncStates(
            name=sync_name,
            block=0,
            last_ran=datetime.now(timezone.utc),
        )
        db.session.add(lastblock_obj)
        db.session.commit()

    start_block = lastblock_obj.block
    if start_block in (0, None):
        start_block = get_contract_start_block_web3(w3_instance, contract_address)
        if not start_block:
            # print("Start Block not found....")
            return

    end_block = w3_instance.eth.get_block("latest")["number"]
    if not end_block:
        return

    if (end_block - start_block) > 999:
        end_block = start_block + 999

    # print(start_block, end_block)

    if start_block >= end_block:
        # print("No blocks to fetch")
        return

    logs = w3_instance.eth.get_logs(
        {
            "fromBlock": start_block,
            "toBlock": end_block,
            "address": contract_address,
            "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
        },
    )

    fetching_block = end_block

    for event in logs:
        process_nft_event(event, w3_instance, chain_id, contract_address)

    lastblock_obj.block = fetching_block
    lastblock_obj.last_ran = datetime.now(timezone.utc)

    db.session.add(lastblock_obj)
    db.session.commit()

    # print("Finish")


def process_nft_event(event, w3_instance, chain_id, contract_address):
    topics = event["topics"]
    token_id = Web3.to_int(topics[3])
    sender = Web3.to_checksum_address("0x" + topics[1].hex()[-40:]).lower()
    receiver = Web3.to_checksum_address("0x" + topics[2].hex()[-40:]).lower()
    tx_hash = Web3.to_hex(event["transactionHash"])

    # print("token_id ==> ", token_id)
    # print("sender ==> ", sender)
    # print("receiver ==> ", receiver)
    # print("tx_hash ===>", tx_hash)
    # print("block_height ===>", event["blockNumber"])

    timestamp = w3_instance.eth.get_block(event["blockNumber"]).timestamp
    block_signed_at = datetime.fromtimestamp(timestamp)
    # print("block_signed_at ===>", block_signed_at)

    user = User.query.filter_by(mm_address=receiver).first()
    if not user:
        status = False
        detail = "User not found"
    else:
        try:
            player_id = user.lootlocker_player_id
            trigger_keys = ["gunniesgang_starter_pack01"]
            ll = LootLockerService()
            status, detail = ll.send_trigger(player_id, trigger_keys)
        except Exception as exc:
            status = False
            detail = str(exc)

    db_log = KaboomTxHistory(
        chain_id=chain_id,
        contract_address=contract_address,
        token_id=token_id,
        sender=sender,
        receiver=receiver,
        tx_hash=tx_hash,
        reward_status=status,
        reward_details=str(detail),
        created_at=block_signed_at,
    )

    db.session.add(db_log)
    db.session.commit()
