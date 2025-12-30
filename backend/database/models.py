from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=func.now())

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True) # specialized ID like NEET_BIO_001
    topic = Column(String)
    difficulty = Column(Integer)
    text = Column(String)
    options = Column(JSON) # List of strings
    correct = Column(String)
    misconception = Column(String)
    error_type = Column(String)

class LearnerState(Base):
    __tablename__ = "learner_state"
    user_id = Column(Integer, primary_key=True) # Foreign key to user in real app
    topic_mastery = Column(JSON) # { "Topic": 0.5 }
    confidence_avg = Column(Float)
    error_pattern = Column(JSON)
    error_pattern = Column(JSON)
    last_updated = Column(DateTime, onupdate=func.now())

class Mistake(Base):
    __tablename__ = "mistakes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # Foreign key logic omitted for prototype
    question_id = Column(String)
    topic = Column(String)
    question_text = Column(String)
    user_answer = Column(String)
    correct_answer = Column(String)
    timestamp = Column(DateTime, default=func.now())
