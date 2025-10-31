import { useNavigate } from "react-router-dom";

import handleStatus from "../../utils/handleStatus";

const ProjectItem = ({ props, columns, mode, deleteProject }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/projects/${props.id}`, { state: { mode: "read" } });
    };

    return (
        <tr
            className="registry-table__item transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                let statusClass;

                if (key === "status") {
                    if (value === "completed") {
                        statusClass = "registry-table__item-status_completed";
                    } else if (value === "active") {
                        statusClass = "registry-table__item-status_active";
                    }
                }

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td className="w-[130px] max-w-[130px]" key={key}>
                                <table className="w-full">
                                    <tbody>
                                        {key === "latest_reports" ? (
                                            <tr>
                                                <td className="registry-table__item-last-report w-full">
                                                    {value?.map(
                                                        (item, index) => (
                                                            <div
                                                                className={`${
                                                                    item.status
                                                                        ?.name ===
                                                                    "Завершен"
                                                                        ? "completed"
                                                                        : ""
                                                                }`}
                                                                key={index}
                                                            >
                                                                {
                                                                    item.report_period_code
                                                                }
                                                            </div>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            value?.map((item, index) => (
                                                <tr key={`${key}_${index}`}>
                                                    <td
                                                        className={`w-[100px] ${
                                                            index !==
                                                            value?.length - 1
                                                                ? "pb-1"
                                                                : "pt-1"
                                                        }`}
                                                    >
                                                        {key === "creditors"
                                                            ? item.name
                                                            : item?.toString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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
                    if (key === "project_manager") {
                        return Object.entries(value).map(
                            ([subKey, subValue]) => (
                                <td
                                    className="w-[130px] text-blue"
                                    key={subKey}
                                >
                                    {subValue?.full_name?.toString() || "—"}
                                </td>
                            )
                        );
                    } else if (key === "industries") {
                        return (
                            <td className="w-[130px]" key={value?.main?.id}>
                                <div className="hidden-group">
                                    <div className="visible-text">
                                        <div>
                                            {value?.main?.name.toString() ||
                                                "—"}
                                        </div>
                                    </div>

                                    <div className="hidden-text">
                                        {value?.main?.name.toString() || "—"}
                                    </div>
                                </div>
                            </td>
                        );
                    }

                    return Object.entries(value).map(([subKey, subValue]) => (
                        <td className="w-[130px]" key={subKey}>
                            {subValue?.toString() || "—"}
                        </td>
                    ));
                } else {
                    if (key === "name") {
                        return (
                            <td className="w-[130px] text-blue" key={key}>
                                <div className="hidden-group">
                                    <div className="visible-text">
                                        <div>{value?.toString() || "—"}</div>
                                    </div>

                                    <div className="hidden-text">
                                        {value?.toString() || "—"}
                                    </div>
                                </div>
                            </td>
                        );
                    } else if (key === "project_manager") {
                        return (
                            <td className="w-[130px] text-blue" key={key}>
                                <div className="hidden-group">
                                    <div className="visible-text">
                                        <div>{value?.toString() || "—"}</div>
                                    </div>

                                    <div className="hidden-text">
                                        {value?.toString() || "—"}
                                    </div>
                                </div>
                            </td>
                        );
                    } else if (key === "status") {
                        return (
                            <td className="w-[110px]" key={key}>
                                <div
                                    className={`registry-table__item-status ${statusClass}`}
                                >
                                    {handleStatus(value?.toString()) || "—"}
                                </div>
                            </td>
                        );
                    } else if (key === "project_budget") {
                        return (
                            <td
                                className="w-[100px] registry-table__item-budget"
                                key={key}
                            >
                                <b>{value?.toString() || "—"}</b>
                                <span>
                                    {value?.toString() ? "млрд руб." : ""}
                                </span>
                            </td>
                        );
                    } else if (key === "implementation_period") {
                        return (
                            <td
                                className="w-[127px] registry-table__item-period"
                                key={key}
                            >
                                {value?.toString() ? (
                                    <>
                                        <div className="flex items-end gap-[5px]">
                                            <b className="flex items-end gap-1">
                                                {value?.toString()}
                                                <span>мес.</span>
                                            </b>

                                            {props?.completion_percentage && (
                                                <span>
                                                    {Math.round(
                                                        props?.completion_percentage
                                                    )}
                                                    %
                                                </span>
                                            )}
                                        </div>

                                        <span>
                                            до{" "}
                                            {props?.implementation_period_end}
                                        </span>
                                    </>
                                ) : (
                                    "—"
                                )}
                            </td>
                        );
                    } else {
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

export default ProjectItem;
