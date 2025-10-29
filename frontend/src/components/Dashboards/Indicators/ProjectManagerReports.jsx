import { useState } from "react";

import handleStatusString from "../../../utils/handleStatusString";

import ReportRateEditor from "../../ReportRateEditor/ReportRateEditor";

const ProjectManagerReports = ({ projectManagerReports }) => {
    const [rateEditorState, setRateEditorState] = useState(false);
    const [reportData, setReportData] = useState({});

    // Открытие окна редактора оценки отчета
    const openRateReportEditor = (data) => {
        let newData = data;
        newData.name = data.project;
        newData.physical_person = { name: data.responsible };

        setReportData(newData);
        setRateEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeRateReportEditor = () => {
        setReportData({});
        setRateEditorState(false);
    };

    return (
        <div className="dashboards__block">
            <h2 className="card__subtitle">
                Отчёты руководителей проектов
                <span>
                    {projectManagerReports.length > 0 &&
                        projectManagerReports.length}
                </span>
            </h2>

            <div className="p-2">
                <div className="grid items-center grid-cols-[1fr_75px_185px_100px_85px] justify-between gap-3 pb-2 text-gray-400 border-b border-gray-300">
                    <span>Проект</span>
                    <span>Месяц</span>
                    <span>Рук.</span>
                    <span>Статус</span>
                    <span>Оценка</span>
                </div>

                <ul className="min-h-[270px] max-h-[270px] overflow-x-hidden overflow-y-auto flex flex-col gap-3 py-3">
                    {projectManagerReports.length > 0 &&
                        projectManagerReports.map((item) => (
                            <li
                                className="grid grid-cols-[1fr_75px_180px_100px_85px] gap-3 items-start cursor-pointer"
                                key={item.id}
                                onClick={() => {
                                    openRateReportEditor(item);
                                }}
                            >
                                <div className="flex flex-col">
                                    <div className="text-lg">
                                        {item.project}
                                    </div>
                                    <span className="text-gray-400">
                                        {item.industry}
                                    </span>
                                </div>

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
                                    {item.responsible}
                                </div>

                                <div
                                    className={`text-lg ${handleStatusString(
                                        item.status
                                    )}`}
                                >
                                    {item.status}
                                </div>

                                <div>
                                    <div className="grid grid-cols-[12px_12px_12px] justify-around items-center gap-2 w-fit">
                                        <div
                                            className={`w-[12px] h-[12px] rounded-[50%] bg-red-400 ${
                                                item.assessment === 0
                                                    ? "opacity-100"
                                                    : "opacity-30"
                                            }`}
                                        ></div>

                                        <div
                                            className={`w-[12px] h-[12px] rounded-[50%] bg-yellow-400 ${
                                                item.assessment === 1
                                                    ? "opacity-100"
                                                    : "opacity-30"
                                            }`}
                                        ></div>

                                        <div
                                            className={`w-[12px] h-[12px] rounded-[50%] bg-green-400 ${
                                                item.assessment === 2
                                                    ? "opacity-100"
                                                    : "opacity-30"
                                            }`}
                                        ></div>
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>

            {rateEditorState && (
                <div
                    className="fixed w-[100vw] h-[100vh] inset-0 z-2"
                    onClick={() => closeRateReportEditor()}
                >
                    <div
                        className="bg-white border-1 border-gray-300 p-2 overflow-x-hidden overflow-y-auto fixed top-[5%] bottom-[5%] right-[2%] w-[35%] z-3"
                        style={{ minHeight: "calc(100vh - 10%)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ReportRateEditor
                            reportData={reportData}
                            closeEditor={closeRateReportEditor}
                            mode={"read"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectManagerReports;
