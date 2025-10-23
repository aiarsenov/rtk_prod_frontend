import { useSelector } from "react-redux";

import postData from "../../utils/postData";

import "./User.scss";

const getInitials = (value) => {
    return value && value != "" ? Array.from(value)[0] : "";
};

const User = () => {
    const user = useSelector((state) => state.user.data);

    const logOut = () => {
        postData("POST", `${import.meta.env.VITE_API_URL}auth/logout`, {}).then(
            (response) => {
                if (response?.ok) {
                    window.location.replace(
                        `${import.meta.env.VITE_API_URL}auth/login`
                    );
                }
            }
        );
    };

    if (!user) return null;

    return (
        user &&
        Object.keys(user).length > 0 && (
            <div
                className="user"
                onClick={() => logOut()}
                title="Выйти из профиля"
            >
                <div className="user__photo">{`${getInitials(
                    user.name
                )}${getInitials(user.family_name)}`}</div>

                <div className="user__info">
                    <div>
                        <b>{user.name}</b>
                        <span>{user.email}</span>
                    </div>

                    <div className="user__info-icon">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.295 5.039l-3.75-3.75-1.06 1.06 3.22 3.22-3.22 3.22 1.06 1.06 3.75-3.75a.75.75 0 000-1.06z"
                                fill="currentcolor"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        )
    );
};

export default User;
