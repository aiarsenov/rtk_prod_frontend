import getColorBySign from "../../utils/getColorBySign";

const ProgressBlock = ({ percentage }) => {
    const progress = percentage > 100 ? 0 : percentage;

    return (
        <div className="project-budget__block-progress">
            <div
                className="project-budget__block-progress__line"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

const toNumber = (value) => {
    if (typeof value !== "string") return value;
    return Number(value.replace(/,/g, "."));
};

const ProjectImplementationPeriod = ({ projectData }) => {
    const percentage = projectData?.completion_percentage;

    return (
        <div
            className={`project-budget__block project-budget__block-implementation ${
                projectData?.implementation_period !== null && "active"
            }`}
        >
            <div className="project-budget__block-main">
                <div className="flex items-end gap-[8px]">
                    {projectData?.implementation_period > 0 && (
                        <>
                            <strong className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {projectData.implementation_period}
                            </strong>
                            <span>мес.</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-[10px]">
                    {projectData?.implementation_period > 0 && (
                        <>
                            {projectData?.base_implementation_period_for_difference >
                                0 && (
                                <span>
                                    {
                                        projectData.base_implementation_period_for_difference
                                    }{" "}
                                    мес.
                                </span>
                            )}

                            {projectData.implementation_period_difference_percentage !==
                                null && (
                                <div
                                    className={`project-budget__block-percentage ${getColorBySign(
                                        projectData.implementation_period_difference_percentage,
                                        "plus",
                                        "minus"
                                    )}`}
                                >
                                    {
                                        projectData.implementation_period_difference_percentage
                                    }
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="project-budget__block-title">
                {projectData?.implementation_period !== null ? (
                    <>
                        <span className="active">срок реализации</span>

                        {percentage !== 0 && (
                            <span className="flex items-center gap-[10px]">
                                <span>{percentage}%</span>

                                {projectData?.implementation_period_string}
                            </span>
                        )}

                        {percentage && (
                            <ProgressBlock percentage={toNumber(percentage)} />
                        )}
                    </>
                ) : (
                    <>
                        <span>срок реализации</span>
                        <b>Нет данных</b>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectImplementationPeriod;
