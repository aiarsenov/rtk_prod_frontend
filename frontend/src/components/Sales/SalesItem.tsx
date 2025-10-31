import { useNavigate } from "react-router-dom";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const SalesItem = ({ props, columns, deleteProject, mode }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/sales/${props.id}`, { state: { mode: "read" } });
    };

    const getNestedValue = (obj, path) => {
        return path.split(".").reduce((acc, part) => {
            return acc && acc[part];
        }, obj);
    };

    return (
        <tr
            className="registry-table__item transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {columns.map(({ key }) => {
                const value = key.includes(".")
                    ? getNestedValue(props, key)
                    : props[key];

                let statusClass;

                if (key === "last_service_last_stage") {
                    if (value && value.toLowerCase() === "проект отложен") {
                        statusClass = "registry-table__item-status_completed";
                    } else if (
                        value &&
                        (value.toLowerCase() === "отказ от участия" ||
                            value.toLowerCase() === "получен отказ")
                    ) {
                        statusClass = "registry-table__item-status_canceled";
                    } else if (!value) {
                        statusClass = "";
                    } else {
                        statusClass = "registry-table__item-status_active";
                    }
                }

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td className="w-[130px] max-w-[130px]" key={key}>
                                <table className="w-full">
                                    <tbody>
                                        {key === "services"
                                            ? value.map((item, index) => (
                                                  <tr key={`${key}_${index}`}>
                                                      <td className="registry-table__item-last-report w-full">
                                                          {item?.name?.toString()}
                                                      </td>
                                                  </tr>
                                              ))
                                            : value.map((item, index) => (
                                                  <tr key={`${key}_${index}`}>
                                                      <td
                                                          className={`w-[100px] ${
                                                              index !==
                                                              value.length - 1
                                                                  ? "pb-1"
                                                                  : "pt-1"
                                                          }`}
                                                      >
                                                          {key === "creditors"
                                                              ? item.name
                                                              : item?.toString()}
                                                      </td>
                                                  </tr>
                                              ))}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else {
                        return (
                            <td className="w-[130px] max-w-[130px]" key={key}>
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    if (key === "contragent") {
                        return (
                            <td className="w-[130px]" key={key}>
                                <div className="hidden-group">
                                    <div className="visible-text">
                                        <div>
                                            {value?.program_name.toString() ||
                                                "—"}
                                        </div>
                                    </div>

                                    <div className="hidden-text">
                                        {value?.program_name.toString() || "—"}
                                    </div>
                                </div>
                            </td>
                        );
                    } else if (key === "request_source") {
                        return (
                            <td className="w-[130px]" key={key}>
                                {value?.name?.toString() || "—"}
                            </td>
                        );
                    } else {
                        return Object.entries(value).map(
                            ([subKey, subValue]) => (
                                <td className="w-[130px]" key={subKey}>
                                    {subValue?.toString() || "—"}
                                </td>
                            )
                        );
                    }
                } else {
                    if (key === "name") {
                        return (
                            <td className="w-[130px]" key={key}>
                                <div className="hidden-group">
                                    <div className="visible-text">
                                        <div>{value?.toString() || "—"}</div>
                                    </div>

                                    <div className="hidden-text">
                                        {value?.toString() || "—"}
                                    </div>
                                </div>

                                <span className="text-gray-400 text-sm">
                                    {props?.industry?.name}
                                </span>
                            </td>
                        );
                    } else if (key === "last_service_last_stage") {
                        return (
                            <td className="w-[110px]" key={key}>
                                <div
                                    className={`max-w-[125px] registry-table__item-status ${statusClass}`}
                                    style={{
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {value?.toString() || "—"}
                                </div>
                            </td>
                        );
                    } else if (
                        (key === "request_date" || key === "status_date") &&
                        value !== null
                    ) {
                        return (
                            <td className="w-[130px]" key={key}>
                                {format(parseISO(value), "dd.MM.yyyy", {
                                    locale: ru,
                                }) || "—"}
                            </td>
                        );
                    } else {
                        return (
                            <td className="w-[130px]" key={key}>
                                {value?.toString() || "—"}
                            </td>
                        );
                    }
                }
            })}

            <td className="w-[24px] h-[20px]">
                {mode === "edit" && (
                    <button
                        className="delete-button"
                        title="Удалить проект"
                        onClick={(e) => {
                            deleteProject(props.id);
                            e.stopPropagation();
                        }}
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
            </td>
        </tr>
    );
};

export default SalesItem;
