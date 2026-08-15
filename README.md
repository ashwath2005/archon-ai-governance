# 🏛️ ARCHON — AI Architecture Review & Governance Network

> **— AI ARCHITECTURE REVIEW & GOVERNANCE NETWORK —**  
> *Decide. Justify. Review. Audit. Govern.*

[![Java](https://img.shields.io/badge/Java-17%2B-007396?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![UI Design](https://img.shields.io/badge/UI%20Design-OLED%20Pitch%20Black-000000?style=flat)](https://github.com/ashwath2005/archon-ai-governance)

ARCHON is an enterprise-grade platform for evaluating, reviewing, validating, and auditing Generative AI / LLM capstone architectures. It replaces manual spreadsheet tracking with a normalized MySQL 8+ database, Spring Boot 3 REST API backend, and an OLED pitch-black React review workstation.

---

## 🌟 Core Business Rule: Architectural Reasoning Enforcement

> **"Every architecture decision requires a reason."**  
> Merely selecting a technology stack item (e.g. *"Pinecone"* or *"Llama-3"*) is not gradeable. ARCHON enforces compulsory **Decision + Reason** validation across all 6 rubric evaluation domains.

If architectural reasoning is missing or under 5 characters (`reasoning.trim().length <= 5`), the system flags the submission as **`⚠ ARCHITECTURAL REASONING REQUIRED`** and blocks automated approval transitions.

---

## 🚀 Key Platform Features & Signature Visual UI

### 1. 🎨 OLED Pitch-Black Design System
- **OLED Surface Hierarchy**: `#000000` base, `#050505` surface, `#080808` elevated, `#171719` hairline structural borders.
- **Strict Color Semantics**: 
  - **Sky Cyan (`#38BDF8`)**: Focus, active navigation line (`● Submissions`), AI intelligence.
  - **Electric Indigo (`#5542FF`)**: Architecture visualization pipeline lines & secondary metrics.
  - **Emerald (`#34D399`)**: Approved states, healthy governance score, verified reasoning (`✓ REASONING VALID`).
  - **Amber (`#FBBF24`)**: Revision requests, attention warnings, `[ DEFERRED ]` decisions.
  - **Rose (`#FB7185`)**: Failures, missing reasoning warnings, high governance risk.
- **Typography Stack**: `Inter` (UI Body), `JetBrains Mono` (Monospace IDs `ARCH-024`, criteria codes `RAG-03`, timestamps, character counts), `Orbitron` (Brand headers).

### 2. 🗺️ Context-Aware Architecture Graph
- **Interactive DAG Diagram**: Visual node flow (`Client App` → `Input Guardrail` → `Agent Orchestrator` → `RAG Hybrid Engine` → `Vector DB` → `LLMOps Evals`).
- **Context Highlight**: Dynamically highlights corresponding nodes when a reviewer selects a rubric section (e.g., Section `01` highlights RAG Engine & Vector DB; Section `06` highlights Guardrail).
- **Latency & SLA Overlay**: Toggle switch `[ Structure ]` | `[ Latency SLAs ]` displaying component execution latencies (`+45ms Guardrail`, `+120ms Agent Loop`, `+38ms Vector DB`, `+410ms LLM Call`) and total pipeline SLA (`243ms`).

### 3. 🧠 Criterion-Linked ARCHON AI Review Assistant
- **Trade-Off Analyzer**: Analyzes memory footprint vs. retrieval latency trade-offs, flags missing evidence, and suggests targeted reviewer questions.
- **Risk Level Capsules**: Displays governance risk level badges (`● LOW RISK`, `● MEDIUM RISK`, `● HIGH RISK`).
- **One-Click Note Insertion**: `[ Append Recommendation to Reviewer Notes ]` action button.

### 4. 🎛️ 3-Column Architecture Review Workstation (`/submissions/:id`)
- **Left Column**: Sticky Rubric Section navigation with completion counters (`● 5 / 5`) and overall completion % bar.
- **Center Column**: ADR-formatted criteria evaluation canvas (`[ YES ]`, `[ NO ]`, `[ DEFERRED ]`), compulsory character-validated architectural reasoning, evidence repository links, and integrated `ArchitectureGraph`.
- **Right Column**: Sticky Governance Control Panel with status badge, valid reasoning tally (`8 / 12 VALID`), confirmation dialogs before status transitions, `AIReviewPanel`, and vertical immutable **Audit History Timeline**.

### 5. ⌨️ Keyboard-First Power Reviewer Shortcuts
- Press **`?`** anywhere in the workstation or click **`[ ⌘? Hotkeys ]`** to open the `ShortcutModal` cheatsheet.
- **`J` / `K`**: Navigate to Next / Previous rubric section.
- **`1` / `2` / `3`**: Select decision `[ YES ]`, `[ NO ]`, or `[ DEFERRED ]`.
- **`⌘K` / `Ctrl+K`**: Launch Raycast/Linear-style command palette.

### 6. 📄 One-Click Enterprise Governance Record (AGR) Exporter
- Action button downloading a formatted Markdown document (`ARCHON_Governance_Record_ARCH-xxx.md`) containing executive governance stamps, complete ADR decision tables, reasoning justifications, and audit logs for compliance archives.

### 7. 📟 Live System Governance Terminal Drawer (`ARCHON TTY LOG`)
- Collapsible floating terminal drawer in the bottom right corner showing real-time system governance audit events (`[11:52:04] [KERNEL_INIT]`, `[11:52:05] [SEC_SCAN]`, `[11:52:06] [AUDIT_SYNC]`).

### 8. 📊 Enterprise SLA Benchmark Radar Chart
- Recharts `RadarChart` comparing submitted project scores against Healthcare & Finance Enterprise SLA Baselines (95% SLA) across all 6 GenAI domains.

---

## 📋 6 Evaluation Rubric Domains

1. **Domain 01 — RAG Architecture**: Chunking strategy (fixed vs. semantic), Vector DB selection (Pinecone, Qdrant, FAISS, Milvus), Indexing algorithms (HNSW, IVF/PQ), Retrieval architecture (Dense, Lexical BM25, Hybrid Reranking), Output formatting.
2. **Domain 02 — Agentic Workflows**: Model routing, Tool risk classification, Tool execution protocol (MCP vs Direct API), Agent memory systems, Planning mechanics (ReAct, Reflection, Plan-and-Execute), Tool loop recursion budgets.
3. **Domain 03 — Model Trade-Offs**: RAG vs. Fine-Tuning vs. Zero-Shot trade-off matrix, Parameter selection, Quantization trade-offs (GGUF, AWQ, GPTQ), Serving cost & latency SLAs.
4. **Domain 04 — Distillation**: Model compression methods, Label types (Hard/Soft), Distillation strategies, Accuracy retention vs. scale justifications.
5. **Domain 05 — LLMOps & Evals**: Serving engines (vLLM, Ollama, TGI), Deployment infrastructure (Docker, GPU clusters), Observability (LangSmith, TruLens), Automated evaluation loops (Faithfulness, Answer Relevance, Context Precision).
6. **Domain 06 — Safety & Governance**: PII masking & token redaction, Prompt injection guardrails, Output hallucination filters, Immutable audit logging, Compliance data residency.

---

## 👥 Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| `ADMIN` | Global read/write access, user management, rubric editing, CSV export, analytics oversight. |
| `REVIEWER` | Evaluate capstone submissions, fill rubric decisions, validate reasoning inclusion, approve/reject/request revision. |
| `INTERN` | Create capstone submission, edit own submission before review, view reviewer feedback, resubmit after revision. |

---

## 🔐 Default Demo Accounts

All default passwords are BCrypt-hashed in Flyway database migration scripts (`V3__seed_users.sql`):

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@example.com` | `Admin@123` |
| **Senior Reviewer** | `reviewer@example.com` | `Reviewer@123` |
| **Intern** | `intern@example.com` | `Intern@123` |

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Java 17+, Spring Boot 3.2.3, Spring Web, Spring Data JPA
- **Security**: Spring Security 6 with JWT Authentication & BCrypt Password Hashing
- **Database**: MySQL 8.0 with Flyway Database Migrations (`V1` to `V4`)
- **API Documentation**: Swagger OpenAPI UI (`/swagger-ui/index.html`)
- **Build Tool**: Apache Maven (`mvnw.cmd`)

### Frontend
- **Framework**: React 18.2, Vite 5.1, JavaScript
- **Styling**: Vanilla CSS Architecture with CSS Custom Properties, Spring Physics (`cubic-bezier(0.16, 1, 0.3, 1)`), Cyber Corner Brackets (`.tech-bracket`), Slanted Hexagon Status Capsules (`.status-hex`)
- **HTTP Client**: Axios with JWT Request/Response Interceptors
- **Data Visualization**: Recharts (Pie, Bar, Radar Charts)
- **Icons**: Lucide React

---

## 🚀 Setup & Quickstart Instructions

### Option 1: Running with Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/ashwath2005/archon-ai-governance.git
   cd archon-ai-governance
   ```

2. Build and start all 3 containerized services (MySQL, Spring Boot Backend, Nginx Frontend):
   ```bash
   docker-compose up --build -d
   ```

3. Access the services in your browser:
   - **Frontend Web App**: `http://localhost` (or `http://localhost:3000`)
   - **Backend API Base**: `http://localhost:8080/api`
   - **Swagger OpenAPI Docs**: `http://localhost:8080/swagger-ui/index.html`

---

### Option 2: Running Locally (Local MySQL + Java + Node)

#### Database Setup
1. Start local MySQL Server 8.0 on port `3306`.
2. Create database `genai_capstone`:
   ```sql
   CREATE DATABASE genai_capstone;
   ```

#### Backend Setup
1. Navigate to `backend/` directory:
   ```bash
   cd backend
   ```
2. Configure credentials in `application.yml`:
   - `DB_USERNAME=root`
   - `DB_PASSWORD=your_password`
3. Run Spring Boot application:
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
3. Start Vite development server:
   ```bash
   npm run dev
   ```
4. Access web application at `http://localhost:5173`.

---

## 📊 Core API Endpoints

- `POST /api/auth/login` — User authentication (returns JWT token + user roles)
- `POST /api/auth/register` — Account registration
- `GET /api/submissions` — Paginated, searchable, and filterable submission registry
- `GET /api/submissions/{id}` — Single submission detail object
- `POST /api/submissions` — Create new capstone submission
- `POST /api/submissions/{id}/evaluations` — Save rubric decisions & reasoning
- `POST /api/submissions/{id}/review` — Update review status (`APPROVED`, `NEEDS_REVISION`) & reviewer notes
- `GET /api/submissions/{id}/history` — Immutable audit log timeline
- `GET /api/dashboard/summary` — Aggregated Command Center metrics
- `GET /api/submissions/export` — Export submissions registry as CSV

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
