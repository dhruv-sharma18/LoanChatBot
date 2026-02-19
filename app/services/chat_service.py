import re
from typing import Optional
from app.services.loan_service import LOAN_POLICIES

def get_chatbot_response(message: str) -> str:
    if not message or not message.strip():
        return "I didn't receive a message. How can I help you today?"
    
    message = message.strip().lower()
    
    if re.search(r"\b(hi|hello|hey|greetings)\b", message):
        return "Hello! I am your Loan Assistant. How can I help you today? You can ask about loan types, eligibility, or EMI calculations."
    
    if re.search(r"\b(type|loans|list|options)\b", message):
        types = ", ".join([p["type"] for p in LOAN_POLICIES])
        return f"We offer {types} loans. Which one would you like to know more about?"
    
    if re.search(r"\b(eligibility|eligible|can i get|apply)\b", message):
        return "To check your eligibility, I need to know your age, income, and CIBIL score. You can use our /eligibility endpoint for a detailed check."
    
    if re.search(r"\b(emi|calculator|calculate|payment)\b", message):
        return "You can calculate your EMI using our /emi-calculator. You'll need the principal amount, interest rate, and tenure."
    
    # Dynamic check for loan types
    for policy in LOAN_POLICIES:
        if re.search(rf"\b({policy['type'].lower()})\b", message):
            return (
                f"{policy['type']} loans: {policy['description']} "
                f"We offer up to {policy['max_amount']:,} at {policy['interest_rate']}% interest. "
                f"Minimum requirements: Age {policy['min_age']}+ and income {policy['min_income']:,}."
            )

    if re.search(r"\b(thanks|thank you|bye)\b", message):
        return "You're welcome! Feel free to ask if you have more questions. Have a great day!"

    return "I'm sorry, I didn't quite understand that. Could you please rephrase? You can ask about loan types, eligibility, or EMI calculation."
