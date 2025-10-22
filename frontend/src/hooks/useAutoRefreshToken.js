import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/userSlice";
import postData from "../utils/postData";

export const useAutoRefreshToken = () => {
    const dispatch = useDispatch();
    const intervalRef = useRef(null);

    const doRefresh = async () => {
        try {
            await postData(
                "POST",
                `${import.meta.env.VITE_API_URL}auth/refresh`,
                {}
            );
            // console.log("Токен обновлён");
        } catch (error) {
            console.error("Ошибка обновления токена:", error);
            if (error.status === 401) {
                dispatch(logout());
                window.location.replace(
                    `${import.meta.env.VITE_API_URL}auth/login`
                );
            }
        }
    };

    useEffect(() => {
        doRefresh();

        intervalRef.current = setInterval(doRefresh, 15 * 60 * 1000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                doRefresh();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const handleOnline = () => {
            doRefresh();
        };
        window.addEventListener("online", handleOnline);

        return () => {
            clearInterval(intervalRef.current);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            window.removeEventListener("online", handleOnline);
        };
    }, [dispatch]);
};
