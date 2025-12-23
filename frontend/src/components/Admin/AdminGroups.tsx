import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import Loader from "../Loader";
import AccessDenied from "../AccessDenied/AccessDenied";

const SECTIONS = {
    main: "Ключевые показатели",
    project_reports: "Отчёты проектов",
    employee_reports: "Отчёты сотрудников",
    projects: "Проекты",
    sales: "Продажи",
    customers: "Заказчики",
    employees: "Сотрудники",
    contractors: "Подрядчики",
    dictionaries: "Справочники",
    admin: "Администрирование",
};

// Порядок отображения разделов
const SECTIONS_ORDER = [
    "main",
    "project_reports",
    "employee_reports",
    "projects",
    "sales",
    "customers",
    "employees",
    "contractors",
    "dictionaries",
    "admin",
];

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

const AdminGroups = ({ mode, isLoading, loadGroups, groups }) => {
    // const [groups, setGroups] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    // const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [accessDenied, setAccessDenied] = useState(false);

    // Форма создания группы
    // const [newGroupName, setNewGroupName] = useState("");
    // const [newGroupDescription, setNewGroupDescription] = useState("");

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
        loadAllUsers();
    }, []);

    // const loadGroups = async () => {
    //     try {
    //         setIsLoading(true);
    //         setAccessDenied(false);
    //         const response = await getData(`${API_URL}admin/permission-groups`);
    //         if (response.status === 200) {
    //             setGroups(response.data || []);
    //         }
    //     } catch (err) {
    //         console.error("Ошибка загрузки групп:", err);
    //         if (err.status === 403) {
    //             setAccessDenied(true);
    //         }
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

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

    // const handleCreateGroup = async (e) => {
    //     e.preventDefault();
    //     setError("");

    //     if (!newGroupName.trim()) {
    //         setError("Укажите название группы");
    //         return;
    //     }

    //     try {
    //         await postData("POST", `${API_URL}admin/permission-groups`, {
    //             name: newGroupName,
    //             description: newGroupDescription,
    //         });

    //         setShowCreateModal(false);
    //         setNewGroupName("");
    //         setNewGroupDescription("");
    //         loadGroups();
    //     } catch (err) {
    //         toast.error(err.message || "Ошибка создания группы", {
    //             isLoading: false,
    //             autoClose: 3000,
    //             pauseOnFocusLoss: false,
    //             pauseOnHover: false,
    //             position:
    //                 window.innerWidth >= 1440 ? "bottom-right" : "top-right",
    //         });
    //         setError(err.message || "Ошибка создания группы");
    //     }
    // };

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

        try {
            await postData(
                "PUT",
                `${API_URL}admin/permission-groups/${selectedGroup.id}`,
                {
                    name: editGroupName,
                    description: editGroupDescription,
                }
            );

            setShowEditModal(false);
            setEditGroupName("");
            setEditGroupDescription("");
            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка обновления группы", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
            setError(err.message || "Ошибка обновления группы");
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!confirm("Вы уверены, что хотите удалить группу?")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/permission-groups/${groupId}`
            );

            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления группы", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
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
                // Правильно разбираем ключ: последняя часть - это permission_type, все остальное - section
                const parts = key.split("_");
                const permissionType = parts[parts.length - 1]; // Последняя часть
                const section = parts.slice(0, -1).join("_"); // Все остальное
                const scope = permissionScopes[key] || "full"; // Берем scope для конкретной ячейки
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

        try {
            // Отправляем все права одним запросом
            await postData(
                "POST",
                `${API_URL}admin/permission-groups/${selectedGroup.id}/permissions/sync`,
                { permissions }
            );

            setShowAddPermissionModal(false);
            setSelectedPermissions({});
            setPermissionScopes({});
            setSelectedSections(new Set());
            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка сохранения прав", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
            setError(err.message || "Ошибка сохранения прав");
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
    // Теперь ТОЛЬКО отмечает/снимает строку, НЕ трогая чекбоксы прав
    const handleSectionCheckboxChange = (section) => {
        const newSelectedSections = new Set(selectedSections);

        if (newSelectedSections.has(section)) {
            // Убираем раздел из выбранных
            newSelectedSections.delete(section);
        } else {
            // Добавляем раздел в выбранные
            newSelectedSections.add(section);
        }

        setSelectedSections(newSelectedSections);
    };

    const handleSelectAllRows = () => {
        const allSections = new Set(SECTIONS_ORDER);
        const allSelected = SECTIONS_ORDER.every((section) =>
            selectedSections.has(section)
        );

        if (allSelected) {
            // Если все выделены - снимаем выделение со всех
            setSelectedSections(new Set());
        } else {
            // Если не все выделены - выделяем все строки
            // При выделении всех строк массовые чекбоксы должны быть неотмечены
            // (это обеспечивается через isMassCheckboxChecked, который вернет false при areAllRowsSelected = true)
            setSelectedSections(allSections);
        }
    };

    const areAllRowsSelected = SECTIONS_ORDER.every((section) =>
        selectedSections.has(section)
    );
    const handleMassPermissionCheckboxChange = (permissionType) => {
        // Если все строки выделены, снимаем выделение со всех строк
        // чтобы массовые чекбоксы работали только с отмеченными строками
        let currentSelectedSections = selectedSections;
        if (areAllRowsSelected) {
            currentSelectedSections = new Set();
            setSelectedSections(currentSelectedSections);
        }

        // Если нет отмеченных строк, ничего не делаем
        if (currentSelectedSections.size === 0) {
            return;
        }

        const newPermissions = { ...selectedPermissions };
        const newScopes = { ...permissionScopes };
        let allCheckedInSelectedSections = true;

        // Проверяем, все ли чекбоксы данного типа выбраны у отмеченных строк
        currentSelectedSections.forEach((section) => {
            const matrix = PERMISSION_MATRIX[section] || {};
            if (matrix[permissionType] === 1) {
                const key = `${section}_${permissionType}`;
                if (!newPermissions[key]) {
                    allCheckedInSelectedSections = false;
                }
            }
        });

        // Если все выбраны у отмеченных строк - снимаем, иначе отмечаем
        currentSelectedSections.forEach((section) => {
            const matrix = PERMISSION_MATRIX[section] || {};
            if (matrix[permissionType] === 1) {
                const key = `${section}_${permissionType}`;
                newPermissions[key] = !allCheckedInSelectedSections;

                // Устанавливаем scope по умолчанию, если отмечаем
                if (!allCheckedInSelectedSections && !newScopes[key]) {
                    newScopes[key] = "full";
                }
            }
        });

        setSelectedPermissions(newPermissions);
        setPermissionScopes(newScopes);
    };

    const isMassCheckboxChecked = (permissionType) => {
        if (areAllRowsSelected) {
            return false;
        }

        if (selectedSections.size === 0) {
            return false;
        }

        let allChecked = true;
        selectedSections.forEach((section) => {
            const matrix = PERMISSION_MATRIX[section] || {};
            if (matrix[permissionType] === 1) {
                const key = `${section}_${permissionType}`;
                if (!selectedPermissions[key]) {
                    allChecked = false;
                }
            }
        });

        return allChecked;
    };

    const getMassScopeValue = (permissionType) => {
        if (areAllRowsSelected) {
            return "";
        }

        if (selectedSections.size === 0) {
            return "";
        }

        let firstScope = null;
        let hasCheckedPermissions = false;

        selectedSections.forEach((section) => {
            const matrix = PERMISSION_MATRIX[section] || {};
            if (matrix[permissionType] === 1) {
                const key = `${section}_${permissionType}`;
                if (selectedPermissions[key]) {
                    hasCheckedPermissions = true;
                    const scope = permissionScopes[key] || "full";
                    if (firstScope === null) {
                        firstScope = scope;
                    } else if (firstScope !== scope) {
                        firstScope = "";
                    }
                }
            }
        });

        if (!hasCheckedPermissions) {
            return "";
        }

        return firstScope || "";
    };

    const handleMassScopeChange = (permissionType, scope) => {
        let currentSelectedSections = selectedSections;
        if (areAllRowsSelected) {
            currentSelectedSections = new Set();
            setSelectedSections(currentSelectedSections);
        }

        if (currentSelectedSections.size === 0) {
            return;
        }

        const newScopes = { ...permissionScopes };

        currentSelectedSections.forEach((section) => {
            const matrix = PERMISSION_MATRIX[section] || {};
            if (matrix[permissionType] === 1) {
                const key = `${section}_${permissionType}`;
                // Применяем только если чекбокс права отмечен
                if (selectedPermissions[key]) {
                    newScopes[key] = scope;
                }
            }
        });

        setPermissionScopes(newScopes);
    };

    const handleDeletePermission = async (groupId, permissionId) => {
        if (!confirm("Удалить это право?")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/permission-groups/${groupId}/permissions/${permissionId}`
            );

            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления права", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
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

        try {
            await postData(
                "POST",
                `${API_URL}admin/permission-groups/${selectedGroup.id}/users`,
                {
                    user_ids: selectedUsers,
                }
            );

            setShowAddUserModal(false);
            setSelectedUsers([]);
            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка добавления пользователей", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
            setError(err.message || "Ошибка добавления пользователей");
        }
    };

    const handleRemoveUser = async (groupId, userId) => {
        if (!confirm("Удалить пользователя из группы?")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/permission-groups/${groupId}/users/${userId}`
            );

            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления пользователя", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
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
            {/* <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Группы прав</h2>
                    <div className="text-sm text-gray-500 mt-1">
                        Всего групп: {groups.length}
                    </div>
                </div>

                {mode.edit === "full" && (
                    <button
                        className="admin-btn admin-btn--primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Создать группу
                    </button>
                )}
            </div> */}

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
                                        {mode.edit === "full" && (
                                            <button
                                                className="admin-btn admin-btn--secondary"
                                                onClick={() =>
                                                    handleEditGroup(group)
                                                }
                                            >
                                                Редактировать
                                            </button>
                                        )}

                                        {mode.delete === "full" && (
                                            <button
                                                className="admin-btn admin-btn--danger"
                                                onClick={() =>
                                                    handleDeleteGroup(group.id)
                                                }
                                            >
                                                Удалить
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="admin-group-card__permissions">
                                <div className="flex justify-between items-center mb-2">
                                    <h4>Права доступа</h4>
                                    {!group.is_system &&
                                        mode.delete === "full" && (
                                            <button
                                                className="admin-btn admin-btn--secondary"
                                                onClick={() => {
                                                    setSelectedGroup(group);

                                                    // Предзаполняем существующие права группы
                                                    const existingPermissions =
                                                        {};
                                                    const existingScopes = {};

                                                    if (
                                                        group.permissions &&
                                                        group.permissions
                                                            .length > 0
                                                    ) {
                                                        group.permissions.forEach(
                                                            (perm) => {
                                                                const key = `${perm.section}_${perm.permission_type}`;
                                                                existingPermissions[
                                                                    key
                                                                ] = true;
                                                                existingScopes[
                                                                    key
                                                                ] =
                                                                    perm.scope ||
                                                                    "full";
                                                            }
                                                        );
                                                    }

                                                    setSelectedPermissions(
                                                        existingPermissions
                                                    );
                                                    setPermissionScopes(
                                                        existingScopes
                                                    );
                                                    setShowAddPermissionModal(
                                                        true
                                                    );
                                                }}
                                            >
                                                Редактировать права
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
                                                {!group.is_system &&
                                                    mode.delete === "full" && (
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
                                    {!group.is_system &&
                                        mode.edit === "full" && (
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
                                                {!group.is_system &&
                                                    mode.delete === "full" && (
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
                            <h2>
                                Редактирование прав группы: {selectedGroup.name}
                            </h2>
                        </div>
                        <form onSubmit={handleAddPermission}>
                            <div className="admin-modal__body">
                                <div className="permissions-table-wrapper">
                                    <table className="permissions-table">
                                        <colgroup>
                                            <col style={{ width: "200px" }} />
                                            <col style={{ width: "90px" }} />
                                            <col style={{ width: "90px" }} />
                                            <col style={{ width: "90px" }} />
                                            <col style={{ width: "90px" }} />
                                            <col style={{ width: "90px" }} />
                                            <col style={{ width: "90px" }} />
                                            <col style={{ width: "60px" }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th
                                                    rowSpan="2"
                                                    className="section-header"
                                                >
                                                    Раздел / подраздел
                                                </th>
                                                <th
                                                    colSpan="3"
                                                    className="group-header"
                                                >
                                                    Выбор прав
                                                </th>
                                                <th
                                                    colSpan="3"
                                                    className="group-header"
                                                >
                                                    Ширина прав
                                                </th>
                                                <th
                                                    rowSpan="2"
                                                    className="checkbox-header"
                                                ></th>
                                            </tr>
                                            <tr>
                                                <th className="subheader">
                                                    Просмотр
                                                </th>
                                                <th className="subheader">
                                                    Редактирование
                                                </th>
                                                <th className="subheader">
                                                    Удаление
                                                </th>
                                                <th className="subheader">
                                                    Просмотр
                                                </th>
                                                <th className="subheader">
                                                    Редактирование
                                                </th>
                                                <th className="subheader">
                                                    Удаление
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {SECTIONS_ORDER.map(
                                                (sectionKey) => {
                                                    const sectionLabel =
                                                        SECTIONS[sectionKey];
                                                    const matrix =
                                                        PERMISSION_MATRIX[
                                                            sectionKey
                                                        ] || {};
                                                    return (
                                                        <tr key={sectionKey}>
                                                            <td className="section-name">
                                                                {sectionLabel}
                                                            </td>

                                                            {/* Группа чекбоксов: Выбор прав */}
                                                            {[
                                                                "view",
                                                                "edit",
                                                                "delete",
                                                            ].map(
                                                                (permType) => {
                                                                    const isAllowed =
                                                                        matrix[
                                                                            permType
                                                                        ] === 1;
                                                                    const key = `${sectionKey}_${permType}`;
                                                                    const isChecked =
                                                                        !!selectedPermissions[
                                                                            key
                                                                        ];

                                                                    return (
                                                                        <td
                                                                            key={`check_${permType}`}
                                                                            className="permission-cell"
                                                                        >
                                                                            {isAllowed ? (
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        isChecked
                                                                                    }
                                                                                    onChange={() =>
                                                                                        handlePermissionCheckboxChange(
                                                                                            sectionKey,
                                                                                            permType
                                                                                        )
                                                                                    }
                                                                                    className="permission-checkbox"
                                                                                />
                                                                            ) : (
                                                                                <span className="permission-disabled">
                                                                                    —
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                }
                                                            )}

                                                            {/* Группа селектов: Ширина прав */}
                                                            {[
                                                                "view",
                                                                "edit",
                                                                "delete",
                                                            ].map(
                                                                (permType) => {
                                                                    const matrix =
                                                                        PERMISSION_MATRIX[
                                                                            sectionKey
                                                                        ] || {};
                                                                    const isAllowed =
                                                                        matrix[
                                                                            permType
                                                                        ] === 1;
                                                                    const scopeKey = `${sectionKey}_${permType}`;
                                                                    const permissionKey = `${sectionKey}_${permType}`;
                                                                    const isChecked =
                                                                        !!selectedPermissions[
                                                                            permissionKey
                                                                        ];
                                                                    const currentScope =
                                                                        permissionScopes[
                                                                            scopeKey
                                                                        ] ||
                                                                        "full";

                                                                    return (
                                                                        <td
                                                                            key={`scope_${permType}`}
                                                                            className="scope-cell"
                                                                        >
                                                                            {isAllowed ? (
                                                                                <select
                                                                                    value={
                                                                                        currentScope
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleScopeChange(
                                                                                            sectionKey,
                                                                                            permType,
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    className="scope-select"
                                                                                    disabled={
                                                                                        !isChecked
                                                                                    }
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        e.stopPropagation()
                                                                                    }
                                                                                >
                                                                                    <option value="full">
                                                                                        Полная
                                                                                    </option>
                                                                                    <option value="limited">
                                                                                        Ограниченная
                                                                                    </option>
                                                                                </select>
                                                                            ) : (
                                                                                <span className="permission-disabled">
                                                                                    —
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                }
                                                            )}

                                                            {/* Чекбокс выбора всей строки */}
                                                            <td className="row-checkbox-cell">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedSections.has(
                                                                        sectionKey
                                                                    )}
                                                                    onChange={() =>
                                                                        handleSectionCheckboxChange(
                                                                            sectionKey
                                                                        )
                                                                    }
                                                                    className="row-checkbox"
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}

                                            {/* Строка с массовыми чекбоксами внизу */}
                                            <tr className="mass-select-row">
                                                {/* Массовые чекбоксы для "Выбор прав" */}
                                                {["view", "edit", "delete"].map(
                                                    (permType) => (
                                                        <td
                                                            key={`mass_${permType}`}
                                                            className="mass-checkbox-cell"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isMassCheckboxChecked(
                                                                    permType
                                                                )}
                                                                onChange={() =>
                                                                    handleMassPermissionCheckboxChange(
                                                                        permType
                                                                    )
                                                                }
                                                                className="mass-checkbox"
                                                            />
                                                        </td>
                                                    )
                                                )}

                                                {/* Массовые селекты для "Ширина прав" */}
                                                {["view", "edit", "delete"].map(
                                                    (permType) => {
                                                        const massScopeValue =
                                                            getMassScopeValue(
                                                                permType
                                                            );
                                                        const isMassCheckboxCheckedForType =
                                                            isMassCheckboxChecked(
                                                                permType
                                                            );

                                                        return (
                                                            <td
                                                                key={`mass_scope_${permType}`}
                                                                className="scope-cell"
                                                            >
                                                                <select
                                                                    value={
                                                                        massScopeValue
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMassScopeChange(
                                                                            permType,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="scope-select"
                                                                    disabled={
                                                                        !isMassCheckboxCheckedForType ||
                                                                        selectedSections.size ===
                                                                            0
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                >
                                                                    <option value="">
                                                                        —
                                                                    </option>
                                                                    <option value="full">
                                                                        Полная
                                                                    </option>
                                                                    <option value="limited">
                                                                        Ограниченная
                                                                    </option>
                                                                </select>
                                                            </td>
                                                        );
                                                    }
                                                )}

                                                {/* Чекбокс для выделения всех строк */}
                                                <td className="mass-checkbox-cell">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            areAllRowsSelected
                                                        }
                                                        onChange={
                                                            handleSelectAllRows
                                                        }
                                                        className="row-checkbox"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {error && (
                                    <div className="admin-form__error">
                                        {error}
                                    </div>
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
                                    Сохранить
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
