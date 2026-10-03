Tixxgo — Travel Booking Platform
1. Project Overview
Tixxgo is a travel booking platform designed to integrate a primary travel inventory supplier while keeping the platform extensible for additional suppliers.
The current implementation demonstrates the complete flight-booking journey:

Search
  ↓
Supplier Search
  ↓
Normalize Offers
  ↓
Compare / Group Offers
  ↓
Price Revalidation
  ↓
Accept Price Change
  ↓
Traveller Details
  ↓
Booking
  ↓
Payment
  ↓
Supplier Booking
  ↓
Confirmation

2. Technology Stack
Backend
- Node.js
- Express.js
- JavaScript / ES Modules
- Prisma ORM
- MySQL
- Redis
- REST APIs
Frontend
- Angular
- TypeScript
- HTML5
- CSS3
- Angular Router
- HttpClient
- jsPDF
Infrastructure
- Docker
- Docker Compose




                         ┌─────────────────────┐
                         │   Angular Frontend  │
                         │     Port 4200       │
                         └──────────┬──────────┘
                                    │
                                    │ REST / JSON
                                    ▼
                         ┌─────────────────────┐
                         │  Node.js + Express  │
                         │     Port 5000       │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             ┌────────────┐  ┌────────────┐  ┌─────────────┐
             │  Supplier  │  │   MySQL    │  │    Redis    │
             │  Gateway   │  │  Database  │  │    Cache    │
             └─────┬──────┘  └────────────┘  └─────────────┘
                   │
            ┌──────┴──────┐
            ▼             ▼
       ┌─────────┐   ┌───────────┐
       │   TBO   │   │ TripJack  │
       │ Adapter │   │  Adapter  │
       └────┬────┘   └─────┬─────┘
            │              │
            ▼              ▼
       Mock Supplier    Mock Supplier 

Main Design Principle
The application communicates with suppliers through a common SupplierGateway.
Application
     ↓
SupplierGateway
     ↓
Supplier Adapter
     ↓
Supplier API

This prevents supplier-specific logic from spreading throughout the application.
5. Setup and Run
Prerequisites
For Docker:
- Docker Desktop
- Docker Compose
For local development:
- Node.js 22+
- MySQL 8+
- Redis 7+


Option A — Run with Docker
From the project root:
cd tixxgo

Build:
docker compose build

Start:
docker compose up

Or run in background:
docker compose up -d

Check:
docker compose ps

Expected services:
tixxgo-backend
tixxgo-mysql
tixxgo-redis

Backend:
http://localhost:5000

Frontend:
http://localhost:4200

Health check:
http://localhost:5000/api/health

6. Local Backend Setup
cd backend
npm install

Create:
backend/.env

Example:
PORT=5000

DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/tixxgo"

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=tixxgo

REDIS_URL=redis://localhost:6379
REDIS_SEARCH_TTL=300

Generate Prisma Client:
npx prisma generate

Run migrations:
npx prisma migrate deploy

Start backend:
npm start

7. Local Frontend Setup
cd frontend
npm install
ng serve

Open:
http://localhost:4200