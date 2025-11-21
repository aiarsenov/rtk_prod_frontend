import { useState, useEffect } from "react";

import getData from "../../../utils/getData";

import CompletedReportItem from "./CompletedReportItem";
import ReportWindow from "../../ReportWindow/ReportWindow";
import Hint from "../../Hint/Hint";

const CompletedReportsList = ({
    completedReports,
}: {
    completedReports: { items: [] };
}) => {
    const [activeReportId, setActiveReportId] = useState<number | null>(null);
    const [reportWindowsState, setReportWindowsState] = useState(false);

    const [contracts, setContracts] = useState([]);
    const [reportId, setReportId] = useState(null);
    const [reportName, setReportName] = useState(null);

    // Получение договоров для детального отчёта
    const getContracts = (contragentId) => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }contragents/${contragentId}/contracts`
        ).then((response) => {
            if (response?.status == 200) {
                setContracts(response.data);
            }
        });
    };

    // Открытие редактора отчёта
    const openReportEditor = (reportData) => {
        getContracts(reportData.contragent?.id);
        setReportId(reportData.id);
        setReportName(reportData.report_name);
        setActiveReportId(reportData.id);

        if (reportData.id && reportName != "") {
            setReportWindowsState(true);
        }
    };

    // Сброс активного отчета при закрытии панели
    useEffect(() => {
        if (!reportWindowsState) {
            setActiveReportId(null);
        }
    }, [reportWindowsState]);

    return (
        <div className="dashboards__block indicators__completed-reports">
            <h2 className="card__subtitle">
                Завершённые отчёты
                <span>{completedReports.items?.length || 0}</span>
                <Hint message={"Завершённые отчёты"} />
            </h2>

            <div className="reports__list-header">
                <span>Проект</span>
                <span>Отчёт</span>
                <span>Период выполнения</span>
            </div>

            <ul className="reports__list">
                {completedReports.items?.length > 0 &&
                    completedReports.items.map((report) => (
                        <CompletedReportItem
                            key={report.id}
                            {...report}
                            openReportEditor={openReportEditor}
                            activeReportId={activeReportId}
                        />
                    ))}
            </ul>

            <ReportWindow
                reportName={reportName}
                reportWindowsState={reportWindowsState}
                setReportWindowsState={setReportWindowsState}
                contracts={contracts}
                reportId={reportId}
                setReportId={setReportId}
                mode={"read"}
            />
        </div>
    );
};

export default CompletedReportsList;
