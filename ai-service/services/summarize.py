try:
    import google.generativeai as genai
except ImportError:
    genai = None
import requests
import os
from dotenv import load_dotenv

load_dotenv()
if genai:
    genai.configure(api_key=os.getenv("AIzaSyCdBaKGnWU_16Mi2Ox_YifXFyJqfJFL62g"))

def summarize_ticket(ticket_id: str) -> dict:
    try:
        # Fetch ticket from Nithyashree's backend
        response = requests.get(
            f"http://localhost:5000/api/tickets/{ticket_id}",
            timeout=5
        )

        if response.status_code != 200:
            return {"summary": "Could not fetch ticket details."}

        ticket = response.json()

        prompt = f"""
Summarize this support ticket in 2-3 clear sentences.
Focus on: what the problem is, how urgent it is, and what resolution might help.

Title: {ticket.get('title', 'N/A')}
Category: {ticket.get('category', 'N/A')}
Priority: {ticket.get('priority', 'N/A')}
Status: {ticket.get('status', 'N/A')}
Description: {ticket.get('description', 'N/A')}

Write a concise professional summary. No bullet points.
"""

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        summary = response.text.strip()
        return {"summary": summary}

    except Exception as e:
        print(f"Summarize error: {e}")
        return {"summary": "AI summary could not be generated at this time."}