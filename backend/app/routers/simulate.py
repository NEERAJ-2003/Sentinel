import time
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db, SessionLocal
from app.models import Run, Event
from app.core.risk_engine import evaluate_risk
from app.core.hash_chain import compute_event_hash, format_event_data, GENESIS_HASH

router = APIRouter(prefix="/api/simulate", tags=["Bob Simulation Runner"])

BOB_DEMO_STEPS = [
    {
        "event_type": "file_create",
        "action": "created",
        "target": "src/core/auth.ts",
        "metadata": {"size_bytes": 1024, "language": "typescript"}
    },
    {
        "event_type": "file_edit",
        "action": "modified",
        "target": "app/page.tsx",
        "metadata": {"lines_changed": 42, "diff": "+ import { Auth } from '@/core/auth'"}
    },
    {
        "event_type": "command_run",
        "action": "npm test",
        "target": "vitest run --coverage",
        "metadata": {"exit_code": 0, "tests_passed": 12}
    },
    {
        "event_type": "file_delete",
        "action": "deleted",
        "target": "config.json",
        "metadata": {"warning": "destructive deletion of core config file"}
    },
    {
        "event_type": "command_run",
        "action": "git commit -m 'feat: integrate auth and clean configs'",
        "target": "git commit",
        "metadata": {"author": "IBM Bob Autonomous Agent", "branch": "main"}
    }
]

def record_step(db: Session, run_id: str, step: dict):
    last_event = (
        db.query(Event)
        .filter(Event.run_id == run_id)
        .order_by(Event.id.desc())
        .first()
    )
    previous_hash = last_event.event_hash if last_event else GENESIS_HASH

    risk_level, requires_approval, reason = evaluate_risk(
        event_type=step["event_type"],
        action=step["action"],
        target=step["target"]
    )

    now_utc = datetime.now(timezone.utc)
    canonical = format_event_data(
        run_id=run_id,
        event_type=step["event_type"],
        action=step["action"],
        target=step["target"],
        timestamp_str=now_utc.isoformat(),
        metadata=step["metadata"]
    )
    event_hash = compute_event_hash(previous_hash, canonical)

    event = Event(
        run_id=run_id,
        event_type=step["event_type"],
        action=step["action"],
        target=step["target"],
        metadata_json=step["metadata"],
        timestamp=now_utc,
        previous_hash=previous_hash,
        event_hash=event_hash,
        risk_level=risk_level
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.post("")
def trigger_bob_simulation(
    include_pending_approval: bool = True,
    db: Session = Depends(get_db)
):
    """
    Executes a realistic IBM Bob autonomous coding session through Sentinel.
    Generates chained cryptographic events and intentionally includes a high-risk
    action so that it appears live in the Human Approval Queue!
    """
    timestamp_id = int(time.time())
    run_id = f"bob-run-{timestamp_id}"
    bob_task_id = f"task-bob-{timestamp_id}"

    run = Run(
        id=run_id,
        bob_task_id=bob_task_id,
        started_at=datetime.now(timezone.utc),
        status="active"
    )
    db.add(run)
    db.commit()

    recorded_events = []
    # If include_pending_approval is True, record up to the high-risk step
    # so the judge/user can approve it in the UI!
    steps_to_run = BOB_DEMO_STEPS[:4] if include_pending_approval else BOB_DEMO_STEPS

    for step in steps_to_run:
        ev = record_step(db, run_id, step)
        recorded_events.append({
            "event_id": ev.id,
            "action": ev.action,
            "target": ev.target,
            "risk_level": ev.risk_level,
            "hash": ev.event_hash[:16] + "..."
        })

    return {
        "success": True,
        "run_id": run_id,
        "bob_task_id": bob_task_id,
        "events_created": len(recorded_events),
        "has_pending_approval": include_pending_approval,
        "events": recorded_events,
        "message": "Bob workflow successfully recorded into Sentinel. Check Approval Queue for high-risk action!"
    }
