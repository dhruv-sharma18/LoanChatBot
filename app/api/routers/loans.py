from fastapi import APIRouter
from typing import List
from app.models.schemas import LoanInfo
from app.services.loan_service import get_all_loans

router = APIRouter()

@router.get("/", response_model=List[LoanInfo])
async def list_loans():
    return get_all_loans()
