from fastapi import APIRouter
from app.models.schemas import EMIRequest, EMIResponse
from app.services.emi_service import calculate_emi

router = APIRouter()

@router.post("/", response_model=EMIResponse)
async def get_emi(req: EMIRequest):
    result = calculate_emi(req.principal, req.annual_rate, req.tenure_years)
    return EMIResponse(**result)
