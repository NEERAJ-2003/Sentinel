import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.seed import seed_database
from app.routers import log, risk, approve, trail, verify, tamper, simulate

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and demo seed on startup
    try:
        Base.metadata.create_all(bind=engine)
        seed_database()
        print("Sentinel Backend: Database tables checked and seed verified.")
    except Exception as e:
        print(f"Startup Warning: Could not initialize database immediately ({e})")
    yield

app = FastAPI(
    title="Sentinel",
    description="Cryptographic trust, risk analysis, policy control, and tamper-evident audit layer for IBM Bob autonomous coding agents.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS — accept explicit origins from env, fall back to wildcard for local dev
_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
_allowed_origins: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]
if not _allowed_origins:
    _allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(log.router)
app.include_router(risk.router)
app.include_router(approve.router)
app.include_router(trail.router)
app.include_router(verify.router)
app.include_router(tamper.router)
app.include_router(simulate.router)

@app.get("/")
def root():
    return {
        "system": "Sentinel Trust & Governance Engine",
        "status": "ONLINE",
        "version": "1.0.0",
        "docs_url": "/docs",
        "mission": "Observe -> Analyze -> Control -> Record -> Verify"
    }

@app.get("/health")
def health():
    return {"status": "HEALTHY"}
