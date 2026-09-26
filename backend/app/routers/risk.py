from fastapi import APIRouter
from app.schemas import RiskEvalRequest, RiskEvalResponse
from app.core.risk_engine import evaluate_risk

router = APIRouter(prefix="/api/risk", tags=["Risk Analysis"])

@router.post("", response_model=RiskEvalResponse)
def check_risk(payload: RiskEvalRequest):
    """
    Evaluates policy risk level for a proposed agent action.
    Used by Bob clients before initiating potentially destructive actions.
    """
    risk_level, requires_approval, reason = evaluate_risk(
        event_type=payload.event_type or "command_run",
        action=payload.action,
        target=payload.target
    )
    return RiskEvalResponse(
        risk_level=risk_level,
        requires_approval=requires_approval,
        reason=reason
    )
