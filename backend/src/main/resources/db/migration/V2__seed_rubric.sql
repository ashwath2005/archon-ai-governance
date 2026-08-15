-- Seed Rubric Sections
INSERT INTO rubric_sections (id, section_code, section_name, description, display_order, active) VALUES
(1, 0, 'Decision Gate', 'High-level architecture choices: Determine whether RAG, Agentic AI, Fine-Tuning, or Distillation are needed, deferred, or skipped for V1.', 1, TRUE),
(2, 1, 'RAG Architecture', 'Retrieval-Augmented Generation strategy: Chunking, Vector DB, Indexing algorithms, Retrieval patterns, and Output styling.', 2, TRUE),
(3, 2, 'Agentic AI', 'Autonomous agent mechanics: Model routing, Tool risk classification, Protocol (MCP), Memory, Planning, and Agent patterns.', 3, TRUE),
(4, 3, 'Fine-Tuning', 'Model adaptation strategy: Evaluation whether Fine-Tuning is required over Prompting+RAG, parameter methods, and data alignment.', 4, TRUE),
(5, 4, 'Distillation', 'Model compression & knowledge transfer: Evaluation of distillation, quantization, label types, and operational efficiency.', 5, TRUE),
(6, 5, 'LLMOps', 'Production operations: Serving engines, deployment patterns, observability, guardrails, evaluation loops, RAG metrics, and cost optimization.', 6, TRUE);

-- Seed Rubric Items
-- Section 0: Decision Gate
INSERT INTO rubric_items (rubric_section_id, item_key, item_name, description, options, required, display_order) VALUES
(1, 'gate_rag', 'RAG Required', 'Is Retrieval-Augmented Generation required for this project?', '["YES", "NO", "DEFERRED"]', TRUE, 1),
(1, 'gate_agentic', 'Agentic AI Required', 'Is Agentic AI capability required for this project?', '["YES", "NO", "DEFERRED"]', TRUE, 2),
(1, 'gate_finetuning', 'Fine-Tuning Required', 'Is Fine-Tuning required for this project?', '["YES", "NO", "DEFERRED"]', TRUE, 3),
(1, 'gate_distillation', 'Distillation Required', 'Is Model Distillation required for this project?', '["YES", "NO", "DEFERRED"]', TRUE, 4);

-- Section 1: RAG
INSERT INTO rubric_items (rubric_section_id, item_key, item_name, description, options, required, display_order) VALUES
(2, 'rag_chunking', 'Chunking Strategy', 'Strategy for splitting source documents into searchable units.', '["Sentence / one-liner chunks", "Paragraph-level semantic chunks", "Structured per-record chunks", "Recursive structure-aware chunks", "Not needed"]', TRUE, 1),
(2, 'rag_vectordb', 'Vector Database & Storage', 'Vector database selection for embedding storage & retrieval.', '["Qdrant", "FAISS", "Milvus", "ChromaDB", "Other justified choice", "Not needed"]', TRUE, 2),
(2, 'rag_indexing', 'Indexing Algorithm', 'Index structure for vector search execution.', '["HNSW", "IVF/PQ", "Flat / exact kNN", "Other justified choice", "Not needed"]', TRUE, 3),
(2, 'rag_retrieval_arch', 'Retrieval Architecture', 'Pattern used for retrieving context.', '["Simple RAG", "Hybrid RAG (Dense + Sparse)", "Multi-hop RAG", "Agentic RAG", "Not needed"]', TRUE, 4),
(2, 'rag_generation_style', 'Generation Output Style', 'Target output format and tone of response.', '["Short/direct", "Conversational", "Technical/diagnostic", "Structured JSON/Markdown", "Other"]', TRUE, 5);

-- Section 2: Agentic AI
INSERT INTO rubric_items (rubric_section_id, item_key, item_name, description, options, required, display_order) VALUES
(3, 'agent_model_routing', 'Model Routing', 'Strategy for routing queries to appropriate models.', '["Small/fast model", "Larger reasoning model", "Hybrid routing (Dynamic Router)", "Not needed"]', TRUE, 1),
(3, 'agent_tool_risk', 'Tool Risk Classification', 'Risk classification and safety controls for tools.', '["Read-only tools", "Reversible operations", "Irreversible / high-stakes (requires Human-in-the-Loop)", "Not needed"]', TRUE, 2),
(3, 'agent_mcp', 'Tool Protocol (MCP vs Direct)', 'Mechanism used to connect agents to tools.', '["Direct function calls", "Model Context Protocol (MCP)", "Hybrid / API wrapper", "Not needed"]', TRUE, 3),
(3, 'agent_memory', 'Agent Memory System', 'Context retention across interactions.', '["Short-term (In-Memory)", "Long-term (Vector/DB)", "Episodic memory", "Not needed"]', TRUE, 4),
(3, 'agent_planning', 'Planning Mechanics', 'Task decomposition and execution planning.', '["Plan upfront", "ReAct / continuous replanning", "Hierarchical planning", "Other justified architecture", "Not needed"]', TRUE, 5),
(3, 'agent_architecture', 'Agent Pattern / Architecture', 'Core design pattern for agent workflow.', '["ReAct", "Reflection / Self-Correction", "Plan & Execute", "Multi-Agent Collaboration", "Swarm", "Not needed"]', TRUE, 6);

