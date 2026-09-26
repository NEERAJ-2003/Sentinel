import re
from typing import Tuple

HIGH_RISK_COMMANDS = [
    "rm -rf",
    "git reset --hard",
    "git push --force",
    "git push -f",
    "drop database",
    "drop table",
    "truncate table",
    "format c:",
    "mkfs",
    "dd if=",
    ":(){ :|:& };:", # fork bomb
    "chmod -r 777",
    "curl | sh",
    "wget | sh"
]

HIGH_RISK_ACTIONS = [
    "delete_file",
    "file_delete",
    "database_drop",
    "production_change",
    "force_push",
    "secret_access"
]

HIGH_RISK_TARGET_PATTERNS = [
    r"\.env($|\.)",
    r"credentials?",
    r"id_rsa",
    r"private_key",
    r"secrets?",
    r"passwd",
    r"shadow",
    r"config\.json"
]

MEDIUM_RISK_ACTIONS = [
    "npm install",
    "pip install",
    "yarn add",
    "apt-get",
    "docker run",
    "composer install"
]

def evaluate_risk(event_type: str, action: str, target: str) -> Tuple[str, bool, str]:
    """
    Evaluates policy risk for an incoming Bob agent operation.
    Returns: (risk_level: "LOW" | "MEDIUM" | "HIGH", requires_approval: bool, reason: str)
    """
    action_lower = action.lower()
    event_type_lower = event_type.lower()
    target_lower = target.lower()

    # 1. High risk commands
    for cmd in HIGH_RISK_COMMANDS:
        if cmd in action_lower or cmd in target_lower:
            return "HIGH", True, f"Potentially destructive command detected: '{cmd}'"

    # 2. High risk event types / actions
    if event_type_lower in ["file_delete", "production_change", "database_drop"]:
        return "HIGH", True, f"Critical lifecycle event type: '{event_type}'"

    for act in HIGH_RISK_ACTIONS:
        if act in action_lower:
            return "HIGH", True, f"Restricted high-risk action: '{act}'"

    # 3. Sensitive target inspection
    for pattern in HIGH_RISK_TARGET_PATTERNS:
        if re.search(pattern, target_lower):
            return "HIGH", True, f"Operation targets sensitive file or secret asset: '{target}'"

    # 4. Medium risk commands (e.g. package installations / external dependency injections)
    for med in MEDIUM_RISK_ACTIONS:
        if med in action_lower or med in target_lower:
            return "MEDIUM", False, f"External dependency or environment modification: '{med}'"

    # 5. Routine low-risk coding operations
    if event_type_lower in ["file_read", "file_create", "file_edit", "command_run", "commit", "tool_call"]:
        if any(w in action_lower for w in ["read", "modified", "created", "status", "test", "commit", "npm test", "git commit"]):
            return "LOW", False, "Safe routine development operation"

    return "LOW", False, "Standard operational step"
