function formatDate(date, format = 'full') {
    const options = {
        full: { year: 'numeric', month: 'long', day: 'numeric' },
        short: { day: '2-digit', month: '2-digit', year: 'numeric' }
    };
    
    return date.toLocaleString('ru-RU', options[format] || options.full);
}

window.helpers = { formatDate };
