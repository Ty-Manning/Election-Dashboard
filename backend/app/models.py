from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Boolean
from .database import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), unique=True, nullable=False)
    url = Column(String(2083), nullable=False)
    content = Column(Text)
    published_date = Column(DateTime)
    bias = Column(Enum("left", "neutral", "right"), default="neutral")
    removed = Column(Boolean, default=False)

class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    electoral_votes = Column(Integer, nullable=False)
    expected_vote = Column(Enum("Harris", "Trump", "Neutral"), default="Neutral")
