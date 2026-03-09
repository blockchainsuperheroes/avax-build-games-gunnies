from datetime import datetime, timezone
from os import environ

from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

load_dotenv(override=True)

job_defaults = {
    "coalesce": True,
    "max_instances": 1,
    "misfire_grace_time": 600,
}

db = SQLAlchemy()

pg_engine = create_engine(environ.get("SQLALCHEMY_DATABASE_URI_PG"))
pg_session = scoped_session(sessionmaker(bind=pg_engine))

automation_engine = create_engine(environ.get("SQLALCHEMY_DATABASE_AUTOMATION"))
automation_session = scoped_session(sessionmaker(bind=automation_engine))

# ----------Import schedulers functions from files----------
from app.onchain import gcn_shards_airdrop, pumpkin_airdrop, send_currencies, send_kill_count, send_total_kills


# ----------created app functionality----------
def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("SQLALCHEMY_DATABASE_URI_GUNNIES")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    db.app = app
    app.app_context().push()
    # db.create_all()

    # send_currencies()
    # send_kill_count()
    # send_total_kills()
    # pumpkin_airdrop()
    # gcn_shards_airdrop()

    send_currencies_scheduler = BackgroundScheduler(job_defaults=job_defaults)
    send_currencies_scheduler.add_job(send_currencies, trigger="interval", minutes=10, next_run_time=datetime.now(timezone.utc), jitter=200)
    send_currencies_scheduler.start()

    send_kill_count_scheduler = BackgroundScheduler(job_defaults=job_defaults)
    send_kill_count_scheduler.add_job(send_kill_count, trigger="interval", minutes=15, next_run_time=datetime.now(timezone.utc), jitter=100)
    send_kill_count_scheduler.start()

    send_total_kills_scheduler = BackgroundScheduler(job_defaults=job_defaults)
    send_total_kills_scheduler.add_job(send_total_kills, trigger="interval", hours=24, next_run_time=datetime.now(timezone.utc), jitter=300)
    send_total_kills_scheduler.start()

    pumpkin_airdrop_scheduler = BackgroundScheduler(job_defaults=job_defaults)
    pumpkin_airdrop_scheduler.add_job(pumpkin_airdrop, trigger="interval", minutes=20, next_run_time=datetime.now(timezone.utc), jitter=400)
    pumpkin_airdrop_scheduler.start()

    gcn_shards_airdrop_scheduler = BackgroundScheduler(job_defaults=job_defaults)
    gcn_shards_airdrop_scheduler.add_job(gcn_shards_airdrop, trigger="interval", minutes=5, next_run_time=datetime.now(timezone.utc), jitter=500)
    gcn_shards_airdrop_scheduler.start()

    return app


myapp = create_app()
