import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import Loader from "../Loader";
import AccessDenied from "../AccessDenied/AccessDenied";
import "../AccessDenied/AccessDenied.scss";

const SECTIONS = {
    main: "Главная",
    admin: "Администрирование",
    projects: "Проекты",
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

// Матрица прав: какие типы прав доступны для каждого раздела
// 0 = недоступно, 1 = доступно
const PERMISSION_MATRIX = {
    main: {
        view: 1,
        edit: 0,
        delete: 0,
    },
    project_reports: {
        view: 1,
        edit: 1,
        delete: 0,
    },
    employee_reports: {
        view: 1,
        edit: 1,
        delete: 0,
    },
    projects: {
        view: 1,
        edit: 1,
        delete: 1,
    },
    sales: {
        view: 1,
        edit: 1,
        delete: 1,
    },
    customers: {
        view: 1,
        edit: 1,
        delete: 0,
    },
    contractors: {
        view: 1,
        edit: 1,
        delete: 0,
    },
    employees: {
        view: 1,
        edit: 1,
        delete: 0,
    },
    dictionaries: {
        view: 1,
        edit: 1,
        delete: 1,
    },
    admin: {
        view: 1,
        edit: 1,
        delete: 1,
    },
};

const AdminGroups = () => {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [accessDenied, setAccessDenied] = useState(false);

    // Форма создания группы
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDescription, setNewGroupDescription] = useState("");

    // Форма редактирования группы
    const [editGroupName, setEditGroupName] = useState("");
    const [editGroupDescription, setEditGroupDescription] = useState("");

    // Форма добавления прав
    // Чекбоксы выбора прав
    const [selectedPermissions, setSelectedPermissions] = useState({});
    // Формат: { 'section_permissionType': true/false }

    // Скоупы для каждой конкретной ячейки (раздел + тип права)
    const [permissionScopes, setPermissionScopes] = useState({});
    // Формат: { 'section_permissionType': 'full' | 'limited' }

    // Выбранные разделы (чекбокс в конце строки)
    const [selectedSections, setSelectedSections] = useState(new Set());

    // Форма добавления пользователя
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        loadGroups();
        loadAllUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

         toast.dismiss(toastId);

            // toast.update(toastId, {
            //     render: "Группа успешно создана",
            //     type: "success",
            //     isLoading: false,
            //     autoClose: 2000,
            //     pauseOnFocusLoss: false,
            //     pauseOnHover: false,
            //     draggable: true,
            // });

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

    const handleEditGroup = (group) => {
        setSelectedGroup(group);
        setEditGroupName(group.name);
        setEditGroupDescription(group.description || "");
        setShowEditModal(true);
    };

    const handleUpdateGroup = async (e) => {
        e.preventDefault();
        setError("");

        if (!editGroupName.trim()) {
            setError("Укажите название группы");
            return;
        }

        const toastId = toast.loading("Обновление группы...", {
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            await postData(
                "PUT",
                `${API_URL}admin/permission-groups/${selectedGroup.id}`,
                {
                name: editGroupName,
                description: editGroupDescription,
                }
            );

            toast.dismiss(toastId);

            // toast.update(toastId, {
            //     render: "Группа успешно обновлена",
            //     type: "success",
            //     isLoading: false,
            //     autoClose: 2000,
            //     pauseOnFocusLoss: false,
            //     pauseOnHover: false,
            //     draggable: true,
            // });

            setShowEditModal(false);
            setEditGroupName("");
            setEditGroupDescription("");
            loadGroups();
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Ошибка обновления группы",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            setError(err.message || "Ошибка обновления группы");
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
            await postData(
                "DELETE",
                `${API_URL}admin/permission-groups/${groupId}`
            );
         toast.dismiss(toastId);

            // toast.update(toastId, {
            //     render: "Группа успешно удалена",
            //     type: "success",
            //     isLoading: false,
            //     autoClose: 2000,
            //     pauseOnFocusLoss: false,
            //     pauseOnHover: false,
            //     draggable: true,
            // });

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

        // Преобразуем selectedPermissions в массив прав для отправки
        const permissions = [];
        Object.entries(selectedPermissions).forEach(([key, isSelected]) => {
            if (isSelected) {
                const [section, permissionType] = key.split('_');
                const scope = permissionScopes[key] || 'full'; // Берем scope для конкретной ячейки
                permissions.push({
                    section,
                    permission_type: permissionType,
                    scope,
                });
            }
        });

        if (permissions.length === 0) {
            setError("Выберите хотя бы одно право");
            return;
        }

        const toastId = toast.loading("Добавление прав...", {
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            // Отправляем каждое право отдельно
            for (const permission of permissions) {
            await postData(
                "POST",
                `${API_URL}admin/permission-groups/${selectedGroup.id}/permissions`,
                    permission
                );
            }

            toast.dismiss(toastId);

            setShowAddPermissionModal(false);
            setSelectedPermissions({});
            setPermissionScopes({});
            setSelectedSections(new Set());
            loadGroups();
        } catch (err) {
            toast.update(toastId, {
                render: err.message || "Ошибка добавления прав",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
            setError(err.message || "Ошибка добавления прав");
        }
    };

    // Обработчик изменения чекбокса права
    const handlePermissionCheckboxChange = (section, permissionType) => {
        const key = `${section}_${permissionType}`;
        setSelectedPermissions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Обработчик изменения scope для конкретной ячейки (раздел + тип права)
    const handleScopeChange = (section, permissionType, scope) => {
        const key = `${section}_${permissionType}`;
        setPermissionScopes((prev) => ({
            ...prev,
            [key]: scope,
        }));
    };

    // Обработчик чекбокса выбора всей строки (раздела)
    const handleSectionCheckboxChange = (section) => {
        const matrix = PERMISSION_MATRIX[section] || {};
        const newSelectedSections = new Set(selectedSections);

        if (newSelectedSections.has(section)) {
            // Убираем раздел и все его права
            newSelectedSections.delete(section);
            const newPermissions = { ...selectedPermissions };
            const newScopes = { ...permissionScopes };
            ['view', 'edit', 'delete'].forEach((permType) => {
                if (matrix[permType] === 1) {
                    const key = `${section}_${permType}`;
                    delete newPermissions[key];
                    delete newScopes[key];
                }
            });
            setSelectedPermissions(newPermissions);
            setPermissionScopes(newScopes);
        } else {
            // Добавляем раздел и все его доступные права
            newSelectedSections.add(section);
            const newPermissions = { ...selectedPermissions };
            const newScopes = { ...permissionScopes };
            ['view', 'edit', 'delete'].forEach((permType) => {
                if (matrix[permType] === 1) {
                    const key = `${section}_${permType}`;
                    newPermissions[key] = true;
                    // Инициализируем scope значением 'full' если еще не установлен
                    if (!newScopes[key]) {
                        newScopes[key] = 'full';
                    }
                }
            });
            setSelectedPermissions(newPermissions);
            setPermissionScopes(newScopes);
        }

        setSelectedSections(newSelectedSections);
    };

    // Обработчик массового чекбокса внизу для типа права
    const handleMassPermissionCheckboxChange = (permissionType) => {
        const newPermissions = { ...selectedPermissions };
        let allChecked = true;

        // Проверяем, все ли чекбоксы данного типа уже выбраны
        Object.keys(SECTIONS).forEach((section) => {
            const matrix = PERMISSION_MATRIX[section] || {};
            if (matrix[permissionType] === 1) {
                const key = `${section}_${permissionType}`;
                if (!newPermissions[key]) {
                    allChecked = false;
                }
            }
        });

        // Если все выбраны - снимаем все, иначе выбираем все
        Object.keys(SECTIONS).forEach((section) => {
            const matrix = PERMISSION_MATRIX[section] || {};
            if (matrix[permissionType] === 1) {
                const key = `${section}_${permissionType}`;
                newPermissions[key] = !allChecked;
            }
        });

        setSelectedPermissions(newPermissions);
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
         toast.dismiss(toastId);

            // toast.update(toastId, {
            //     render: "Право успешно удалено",
            //     type: "success",
            //     isLoading: false,
            //     autoClose: 2000,
            //     pauseOnFocusLoss: false,
            //     pauseOnHover: false,
            //     draggable: true,
            // });
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

         toast.dismiss(toastId);

            // toast.update(toastId, {
            //     render: "Пользователи успешно добавлены",
            //     type: "success",
            //     isLoading: false,
            //     autoClose: 2000,
            //     pauseOnFocusLoss: false,
            //     pauseOnHover: false,
            //     draggable: true,
            // });

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

         toast.dismiss(toastId);
            // toast.update(toastId, {
            //     render: "Пользователь успешно удален из группы",
            //     type: "success",
            //     isLoading: false,
            //     autoClose: 2000,
            //     pauseOnFocusLoss: false,
            //     pauseOnHover: false,
            //     draggable: true,
            // });
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
                <div>
                    <h2 className="text-xl font-semibold">Группы прав</h2>
                    <div className="text-sm text-gray-500 mt-1">
                        Всего групп: {groups.length}
                    </div>
                </div>
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
                                    <div className="flex gap-2">
                                        <button
                                            className="admin-btn admin-btn--secondary"
                                            onClick={() =>
                                                handleEditGroup(group)
                                            }
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            className="admin-btn admin-btn--danger"
                                            onClick={() =>
                                                handleDeleteGroup(group.id)
                                            }
                                        >
                                            Удалить
                                        </button>
                                    </div>
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
                                {group.permissions &&
                                group.permissions.length > 0 ? (
                                    <div className="permission-list">
                                        {group.permissions.map((perm) => (
                                            <div
                                                key={perm.id}
                                                className="permission-tag"
                                            >
                                                {SECTIONS[perm.section] ||
                                                    perm.section}{" "}
                                                →{" "}
                                                {PERMISSION_TYPES[
                                                    perm.permission_type
                                                ] || perm.permission_type}{" "}
                                                (
                                                {SCOPES[perm.scope] ||
                                                    perm.scope}
                                                )
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
                                    <div className="text-gray-500 text-sm">
                                        Нет прав
                                    </div>
                                )}
                            </div>

                            <div className="admin-group-card__users">
                                <div className="flex justify-between items-center mb-2">
                                    <h4>
                                        Пользователи{" "}
                                        <span className="text-gray-500 text-sm font-normal">
                                            ({group.users?.length || 0})
                                        </span>
                                    </h4>
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
                                            <div
                                                key={user.id}
                                                className="user-tag"
                                            >
                                                {user.name || user.email}
                                                {!group.is_system && (
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveUser(
                                                                group.id,
                                                                user.id
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
                <div
                    className="admin-modal"
                    onClick={() => setShowCreateModal(false)}
                >
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
                                                setNewGroupDescription(
                                                    e.target.value
                                                )
                                            }
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

            {/* Модальное окно редактирования группы */}
            {showEditModal && selectedGroup && (
                <div
                    className="admin-modal"
                    onClick={() => {
                    setShowEditModal(false);
                    setError("");
                    }}
                >
                    <div
                        className="admin-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal__header">
                            <h2>Редактировать группу</h2>
                        </div>
                        <form onSubmit={handleUpdateGroup}>
                            <div className="admin-modal__body">
                                <div className="admin-form">
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">
                                            Название
                                        </label>
                                        <input
                                            type="text"
                                            className="admin-form__input"
                                            value={editGroupName}
                                            onChange={(e) =>
                                                setEditGroupName(e.target.value)
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
                                            value={editGroupDescription}
                                            onChange={(e) =>
                                                setEditGroupDescription(
                                                    e.target.value
                                                )
                                            }
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
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setError("");
                                    }}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn--primary"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Модальное окно добавления прав */}
            {showAddPermissionModal && selectedGroup && (
                <div
                    className="admin-modal"
                    onClick={() => {
                        setShowAddPermissionModal(false);
                        setSelectedPermissions({});
                        setPermissionScopes({});
                        setSelectedSections(new Set());
                        setError("");
                    }}
                >
                    <div
                        className="admin-modal__content admin-modal__content--wide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal__header">
                            <h2>Добавление группы</h2>
                        </div>
                        <form onSubmit={handleAddPermission}>
                            <div className="admin-modal__body">
                                <div className="permissions-table-wrapper">
                                    <table className="permissions-table">
                                        <colgroup>
                                            <col style={{ width: '200px' }} />
                                            <col style={{ width: '90px' }} />
                                            <col style={{ width: '90px' }} />
                                            <col style={{ width: '90px' }} />
                                            <col style={{ width: '90px' }} />
                                            <col style={{ width: '90px' }} />
                                            <col style={{ width: '90px' }} />
                                            <col style={{ width: '60px' }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th rowSpan="2" className="section-header">Раздел / подраздел</th>
                                                <th colSpan="3" className="group-header">Выбор прав</th>
                                                <th colSpan="3" className="group-header">Ширина прав</th>
                                                <th rowSpan="2" className="checkbox-header"></th>
                                            </tr>
                                            <tr>
                                                <th className="subheader">Просмотр</th>
                                                <th className="subheader">Редактирование</th>
                                                <th className="subheader">Удаление</th>
                                                <th className="subheader">Просмотр</th>
                                                <th className="subheader">Редактирование</th>
                                                <th className="subheader">Удаление</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(SECTIONS).map(([sectionKey, sectionLabel]) => {
                                                const matrix = PERMISSION_MATRIX[sectionKey] || {};
                                                return (
                                                    <tr key={sectionKey}>
                                                        <td className="section-name">{sectionLabel}</td>

                                                        {/* Группа чекбоксов: Выбор прав */}
                                                        {['view', 'edit', 'delete'].map((permType) => {
                                                            const isAllowed = matrix[permType] === 1;
                                                            const key = `${sectionKey}_${permType}`;
                                                            const isChecked = !!selectedPermissions[key];

                                                            return (
                                                                <td key={`check_${permType}`} className="permission-cell">
                                                                    {isAllowed ? (
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={() =>
                                                                                handlePermissionCheckboxChange(
                                                                                    sectionKey,
                                                                                    permType
                                                                                )
                                                                            }
                                                                            className="permission-checkbox"
                                                                        />
                                                                    ) : (
                                                                        <span className="permission-disabled">—</span>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}

                                                        {/* Группа селектов: Ширина прав */}
                                                        {['view', 'edit', 'delete'].map((permType) => {
                                                            const matrix = PERMISSION_MATRIX[sectionKey] || {};
                                                            const isAllowed = matrix[permType] === 1;
                                                            const scopeKey = `${sectionKey}_${permType}`;
                                                            const currentScope = permissionScopes[scopeKey] || 'full';

                                                            return (
                                                                <td key={`scope_${permType}`} className="scope-cell">
                                                                    {isAllowed ? (
                                                                        <select
                                                                            value={currentScope}
                                                                            onChange={(e) =>
                                                                                handleScopeChange(
                                                                                    sectionKey,
                                                                                    permType,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="scope-select"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <option value="full">Полная</option>
                                                                            <option value="limited">Ограниченная</option>
                                                                        </select>
                                                                    ) : (
                                                                        <span className="permission-disabled">—</span>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}

                                                        {/* Чекбокс выбора всей строки */}
                                                        <td className="row-checkbox-cell">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSections.has(sectionKey)}
                                                                onChange={() => handleSectionCheckboxChange(sectionKey)}
                                                                className="row-checkbox"
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* Строка с массовыми чекбоксами внизу */}
                                            <tr className="mass-select-row">

                                                {/* Массовые чекбоксы для "Выбор прав" */}
                                                {['view', 'edit', 'delete'].map((permType) => (
                                                    <td key={`mass_${permType}`} className="mass-checkbox-cell">
                                                        <input
                                                            type="checkbox"
                                                            onChange={() => handleMassPermissionCheckboxChange(permType)}
                                                            className="mass-checkbox"
                                                        />
                                                    </td>
                                                ))}

                                                {/* Пустые ячейки для "Ширина прав" - по одной для каждого столбца */}
                                                <td className="empty-cell"></td>
                                                <td className="empty-cell"></td>
                                                <td className="empty-cell"></td>

                                                {/* Пустая ячейка для последнего столбца */}
                                                <td className="empty-cell"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </div>

                                    {error && (
                                        <div className="admin-form__error">{error}</div>
                                    )}
                            </div>
                            <div className="admin-modal__footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--secondary"
                                    onClick={() => {
                                        setShowAddPermissionModal(false);
                                        setSelectedPermissions({});
                                        setPermissionScopes({});
                                        setSelectedSections(new Set());
                                        setError("");
                                    }}
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
                <div
                    className="admin-modal"
                    onClick={() => setShowAddUserModal(false)}
                >
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
                                                            (u) =>
                                                                u.id === user.id
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
                                                                alignItems:
                                                                    "center",
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
                                                            {user.name ||
                                                                user.email}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
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
