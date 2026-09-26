import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env or .env.local in project root or backend folder
root_dir = Path(__file__).resolve().parent.parent.parent
env_local = root_dir / ".env.local"
env_file = root_dir / ".env"

if env_local.exists():
    load_dotenv(env_local)
elif env_file.exists():
    load_dotenv(env_file)
else:
    load_dotenv()

# Default to Docker Postgres on port 5433 if not provided
DEFAULT_DB_URL = "postgresql://sentinel:sentinel@localhost:5433/sentinel"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL)

# Normalize postgres:// to postgresql:// for SQLAlchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Remove Prisma-specific query parameters like ?schema=public
if "?schema=" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?schema=")[0]
elif "&schema=" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("&schema=public", "")

# API Configuration
API_PORT = int(os.getenv("PORT", "8000"))
API_HOST = os.getenv("HOST", "0.0.0.0")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
