-- Create the 'duties' table
CREATE TABLE duties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL
);

-- Insert sample data
INSERT INTO duties (name, completed) VALUES
('Req Analysis', TRUE),
('Tech Research', TRUE),
('Arch Design', TRUE),
('Env Setup', TRUE),
('Core Impl', FALSE),
('Unit Tests', FALSE),
('Debug Issues', FALSE),
('Code Refactor', FALSE),
('Doc Write', FALSE),
('App Deploy', FALSE),
('Demo Prep', FALSE),
('Interview Prep', FALSE),
('UI Design', FALSE),
('API Dev', FALSE),
('Data Model', FALSE),
('Auth Setup', FALSE),
('Perf Tests', FALSE),
('Security Rev', FALSE),
('Build Script', FALSE),
('CI CD Setup', FALSE);
('First Interview', TRUE);
('Finally gather time to code', TRUE);