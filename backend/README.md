# Support Ticket System — Backend

Node.js + Express + MongoDB backend for the Support Ticket System with AI classification.

## Tech Stack
- **Express** — REST API
- **MongoDB + Mongoose** — Database
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Anthropic Claude API** — AI ticket classification & summarization

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   ├── ticketController.js # CRUD + comments + stats
│   │   └── aiController.js     # AI classify & summarize
│   ├── middleware/
│   │   └── auth.js             # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Ticket.js           # Ticket schema (with comments)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   └── aiRoutes.js
│   └── server.js               # App entry point
├── .env.example
├── .gitignore
└── package.json
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — a long random secret string
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)

### 3. Run in development
```bash
npm run dev
```

### 4. Run in production
```bash
npm start
```

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET  | `/api/auth/me` | Get current user profile |
| PUT  | `/api/auth/me` | Update name/avatar |
| PUT  | `/api/auth/change-password` | Change password |

### Tickets
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET  | `/api/tickets` | User/Admin | List tickets (filtered) |
| GET  | `/api/tickets/my` | User | My tickets only |
| GET  | `/api/tickets/stats` | Admin | Dashboard stats |
| POST | `/api/tickets` | User | Create ticket |
| GET  | `/api/tickets/:id` | User/Admin | Get ticket detail |
| PUT  | `/api/tickets/:id` | User/Admin | Update ticket |
| DELETE | `/api/tickets/:id` | User/Admin | Delete ticket |
| POST | `/api/tickets/:id/comments` | User/Admin | Add comment |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/classify` | Auto-classify category & priority from description |
| GET  | `/api/ai/summarize/:id` | Generate AI summary of a ticket |

## Merging with Frontend

1. Put `backend/` and `frontend/` in the same GitHub repo root.
2. Update `frontend/src/services/api.js` → `BASE_URL` for production deployment.
3. Use separate `npm install` and `npm run dev` in each folder during development.

### Recommended repo structure:
```
your-repo/
├── frontend/    (existing React app)
├── backend/     (this folder)
└── README.md
```
