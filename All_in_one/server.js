const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'All_in_one',
    password: 'jebbigsad',
    port: 5432,
});

// Проверка подключения
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
    } else {
        console.log('✅ Подключено к PostgreSQL (ucheb_practik_db)');
        release();
    }
});



// 1. Получить все вычисления пользователя
app.get('/api/calculator/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM calculator_history WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Сохранить вычисление
app.post('/api/calculator', async (req, res) => {
    const { user_id, expression, result } = req.body;
    try {
        const newRecord = await pool.query(
            'INSERT INTO calculator_history (user_id, expression, result) VALUES ($1, $2, $3) RETURNING *',
            [user_id, expression, result]
        );
        res.json(newRecord.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Получить все игры пользователя
app.get('/api/games/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM game_sessions WHERE user_id = $1 ORDER BY played_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Сохранить игру
app.post('/api/games', async (req, res) => {
    const { user_id, winner, moves_count } = req.body;
    try {
        const newGame = await pool.query(
            'INSERT INTO game_sessions (user_id, winner, moves_count) VALUES ($1, $2, $3) RETURNING *',
            [user_id, winner, moves_count]
        );
        res.json(newGame.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Получить заметки по дате
app.get('/api/notes/:userId/:date', async (req, res) => {
    const { userId, date } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM calendar_notes WHERE user_id = $1 AND note_date = $2 ORDER BY created_at DESC',
            [userId, date]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Сохранить заметку
app.post('/api/notes', async (req, res) => {
    const { user_id, note_date, title, content } = req.body;
    try {
        const newNote = await pool.query(
            'INSERT INTO calendar_notes (user_id, note_date, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, note_date, title, content]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Получить историю погоды
app.get('/api/weather/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM weather_queries WHERE user_id = $1 ORDER BY queried_at DESC LIMIT 10',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Сохранить запрос погоды
app.post('/api/weather', async (req, res) => {
    const { user_id, city, temperature, humidity, description } = req.body;
    try {
        const newQuery = await pool.query(
            'INSERT INTO weather_queries (user_id, city, temperature, humidity, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, city, temperature, humidity, description]
        );
        res.json(newQuery.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`��� Сервер запущен на http://localhost:${PORT}`);
});

// 9. Создание нового пользователя
app.post('/api/users', async (req, res) => {
    const { session_id } = req.body;
    try {
        // Проверяем, существует ли уже такой session_id
        const existing = await pool.query(
            'SELECT * FROM users WHERE session_id = $1',
            [session_id]
        );
        
        if (existing.rows.length > 0) {
            res.json(existing.rows[0]);
            return;
        }
        
        // Создаём нового пользователя
        const result = await pool.query(
            'INSERT INTO users (session_id) VALUES ($1) RETURNING *',
            [session_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка создания пользователя:', err);
        res.status(500).json({ error: err.message });
    }
});
