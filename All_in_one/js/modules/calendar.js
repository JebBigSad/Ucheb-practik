let currentDate = new Date();
let selectedDate = null;

function renderCalendar() {
    const container = document.getElementById('calendar');
    if (!container) return;
    
    container.innerHTML = `
        <div class="calendar-container">
            <div class="calendar-header">
                <button class="calendar-nav-btn" id="prevMonth">◀ Назад</button>
                <h2 id="monthYear"></h2>
                <button class="calendar-nav-btn" id="nextMonth">Вперёд ▶</button>
            </div>
            <div class="calendar-grid" id="calendarGrid"></div>
            <div class="notes-section" style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 16px;">
                <h3>📝 Заметки на выбранную дату</h3>
                <div id="selectedDateDisplay" style="margin-bottom: 10px; font-weight: bold;"></div>
                <div id="notesList" style="margin-bottom: 10px;"></div>
                <input type="text" id="noteTitle" placeholder="Заголовок" style="width: 100%; padding: 8px; margin-bottom: 8px; border-radius: 8px; border: 1px solid #ccc;">
                <textarea id="noteContent" placeholder="Текст заметки" rows="3" style="width: 100%; padding: 8px; margin-bottom: 8px; border-radius: 8px; border: 1px solid #ccc;"></textarea>
                <button id="saveNoteBtn" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">💾 Сохранить заметку</button>
            </div>
        </div>
    `;
    
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    document.getElementById('saveNoteBtn').addEventListener('click', saveCurrentNote);
    
    updateCalendar();
}

async function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    document.getElementById('monthYear').innerText = `${currentDate.toLocaleString('ru', { month: 'long' })} ${year}`;
    
    const firstDayOfMonth = new Date(year, month, 1);
    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    let gridHtml = weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join('');
    
    let dayCounter = 1;
    
    for (let i = 0; i < 42; i++) {
        if (i < startDay || dayCounter > daysInMonth) {
            gridHtml += `<div class="calendar-day empty"></div>`;
        } else {
            const today = new Date();
            const isToday = dayCounter === today.getDate() && 
                           year === today.getFullYear() && 
                           month === today.getMonth();
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(dayCounter).padStart(2,'0')}`;
            gridHtml += `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">${dayCounter}</div>`;
            dayCounter++;
        }
    }
    
    document.getElementById('calendarGrid').innerHTML = gridHtml;
    
    // Добавляем обработчики на дни
    document.querySelectorAll('.calendar-day:not(.empty)').forEach(day => {
        day.addEventListener('click', () => selectDate(day.dataset.date));
    });
    
    // Если нет выбранной даты, выбираем сегодня
    if (!selectedDate) {
        const todayStr = new Date().toISOString().split('T')[0];
        selectDate(todayStr);
    } else {
        selectDate(selectedDate);
    }
}

async function selectDate(dateStr) {
    selectedDate = dateStr;
    document.getElementById('selectedDateDisplay').innerText = `📅 ${dateStr}`;
    
    // Загружаем заметки за эту дату
    if (window.API && window.API.getNotesByDate) {
        const notes = await window.API.getNotesByDate(dateStr);
        displayNotes(notes);
    }
}

function displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    if (!notesList) return;
    
    if (notes.length === 0) {
        notesList.innerHTML = '<p style="color: #666;">Нет заметок на эту дату</p>';
    } else {
        notesList.innerHTML = notes.map(note => `
            <div style="background: white; padding: 10px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #667eea;">
                <strong>${escapeHtml(note.title)}</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem;">${escapeHtml(note.content || '')}</p>
                <small style="color: #666;">Создано: ${new Date(note.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function saveCurrentNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    if (!title && !content) {
        alert('Введите заголовок или текст заметки');
        return;
    }
    
    if (window.API && window.API.saveNote && selectedDate) {
        await window.API.saveNote(selectedDate, title || 'Без заголовка', content);
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        // Обновляем список заметок
        const notes = await window.API.getNotesByDate(selectedDate);
        displayNotes(notes);
        alert('✅ Заметка сохранена!');
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    updateCalendar();
}

function initCalendar() {
    renderCalendar();
}

window.initCalendar = initCalendar;
window.refreshCalendar = updateCalendar;
