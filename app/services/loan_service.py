import json
import os
from typing import List, Dict, Any
from app.models.schemas import LoanInfo, EligibilityRequest, EligibilityResponse
from app.core.config import settings, logger

# Load loan policies from JSON file
def load_policies() -> List[Dict[str, Any]]:
    if not os.path.exists(settings.LOAN_POLICIES_FILE):
        logger.error(f"Loan policies file not found: {settings.LOAN_POLICIES_FILE}")
        return []
    
    try:
        with open(settings.LOAN_POLICIES_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading loan policies: {e}")
        return []

LOAN_POLICIES = load_policies()

def get_all_loans() -> List[LoanInfo]:
    return [LoanInfo(**policy) for policy in LOAN_POLICIES]

def evaluate_eligibility(req: EligibilityRequest) -> EligibilityResponse:
    policy = next((p for p in LOAN_POLICIES if p["type"].lower() == req.loan_type.lower()), None)
    
    if not policy:
        return EligibilityResponse(is_eligible=False, message=f"Loan type '{req.loan_type}' not found.")
    
    if req.age < policy["min_age"] or req.age > policy["max_age"]:
        return EligibilityResponse(is_eligible=False, message="Age criteria not met.")
    
    if req.income < policy["min_income"]:
        return EligibilityResponse(is_eligible=False, message="Income criteria not met.")
    
    if req.cibil_score < policy["min_cibil"]:
        return EligibilityResponse(is_eligible=False, message="CIBIL score is too low.")
    
    # Simple max amount logic: 10x monthly income, capped by policy max
    calculated_max = req.income * 12 * 0.5 # 50% of annual income for simplicity
    final_max = min(calculated_max, policy["max_amount"])
    
    return EligibilityResponse(
        is_eligible=True,
        message="Congratulations! You are eligible for this loan.",
        max_amount=final_max
    )
