import json
from groq import Groq
from app.core.config import settings, logger
from app.services.loan_service import LOAN_POLICIES

# ── Groq client ──────────────────────────────────────────────────────────────
client = Groq(api_key=settings.GROQ_API_KEY)

# ── Build a rich system prompt from your loan_policies.json ──────────────────
def _build_system_prompt() -> str:
    policies_text = json.dumps(LOAN_POLICIES, indent=2)
    return f"""You are LoanBot Pro, a professional and friendly AI loan advisor for a financial services company.

You have access to the following loan products offered by the company:

{policies_text}

Your responsibilities:
- Answer questions about loan types, interest rates, eligibility criteria, and tenures using ONLY the data above.
- Help users understand EMI calculations (formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]).
- Guide users through eligibility requirements (age, income, CIBIL score, employment status).
- Be concise, accurate, and professional. Use ₹ for Indian Rupees.
- If a user asks something unrelated to loans or finance, politely redirect them.
- Never make up loan products or rates not listed above.
- Format currency values clearly, e.g. ₹5,00,000 or ₹50 Lakhs.
- Keep responses short and helpful — 2 to 5 sentences unless more detail is asked.
"""

SYSTEM_PROMPT = _build_system_prompt()

# ── Per-session conversation history ─────────────────────────────────────────
# { session_id: [ {"role": "user"|"assistant", "content": "..."}, ... ] }
_session_histories: dict[str, list[dict]] = {}

MAX_HISTORY = 20  # keep last 20 messages (10 exchanges) per session


def get_chatbot_response(message: str, session_id: str | None = None) -> str:
    if not message or not message.strip():
        return "I didn't receive a message. How can I help you today?"

    # ── Retrieve or initialise history for this session ──
    history = _session_histories.setdefault(session_id or "__anon__", [])

    # Append the new user message
    history.append({"role": "user", "content": message.strip()})

    # Trim to last MAX_HISTORY messages to avoid exceeding context limits
    if len(history) > MAX_HISTORY:
        history[:] = history[-MAX_HISTORY:]

    # ── Call Groq ────────────────────────────────────────────────────────────
    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *history,
            ],
            temperature=0.4,       # focused, factual answers
            max_tokens=512,
            top_p=0.9,
        )

        reply = response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Groq API error: {e}")
        reply = (
            "I'm having trouble connecting to my AI service right now. "
            "Please try again in a moment."
        )

    # ── Store assistant reply in history ─────────────────────────────────────
    history.append({"role": "assistant", "content": reply})

    return reply


def clear_session(session_id: str) -> None:
    """Optionally call this to wipe a session's history."""
    _session_histories.pop(session_id, None)