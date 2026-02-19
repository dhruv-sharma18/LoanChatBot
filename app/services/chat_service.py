import re
from typing import Optional

def get_chatbot_response(message: str) -> str:
    if not message or not message.strip():
        return "I didn't receive a message. How can I help you today?"
    
    message = message.strip().lower()
    
    if re.search(r"\b(hi|hello|hey|greetings)\b", message):
        return "Hello! I am your Loan Assistant. How can I help you today? You can ask about loan types, eligibility, or EMI calculations."
    
    if re.search(r"\b(type|loans|list|options)\b", message):
        return "We offer Personal, Home, Business, and Education loans. Which one would you like to know more about?"
    
    if re.search(r"\b(eligibility|eligible|can i get|apply)\b", message):
        return "To check your eligibility, I need to know your age, income, CIBIL score, and employment status. You can use our /eligibility endpoint for a detailed check."
    
    if re.search(r"\b(emi|calculator|calculate|payment)\b", message):
        return "You can calculate your EMI using our /emi-calculator. You'll need the principal amount, interest rate, and tenure."
    
    if re.search(r"\b(personal)\b", message):
        return "Personal loans are available for up to 5 Lakhs at 10.5% interest. Minimum age is 21 and minimum monthly income is 25k."
    
    if re.search(r"\b(home)\b", message):
        return "Home loans are available for up to 50 Lakhs at 8.5% interest. Minimum age is 21 and minimum monthly income is 40k."
    
    if re.search(r"\b(business)\b", message):
        return "Business loans are available for up to 1 Crore at 12% interest. Minimum age is 25 and minimum monthly turnover is 1 Lakh."
    
    if re.search(r"\b(education)\b", message):
        return "Education loans are available for up to 20 Lakhs at 9% interest. Minimum age is 18 and minimum monthly income is 20k."

    if re.search(r"\b(thanks|thank you|bye)\b", message):
        return "You're welcome! Feel free to ask if you have more questions. Have a great day!"

    return "I'm sorry, I didn't quite understand that. Could you please rephrase? You can ask about loan types, eligibility, or EMI calculation."
