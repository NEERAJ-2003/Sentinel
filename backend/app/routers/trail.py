from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Run, Event, Approval, VerificationResult
from app.schemas import RunSummarySchema, RunDetailSchema, EventSchema, DashboardStats

router = APIRouter(prefix="/api", tags=["Audit Trail & Telemetry"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Returns aggregated KPIs for the executive trust dashboard.
    """
    active_runs = db.query(func.count(Run.id)).filter(Run.status == "active").scalar() or 0
    total_events = db.query(func.count(Event.id)).scalar() or 0
    risky_actions = db.query(func.count(Event.id)).filter(Event.risk_level == "HIGH").scalar() or 0
    
    # Pending approvals: HIGH risk events without any record in approvals table
    pending_approvals = (
        db.query(func.count(Event.id))
        .outerjoin(Approval, Event.id == Approval.event_id)
        .filter(Event.risk_level == "HIGH", Approval.id == None)
        .scalar() or 0
    )

    # Check overall chain status across runs
    failed_verifications = (
        db.query(func.count(VerificationResult.id))
        .filter(VerificationResult.verified == False)
        .scalar() or 0
    )
    chain_status = "COMPROMISED" if failed_verifications > 0 else "VERIFIED"

    # Recent 10 events
    recent_events = (
        db.query(Event)
        .order_by(Event.id.desc())
        .limit(10)
        .all()
    )

    return DashboardStats(
        active_runs=active_runs,
        total_events=total_events,
        risky_actions=risky_actions,
        pending_approvals=pending_approvals,
        chain_status=chain_status,
        recent_events=recent_events
    )

@router.get("/runs", response_model=List[RunSummarySchema])
def list_runs(db: Session = Depends(get_db)):
    """
    Lists all agent runs with aggregated audit metrics.
    """
    runs = db.query(Run).order_by(Run.started_at.desc()).all()
    results = []

    for r in runs:
        event_count = len(r.events)
        high_risk_count = sum(1 for e in r.events if e.risk_level == "HIGH")
        pending_count = sum(1 for e in r.events if e.risk_level == "HIGH" and not e.approval)
        
        latest_verif = (
            db.query(VerificationResult)
            .filter(VerificationResult.run_id == r.id)
            .order_by(VerificationResult.verified_at.desc())
            .first()
        )
        chain_verified = latest_verif.verified if latest_verif else None

        results.append(RunSummarySchema(
            id=r.id,
            bob_task_id=r.bob_task_id,
            started_at=r.started_at,
            ended_at=r.ended_at,
            status=r.status,
            event_count=event_count,
            high_risk_count=high_risk_count,
            pending_approval_count=pending_count,
            chain_verified=chain_verified
        ))

    return results

@router.get("/runs/{run_id}", response_model=RunDetailSchema)
def get_run_detail(run_id: str, db: Session = Depends(get_db)):
    """
    Returns full run details and the chronological cryptographic audit trail.
    """
    run = db.query(Run).filter(Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    events = (
        db.query(Event)
        .filter(Event.run_id == run_id)
        .order_by(Event.id.asc())
        .all()
    )

    event_count = len(events)
    high_risk_count = sum(1 for e in events if e.risk_level == "HIGH")
    pending_count = sum(1 for e in events if e.risk_level == "HIGH" and not e.approval)

    latest_verif = (
        db.query(VerificationResult)
        .filter(VerificationResult.run_id == run_id)
        .order_by(VerificationResult.verified_at.desc())
        .first()
    )

    verif_dict = None
    if latest_verif:
        verif_dict = {
            "verified": latest_verif.verified,
            "failed_event_id": latest_verif.failed_event_id,
            "verified_at": latest_verif.verified_at.isoformat()
        }

    run_summary = RunSummarySchema(
        id=run.id,
        bob_task_id=run.bob_task_id,
        started_at=run.started_at,
        ended_at=run.ended_at,
        status=run.status,
        event_count=event_count,
        high_risk_count=high_risk_count,
        pending_approval_count=pending_count,
        chain_verified=latest_verif.verified if latest_verif else None
    )

    return RunDetailSchema(
        run=run_summary,
        events=events,
        verification=verif_dict
    )

@router.get("/events", response_model=List[EventSchema])
def list_events(limit: int = 50, db: Session = Depends(get_db)):
    """
    Returns recent chronological audit trail events.
    """
    return db.query(Event).order_by(Event.id.desc()).limit(limit).all()
