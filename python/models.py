from sqlalchemy import Column, Integer, DateTime,String,ForeignKey
from database import Base

class PythonPunchData(Base):
    __tablename__ = "PythonPunchData"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime,index=True, nullable=False)
    mIdCard = Column(Integer,index=True, nullable=False)
    machineIP= Column(String, nullable=False)
    machineInOutGridId = Column(Integer, ForeignKey("MachineInOutGrid.id"), nullable=True)
    machineType = Column(String, nullable=True)
    employeeId = Column(Integer, ForeignKey("Employee.id"), nullable=True)

class MachineInOutGrid(Base):
    __tablename__ = "MachineInOutGrid"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    machineIp = Column(String, unique=True, nullable=False)
    machineTypeOne = Column(String, nullable=True)

class Employee(Base):
    __tablename__ = "Employee"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    mIdCard = Column(Integer, nullable=False)

