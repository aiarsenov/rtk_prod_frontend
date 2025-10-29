import { useState } from "react";

import getData from "../../../utils/getData";

import CompletedReportItem from "./CompletedReportItem";
import ReportWindow from "../../ReportWindow/ReportWindow";

const CompletedReportsList = ({ completedReports }) => {
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

        if (reportData.id && reportName != "") {
            setReportWindowsState(true);
        }
    };

    return (
        <div className="dashboards__block">
            <h2 className="subtitle">
                Завершённые отчёты
                <span>{completedReports.items?.length || 0}</span>
            </h2>

            <div className="p-2">
                <div className="grid items-center grid-cols-[30%_34%_34%] justify-between gap-3 pb-2 text-gray-400 border-b border-gray-300">
                    <span>Проект</span>
                    <span>Отчёт</span>
                    <span>Период. выполн.</span>
                </div>

                <ul className="min-h-[270px] max-h-[270px] overflow-x-hidden overflow-y-auto py-3 flex flex-col gap-3">
                    {completedReports.items?.length > 0 &&
                        completedReports.items.map((report) => (
                            <CompletedReportItem
                                key={report.id}
                                {...report}
                                openReportEditor={openReportEditor}
                            />
                        ))}
                </ul>
            </div>

            {reportWindowsState && (
                <div
                    className="fixed w-[100vw] h-[100vh] inset-0 z-2"
                    onClick={() => {
                        setReportWindowsState(false);
                        setReportId(null);
                    }}
                >
                    <div
                        className="w-full max-w-[500px] bg-white border-2 border-gray-300 overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%] p-3"
                        style={{ minHeight: "calc(100vh - 10%)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ReportWindow
                            reportName={reportName}
                            reportWindowsState={setReportWindowsState}
                            contracts={contracts}
                            reportId={reportId}
                            setReportId={setReportId}
                            mode={"read"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletedReportsList;
