import sys
import os

# Add backend directory to sys.path so 'app' package is found
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app  # noqa: F401
