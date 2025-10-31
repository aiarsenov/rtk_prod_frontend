const ProjectReportItem = ({
    id,
    report_period_code,
    status,
    report_period,
    days,
    execution_period,
    openReportEditor,
    deleteReport,
    mode,
}) => {
    let statusClass;

    if (
        status?.toLowerCase() === "завершен" ||
        status?.toLowerCase() === "утвержден" ||
        status?.toLowerCase() === "завершён" ||
        status?.toLowerCase() === "утверждён"
    ) {
        statusClass = "reports__list-item__status_completed completed";
    } else if (
        status?.toLowerCase() === "в процессе" ||
        status?.toLowerCase() === "запланирован" ||
        status?.toLowerCase() === "в работе"
    ) {
        statusClass = "reports__list-item__status_active active";
    }

    return (
        <li
            className="reports__list-item"
            onClick={() => {
                openReportEditor(id);
            }}
        >
            <div className="reports__list-item__col">
                <div>{report_period_code}</div>
                <span>{report_period}</span>
            </div>

            <div className="reports__list-item__col">
                <div>{days}</div>
                <span>{execution_period}</span>
            </div>

            <div className={`reports__list-item__status status ${statusClass}`}>
                {status}
            </div>

            {mode === "edit" && (
                <button
                    className="delete-button"
                    title="Удалить отчёт"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteReport(id);
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
        </li>
    );
};

export default ProjectReportItem;
