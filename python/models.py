from sqlalchemy import Column, Integer, DateTime
from database import Base

class PythonPunchData(Base):
    __tablename__ = "PythonPunchData"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False)
    mIdCard = Column(Integer, nullable=False)
