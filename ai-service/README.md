# AI Service — Mrittika

## Setup Steps

### Step 1 — Make sure Python is installed
```
python --version
```
Should show Python 3.8 or above.

### Step 2 — Get Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / Login
3. Go to API Keys → Create Key
4. Copy the key

### Step 3 — Add API key to .env file
Open `.env` and replace:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```
With your actual key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

### Step 4 — Install packages
```
pip install -r requirements.txt
```

### Step 5 — Run the service
```
python app.py
```
Service starts on http://localhost:8000

---

## Endpoints

### POST /api/ai/classify
**Body:**
```json
{ "description": "I cannot login to my account after the update" }
```
**Response:**
```json
{
  "category": "Account Access",
  "priority": "high",
  "reasoning": "User cannot login which is a major access issue."
}
```

### GET /api/ai/summarize/<ticket_id>
**Response:**
```json
{
  "summary": "The user is experiencing a login issue following a recent update..."
}
```

---

## Important Notes
- This service runs on PORT 8000
- Nithyashree's backend must be running on PORT 5000 for summarize to work
- Visrutha's frontend runs on PORT 5173

## Team Ports
| Service   | Port | Person       |
|-----------|------|--------------|
| Frontend  | 5173 | Visrutha     |
| Backend   | 5000 | Nithyashree  |
| AI Service| 8000 | Mrittika     |
