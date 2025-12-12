import { useState, useEffect } from "react";

import getData from "../../utils/getData";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";
import { useWindowWidth } from "../../hooks/useWindowWidth.js";

import ManagementReportListItem from "./ManagementReportListItem";
import ReportRateEditor from "../ReportRateEditor/ReportRateEditor";
import Loader from "../Loader";

import "./ManagementReports.scss";

const URL = `${import.meta.env.VITE_API_URL}projects`;

const ManagementReportsTab = ({
    showFullName,
    projectId,
    setManagementReports,
    activeWindow,
    setActiveWindow,
    mode,
}: {
    showFullName: boolean;
    projectId: number;
    setManagementReports: React.Dispatch<React.SetStateAction<object[]>>;
    activeWindow: string;
    setActiveWindow: React.Dispatch<React.SetStateAction<string>>;
    mode: string;
}) => {
    const [list, setList] = useState([]);
    const [rateEditorState, setRateEditorState] = useState(false); // Редактор оценки отчёта
    const [reportData, setReportData] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);

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

    const getList = () => {
        setIsDataLoaded(false);

        getData(`${URL}/${projectId}/manager-reports`).then((response) => {
            if (response.status == 200) {
                setList(response.data);
                setManagementReports(response.data);
                setIsDataLoaded(true);
            }
        });
    };

    useEffect(() => {
        getList();
    }, []);

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
            {!isDataLoaded ? (
                <Loader />
            ) : (
                <>
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
                        {list.length > 0 &&
                            list.map((item) => (
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
                </>
            )}
        </div>
    );
};

export default ManagementReportsTab;
