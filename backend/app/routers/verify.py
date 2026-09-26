from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Run, Event, VerificationResult
from app.schemas import VerifyResponse
from app.core.hash_chain import verify_chain

router = APIRouter(prefix="/api/verify", tags=["Cryptographic Verification"])

def perform_run_verification(run_id: str, db: Session) -> VerifyResponse:
    run = db.query(Run).filter(Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail=f"Run '{run_id}' not found")

    events = (
        db.query(Event)
        .filter(Event.run_id == run_id)
        .order_by(Event.id.asc())
        .all()
    )

    if not events:
        # Empty run is technically intact
        return VerifyResponse(
            run_id=run_id,
            verified=True,
            event_count=0,
            failed_event_id=None,
            expected_hash=None,
            actual_hash=None,
            verified_at=datetime.now(timezone.utc),
            events_audit=[]
        )

    is_valid, failed_id, expected_hash, actual_hash, audit_trail = verify_chain(events)

    # Persist verification audit record to database
    verif_record = VerificationResult(
        run_id=run_id,
        verified=is_valid,
        failed_event_id=failed_id,
        verified_at=datetime.now(timezone.utc)
    )
    db.add(verif_record)
    db.commit()

    return VerifyResponse(
        run_id=run_id,
        verified=is_valid,
        event_count=len(events),
        failed_event_id=failed_id,
        expected_hash=expected_hash,
        actual_hash=actual_hash,
        verified_at=verif_record.verified_at,
        events_audit=audit_trail
    )

@router.get("/{run_id}", response_model=VerifyResponse)
def verify_run(run_id: str, db: Session = Depends(get_db)):
    """
    Recomputes the cryptographic hash chain for all events in a run.
    Detects any database tampering, out-of-order mutations, or payload modifications.
    """
    return perform_run_verification(run_id, db)

@router.post("/{run_id}", response_model=VerifyResponse)
def trigger_run_verification(run_id: str, db: Session = Depends(get_db)):
    """
    Triggers on-demand verification and saves record to verification_results.
    """
    return perform_run_verification(run_id, db)

@router.get("", response_model=List[Dict[str, Any]])
def verify_all_runs(db: Session = Depends(get_db)):
    """
    Sweeps all runs and returns summary integrity status.
    """
    runs = db.query(Run).all()
    summaries = []
    for r in runs:
        res = perform_run_verification(r.id, db)
        summaries.append({
            "run_id": r.id,
            "bob_task_id": r.bob_task_id,
            "verified": res.verified,
            "event_count": res.event_count,
            "failed_event_id": res.failed_event_id
        })
    return summaries