-- Section 3: Fine-Tuning
INSERT INTO rubric_items (rubric_section_id, item_key, item_name, description, options, required, display_order) VALUES
(4, 'ft_is_required', 'Is Fine-Tuning Required?', 'Explicit determination if fine-tuning is required or if Prompting + RAG is sufficient.', '["YES", "NO", "DEFERRED"]', TRUE, 1),
(4, 'ft_parameter_method', 'Parameter-Level Method', 'Method for updating model weights.', '["Full Fine-Tuning", "Partial Freezing", "LoRA", "QLoRA", "Not applicable"]', TRUE, 2),
(4, 'ft_data_approach', 'Data-Level Approach', 'Dataset composition and training paradigm.', '["Domain Adaptation", "Instruction Fine-Tuning", "Alignment (RLHF/DPO/RFT)", "Not applicable"]', TRUE, 3);

-- Section 4: Distillation
INSERT INTO rubric_items (rubric_section_id, item_key, item_name, description, options, required, display_order) VALUES
(5, 'distil_is_required', 'Is Distillation Required?', 'Explicit evaluation of model compression requirements.', '["YES", "NO", "DEFERRED"]', TRUE, 1),
(5, 'distil_compression_method', 'Compression Method', 'Technique used for model efficiency.', '["Distillation", "Quantization", "Pruning", "Not applicable"]', TRUE, 2),
(5, 'distil_label_type', 'Label Type', 'Type of target output used during distillation.', '["Hard Labels", "Soft Labels", "Not applicable"]', TRUE, 3),
(5, 'distil_type', 'Distillation Architecture', 'Knowledge transfer approach.', '["Response-Based", "Feature-Based", "Relation-Based", "Not applicable"]', TRUE, 4);

-- Section 5: LLMOps
INSERT INTO rubric_items (rubric_section_id, item_key, item_name, description, options, required, display_order) VALUES
(6, 'ops_serving_engine', 'Serving Engine', 'Inference engine used for hosting models.', '["Ollama", "vLLM", "TGI (Text Generation Inference)", "Cloud API (OpenAI/Anthropic)", "Other", "Not needed"]', TRUE, 1),
(6, 'ops_deployment_pattern', 'Deployment Pattern', 'Infrastructure deployment pattern.', '["Docker", "Dedicated GPU (Cloud VM)", "Serverless / Edge", "Hybrid", "Other"]', TRUE, 2),
(6, 'ops_observability', 'Observability Stack', 'Logging, tracing, and metric collection for LLM calls.', '["Structured Logging", "Metrics Collection (Prometheus/Grafana)", "Instrumented LLM Calls (LangSmith/OpenTelemetry)", "Comprehensive Stack"]', TRUE, 3),
(6, 'ops_guardrails', 'Guardrails & Safety', 'Safety filters and runtime validation.', '["Human-in-the-loop", "Prompt injection protection", "Input/output sanitization", "Loop breakers", "All of the above"]', TRUE, 4),
(6, 'ops_eval_loop', 'Evaluation Loop', 'Systematic benchmarking and regression testing.', '["Define baseline + metrics", "Find & group failures", "Rerun same dataset iteratively", "Continuous Evaluation Pipeline"]', TRUE, 5),
(6, 'ops_rag_metrics', 'RAG Evaluation Metrics', 'Metrics tracked for RAG accuracy.', '["Precision & Recall", "Hit Rate & MRR", "Faithfulness & Relevancy", "Coherence & Correctness", "Comprehensive RAG Evaluation", "Not applicable"]', TRUE, 6),
(6, 'ops_cost_optimization', 'Cost Optimization Strategy', 'Techniques to control token and compute expenditure.', '["Right-size model", "Semantic caching", "Quantization", "Prompt optimization", "Efficient serving engine", "Multi-layered cost control"]', TRUE, 7);
