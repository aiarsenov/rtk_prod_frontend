import "./CardReportsList.scss";

import Loader from "../Loader";

const CardReportsList = ({
    isDataLoaded,
    reports,
    openReportEditor,
}: {
    isDataLoaded: boolean;
    reports: object[];
    openReportEditor: () => void;
}) => {
    let statusClass;

    return (
        <div className="card-reports-list">
            {!isDataLoaded && <Loader />}

            <div className="card-reports-list__header">
                <span>Проект</span>
                <span>Отчёт</span>
                <span>
                    Период <br /> выполнения
                </span>
                <span>Статус</span>
            </div>

            <ul className="reports__list">
                {reports &&
                    reports.length > 0 &&
                    reports.map((item) => {
                        if (
                            item.status?.toLowerCase() === "завершен" ||
                            item.status?.toLowerCase() === "утвержден" ||
                            item.status?.toLowerCase() === "завершён" ||
                            item.status?.toLowerCase() === "утверждён"
                        ) {
                            statusClass = "completed";
                        } else if (
                            item.status?.toLowerCase() === "в процессе" ||
                            item.status?.toLowerCase() === "в работе"
                        ) {
                            statusClass = "status_inprogress";
                        } else if (
                            item.status?.toLowerCase() === "запланирован"
                        ) {
                            return "";
                        }

                        return (
                            <li
                                key={
                                    item.id || `report-${reports.indexOf(item)}`
                                }
                                className="card-reports-list__item"
                                onClick={() => {
                                    openReportEditor(item.id);
                                }}
                            >
                                <div className="reports__list-item__col reports__list-item__col-name">
                                    <div>{item.project_name}</div>
                                    <span
                                        style={{
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            maxWidth: "150px",
                                        }}
                                    >
                                        {item.main_industry}
                                    </span>
                                </div>

                                <div className="reports__list-item__col">
                                    <div className="text-lg whitespace-nowrap">
                                        {item.report_period_code}
                                    </div>
                                    <span className="text-sm">
                                        {item.report_period}
                                    </span>
                                </div>

                                <div className="reports__list-item__col">
                                    <div className="flex flex-col flex-grow">
                                        <div className="text-lg">
                                            {item.days}
                                        </div>
                                        <span className="text-sm">
                                            {item.execution_period_code}
                                        </span>
                                    </div>
                                </div>

                                <div className="reports__list-item__col">
                                    <div
                                        className={`reports__list-item__status status ${statusClass}`}
                                    >
                                        {item.status}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default CardReportsList;
