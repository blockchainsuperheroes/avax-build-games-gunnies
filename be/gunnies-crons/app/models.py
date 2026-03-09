from datetime import datetime, timezone

from sqlalchemy import BigInteger, Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app import db


class ScriptStates(db.Model):
    __tablename__ = "script_states_python"

    id = Column(BigInteger, primary_key=True)
    name = Column(String(200))
    last_ran = Column(DateTime(True))


class LootLockerServerToken(db.Model):
    __tablename__ = "lootlocker_server_token"

    id = Column(BigInteger, primary_key=True)
    token = Column(String(255), nullable=False)
    expiry_time = Column(DateTime(True), nullable=True)

    class Meta:
        db_table = "lootlocker_server_token"


class LootLockerUserToken(db.Model):
    __tablename__ = "lootlocker_user_token"

    id = Column(BigInteger, primary_key=True)
    token = Column(String(255), nullable=False)
    created_at = Column(DateTime(True), nullable=True)
    updated_at = Column(DateTime(True), nullable=True)

    user_id = Column(ForeignKey("user.id", deferrable=True, initially="DEFERRED"), index=True)
    user = relationship("User", back_populates="lootlocker_token")

    class Meta:
        db_table = "lootlocker_user_token"


class User(db.Model):
    __tablename__ = "user"

    id = Column(BigInteger, primary_key=True)
    email = Column(String(50), nullable=False)
    username = Column(String(50), nullable=False)
    mm_address = Column(String(200), nullable=False)
    lootlocker_player_id = Column(Integer, nullable=True)
    lootlocker_wallet_id = Column(String(100), nullable=False)
    lootlocker_player_ulid = Column(String(50), nullable=False)
    stripe_customer_id = Column(String(100), nullable=False)

    is_deleted = Column(Boolean, nullable=True, default=False)
    deleted_at = Column(DateTime(True), nullable=True)

    created_at = Column(DateTime(True), nullable=True)
    updated_at = Column(DateTime(True), nullable=True)

    chest_rewards = relationship("ChestReward", back_populates="user")
    lootlocker_token = relationship("LootLockerUserToken", back_populates="user")
    onchain_currency_tx_data = relationship("OnChainCurrencyTxData", back_populates="user")


class ChestReward(db.Model):
    __tablename__ = "chest_rewards"

    id = Column(BigInteger, primary_key=True)
    reward_type = Column(String(50))
    reward_value = Column(Integer)
    tx_hash = Column(String(200), default="")
    status = Column(String(20))
    detail = Column(Text, default="")
    chest_type = Column(String(50))
    reward_from = Column(String(50))
    created_at = Column(DateTime(True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user_id = Column(ForeignKey("user.id", deferrable=True, initially="DEFERRED"), index=True)
    user = relationship("User", back_populates="chest_rewards")


class KaboomTxHistory(db.Model):
    __tablename__ = "kaboom_tx_history"

    id = Column(BigInteger, primary_key=True)
    chain_id = Column(BigInteger)
    contract_address = Column(String(100))
    token_id = Column(String(100))
    sender = Column(String(200))
    receiver = Column(String(200))
    tx_hash = Column(String(200))
    reward_status = Column(Boolean, nullable=True, default=False)
    reward_details = Column(Text, nullable=True, default="")
    created_at = Column(DateTime(True))


class NFTSyncStates(db.Model):
    __tablename__ = "nft_sync_states"

    id = Column(BigInteger, primary_key=True)
    name = Column(String(200))
    block = Column(BigInteger)
    last_ran = Column(DateTime(True))


class OnChainCurrencyTxData(db.Model):
    __tablename__ = "onchain_currency_tx_data"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("user.id"), nullable=False)

    currency_type = Column(String(20), nullable=True)
    tx_type = Column(String(20), nullable=True)
    amount = Column(Float, default=0)
    status = Column(String(20), nullable=False, default="pending")
    detail = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="onchain_currency_tx_data")
