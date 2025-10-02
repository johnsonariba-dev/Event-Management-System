from datetime import datetime
from pydantic import BaseModel

# ---------------- Notification Schemas ----------------
class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationCreate(NotificationBase):
    user_id: int
    event_id: int

class NotificationOut(NotificationBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# ---------------- Update Schemas ----------------
class UpdateBase(BaseModel):
    message: str

class UpdateCreate(UpdateBase):
    event_id: int

class UpdateOut(UpdateBase):
    id: int
    event_id: int
    created_at: datetime | None = None

    class Config:
        from_attributes = True
