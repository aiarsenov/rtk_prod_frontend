import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

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
        <tr
            className="border-b border-gray-300 hover:bg-gray-50 transition text-base text-left cursor-pointer"
            {...(!bookId && { onClick: handleRowClick })}
        >
            {columns.map(({ key }) => {
                const value = data[key];

                if (Array.isArray(value) && value.length > 0) {
                    return (
                        <td
                            className="py-7 min-w-[180px] max-w-[200px]"
                            key={key}
                        >
                            <table className="w-full">
                                <tbody className="flex flex-col gap-3">
                                    {Array.isArray(value) ? (
                                        value.map((item, index) => (
                                            <tr
                                                className={`${
                                                    index !== value.length - 1
                                                        ? "border-b border-gray-300 pb-2"
                                                        : ""
                                                }`}
                                                key={`${key}_${index}`}
                                            >
                                                <td className="px-4">
                                                    {typeof item === "object" &&
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
                            className="px-4 py-7 min-w-[180px] max-w-[200px]"
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
                                            handleInputChange(e, key, data.id);

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
                                            handleInputChange(e, key, data.id)
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
                                    {bookId === "management-report-types" ? (
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
                            ) : key === "is_regular" ? (
                                <select
                                    className={`w-full min-h-[30px] ${
                                        mode == "read"
                                            ? ""
                                            : "border border-gray-300"
                                    }`}
                                    name={key}
                                    value={value.toString() || ""}
                                    onChange={(e) =>
                                        handleInputChange(e, key, data.id)
                                    }
                                    disabled={mode == "read"}
                                >
                                    <option value="true">Да</option>
                                    <option value="false">Нет</option>
                                </select>
                            ) : key === "include_in_payroll" ? (
                                <select
                                    className={`w-full min-h-[30px] ${
                                        mode == "read"
                                            ? ""
                                            : "border border-gray-300"
                                    }`}
                                    name={key}
                                    value={value.toString() || ""}
                                    onChange={(e) =>
                                        handleInputChange(e, key, data.id)
                                    }
                                    disabled={mode == "read"}
                                >
                                    <option value="">Выбрать</option>
                                    <option value="true">Да</option>
                                    <option value="false">Нет</option>
                                </select>
                            ) : key === "show_cost" ? (
                                <select
                                    className={`w-full min-h-[30px] ${
                                        mode == "read"
                                            ? ""
                                            : "border border-gray-300"
                                    }`}
                                    name={key}
                                    value={value.toString() || ""}
                                    onChange={(e) =>
                                        handleInputChange(e, key, data.id)
                                    }
                                    disabled={mode == "read"}
                                >
                                    <option value="true">Да</option>
                                    <option value="false">Нет</option>
                                </select>
                            ) : key === "is_project_report_responsible" ? (
                                <select
                                    className={`w-full min-h-[30px] ${
                                        mode == "read"
                                            ? ""
                                            : "border border-gray-300"
                                    }`}
                                    name={key}
                                    value={value.toString() || ""}
                                    onChange={(e) => {
                                        handleInputChange(e, key, data.id);
                                        setRolesAction({
                                            action: e.target.value,
                                            roleId: data.id,
                                        });
                                    }}
                                    disabled={mode == "read"}
                                >
                                    <option value="true">Да</option>
                                    <option value="false">Нет</option>
                                </select>
                            ) : (key === "updated_at" ||
                                  key === "last_updated") &&
                              value ? (
                                format(parseISO(value), "d MMMM yyyy, HH:mm", {
                                    locale: ru,
                                }) || "—"
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
                                            handleInputChange(e, key, data.id)
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
                <td className="px-4 py-7 min-w-[50px] text-center">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={() => {
                                if (bookId == "positions") {
                                    hasNameMatch(data.name, data.id);
                                } else {
                                    editElement(data.id);
                                }
                            }}
                            className="delete-button save-icon"
                            title="Изменить элемент"
                        ></button>

                        {bookId !== "report-types" && (
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
                                className="delete-button delete-icon"
                                title="Удалить элемент"
                                id={data.id}
                                disabled={
                                    data.projects_count > 0 ||
                                    data.employee_count > 0
                                }
                            ></button>
                        )}
                    </div>
                </td>
            )}
        </tr>
    );
};

export default ReferenceItem;
