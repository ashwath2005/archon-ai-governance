-- Table: users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- ADMIN, REVIEWER, INTERN
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: submissions
CREATE TABLE submissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    intern_id BIGINT NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    project_domain VARCHAR(150) NOT NULL,
    github_url VARCHAR(500) NOT NULL,
    one_pager_url VARCHAR(500) NOT NULL,
    date_submitted DATE NOT NULL,
    reasoning_included BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'NOT_REVIEWED', -- NOT_REVIEWED, NEEDS_REVISION, APPROVED
    reviewer_notes TEXT,
    reviewed_by BIGINT,
    reviewed_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_submission_intern FOREIGN KEY (intern_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_submission_status (status),
    INDEX idx_submission_date (date_submitted),
    INDEX idx_submission_intern (intern_id),
    INDEX idx_submission_reasoning (reasoning_included)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: rubric_sections
CREATE TABLE rubric_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    section_code INT NOT NULL UNIQUE, -- 0: Decision Gate, 1: RAG, 2: Agentic AI, 3: Fine-Tuning, 4: Distillation, 5: LLMOps
    section_name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_section_code (section_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: rubric_items
CREATE TABLE rubric_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rubric_section_id BIGINT NOT NULL,
    item_key VARCHAR(100) NOT NULL UNIQUE,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    options TEXT, -- JSON or comma-separated options list
    required BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL,
    CONSTRAINT fk_rubric_item_section FOREIGN KEY (rubric_section_id) REFERENCES rubric_sections(id) ON DELETE CASCADE,
    INDEX idx_item_section (rubric_section_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: submission_evaluations
CREATE TABLE submission_evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    rubric_item_id BIGINT NOT NULL,
    decision VARCHAR(150) NOT NULL, -- YES, NO, DEFERRED, NOT_APPLICABLE or specific option key
    reasoning TEXT,
    reviewer_comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_eval_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_eval_rubric_item FOREIGN KEY (rubric_item_id) REFERENCES rubric_items(id) ON DELETE CASCADE,
    CONSTRAINT uq_submission_item UNIQUE (submission_id, rubric_item_id),
    INDEX idx_eval_submission (submission_id),
    INDEX idx_eval_item (rubric_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: review_history
CREATE TABLE review_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    previous_status VARCHAR(30) NOT NULL,
    new_status VARCHAR(30) NOT NULL,
    comments TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rh_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_rh_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_rh_submission (submission_id),
    INDEX idx_rh_reviewer (reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
