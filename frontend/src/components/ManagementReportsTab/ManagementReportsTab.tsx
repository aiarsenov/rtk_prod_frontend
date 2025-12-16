import { useState, useEffect } from "react";

import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";
import { useWindowWidth } from "../../hooks/useWindowWidth.js";

import ManagementReportListItem from "./ManagementReportListItem";
import ReportRateEditor from "../ReportRateEditor/ReportRateEditor";

import "./ManagementReports.scss";

const ManagementReportsTab = ({
    showFullName,
    managementReports,
    activeWindow,
    setActiveWindow,
    mode,
}: {
    showFullName: boolean;
    managementReports: object[];
    activeWindow: string;
    setActiveWindow: React.Dispatch<React.SetStateAction<string>>;
    mode: string;
}) => {
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

    useBodyScrollLock(activeWindow); // Блокируем экран при открытии попапа
    useBodyScrollLock(rateEditorState); // Блокируем экран при открытии редактора отчета
    const width = useWindowWidth(); // Снимаем блокировку на десктопе

    useEffect(() => {
        if (width >= 1440) {
            setActiveWindow("");
        }
    }, [width]);

    return (
        <div className="relative min-h-[50px]">
            <div
                className="management-card-reports-list__header"
                style={{ gridTemplateColumns: "1fr 1fr 100px 60px" }}
            >
                <span>Месяц</span>
                <span>Ответственный</span>
                <span>Статус</span>
                <span>Оценка</span>
            </div>

            <ul className="reports__list management-reports__list">
                {managementReports.length > 0 &&
                    managementReports.map((item) => (
                        <ManagementReportListItem
                            openEditor={openRateReportEditor}
                            reportData={item}
                        />
                    ))}
            </ul>

            <ReportRateEditor
                showFullName={showFullName}
                rateEditorState={rateEditorState}
                reportData={reportData}
                closeEditor={closeRateReportEditor}
                mode={mode}
            />
        </div>
    );
};

export default ManagementReportsTab;
