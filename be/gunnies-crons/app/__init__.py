from datetime import datetime, timezone
from os import environ

from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

load_dotenv(override=True)

job_defaults = {
    "coalesce": True,
    "max_instances": 1,
    "misfire_grace_time": 600,
}

db = SQLAlchemy()

# ----------Import schedulers functions from files----------
from app.nft_sync import kaboom_nft_sync
from app.rewards import send_chest_rewards


# ----------created app functionality----------
def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("SQLALCHEMY_DATABASE_URI")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    db.app = app
    app.app_context().push()
    # db.create_all()

    send_chest_rewards_scheduler = BackgroundScheduler(job_defaults=job_defaults)
    send_chest_rewards_scheduler.add_job(send_chest_rewards, trigger="interval", minutes=10, next_run_time=datetime.now(timezone.utc), jitter=200)
    send_chest_rewards_scheduler.start()

    kaboom_nft_sync_scheduler = BackgroundScheduler(job_defaults=job_defaults)
    kaboom_nft_sync_scheduler.add_job(kaboom_nft_sync, args=["skale"], trigger="interval", minutes=3, next_run_time=datetime.now(timezone.utc), jitter=100)
    kaboom_nft_sync_scheduler.add_job(kaboom_nft_sync, args=["core"], trigger="interval", minutes=4, next_run_time=datetime.now(timezone.utc), jitter=100)
    kaboom_nft_sync_scheduler.add_job(kaboom_nft_sync, args=["pen"], trigger="interval", minutes=2, next_run_time=datetime.now(timezone.utc), jitter=100)
    kaboom_nft_sync_scheduler.start()

    return app


myapp = create_app()
