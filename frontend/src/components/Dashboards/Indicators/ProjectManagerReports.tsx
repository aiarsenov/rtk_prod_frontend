import { useState, useMemo } from "react";

import handleStatusString from "../../../utils/handleStatusString";

import ReportRateEditor from "../../ReportRateEditor/ReportRateEditor";
import MultiSelectWithSearch from "../../MultiSelect/MultiSelectWithSearch";
import Hint from "../../Hint/Hint";

const handleStaticStatusClass = (item) => {
    if (!item?.assessment) return;

    if (item.assessment === 0) {
        return "rate-switch_red";
    } else if (item.assessment === 1) {
        return "rate-switch_orange";
    } else if (item.assessment === 2) {
        return "rate-switch_green";
    }
};

interface ProjectManagerReportItem {
    id: number | string;
    project: string;
    industry: string;
    report_month: string;
    responsible: string;
    status: string;
    assessment: number;
    role: object;
}

const rateOptions = [
    {
        label: (
            <span className="flex items-center gap-[5px]">
                <span
                    style={{
                        display: "block",
                        background: "var(--color-green-60)",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                    }}
                ></span>
                Проблем нет
            </span>
        ),
        value: 2,
    },
    {
        label: (
            <span className="flex items-center gap-[5px]">
                <span
                    style={{
                        display: "block",
                        background: "var(--color-orange-60)",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                    }}
                ></span>
                Есть сложности
            </span>
        ),
        value: 1,
    },
    {
        label: (
            <span className="flex items-center gap-[5px]">
                <span
                    style={{
                        display: "block",
                        background: "var(--color-red-60)",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                    }}
                ></span>
                Есть проблемы
            </span>
        ),
        value: 0,
    },
];

const ProjectManagerReports = ({
    projectManagerReports,
}: {
    projectManagerReports: ProjectManagerReportItem[];
}) => {
    const [activeReportId, setActiveReportId] = useState<
        number | string | null
    >(null);

    const [rateEditorState, setRateEditorState] = useState(false);
    const [reportData, setReportData] = useState({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedRates, setSelectedRates] = useState([]);

    // Открытие окна редактора оценки отчета
    const openRateReportEditor = (data) => {
        let newData = data;
        newData.name = data.project;
        newData.physical_person = { name: data.responsible };

        setReportData(newData);
        setActiveReportId(data.id);
        setRateEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeRateReportEditor = () => {
        setReportData({});
        setActiveReportId(null);
        setRateEditorState(false);
    };

    const filteredManagementReports = useMemo(() => {
        return projectManagerReports.filter((report) => {
            return (
                selectedRates.length === 0 ||
                selectedRates.includes(report?.assessment?.toString())
            );
        });
    }, [projectManagerReports, selectedRates]);

    return (
        <div className="dashboards__block indicators__project-manager-reports">
            <h2 className="card__subtitle">
                Отчёты ответственных
                <span>
                    {filteredManagementReports.length > 0 &&
                        filteredManagementReports.length}
                </span>
                <Hint message={"Отчёты ответственных"} />
            </h2>

            <div className="reports__list-header">
                <span>Проект</span>
                <span>Месяц</span>
                <span>Ответственный</span>
                <span>Статус</span>

                <span className="registry-table__thead-item">
                    Оценка
                    {selectedRates.length > 0 && (
                        <button
                            type="button"
                            title="Сбросить фильтр"
                            onClick={() => setSelectedRates([])}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9.06 8l3.713 3.712-1.06 1.06L8 9.06l-3.712 3.713-1.061-1.06L6.939 8 3.227 4.287l1.06-1.06L8 6.939l3.712-3.712 1.061 1.06L9.061 8z"
                                    fill="#000"
                                />
                            </svg>
                        </button>
                    )}
                    {filteredManagementReports.length > 0 && (
                        <button
                            className={`filter-button ${
                                isFilterOpen ? "active" : ""
                            }`}
                            title={`Открыть фильтр оценки`}
                            onClick={() => {
                                if (!isFilterOpen) {
                                    setIsFilterOpen(true);
                                } else {
                                    setIsFilterOpen(false);
                                }
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 5.093l4.8 3.429v6l2.4-1.286V8.522L14 5.093V2.522H2v2.571z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    )}
                    {isFilterOpen && (
                        <MultiSelectWithSearch
                            options={
                                Array.isArray(rateOptions) &&
                                rateOptions.length > 0
                                    ? rateOptions.map((opt) =>
                                          typeof opt === "string"
                                              ? {
                                                    value: opt,
                                                    label: opt,
                                                }
                                              : {
                                                    value:
                                                        opt.value ?? opt.name,
                                                    label:
                                                        opt.label ?? opt.name,
                                                }
                                      )
                                    : []
                            }
                            selectedValues={selectedRates}
                            onChange={(updated) => {
                                setSelectedRates(updated.score ?? []);
                            }}
                            filterNoSearch={true}
                            fieldName={"score"}
                            close={() => setIsFilterOpen(false)}
                        />
                    )}
                </span>
            </div>

            <ul className="reports__list">
                {filteredManagementReports.length > 0 &&
                    filteredManagementReports.map((item) => (
                        <li
                            className="reports__list-item"
                            key={item.id}
                            onClick={() => {
                                openRateReportEditor(item);
                            }}
                        >
                            <div
                                className={`reports__list-item__col ${
                                    activeReportId === item.id ? "active" : ""
                                }`}
                            >
                                <div>{item.project}</div>
                                <span>{item.industry}</span>
                            </div>

                            <div className="reports__list-item__col">
                                {item.report_month}
                            </div>

                            <div className="reports__list-item__col">
                                <div
                                    className="overflow-hidden text-ellipsis"
                                    style={{
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        display: "-webkit-box",
                                    }}
                                >
                                    {item.responsible}
                                </div>
                                <span>{item?.role?.name}</span>
                            </div>

                            <div
                                className={`reports__list-item__col status ${handleStatusString(
                                    item.status
                                )}`}
                            >
                                {item.status}
                            </div>

                            <div
                                className={`rate-switch ${handleStaticStatusClass(
                                    item
                                )}`}
                            >
                                <div className="rate-switch__button"></div>
                                <div className="rate-switch__button"></div>
                                <div className="rate-switch__button"></div>
                            </div>
                        </li>
                    ))}
            </ul>

            <ReportRateEditor
                rateEditorState={rateEditorState}
                reportData={reportData}
                closeEditor={closeRateReportEditor}
                mode={"read"}
            />
        </div>
    );
};

export default ProjectManagerReports;
