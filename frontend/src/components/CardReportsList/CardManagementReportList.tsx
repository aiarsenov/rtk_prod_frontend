import { useState } from "react";

import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";

import ReportRateEditor from "../ReportRateEditor/ReportRateEditor";
import RateSwitchStatic from "../RateSwitch/ReteSwitchStatic.js";
import Loader from "../Loader.js";

const CardManagementReportList = ({
    managerReports,
    isDataLoaded,
}: {
    managerReports: [];
    isDataLoaded: boolean;
}) => {
    let statusClass;

    const [rateEditorState, setRateEditorState] = useState(false); // Редактор оценки отчёта
    const [reportData, setReportData] = useState({});

    // Открытие окна редактора оценки отчета
    const openRateReportEditor = (props) => {
        setReportData(props);
        setRateEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeRateReportEditor = () => {
        setReportData({});
        setRateEditorState(false);
    };

    useBodyScrollLock(rateEditorState); // Блокируем экран при открытии редактора отчета

    return (
        <div className="relative min-h-[50px]">
            {!isDataLoaded ? (
                <Loader />
            ) : (
                <>
                    <div className="card-reports-list management-card-reports-list">
                        <div className="management-card-reports-list__header">
                            <span>Проект</span>
                            <span>Месяц</span>
                            <span>Ответственный</span>
                            <span>Статус</span>
                            <span>Оценка</span>
                        </div>

                        <ul className="reports__list">
                            {managerReports.length > 0 &&
                                managerReports.map((item) => {
                                    if (
                                        item.status?.toLowerCase() ===
                                            "завершен" ||
                                        item.status?.toLowerCase() ===
                                            "утвержден" ||
                                        item.status?.toLowerCase() ===
                                            "завершён" ||
                                        item.status?.toLowerCase() ===
                                            "утверждён"
                                    ) {
                                        statusClass =
                                            "reports__list-item__status_completed completed";
                                    } else if (
                                        item.status?.toLowerCase() ===
                                            "в процессе" ||
                                        item.status?.toLowerCase() ===
                                            "запланирован" ||
                                        item.status?.toLowerCase() ===
                                            "в работе"
                                    ) {
                                        statusClass =
                                            "reports__list-item__status_active active";
                                    }

                                    return (
                                        <li
                                            className="management-card-reports-list__item"
                                            onClick={() =>
                                                openRateReportEditor(item)
                                            }
                                        >
                                            <div className="reports__list-item__col reports__list-item__col-name">
                                                <div>{item.project_name}</div>
                                            </div>

                                            <div className="reports__list-item__col">
                                                <div> {item.report_month}</div>
                                            </div>

                                            <div className="management-reports__item__col">
                                                <div>
                                                    {
                                                        item?.physical_person
                                                            ?.name
                                                    }
                                                </div>
                                                {item?.physical_person?.roles?.map(
                                                    (item) => (
                                                        <div
                                                            className="text-sm"
                                                            key={item.id}
                                                        >
                                                            {item.name}
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            <div className="reports__list-item__col">
                                                <div
                                                    className={`reports__list-item__status status ${statusClass}`}
                                                >
                                                    {item.status}
                                                </div>
                                            </div>

                                            <div className="reports__list-item__col">
                                                <RateSwitchStatic
                                                    name={"general_assessment"}
                                                    reportRateData={item}
                                                />
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>

                    <ReportRateEditor
                        rateEditorState={rateEditorState}
                        reportData={reportData}
                        closeEditor={closeRateReportEditor}
                        mode={"read"}
                    />
                </>
            )}
        </div>
    );
};

export default CardManagementReportList;
