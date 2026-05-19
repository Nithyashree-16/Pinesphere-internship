import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

CATEGORIES = [
    "Technical Issue",
    "Billing",
    "Account Access",
    "Feature Request",
    "General Inquiry",
    "Service Outage",
    "Other"
]

PRIORITIES = ["low", "medium", "high", "critical"]
