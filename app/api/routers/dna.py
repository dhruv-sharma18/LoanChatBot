from fastapi import APIRouter, HTTPException
from app.models.schemas import DNAData, DNAResponse
from app.services.dna_service import generate_loan_dna

router = APIRouter()

@router.post("/", response_model=DNAResponse)
async def get_loan_dna(data: DNAData):
    try:
        return generate_loan_dna(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
