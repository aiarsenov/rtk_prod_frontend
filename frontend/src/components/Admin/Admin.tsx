import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import { isAdmin } from "../../utils/permissions";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import { toast } from "react-toastify";

import ActiveButton from "../Buttons/ActiveButton";
import AdminUsers from "./AdminUsers";
import AdminGroups from "./AdminGroups";
import AccessDenied from "../AccessDenied/AccessDenied";

import "../AccessDenied/AccessDenied.scss";
import "./Admin.scss";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("users");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [inviteEmail, setInviteEmail] = useState("");
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

    const API_URL = import.meta.env.VITE_API_URL;

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

        if (!selectedEmployee || !inviteEmail) {
            setError("Выберите сотрудника и укажите email");
            return;
        }

        try {
            await postData(
                "POST",
                `${import.meta.env.VITE_API_URL}admin/users/invite`,
                {
                    physical_person_id: selectedEmployee,
                    email: inviteEmail,
                }
            );

            setShowInviteModal(false);
            setSelectedEmployee(null);
            setInviteEmail("");
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

    const handleEmployeeSelect = (e) => {
        const employeeId = parseInt(e.target.value);
        setSelectedEmployee(employeeId);

        const employee = availableEmployees.find(
            (emp) => emp.id === employeeId
        );
        if (employee) {
            setInviteEmail(employee.email || "");
        }
    };

    const handleInviteClick = async () => {
        await fetchAvailableEmployees();
        setShowInviteModal(true);
    };

    useEffect(() => {
        if (activeTab === "users") {
            loadUsers();
        }
    }, [activeTab]);

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
                            label="Пригласить сотрудника"
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
                <div
                    className="admin-modal"
                    onClick={() => setShowInviteModal(false)}
                >
                    <div
                        className="admin-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal__header">
                            <h2>Пригласить сотрудника</h2>
                        </div>
                        <form onSubmit={handleInviteSubmit}>
                            <div className="admin-modal__body">
                                <div className="admin-form">
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">
                                            Сотрудник
                                        </label>
                                        <select
                                            className="admin-form__select"
                                            value={selectedEmployee || ""}
                                            onChange={handleEmployeeSelect}
                                            required
                                        >
                                            <option value="">
                                                Выберите сотрудника
                                            </option>
                                            {availableEmployees.map((emp) => (
                                                <option
                                                    key={emp.id}
                                                    value={emp.id}
                                                >
                                                    {emp.name} ({emp.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="admin-form__group">
                                        <label className="admin-form__label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="admin-form__input"
                                            value={inviteEmail}
                                            onChange={(e) =>
                                                setInviteEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <div className="admin-form__error">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="admin-modal__footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--secondary"
                                    onClick={() => setShowInviteModal(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn--primary"
                                >
                                    Отправить приглашение
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Admin;
