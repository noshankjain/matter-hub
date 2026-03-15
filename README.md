# Matter Hub ⚖️

A full-stack LegalTech application designed to help law firms manage active cases through a responsive, drag-and-drop Kanban board. This project demonstrates a complete, end-to-end data pipeline from a React frontend to a Serverless PostgreSQL cloud database.

## 🚀 Tech Stack

**Frontend**
* **React 19 & Vite:** Blazing fast UI rendering and build tooling.
* **Tailwind CSS v4:** Utility-first styling for a clean, professional dashboard interface.
* **@hello-pangea/dnd:** Robust, accessible drag-and-drop physics for the Kanban board.
* **TypeScript:** Strict type-safety across the entire component tree.

**Backend & Database**
* **Node.js & Express:** RESTful API architecture handling cross-origin requests.
* **Prisma ORM:** Declarative database modeling and type-safe database queries.
* **Neon PostgreSQL:** Serverless cloud database ensuring persistent state storage.

## ✨ Key Features
* **Interactive Kanban Board:** Fluid drag-and-drop interface for moving legal matters between "Intake", "Discovery", "Trial", and "Closed" phases.
* **Persistent Cloud State:** Every movement on the board instantly triggers an asynchronous API call to update the PostgreSQL database.
* **Relational Data Mapping:** Matters are strictly linked to Client profiles in the database, automatically populated via Prisma joins.

## 🛠️ Local Development Setup

To run this project locally, you will need Node.js installed.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/matter-hub.git](https://github.com/YOUR_USERNAME/matter-hub.git)
   cd matter-hub