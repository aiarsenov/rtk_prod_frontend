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
        <div className="dashboards__block">
            <h2 className="card__subtitle">
                Отчёты менеджмента
                <span>{reportsList.length > 0 && reportsList.length}</span>
            </h2>

            <div className="p-2">
                <div className="grid items-center grid-cols-[1fr_100px_200px_100px] justify-between gap-3 pb-2 text-gray-400 border-b border-gray-300">
                    <span>Отчёт</span>
                    <span>Месяц</span>
                    <span>Ответственный</span>
                    <span>Статус</span>
                </div>

                <ul className="min-h-[350px] max-h-[350px] overflow-x-hidden overflow-y-auto flex flex-col gap-3 py-3">
                    {reportsList.length > 0 &&
                        reportsList.map((item) => (
                            <li
                                className="grid grid-cols-[1fr_100px_200px_100px] gap-3 items-start cursor-pointer"
                                key={item.id}
                                onClick={() => {
                                    openManagementReportEditor(item);
                                }}
                            >
                                <div className="text-lg">{item.name}</div>

                                <div className="text-lg">
                                    {item.report_month}
                                </div>

                                <div
                                    className="text-lg overflow-hidden text-ellipsis"
                                    style={{
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        display: "-webkit-box",
                                    }}
                                >
                                    {item.physical_person}
                                </div>

                                <div
                                    className={`text-lg ${handleStatusString(
                                        item.status
                                    )}`}
                                >
                                    {item.status}
                                </div>
                            </li>
                        ))}
                </ul>
            </div>

            {managementEditorState && (
                <div
                    className="fixed w-[100vw] h-[100vh] inset-0 z-2"
                    onClick={() => closeManagementReportEditor()}
                >
                    <div
                        className="bg-white overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%]"
                        style={{ minHeight: "calc(100vh - 10%)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ManagementReportEditor
                            managementReportData={managementReportData}
                            setManagementReportData={setManagementReportData}
                            closeManagementReportEditor={
                                closeManagementReportEditor
                            }
                            mode={"read"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerReports;
