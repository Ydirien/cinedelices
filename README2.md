# CineDelices — Dev Environment Setup

## Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React 19 + TypeScript + Vite      |
| Backend  | Express 5 + TypeScript + Prisma   |
| Database | PostgreSQL 17                     |
| Tools    | Docker Compose + Adminer          |

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Node.js](https://nodejs.org/) v20+
- [Git](https://git-scm.com/)

---

## 1. Clone the project

```bash
git clone git@github.com:O-clock-Helsinki/projet-cda-CineDelices.git
cd projet-cda-CineDelices
```

---

## 2. Environment variables

### Root (Docker Compose)

```bash
cp .env.docker.example .env
```

Edit `.env` if needed (defaults work out of the box for local dev):

```env
POSTGRES_USER=cinedelices
POSTGRES_PASSWORD=cinedelices
POSTGRES_DB=cinedelices
POSTGRES_LOCAL_PORT=5454
API_LOCAL_PORT=3010
ADMINER_LOCAL_PORT=8080
CLIENT_LOCAL_PORT=8000
```

### API

```bash
cp api/.env.example api/.env
```

Fill in the required values in `api/.env`:

```env
NODE_ENV=development
PORT=3010
HOST=0.0.0.0
DATABASE_URL=postgres://cinedelices:cinedelices@localhost:5454/cinedelices
ACCESS_TOKEN_SECRET=a_secret_key_of_your_choice
ALLOWED_ORIGINS=http://localhost:5173
LOG_LEVEL=info
```

> `DATABASE_URL` uses `localhost:5454` for local dev (outside Docker), `db:5432` inside Docker.

---

## 3. Start the project

### Option A — Full Docker (recommended)

```bash
docker compose up --build
```

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:8000     |
| API      | http://localhost:3010     |
| Adminer  | http://localhost:8080     |

### Option B — Local dev (hot reload)

Start only the database in Docker:

```bash
docker compose up db -d
```

Then in two separate terminals:

```bash
# Terminal 1 — API
cd api
npm install
npm run dev
```

```bash
# Terminal 2 — Frontend
cd front
npm install
npm run dev
```

Frontend available at **http://localhost:5173**

---

## 4. Database

```bash
cd api

# Apply migrations
npm run db:migrate:dev

# Seed with sample data
npm run db:seed

# Reset DB (drop + migrate + seed)
npm run db:reset

# Open Prisma Studio (visual DB browser)
npm run db:studio
```

---

## 5. Useful scripts

### API (`cd api`)

| Command                  | Description                        |
|--------------------------|------------------------------------|
| `npm run dev`            | Start API with hot reload          |
| `npm run build`          | Compile TypeScript                 |
| `npm run lint`           | Run ESLint                         |
| `npm run test`           | Run unit + integration tests       |
| `npm run db:studio`      | Open Prisma Studio                 |

### Frontend (`cd front`)

| Command          | Description                  |
|------------------|------------------------------|
| `npm run dev`    | Start Vite dev server        |
| `npm run build`  | Build for production         |
| `npm run lint`   | Run ESLint                   |

---

## 6. Project structure

```
projet-cda-CineDelices/
├── api/                  # Express API
│   ├── src/              # Routes, controllers, models
│   ├── prisma/           # Schema + migrations
│   └── server.ts         # Entry point
├── front/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── index.html
├── bdd/                  # Database documentation
├── docker-compose.yml
└── .env.docker.example
```

---