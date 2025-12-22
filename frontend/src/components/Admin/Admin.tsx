import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import { isAdmin } from "../../utils/permissions";
import { toast } from "react-toastify";

import AccessDenied from "../AccessDenied/AccessDenied";
import AdminUsers from "./AdminUsers";
import AdminGroups from "./AdminGroups";
import ActiveButton from "../Buttons/ActiveButton";
import Popup from "../Popup/Popup";

import "../AccessDenied/AccessDenied.scss";
import "./Admin.scss";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("users");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [users, setUsers] = useState([]);

    const user = useSelector((state) => state.user.data);

    const userPermitions = useSelector(
        (state) => state.user?.data?.permissions
    );

    const mode = userPermitions?.admin || {
        delete: "read",
        edit: "read",
        view: "read",
    };

    const loadUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setAccessDenied(false);
            const response = await getData(
                `${import.meta.env.VITE_API_URL}admin/users`
            );
            if (response.status === 200) {
                setUsers(response.data.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки пользователей:", err);
            if (err.status === 403) {
                setAccessDenied(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [import.meta.env.VITE_API_URL]);

    // Получаем доступынх для приглашения сотрудников
    const fetchAvailableEmployees = async () => {
        try {
            const response = await getData(
                `${import.meta.env.VITE_API_URL}admin/users/available`
            );
            if (response.status === 200) {
                setAvailableEmployees(response.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки сотрудников:", err);
        }
    };

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await postData(
                "POST",
                `${import.meta.env.VITE_API_URL}admin/users/invite`,
                { invitations: selectedEmployees }
            );

            setShowInviteModal(false);
            setSelectedEmployees([]);
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка отправки приглашения", {
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            setError(err.message || "Ошибка отправки приглашения");
        }
    };

    // Открываем попап добавления пользователей после получения списка
    const handleInviteClick = async () => {
        await fetchAvailableEmployees();
        setShowInviteModal(true);
    };

    useEffect(() => {
        if (activeTab === "users") {
            loadUsers();
        }
    }, [activeTab]);

    useEffect(() => {
        console.log(selectedEmployees);
    }, [selectedEmployees]);

    // Если нет прав на управление пользователями - показываем заглушку
    if (!isAdmin(user)) {
        return (
            <main className="page">
                <div className="container py-8">
                    <AccessDenied message="Доступ к админ-панели разрешен только администраторам" />
                </div>
            </main>
        );
    }

    return (
        <main className="page reports-registry admin">
            <div className="container admin__container">
                <section className="registry__header flex items-center">
                    <h1 className="title">Администрирование</h1>

                    <ul className="card__tabs">
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                name="active_tab"
                                id="users"
                                checked={activeTab == "users"}
                                onChange={() => {
                                    if (isLoading) {
                                        return;
                                    }
                                    setActiveTab("users");
                                }}
                                disabled={isLoading}
                            />
                            <label htmlFor="users">Пользователи</label>
                        </li>

                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                name="active_tab"
                                id="groups"
                                checked={activeTab == "groups"}
                                onChange={() => {
                                    if (isLoading) {
                                        return;
                                    }
                                    setActiveTab("groups");
                                }}
                                disabled={isLoading}
                            />
                            <label htmlFor="groups">Группы</label>
                        </li>
                    </ul>

                    {mode.edit === "full" && (
                        <ActiveButton
                            className="ml-auto"
                            label="Добавить пользователей"
                            onClick={handleInviteClick}
                            isDisabled={isLoading}
                        />
                    )}
                </section>

                <section className="admin__content registry__table-section w-full">
                    {activeTab === "users" && (
                        <AdminUsers
                            mode={mode}
                            loadUsers={loadUsers}
                            isLoading={isLoading}
                            accessDenied={accessDenied}
                            users={users}
                        />
                    )}

                    {activeTab === "groups" && <AdminGroups mode={mode} />}
                </section>
            </div>

            {showInviteModal && (
                <Popup
                    onClick={() => setShowInviteModal(false)}
                    title="Добавить пользователей"
                >
                    <form>
                        <div className="admin-form">
                            <div className="admin-form__users">
                                <div className="multi-select__actions">
                                    <button
                                        className="multi-select__selectall-button"
                                        type="button"
                                        title="Выбрать всех пользователей"
                                    >
                                        Выбрать все
                                    </button>

                                    <button
                                        className="multi-select__reset-button"
                                        type="button"
                                        title="Сбрось выбор"
                                    >
                                        <span>
                                            <svg
                                                width="12"
                                                height="13"
                                                viewBox="0 0 12 13"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M7.06 6.5l2.652 2.652-1.06 1.06L6 7.561l-2.652 2.651-1.06-1.06L4.939 6.5 2.288 3.848l1.06-1.06L6 5.439l2.652-2.651 1.06 1.06L7.061 6.5z"
                                                    fill="#0078D2"
                                                ></path>
                                            </svg>
                                        </span>
                                        Сбросить
                                    </button>
                                </div>

                                <div className="admin-form__users-list">
                                    {availableEmployees.length > 0 &&
                                        availableEmployees.map((item) => (
                                            <label
                                                className="form-checkbox"
                                                key={item.key}
                                                htmlFor={item.id}
                                            >
                                                <div>
                                                    {item.name}
                                                    <span>{item.email}</span>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    name={item.name}
                                                    id={item.id}
                                                    checked={selectedEmployees.some(
                                                        (emp) =>
                                                            emp.physical_person_id ===
                                                            item.id
                                                    )}
                                                    onChange={(e) => {
                                                        const checked =
                                                            e.target.checked;

                                                        setSelectedEmployees(
                                                            (prev) => {
                                                                if (checked) {
                                                                    const exists =
                                                                        prev.some(
                                                                            (
                                                                                emp
                                                                            ) =>
                                                                                emp.physical_person_id ===
                                                                                item.id
                                                                        );

                                                                    if (exists)
                                                                        return prev;

                                                                    return [
                                                                        ...prev,
                                                                        {
                                                                            physical_person_id:
                                                                                item.id,
                                                                            email: item.email,
                                                                            resend: false,
                                                                        },
                                                                    ];
                                                                }

                                                                // ➖ убираем при снятии галочки
                                                                return prev.filter(
                                                                    (emp) =>
                                                                        emp.physical_person_id !==
                                                                        item.id
                                                                );
                                                            }
                                                        );
                                                    }}
                                                />
                                                <div className="checkbox"></div>
                                            </label>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="action-form__footer">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => setShowInviteModal(false)}
                                title="Отменить приглашение"
                            >
                                Отмена
                            </button>

                            <button
                                type="button"
                                className="action-button"
                                title="Отправить приглашение пользователям"
                                onClick={handleInviteSubmit}
                            >
                                Добавить
                            </button>
                        </div>
                    </form>
                </Popup>
            )}
        </main>
    );
};

export default Admin;
