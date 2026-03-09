from sqlalchemy import JSON, BigInteger, Column, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class UserWallet(Base):
    __tablename__ = "wallets"

    id = Column(BigInteger, primary_key=True)
    address = Column(String(200))
    key = Column(JSON)
