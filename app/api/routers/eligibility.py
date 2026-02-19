from fastapi import APIRouter
from app.models.schemas import EligibilityRequest, EligibilityResponse
from app.services.loan_service import evaluate_eligibility

router = APIRouter()

@router.post("/", response_model=EligibilityResponse)
async def check_eligibility(req: EligibilityRequest):
    return evaluate_eligibility(req)
