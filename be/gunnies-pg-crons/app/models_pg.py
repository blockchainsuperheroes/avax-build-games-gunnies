from sqlalchemy import JSON, BigInteger, Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "user"

    id = Column(BigInteger, primary_key=True)
    increment_id = Column(BigInteger, nullable=False)
    email = Column(String(200), nullable=False)
    password = Column(String(200), nullable=False)
    mm_address = Column(String(200), nullable=False)
    api_token = Column(Text, nullable=False, default="")
    username = Column(String(200), nullable=False)
    user_avatar = Column(Integer, nullable=True)

    algorand_address = Column(String(200), nullable=False, default="")
    multiversx_address = Column(String(200), nullable=False, default="")

    mfa_secret = Column(String(100), nullable=False, default="")
    mfa_enabled = Column(Boolean, default=False)
    starter_bundle_status = Column(Integer, nullable=False, default=1)
    metamask_bind = Column(Boolean, default=False)

    verified = Column(Boolean, default=False)
    email_validated_at = Column(DateTime(True), nullable=True)

    user_from = Column(String(200), nullable=False, default="pentagon")

    created_at = Column(DateTime(True), nullable=True)
    updated_at = Column(DateTime(True), nullable=True)

    wallet = relationship("UserWallet", back_populates="user", uselist=False)


class UserWallet(Base):
    __tablename__ = "user_wallet"

    id = Column(BigInteger, primary_key=True)
    address = Column(String(200))
    balance = Column(Float(), default=0)
    key = Column(JSON)

    user_id = Column(ForeignKey("user.id", deferrable=True, initially="DEFERRED"), index=True)
    user = relationship("User", back_populates="wallet")
