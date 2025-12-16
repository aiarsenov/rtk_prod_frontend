import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import postData from "../../utils/postData";

import "./User.scss";

const getInitials = (value) => {
    return value && value != "" ? Array.from(value)[0] : "";
};


const getShortName = (fullName) => {
    if (!fullName) return "";

    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
        return `${parts[0]} ${parts[1]}`;
    }

    return parts[0] || "";
};

const User = () => {
    const user = useSelector((state) => state.user.data);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Закрытие dropdown при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    if (!user) return null;

    const shortName = getShortName(user.name);
    const nameParts = shortName.split(/\s+/);
    const firstNameInitial = getInitials(nameParts[0] || "");
    const lastNameInitial = getInitials(nameParts[1] || "");

    return (
        user &&
        Object.keys(user).length > 0 && (
            <div className="user" ref={dropdownRef}>
                <div
                    className="user__trigger"
                    onClick={toggleDropdown}
                    title="Открыть меню пользователя"
                >
                    <div className="user__photo">{`${firstNameInitial}${lastNameInitial}`}</div>

                    <div className="user__info">
                        <div>
                            <b>{shortName}</b>
                            <span>{user.email}</span>
                        </div>

                        <div className="user__info-icon">
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    className="chevron"
                                    d={isDropdownOpen ? "M 1 7, L 5 3, L 9 7" : "M 1 3, L 5 7, L 9 3"}
                                    fill="none"
                                    stroke="currentColor"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {isDropdownOpen && (
                    <div className="user__dropdown">
                        <button
                            type="button"
                            className="user__dropdown-item user__dropdown-item_disabled"
                            disabled
                        >
                            Сменить пароль
                        </button>
                        <button
                            type="button"
                            className="user__dropdown-item"
                            onClick={logOut}
                        >
                            Выйти из профиля
                        </button>
                    </div>
                )}
            </div>
        )
    );
};

export default User;
