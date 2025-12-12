import { useNavigate } from "react-router-dom";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import Switch from "../Switch/Switch";

const ReferenceItem = ({
    data,
    columns,
    mode = "read",
    bookId,
    handleOpenDeletePopup,
    handleOpenEditPopup,
    positions,
    setRolesAction,
    handleSwitchChange,
}) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/reference-books/${data.alias}`);
    };

    return (
        <tr
            className="registry-table__item transition text-base text-left cursor-pointer"
            {...(!bookId && { onClick: handleRowClick })}
        >
            {columns.map(({ key }) => {
                const value = data[key];

                if (Array.isArray(value) && value.length > 0) {
                    return (
                        <td className="min-w-[180px] max-w-[300px]" key={key}>
                            <table className="w-full">
                                <tbody>
                                    {Array.isArray(value) ? (
                                        value.map((item, index) => (
                                            <tr key={`${key}_${index}`}>
                                                <td className="registry-table__item-last-report w-full">
                                                    {typeof item === "object" &&
                                                        item !== null && (
                                                            <div className="flex flex-col gap-1">
                                                                {Object.entries(
                                                                    item
                                                                ).map(
                                                                    ([val]) => {
                                                                        val?.toString() ||
                                                                            "—";
                                                                    }
                                                                )}
                                                            </div>
                                                        )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="min-w-[180px] max-w-[300px]">
                                                —
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </td>
                    );
                } else {
                    return (
                        <td className="min-w-[180px] max-w-[300px]" key={key}>
                            {key === "type" || key === "position_id" ? (
                                <select name={key} value={value || ""} disabled>
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
                            ) : [
                                  "is_regular",
                                  "include_in_payroll",
                                  "show_cost",
                                  "is_project_report_responsible",
                                  "is_project_leader",
                              ].includes(key) ? (
                                <Switch
                                    value={value === true || value === "true"}
                                    label={`${key}_${data.id}`}
                                    onChange={(updated) => {
                                        if (
                                            key ===
                                            "is_project_report_responsible"
                                        ) {
                                            setRolesAction({
                                                action: updated.toString(),
                                                roleId: data.id,
                                            });
                                        } else {
                                            handleSwitchChange(
                                                updated,
                                                key,
                                                data
                                            );
                                        }
                                    }}
                                    disabled={
                                        mode === "read" ||
                                        (key === "is_project_leader" &&
                                            data.is_project_report_responsible ===
                                                false)
                                    }
                                />
                            ) : key === "updated_at" && value ? (
                                format(parseISO(value), "d MMMM yyyy, HH:mm", {
                                    locale: ru,
                                }) || "—"
                            ) : key === "updated_by" ? (
                                value?.name || "—"
                            ) : (
                                <div
                                    style={
                                        bookId === "banks"
                                            ? {}
                                            : {
                                                  whiteSpace: "nowrap",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                              }
                                    }
                                >
                                    {value?.toString() || "—"}
                                </div>
                            )}
                        </td>
                    );
                }
            })}

            {mode === "edit" && (
                <td className="max-w-[70px]">
                    <div className="registry-table__item-actions">
                        {mode === "edit" && (
                            <button
                                onClick={() => handleOpenEditPopup(data)}
                                className="edit-button"
                                title="Изменить элемент"
                            ></button>
                        )}

                        {mode === "edit" &&
                            bookId !== "report-types" &&
                            bookId != "working-hours" && (
                                <button
                                    onClick={() => {
                                        if (
                                            bookId == "departments" &&
                                            data.total_employees_count > 0
                                        ) {
                                            return;
                                        }

                                        if (data.projects_count) {
                                            if (data.projects_count < 1) {
                                                handleOpenDeletePopup({
                                                    id: data.id,
                                                });
                                            }
                                        } else {
                                            handleOpenDeletePopup({
                                                id: data.id,
                                            });
                                        }
                                    }}
                                    className="delete-button extended"
                                    title="Удалить элемент"
                                    disabled={
                                        data.projects_count > 0 ||
                                        data.employee_count > 0 ||
                                        data.total_employees_count > 0
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
    );
};

export default ReferenceItem;
