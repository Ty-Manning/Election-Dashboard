from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ArticleBase(BaseModel):
    title: str
    url: str
    content: Optional[str] = None
    published_date: Optional[datetime] = None

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    bias: str
    removed: bool

    class Config:
        orm_mode = True

class StateBase(BaseModel):
    name: str
    electoral_votes: int
    expected_vote: str

# backend/app/schemas.py

from pydantic import BaseModel
from typing import Optional

class StateUpdate(BaseModel):
    expected_vote: str

class StateCreate(StateBase):
    pass

class State(StateBase):
    id: int

    class Config:
        from_attributes = True
