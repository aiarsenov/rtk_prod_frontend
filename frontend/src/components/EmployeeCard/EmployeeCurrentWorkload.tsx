interface ProjectInfo {
    name: string;
    main_industry: string;
}

interface ReportInfo {
    report_period_code: string;
    report_period: string;
    execution_period?: string;
}

interface EmployeeProject {
    id: number | string;
    project: ProjectInfo;
    report?: ReportInfo;
    role: string;
    completion_percentage?: number;
}

const EmployeeCurrentWorkload = ({
    projects,
}: {
    projects: EmployeeProject[];
}) => {
    return (
        <ul className="card-projects employee-card-projects">
            {projects &&
                projects.length > 0 &&
                projects.map((item, index) => {
                    return (
                        <li
                            className="card-projects__item"
                            key={`${item.id}_${index}`}
                        >
                            <div className="card-projects__item-name">
                                <strong>{item?.project?.name}</strong>
                                <span>{item?.project?.main_industry}</span>
                            </div>

                            <div className="card-projects__item-col employee-projects__item-period">
                                <strong>
                                    {item?.report?.report_period_code}
                                </strong>
                                <span>{item?.report?.report_period}</span>
                            </div>

                            <div className="card-projects__item-col employee-projects__item-role">
                                <strong>{item?.role}</strong>
                            </div>

                            <div className="card-projects__item-progress">
                                {item.completion_percentage ? (
                                    <>
                                        <div className="flex items-center gap-[5px]">
                                            <div className="card-projects__item-progress-line-wrapper">
                                                <div
                                                    className="card-projects__item-progress-line"
                                                    style={{
                                                        width: `${item.completion_percentage}%`,
                                                    }}
                                                ></div>
                                            </div>

                                            <div className="card-projects__item-progress-percent">
                                                {item.completion_percentage}%
                                            </div>
                                        </div>

                                        <span className="card-projects__item-progress-period">
                                            {item?.report?.execution_period}
                                        </span>
                                    </>
                                ) : (
                                    "—"
                                )}
                            </div>
                        </li>
                    );
                })}
        </ul>
    );
};

export default EmployeeCurrentWorkload;
