from app.services.chat_service import get_chatbot_response

def test_chatbot_greeting():
    response = get_chatbot_response("Hello")
    assert len(response) > 0
    # The response should at least be polite and mention loans or assistance
    assert any(keyword in response.lower() for keyword in ["loan", "assistant", "help", "greet"])

def test_chatbot_loan_types():
    response = get_chatbot_response("Tell me about types of loans")
    # Should mention at least one of the loan types from policies
    assert any(ltype in response for ltype in ["Home", "Personal", "Car", "Education"])

def test_chatbot_empty_message():
    response = get_chatbot_response("")
    assert "didn't receive a message" in response

def test_chatbot_unknown():
    # LLMs will usually answer most things, so we check if it responds politely
    response = get_chatbot_response("Why is the sky blue?")
    assert len(response) > 0
