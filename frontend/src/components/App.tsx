import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/slices/userSlice";
import { initCsrfToken } from "../utils/initCsrf";
// import { useAutoRefreshToken } from "../hooks/useAutoRefreshToken";

import Router from "./Router";
import Loader from "./Loader";

function getBackendLoginUrl() {
    const apiUrl = import.meta.env.VITE_API_URL || '/api/';

    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        return `${apiUrl}auth/login`;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
    const apiPath = apiUrl.startsWith('/') ? apiUrl : `/${apiUrl}`;

    return `${backendUrl}${apiPath}auth/login`;
}

function App() {
    // if (import.meta.env.MODE !== "development") {
    //     useAutoRefreshToken();
    // }

    const dispatch = useDispatch();
    const { data: user, loading, error } = useSelector((state) => state.user);

    const isInvitePage = window.location.pathname === "/invite/accept";

    // Инициализация CSRF токена при загрузке приложения
    useEffect(() => {
        initCsrfToken(import.meta.env.VITE_API_URL);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const isCallback = urlParams.get('auth_callback') === '1';

        if (isCallback) {
            sessionStorage.removeItem('auth_redirect_attempted');
            urlParams.delete('auth_callback');
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', newUrl);

            setTimeout(() => {
                if (!isInvitePage) {
                    dispatch(fetchUser());
                }
            }, 300);
        } else if (!isInvitePage) {
            // Обычная проверка авторизации
            dispatch(fetchUser());
        }
    }, [dispatch, isInvitePage]);

    useEffect(() => {
        if (!isInvitePage && error === "unauthorized") {
            const currentUrl = window.location.href;
            const isOnLoginPage = currentUrl.includes('/auth/login') || currentUrl.includes('/auth/callback');

            const urlParams = new URLSearchParams(window.location.search);
            const justReturnedFromCallback = urlParams.get('auth_callback') === '1';

            const redirectAttempted = sessionStorage.getItem('auth_redirect_attempted');


            if (justReturnedFromCallback) {
                return;
            }

            if (!isOnLoginPage && !redirectAttempted) {
                // Помечаем, что редирект был попыткой
                sessionStorage.setItem('auth_redirect_attempted', 'true');

                const loginUrl = getBackendLoginUrl();
                window.location.replace(loginUrl);
            } else if (redirectAttempted && !isOnLoginPage) {

                sessionStorage.removeItem('auth_redirect_attempted');

            }
        } else if (user) {
            // Если пользователь авторизован, очищаем флаг редиректа
            sessionStorage.removeItem('auth_redirect_attempted');
        }
    }, [error, isInvitePage, user]);

    if (isInvitePage) {
        return <Router />;
    }


    const displayUser = user;


    if (loading || !displayUser) {
        return <Loader />;
    }

    return <Router />;
}

export default App;
