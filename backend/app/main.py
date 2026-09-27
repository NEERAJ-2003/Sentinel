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

# Enable wide CORS for React frontend (Vite port 5173, Next port 3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
