from datetime import datetime, timezone

from sqlalchemy import BigInteger, Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app import db


class ScriptStates(db.Model):
    __tablename__ = "script_states_python"

    id = Column(BigInteger, primary_key=True)
    name = Column(String(200))
    last_ran = Column(DateTime(True))


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
    steam_id = Column(String(100), nullable=True)
    user_from = Column(String(20), nullable=True)
    epic_id = Column(String(100), nullable=True)
    metamask_bind = Column(Boolean, nullable=True)

    is_deleted = Column(Boolean, nullable=True, default=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    onchain_currency_tx_data = relationship("OnChainCurrencyTxData", back_populates="user")
    onchain_kill_from = relationship("OnChainKillTxData", back_populates="from_user", foreign_keys="OnChainKillTxData.from_user_id")
    onchain_kill_to = relationship("OnChainKillTxData", back_populates="to_user", foreign_keys="OnChainKillTxData.to_user_id")
    chest_rewards = relationship("ChestReward", back_populates="user")
    rewards = relationship("Reward", back_populates="user")


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
    logs = relationship("OnChainCurrencyTxLog", back_populates="tx_data")


class OnChainCurrencyTxLog(db.Model):
    __tablename__ = "onchain_currency_tx_log"

    id = Column(BigInteger, primary_key=True)
    tx_data_id = Column(BigInteger, ForeignKey("onchain_currency_tx_data.id"), nullable=False)
    chain_id = Column(BigInteger, nullable=False)
    tx_hash = Column(String(200), nullable=True, default="")
    status = Column(String(20), nullable=False, default="pending")
    detail = Column(Text, nullable=True, default="")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    tx_data = relationship("OnChainCurrencyTxData", back_populates="logs")


class OnChainKillTxData(db.Model):
    __tablename__ = "onchain_kill_tx_data"

    id = Column(BigInteger, primary_key=True)
    from_user_id = Column(BigInteger, ForeignKey("user.id"), nullable=False)
    to_user_id = Column(BigInteger, ForeignKey("user.id"), nullable=False)

    match_id = Column(String(200), nullable=True)
    count = Column(Integer, default=1)
    status = Column(String(20), nullable=False)
    detail = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    from_user = relationship("User", back_populates="onchain_kill_from", foreign_keys=[from_user_id])
    to_user = relationship("User", back_populates="onchain_kill_to", foreign_keys=[to_user_id])
    logs = relationship("OnChainKillTxLog", back_populates="tx_data")


class OnChainKillTxLog(db.Model):
    __tablename__ = "onchain_kill_tx_log"

    id = Column(BigInteger, primary_key=True)
    tx_data_id = Column(BigInteger, ForeignKey("onchain_kill_tx_data.id"), nullable=False)
    chain_id = Column(BigInteger, nullable=False)
    tx_hash = Column(String(200), nullable=True, default="")
    status = Column(String(20), nullable=False, default="pending")
    detail = Column(Text, nullable=True, default="")

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    tx_data = relationship("OnChainKillTxData", back_populates="logs")


class OnChainKillSummaryLog(db.Model):
    __tablename__ = "onchain_kill_summary_log"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("user.id"), nullable=False)
    total_kills = Column(Integer, nullable=False)
    chain_id = Column(BigInteger, nullable=False)
    tx_hash = Column(String(200), nullable=True)
    status = Column(String(20), nullable=False, default="pending")
    detail = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User")


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


class Reward(db.Model):
    __tablename__ = "rewards"

    id = Column(BigInteger, primary_key=True)
    reward_type = Column(String(50))
    reward_from = Column(String(50))
    reward_value = Column(Integer)
    tx_hash = Column(String(200), default="")
    status = Column(String(20))
    detail = Column(Text, default="")
    created_at = Column(DateTime(True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user_id = Column(ForeignKey("user.id", deferrable=True, initially="DEFERRED"), index=True)
    user = relationship("User", back_populates="rewards")
