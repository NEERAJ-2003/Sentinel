from datetime import datetime, timezone, timedelta
from app.database import SessionLocal, engine, Base
from app.models import Run, Event, Approval, VerificationResult
from app.core.hash_chain import compute_event_hash, format_event_data, GENESIS_HASH

def seed_database():
    """Seeds initial demonstration data if DB is empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Run).count() > 0:
            return  # Already seeded or has data

        now = datetime.now(timezone.utc)

        # ── RUN 1: Clean, Fully Verified Run (Run #001) ──────────────────────
        run1_id = "run-001"
        run1 = Run(
            id=run1_id,
            bob_task_id="bob-task-101",
            started_at=now - timedelta(minutes=45),
            ended_at=now - timedelta(minutes=30),
            status="completed"
        )
        db.add(run1)
        db.commit()

        events_data_1 = [
            ("file_create", "created", "src/models/user.ts", "LOW", {"lines": 28}),
            ("file_edit", "modified", "src/controllers/auth.ts", "LOW", {"lines": 14}),
            ("command_run", "npm test", "test suite execution", "LOW", {"tests": 8}),
            ("file_delete", "deleted", "legacy_user_cache.json", "HIGH", {"critical": True}),
            ("command_run", "git commit -m 'feat: user model update'", "git commit", "LOW", {"hash": "a1b2c3d"})
        ]

        prev_hash = GENESIS_HASH
        event_objects_1 = []
        for idx, (etype, act, tgt, risk, meta) in enumerate(events_data_1):
            ts = now - timedelta(minutes=45 - idx * 3)
            canon = format_event_data(run1_id, etype, act, tgt, ts.isoformat(), meta)
            curr_hash = compute_event_hash(prev_hash, canon)
            ev = Event(
                run_id=run1_id,
                event_type=etype,
                action=act,
                target=tgt,
                metadata_json=meta,
                timestamp=ts,
                previous_hash=prev_hash,
                event_hash=curr_hash,
                risk_level=risk
            )
            db.add(ev)
            db.commit()
            db.refresh(ev)
            event_objects_1.append(ev)
            prev_hash = curr_hash

        # Add human approval for the high-risk deletion in Run 1
        high_risk_ev_1 = [e for e in event_objects_1 if e.risk_level == "HIGH"][0]
        approval1 = Approval(
            event_id=high_risk_ev_1.id,
            decision="APPROVED",
            approved_by="Lead Dev (Neeraj)",
            reason="Approved removal of deprecated legacy user cache",
            timestamp=high_risk_ev_1.timestamp + timedelta(seconds=45)
        )
        db.add(approval1)

        # Verification result for Run 1
        verif1 = VerificationResult(
            run_id=run1_id,
            verified=True,
            failed_event_id=None,
            verified_at=now - timedelta(minutes=29)
        )
        db.add(verif1)
        db.commit()

        # ── RUN 2: Active Run with Pending Approval (Run #002) ─────────────────
        run2_id = "run-002"
        run2 = Run(
            id=run2_id,
            bob_task_id="bob-task-102",
            started_at=now - timedelta(minutes=15),
            status="active"
        )
        db.add(run2)
        db.commit()

        events_data_2 = [
            ("file_create", "created", "lib/security/sentinel.py", "LOW", {"lines": 65}),
            ("file_edit", "modified", "app/main.py", "LOW", {"lines": 35}),
            ("file_delete", "deleted", "config.json", "HIGH", {"warning": "destructive file operation"})
        ]

        prev_hash = GENESIS_HASH
        for idx, (etype, act, tgt, risk, meta) in enumerate(events_data_2):
            ts = now - timedelta(minutes=15 - idx * 4)
            canon = format_event_data(run2_id, etype, act, tgt, ts.isoformat(), meta)
            curr_hash = compute_event_hash(prev_hash, canon)
            ev = Event(
                run_id=run2_id,
                event_type=etype,
                action=act,
                target=tgt,
                metadata_json=meta,
                timestamp=ts,
                previous_hash=prev_hash,
                event_hash=curr_hash,
                risk_level=risk
            )
            db.add(ev)
            db.commit()
            prev_hash = curr_hash

        # Note: Event #3 in Run 2 has NO approval, so it will show up in the Approval Queue immediately!

        # Verification result for Run 2
        verif2 = VerificationResult(
            run_id=run2_id,
            verified=True,
            failed_event_id=None,
            verified_at=now - timedelta(minutes=2)
        )
        db.add(verif2)
        db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully with initial runs and events.")
