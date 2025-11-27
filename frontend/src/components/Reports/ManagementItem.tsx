import { useNavigate } from "react-router-dom";

import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import ManagementItemRateSwitch from "./ManagementItemRateSwitch";

type Column = {
    label: string;
    key: string;
    filter?: string;
    options?: string[];
};

type ReportItemProps = {
    columns: Column[];
    props: object;
    openManagementReportEditor: () => void;
    openRateReportEditor: () => void;
    managementReportEditorHandler: () => void;
};

const ManagementItem = ({
    columns,
    props,
    openManagementReportEditor,
    openRateReportEditor,
    managementReportEditorHandler,
}: ReportItemProps) => {
    const navigate = useNavigate();

    return (
        <tr
            className={`registry-table__item transition text-base text-left cursor-pointer ${
                props?.status?.toLowerCase() == "не начат"
                    ? "opacity-[50%]"
                    : ""
            }`}
            onClick={() => {
                !props.is_management
                    ? openRateReportEditor(props)
                    : openManagementReportEditor(props);
            }}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                let statusClass;

                if (key === "status") {
                    if (
                        value.toLowerCase() === "завершен" ||
                        value.toLowerCase() === "утверждён"
                    ) {
                        statusClass = "registry-table__item-status_active";
                    } else if (
                        value.toLowerCase() === "в процессе" ||
                        value.toLowerCase() === "в работе"
                    ) {
                        statusClass = "registry-table__item-status_static";
                    }
                }

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td
                                className="min-w-[110px] max-w-[135px]"
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {value?.map((item, index) => (
                                            <tr key={`${key}_${index}`}>
                                                <td
                                                    className={`${
                                                        index !==
                                                        value?.length - 1
                                                            ? "pb-1"
                                                            : "pt-1"
                                                    }`}
                                                >
                                                    {item?.toString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else {
                        return (
                            <td
                                className="min-w-[110px] max-w-[135px]"
                                key={key}
                            >
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    if (key === "physical_person") {
                        return (
                            <td className="w-[250px]" key={key}>
                                <button
                                    type="button"
                                    className="text-left"
                                    title={`Перейти в карточку сотрудника ${
                                        value?.name?.toString() || "—"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.scrollTo(0, 0);
                                        navigate(
                                            `${
                                                import.meta.env.VITE_BASE_URL
                                            }employees/${value?.id}`
                                        );
                                    }}
                                >
                                    <div className="text-blue">
                                        {value?.name?.toString() || "—"}
                                    </div>

                                    {props?.physical_person?.roles?.map(
                                        (item) => (
                                            <div
                                                className="text-[#98A2B3]"
                                                key={item.id}
                                            >
                                                {item.name}
                                            </div>
                                        )
                                    )}
                                </button>
                            </td>
                        );
                    }
                } else {
                    return (
                        <td className="w-[110px]" key={key}>
                            {(() => {
                                if (
                                    (key === "updated_at" ||
                                        key === "created_at") &&
                                    value
                                ) {
                                    return (
                                        format(parseISO(value), "d MMMM yyyy", {
                                            locale: ru,
                                        }) || "—"
                                    );
                                } else if (
                                    key === "score" &&
                                    !props.is_management
                                ) {
                                    return (
                                        <div className="w-[80px]">
                                            <ManagementItemRateSwitch
                                                name={"general_assessment"}
                                                rateHandler={
                                                    managementReportEditorHandler
                                                }
                                                reportRateData={props}
                                            />
                                        </div>
                                    );
                                } else if (key === "status") {
                                    return (
                                        <div
                                            className={`registry-table__item-status ${statusClass}`}
                                        >
                                            {value?.toString() || "—"}
                                        </div>
                                    );
                                } else if (
                                    props.is_management &&
                                    key === "name"
                                ) {
                                    return (
                                        <div className="hidden-group min-w-[250px] max-w-[250px]">
                                            <div
                                                className="visible-text"
                                                style={{ maxWidth: "250px", color: "#000" }}
                                            >
                                                <div>
                                                    {value?.toString() || "—"}
                                                </div>
                                            </div>

                                            <div className="hidden-text">
                                                {value?.toString() || "—"}
                                            </div>
                                        </div>
                                    );
                                } else if (
                                    !props.is_management &&
                                    key === "name"
                                ) {
                                    return (
                                        <div className="flex flex-col gap-[5px]">
                                            <div className="hidden-group min-w-[250px] max-w-[250px]">
                                                <button
                                                    type="button"
                                                    className="text-left visible-text text-blue"
                                                    style={{
                                                        maxWidth: "250px",
                                                    }}
                                                    title={`Перейти в карточку проекта ${value?.toString() || "—"}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (props.project_id) {
                                                            window.scrollTo(0, 0);
                                                            navigate(
                                                                `${
                                                                    import.meta.env.VITE_BASE_URL
                                                                }projects/${props.project_id}`
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <div>
                                                        {value?.toString() ||
                                                            "—"}
                                                    </div>
                                                </button>

                                                <div className="hidden-text">
                                                    {value?.toString() || "—"}
                                                </div>
                                            </div>

                                            {props.misc?.length > 0 && (
                                                <ul className="misc-list">
                                                    {props.misc?.map(
                                                        (item, index) => (
                                                            <li
                                                                className="misc-list__item"
                                                                key={index}
                                                            >
                                                                {item}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                } else {
                                    return value?.toString() || "—";
                                }
                            })()}
                        </td>
                    );
                }
            })}
        </tr>
    );
};

export default ManagementItem;
