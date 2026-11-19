# ?? BookShelf — Online Book Inventory Management System

A complete full-stack library/book inventory management platform built with **React JS**, **Node.js**, **Express.js**, and **MongoDB**.

---

## ?? Project Structure

```
book-inventory/
+-- backend/
¦   +-- config/db.js
¦   +-- controllers/bookController.js
¦   +-- controllers/dashboardController.js
¦   +-- middleware/errorMiddleware.js
¦   +-- models/Book.js
¦   +-- routes/bookRoutes.js
¦   +-- routes/dashboardRoutes.js
¦   +-- seed.js
¦   +-- server.js
¦   +-- .env
¦   +-- package.json
+-- frontend/
    +-- src/
    ¦   +-- components/ (Sidebar, Navbar, StatCard, BookCard, BookTable, BookForm, SearchBar, FilterPanel, ConfirmDialog)
    ¦   +-- pages/ (Dashboard, Books, AddBook, EditBook, BookDetails, Categories, Inventory)
    ¦   +-- services/ (bookService.js, dashboardService.js)
    ¦   +-- App.jsx
    ¦   +-- index.css
    +-- index.html
    +-- vite.config.js
```

---

## ?? Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

## ?? Setup & Installation

### Backend

```bash
cd backend
npm install
npm run seed    # populate 12 sample books
npm run dev     # start on http://localhost:5000
```

Configure `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/book_inventory
NODE_ENV=development
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # start on http://localhost:5173
```

---

## ?? Application Pages

| Page       | Route              | Description                          |
|------------|--------------------|--------------------------------------|
| Dashboard  | /                  | Stats cards + charts + recent books  |
| All Books  | /books             | Table/grid + search & filter         |
| Add Book   | /books/add         | Add new book form                    |
| Details    | /books/:id         | Full book info                       |
| Edit Book  | /books/:id/edit    | Pre-filled edit form                 |
| Categories | /categories        | Category overview with counts        |
| Inventory  | /inventory         | Inline quantity editor               |

---

## ?? REST API

Base: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/books | All books (supports ?search= ?category= ?availability=) |
| GET    | /api/books/:id | Single book |
| POST   | /api/books | Create book |
| PUT    | /api/books/:id | Update book |
| DELETE | /api/books/:id | Delete book |
| GET    | /api/dashboard/stats | Dashboard statistics |

---

## ??? Database Schema — books collection

| Field           | Type   | Required | Notes                        |
|-----------------|--------|----------|------------------------------|
| title           | String | Yes      | Max 200 chars                |
| author          | String | Yes      | Max 150 chars                |
| isbn            | String | No       | Unique when provided         |
| category        | String | No       | Default: General             |
| publisher       | String | No       |                              |
| publicationYear | Number | No       | 1000 to current year         |
| totalCopies     | Number | Yes      | Min 0                        |
| availableCopies | Number | Yes      | Min 0, max = totalCopies     |
| description     | String | No       | Max 2000 chars               |
| coverImage      | String | No       | URL                          |
| availability    | String | Auto     | Available / Unavailable      |
| createdAt       | Date   | Auto     | Mongoose timestamp           |
| updatedAt       | Date   | Auto     | Mongoose timestamp           |

---

## ?? Postman Tests

1. GET /api/health ? 200 OK
2. GET /api/books ? all 12 seeded books
3. GET /api/books?search=clean ? filtered results
4. GET /api/books?category=Programming
5. GET /api/books?availability=Unavailable
6. POST /api/books ? create book (JSON body)
7. PUT /api/books/:id ? update book
8. DELETE /api/books/:id ? delete book
9. GET /api/books/invalidid ? 404 error
10. POST with duplicate ISBN ? 400 error

---

## ?? Important Viva Q&A

**Q: What is MERN stack?**
A: MongoDB + Express.js + React.js + Node.js — a full-stack JavaScript framework.

**Q: What is REST API?**
A: Architectural style using GET/POST/PUT/DELETE HTTP methods; data in JSON format.

**Q: What is Mongoose?**
A: ODM library for MongoDB providing schema validation, middleware hooks, and query building.

**Q: Difference between useState and useEffect?**
A: useState manages local state; useEffect handles side effects (API calls, subscriptions) after render.

**Q: How does search work?**
A: Backend builds a Mongoose regex filter on title, author, isbn using $or operator.

**Q: How is availability calculated?**
A: Mongoose pre-save hook: availability = availableCopies > 0 ? Available : Unavailable.

**Q: What is CORS?**
A: Cross-Origin Resource Sharing — allows frontend (5173) to call backend (5000) safely.

**Q: How does ISBN uniqueness work?**
A: unique:true + sparse:true on the MongoDB field; errorMiddleware catches error code 11000.

**Q: What is the purpose of dotenv?**
A: Loads environment variables from .env file, keeping secrets separate from source code.

**Q: How is the dashboard data calculated?**
A: MongoDB aggregation pipeline with $group operator — single efficient database query.

---

## ?? Commands Reference

```bash
# Backend
npm run dev      # development server
npm run seed     # seed 12 sample books

# Frontend
npm run dev      # development server
npm run build    # production build
```
