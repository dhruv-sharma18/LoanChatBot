def calculate_emi(principal: float, annual_rate: float, tenure_years: int) -> dict:
    """
    EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
    P = Principal amount
    R = Monthly interest rate (Annual rate / 12 / 100)
    N = Total number of monthly installments (Tenure years * 12)
    """
    p = principal
    r = annual_rate / (12 * 100)
    n = tenure_years * 12
    
    emi = (p * r * (1 + r)**n) / ((1 + r)**n - 1)
    total_payable = emi * n
    total_interest = total_payable - p
    
    return {
        "emi": round(emi, 2),
        "total_payable": round(total_payable, 2),
        "total_interest": round(total_interest, 2)
    }
