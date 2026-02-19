from app.services.chat_service import get_chatbot_response

def test_chatbot_greeting():
    response = get_chatbot_response("Hello")
    assert "Loan Assistant" in response

def test_chatbot_loan_types():
    response = get_chatbot_response("Tell me about types of loans")
    assert "Personal, Home, Business, and Education" in response

def test_chatbot_empty_message():
    response = get_chatbot_response("")
    assert "didn't receive a message" in response

def test_chatbot_unknown():
    response = get_chatbot_response("Why is the sky blue?")
    assert "didn't quite understand" in response
