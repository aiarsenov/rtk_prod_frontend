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
        <ul className="reports__list">
            {!isDataLoaded && <Loader />}

            {reports.map((report, index) => (
                <ProjectReportItem
                    key={report.id || index}
                    {...report}
                    deleteReport={deleteReport}
                    openReportEditor={openReportEditor}
                    mode={mode}
                />
            ))}
        </ul>
    );
};

export default ProjectReportsList;
