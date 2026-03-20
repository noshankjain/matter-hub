# ⚖️ Matter Hub

Matter Hub is a modern, full-stack Legal Case Management Dashboard designed to help law firms and legal professionals streamline their workflows. It provides a visual Kanban board for tracking case progress, a PIN-protected Document Vault for sensitive files, and a comprehensive Client Directory.

---

## ✨ Key Features

- **Interactive Kanban Board:** Drag-and-drop functionality to move legal matters through different stages (Intake, Discovery, Trial, Closed) using `@hello-pangea/dnd`.

- **Secure Document Vault:** A dedicated, PIN-protected interface (Default PIN: `12345678`) to upload, view, and delete documents tied to specific legal matters.

- **Client Directory:** Manage firm contacts, displaying associated cases and contact information.

- **Billing & Time Dashboard:** A comprehensive UI for tracking billable hours, unbilled time, and invoice statuses.

- **Decoupled Architecture:** A highly scalable setup with a strictly separated React frontend and Express REST API backend.

---

## 🛠️ Tech Stack

### Frontend
- Framework: React 19 + Vite  
- Language: TypeScript  
- Styling: Tailwind CSS v4  
- Icons: Lucide React  
- State Management: React Hooks  
- Routing: React Router DOM  
- Deployment: Vercel  

### Backend
- Framework: Express.js (Node.js)  
- Language: TypeScript (`ts-node`)  
- Database ORM: Prisma  
- API Architecture: RESTful API  
- Deployment: Render  

### Database
- Provider: PostgreSQL  
- Hosting: Neon (Serverless Postgres)  

---

## 🗄️ Database Schema

The database relies on three core Prisma models with relational mapping:

1. **Client**
   - Stores client details (name, email, phone)
   - One-to-many relationship with Matters

2. **Matter**
   - Represents a legal case (title, status)
   - Belongs to a Client
   - One-to-many relationship with Documents

3. **Document**
   - Represents a file uploaded to the vault (name, size)
   - Cascades on deletion if the parent Matter is deleted

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites

- Node.js (v18 or higher)
- Git
- A free account on https://neon.tech/

---

### 2. Clone the Repository

```bash
git clone https://github.com/noshankjain/matter-hub.git
cd matter-hub
```

---

### 3. Database Setup (Neon & Prisma)

Create a new project in Neon and copy your Postgres connection string.

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file in the backend folder and add:

```env
DATABASE_URL="postgresql://[user]:[password]@[host]/[dbname]?sslmode=require"
PORT=5000
```

Install dependencies and set up Prisma:

```bash
npm install
npx prisma generate
npx prisma db push
```

Seed the database (make sure backend is running first):

```bash
curl -X POST http://localhost:5000/api/seed
```

---

### 4. Running the Backend Server

```bash
npm run start
```

Backend runs at:
```
http://localhost:5000
```

---

### 5. Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Install and start frontend:

```bash
npm install
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---

## 📡 API Endpoints

### Matters
- `GET /api/matters` → Fetch all matters (includes clients and documents)  
- `POST /api/matters` → Create a new matter  
- `PUT /api/matters/:id` → Update matter status  
- `DELETE /api/matters/:id` → Delete a matter  

### Clients
- `GET /api/clients` → Fetch all clients  
- `POST /api/clients` → Create a new client  

### Documents
- `POST /api/documents` → Upload a document record  
- `DELETE /api/documents/:id` → Delete a document  

---

## ☁️ Deployment Architecture

### Frontend (Vercel)
- Deployed using Vite build
- Environment variable:
  ```
  VITE_API_URL=<your-render-backend-url>
  ```

### Backend (Render)
- Runs as a Web Service
- Build command includes:
  ```bash
  npx prisma generate
  ```

### Database (Neon)
- Serverless PostgreSQL
- Connected securely to backend via connection string

---

## 📌 Notes

- Default Document Vault PIN: `12345678`
- Ensure backend is running before seeding data
- Keep `.env` files private and never push them to GitHub

---
