import csv
import random

from app import db, pg_session
from app.models import User as GunniesUser
from app.models_pg import User as PGUser

gunnies_session = db.session


def copy_mm_bind():
    # 1) Load Gunnies users (only email + id)
    gunnies_users = gunnies_session.query(GunniesUser.id, GunniesUser.email).all()
    print(f"Gunnies users: {len(gunnies_users)}")

    # Build email list
    emails = [u.email.lower() for u in gunnies_users if u.email]

    # 2) Fetch matching PG users only, load only needed columns
    pg_users = pg_session.query(PGUser.email, PGUser.metamask_bind, PGUser.mm_address).filter(PGUser.email.in_(emails)).all()
    print(f"PG matched users: {len(pg_users)}")

    # Build map: email → (metamask_bind, mm_address)
    pg_map = {
        u.email.lower(): {
            "metamask_bind": u.metamask_bind,
            "mm_address": u.mm_address,
        }
        for u in pg_users
    }

    # 3) Prepare bulk update list
    updates = 0
    to_update = []

    for g_id, g_email in gunnies_users:
        if not g_email:
            continue

        key = g_email.lower()
        if key not in pg_map:
            continue

        data = pg_map[key]

        to_update.append(
            {
                "id": g_id,
                "metamask_bind": data["metamask_bind"],
                "mm_address": data["mm_address"],
            },
        )
        updates += 1

    if not updates:
        print("Nothing to update.")
        return

    # 4) Bulk update
    gunnies_session.bulk_update_mappings(GunniesUser, to_update)
    gunnies_session.commit()

    print(f"Updated {updates} users (mm_address + metamask_bind).")


def load_usernames():
    """Load and shuffle usernames from CSV"""
    usernames: list[str] = []
    with open("app/realistic_two_word_usernames_100k.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            username = row.get("username")
            if username:
                usernames.append(username.strip())
    random.shuffle(usernames)
    return usernames


def rename_gunnies_usernames():
    print("📥 Loading CSV usernames...")
    csv_usernames = load_usernames()

    print("📦 Loading existing usernames...")
    existing_usernames = {u for (u,) in db.session.query(GunniesUser.username).all()}

    available = [u for u in csv_usernames if u not in existing_usernames]

    print(f"✅ Available usernames: {len(available)}")

    print("👤 Fetching target user IDs...")
    user_ids = db.session.query(GunniesUser.id).filter(GunniesUser.user_from == "automation", GunniesUser.id < 19584).order_by(GunniesUser.id.desc()).limit(20000).all()
    user_ids = [u.id for u in user_ids]

    if len(available) < len(user_ids):
        print("❌ Not enough usernames in CSV")
        return

    print(f"🔄 Total users to update: {len(user_ids)}")

    updated = 0

    for i in range(0, len(user_ids), 1000):
        batch_ids = user_ids[i : i + 1000]
        batch_usernames = available[i : i + len(batch_ids)]

        mappings = [{"id": batch_ids[j], "username": batch_usernames[j]} for j in range(len(batch_ids))]

        db.session.bulk_update_mappings(GunniesUser, mappings)
        db.session.commit()

        updated += len(batch_ids)
        print(f"✅ Updated {updated}/{len(user_ids)}")

    print("🎉 All users renamed successfully")


def rename_gunnies_web3_usernames():
    print("👤 Fetching target user IDs...")
    users = db.session.query(GunniesUser.id, GunniesUser.lootlocker_player_id).filter(GunniesUser.username == "").order_by(GunniesUser.id.desc()).all()
    print(f"Found {len(users)} users to rename")

    updated = 0
    mappings = []
    for user in users:
        username = f"user{user.lootlocker_player_id}"
        mappings.append({"id": user.id, "username": username})
        updated += 1

    db.session.bulk_update_mappings(GunniesUser, mappings)
    db.session.commit()

    print(f"✅ Updated {updated}/{len(users)}")
    print("🎉 All users renamed successfully")
