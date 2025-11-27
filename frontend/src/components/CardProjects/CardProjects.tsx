import handleStatus from "../../utils/handleStatus";

import "./CardProjects.scss";

const CardProjects = ({
    projects,
    setActiveProject,
    activeProject,
    getProjectReports,
    getProjectContact,
    withLink = false,
}: {
    projects: object[];
    setActiveProject: React.Dispatch<React.SetStateAction<number>>;
    activeProject: number;
    getProjectReports: () => void;
    getProjectContact: () => void;
    withLink: boolean;
}) => {
    return (
        <ul className="card-projects">
            {projects &&
                projects.length > 0 &&
                projects.map((item) => {
                    let statusClass;

                    if (item.status === "completed") {
                        statusClass = "registry-table__item-status_active";
                    } else if (item.status === "active") {
                        statusClass = "registry-table__item-status_completed";
                    } else if (item.status === "undefined") {
                        statusClass = "registry-table__item-status_canceled";
                    }

                    return (
                        <li
                            className={`card-projects__item ${
                                activeProject === item.id ? "active" : ""
                            }`}
                            key={item.id}
                            onClick={() => {
                                getProjectReports(item.id);
                                setActiveProject(item.id);

                                if (typeof getProjectContact === "function") {
                                    getProjectContact(item.id);
                                }
                            }}
                        >
                            <div className="card-projects__item-name">
                                <strong>{item.name}</strong>
                                <span>{item.industries[0]?.name}</span>
                            </div>

                            <div className="card-projects__item-budget">
                                {item.project_budget ? (
                                    <>
                                        <strong>{item.project_budget}</strong>
                                        <span>млрд руб.</span>
                                    </>
                                ) : (
                                    "—"
                                )}
                            </div>

                            <div className="card-projects__item-progress">
                                {item.implementation_period ? (
                                    <>
                                        <div className="flex items-center gap-[5px]">
                                            <div className="card-projects__item-progress-line-wrapper">
                                                <div
                                                    className="card-projects__item-progress-line"
                                                    style={{
                                                        width: `${item.implementation_period}%`,
                                                    }}
                                                ></div>
                                            </div>

                                            <div className="card-projects__item-progress-percent">
                                                {item.implementation_period}%
                                            </div>
                                        </div>

                                        <span className="card-projects__item-progress-period">
                                            {item.implementation_period_string}
                                        </span>
                                    </>
                                ) : (
                                    "—"
                                )}
                            </div>

                            <div className="card-projects__item-status">
                                <div
                                    className={`registry-table__item-status ${statusClass}`}
                                >
                                    {handleStatus(item.status)}
                                </div>

                                {withLink && (
                                    <a
                                        href={`${import.meta.env.VITE_BASE_URL || ""}projects/${item.id}`}
                                        className="card-projects__item-link"
                                        aria-label={`Перейти в карточку проекта ${item.name}`}
                                    >
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M8.23 3H3.937V2h5.5a.5.5 0 01.5.5V8h-1V3.707L2.791 9.854l-.707-.708L8.23 3z"
                                                fill="#0BA5EC"
                                            />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </li>
                    );
                })}
        </ul>
    );
};

export default CardProjects;
