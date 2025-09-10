from pydantic import BaseModel


class LikeCreate(BaseModel):
    event_id: int

class LikeResponse(BaseModel):
    event_id: int
    total_like: int
    liked_by_user: bool = False


    class Config:
        orm_mode = True