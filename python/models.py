from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Employee(Base):
    __tablename__ = "employee"
    id = Column(Integer, primary_key=True, index=True)
    mIdCard = Column(Integer, unique=True, index=True)

    # Relationship to PunchData
    punches = relationship("PunchData", back_populates="employee")


class MachineInOutGrid(Base):
    __tablename__ = "machineInOutGrid"
    id = Column(Integer, primary_key=True, index=True)
    machineIP = Column(String(50), unique=True, index=True)
    machineTypeOne = Column(String(50))

    # Relationship to PunchData
    punches = relationship("PunchData", back_populates="machine_grid")


class PunchData(Base):
    __tablename__ = "punchData"

    id = Column(Integer, primary_key=True, index=True)
    mIdCard = Column(Integer, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    machineIP = Column(String(50))
    machineType = Column(String(50))

    # Foreign keys
    employeeId = Column(Integer, ForeignKey("employee.id"), nullable=True)
    machineInOutGridId = Column(Integer, ForeignKey("machineInOutGrid.id"), nullable=True)

    # Relationships
    employee = relationship("Employee", back_populates="punches")
    machine_grid = relationship("MachineInOutGrid", back_populates="punches")

    __table_args__ = (
        UniqueConstraint("mIdCard", "timestamp", name="unique_punch_per_time"),
    )
