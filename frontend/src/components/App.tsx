import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/slices/userSlice";
import { initCsrfToken } from "../utils/initCsrf";
// import { useAutoRefreshToken } from "../hooks/useAutoRefreshToken";

import Router from "./Router";
import Loader from "./Loader";

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
        // Загружаем пользователя только если это НЕ страница приглашения
        if (!isInvitePage) {
            dispatch(fetchUser());
        }
    }, [dispatch, isInvitePage]);

    useEffect(() => {
        // Редирект на логин только если это НЕ страница приглашения
        if (
            !isInvitePage &&
            import.meta.env.MODE !== "development" &&
            error === "unauthorized"
        ) {
            // if (error === "unauthorized") {
            window.location.replace(
                `${import.meta.env.VITE_API_URL}auth/login`
            );
        }
    }, [error, isInvitePage]);

    // Если это страница приглашения, пропускаем проверку авторизации
    if (isInvitePage) {
        return <Router />;
    }

    const displayUser =
        import.meta.env.MODE === "development"
            ? { name: "Dev", family_name: "User", email: "dev@example.com" }
            : user;

    // const displayUser = user;

    if ((import.meta.env.MODE !== "development" && loading) || !displayUser) {
        // if (loading || !displayUser) {
        return <Loader />;
    }

    return <Router />;
}

export default App;
