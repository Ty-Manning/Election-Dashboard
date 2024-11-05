CREATE DATABASE IF NOT EXISTS election_db;
USE election_db;

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    url VARCHAR(2083) NOT NULL,
    content TEXT,
    published_date DATETIME,
    bias ENUM('left', 'neutral', 'right') DEFAULT 'neutral',
    removed BOOLEAN DEFAULT FALSE
);

-- States Table
CREATE TABLE IF NOT EXISTS states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    electoral_votes INT NOT NULL,
    expected_vote ENUM('Harris', 'Trump', 'Neutral') DEFAULT 'Neutral'
);

-- Initialize States with Electoral Votes
INSERT INTO states (name, electoral_votes, expected_vote) VALUES
('Alabama', 9, 'Trump'),
('Alaska', 3, 'Trump'),
('Arizona', 11, 'Neutral'),
('Arkansas', 6, 'Trump'),
('California', 55, 'Harris'),
('Colorado', 9, 'Neutral'),
('Connecticut', 7, 'Harris'),
('Delaware', 3, 'Harris'),
('Florida', 29, 'Neutral'),
('Georgia', 16, 'Neutral'),
('Hawaii', 4, 'Harris'),
('Idaho', 4, 'Trump'),
('Illinois', 20, 'Harris'),
('Indiana', 11, 'Trump'),
('Iowa', 6, 'Neutral'),
('Kansas', 6, 'Trump'),
('Kentucky', 8, 'Trump'),
('Louisiana', 8, 'Trump'),
('Maine', 4, 'Neutral'),
('Maryland', 10, 'Harris'),
('Massachusetts', 11, 'Harris'),
('Michigan', 16, 'Neutral'),
('Minnesota', 10, 'Neutral'),
('Mississippi', 6, 'Trump'),
('Missouri', 10, 'Trump'),
('Montana', 3, 'Trump'),
('Nebraska', 5, 'Trump'),
('Nevada', 6, 'Neutral'),
('New Hampshire', 4, 'Neutral'),
('New Jersey', 14, 'Harris'),
('New Mexico', 5, 'Neutral'),
('New York', 28, 'Harris'),
('North Carolina', 16, 'Neutral'),
('North Dakota', 3, 'Trump'),
('Ohio', 17, 'Neutral'),
('Oklahoma', 7, 'Trump'),
('Oregon', 7, 'Harris'),
('Pennsylvania', 20, 'Neutral'),
('Rhode Island', 4, 'Harris'),
('South Carolina', 9, 'Trump'),
('South Dakota', 3, 'Trump'),
('Tennessee', 11, 'Trump'),
('Texas', 38, 'Trump'),
('Utah', 6, 'Trump'),
('Vermont', 3, 'Harris'),
('Virginia', 13, 'Neutral'),
('Washington', 12, 'Harris'),
('West Virginia', 5, 'Trump'),
('Wisconsin', 10, 'Neutral'),
('Wyoming', 3, 'Trump');
