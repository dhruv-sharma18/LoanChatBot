# Loan Assistance Chatbot API

A production-ready FastAPI backend for a loan assistance service.

## Features
- **Loan Information**: Detailed list of available loans (Personal, Home, Business, Education).
- **Eligibility Evaluation**: Automated check based on age, income, CIBIL, etc.
- **EMI Calculator**: Standard financial formula implementation.
- **Groq AI Chatbot**: Context-aware assistance powered by Llama 3 via Groq API.
- **Structured Logging & Error Handling**.

## Setup Instructions

1. **Clone the repository** (or navigate to the directory).
2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure Environment Variables**:
   - Copy `.env.example` to `.env` and fill in your Groq API key.
5. **Configure Loan Policies**:
   - Loan types and eligibility criteria are managed in `loan_policies.json`.
   - Update interest rates or limits directly in this file without changing any code.
6. **Run the Application**:
   ```bash
   uvicorn app.main:app --reload
   ```

## Testing

This project uses `pytest` for unit testing the core logic (EMI calculation and loan eligibility).

To run all tests:
```bash
pytest
```

## API Endpoints

- **Health Check**: `GET /health`
- **Loans**: `GET /api/v1/loans`
- **Eligibility**: `POST /api/v1/eligibility`
- **EMI Calculator**: `POST /api/v1/emi-calculator`
- **Chat**: `POST /api/v1/chat`

## Example Requests

### Get Loans
```bash
curl -X GET http://localhost:8000/api/v1/loans
```

### Check Eligibility
```bash
curl -X POST http://localhost:8000/api/v1/eligibility \
-H "Content-Type: application/json" \
-d '{
  "age": 30,
  "income": 50000,
  "cibil_score": 750,
  "employment_status": "Salaried",
  "loan_type": "Home"
}'
```

### Calculate EMI
```bash
curl -X POST http://localhost:8000/api/v1/emi-calculator \
-H "Content-Type: application/json" \
-d '{
  "principal": 1000000,
  "annual_rate": 8.5,
  "tenure_years": 20
}'
```

### Chat with Bot
```bash
curl -X POST http://localhost:8000/api/v1/chat \
-H "Content-Type: application/json" \
-d '{
  "message": "What are the home loan options?"
}'
```

---

For detailed technical documentation, see [DOCUMENTATION.md](DOCUMENTATION.md).
