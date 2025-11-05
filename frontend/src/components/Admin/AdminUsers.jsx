import { useEffect, useState } from "react";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import Loader from "../Loader";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [inviteEmail, setInviteEmail] = useState("");
    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getData(`${API_URL}admin/users`);
            if (response.status === 200) {
                setUsers(response.data.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки пользователей:", err);
        } finally {
            setIsLoading(false);
        }
    };

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

            alert("Приглашение отправлено!");
            setShowInviteModal(false);
            setSelectedEmployee(null);
            setInviteEmail("");
            loadUsers();
        } catch (err) {
            setError(err.message || "Ошибка отправки приглашения");
        }
    };

    const handleDeactivate = async (userId) => {
        if (!confirm("Вы уверены, что хотите деактивировать пользователя?")) {
            return;
        }

        try {
            await postData("DELETE", `${API_URL}admin/users/${userId}`);
            alert("Пользователь деактивирован");
            loadUsers();
        } catch (err) {
            alert("Ошибка деактивации: " + err.message);
        }
    };

    const handleEmployeeSelect = (e) => {
        const employeeId = parseInt(e.target.value);
        setSelectedEmployee(employeeId);

        const employee = availableEmployees.find((emp) => emp.id === employeeId);
        if (employee) {
            setInviteEmail(employee.email || "");
        }
    };

    if (isLoading) {
        return <Loader />;
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
                                    <td>{user.id}</td>
                                    <td>{user.name || "—"}</td>
                                    <td>{user.email || "—"}</td>
                                    <td>
                                        <span
                                            className={`admin-badge ${
                                                user.is_active
                                                    ? "admin-badge--active"
                                                    : "admin-badge--inactive"
                                            }`}
                                        >
                                            {user.is_active
                                                ? "Активен"
                                                : "Неактивен"}
                                        </span>
                                    </td>
                                    <td>
                                        {user.last_login_at
                                            ? new Date(
                                                  user.last_login_at
                                              ).toLocaleString("ru-RU")
                                            : "—"}
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            {user.is_active && (
                                                <button
                                                    className="admin-btn admin-btn--danger"
                                                    onClick={() =>
                                                        handleDeactivate(user.id)
                                                    }
                                                >
                                                    Деактивировать
                                                </button>
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
                <div className="admin-modal" onClick={() => setShowInviteModal(false)}>
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
                                            <option value="">Выберите сотрудника</option>
                                            {availableEmployees.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
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
