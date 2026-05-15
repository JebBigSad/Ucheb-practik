-- 1. Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. История калькулятора
CREATE TABLE calculator_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expression TEXT NOT NULL,
    result TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_calculator_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. История игр
CREATE TABLE game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    winner VARCHAR(1) NOT NULL,
    moves_count INTEGER NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_winner CHECK (winner IN ('X', 'O', 'draw'))
);

-- 4. Заметки в календаре
CREATE TABLE calendar_notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    note_date DATE NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_calendar_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. История запросов погоды
CREATE TABLE weather_queries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    city VARCHAR(100) NOT NULL,
    temperature DECIMAL(5,2),
    humidity INTEGER,
    description VARCHAR(100),
    queried_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_weather_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================

CREATE INDEX idx_calculator_user_id ON calculator_history(user_id);
CREATE INDEX idx_calculator_created_at ON calculator_history(created_at);
CREATE INDEX idx_game_user_id ON game_sessions(user_id);
CREATE INDEX idx_calendar_user_id ON calendar_notes(user_id);
CREATE INDEX idx_calendar_note_date ON calendar_notes(note_date);
CREATE INDEX idx_weather_user_id ON weather_queries(user_id);
CREATE INDEX idx_weather_city ON weather_queries(city);

-- ============================================

COMMENT ON TABLE users IS 'Пользователи приложения (создаются автоматически)';
COMMENT ON TABLE calculator_history IS 'История вычислений калькулятора';
COMMENT ON TABLE game_sessions IS 'История игр в крестики-нолики';
COMMENT ON TABLE calendar_notes IS 'Заметки пользователя в календаре';
COMMENT ON TABLE weather_queries IS 'История запросов погоды';

COMMENT ON COLUMN users.session_id IS 'Уникальный идентификатор сессии/браузера';
COMMENT ON COLUMN calculator_history.expression IS 'Математическое выражение, введённое пользователем';
COMMENT ON COLUMN calculator_history.result IS 'Результат вычисления';
COMMENT ON COLUMN game_sessions.winner IS 'Победитель: X, O или draw (ничья)';
COMMENT ON COLUMN calendar_notes.note_date IS 'Дата, на которую создана заметка';
COMMENT ON COLUMN weather_queries.city IS 'Город, введённый пользователем';