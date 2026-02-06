from backend.app.services.db import get_db


def _serialize(doc: dict) -> dict:
    if not doc:
        return doc
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


class UserRepo:
    @staticmethod
    async def create(user: dict):
        db = get_db()
        return await db.users.insert_one(user)

    @staticmethod
    async def find_by_email(email: str):
        db = get_db()
        return _serialize(await db.users.find_one({"email": email}))

    @staticmethod
    async def set_reset_token(email: str, token_hash: str, expires_at: str):
        db = get_db()
        return await db.users.update_one(
            {"email": email},
            {"$set": {"reset_token_hash": token_hash, "reset_token_expires_at": expires_at}},
        )

    @staticmethod
    async def find_by_reset_token(token_hash: str):
        db = get_db()
        return _serialize(await db.users.find_one({"reset_token_hash": token_hash}))

    @staticmethod
    async def clear_reset_token(email: str):
        db = get_db()
        return await db.users.update_one(
            {"email": email},
            {"$unset": {"reset_token_hash": "", "reset_token_expires_at": ""}},
        )

    @staticmethod
    async def update_password(email: str, password_hash: str):
        db = get_db()
        return await db.users.update_one(
            {"email": email},
            {"$set": {"password_hash": password_hash}},
        )

    @staticmethod
    async def set_refresh_token(email: str, token_hash: str, expires_at: str):
        db = get_db()
        return await db.users.update_one(
            {"email": email},
            {"$set": {"refresh_token_hash": token_hash, "refresh_token_expires_at": expires_at}},
        )

    @staticmethod
    async def clear_refresh_token(email: str):
        db = get_db()
        return await db.users.update_one(
            {"email": email},
            {"$unset": {"refresh_token_hash": "", "refresh_token_expires_at": ""}},
        )


class CBCReportRepo:
    @staticmethod
    async def create(report: dict):
        db = get_db()
        return await db.cbc_reports.insert_one(report)

    @staticmethod
    async def list_by_user(email: str, limit: int = 10):
        db = get_db()
        cursor = db.cbc_reports.find({"user_email": email}).sort("created_at", -1).limit(limit)
        items = await cursor.to_list(length=limit)
        return [_serialize(item) for item in items]


class SymptomRepo:
    @staticmethod
    async def create(entry: dict):
        db = get_db()
        return await db.symptoms.insert_one(entry)

    @staticmethod
    async def list_by_user(email: str, limit: int = 10):
        db = get_db()
        cursor = db.symptoms.find({"user_email": email}).sort("created_at", -1).limit(limit)
        items = await cursor.to_list(length=limit)
        return [_serialize(item) for item in items]
