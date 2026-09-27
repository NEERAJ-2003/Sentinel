"""
Vercel serverless entry point for the Sentinel FastAPI backend.
Vercel looks for a callable named `app` (or `handler`) in api/index.py.
"""
import sys
import os

# Make the backend package importable (api/ lives one level below backend/)
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app  # noqa: F401  — re-exported as the ASGI handler
