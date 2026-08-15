-- Seed Capstone Submissions
INSERT INTO submissions (id, intern_id, project_title, project_domain, github_url, one_pager_url, date_submitted, reasoning_included, status, reviewer_notes, reviewed_by, reviewed_at, created_at, updated_at) VALUES
(1, 3, 'SmartDoc RAG Engine', 'Healthcare & Enterprise Search', 'https://github.com/john-intern/smartdoc-rag-engine', 'https://notion.so/john-intern/smartdoc-one-pager', '2026-08-01', TRUE, 'APPROVED', 'Excellent submission. Thorough reasoning provided across all architecture sections. Detailed chunking and evaluation metrics.', 2, '2026-08-03 14:30:00', NOW(), NOW()),
(2, 4, 'Autonomous Code Refactoring Agent', 'Developer Tools & AI Agents', 'https://github.com/alex-rivera/auto-code-refactor', 'https://notion.so/alex-rivera/auto-code-one-pager', '2026-08-05', FALSE, 'NEEDS_REVISION', 'Missing detailed justification for why fine-tuning was deferred and why Qdrant was selected over FAISS for tool memory storage.', 2, '2026-08-07 10:15:00', NOW(), NOW()),
(3, 5, 'Financial Analyst Copilot', 'FinTech & Analytics', 'https://github.com/sarah-chen/fin-analyst-copilot', 'https://notion.so/sarah-chen/fin-copilot-one-pager', '2026-08-10', TRUE, 'NOT_REVIEWED', NULL, NULL, NULL, NOW(), NOW());

-- Seed Evaluations for Submission 1 (APPROVED)
-- Section 0: Decision Gate
INSERT INTO submission_evaluations (submission_id, rubric_item_id, decision, reasoning, reviewer_comment) VALUES
(1, 1, 'YES', 'RAG is required because clinical compliance documents total over 50,000 pages and change frequently, exceeding context limits and requiring dynamic retrieval.', 'Valid reason.'),
(1, 2, 'YES', 'Agentic AI is required to parse complex multi-step queries, execute doc search tools, and route tasks based on medical domain specialization.', 'Approved.'),
(1, 3, 'DEFERRED', 'Fine-tuning is deferred for V1 as prompt engineering with domain-specific few-shot examples and RAG context yields 92% retrieval accuracy.', 'Sound rationale.'),
(1, 4, 'NO', 'Model distillation is not required for V1 since latency SLA is < 2.5s and cloud API endpoints handle expected load within budget.', 'Acceptable justification.');

-- Section 1: RAG
INSERT INTO submission_evaluations (submission_id, rubric_item_id, decision, reasoning, reviewer_comment) VALUES
(1, 5, 'Paragraph-level semantic chunks', 'Paragraph-level semantic chunking (300-500 tokens with 50-token overlap) preserves medical context better than raw sentence splits.', 'Good chunk size selection.'),
(1, 6, 'Qdrant', 'Qdrant was selected because of its native HNSW indexing, payload filtering capabilities for document metadata, and lightweight Docker deployment.', 'Well justified.'),
(1, 7, 'HNSW', 'HNSW provides optimal balance between high recall (98%) and low query latency (<20ms) for our 50k document vector space.', 'Accurate.'),
(1, 8, 'Hybrid RAG (Dense + Sparse)', 'Hybrid RAG combining dense vector search (BGE-large) and BM25 sparse keyword matching is necessary to catch exact medical terminology and codes.', 'Excellent approach.'),
(1, 9, 'Technical/diagnostic', 'Structured technical output format with markdown citation links ensures clinical staff can trace claims directly to source paragraphs.', 'Compliant.');

