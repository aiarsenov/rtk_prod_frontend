import { useState, useEffect, useRef } from "react";

import Loader from "../Loader";
import ProjectReportItem from "./ProjectReportItem";

const ProjectReportsList = ({
    reports,
    deleteReport,
    openReportEditor,
    mode,
    isDataLoaded,
}) => {
    const ref = useRef<HTMLUListElement>(null);
    const [hasScroll, setHasScroll] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const checkScroll = () => {
            setHasScroll(el.scrollHeight > el.clientHeight);
        };

        checkScroll();

        const resizeObserver = new ResizeObserver(checkScroll);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <>
            <div className="card-reports-list__header project-card-reports-list__header">
                <span>Отчёт</span>
                <span>Период вып.</span>
                <span>Статус</span>
            </div>

            <ul
                className={`reports__list ${hasScroll ? "list--scroll" : ""}`}
                ref={ref}
            >
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
