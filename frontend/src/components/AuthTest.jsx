import { useState, useEffect } from 'react';

/**
 * Компонент для тестирования полного OAuth flow с Keycloak
 *
 * Использование:
 * import AuthTest from './components/AuthTest';
 * <AuthTest />
 */
export default function AuthTest() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:8000';

    // Проверка авторизации при загрузке компонента
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/auth/user`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setError(null);
            } else {
                setUser(null);
            }
        } catch (err) {
            setError(err.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        // Сохраняем текущий URL для возврата после логина (опционально)
        sessionStorage.setItem('returnUrl', window.location.pathname);

        // Редирект на Keycloak через бекенд
        window.location.href = `${API_URL}/api/auth/login`;
    };

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            alert('✅ Вы вышли из системы');
        } catch (err) {
            console.error('Ошибка logout:', err);
            alert('❌ Ошибка при выходе');
        }
    };

    const testProtectedAPI = async () => {
        try {
            const response = await fetch(`${API_URL}/api/sales-funnel-projects`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Защищенный API - данные получены:', data);
                alert(`✅ Успешно! Получено записей: ${data.data?.length || 'N/A'}\n\nСм. консоль для деталей`);
            } else {
                const error = await response.json();
                console.error('❌ Ошибка API:', error);
                alert(`❌ Ошибка ${response.status}: ${error.message || 'Нет доступа'}`);
            }
        } catch (err) {
            console.error('❌ Ошибка запроса:', err);
            alert('❌ Ошибка сети или CORS');
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    ⏳ Проверка авторизации...
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🔐 Тест авторизации Keycloak</h2>

            {error && (
                <div style={styles.error}>
                    ⚠️ Ошибка: {error}
                </div>
            )}

            <div style={styles.status}>
                <strong>Статус:</strong>{' '}
                {user ? (
                    <span style={styles.statusSuccess}>✅ Авторизован</span>
                ) : (
                    <span style={styles.statusError}>❌ Не авторизован</span>
                )}
            </div>

            {user ? (
                <div>
                    <div style={styles.userInfo}>
                        <h3>👤 Информация о пользователе:</h3>
                        <div style={styles.infoGrid}>
                            <div><strong>Email:</strong></div>
                            <div>{user.userinfo?.email || 'N/A'}</div>

                            <div><strong>Имя:</strong></div>
                            <div>{user.userinfo?.name || 'N/A'}</div>

                            <div><strong>Username:</strong></div>
                            <div>{user.userinfo?.preferred_username || 'N/A'}</div>

                            <div><strong>ID:</strong></div>
                            <div>{user.userinfo?.sub?.substring(0, 20)}...</div>
                        </div>

                        <details style={{ marginTop: '10px' }}>
                            <summary style={{ cursor: 'pointer' }}>
                                📄 Полные данные (JSON)
                            </summary>
                            <pre style={styles.json}>
                                {JSON.stringify(user, null, 2)}
                            </pre>
                        </details>
                    </div>

                    <div style={styles.actions}>
                        <button onClick={testProtectedAPI} style={styles.buttonPrimary}>
                            🧪 Тест защищенного API
                        </button>
                        <button onClick={checkAuth} style={styles.buttonSecondary}>
                            🔄 Обновить данные
                        </button>
                        <button onClick={handleLogout} style={styles.buttonDanger}>
                            🚪 Выйти
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p style={styles.notAuthText}>
                        Для доступа к защищенным API необходимо авторизоваться через Keycloak.
                    </p>
                    <button onClick={handleLogin} style={styles.buttonLogin}>
                        🔐 Войти через Keycloak
                    </button>
                    <p style={styles.hint}>
                        💡 После нажатия вы будете перенаправлены на страницу входа Keycloak
                    </p>
                </div>
            )}

            <hr style={styles.divider} />

            <div style={styles.endpoints}>
                <strong>📡 Endpoints:</strong>
                <ul style={styles.endpointsList}>
                    <li>Login: <code>{API_URL}/api/auth/login</code></li>
                    <li>User: <code>{API_URL}/api/auth/user</code></li>
                    <li>Logout: <code>{API_URL}/api/auth/logout</code></li>
                    <li>Protected API: <code>{API_URL}/api/sales-funnel-projects</code></li>
                </ul>
            </div>
        </div>
    );
}

// Стили
const styles = {
    container: {
        padding: '20px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        margin: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#ffffff',
        maxWidth: '800px'
    },
    title: {
        marginTop: 0,
        color: '#333'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#666'
    },
    error: {
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '4px',
        padding: '10px',
        marginBottom: '15px',
        color: '#c33'
    },
    status: {
        fontSize: '16px',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
    },
    statusSuccess: {
        color: '#0a0',
        fontWeight: 'bold'
    },
    statusError: {
        color: '#c33',
        fontWeight: 'bold'
    },
    userInfo: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: '10px',
        marginTop: '10px'
    },
    json: {
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '12px',
        maxHeight: '300px'
    },
    actions: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },
    buttonPrimary: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    buttonSecondary: {
        padding: '10px 20px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    buttonDanger: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    buttonLogin: {
        padding: '15px 30px',
        backgroundColor: '#FF9800',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        width: '100%',
        marginTop: '10px'
    },
    notAuthText: {
        color: '#666',
        lineHeight: '1.6'
    },
    hint: {
        fontSize: '14px',
        color: '#999',
        marginTop: '10px'
    },
    divider: {
        margin: '20px 0',
        border: 'none',
        borderTop: '1px solid #e0e0e0'
    },
    endpoints: {
        fontSize: '14px',
        color: '#666'
    },
    endpointsList: {
        listStyle: 'none',
        padding: 0,
        margin: '10px 0'
    }
};


