let currentInput = '0';
let previousInput = '';
let operation = null;

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
    if (operation !== null) calculate();
    previousInput = currentInput;
    operation = op;
    currentInput = '0';
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(curr)) return;
    
    switch (operation) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/': 
            if (curr === 0) {
                currentInput = 'Ошибка';
                updateDisplay();
                return;
            }
            result = prev / curr; 
            break;
        default: return;
    }
    
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    updateDisplay();
}

function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    updateDisplay();
}

function initCalculator() {
    const calculatorDiv = document.getElementById('calculator');
    if (!calculatorDiv) return;
    
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
}

window.initCalculator = initCalculator;
