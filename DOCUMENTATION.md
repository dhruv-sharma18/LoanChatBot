# LoanBot Pro — Project Documentation

**Repository:** github.com/dhruv-sharma18/LoanChatBot  
**Stack:** Python, FastAPI, Groq, Llama 3.3 70B, Pydantic, React, TailwindCSS

---

## What is this

LoanBot Pro is a full-stack AI-powered loan assistance platform. You ask it questions about loan types, eligibility, or EMI calculations, and it answers from a curated knowledge base of loan policies — backed by a real LLM rather than a keyword matcher.

It has four main features: a context-aware AI chatbot, a structured eligibility checker, an EMI calculator, and a loan catalog. The chatbot remembers your conversation within a session, so you can ask follow-up questions naturally without repeating context every time.

The original version was rule-based — it matched keywords like "home loan" or "interest rate" and returned templated responses. That approach is fragile and can't handle anything slightly off-script. Swapping it for a Groq-backed LLM with a loan-aware system prompt solved that entirely. The model now understands intent, handles rephrasing, and gives coherent multi-sentence answers instead of canned responses.

---

## Architecture

The backend is a FastAPI application with four routers — chat, loans, eligibility, and EMI. The frontend is a React/TailwindCSS SPA that talks to the backend over a REST API.

The chat system works like this:

```
user sends a message
  → session history retrieved (or created)
  → new message appended to history
  → [system prompt (loan policies)] + [full history] → Groq (Llama 3.3 70B)
  → reply returned and saved to history
  → response sent to frontend
```

The system prompt is built at startup by reading `loan_policies.json` and injecting the full policy data as structured context. The model is constrained to only use that data — it won't invent loan products or rates that aren't in the file.

---

## Chatbot

The chatbot implementation lives in `app/services/chat_service.py`.

**Session history.** Each conversation is tracked by a `session_id`, which the frontend generates on first load and reuses for the rest of the session. History is stored in a server-side dict keyed by session ID. Each entry is a list of `{role, content}` objects — the same format the Groq API expects, so the full history can be passed directly to the model.

History is capped at 20 messages per session (10 exchanges). When the cap is hit, the oldest messages get trimmed. This keeps the context window under control without ending the conversation.

**System prompt.** Built once at module load time in `_build_system_prompt()`. It reads `LOAN_POLICIES` and serializes it to JSON, then embeds it in a prompt that tells the model what company it works for, what products it knows about, and how to behave. The instructions include using ₹ for currency, keeping answers short unless asked for detail, and refusing to answer anything unrelated to loans.

**Groq call.** The model receives the system prompt plus the full session history on every request. Temperature is set to 0.4 for focused, factual answers. `max_tokens` is 512 — enough for a complete response without wasting tokens on padding.

**Error handling.** If the Groq API call fails for any reason, the service returns a fallback message telling the user to try again. The error is logged. Nothing crashes for the user.

---

## Loan Policies

All loan data lives in `loan_policies.json`. The file drives three things at once: the chatbot's knowledge base, the eligibility checker, and the loan catalog endpoint.

Each entry looks like this:

```json
{
  "type": "Home",
  "description": "...",
  "max_amount": 5000000,
  "interest_rate": 8.5,
  "tenure_years": 30,
  "min_age": 21,
  "max_age": 60,
  "min_income": 30000,
  "min_cibil": 700
}
```

Adding or changing a loan product requires no code changes — just edit the JSON. The service loads it at startup and every component that needs it reads from the same `LOAN_POLICIES` list.

---

## Eligibility

The eligibility endpoint in `app/services/loan_service.py` runs a deterministic check against the policy constraints. It checks age, income, and CIBIL score in order and returns the first failure if any check fails. On success it calculates a maximum eligible amount: 50% of annual income, capped at the policy's `max_amount`.

This is intentionally not done by the LLM. Eligibility checking needs to be reliable and auditable — the model can misinterpret numbers or hedge when it shouldn't. Running it as structured logic gives exact yes/no answers with clear reasons.

---

## EMI Calculator

Standard EMI formula:

```
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]

P = Principal
R = Monthly interest rate (annual rate / 12 / 100)
N = Tenure in months
```

Implemented in `app/services/emi_service.py`. Returns monthly EMI, total payable, and total interest. Input is validated by Pydantic — all three fields must be positive numbers.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | server status |
| GET | `/api/v1/loans` | list all loan products |
| POST | `/api/v1/eligibility` | check eligibility for a loan type |
| POST | `/api/v1/emi-calculator` | calculate EMI |
| POST | `/api/v1/chat` | send a message to the chatbot |

FastAPI generates interactive docs at `/docs`. Every endpoint can be tested there directly — no Postman needed.

### POST /api/v1/chat

```json
// Request
{
  "message": "What is the interest rate for a home loan?",
  "session_id": "abc-123"
}

// Response
{
  "reply": "The Home loan has an interest rate of 8.5% per annum...",
  "session_id": "abc-123"
}
```

`session_id` is optional on the first message. If omitted, one is generated and returned. Pass it back on every subsequent message to maintain conversation continuity.

### POST /api/v1/eligibility

```json
// Request
{
  "age": 30,
  "income": 50000,
  "cibil_score": 750,
  "employment_status": "Salaried",
  "loan_type": "Home"
}

// Response
{
  "is_eligible": true,
  "message": "Congratulations! You are eligible for this loan.",
  "max_amount": 3000000
}
```

