import { useEffect, useState, Fragment } from "react";

import postData from "../../utils/postData";
import { toast } from "react-toastify";

import Select from "react-select";
import ScrollCloseSelect from "../ScrollCloseSelect";
import Hint from "../Hint/Hint";

import SECTIONS from "../../data/sections.json";
import SECTIONS_ORDER from "../../data/sections_order.json"; // Порядок отображения разделов
import PERMISSION_MATRIX from "../../data/permission_matrix.json"; // Матрица прав: какие типы прав доступны для каждого раздела

const RIGHTS_WIDTH_OPTIONS = [
    { label: "Полная", value: "full" },
    { label: "Ограниченная", value: "limited" },
];

const checkPermissions = (matrix) => {
    const permissions = ["view", "edit", "delete"];

    const enabledPermissions = permissions.filter((perm) => matrix[perm] === 1);

    if (enabledPermissions.length === 0) {
        return false;
    }

    return enabledPermissions.every((perm) => {
        const widthKey = `permission_width_${perm}`;
        return matrix[widthKey] === "all";
    });
};

const GroupEditor = ({
    editorState,
    closeEditor,
    selectedGroup,
    selectedPermissions,
    setSelectedPermissions,
    permissionScopes,
    setPermissionScopes,
    loadGroups,
}) => {
    const [error, setError] = useState("");

    const [groupName, setGroupName] = useState("");

    // Выбранные разделы (чекбокс в конце строки)
    const [selectedSections, setSelectedSections] = useState(new Set());

    const areAllRowsSelected = SECTIONS_ORDER.every((section) =>
        selectedSections.has(section)
    );

    // Обработчик изменения чекбокса права
    const handlePermissionCheckboxChange = (section, permissionType) => {
        setSelectedPermissions((prev) => {
            const newPermissions = { ...prev };
            const newScopes = { ...permissionScopes };

            const viewKey = `${section}_view`;
            const editKey = `${section}_edit`;
            const deleteKey = `${section}_delete`;

            const isChecked = !!newPermissions[`${section}_${permissionType}`];

            if (isChecked) {
                // Снятие чекбокса
                if (permissionType === "view") {
                    delete newPermissions[viewKey];
                    delete newPermissions[editKey];
                    delete newPermissions[deleteKey];

                    delete newScopes[viewKey];
                    delete newScopes[editKey];
                    delete newScopes[deleteKey];
                } else if (permissionType === "edit") {
                    delete newPermissions[editKey];
                    delete newPermissions[deleteKey];

                    delete newScopes[editKey];
                    delete newScopes[deleteKey];
                } else if (permissionType === "delete") {
                    delete newPermissions[deleteKey];
                    delete newScopes[deleteKey];
                }
            } else {
                // Выбор чекбокса — добавляем зависимости
                if (permissionType === "view") {
                    newPermissions[viewKey] = true;
                    newScopes[viewKey] ||= "full";
                } else if (permissionType === "edit") {
                    newPermissions[viewKey] = true;
                    newPermissions[editKey] = true;

                    newScopes[viewKey] ||= "full";
                    newScopes[editKey] ||= "full";
                } else if (permissionType === "delete") {
                    newPermissions[viewKey] = true;
                    newPermissions[editKey] = true;
                    newPermissions[deleteKey] = true;

                    newScopes[viewKey] ||= "full";
                    newScopes[editKey] ||= "full";
                    newScopes[deleteKey] ||= "full";
                }
            }

            return newPermissions;
        });
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

    // Выделение всех строк
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

    // Массовый выбор прав в столбце
    const handleMassPermissionCheckboxChange = (permissionType) => {
        const newPermissions = { ...selectedPermissions };
        const newScopes = { ...permissionScopes };

        // Получаем все допустимые ключи для данного типа действия
        const availableKeys = SECTIONS_ORDER.filter((section) => {
            const matrix = PERMISSION_MATRIX[section];
            return matrix?.[permissionType] === 1;
        }).map((section) => `${section}_${permissionType}`);

        if (availableKeys.length === 0) return;

        // Проверяем, все ли они уже отмечены
        const areAllChecked = availableKeys.every(
            (key) => newPermissions[key] === true
        );

        // Если все отмечены — снимаем, иначе отмечаем все
        availableKeys.forEach((key) => {
            if (areAllChecked) {
                delete newPermissions[key];
                delete newScopes[key];
            } else {
                newPermissions[key] = true;

                if (!newScopes[key]) {
                    newScopes[key] = "full";
                }
            }
        });

        setSelectedPermissions(newPermissions);
        setPermissionScopes(newScopes);
    };

    // Проверяем, все ли права раздела данного типа отмечены
    const isMassCheckboxChecked = (permissionType) => {
        // Все допустимые ключи для данного типа
        const keys = SECTIONS_ORDER.filter((section) => {
            const matrix = PERMISSION_MATRIX[section];
            return matrix?.[permissionType] === 1;
        }).map((section) => `${section}_${permissionType}`);

        if (keys.length === 0) {
            return false;
        }

        // Проверяем, что все они отмечены
        return keys.every((key) => selectedPermissions[key] === true);
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
        if (selectedSections.size === 0) {
            return;
        }

        const newScopes = { ...permissionScopes };

        selectedSections.forEach((section) => {
            const matrix = PERMISSION_MATRIX[section] || {};

            // Изменение права быть разрешено
            if (matrix[permissionType] !== 1) {
                return;
            }

            const key = `${section}_${permissionType}`;

            // Право должно быть включено
            if (!selectedPermissions[key]) {
                return;
            }

            const widthKey = `permission_width_${permissionType}`;

            if (widthKey in matrix && matrix[widthKey] !== "all") {
                newScopes[key] = matrix[widthKey];
            } else {
                newScopes[key] = scope;
            }
        });

        setPermissionScopes(newScopes);
    };

    // Создание / Изменение группы
    const handleSaveGroup = () => {
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

        return postData(editorState === "create" ? "POST" : "PATCH", URL, {
            name: groupName,
            permissions: permissions,
        })
            .then((response) => {
                if (response.ok) {
                    closeEditor();
                    setSelectedPermissions({});
                    setPermissionScopes({});
                    setSelectedSections(new Set());
                    loadGroups();
                }
            })
            .catch((error) => {
                toast.error(error.message || "Ошибка сохранения прав", {
                    isLoading: false,
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
                setError(error.message || "Ошибка сохранения прав");
            });
    };

    // Иерархия прав (Просмотр -> Редактирование -> Удаление)
    useEffect(() => {
        setSelectedPermissions((prev) => {
            const newPermissions = { ...prev };
            const newScopes = { ...permissionScopes };
            let changed = false;

            SECTIONS_ORDER.forEach((section) => {
                const viewKey = `${section}_view`;
                const editKey = `${section}_edit`;
                const deleteKey = `${section}_delete`;

                const hasView = !!newPermissions[viewKey];
                const hasEdit = !!newPermissions[editKey];
                const hasDelete = !!newPermissions[deleteKey];

                // Добавляем зависимости при выборе edit/delete
                if (hasEdit && !hasView) {
                    newPermissions[viewKey] = true;
                    newScopes[viewKey] ||= "full";
                    changed = true;
                }
                if (hasDelete) {
                    if (!hasView) {
                        newPermissions[viewKey] = true;
                        newScopes[viewKey] ||= "full";
                        changed = true;
                    }
                    if (!hasEdit) {
                        newPermissions[editKey] = true;
                        newScopes[editKey] ||= "full";
                        changed = true;
                    }
                }
            });

            return changed ? newPermissions : prev;
        });
    }, [selectedPermissions]);

    useEffect(() => {
        if (selectedGroup?.name) {
            setGroupName(selectedGroup?.name);
        } else {
            setGroupName("");
        }
    }, [selectedGroup]);

    return (
        <div className="popup" onClick={closeEditor}>
            <div
                className="popup__wrapper group-editor"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="popup__header">
                    <div>
                        {`${
                            editorState === "create"
                                ? "Добавить группу"
                                : `Редактировать группу: ${selectedGroup?.name}`
                        }`}
                    </div>

                    {editorState === "create" && (
                        <input
                            type="text"
                            className="form-field"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    )}
                </div>

                <form>
                    <div className="action-form__body">
                        <div className="permissions-table-wrapper">
                            <table className="permissions-table">
                                <colgroup>
                                    <col style={{ width: "200px" }} />
                                    <col style={{ width: "90px" }} />
                                    <col style={{ width: "90px" }} />
                                    <col style={{ width: "90px" }} />
                                    <col style={{ width: "110px" }} />
                                    <col style={{ width: "110px" }} />
                                    <col style={{ width: "110px" }} />
                                    <col style={{ width: "110px" }} />
                                </colgroup>

                                <thead className="permissions-table__thead">
                                    <tr>
                                        <th
                                            rowSpan={2}
                                            className="section-header"
                                        >
                                            Раздел / подраздел
                                        </th>
                                        <th
                                            colSpan={3}
                                            className="permissions-table__thead-header"
                                        >
                                            Выбор прав
                                        </th>
                                        <th
                                            colSpan={4}
                                            className="permissions-table__thead-header"
                                        >
                                            Ширина прав
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="permissions-table__thead-subheader">
                                            Просмотр
                                        </th>
                                        <th className="permissions-table__thead-subheader">
                                            Редактирование
                                        </th>
                                        <th className="permissions-table__thead-subheader">
                                            Удаление
                                        </th>
                                        <th className="permissions-table__thead-subheader">
                                            Просмотр
                                            <Hint message="Просмотр" />
                                        </th>
                                        <th className="permissions-table__thead-subheader">
                                            Редактирование
                                            <Hint message="Редактирование" />
                                        </th>
                                        <th className="permissions-table__thead-subheader">
                                            Удаление
                                            <Hint message="Удаление" />
                                        </th>
                                        <th className="permissions-table__thead-subheader">
                                            Выбор раздела
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="permissions-table__tbody">
                                    {SECTIONS_ORDER.map((sectionKey, index) => {
                                        const sectionLabel =
                                            SECTIONS[sectionKey];

                                        const matrix =
                                            PERMISSION_MATRIX[sectionKey] || {};

                                        const prevSectionKey =
                                            SECTIONS_ORDER[index - 1];

                                        const prevTitle = prevSectionKey
                                            ? SECTIONS[prevSectionKey]?.title
                                            : null;

                                        const shouldRenderTitle =
                                            sectionLabel.title !== prevTitle;

                                        return (
                                            <Fragment key={sectionKey}>
                                                {shouldRenderTitle && (
                                                    <tr className="permissions-table__title">
                                                        <td colSpan={8}>
                                                            {sectionLabel.title}
                                                        </td>
                                                    </tr>
                                                )}

                                                <tr>
                                                    <td className="permissions-table__name">
                                                        {sectionLabel.name}
                                                    </td>

                                                    {/* Группа чекбоксов: Выбор прав */}
                                                    {[
                                                        "view",
                                                        "edit",
                                                        "delete",
                                                    ].map((permType) => {
                                                        const isAllowed =
                                                            matrix[permType] ===
                                                            1;
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
                                                                    <label
                                                                        htmlFor={`${sectionKey}_${permType}`}
                                                                        className="form-checkbox"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`${sectionKey}_${permType}`}
                                                                            checked={
                                                                                isChecked
                                                                            }
                                                                            onChange={() =>
                                                                                handlePermissionCheckboxChange(
                                                                                    sectionKey,
                                                                                    permType
                                                                                )
                                                                            }
                                                                        />
                                                                        <div className="checkbox"></div>
                                                                    </label>
                                                                ) : (
                                                                    <span className="permission-disabled">
                                                                        —
                                                                    </span>
                                                                )}
                                                            </td>
                                                        );
                                                    })}

                                                    {/* Группа селектов: Ширина прав */}
                                                    {[
                                                        "view",
                                                        "edit",
                                                        "delete",
                                                    ].map((permType) => {
                                                        const matrix =
                                                            PERMISSION_MATRIX[
                                                                sectionKey
                                                            ] || {};

                                                        const isAllowed =
                                                            matrix[permType] ===
                                                            1;

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

                                                        const widthKey = `permission_width_${permType}`;

                                                        const availableOptions =
                                                            matrix[widthKey] ===
                                                            "all"
                                                                ? RIGHTS_WIDTH_OPTIONS
                                                                : RIGHTS_WIDTH_OPTIONS.filter(
                                                                      (item) =>
                                                                          item.value ===
                                                                          matrix[
                                                                              widthKey
                                                                          ]
                                                                  );

                                                        return (
                                                            <td
                                                                key={`scope_${permType}`}
                                                                className="scope-cell"
                                                            >
                                                                {isAllowed ? (
                                                                    <ScrollCloseSelect
                                                                        options={
                                                                            availableOptions
                                                                        }
                                                                        value={availableOptions.find(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.value ===
                                                                                currentScope
                                                                        )}
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                availableOptions?.length <
                                                                                2
                                                                            )
                                                                                return;

                                                                            handleScopeChange(
                                                                                sectionKey,
                                                                                permType,
                                                                                e.value
                                                                            );
                                                                        }}
                                                                        isDisabled={
                                                                            !isChecked ||
                                                                            availableOptions?.length <
                                                                                2
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <span className="permission-disabled">
                                                                        —
                                                                    </span>
                                                                )}
                                                            </td>
                                                        );
                                                    })}

                                                    {/* Чекбокс выбора всей строки */}
                                                    <td className="row-checkbox-cell">
                                                        {checkPermissions(
                                                            matrix
                                                        ) && (
                                                            <label
                                                                htmlFor={`${sectionKey}`}
                                                                className="form-checkbox"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedSections.has(
                                                                        sectionKey
                                                                    )}
                                                                    id={
                                                                        sectionKey
                                                                    }
                                                                    onChange={() =>
                                                                        handleSectionCheckboxChange(
                                                                            sectionKey
                                                                        )
                                                                    }
                                                                    className="row-checkbox"
                                                                />
                                                                <div className="checkbox"></div>
                                                            </label>
                                                        )}
                                                    </td>
                                                </tr>
                                            </Fragment>
                                        );
                                    })}

                                    {/* Строка с массовыми чекбоксами внизу */}
                                    <tr className="mass-select-row">
                                        {/* Массовые чекбоксы для "Выбор прав" */}
                                        {["view", "edit", "delete"].map(
                                            (permType, index) => (
                                                <td
                                                    key={`mass_${permType}`}
                                                    className="mass-checkbox-cell"
                                                >
                                                    <label
                                                        htmlFor={`${permType}_${index}`}
                                                        className="form-checkbox"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={`${permType}_${index}`}
                                                            checked={isMassCheckboxChecked(
                                                                permType
                                                            )}
                                                            onChange={() =>
                                                                handleMassPermissionCheckboxChange(
                                                                    permType
                                                                )
                                                            }
                                                        />
                                                        <div className="checkbox"></div>
                                                    </label>
                                                </td>
                                            )
                                        )}

                                        {/* Массовые селекты для "Ширина прав" */}
                                        {["view", "edit", "delete"].map(
                                            (permType) => {
                                                const massScopeValue =
                                                    getMassScopeValue(permType);

                                                const isMassCheckboxCheckedForType =
                                                    isMassCheckboxChecked(
                                                        permType
                                                    );

                                                return (
                                                    <td
                                                        key={`mass_scope_${permType}`}
                                                        className="scope-cell"
                                                    >
                                                        <Select
                                                            className="form-select-extend"
                                                            classNamePrefix="form-select-extend"
                                                            options={
                                                                RIGHTS_WIDTH_OPTIONS
                                                            }
                                                            placeholder="—"
                                                            isSearchable={false}
                                                            menuPortalTarget={
                                                                document.body
                                                            }
                                                            menuPosition="fixed"
                                                            menuShouldScrollIntoView={
                                                                false
                                                            }
                                                            value={RIGHTS_WIDTH_OPTIONS.find(
                                                                (item) =>
                                                                    item.value ===
                                                                    massScopeValue
                                                            )}
                                                            onChange={(e) => {
                                                                handleMassScopeChange(
                                                                    permType,
                                                                    e.value
                                                                );
                                                            }}
                                                            isDisabled={
                                                                !isMassCheckboxCheckedForType ||
                                                                selectedSections.size ===
                                                                    0
                                                            }
                                                        />
                                                    </td>
                                                );
                                            }
                                        )}

                                        {/* Чекбокс для выделения всех строк */}
                                        <td className="mass-checkbox-cell">
                                            <label
                                                htmlFor="select_all"
                                                className="form-checkbox"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id="select_all"
                                                    checked={areAllRowsSelected}
                                                    onChange={
                                                        handleSelectAllRows
                                                    }
                                                    className="row-checkbox"
                                                />

                                                <div className="checkbox"></div>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="action-form__footer relative">
                        {error && (
                            <div className="admin-form__error">{error}</div>
                        )}

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={closeEditor}
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
                            disabled={groupName.length < 2}
                        >
                            {editorState === "create"
                                ? "Добавить"
                                : `Сохранить`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupEditor;
