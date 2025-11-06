/**
 * Получить CSRF токен из cookie
 * Laravel использует XSRF-TOKEN cookie для SPA
 */
export function getCsrfToken() {
    const name = 'XSRF-TOKEN';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
        const token = parts.pop().split(';').shift();
        // Laravel кодирует токен в cookie, нужно декодировать
        return decodeURIComponent(token);
    }
    
    return null;
}

/**
 * Получить заголовки с CSRF токеном для fetch запросов
 */
export function getCsrfHeaders() {
    const token = getCsrfToken();
    
    if (token) {
        return {
            'X-XSRF-TOKEN': token,
        };
    }
    
    return {};
}

