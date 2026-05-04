let clockInterval = null;

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', { hour12: false });
    const clockElement = document.getElementById('clockDisplay');
    if (clockElement) {
        clockElement.innerText = timeString;
    }
}

function renderClock() {
    const container = document.getElementById('clock');
    if (!container) return;
    
    container.innerHTML = `
        <div class="clock-container">
            <div class="digital-clock" id="clockDisplay">--:--:--</div>
            <p style="margin-top: 20px; color: #666;">Текущее время</p>
        </div>
    `;
    
    if (clockInterval) clearInterval(clockInterval);
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
}

function initClock() {
    renderClock();
}

window.initClock = initClock;
window.updateClockManually = updateClock;
