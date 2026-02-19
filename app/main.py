from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from app.api.routers import (
    health_router,
    loans_router,
    eligibility_router,
    emi_router,
    chat_router
)
from app.core.config import settings, logger
import time


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME}...")
    yield
    logger.info("Shutting down...")


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")


# Middleware for logging requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = "{0:.2f}".format(process_time)
    logger.info(
        f"rid={request.headers.get('X-Request-ID', 'N/A')} "
        f"method={request.method} path={request.url.path} "
        f"status_code={response.status_code} "
        f"completed_in={formatted_process_time}ms"
    )
    return response


# Standard error handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "An internal server error occurred."},
    )


# Include Routers
app.include_router(health_router, tags=["Health"])
app.include_router(loans_router, prefix=f"{settings.API_V1_STR}/loans", tags=["Loans"])
app.include_router(eligibility_router, prefix=f"{settings.API_V1_STR}/eligibility", tags=["Eligibility"])
app.include_router(emi_router, prefix=f"{settings.API_V1_STR}/emi-calculator", tags=["EMI Calculator"])
app.include_router(chat_router, prefix=f"{settings.API_V1_STR}/chat", tags=["Chatbot"])


if __name__ == "__main__":
    try:
        import uvicorn
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
    except ImportError as e:
        print(f"Error: {e}. Please ensure uvicorn is installed and your environment is active.")