import { useState, useEffect } from "react";

import buildQueryParams from "../../../utils/buildQueryParams";
import getData from "../../../utils/getData";
import handleStatusString from "../../../utils/handleStatusString";

import ManagementReportEditor from "../../Reports/ManagementReportEditor";

const ManagerReports = ({ selectedFilters }) => {
    const [reportsList, setReportsList] = useState({});
    const [managementEditorState, setManagementEditorState] = useState(false); // Редактор отчёта менеджмента
    const [managementReportData, setManagementReportData] = useState({
        name: "",
        physical_person_id: 1,
        report_month: "",
        status_summary: "",
        problems: "",
        prospects: "",
        team: "",
        legal_issues: "",
        misc: "",
    });
    
    const getManagementReportsDashboard = () => {
        const queryString = buildQueryParams(selectedFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/management-reports-dashboard?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setReportsList(response.data.reports);
            }
        });
    };

    // Открытие окна редактора отчета менеджмента
    const openManagementReportEditor = (props) => {
        setManagementReportData(props);
        setManagementEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeManagementReportEditor = () => {
        setManagementReportData({});
        setManagementEditorState(false);
    };

    useEffect(() => {
        if (Object.keys(selectedFilters).length > 0) {
            getManagementReportsDashboard();
        }
    }, [selectedFilters]);

    return (
        <div className="dashboards__block indicators__manager-reports">
            <h2 className="card__subtitle">
                Отчёты менеджмента
                <span>{reportsList.length > 0 && reportsList.length}</span>
            </h2>

            <div className="reports__list-header">
                <span>Отчёт</span>
                <span>Месяц</span>
                <span>Ответственный</span>
                <span>Статус</span>
            </div>

            <ul className="reports__list">
                {reportsList.length > 0 &&
                    reportsList.map((item) => (
                        <li
                            className="reports__list-item"
                            key={item.id}
                            onClick={() => {
                                openManagementReportEditor(item);
                            }}
                        >
                            <div
                                className="reports__list-item__col overflow-hidden text-ellipsis"
                                style={{
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    display: "-webkit-box",
                                }}
                            >
                                {item.name}
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
                                {item.physical_person}
                            </div>

                            <div
                                className={`reports__list-item__col status ${handleStatusString(
                                    item.status
                                )}`}
                            >
                                {item.status}
                            </div>
                        </li>
                    ))}
            </ul>

            <ManagementReportEditor
                editorState={managementEditorState}
                managementReportData={managementReportData}
                setManagementReportData={setManagementReportData}
                closeEditor={closeManagementReportEditor}
                mode={"read"}
            />
        </div>
    );
};

export default ManagerReports;
