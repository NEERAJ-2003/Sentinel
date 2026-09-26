#!/usr/bin/env python3
"""
Sentinel — Bob Workflow Simulator (Python CLI)
Simulates an IBM Bob coding session through the Sentinel governance pipeline:
  Bob -> Observe -> Analyze -> Control -> Record -> Verify

Usage:
  python bob-hook/simulate_bob.py
"""

import time
import sys
import os
import httpx

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_URL = os.getenv("SENTINEL_API_URL", "http://localhost:8000")
RUN_ID = f"bob-cli-{int(time.time())}"

def badge(risk: str) -> str:
    if risk == "HIGH":
        return "[HIGH RISK]"
    elif risk == "MEDIUM":
        return "[MEDIUM RISK]"
    return "[LOW RISK]"

def log_event(client: httpx.Client, event_type: str, action: str, target: str, metadata: dict = None):
    payload = {
        "run_id": RUN_ID,
        "bob_task_id": f"task-{RUN_ID}",
        "event_type": event_type,
        "action": action,
        "target": target,
        "metadata": metadata
    }
    res = client.post(f"{BASE_URL}/api/log", json=payload)
    if res.status_code != 201:
        print(f"Error logging event: {res.status_code} - {res.text}")
        sys.exit(1)
    return res.json()

def wait_for_approval(client: httpx.Client, event_id: int) -> str:
    print(f"\n[!] CONTROL GATE: Execution paused. Event #{event_id} flagged as HIGH RISK!")
    print(f"    Please approve or deny in the Sentinel React Dashboard (http://localhost:5173)")
    print(f"    Or use: curl -X POST {BASE_URL}/api/approve -H \"Content-Type: application/json\" -d \"{{\\\"event_id\\\":{event_id},\\\"decision\\\":\\\"APPROVED\\\"}}\"")
    print("    Waiting for human sign-off...", end="", flush=True)

    while True:
        time.sleep(2)
        res = client.get(f"{BASE_URL}/api/approve/{event_id}")
        data = res.json()
        if data.get("decision"):
            print(f"\n[+] Operator decision received: {data['decision']}")
            return data["decision"]
        print(".", end="", flush=True)

def main():
    print("=" * 65)
    print(f"IBM Bob Autonomous Coding Session — Monitored by Sentinel")
    print(f"API Gateway: {BASE_URL}")
    print(f"Run ID: {RUN_ID}")
    print("=" * 65)

    steps = [
        {"type": "file_create", "action": "created",  "target": "services/payment.py", "meta": {"lines": 58}},
        {"type": "file_edit",   "action": "modified", "target": "tests/test_pay.py",   "meta": {"assertions": 5}},
        {"type": "command_run", "action": "pytest",   "target": "tests/test_pay.py",   "meta": {"status": "passed"}},
        {"type": "file_delete", "action": "deleted",  "target": "config.json",         "meta": {"warning": "Critical deletion"}},
        {"type": "command_run", "action": "git commit -m 'feat: payment service'", "target": "repo", "meta": None}
    ]

    with httpx.Client(timeout=10.0) as client:
        try:
            health = client.get(f"{BASE_URL}/health")
            if health.status_code != 200:
                print("Sentinel backend is not reachable.")
                sys.exit(1)
        except Exception as e:
            print(f"Error: Cannot connect to Sentinel Backend at {BASE_URL} ({e}). Ensure backend is running.")
            sys.exit(1)

        for step in steps:
            time.sleep(0.8)
            result = log_event(client, step["type"], step["action"], step["target"], step["meta"])
            print(f"\n> [{step['type']}] \"{step['action']}\" -> {step['target']}")
            print(f"  Event ID: #{result['event_id']}")
            print(f"  Risk:     {badge(result['risk_level'])}")
            print(f"  SHA-256:  {result['event_hash'][:20]}...")

            if result["requires_approval"]:
                decision = wait_for_approval(client, result["event_id"])
                if decision == "DENIED":
                    print("\n[-] Operation DENIED by Human Operator. Bob halting task.")
                    sys.exit(1)

        print("\n" + "=" * 65)
        print("Auditing Cryptographic Hash Chain...")
        time.sleep(1)
        verif_res = client.get(f"{BASE_URL}/api/verify/{RUN_ID}")
        verif = verif_res.json()

        if verif["verified"]:
            print(f"[+] CHAIN 100% VERIFIED — {verif['event_count']} events cryptographically intact!")
        else:
            print(f"[-] TAMPER DETECTED at event #{verif['failed_event_id']}")

        print("=" * 65)
        print(f"\nSimulation finished successfully!")

if __name__ == "__main__":
    main()
