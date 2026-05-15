let currentInput = '0';
let previousInput = '';
let currentOperation = null;

function updateDisplay() {
    const display = document.getElementById('calcDisplay');
    if (display) display.innerText = currentInput;
}

function handleNumber(num) {
    if (currentInput === '0' || currentInput === 'Ошибка') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (currentOperation !== null) calculate();
    previousInput = currentInput;
    currentOperation = op;
    currentInput = '0';
}

async function calculate() {
    if (currentOperation === null || previousInput === '') return;
    
    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(curr)) return;
    
    switch (currentOperation) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/': 
            if (curr === 0) {
                currentInput = 'Ошибка';
                updateDisplay();
                currentOperation = null;
                previousInput = '';
                return;
            }
            result = prev / curr;
            break;
        default: return;
    }
    
    const expression = `${prev} ${currentOperation} ${curr}`;
    const resultStr = result.toString();
    
    currentInput = resultStr;
    currentOperation = null;
    previousInput = '';
    updateDisplay();
    
    // Сохраняем в БД
    if (window.API && window.API.saveCalculation) {
        console.log('Сохраняем вычисление:', expression, '=', resultStr);
        await window.API.saveCalculation(expression, resultStr);
    }
}

function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    currentOperation = null;
    updateDisplay();
}

function initCalculator() {
    const calculatorDiv = document.getElementById('calculator');
    if (!calculatorDiv) {
        console.error('❌ Элемент calculator не найден');
        return;
    }
    
    // Принудительно заполняем HTML калькулятора
    calculatorDiv.innerHTML = `
        <div class="calculator">
            <div class="calc-display" id="calcDisplay">0</div>
            <div class="calc-buttons">
                <button class="calc-btn clear" data-action="clear">C</button>
                <button class="calc-btn" data-number="7">7</button>
                <button class="calc-btn" data-number="8">8</button>
                <button class="calc-btn" data-number="9">9</button>
                <button class="calc-btn operator" data-operator="/">/</button>
                <button class="calc-btn" data-number="4">4</button>
                <button class="calc-btn" data-number="5">5</button>
                <button class="calc-btn" data-number="6">6</button>
                <button class="calc-btn operator" data-operator="*">*</button>
                <button class="calc-btn" data-number="1">1</button>
                <button class="calc-btn" data-number="2">2</button>
                <button class="calc-btn" data-number="3">3</button>
                <button class="calc-btn operator" data-operator="-">-</button>
                <button class="calc-btn" data-number="0">0</button>
                <button class="calc-btn" data-number="00">00</button>
                <button class="calc-btn equal" data-calculate>=</button>
                <button class="calc-btn operator" data-operator="+">+</button>
            </div>
        </div>
    `;
    
    // Добавляем обработчики
    document.querySelectorAll('[data-number]').forEach(btn => {
        btn.addEventListener('click', () => handleNumber(btn.dataset.number));
    });
    
    document.querySelectorAll('[data-operator]').forEach(btn => {
        btn.addEventListener('click', () => handleOperator(btn.dataset.operator));
    });
    
    const calculateBtn = document.querySelector('[data-calculate]');
    if (calculateBtn) calculateBtn.addEventListener('click', calculate);
    
    const clearBtn = document.querySelector('[data-action="clear"]');
    if (clearBtn) clearBtn.addEventListener('click', clearCalculator);
    
    console.log('✅ Калькулятор отрисован и готов к работе');
}

window.initCalculator = initCalculator;
