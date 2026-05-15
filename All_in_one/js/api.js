const API_BASE_URL = 'http://localhost:3000/api';
let currentUserId = null;



async function initUser() {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
        currentUserId = parseInt(savedUserId);
        console.log('��� Загружен пользователь ID:', currentUserId);
        return currentUserId;
    }
    
    try {
        // Создаём нового пользователя
        const sessionId = localStorage.getItem('session_id') || generateSessionId();
        localStorage.setItem('session_id', sessionId);
        
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });
        
        if (!response.ok) throw new Error('Ошибка создания пользователя');
        
        const data = await response.json();
        currentUserId = data.id;
        localStorage.setItem('currentUserId', currentUserId);
        console.log('��� Создан новый пользователь ID:', currentUserId);
        return currentUserId;
    } catch (error) {
        console.error('❌ Ошибка инициализации пользователя:', error);
        currentUserId = 1; 
        return 1;
    }
}

function generateSessionId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// КАЛЬКУЛЯТОР

async function saveCalculation(expression, result) {
    if (!currentUserId) await initUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/calculator`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUserId,
                expression: expression,
                result: result
            })
        });
        
        if (!response.ok) throw new Error('Ошибка сохранения');
        
        const data = await response.json();
        console.log('��� Вычисление сохранено в БД:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка сохранения вычисления:', error);
    }
}

async function getCalculationHistory() {
    if (!currentUserId) await initUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/calculator/${currentUserId}`);
        const data = await response.json();
        console.log('��� История вычислений:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка получения истории:', error);
        return [];
    }
}

// ИГРЫ

async function saveGame(winner, movesCount) {
    if (!currentUserId) await initUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUserId,
                winner: winner,
                moves_count: movesCount
            })
        });
        
        const data = await response.json();
        console.log('��� Игра сохранена в БД:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка сохранения игры:', error);
    }
}

async function getGameHistory() {
    if (!currentUserId) await initUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/games/${currentUserId}`);
        const data = await response.json();
        console.log('��� История игр:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка получения истории игр:', error);
        return [];
    }
}

// ЗАМЕТКИ

async function saveNote(noteDate, title, content) {
    if (!currentUserId) await initUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUserId,
                note_date: noteDate,
                title: title,
                content: content
            })
        });
        
        const data = await response.json();
        console.log('��� Заметка сохранена в БД:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка сохранения заметки:', error);
    }
}

async function getNotesByDate(date) {
    if (!currentUserId) await initUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/notes/${currentUserId}/${date}`);
        const data = await response.json();
        console.log(`��� Заметки за ${date}:`, data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка получения заметок:', error);
        return [];
    }
}

// ПОГОДА

async function saveWeatherQuery(city, temperature, humidity, description) {
    if (!currentUserId) await initUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/weather`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUserId,
                city: city,
                temperature: temperature,
                humidity: humidity,
                description: description
            })
        });
        
        const data = await response.json();
        console.log('��� Запрос погоды сохранён в БД:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка сохранения запроса погоды:', error);
    }
}

async function getWeatherHistory() {
    if (!currentUserId) await initUser();
    
    try {
        const response = await fetch(`${API_BASE_URL}/weather/${currentUserId}`);
        const data = await response.json();
        console.log('��� История запросов погоды:', data);
        return data;
    } catch (error) {
        console.error('❌ Ошибка получения истории погоды:', error);
        return [];
    }
}


window.API = {
    initUser,
    saveCalculation,
    getCalculationHistory,
    saveGame,
    getGameHistory,
    saveNote,
    getNotesByDate,
    saveWeatherQuery,
    getWeatherHistory,
    getUserId: () => currentUserId
};

initUser().then(() => {
    console.log('✅ API готов, пользователь ID:', currentUserId);
});
