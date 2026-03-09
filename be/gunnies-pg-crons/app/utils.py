import json
from datetime import datetime, timezone
from os import environ

from web3 import HTTPProvider, Web3
from web3.middleware import geth_poa_middleware


def get_utc_time():
    return datetime.now(timezone.utc)


def get_chain_details(chain_id):
    chain_list = [
        {
            "chain_name": "pen_testnet",
            "chain_id": 555555,
            "rpc_url": environ.get("NODE_RPC_URL_PEN_TESTNET"),
        },
        {
            "chain_name": "pen",
            "chain_id": 3344,
            "rpc_url": environ.get("NODE_RPC_URL_PEN"),
        },
        {
            "chain_name": "skale_nebula",
            "chain_id": 1482601649,
            "rpc_url": environ.get("NODE_RPC_URL_SKALE_NEBULA"),
        },
        {
            "chain_name": "core",
            "chain_id": 1116,
            "rpc_url": environ.get("NODE_RPC_URL_CORE"),
        },
    ]

    return next((item for item in chain_list if item["chain_id"] == chain_id), {})


def get_web3_instance_with_contract(abi_file_name, contract_address, chain_id):
    chain_details = get_chain_details(chain_id)
    if not chain_details:
        return (None, None, None)

    node_provider = chain_details["rpc_url"]
    w3_instance = Web3(HTTPProvider(node_provider))
    w3_instance.middleware_onion.inject(geth_poa_middleware, layer=0)

    if not w3_instance.is_connected():
        # print("connection failed....")
        return (None, None, None)

    gas_price = Web3.to_wei(1e-10, "gwei") if chain_id in (5555, 3131) else w3_instance.eth.gas_price
    with open(abi_file_name, encoding="utf-8") as f:
        abi = json.load(f)

    contract_checksum = Web3.to_checksum_address(contract_address)
    contract = w3_instance.eth.contract(abi=abi, address=contract_checksum)

    return (w3_instance, contract, gas_price)
