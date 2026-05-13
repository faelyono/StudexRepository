# 🎓 STUDEX — Gamified Computer Engineering Study Platform

> Full-stack study platform with flashcards, XP multipliers, streaks, and leaderboards.

---

## 📁 Project Structure

```
studex/
├── backend/               ← Node + Express + PostgreSQL
│   ├── config/
│   │   └── database.js    ← Sequelize connection
│   ├── controllers/       ← Business logic (thin, delegates to services)
│   ├── middleware/
│   │   ├── auth.js        ← JWT verify middleware
│   │   └── errorHandler.js
│   ├── models/            ← Sequelize models + associations
│   ├── routes/            ← Express route definitions
│   ├── seeders/
│   │   └── seed.js        ← Full CE course content + demo users
│   ├── services/
│   │   └── gamificationService.js  ← All XP/level/streak logic
│   ├── .env.example
│   ├── package.json
│   └── server.js          ← Express app entry point
└── frontend/              ← React + Vite (from your zip)
```

---

## ⚡ QUICK START (Local Development)

### Prerequisites
- **Node.js** v18+
- **PostgreSQL** v14+ running locally
- **npm** or **yarn**

---

### Step 1 — Set up PostgreSQL

**On macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
psql postgres -c "CREATE DATABASE studex_db;"
psql postgres -c "CREATE USER studex_user WITH PASSWORD 'yourpassword';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE studex_db TO studex_user;"
```

**On Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE studex_db;"
sudo -u postgres psql -c "CREATE USER studex_user WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE studex_db TO studex_user;"
```

**On Windows:**
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run installer, set a password for the `postgres` user
3. Open pgAdmin or psql and run:
```sql
CREATE DATABASE studex_db;
```

---

### Step 2 — Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studex_db
DB_USER=studex_user      # or postgres
DB_PASS=yourpassword
JWT_SECRET=any_long_random_string_here_make_it_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

### Step 3 — Install & Seed

```bash
# Install backend dependencies
cd backend
npm install

# Run database seed (creates all tables + 9 courses + flashcards + demo users)
npm run seed
```

You should see:
```
✅ PostgreSQL connected
🗑  Tables reset
  📚 Linear Algebra seeded
  📚 Calculus seeded
  ... (all 9 courses)
✅ Enrollments created

🎉 Database seeded successfully!
────────────────────────────────────
Demo accounts (password: password123):
  ada@studex.io     (Level 9, 850 XP)
  alan@studex.io    (Level 7, 620 XP)
  demo@studex.io    (fresh account)
────────────────────────────────────
```

---

### Step 4 — Start Backend

```bash
# Development (auto-restarts on file changes)
npm run dev

# OR production
npm start
```

Backend runs at: **http://localhost:5000**

Test it:
```bash
curl http://localhost:5000/api/health
# → {"status":"ok","env":"development"}
```

---

### Step 5 — Start Frontend

```bash
cd frontend
npm install   # if not already done
npm run dev
```

Frontend runs at: **http://localhost:5173**

The `vite.config.js` should proxy `/api` to `localhost:5000`.
If it doesn't already, add this to `frontend/vite.config.js`:
```js
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 🧪 TESTING THE API

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
```

### Login (get token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@studex.io","password":"password123"}'
# Save the token from response
```

### Get courses (use token from above)
```bash
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Enroll in course 1
```bash
curl -X POST http://localhost:5000/api/courses/enroll/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get lessons for course 1
```bash
curl http://localhost:5000/api/courses/1/lessons \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get flashcards for topic 1
```bash
curl http://localhost:5000/api/courses/topics/1/flashcards \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Complete a study session
```bash
curl -X POST http://localhost:5000/api/study/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"topicId":1,"correctCount":8,"totalCount":10}'
```

### Get global leaderboard
```bash
curl http://localhost:5000/api/leaderboard/global \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎮 Gamification Logic

### XP Multipliers

