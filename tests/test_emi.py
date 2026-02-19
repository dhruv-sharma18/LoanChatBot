import pytest
from app.services.emi_service import calculate_emi

def test_calculate_emi_standard():
    # Principal: 100000, Rate: 10%, Tenure: 1 year
    result = calculate_emi(100000, 10, 1)
    # EMI should be ~8791.59
    assert result["emi"] == pytest.approx(8791.59, abs=0.1)
    assert result["total_payable"] == pytest.approx(105499.06, abs=0.1)
    assert result["total_interest"] == pytest.approx(5499.06, abs=0.1)

def test_calculate_emi_large_amount():
    result = calculate_emi(1000000, 8.5, 20)
    assert result["emi"] == pytest.approx(8678.23, abs=0.1)
    assert result["total_payable"] == pytest.approx(2082775.76, abs=1.0)
    assert result["total_interest"] == pytest.approx(1082775.76, abs=1.0)
