/**
 * Инициализация CSRF токена при загрузке приложения
 * Вызывает endpoint, который устанавливает XSRF-TOKEN cookie
 */
export async function initCsrfToken(apiBaseUrl) {
    try {
        const response = await fetch(`${apiBaseUrl}csrf-cookie`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        });

        // Игнорируем 404 ошибки для локальной разработки
        if (!response.ok && response.status !== 404) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // console.log('✅ CSRF токен инициализирован');
    } catch (error) {
        // В режиме разработки тихо игнорируем ошибки CSRF
        if (import.meta.env.MODE === "development") {
            // console.log('⚠️ CSRF токен не инициализирован (локальная разработка)');
        } else {
            console.error("❌ Ошибка инициализации CSRF токена:", error);
        }
    }
}
