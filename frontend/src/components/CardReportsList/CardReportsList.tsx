import { useState, useEffect, useRef } from "react";

import "./CardReportsList.scss";

import Hint from "../Hint/Hint";
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

    const ref = useRef<HTMLUListElement>(null);
    const [hasScroll, setHasScroll] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const checkScroll = () => {
            setHasScroll(el.scrollHeight > el.clientHeight);
        };

        checkScroll();

        const resizeObserver = new ResizeObserver(checkScroll);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, []);

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

            <ul
                className={`reports__list ${hasScroll ? "list--scroll" : ""}`}
                ref={ref}
            >
                {reports &&
                    reports.length > 0 &&
                    reports.map((item) => {
                        if (
                            item.status &&
                            (item.status?.toLowerCase() === "завершен" ||
                                item.status?.toLowerCase() === "утвержден" ||
                                item.status?.toLowerCase() === "завершён" ||
                                item.status?.toLowerCase() === "утверждён")
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
                            statusClass = "";
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
                                <div className="reports__list-item__col">
                                    <div className="reports__list-item__col-name">
                                        {item.project_name}
                                    </div>

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
                                    <div className="flex items-start gap-1">
                                        <div className="text-lg whitespace-nowrap">
                                            {item.report_period_code}
                                        </div>

                                        {item.note && (
                                            <Hint
                                                type="alert"
                                                position="right"
                                                message={item.note}
                                            />
                                        )}
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
