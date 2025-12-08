import Loader from "../Loader";
import ProjectReportItem from "./ProjectReportItem";

const ProjectReportsList = ({
    reports,
    deleteReport,
    openReportEditor,
    mode,
    isDataLoaded,
}) => {
    return (
        <>
            <div className="card-reports-list__header project-card-reports-list__header">
                <span>Отчёт</span>
                <span>Период вып.</span>
                <span>Статус</span>
            </div>

            <ul className="reports__list">
                {!isDataLoaded && <Loader />}

                {reports.map((report) => (
                    <ProjectReportItem
                        key={report.id}
                        {...report}
                        deleteReport={deleteReport}
                        openReportEditor={openReportEditor}
                        mode={mode}
                    />
                ))}
            </ul>
        </>
    );
};

export default ProjectReportsList;
