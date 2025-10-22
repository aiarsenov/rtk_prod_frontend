import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../store/slices/userSlice";

import Router from "./Router";
import Loader from "./Loader";

function App() {
    const dispatch = useDispatch();
    const { data: user, loading, error } = useSelector((state) => state.user);

    useEffect(() => {
        if (import.meta.env.MODE !== "development") {
            dispatch(fetchUser());
        }
    }, [dispatch]);

    useEffect(() => {
        if (
            import.meta.env.MODE !== "development" &&
            error === "unauthorized"
        ) {
            window.location.replace(
                `${import.meta.env.VITE_API_URL}auth/login`
            );
        }
    }, [error]);

    const displayUser =
        import.meta.env.MODE === "development"
            ? { name: "Dev", family_name: "User", email: "dev@example.com" }
            : user;

    if ((import.meta.env.MODE !== "development" && loading) || !displayUser) {
        return <Loader />;
    }

    return <Router />;
}

export default App;
