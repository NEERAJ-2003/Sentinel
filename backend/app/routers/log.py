from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Run, Event
from app.schemas import LogEventRequest, LogEventResponse
from app.core.risk_engine import evaluate_risk
from app.core.hash_chain import compute_event_hash, format_event_data, GENESIS_HASH

router = APIRouter(prefix="/api/log", tags=["Log Ingestion"])

@router.post("", response_model=LogEventResponse, status_code=status.HTTP_201_CREATED)
def log_event(payload: LogEventRequest, db: Session = Depends(get_db)):
    """
    Ingests an agent telemetry event from IBM Bob.
    Computes cryptographic SHA-256 hash chaining and evaluates policy risk.
    """
    # 1. Ensure Run exists or create it
    run = db.query(Run).filter(Run.id == payload.run_id).first()
    if not run:
        bob_id = payload.bob_task_id or f"bob-task-{payload.run_id}"
        # If bob_id exists under different run, ensure unique task id
        existing_task = db.query(Run).filter(Run.bob_task_id == bob_id).first()
        if existing_task:
            bob_id = f"{bob_id}-{int(datetime.now().timestamp())}"

        run = Run(
            id=payload.run_id,
            bob_task_id=bob_id,
            started_at=datetime.now(timezone.utc),
            status="active"
        )
        db.add(run)
        db.commit()
        db.refresh(run)

    # 2. Retrieve previous event to obtain parent hash in chain
    last_event = (
        db.query(Event)
        .filter(Event.run_id == payload.run_id)
        .order_by(Event.id.desc())
        .first()
    )
    previous_hash = last_event.event_hash if last_event else GENESIS_HASH

    # 3. Evaluate Risk Engine policies
    risk_level, requires_approval, reason = evaluate_risk(
        event_type=payload.event_type,
        action=payload.action,
        target=payload.target
    )

    # 4. Canonical Timestamp & SHA-256 Chained Hash
    now_utc = datetime.now(timezone.utc)
    now_iso = now_utc.isoformat()

    canonical_data = format_event_data(
        run_id=payload.run_id,
        event_type=payload.event_type,
        action=payload.action,
        target=payload.target,
        timestamp_str=now_iso,
        metadata=payload.metadata
    )
    event_hash = compute_event_hash(previous_hash, canonical_data)

    # 5. Persist to Postgres
    event = Event(
        run_id=payload.run_id,
        event_type=payload.event_type,
        action=payload.action,
        target=payload.target,
        metadata_json=payload.metadata,
        timestamp=now_utc,
        previous_hash=previous_hash,
        event_hash=event_hash,
        risk_level=risk_level
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    return LogEventResponse(
        event_id=event.id,
        run_id=event.run_id,
        risk_level=event.risk_level,
        requires_approval=requires_approval,
        reason=reason,
        previous_hash=event.previous_hash,
        event_hash=event.event_hash,
        timestamp=event.timestamp
    )
