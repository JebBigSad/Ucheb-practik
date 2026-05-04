let currentDate = new Date();

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
        </div>
    `;
    
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) prevBtn.addEventListener('click', () => changeMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeMonth(1));
    
    updateCalendar();
}

function updateCalendar() {
    const monthYearElement = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    
    // Проверяем, существуют ли элементы
    if (!monthYearElement || !calendarGrid) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthYearElement.innerText = `${currentDate.toLocaleString('ru', { month: 'long' })} ${year}`;
    
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
            gridHtml += `<div class="calendar-day ${isToday ? 'today' : ''}">${dayCounter}</div>`;
            dayCounter++;
        }
    }
    
    calendarGrid.innerHTML = gridHtml;
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
