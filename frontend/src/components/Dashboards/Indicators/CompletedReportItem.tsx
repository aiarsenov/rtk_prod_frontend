import Hint from "../../Hint/Hint";

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
    note,
    execution_period,
    report_period,
    openReportEditor,
    activeReportId,
}: {
    project: Project;
    id: number;
    report_period_code: string;
    days: string;
    note: string;
    execution_period: string;
    report_period: string;
    openReportEditor: (args: {
        id: number | string;
        contragent: string;
        report_name: string;
    }) => void;
    activeReportId?: number | null;
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
            <div
                className={`reports__list-item__col ${
                    activeReportId === id ? "active" : ""
                }`}
            >
                <div>{project.name}</div>
                <span>{project.industries[0]}</span>
            </div>

            <div className="reports__list-item__col">
                <div className="flex items-start gap-1">
                    {report_period_code}

                    {note && (
                        <Hint type="alert" position="right" message={note} />
                    )}
                </div>
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
