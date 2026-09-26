from typing import Optional, Any, List, Dict
from datetime import datetime
from pydantic import BaseModel, Field

class LogEventRequest(BaseModel):
    run_id: str = Field(..., description="Unique ID for this agent execution run")
    event_type: str = Field(..., description="file_edit, command_run, file_create, file_delete, etc.")
    action: str = Field(..., description="Action description, e.g. modified, created, deleted, executed")
    target: str = Field(..., description="File path, shell command, or resource name")
    metadata: Optional[Dict[str, Any]] = None
    bob_task_id: Optional[str] = None

class LogEventResponse(BaseModel):
    event_id: int
    run_id: str
    risk_level: str
    requires_approval: bool
    reason: Optional[str] = None
    previous_hash: str
    event_hash: str
    timestamp: datetime

class RiskEvalRequest(BaseModel):
    action: str
    target: str
    event_type: Optional[str] = None

class RiskEvalResponse(BaseModel):
    risk_level: str  # LOW, MEDIUM, HIGH
    requires_approval: bool
    reason: str

class ApprovalDecisionRequest(BaseModel):
    event_id: int
    decision: str = Field(..., description="APPROVED or DENIED")
    approved_by: str = Field(default="Security Officer / Human-in-the-Loop")
    reason: Optional[str] = None

class ApprovalResponse(BaseModel):
    id: int
    event_id: int
    decision: str
    approved_by: str
    reason: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class EventSchema(BaseModel):
    id: int
    run_id: str
    event_type: str
    action: str
    target: str
    metadata_json: Optional[Dict[str, Any]] = None
    timestamp: datetime
    previous_hash: str
    event_hash: str
    risk_level: str
    approval: Optional[ApprovalResponse] = None

    class Config:
        from_attributes = True

class RunSummarySchema(BaseModel):
    id: str
    bob_task_id: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    status: str
    event_count: int = 0
    high_risk_count: int = 0
    pending_approval_count: int = 0
    chain_verified: Optional[bool] = None

class RunDetailSchema(BaseModel):
    run: RunSummarySchema
    events: List[EventSchema]
    verification: Optional[Dict[str, Any]] = None

class VerifyResponse(BaseModel):
    run_id: str
    verified: bool
    event_count: int
    failed_event_id: Optional[int] = None
    expected_hash: Optional[str] = None
    actual_hash: Optional[str] = None
    verified_at: datetime
    events_audit: Optional[List[Dict[str, Any]]] = None

class TamperRequest(BaseModel):
    event_id: int
    malicious_target: Optional[str] = None
    malicious_action: Optional[str] = None

class TamperResponse(BaseModel):
    success: bool
    message: str
    event_id: int
    original_target: str
    tampered_target: str

class RestoreRequest(BaseModel):
    event_id: Optional[int] = None
    run_id: Optional[str] = None

class DashboardStats(BaseModel):
    active_runs: int
    total_events: int
    risky_actions: int
    pending_approvals: int
    chain_status: str  # VERIFIED, COMPROMISED, PENDING
    recent_events: List[EventSchema]
