import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import Switch from "../Switch/Switch";
import Popup from "../Popup/Popup";

const ReferenceItem = ({
    data,
    booksItems,
    columns,
    mode = "read",
    bookId,
    deleteElement,
    editElement,
    handleInputChange,
    positions,
    setRolesAction,
}) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/reference-books/${data.alias}`);
    };

    const [isError, setIsError] = useState(false);
    const [isPopupActive, setIsPopupActive] = useState(false);

    const [popupFields, setPopupFields] = useState([]);

    const handleOpenPopup = () => {
        // фильтруем поля объекта
        const editableFields = Object.entries(data)
            .filter(([key]) => ["name", "full_name", "phone"].includes(key))
            .map(([key, value]) => ({ key, value }));

        setPopupFields(editableFields);
        setIsPopupActive(true);
    };

    const hasNameMatch = (input, currentId) => {
        const result = booksItems.some(
            (item) =>
                item.id !== currentId &&
                item.name.toLowerCase() === input.trim().toLowerCase()
        );

        if (result) {
            setIsError(true);
        } else {
            editElement(data.id);
        }
    };

    return (
        <>
            <tr
                className="registry-table__item transition text-base text-left cursor-pointer"
                {...(!bookId && { onClick: handleRowClick })}
            >
                {columns.map(({ key }) => {
                    const value = data[key];

                    if (Array.isArray(value) && value.length > 0) {
                        return (
                            <td
                                className="min-w-[180px] max-w-[300px]"
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {Array.isArray(value) ? (
                                            value.map((item, index) => (
                                                <tr key={`${key}_${index}`}>
                                                    <td className="registry-table__item-last-report w-full">
                                                        {typeof item ===
                                                            "object" &&
                                                            item !== null && (
                                                                <div className="flex flex-col gap-1">
                                                                    {Object.entries(
                                                                        item
                                                                    ).map(
                                                                        ([
                                                                            field,
                                                                            val,
                                                                        ]) =>
                                                                            field !==
                                                                                "id" &&
                                                                            field !==
                                                                                "updated_at" &&
                                                                            field !==
                                                                                "last_updated" &&
                                                                            (field ===
                                                                                "name" ||
                                                                                field ===
                                                                                    "full_name" ||
                                                                                field ===
                                                                                    "phone") &&
                                                                            mode ===
                                                                                "edit" ? (
                                                                                <div
                                                                                    key={
                                                                                        field
                                                                                    }
                                                                                    className="flex items-center gap-2"
                                                                                >
                                                                                    <input
                                                                                        type="text"
                                                                                        className="w-full"
                                                                                        value={
                                                                                            val?.toString() ||
                                                                                            "—"
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleInputChange(
                                                                                                e,
                                                                                                field,
                                                                                                data.id
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            ) : (
                                                                                field !==
                                                                                    "id" &&
                                                                                field !==
                                                                                    "updated_at" &&
                                                                                field !==
                                                                                    "last_updated" && (
                                                                                    <div
                                                                                        className="text-sm"
                                                                                        key={
                                                                                            field
                                                                                        }
                                                                                    >
                                                                                        {val?.toString() ||
                                                                                            "—"}
                                                                                    </div>
                                                                                )
                                                                            )
                                                                    )}
                                                                </div>
                                                            )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-4">—</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="min-w-[180px] max-w-[300px]"
                                key={key}
                            >
                                {mode === "edit" &&
                                (key === "name" || key === "phone") ? (
                                    <div className="flex items-center gap-2 relative">
                                        <input
                                            type="text"
                                            className="w-full"
                                            value={value?.toString() || "—"}
                                            onChange={(e) => {
                                                handleInputChange(
                                                    e,
                                                    key,
                                                    data.id
                                                );

                                                if (
                                                    key === "name" &&
                                                    bookId == "positions"
                                                ) {
                                                    setIsError(false);
                                                }
                                            }}
                                        />

                                        {key === "name" &&
                                            bookId == "positions" &&
                                            isError && (
                                                <span className="text-red-400 text-sm absolute left-0 bottom-[-15px]">
                                                    Такая должность уже есть
                                                </span>
                                            )}
                                    </div>
                                ) : key === "full_name" &&
                                  bookId != "report-types" ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="w-full"
                                            value={value?.toString() || "—"}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    key,
                                                    data.id
                                                )
                                            }
                                        />
                                    </div>
                                ) : key === "type" || key === "position_id" ? (
                                    <select
                                        className={`w-full min-h-[30px] ${
                                            mode == "read"
                                                ? ""
                                                : "border border-gray-300"
                                        }`}
                                        name={key}
                                        value={value || ""}
                                        onChange={(e) =>
                                            handleInputChange(e, key, data.id)
                                        }
                                        disabled={mode == "read"}
                                    >
                                        {bookId ===
                                        "management-report-types" ? (
                                            <>
                                                <option value=""></option>
                                                {positions.map((position) => (
                                                    <option
                                                        value={position.id}
                                                        key={position.id}
                                                    >
                                                        {position.name}
                                                    </option>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                <option value="">Тип</option>
                                                <option value="one_to_one">
                                                    Один к одному
                                                </option>
                                                <option value="one_to_many">
                                                    Один ко многим
                                                </option>
                                            </>
                                        )}
                                    </select>
                                ) : [
                                      "is_regular",
                                      "include_in_payroll",
                                      "show_cost",
                                      "is_project_report_responsible",
                                  ].includes(key) ? (
                                    <Switch
                                        value={
                                            value === true || value === "true"
                                        }
                                        label={`${key}_${data.id}`}
                                        onChange={(updated) => {
                                            handleInputChange(
                                                updated,
                                                key,
                                                data.id
                                            );
                                            if (
                                                key ===
                                                "is_project_report_responsible"
                                            ) {
                                                setRolesAction({
                                                    action: updated.toString(),
                                                    roleId: data.id,
                                                });
                                            }
                                        }}
                                    />
                                ) : (key === "updated_at" ||
                                      key === "last_updated") &&
                                  value ? (
                                    format(
                                        parseISO(value),
                                        "d MMMM yyyy, HH:mm",
                                        {
                                            locale: ru,
                                        }
                                    ) || "—"
                                ) : key === "updated_by" ? (
                                    value?.name || "—"
                                ) : key === "hours" ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            className={`w-full transition-colors border ${
                                                mode === "read"
                                                    ? "border-transparent"
                                                    : "border-gray-300"
                                            }`}
                                            value={value?.toString() || "—"}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    key,
                                                    data.id
                                                )
                                            }
                                        />
                                    </div>
                                ) : (
                                    value?.toString() || "—"
                                )}
                            </td>
                        );
                    }
                })}

                {mode === "edit" && bookId != "working-hours" && (
                    <td>
                        <div className="registry-table__item-actions">
                            {mode === "edit" && (
                                <button
                                    onClick={handleOpenPopup}
                                    className="edit-button"
                                    title="Изменить элемент"
                                ></button>
                            )}

                            {mode === "edit" && bookId !== "report-types" && (
                                <button
                                    onClick={() => {
                                        if (data.projects_count) {
                                            if (data.projects_count < 1) {
                                                deleteElement(data.id);
                                            }
                                        } else {
                                            deleteElement(data.id);
                                        }
                                    }}
                                    className="delete-button extended"
                                    title="Удалить элемент"
                                    disabled={
                                        data.projects_count > 0 ||
                                        data.employee_count > 0
                                    }
                                >
                                    <svg
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5.833 8v9.166h8.333V8h1.667v10c0 .46-.373.833-.833.833H5A.833.833 0 014.166 18V8h1.667zm3.333 0v7.5H7.5V8h1.666zM12.5 8v7.5h-1.667V8H12.5zm0-5.833c.358 0 .677.229.79.57l.643 1.929h2.733v1.667H3.333V4.666h2.733l.643-1.93a.833.833 0 01.79-.57h5zm-.601 1.666H8.1l-.278.833h4.354l-.277-.833z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </td>
                )}
            </tr>

            {isPopupActive && (
                <Popup
                    onClick={() => setIsPopupActive(false)}
                    title="Редактировать наименование"
                >
                    <div className="action-form__body flex flex-col gap-3">
                        {popupFields.length > 0 ? (
                            popupFields.map(({ key, value }) => (
                                <div key={key} className="flex flex-col gap-1">
                                    <label className="text-sm font-medium capitalize">
                                        {key.replace("_", " ")}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-field"
                                        value={value?.toString() || ""}
                                        onChange={(e) =>
                                            handleInputChange(e, key, data.id)
                                        }
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                Нет редактируемых полей
                            </p>
                        )}
                    </div>

                    <div className="action-form__footer">
                        <button
                            type="button"
                            onClick={() => setIsPopupActive(false)}
                            className="cancel-button flex-[0_0_fit-content]"
                            title="Отменить изменения"
                        >
                            Отменить
                        </button>

                        <button
                            type="button"
                            className="action-button flex-[0_0_fit-content]"
                            onClick={() => {
                                if (bookId == "positions") {
                                    hasNameMatch(data.name, data.id);
                                } else {
                                    editElement(data.id);
                                }
                            }}
                            title="Сохранить изменения"
                        >
                            Сохранить
                        </button>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default ReferenceItem;
