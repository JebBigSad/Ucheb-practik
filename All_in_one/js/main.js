document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация приложения...');
    
    const navBtns = document.querySelectorAll('.nav-btn');
    const modules = document.querySelectorAll('.module');
    
    function switchModule(moduleId) {
        console.log(`Переключение на модуль: ${moduleId}`);
        
        modules.forEach(module => {
            module.classList.remove('active-module');
        });
        
        const activeModule = document.getElementById(moduleId);
        if (activeModule) {
            activeModule.classList.add('active-module');
        } else {
            console.error(`Модуль с id "${moduleId}" не найден`);
        }
        
        navBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`.nav-btn[data-module="${moduleId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const moduleId = btn.dataset.module;
            switchModule(moduleId);
        });
    });

    setTimeout(() => {
        console.log('Инициализация модулей...');
        
        // Калькулятор
        if (window.initCalculator) {
            window.initCalculator();
            console.log('✅ Калькулятор инициализирован');
        } else {
            console.warn('❌ initCalculator не найден');
        }
        
        // Крестики-нолики
        if (window.initGame) {
            window.initGame();
            console.log('✅ Игра инициализирована');
        } else {
            console.warn('❌ initGame не найден');
        }
        
        // Календарь
        if (window.initCalendar) {
            window.initCalendar();
            console.log('✅ Календарь инициализирован');
        } else {
            console.warn('❌ initCalendar не найден');
        }
        
        // Часы
        if (window.initClock) {
            window.initClock();
            console.log('✅ Часы инициализированы');
        } else {
            console.warn('❌ initClock не найден');
        }
        
        // Погода
        if (window.initWeather) {
            window.initWeather();
            console.log('✅ Погода инициализирована');
        } else {
            console.warn('❌ initWeather не найден');
        }
        
        console.log('🎉 Приложение Ucheb-practik успешно запущено!');
    }, 100);
});
