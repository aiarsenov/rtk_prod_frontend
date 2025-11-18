interface Project {
    name: string;
    contragent: string;
    industries: [];
}

const CompletedReportItem = ({
    project,
    id,
    report_period_code,
    days,
    execution_period,
    report_period,
    openReportEditor,
}: {
    project: Project;
    id: number;
    report_period_code: string;
    days: string;
    execution_period: string;
    report_period: string;
    openReportEditor: (args: {
        id: number | string;
        contragent: string;
        report_name: string;
    }) => void;
}) => {
    return (
        <li
            className="reports__list-item"
            onClick={() => {
                openReportEditor({
                    id,
                    contragent: project.contragent,
                    report_name: `${project.name} / ${report_period_code}`,
                });
            }}
            title={`Открыть отчёт ${report_period_code}`}
        >
            <div className="reports__list-item__col">
                <div>{project.name}</div>
                <span>{project.industries[0]}</span>
            </div>

            <div className="reports__list-item__col">
                <div>{report_period_code}</div>
                <span>{report_period}</span>
            </div>

            <div className="reports__list-item__col">
                <div>{days}</div>
                <span>{execution_period}</span>
            </div>
        </li>
    );
};

export default CompletedReportItem;
