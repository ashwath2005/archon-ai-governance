# ARCHON — AI Architecture Review & Governance Network

> **Tagline**: *Decide. Justify. Review. Approve.*

A production-quality full-stack web application designed to replace spreadsheet-based capstone evaluation tracking with a normalized MySQL database, Spring Boot 3 REST API, and modern React (Vite) SaaS dashboard.

---

## 🌟 Architecture & Core Principles

- **Primary Relational Database**: **MySQL 8+** (strictly relational with normalized entities, foreign keys, performance indexes, and Flyway database migrations).
- **Core Teaching Principle**: **Every architecture decision requires a reason**. Merely naming a tool (e.g. *"Use Qdrant"*) is not gradeable. The application enforces **Decision + Reason** validation across all 6 rubric evaluation sections.
- **Role-Based Access Control**:
  - `ADMIN`: Manage users, view/edit all submissions, delete submissions, export CSV, view analytics.
  - `REVIEWER`: Evaluate capstones, verify reasoning inclusion, add feedback, change review status (`APPROVED` or `NEEDS_REVISION`).
  - `INTERN`: Create capstone submission, edit own submission before approval, view feedback, resubmit after revision.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Java 17+, Spring Boot 3.2.3, Spring Web, Spring Data JPA
- **Security**: Spring Security 6 with JWT Authentication & BCrypt Password Hashing
- **Database**: MySQL 8.0 with Flyway Database Migrations (`V1__initial_schema.sql` to `V4__seed_submissions.sql`)
- **API Documentation**: Swagger OpenAPI UI (`/swagger-ui.html` & `/swagger-ui/index.html`)
- **Build Tool**: Apache Maven (with Maven Wrapper `mvnw.cmd`)

### Frontend
- **Framework**: React 18, Vite 5, JavaScript
- **Styling**: Modern CSS Architecture with CSS Custom Properties (Dark Mode / Light Mode theme toggle, glassmorphism cards, responsive data tables)
- **HTTP Client**: Axios with JWT Request/Response Interceptors
- **Data Visualization**: Recharts (Pie & Bar charts)
- **Icons**: Lucide React

---

## 📁 Repository Structure

```
d:\FRESH GENAI CAPSTONE PROJECT\
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/genai/capstone/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── exception/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── db/migration/
│   │   │           ├── V1__initial_schema.sql
│   │   │           ├── V2__seed_rubric.sql
│   │   │           ├── V3__seed_users.sql
│   │   │           └── V4__seed_submissions.sql
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw.cmd
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔐 Default Demo Accounts

All default passwords are BCrypt-hashed in database migrations:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@example.com` | `Admin@123` |
| **Senior Reviewer** | `reviewer@example.com` | `Reviewer@123` |
| **Intern** | `intern@example.com` | `Intern@123` |

---

## 🚀 Setup & Execution Instructions

### Option 1: Running with Docker Compose (Recommended)

1. Clone or navigate to project root directory.
2. Build and start all 3 containerized services (MySQL, Spring Boot Backend, Nginx Frontend):
   ```bash
   docker-compose up --build -d
   ```
3. Open browser:
   - Frontend Web App: `http://localhost`
   - Backend API Base: `http://localhost:8080/api`
   - Swagger Documentation: `http://localhost:8080/swagger-ui/index.html`

### Option 2: Running Locally (Local MySQL + Java + Node)

#### Database Setup
1. Start your local MySQL Server 8.0 on port `3306`.
2. Create database `genai_capstone`:
   ```sql
   CREATE DATABASE genai_capstone;
   ```

#### Backend Setup
1. Navigate to `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure `application.yml` or set environment variables:
   - `DB_USERNAME=root`
   - `DB_PASSWORD=your_mysql_password`
3. Build and test backend:
   ```bash
   .\mvnw.cmd test
   ```
4. Run Spring Boot Application:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

#### Frontend Setup
1. Navigate to `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Access web application at `http://localhost:3000`.

---

## 📋 6 Evaluation Rubric Sections

1. **Section 0 — Decision Gate**: RAG, Agentic AI, Fine-Tuning, Distillation (YES / NO / DEFERRED + Reason required).
2. **Section 1 — RAG Architecture**: Chunking strategy, Vector DB selection (Qdrant, FAISS, Milvus), Indexing algorithms (HNSW, IVF/PQ), Retrieval architecture (Simple, Hybrid, Multi-hop), Output formatting.
3. **Section 2 — Agentic AI**: Model routing, Tool risk classification, Tool protocol (MCP vs Direct), Agent memory systems, Planning mechanics, Agent patterns (ReAct, Reflection, Swarm).
4. **Section 3 — Fine-Tuning**: Is fine-tuning required? Parameter method (LoRA, QLoRA, Full), Data approach (Alignment, RLHF, DPO, RFT), justification over Prompting+RAG.
5. **Section 4 — Distillation**: Compression method, Label type (Hard/Soft), Distillation type, Cost/Latency/Scale justification.
6. **Section 5 — LLMOps**: Serving engines (vLLM, Ollama, TGI), Deployment patterns (Docker, GPU), Observability, Guardrails & Safety, Evaluation loop, RAG metrics (Faithfulness, Relevancy, Precision), Cost optimization.

---

## 📊 Key APIs & Documentation

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - Account registration
- `GET /api/submissions` - Paginated, searchable, and filterable submission data
- `POST /api/submissions` - Create capstone submission
- `PUT /api/submissions/{id}/review` - Update review status & review notes
- `GET /api/submissions/{id}/evaluations` - Fetch rubric evaluations
- `POST /api/submissions/{id}/evaluations` - Save rubric decisions & reasoning
- `GET /api/dashboard/summary` - Dynamic aggregated MySQL stats
- `GET /api/submissions/export` - Export submissions as CSV
