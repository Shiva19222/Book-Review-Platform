# MERN Book Review Platform

Full-stack MERN application with JWT auth, book CRUD (with ownership), reviews (rating + text), pagination, average rating, and a React frontend with protected routes.

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- Frontend: React, React Router, Axios, Vite

## Project Structure
```
MERN-BookReview/
  backend/
    src/
      config/, controllers/, middleware/, models/, routes/, utils/
      server.js
    package.json, .env.example
  frontend/
    src/
      components/, context/, lib/, pages/
      App.jsx, main.jsx
    package.json, .env.example, vite.config.js, index.html
  README.md
```

## Prerequisites
- Node.js 18+
- MongoDB (choose one)
  - Local: MongoDB Community Server on Windows (recommended for local dev)
  - Remote: MongoDB Atlas (works too)

## 1) Backend Setup
```
cd backend
copy .env.example .env   # fill MONGODB_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000
```
Environment variables in `.env`:
```
PORT=5000
## Local MongoDB (recommended for dev)
MONGODB_URI=mongodb://127.0.0.1:27017/bookreview?directConnection=true

## Atlas example (optional)
# MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/bookreview
JWT_SECRET=supersecretchangeme
JWT_EXPIRES_IN=7d
```

Health check:
- Start server then open http://localhost:5000/health → `{ "status": "ok" }`

## 2) Frontend Setup
```
cd frontend
copy .env.example .env    # optional; default points to http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```
`frontend/.env` (optional):
```
VITE_API_URL=http://localhost:5000/api
```

## Features
- Auth: register/login, protected routes
- Books: create, edit, delete (owner only), list with pagination
- Reviews: one per user per book, edit/delete own review
- Ratings: average rating and count
- Covers: optional `coverUrl` with local/public or full URL support, placeholder fallback on error
- Filters/Sort: search, genre filter, and sort by rating/year/newest
- UI: hero banners, cards, dark mode toggle, footer

## API Overview
Base URL: `http://localhost:5000/api`

- Auth
  - POST `/auth/register` { name, email, password }
  - POST `/auth/login` { email, password }
  - GET `/auth/me` (Bearer token)
- Books
  - GET `/books?page=1&q=search&genre=Fiction&sort=rating_desc` – list with pagination (5/page)
  - GET `/books/:id` – get details + average rating
  - POST `/books` (auth) – create
  - PUT `/books/:id` (auth, owner) – update
  - DELETE `/books/:id` (auth, owner) – delete
- Reviews
  - GET `/books/:bookId/reviews` – list reviews of a book
  - POST `/books/:bookId/reviews` (auth) – add/update own review
  - PUT `/reviews/:id` (auth, owner) – update review by id
  - DELETE `/reviews/:id` (auth, owner) – delete review by id

### Curl Examples
Register and login:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo","email":"demo@example.com","password":"Secret123"}'

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Secret123"}'
# copy the token from the response
```

Create a book (replace TOKEN):
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Educated",
    "author":"Tara Westover",
    "genre":"Memoir",
    "year":2018,
    "coverUrl":"https://m.media-amazon.com/images/I/81Y5WuARqpL.jpg",
    "description":"A powerful memoir."
  }'
```

List books with filters/sort:
```bash
curl "http://localhost:5000/api/books?page=1&genre=Memoir&sort=rating_desc"
```

## Frontend Pages
- Signup `/signup`
- Login `/login`
- Book List `/books` with search, genre filter, sort, and pagination
- Book Details `/books/:id` with reviews and average rating
- Add Book `/books/new` (protected)
- Edit Book `/books/:id/edit` (protected + owner)

## Notes
- Average ratings are computed on demand via MongoDB aggregation.
- A user can have at most one review per book (unique index on `{ bookId, userId }`).
- CORS is open for local development.

## Scripts
- Backend: `npm run dev` (nodemon), `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Deployment (optional)
- Backend (Render example):
  - Environment: Node
  - Build: `npm install && npm run build || true` (if no build step, just `npm install`)
  - Start: `npm start` or `node src/server.js`
  - Env Vars: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- Frontend (Vercel/Netlify):
  - Build: `npm run build`
  - Output dir: `dist`
  - Env Vars: `VITE_API_URL=https://<your-backend>/api`

## License
MIT


## Submission Notes
- Backend API (local): http://localhost:5000/api
- Health check: http://localhost:5000/health
- Frontend (local dev): http://localhost:5173/books
- GitHub Repository: https://github.com/Shiva19222/Book-Review-Platform
- Postman Collection: `postman_collection.json` at project root

Quick start:
```
# backend
cd backend
copy .env.example .env
# Set MONGODB_URI=mongodb://127.0.0.1:27017/bookreview?directConnection=true
npm install
npm run seed   # optional
# frontend (new terminal)
cd frontend
copy .env.example .env
# Ensure VITE_API_URL=http://localhost:5000/api (dev) or use Vite proxy (already configured)
npm install
npm run dev
