# STUDEX — Full Stack Project

## Folder Structure
```
studex/
├── backend/    ← Node.js + Express + PostgreSQL (Sequelize)
└── frontend/   ← React + Vite
```

## Quick Start

### 1. Setup PostgreSQL
```bash
psql postgres -c "CREATE DATABASE studex_db;"
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # fill in DB_USER, DB_PASS, JWT_SECRET
npm install
npm run seed                 # creates tables + 9 courses + demo users
npm run dev                  # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                  # runs on http://localhost:5173
```

### Demo accounts (after seeding)
| Email             | Password    | Level |
|-------------------|-------------|-------|
| ada@studex.io     | password123 | Lv.9  |
| alan@studex.io    | password123 | Lv.7  |
| demo@studex.io    | password123 | Fresh |

See backend/README.md for full API docs and deployment guide.
