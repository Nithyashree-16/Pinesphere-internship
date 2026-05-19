import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("AIzaSyCdBaKGnWU_16Mi2Ox_YifXFyJqfJFL62g"))

CATEGORIES = [
    "Technical Issue", "Billing", "Account Access",
    "Feature Request", "General Inquiry", "Service Outage", "Other"
]
PRIORITIES = ["low", "medium", "high", "critical"]

def classify_ticket(description: str) -> dict:
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
You are an AI assistant for a complaint and ticket management system.

Analyze this complaint and classify it.

Description: "{description}"

Respond with ONLY a valid JSON object:
{{
  "category": "<one of: Technical Issue, Billing, Account Access, Feature Request, General Inquiry, Service Outage, Other>",
  "priority": "<one of: low, medium, high, critical>",
  "reasoning": "<one short sentence>"
}}

Rules:
- critical = system down, data loss, complete outage
- high = major feature broken, billing error, cannot login
- medium = partial issue, slow performance
- low = feature request, minor UI issue, general question

Only output the JSON. Nothing else.
"""

    try:
        response = model.generate_content(prompt)
        raw = response.text.strip()

        # Clean markdown if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)

        if result.get("category") not in CATEGORIES:
            result["category"] = "General Inquiry"
        if result.get("priority") not in PRIORITIES:
            result["priority"] = "medium"

        return result

    except Exception as e:
        print(f"Classify error: {e}")
        return {
            "category": "General Inquiry",
            "priority": "medium",
            "reasoning": "Could not classify automatically."
        }