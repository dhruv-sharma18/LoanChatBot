import json
from anthropic import Anthropic
from app.core.config import settings, logger
from app.models.schemas import DNAData, DNAResponse

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

def generate_loan_dna(data: DNAData) -> DNAResponse:
    """
    Generates a personalized financial DNA profile using Anthropic Claude.
    Returns scores, insights, and a visualization sequence.
    """
    
    prompt = f"""
    You are a high-end financial geneticist. Your job is to transform a user's financial inputs into a "Loan DNA" profile.
    
    User Financial Profile:
    - Monthly Income: ₹{data.income}
    - Monthly Expenses: ₹{data.expenses}
    - Existing EMI: ₹{data.existing_emi}
    - CIBIL Score: {data.cibil_score}
    - Savings: ₹{data.savings}
    - Employment: {data.employment_status}
    - Primary Goal: {data.goal}
    
    Requirements:
    1. Score the user (0-100) on 5 dimensions: Spend, Save, Credit, Stability, Growth.
    2. Generate a "DNA Sequence" for visualization. This should be a list of 10 nodes, each with:
       - type: "adenine" | "thymine" | "cytosine" | "guanine"
       - intensity: 0.1 to 1.0 (float)
    3. Provide 3 deep insight cards (Title, Description, Impact).
    4. Write a concise, strategic loan strategy (max 3 sentences).
    
    Response MUST be valid JSON matching this schema:
    {{
      "scores": {{ "spend": int, "save": int, "credit": int, "stability": int, "growth": int }},
      "dna_sequence": [ {{ "type": string, "intensity": float }}, ... ],
      "insights": [ {{ "title": string, "description": string, "impact": string }}, ... ],
      "strategy": string
    }}
    
    BE PROFESSIONAL, INSIGHTFUL, AND BRUTALLY HONEST.
    """
    
    try:
        response = client.messages.create(
            model=settings.ANTHROPIC_MODEL,
            max_tokens=1500,
            temperature=0.4,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        # Extract the JSON content from the response
        content = response.content[0].text
        # In case the model adds preamble, try to find the JSON block
        if "{" in content:
            content = content[content.find("{"):content.rfind("}")+1]
            
        data_dict = json.loads(content)
        return DNAResponse(**data_dict)
        
    except Exception as e:
        logger.error(f"Anthropic API error: {e}")
        # Return a fail-safe response if API fails
        return DNAResponse(
            scores={"spend": 50, "save": 50, "credit": 50, "stability": 50, "growth": 50},
            dna_sequence=[{"type": "adenine", "intensity": 0.5}] * 10,
            insights=[{"title": "Error", "description": "Could not connect to AI services.", "impact": "High"}],
            strategy="I'm having trouble analyzing your DNA right now. Please try again later."
        )
