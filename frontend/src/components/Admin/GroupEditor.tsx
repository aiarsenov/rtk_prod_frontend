import { useEffect, useState } from "react";

import postData from "../../utils/postData";
import { toast } from "react-toastify";

import Popup from "../Popup/Popup";

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

const GroupEditor = ({
    editorState,
    setShowGroupEditor,
    selectedGroup,
    selectedPermissions,
    setSelectedPermissions,
    permissionScopes,
    setPermissionScopes,
    loadGroups,
}) => {
    const [error, setError] = useState("");

    const [newGroupName, setNewGroupName] = useState("");

    // Выбранные разделы (чекбокс в конце строки)
    const [selectedSections, setSelectedSections] = useState(new Set());

    const areAllRowsSelected = SECTIONS_ORDER.every((section) =>
        selectedSections.has(section)
    );

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

    // Создание / Изменение группы
    const handleSaveGroup = async () => {
        setError("");

        const URL =
            editorState === "create"
                ? `${import.meta.env.VITE_API_URL}admin/permission-groups`
                : `${import.meta.env.VITE_API_URL}admin/permission-groups/${
                      selectedGroup.id
                  }`;

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
            await postData(editorState === "create" ? "POST" : "PATCH", URL, {
                name: newGroupName,
                permissions: permissions,
            });

            setShowGroupEditor(false);
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

    useEffect(() => {
        if (selectedGroup?.name) {
            setNewGroupName(selectedGroup?.name);
        } else {
            setNewGroupName("");
        }
    }, [selectedGroup]);

    return (
        <Popup
            title={`${
                editorState === "create"
                    ? "Добавить группу"
                    : `Редактировать группу: ${selectedGroup.name}`
            }`}
            className="group-editor"
            onClick={() => setShowGroupEditor(false)}
        >
            <form>
                <div className="action-form__body">
                    <div className="group-editor__name">
                        <label className="form-label">Название</label>

                        <input
                            type="text"
                            className="form-field"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                    </div>

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
                                    <th rowSpan="2" className="section-header">
                                        Раздел / подраздел
                                    </th>
                                    <th colSpan="3" className="group-header">
                                        Выбор прав
                                    </th>
                                    <th colSpan="3" className="group-header">
                                        Ширина прав
                                    </th>
                                    <th
                                        rowSpan="2"
                                        className="checkbox-header"
                                    ></th>
                                </tr>
                                <tr>
                                    <th className="subheader">Просмотр</th>
                                    <th className="subheader">
                                        Редактирование
                                    </th>
                                    <th className="subheader">Удаление</th>
                                    <th className="subheader">Просмотр</th>
                                    <th className="subheader">
                                        Редактирование
                                    </th>
                                    <th className="subheader">Удаление</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SECTIONS_ORDER.map((sectionKey) => {
                                    const sectionLabel = SECTIONS[sectionKey];
                                    const matrix =
                                        PERMISSION_MATRIX[sectionKey] || {};
                                    return (
                                        <tr key={sectionKey}>
                                            <td className="section-name">
                                                {sectionLabel}
                                            </td>

                                            {/* Группа чекбоксов: Выбор прав */}
                                            {["view", "edit", "delete"].map(
                                                (permType) => {
                                                    const isAllowed =
                                                        matrix[permType] === 1;
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
                                            {["view", "edit", "delete"].map(
                                                (permType) => {
                                                    const matrix =
                                                        PERMISSION_MATRIX[
                                                            sectionKey
                                                        ] || {};
                                                    const isAllowed =
                                                        matrix[permType] === 1;
                                                    const scopeKey = `${sectionKey}_${permType}`;
                                                    const permissionKey = `${sectionKey}_${permType}`;
                                                    const isChecked =
                                                        !!selectedPermissions[
                                                            permissionKey
                                                        ];
                                                    const currentScope =
                                                        permissionScopes[
                                                            scopeKey
                                                        ] || "full";

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
                                })}

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
                                                getMassScopeValue(permType);
                                            const isMassCheckboxCheckedForType =
                                                isMassCheckboxChecked(permType);

                                            return (
                                                <td
                                                    key={`mass_scope_${permType}`}
                                                    className="scope-cell"
                                                >
                                                    <select
                                                        value={massScopeValue}
                                                        onChange={(e) =>
                                                            handleMassScopeChange(
                                                                permType,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="scope-select"
                                                        disabled={
                                                            !isMassCheckboxCheckedForType ||
                                                            selectedSections.size ===
                                                                0
                                                        }
                                                        onClick={(e) =>
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
                                            checked={areAllRowsSelected}
                                            onChange={handleSelectAllRows}
                                            className="row-checkbox"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {error && <div className="admin-form__error">{error}</div>}
                </div>

                <div className="action-form__footer">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowGroupEditor(false)}
                        title="Закрыть редактор"
                    >
                        Отмена
                    </button>

                    <button
                        type="button"
                        className="action-button"
                        title={`${
                            editorState === "create"
                                ? "Добавить группу"
                                : `Сохранить изменения`
                        }`}
                        onClick={handleSaveGroup}
                    >
                        {editorState === "create" ? "Добавить" : `Сохранить`}
                    </button>
                </div>
            </form>
        </Popup>
    );
};

export default GroupEditor;
