import hashlib
import json
from typing import Dict, Any, List, Tuple, Optional

# Genesis hash for the initial event of each run (64 zeros)
GENESIS_HASH = "0" * 64

def format_event_data(run_id: str, event_type: str, action: str, target: str, timestamp_str: str, metadata: Any = None) -> Dict[str, Any]:
    """Prepares standard canonical dictionary for event hashing."""
    return {
        "action": action,
        "event_type": event_type,
        "metadata": metadata,
        "run_id": run_id,
        "target": target,
        "timestamp": timestamp_str
    }

def compute_event_hash(previous_hash: str, event_data: Dict[str, Any]) -> str:
    """
    Computes SHA-256(previous_hash + canonical_json(event_data)).
    Keys are strictly sorted for deterministic output across languages.
    """
    canonical_json = json.dumps(event_data, sort_keys=True, separators=(',', ':'), default=str)
    payload = (previous_hash + canonical_json).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()

def verify_chain(events: List[Any]) -> Tuple[bool, Optional[int], Optional[str], Optional[str], List[Dict[str, Any]]]:
    """
    Sequentially audits the cryptographic hash chain for a list of Event objects.
    Returns: (is_valid, failed_event_id, expected_hash, actual_hash, audit_trail)
    """
    if not events:
        return True, None, None, None, []

    current_expected_prev_hash = GENESIS_HASH
    audit_trail = []

    for idx, ev in enumerate(events):
        # Format the event payload exactly as when it was originally recorded
        ts_str = ev.timestamp.isoformat() if hasattr(ev.timestamp, "isoformat") else str(ev.timestamp)
        payload = format_event_data(
            run_id=ev.run_id,
            event_type=ev.event_type,
            action=ev.action,
            target=ev.target,
            timestamp_str=ts_str,
            metadata=ev.metadata_json
        )

        # Check 1: Does stored previous_hash match our expected previous_hash?
        if ev.previous_hash != current_expected_prev_hash:
            audit_trail.append({
                "event_id": ev.id,
                "action": ev.action,
                "target": ev.target,
                "status": "CHAIN_BROKEN_PREVIOUS_HASH",
                "expected_previous": current_expected_prev_hash,
                "actual_previous": ev.previous_hash
            })
            return False, ev.id, current_expected_prev_hash, ev.previous_hash, audit_trail

        # Check 2: Does recomputed SHA-256 match stored event_hash?
        recalculated_hash = compute_event_hash(ev.previous_hash, payload)
        if recalculated_hash != ev.event_hash:
            audit_trail.append({
                "event_id": ev.id,
                "action": ev.action,
                "target": ev.target,
                "status": "DATA_MUTATION_DETECTED",
                "expected_hash": recalculated_hash,
                "actual_hash": ev.event_hash
            })
            return False, ev.id, recalculated_hash, ev.event_hash, audit_trail

        # Valid link in chain
        audit_trail.append({
            "event_id": ev.id,
            "action": ev.action,
            "target": ev.target,
            "status": "VALID",
            "hash": ev.event_hash
        })
        current_expected_prev_hash = ev.event_hash

    return True, None, None, None, audit_trail
