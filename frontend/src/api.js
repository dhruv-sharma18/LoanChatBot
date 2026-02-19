const API_BASE_URL = 'http://localhost:8000/api/v1';

export const chatWithBot = async (message, sessionId) => {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId }),
    });
    return response.json();
};

export const calculateEMI = async (principal, annualRate, tenureYears) => {
    const response = await fetch(`${API_BASE_URL}/emi-calculator/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ principal, annual_rate: annualRate, tenure_years: tenureYears }),
    });
    return response.json();
};

export const checkEligibility = async (data) => {
    const response = await fetch(`${API_BASE_URL}/eligibility/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const getLoans = async () => {
    const response = await fetch(`${API_BASE_URL}/loans/`);
    return response.json();
};

export const getLoanDna = async (data) => {
    const response = await fetch(`${API_BASE_URL}/dna/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};
