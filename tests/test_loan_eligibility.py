import pytest
from app.services.loan_service import evaluate_eligibility
from app.models.schemas import EligibilityRequest

def test_evaluate_eligibility_personal_success():
    req = EligibilityRequest(
        age=30,
        income=50000,
        cibil_score=750,
        employment_status="Salaried",
        loan_type="Personal"
    )
    res = evaluate_eligibility(req)
    assert res.is_eligible is True
    assert res.max_amount > 0

def test_evaluate_eligibility_age_failure():
    req = EligibilityRequest(
        age=18,
        income=50000,
        cibil_score=750,
        employment_status="Salaried",
        loan_type="Personal"
    )
    res = evaluate_eligibility(req)
    assert res.is_eligible is False
    assert "Age criteria" in res.message

def test_evaluate_eligibility_cibil_failure():
    req = EligibilityRequest(
        age=30,
        income=50000,
        cibil_score=500,
        employment_status="Salaried",
        loan_type="Personal"
    )
    res = evaluate_eligibility(req)
    assert res.is_eligible is False
    assert "CIBIL score" in res.message

def test_evaluate_eligibility_not_found():
    req = EligibilityRequest(
        age=30,
        income=50000,
        cibil_score=750,
        employment_status="Salaried",
        loan_type="Spaceship Loan"
    )
    res = evaluate_eligibility(req)
    assert res.is_eligible is False
    assert "not found" in res.message
