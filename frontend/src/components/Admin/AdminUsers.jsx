import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import Loader from "../Loader";
import AccessDenied from "../AccessDenied/AccessDenied";
import "../AccessDenied/AccessDenied.scss";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const [error, setError] = useState("");
    const [accessDenied, setAccessDenied] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const loadUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setAccessDenied(false);
            const response = await getData(`${API_URL}admin/users`);
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
    }, [API_URL]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const loadAvailableEmployees = async () => {
        try {
            const response = await getData(`${API_URL}admin/users/available`);
            if (response.status === 200) {
                setAvailableEmployees(response.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки сотрудников:", err);
        }
    };

    const handleInviteClick = async () => {
        await loadAvailableEmployees();
        setShowInviteModal(true);
    };

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!selectedEmployee || !inviteEmail) {
            setError("Выберите сотрудника и укажите email");
            return;
        }

        try {
            await postData("POST", `${API_URL}admin/users/invite`, {
                physical_person_id: selectedEmployee,
                email: inviteEmail,
            });

            setShowInviteModal(false);
            setSelectedEmployee(null);
            setInviteEmail("");
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка отправки приглашения", {
                position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            setError(err.message || "Ошибка отправки приглашения");
        }
    };

    const handleActivate = async (userId) => {
        if (!confirm("Вы уверены, что хотите активировать пользователя?")) {
            return;
        }

        try {
            await postData(
                "PATCH",
                `${API_URL}admin/users/${userId}/activate`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка активации пользователя", {
                position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleDeactivate = async (userId) => {
        if (!confirm("Вы уверены, что хотите деактивировать пользователя?")) {
            return;
        }

        try {
            await postData(
                "PATCH",
                `${API_URL}admin/users/${userId}/deactivate`
            );
            loadUsers();
        } catch (err) {
            toast.error(
                err.status === 403
                    ? "Нельзя деактивировать собственную учетную запись"
                    : err.message || "Ошибка деактивации пользователя",
                {
                    position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                }
            );
        }
    };

    const handleResendInvitation = async (invitationId) => {
        if (!confirm("Вы уверены, что хотите повторно отправить приглашение?")) {
            return;
        }

        try {
            await postData(
                "POST",
                `${API_URL}admin/users/invitations/${invitationId}/resend`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка повторной отправки приглашения", {
                position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleCancelInvitation = async (invitationId) => {
        if (!confirm("Вы уверены, что хотите отозвать приглашение?")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/users/invitations/${invitationId}`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка отзыва приглашения", {
                position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Вы уверены, что хотите удалить пользователя? Это действие необратимо!")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/users/${userId}`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления пользователя", {
                position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleRemove2FA = async (userId) => {
        if (!confirm("Вы уверены, что хотите удалить 2FA у пользователя?")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/users/${userId}/2fa`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления 2FA", {
                position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleRequire2FA = async (userId) => {
        if (!confirm("Вы уверены, что хотите установить требование 2FA для пользователя?")) {
            return;
        }

        try {
            await postData(
                "POST",
                `${API_URL}admin/users/${userId}/require-2fa`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка установки требования 2FA", {
                position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
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

    if (isLoading) {
        return <Loader />;
    }

    if (accessDenied) {
        return (
            <AccessDenied message="У вас нет прав для управления пользователями" />
        );
    }

    return (
        <div className="admin-users">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Список пользователей</h2>
                <button
                    className="admin-btn admin-btn--primary"
                    onClick={handleInviteClick}
                >
                    Пригласить сотрудника
                </button>
            </div>

            {users.length === 0 ? (
                <div className="admin-empty">Нет пользователей</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Email</th>
                                <th>Статус</th>
                                <th>Последний вход</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.type === 'invitation' ? '—' : user.id}</td>
                                    <td>{user.name || "—"}</td>
                                    <td>{user.email || "—"}</td>
                                    <td>
                                        <span
                                            className={`admin-badge ${
                                                user.status === 'invited'
                                                    ? "admin-badge--warning"
                                                    : user.is_active
                                                    ? "admin-badge--active"
                                                    : "admin-badge--inactive"
                                            }`}
                                        >
                                            {user.status === 'invited'
                                                ? "Приглашен"
                                                : user.is_active
                                                ? "Активен"
                                                : "Неактивен"}
                                        </span>
                                    </td>
                                    <td>
                                        {user.status === 'invited'
                                            ? (user.invited_at
                                                ? new Date(user.invited_at).toLocaleString("ru-RU")
                                                : "—")
                                            : (user.last_login_at
                                                ? new Date(user.last_login_at).toLocaleString("ru-RU")
                                                : "—")}
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            {user.status === 'invited' ? (
                                                <>
                                                    <button
                                                        className="admin-btn admin-btn--primary admin-btn--sm"
                                                        onClick={() =>
                                                            handleResendInvitation(
                                                                user.invitation_id
                                                            )
                                                        }
                                                        title="Повторно отправить приглашение"
                                                    >
                                                        Отправить повторно
                                                    </button>
                                                    <button
                                                        className="admin-btn admin-btn--danger admin-btn--sm"
                                                        onClick={() =>
                                                            handleCancelInvitation(
                                                                user.invitation_id
                                                            )
                                                        }
                                                        title="Отозвать приглашение"
                                                    >
                                                        Отозвать
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {user.is_active ? (
                                                        <button
                                                            className="admin-btn admin-btn--danger admin-btn--sm"
                                                            onClick={() =>
                                                                handleDeactivate(
                                                                    user.id
                                                                )
                                                            }
                                                            title="Деактивировать пользователя"
                                                        >
                                                            Деактивировать
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="admin-btn admin-btn--success admin-btn--sm"
                                                            onClick={() =>
                                                                handleActivate(user.id)
                                                            }
                                                            title="Активировать пользователя"
                                                        >
                                                            Активировать
                                                        </button>
                                                    )}
                                                    {user.keycloak_id && (
                                                        <>
                                                            {user.has_2fa ? (
                                                                <button
                                                                    className="admin-btn admin-btn--danger admin-btn--sm"
                                                                    onClick={() =>
                                                                        handleRemove2FA(user.id)
                                                                    }
                                                                    title="Удалить 2FA"
                                                                >
                                                                    🗑️ Удалить 2FA
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="admin-btn admin-btn--primary admin-btn--sm"
                                                                    onClick={() =>
                                                                        handleRequire2FA(user.id)
                                                                    }
                                                                    title="Требовать 2FA"
                                                                >
                                                                    🔒 Требовать 2FA
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    <button
                                                        className="admin-btn admin-btn--danger admin-btn--sm"
                                                        onClick={() =>
                                                            handleDeleteUser(user.id)
                                                        }
                                                        title="Удалить пользователя из системы"
                                                    >
                                                        Удалить
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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
        </div>
    );
};

export default AdminUsers;
