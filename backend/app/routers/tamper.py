from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Event, Run
from app.schemas import TamperRequest, TamperResponse, RestoreRequest

router = APIRouter(prefix="/api/tamper", tags=["Hackathon Demo — Tamper Lab"])

@router.post("", response_model=TamperResponse)
def inject_tampering(payload: TamperRequest, db: Session = Depends(get_db)):
    """
    Signature Hackathon Demo Feature:
    Deliberately modifies an event payload in the PostgreSQL database WITHOUT
    updating its cryptographic hash. This models an attacker modifying records.
    When /api/verify is called next, the chain verification will immediately fail!
    """
    event = db.query(Event).filter(Event.id == payload.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    original_target = event.target
    malicious_target = payload.malicious_target or "exfiltrate_secrets.sh"

    # Save original target in metadata for instant demo restoration
    meta = dict(event.metadata_json or {})
    meta["__tampered"] = True
    meta["__original_target"] = original_target
    meta["__original_action"] = event.action

    event.target = malicious_target
    if payload.malicious_action:
        event.action = payload.malicious_action
    else:
        event.action = "unauthorized_modification"

    event.metadata_json = meta
    db.commit()
    db.refresh(event)

    return TamperResponse(
        success=True,
        message=f"Event #{event.id} maliciously altered in database (target changed from '{original_target}' to '{event.target}'). Cryptographic hash remained untouched.",
        event_id=event.id,
        original_target=original_target,
        tampered_target=event.target
    )

@router.post("/restore")
def restore_event(payload: RestoreRequest, db: Session = Depends(get_db)):
    """
    Restores tampered events back to their authentic state so the demo can be cleanly repeated.
    """
    query = db.query(Event)
    if payload.event_id:
        query = query.filter(Event.id == payload.event_id)
    elif payload.run_id:
        query = query.filter(Event.run_id == payload.run_id)

    events = query.all()
    restored_count = 0

    for ev in events:
        meta = dict(ev.metadata_json or {})
        if meta.get("__tampered"):
            ev.target = meta.get("__original_target", ev.target)
            ev.action = meta.get("__original_action", ev.action)
            meta.pop("__tampered", None)
            meta.pop("__original_target", None)
            meta.pop("__original_action", None)
            ev.metadata_json = meta
            restored_count += 1

    db.commit()
    return {
        "success": True,
        "restored_count": restored_count,
        "message": f"Successfully restored {restored_count} event(s) to original pristine cryptographic state."
    }