-- Section 2: Agentic AI
INSERT INTO submission_evaluations (submission_id, rubric_item_id, decision, reasoning, reviewer_comment) VALUES
(1, 10, 'Hybrid routing (Dynamic Router)', 'Route simple factual queries to Claude 3.5 Haiku and complex analytical queries to Claude 3.5 Sonnet to minimize API costs by 40%.', 'Cost-effective strategy.'),
(1, 11, 'Reversible operations', 'Doc retrieval tools are read-only; summary generation tools are reversible. High-stakes export requires explicit UI confirm button.', 'Proper risk mitigation.'),
(1, 12, 'Model Context Protocol (MCP)', 'Adopted MCP to standardize tool interfaces for document indexing service, SQL database query tool, and medical dictionary lookup API.', 'Good protocol choice.'),
(1, 13, 'Long-term (Vector/DB)', 'Long-term session history stored in Redis + Postgres to allow interns and clinicians to resume doc analysis threads.', 'Appropriate.'),
(1, 14, 'ReAct / continuous replanning', 'ReAct loop allows agent to continuously evaluate retrieval adequacy and issue follow-up queries if initial doc search returns low confidence scores.', 'Solid workflow pattern.'),
(1, 15, 'Reflection / Self-Correction', 'Implemented a reflection node that audits generated answers against retrieved context to prevent hallucinations prior to rendering.', 'Strong guardrail.');

-- Section 3: Fine-Tuning
INSERT INTO submission_evaluations (submission_id, rubric_item_id, decision, reasoning, reviewer_comment) VALUES
(1, 16, 'NO', 'Prompting + RAG was benchmarked against synthetic fine-tuning and achieved equal accuracy without maintenance overhead of custom weights.', 'Satisfactory.'),
(1, 17, 'Not applicable', 'Fine-tuning is deferred for V1.', 'N/A.'),
(1, 18, 'Not applicable', 'Fine-tuning is deferred for V1.', 'N/A.');

-- Section 4: Distillation
INSERT INTO submission_evaluations (submission_id, rubric_item_id, decision, reasoning, reviewer_comment) VALUES
(1, 19, 'NO', 'Distillation not needed as cloud inference throughput meets targets.', 'Satisfactory.'),
(1, 20, 'Not applicable', 'Distillation not required.', 'N/A.'),
(1, 21, 'Not applicable', 'Distillation not required.', 'N/A.'),
(1, 22, 'Not applicable', 'Distillation not required.', 'N/A.');

-- Section 5: LLMOps
INSERT INTO submission_evaluations (submission_id, rubric_item_id, decision, reasoning, reviewer_comment) VALUES
(1, 23, 'vLLM', 'vLLM selected for local fallback hosting due to PagedAttention optimization yielding 3x higher throughput on target GPU.', 'Solid engine choice.'),
(1, 24, 'Docker', 'Packaged with Docker Compose for consistent local development and single-command deployment to cloud instances.', 'Good deployment choice.'),
(1, 25, 'Structured Logging', 'Structured JSON logging with correlation IDs and OpenTelemetry trace context for tracking latency across pipeline steps.', 'Observability complete.'),
(1, 26, 'Prompt injection protection', 'Used Llama-Guard-3 and custom regex filters to sanitize inputs and prevent system prompt overrides.', 'Safety measures present.'),
(1, 27, 'Define baseline + metrics', 'Golden dataset of 100 clinical Q&A pairs run on every pull request to measure recall and faithfulness regression.', 'Eval loop sound.'),
(1, 28, 'Faithfulness & Relevancy', 'Ragas evaluation framework integrated to continuously monitor Faithfulness, Answer Relevancy, and Context Precision.', 'Proper metrics.'),
(1, 29, 'Semantic caching', 'GPTCache layer stores semantic query embeddings, saving ~25% API tokens on repetitive user queries.', 'Cost optimized.');

-- Seed Review History for Submission 1
INSERT INTO review_history (submission_id, reviewer_id, previous_status, new_status, comments, created_at) VALUES
(1, 2, 'NOT_REVIEWED', 'APPROVED', 'Initial review complete. All reasoning validated and architecture choices fully justified.', '2026-08-03 14:30:00');

-- Seed Review History for Submission 2
INSERT INTO review_history (submission_id, reviewer_id, previous_status, new_status, comments, created_at) VALUES
(2, 2, 'NOT_REVIEWED', 'NEEDS_REVISION', 'Requested revision due to missing reasoning in Agentic AI and Fine-Tuning sections.', '2026-08-07 10:15:00');
