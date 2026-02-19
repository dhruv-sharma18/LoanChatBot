from fastapi import APIRouter
from app.models.schemas import ChatMessage, ChatResponse
from app.services.chat_service import get_chatbot_response
import uuid

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(msg: ChatMessage):
    session_id = msg.session_id or str(uuid.uuid4())
    reply = get_chatbot_response(msg.message, session_id=session_id)
    return ChatResponse(reply=reply, session_id=session_id)