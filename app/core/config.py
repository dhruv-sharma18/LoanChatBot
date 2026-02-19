import logging
import sys
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Loan Assistance Chatbot"
    API_V1_STR: str = "/api/v1"
    
    # Base directory of the project
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Path to the loan policies JSON file
    LOAN_POLICIES_FILE: str = os.path.join(BASE_DIR, "loan_policies.json")
    
    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()

# Setup logging
logging.basicConfig(
    stream=sys.stdout,
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