| Accuracy | Multiplier |
|----------|-----------|
| 90–100%  | ×2.0      |
| 75–89%   | ×1.5      |
| 50–74%   | ×1.2      |
| <50%     | ×1.0      |

| Streak   | Multiplier |
|----------|-----------|
| 14+ days | ×2.0      |
| 7+ days  | ×1.5      |
| 3+ days  | ×1.2      |
| <3 days  | ×1.0      |

**Formula:** `finalXP = 15 × accMult × strMult`
**Level:** `floor(xp / 100) + 1`

---

## 🚀 PRODUCTION DEPLOYMENT

### Option A — Railway (Easiest, Free Tier)

1. Push code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add PostgreSQL service (click + → Database → PostgreSQL)
4. Set environment variables in Railway dashboard (same as .env)
5. Set `NODE_ENV=production`
6. Railway auto-detects Node.js and runs `npm start`

### Option B — Render

1. Push to GitHub
2. Go to https://render.com → New Web Service
3. Connect repo, set Build Command: `npm install`, Start Command: `npm start`
4. Add a PostgreSQL database from Render dashboard
5. Copy the `DATABASE_URL` and set individual DB env vars

### Option C — VPS (DigitalOcean / Linode)

```bash
# On your server
sudo apt update && sudo apt install nodejs npm postgresql -y

# Clone repo
git clone https://github.com/youruser/studex.git
cd studex/backend
cp .env.example .env && nano .env   # fill in prod values

npm install --production
npm run seed

# Use PM2 to keep alive
npm install -g pm2
pm2 start server.js --name studex
pm2 startup && pm2 save

# Nginx reverse proxy
sudo apt install nginx -y
# Configure /etc/nginx/sites-available/studex:
# proxy_pass http://localhost:5000;
```

### Build Frontend for Production
```bash
cd frontend
npm run build
# dist/ folder is generated — serve it via Nginx or copy to backend/public
```

When `NODE_ENV=production`, Express serves `../frontend/dist` automatically.

---

## 📊 Database Schema (ERD)

```
Users ─────────────────────────────────────
  id, name, email, password, xp, level,
  streak, lastLoginDate

Users ←──────── Enrollments ──────────→ Courses
                userId, courseId          id, title, description

Courses ──→ Lessons ──→ Topics ──→ Flashcards
             id, title   id, title   id, question, answer
             courseId    lessonId    topicId

Users ──→ Tasks
          id, title, description, dueDate, status, xpReward

Users ──→ StudySessions ──→ Topics
          correctCount, totalCount,
          multiplierUsed, xpEarned
```

---

## 🔐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ✗ | Register user |
| POST | /api/auth/login | ✗ | Login, returns JWT |
| GET | /api/auth/me | ✓ | Get current user |
| GET | /api/courses | ✓ | All courses + enrolled flag |
| POST | /api/courses/enroll/:id | ✓ | Enroll in course |
| GET | /api/courses/:id/lessons | ✓ | Lessons with topics |
| GET | /api/courses/topics/:id/flashcards | ✓ | Flashcards for topic |
| POST | /api/study/complete | ✓ | Submit session, earn XP |
| GET | /api/tasks | ✓ | User's tasks |
| POST | /api/tasks | ✓ | Create task |
| PUT | /api/tasks/:id | ✓ | Update task |
| DELETE | /api/tasks/:id | ✓ | Delete task |
| PATCH | /api/tasks/:id/complete | ✓ | Complete task, earn XP |
| GET | /api/leaderboard/global | ✓ | Top 50 global |
| GET | /api/leaderboard/course/:id | ✓ | Top 50 in course |

---

## 🛠 Troubleshooting

**"Connection refused" error:**
- Make sure PostgreSQL is running: `sudo systemctl status postgresql`
- Check your DB credentials in `.env`

**"Database does not exist":**
- Run: `psql -U postgres -c "CREATE DATABASE studex_db;"`

**Port 5000 in use:**
- Change `PORT=5001` in `.env`

**Frontend can't reach API:**
- Make sure backend is running on port 5000
- Check vite.config.js has the proxy setting
