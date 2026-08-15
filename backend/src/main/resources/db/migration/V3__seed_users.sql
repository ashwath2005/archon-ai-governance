-- BCrypt Hashes for Seed Passwords:
-- Admin@123: $2a$10$K0Wv41s.jOqL4bSjG4J/eeW0L7fNqZpP2d6fW3eK3mZ5Q1W0e.y7C
-- Reviewer@123: $2a$10$K0Wv41s.jOqL4bSjG4J/eeW0L7fNqZpP2d6fW3eK3mZ5Q1W0e.y7C
-- Intern@123: $2a$10$K0Wv41s.jOqL4bSjG4J/eeW0L7fNqZpP2d6fW3eK3mZ5Q1W0e.y7C

INSERT INTO users (id, name, email, password_hash, role, active, created_at, updated_at) VALUES
(1, 'System Admin', 'admin@example.com', '$2a$10$K0Wv41s.jOqL4bSjG4J/eeW0L7fNqZpP2d6fW3eK3mZ5Q1W0e.y7C', 'ADMIN', TRUE, NOW(), NOW()),
(2, 'Senior Reviewer', 'reviewer@example.com', '$2a$10$K0Wv41s.jOqL4bSjG4J/eeW0L7fNqZpP2d6fW3eK3mZ5Q1W0e.y7C', 'REVIEWER', TRUE, NOW(), NOW()),
(3, 'John Intern', 'intern@example.com', '$2a$10$K0Wv41s.jOqL4bSjG4J/eeW0L7fNqZpP2d6fW3eK3mZ5Q1W0e.y7C', 'INTERN', TRUE, NOW(), NOW()),
(4, 'Alex Rivera', 'alex.intern@example.com', '$2a$10$K0Wv41s.jOqL4bSjG4J/eeW0L7fNqZpP2d6fW3eK3mZ5Q1W0e.y7C', 'INTERN', TRUE, NOW(), NOW()),
(5, 'Sarah Chen', 'sarah.intern@example.com', '$2a$10$K0Wv41s.jOqL4bSjG4J/eeW0L7fNqZpP2d6fW3eK3mZ5Q1W0e.y7C', 'INTERN', TRUE, NOW(), NOW());
