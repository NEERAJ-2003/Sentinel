from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Event, Approval
from app.schemas import ApprovalDecisionRequest, ApprovalResponse, EventSchema

router = APIRouter(prefix="/api/approve", tags=["Human Governance & Approvals"])

@router.get("/pending", response_model=List[EventSchema])
def list_pending_approvals(db: Session = Depends(get_db)):
    """
    Returns all HIGH-risk events that are pending human approval.
    """
    pending = (
        db.query(Event)
        .outerjoin(Approval, Event.id == Approval.event_id)
        .filter(Event.risk_level == "HIGH", Approval.id == None)
        .order_by(Event.id.desc())
        .all()
    )
    return pending

@router.get("/{event_id}")
def get_approval_status(event_id: int, db: Session = Depends(get_db)):
    """
    Checks if a specific event has received human approval or denial.
    Polled by autonomous agents while awaiting permission.
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    approval = db.query(Approval).filter(Approval.event_id == event_id).first()
    if not approval:
        return {
            "event_id": event_id,
            "decision": None,
            "status": "PENDING_APPROVAL",
            "message": "Awaiting human operator review"
        }

    return {
        "event_id": event_id,
        "decision": approval.decision,
        "approved_by": approval.approved_by,
        "reason": approval.reason,
        "timestamp": approval.timestamp
    }

@router.post("", response_model=ApprovalResponse, status_code=status.HTTP_201_CREATED)
def submit_approval(payload: ApprovalDecisionRequest, db: Session = Depends(get_db)):
    """
    Records a human decision (APPROVED / DENIED) for a sensitive agent action.
    """
    event = db.query(Event).filter(Event.id == payload.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    decision_norm = payload.decision.upper().strip()
    if decision_norm not in ["APPROVED", "DENIED"]:
        raise HTTPException(status_code=400, detail="Decision must be APPROVED or DENIED")

    existing = db.query(Approval).filter(Approval.event_id == payload.event_id).first()
    if existing:
        # Update existing decision
        existing.decision = decision_norm
        existing.approved_by = payload.approved_by
        existing.reason = payload.reason
        existing.timestamp = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    approval = Approval(
        event_id=payload.event_id,
        decision=decision_norm,
        approved_by=payload.approved_by,
        reason=payload.reason,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(approval)
    db.commit()
    db.refresh(approval)

    return approval