### POST /api/v1/emi-calculator

```json
// Request
{
  "principal": 1000000,
  "annual_rate": 8.5,
  "tenure_years": 20
}

// Response
{
  "emi": 8678.23,
  "total_payable": 2082774.64,
  "total_interest": 1082774.64
}
```

---

## File Breakdown

```
newLoanBot/
├── app/
│   ├── api/
│   │   └── routers/
│   │       ├── chat.py          # chat endpoint
│   │       ├── eligibility.py   # eligibility endpoint
│   │       ├── emi.py           # EMI calculator endpoint
│   │       ├── loans.py         # loan catalog endpoint
│   │       └── health.py        # health check
│   ├── core/
│   │   └── config.py            # settings, logging, env vars
│   ├── models/
│   │   └── schemas.py           # Pydantic request/response models
│   ├── services/
│   │   ├── chat_service.py      # Groq integration, session history
│   │   ├── loan_service.py      # policy loading, eligibility logic
│   │   └── emi_service.py       # EMI calculation
│   └── main.py                  # app setup, middleware, router registration
├── frontend/
│   └── src/
│       ├── components/          # ChatSection, EMISection, EligibilitySection, etc.
│       ├── App.jsx
│       └── main.jsx
├── tests/
│   ├── test_chat.py
│   ├── test_emi.py
│   └── test_loan_eligibility.py
├── loan_policies.json           # all loan product data
├── conftest.py                  # pytest path fix
├── requirements.txt
├── .env.example
└── .gitignore
```

**`config.py`** — loads `GROQ_API_KEY` and `GROQ_MODEL` from `.env` using `pydantic-settings`. The key has no default — if it's missing the app fails at startup with a clear validation error rather than a cryptic crash on the first API call.

**`chat_service.py`** — the full chatbot implementation. Builds the system prompt, manages session histories, calls Groq, and handles errors. No state other than `_session_histories` — everything else is reconstructed on each call.

**`loan_service.py`** — loads `loan_policies.json` at import time. `get_all_loans()` returns the full catalog. `evaluate_eligibility()` runs the constraint checks and returns a structured response.

**`schemas.py`** — all Pydantic models. One schema per request and one per response. Nothing else goes in here.

**`main.py`** — mounts all routers, sets up CORS for the frontend dev server, adds request logging middleware, and registers a global exception handler. CORS allows `localhost:5173` (Vite dev server) and `localhost:3000`.

---

## Setup

**Requirements:** Python 3.10+, Node.js 18+, a Groq API key (free at [console.groq.com](https://console.groq.com))

```bash
git clone https://github.com/dhruv-sharma18/LoanChatBot.git
cd LoanChatBot
```

Create a virtual environment and install dependencies:

```bash
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your key:

```
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Start the frontend (in a separate terminal):

```bash
cd frontend
npm install
npm run dev
```

Backend runs at `http://localhost:8000`. Frontend dev server at `http://localhost:5173`. Interactive API docs at `http://localhost:8000/docs`.

---

## Testing

```bash
pytest                              # all tests
pytest tests/test_chat.py           # chatbot only
pytest tests/test_emi.py            # EMI calculator
pytest tests/test_loan_eligibility.py  # eligibility checker
```

Tests import the `app` package via `conftest.py` at the project root — no manual `PYTHONPATH` setup needed.

Chat tests hit the real Groq API. The others are fully local.

---

## Problems I Ran Into

**Hardcoded API key in git history.**  
The API key was committed directly in `config.py` during initial setup and GitHub's secret scanning blocked the push. Fixed by moving it to `.env`, amending the commit to remove the key, and force pushing. The key was also rotated since it had already been exposed. The `.env` was already in `.gitignore` — the gap was not using it from the start.

**pytest couldn't import the `app` package.**  
Running `pytest` from the project root threw `ModuleNotFoundError: No module named 'app'` because the project root wasn't in `sys.path`. Fixed by adding `conftest.py` at the root that inserts the project directory into `sys.path` at test collection time. This is the standard fix — pytest picks up `conftest.py` automatically.

**Rule-based chatbot breaking on anything off-script.**  
The original chatbot used keyword matching. Anything phrased slightly differently from what the rules expected returned a fallback response. Replaced entirely with a Groq-backed LLM and a loan-aware system prompt. The model handles rephrasing, follow-up questions, and ambiguous queries naturally.

---

## Limitations

- Session history lives in server memory — it resets if the server restarts
- No authentication — fine for local use or demos, not for public deployment
- One Groq model call per message — no streaming support
- Chat tests hit the live Groq API, so they need a valid key and network access to pass

---

## What I Learned

The rule-based to LLM migration was the most instructive part. The rule-based version felt finished until you tested it with real questions — then the cracks showed up immediately. Any rephrasing, any follow-up, anything slightly outside the defined patterns would break it. Replacing it with a properly prompted LLM made those problems disappear, which made the value of prompt engineering very concrete.

The git secret scanning incident was also a useful lesson. The key was in a committed file, GitHub caught it, and the fix required rewriting git history rather than just editing a file. Understanding how to clean git history and why you can't just delete a file and recommit is something that sticks after you've had to do it once under pressure.

Building something real — even a small project — surfaces a different category of problems than tutorials do.
