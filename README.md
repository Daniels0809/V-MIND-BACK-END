CREATE DATABASE IF NOT EXISTS crisalida;
USE crisalida;
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    passwords VARCHAR(255),
    rol ENUM('admin', 'user'),
    objetive TEXT,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_connection DATETIME NULL,
    current_level INT DEFAULT 0,
    preferred_language VARCHAR(20)
);

CREATE TABLE roadmaps (
    roadmap_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    roadmap_description TEXT,
    topic VARCHAR(100),
    difficulty ENUM('beginner', 'intermediate', 'advanced'),
    estimated_time INT,
    user_id CHAR(36),
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE levels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id INT,
    title VARCHAR(150),
    description TEXT,
    order_number INT NOT NULL,
    xp_reward INT DEFAULT 0,
    status ENUM('locked', 'unlocked', 'completed') DEFAULT 'locked',
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(roadmap_id)
);

CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    level_id INT,
    title VARCHAR(150),
    description TEXT,
    type ENUM('quiz', 'reading', 'practice', 'project'),
    xp_reward INT DEFAULT 0,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    FOREIGN KEY (level_id) REFERENCES levels(level_id)
);

CREATE TABLE user_tasks (
    user_task_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    task_id INT,
    status ENUM('pending', 'in_progress', 'completed', 'failed') DEFAULT 'pending',
    date_completed DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

CREATE TABLE triumphs (
    triumph_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    description TEXT,
    icon VARCHAR(255),
    xp_required INT DEFAULT 0,
    type_triumph ENUM('progress', 'streak', 'special'),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_triumphs (
    user_triumph_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    triumph_id INT,
    date_earned DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (triumph_id) REFERENCES triumphs(triumph_id)
);

CREATE TABLE streaks (
    streak_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    start_date DATETIME,
    longest_streak_days INT DEFAULT 0,
    last_active_date DATETIME,
    current_streak_days INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE interests (
    interest_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE interest_levels (
    user_id CHAR(36),
    interest_id INT,
    knowledge_level ENUM('novice', 'beginner', 'intermediate', 'advanced', 'expert'),
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (interest_id) REFERENCES interests(interest_id)
);

CREATE TABLE user_characterization (
    characterization_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    learning_goal TEXT,
    learning_pace ENUM('fast', 'balanced', 'quiet'),
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE user_pace_history (
    pace_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    learning_pace ENUM('fast', 'balanced', 'quiet'),
    date_changed DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    title VARCHAR(150),
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    title VARCHAR(150),
    type ENUM('video', 'pdf', 'web', 'other'),
    link TEXT,
    duration_minutes INT,
    date_saved DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

SELECT * FROM users;
SELECT * FROM roadmaps;
SELECT * FROM levels;
SELECT * FROM tasks;
SELECT * FROM user_tasks;
SELECT * FROM triumphs;
SELECT * FROM user_triumphs;
SELECT * FROM streaks;
SELECT * FROM interests;
SELECT * FROM interest_levels;
SELECT * FROM user_characterization;
SELECT * FROM user_pace_history;
SELECT * FROM notes;
SELECT * FROM resources;


INSERT INTO users (user_name, email, phone, passwords, rol, objetive, preferred_language)
VALUES ('Camila Gómez', 'laura@examples.com', '3001234568', 'laura1233', 'user', 'Quiero convertirme en desarrolladora webs', 'es');


SELECT * FROM users;



INSERT INTO interests (name) VALUES ('Programación Web');
INSERT INTO interests (name) VALUES ('Inteligencia Artificial');
INSERT INTO interests (name) VALUES ('Ciberseguridad');


SELECT * FROM interests;


INSERT INTO interest_levels (user_id, interest_id, knowledge_level)
VALUES ('7a541ad0-8371-11f0-8815-08bfb8031449', 1, 'beginner'); 


SELECT * FROM interest_levels;


INSERT INTO interest_levels (user_id, interest_id, knowledge_level)
VALUES ('3bbf99df-8373-11f0-8815-08bfb8031449', 1, 'beginner');

SELECT * FROM interest_levels;

INSERT INTO user_characterization (user_id, learning_goal, learning_pace)
VALUES ('3bbf99df-8373-11f0-8815-08bfb8031449', 'Conseguir un empleo en desarrollo web en 6 meses', 'balanced');

SELECT * FROM user_characterization;

INSERT INTO roadmaps (title, roadmap_description, topic, difficulty, estimated_time, user_id)
VALUES ('Roadmap de Desarrollo Web', 'Ruta de aprendizaje para front-end y back-end', 'Programación Web',
        'beginner', 180, '3bbf99df-8373-11f0-8815-08bfb8031449');

SELECT * FROM roadmaps;

INSERT INTO levels (roadmap_id, title, description, order_number, xp_reward, status)
VALUES (LAST_INSERT_ID(), 'HTML & CSS Básico', 'Aprende a estructurar páginas web', 1, 100, 'unlocked'),
       (LAST_INSERT_ID(), 'JavaScript Inicial', 'Primeros pasos con la programación web', 2, 150, 'locked');

SELECT * FROM levels;

INSERT INTO tasks (level_id, title, description, type, xp_reward, status)
VALUES 
(1, 'Leer introducción a HTML', 'Material básico de etiquetas HTML', 'reading', 50, 'pending'),
(1, 'Practicar con CSS', 'Aplicar estilos a una página simple', 'practice', 50, 'pending'),
(2, 'Hacer un quiz de JavaScript', 'Preguntas básicas sobre variables y funciones', 'quiz', 75, 'pending');

SELECT * FROM tasks;

INSERT INTO user_tasks (user_task_id, user_id, task_id, status, date_completed)
VALUES 
('uuid-task-1', '3bbf99df-8373-11f0-8815-08bfb8031449', 7, 'completed', NOW()),
('uuid-task-2', '3bbf99df-8373-11f0-8815-08bfb8031449', 8, 'in_progress', NULL);

SELECT * FROM user_tasks;

INSERT INTO triumphs (title, description, icon, xp_required, type_triumph)
VALUES
('Primer paso', 'Completaste tu primera tarea', 'icon1.png', 50, 'progress'),
('Constancia', 'Completaste 5 días seguidos', 'icon2.png', 0, 'streak');

SELECT * FROM triumphs;

INSERT INTO user_triumphs (user_id, triumph_id)
VALUES
('3bbf99df-8373-11f0-8815-08bfb8031449', 1),  
('3bbf99df-8373-11f0-8815-08bfb8031449', 2);  

SELECT * FROM user_triumphs;


INSERT INTO streaks (user_id, start_date, longest_streak_days, last_active_date, current_streak_days)
VALUES
('3bbf99df-8373-11f0-8815-08bfb8031449', '2025-08-20', 3, NOW(), 2);

SELECT * FROM streaks;

INSERT INTO notes (user_id, title, content)
VALUES 
('3bbf99df-8373-11f0-8815-08bfb8031449', 'Apuntes HTML', 'Recordar que siempre se cierra la etiqueta <p>');

SELECT * FROM notes;

INSERT INTO resources (user_id, title, type, link, duration_minutes)
VALUES
('3bbf99df-8373-11f0-8815-08bfb8031449', 'Curso HTML en YouTube', 'video', 'https://youtube.com/cursohtml', 45);

SELECT * FROM resources;
