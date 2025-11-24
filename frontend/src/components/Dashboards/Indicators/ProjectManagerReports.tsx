import { useState } from "react";

import handleStatusString from "../../../utils/handleStatusString";

import ReportRateEditor from "../../ReportRateEditor/ReportRateEditor";
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
}

const ProjectManagerReports = ({
    projectManagerReports,
}: {
    projectManagerReports: ProjectManagerReportItem[];
}) => {
    const [activeReportId, setActiveReportId] = useState<number | string | null>(null);
    const [rateEditorState, setRateEditorState] = useState(false);
    const [reportData, setReportData] = useState({});

    // Открытие окна редактора оценки отчета
    const openRateReportEditor = (data) => {
        let newData = data;
        newData.name = `"${data.project}" / ${data.report_month}`;
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

    return (
        <div className="dashboards__block indicators__project-manager-reports">
            <h2 className="card__subtitle">
                Отчёты руководителей проектов
                <span>
                    {projectManagerReports.length > 0 &&
                        projectManagerReports.length}
                </span>
                <Hint message={"Отчёты руководителей проектов"} />
            </h2>

            <div className="reports__list-header">
                <span>Проект</span>
                <span>Месяц</span>
                <span>Ответственный</span>
                <span>Статус</span>
                <span>Оценка</span>
            </div>

            <ul className="reports__list">
                {projectManagerReports.length > 0 &&
                    projectManagerReports.map((item) => (
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

                            <div
                                className="reports__list-item__col overflow-hidden text-ellipsis"
                                style={{
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    display: "-webkit-box",
                                }}
                            >
                                {item.responsible}
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
