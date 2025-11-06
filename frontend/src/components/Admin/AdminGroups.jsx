import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import Loader from "../Loader";
import AccessDenied from "../AccessDenied/AccessDenied";
import "../AccessDenied/AccessDenied.scss";

const SECTIONS = {
    main: "Главная",
    project_reports: "Отчеты по проектам",
    employee_reports: "Отчеты по сотрудникам",
    sales: "Продажи",
    customers: "Заказчики",
    contractors: "Подрядчики",
    employees: "Сотрудники",
    dictionaries: "Справочники",
};

const PERMISSION_TYPES = {
    view: "Просмотр",
    edit: "Редактирование",
    delete: "Удаление",
};

const SCOPES = {
    full: "Полный доступ",
    limited: "Ограниченный",
};

const AdminGroups = () => {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [accessDenied, setAccessDenied] = useState(false);

    // Форма создания группы
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDescription, setNewGroupDescription] = useState("");

    // Форма добавления права
    const [permissionSection, setPermissionSection] = useState("");
    const [permissionType, setPermissionType] = useState("");
    const [permissionScope, setPermissionScope] = useState("");

    // Форма добавления пользователя
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        loadGroups();
        loadAllUsers();
    }, []);

    const loadGroups = async () => {
        try {
            setIsLoading(true);
            setAccessDenied(false);
            const response = await getData(`${API_URL}admin/permission-groups`);
            if (response.status === 200) {
                setGroups(response.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки групп:", err);
            if (err.status === 403) {
                setAccessDenied(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loadAllUsers = async () => {
        try {
            const response = await getData(`${API_URL}admin/users`);
            if (response.status === 200) {
                setAllUsers(response.data.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки пользователей:", err);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setError("");

        if (!newGroupName.trim()) {
            setError("Укажите название группы");
            return;
        }

        const toastId = toast.loading("Создание группы...", {
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            await postData("POST", `${API_URL}admin/permission-groups`, {
                name: newGroupName,
                description: newGroupDescription,
            });

            toast.update(toastId, {
                render: "Группа успешно создана",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });

            setShowCreateModal(false);
            setNewGroupName("");
            setNewGroupDescription("");
            loadGroups();
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Ошибка создания группы",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            setError(err.message || "Ошибка создания группы");
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!confirm("Вы уверены, что хотите удалить группу?")) {
            return;
        }

        const toastId = toast.loading("Удаление группы...", {
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            await postData("DELETE", `${API_URL}admin/permission-groups/${groupId}`);
            toast.update(toastId, {
                render: "Группа успешно удалена",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            loadGroups();
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Ошибка удаления группы",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleAddPermission = async (e) => {
        e.preventDefault();
        setError("");

        if (!permissionSection || !permissionType || !permissionScope) {
            setError("Заполните все поля");
            return;
        }

        const toastId = toast.loading("Добавление права...", {
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            await postData(
                "POST",
                `${API_URL}admin/permission-groups/${selectedGroup.id}/permissions`,
                {
                    section: permissionSection,
                    permission_type: permissionType,
                    scope: permissionScope,
                }
            );

            toast.update(toastId, {
                render: "Право успешно добавлено",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });

            setShowAddPermissionModal(false);
            setPermissionSection("");
            setPermissionType("");
            setPermissionScope("");
            loadGroups();
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Ошибка добавления права",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            setError(err.message || "Ошибка добавления права");
        }
    };

    const handleDeletePermission = async (groupId, permissionId) => {
        if (!confirm("Удалить это право?")) {
            return;
        }

        const toastId = toast.loading("Удаление права...", {
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/permission-groups/${groupId}/permissions/${permissionId}`
            );
            toast.update(toastId, {
                render: "Право успешно удалено",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            loadGroups();
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Ошибка удаления права",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleAddUsers = async (e) => {
        e.preventDefault();
        setError("");

        if (selectedUsers.length === 0) {
            setError("Выберите хотя бы одного пользователя");
            return;
        }

        const toastId = toast.loading("Добавление пользователей...", {
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            await postData(
                "POST",
                `${API_URL}admin/permission-groups/${selectedGroup.id}/users`,
                {
                    user_ids: selectedUsers,
                }
            );

            toast.update(toastId, {
                render: "Пользователи успешно добавлены",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });

            setShowAddUserModal(false);
            setSelectedUsers([]);
            loadGroups();
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Ошибка добавления пользователей",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            setError(err.message || "Ошибка добавления пользователей");
        }
    };

    const handleRemoveUser = async (groupId, userId) => {
        if (!confirm("Удалить пользователя из группы?")) {
            return;
        }

        const toastId = toast.loading("Удаление пользователя...", {
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/permission-groups/${groupId}/users/${userId}`
            );
            toast.update(toastId, {
                render: "Пользователь успешно удален из группы",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            loadGroups();
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Ошибка удаления пользователя",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    if (isLoading) {
        return <Loader />;
    }

    if (accessDenied) {
        return (
            <AccessDenied message="У вас нет прав для управления группами и правами" />
        );
    }

    return (
        <div className="admin-groups">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Группы прав</h2>
                <button
                    className="admin-btn admin-btn--primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    Создать группу
                </button>
            </div>

            {groups.length === 0 ? (
                <div className="admin-empty">Нет групп</div>
            ) : (
                <div className="admin-groups-list">
                    {groups.map((group) => (
                        <div key={group.id} className="admin-group-card">
                            <div className="admin-group-card__header">
                                <div>
                                    <div className="admin-group-card__title">
                                        {group.name}
                                        {group.is_system && (
                                            <span className="admin-badge admin-badge--inactive ml-2">
                                                Системная
                                            </span>
                                        )}
                                    </div>
                                    {group.description && (
                                        <div className="admin-group-card__description">
                                            {group.description}
                                        </div>
                                    )}
                                </div>
                                {!group.is_system && (
                                    <button
                                        className="admin-btn admin-btn--danger"
                                        onClick={() => handleDeleteGroup(group.id)}
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>

                            <div className="admin-group-card__permissions">
                                <div className="flex justify-between items-center mb-2">
                                    <h4>Права доступа</h4>
                                    {!group.is_system && (
                                        <button
                                            className="admin-btn admin-btn--secondary"
                                            onClick={() => {
                                                setSelectedGroup(group);
                                                setShowAddPermissionModal(true);
                                            }}
                                        >
                                            Добавить право
                                        </button>
                                    )}
                                </div>
                                {group.permissions && group.permissions.length > 0 ? (
                                    <div className="permission-list">
                                        {group.permissions.map((perm) => (
                                            <div key={perm.id} className="permission-tag">
                                                {SECTIONS[perm.section] || perm.section} →{" "}
                                                {PERMISSION_TYPES[perm.permission_type] ||
                                                    perm.permission_type}{" "}
                                                ({SCOPES[perm.scope] || perm.scope})
                                                {!group.is_system && (
                                                    <button
                                                        onClick={() =>
                                                            handleDeletePermission(
                                                                group.id,
                                                                perm.id
                                                            )
                                                        }
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm">Нет прав</div>
                                )}
                            </div>

                            <div className="admin-group-card__users">
                                <div className="flex justify-between items-center mb-2">
                                    <h4>Пользователи</h4>
                                    {!group.is_system && (
                                        <button
                                            className="admin-btn admin-btn--secondary"
                                            onClick={() => {
                                                setSelectedGroup(group);
                                                setSelectedUsers([]);
                                                setShowAddUserModal(true);
                                            }}
                                        >
                                            Добавить пользователя
                                        </button>
                                    )}
                                </div>
                                {group.users && group.users.length > 0 ? (
                                    <div className="user-list">
                                        {group.users.map((user) => (
                                            <div key={user.id} className="user-tag">
                                                {user.name || user.email}
                                                {!group.is_system && (
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveUser(group.id, user.id)
                                                        }
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm">
                                        Нет пользователей
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Модальное окно создания группы */}
            {showCreateModal && (
                <div className="admin-modal" onClick={() => setShowCreateModal(false)}>
                    <div
                        className="admin-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal__header">
                            <h2>Создать группу</h2>
                        </div>
                        <form onSubmit={handleCreateGroup}>
                            <div className="admin-modal__body">
                                <div className="admin-form">
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">
                                            Название
                                        </label>
                                        <input
                                            type="text"
                                            className="admin-form__input"
                                            value={newGroupName}
                                            onChange={(e) =>
                                                setNewGroupName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="admin-form__group">
                                        <label className="admin-form__label">
                                            Описание
                                        </label>
                                        <textarea
                                            className="admin-form__textarea"
                                            value={newGroupDescription}
                                            onChange={(e) =>
                                                setNewGroupDescription(e.target.value)
                                            }
                                        />
                                    </div>

                                    {error && (
                                        <div className="admin-form__error">{error}</div>
                                    )}
                                </div>
                            </div>
                            <div className="admin-modal__footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn--primary"
                                >
                                    Создать
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно добавления права */}
            {showAddPermissionModal && selectedGroup && (
                <div
                    className="admin-modal"
                    onClick={() => setShowAddPermissionModal(false)}
                >
                    <div
                        className="admin-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal__header">
                            <h2>Добавить право</h2>
                        </div>
                        <form onSubmit={handleAddPermission}>
                            <div className="admin-modal__body">
                                <div className="admin-form">
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">Раздел</label>
                                        <select
                                            className="admin-form__select"
                                            value={permissionSection}
                                            onChange={(e) =>
                                                setPermissionSection(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">Выберите раздел</option>
                                            {Object.entries(SECTIONS).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="admin-form__group">
                                        <label className="admin-form__label">
                                            Тип права
                                        </label>
                                        <select
                                            className="admin-form__select"
                                            value={permissionType}
                                            onChange={(e) =>
                                                setPermissionType(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">Выберите тип</option>
                                            {Object.entries(PERMISSION_TYPES).map(
                                                ([key, label]) => (
                                                    <option key={key} value={key}>
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="admin-form__group">
                                        <label className="admin-form__label">Область</label>
                                        <select
                                            className="admin-form__select"
                                            value={permissionScope}
                                            onChange={(e) =>
                                                setPermissionScope(e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">Выберите область</option>
                                            {Object.entries(SCOPES).map(([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {error && (
                                        <div className="admin-form__error">{error}</div>
                                    )}
                                </div>
                            </div>
                            <div className="admin-modal__footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--secondary"
                                    onClick={() => setShowAddPermissionModal(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn--primary"
                                >
                                    Добавить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно добавления пользователей */}
            {showAddUserModal && selectedGroup && (
                <div className="admin-modal" onClick={() => setShowAddUserModal(false)}>
                    <div
                        className="admin-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal__header">
                            <h2>Добавить пользователей</h2>
                        </div>
                        <form onSubmit={handleAddUsers}>
                            <div className="admin-modal__body">
                                <div className="admin-form">
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">
                                            Выберите пользователей
                                        </label>
                                        <div
                                            style={{
                                                maxHeight: "300px",
                                                overflowY: "auto",
                                                border: "1px solid var(--color-gray-40)",
                                                borderRadius: "6px",
                                                padding: "8px",
                                            }}
                                        >
                                            {allUsers
                                                .filter(
                                                    (user) =>
                                                        !selectedGroup.users?.some(
                                                            (u) => u.id === user.id
                                                        )
                                                )
                                                .map((user) => (
                                                    <div
                                                        key={user.id}
                                                        style={{
                                                            padding: "4px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <label
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsers.includes(
                                                                    user.id
                                                                )}
                                                                onChange={() =>
                                                                    toggleUserSelection(
                                                                        user.id
                                                                    )
                                                                }
                                                            />
                                                            {user.name || user.email}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="admin-form__error">{error}</div>
                                    )}
                                </div>
                            </div>
                            <div className="admin-modal__footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--secondary"
                                    onClick={() => setShowAddUserModal(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn--primary"
                                >
                                    Добавить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGroups;
