-- Create the 'duties' table
CREATE TABLE duties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO duties (name, completed) VALUES
('Finish technical test', FALSE),
('Review code', FALSE),
('Write documentation', TRUE),
('Prepare for interview', FALSE),
('Deploy Application', FALSE);