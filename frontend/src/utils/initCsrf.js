/**
 * Инициализация CSRF токена при загрузке приложения
 * Вызывает endpoint, который устанавливает XSRF-TOKEN cookie
 */
export async function initCsrfToken(apiBaseUrl) {
    try {
        await fetch(`${apiBaseUrl}/api/csrf-cookie`, {
            method: 'GET',
            credentials: 'include',
        });
        console.log('✅ CSRF токен инициализирован');
    } catch (error) {
        console.error('❌ Ошибка инициализации CSRF токена:', error);
    }
}

