from pydantic import BaseModel, Field
from typing import List, Optional

class LoanInfo(BaseModel):
    type: str
    description: str
    max_amount: float
    interest_rate: float
    tenure_years: int
    min_age: int
    max_age: int
    min_income: float
    min_cibil: int

class EligibilityRequest(BaseModel):
    age: int
    income: float
    cibil_score: int
    employment_status: str
    loan_type: str

class EligibilityResponse(BaseModel):
    is_eligible: bool
    message: str
    max_amount: Optional[float] = None

class EMIRequest(BaseModel):
    principal: float = Field(..., gt=0)
    annual_rate: float = Field(..., gt=0)
    tenure_years: int = Field(..., gt=0)

class EMIResponse(BaseModel):
    emi: float
    total_payable: float
    total_interest: float

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: Optional[str] = None
