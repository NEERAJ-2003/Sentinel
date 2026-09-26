from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Run(Base):
    __tablename__ = "runs"

    id = Column(String, primary_key=True, index=True)
    bob_task_id = Column(String, unique=True, index=True, nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="active", nullable=False)  # active, completed, failed

    events = relationship("Event", back_populates="run", cascade="all, delete-orphan", order_by="Event.id")
    verification_results = relationship("VerificationResult", back_populates="run", cascade="all, delete-orphan", order_by="desc(VerificationResult.verified_at)")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    run_id = Column(String, ForeignKey("runs.id"), nullable=False, index=True)
    event_type = Column(String, nullable=False)  # file_edit, command_run, file_create, file_delete, tool_call, commit
    action = Column(String, nullable=False)      # modified, created, deleted, executed, etc.
    target = Column(String, nullable=False)      # file path, command string, target entity
    metadata_json = Column(JSON, nullable=True)  # additional context, diffs, command flags
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    previous_hash = Column(String(64), nullable=False)
    event_hash = Column(String(64), nullable=False)
    risk_level = Column(String, default="LOW", nullable=False)  # LOW, MEDIUM, HIGH

    run = relationship("Run", back_populates="events")
    approval = relationship("Approval", back_populates="event", uselist=False, cascade="all, delete-orphan")

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), unique=True, nullable=False)
    decision = Column(String, nullable=False)    # APPROVED, DENIED
    approved_by = Column(String, nullable=False) # e.g. human reviewer, admin, security-team
    reason = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    event = relationship("Event", back_populates="approval")

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    run_id = Column(String, ForeignKey("runs.id"), nullable=False, index=True)
    verified = Column(Boolean, nullable=False)
    failed_event_id = Column(Integer, nullable=True)
    verified_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    run = relationship("Run", back_populates="verification_results")
