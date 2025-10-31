import getColorBySign from "../../utils/getColorBySign";

const ProjectBudget = ({ projectData }) => {
    return (
        <div
            className={`project-budget__block ${
                projectData?.project_budget !== null && "active"
            }`}
        >
            <div className="project-budget__block-main">
                <div className="flex items-end gap-[8px]">
                    {projectData?.project_budget !== null && (
                        <>
                            <strong className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {projectData.project_budget}
                            </strong>
                            <span>млрд руб.</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-[10px]">
                    {projectData?.base_budget_for_difference !== null && (
                        <span>
                            {projectData.base_budget_for_difference} млрд
                        </span>
                    )}

                    {projectData.budget_difference_percentage !== null && (
                        <div
                            className={`project-budget__block-percentage ${getColorBySign(
                                projectData.budget_difference_percentage,
                                "plus",
                                "minus"
                            )}`}
                        >
                            {projectData.budget_difference_percentage}
                        </div>
                    )}
                </div>
            </div>

            <div className="project-budget__block-title">
                <span
                    className={`${
                        projectData?.project_budget !== null && "active"
                    }`}
                >
                    бюджет проекта
                </span>
                {projectData?.project_budget == null && <b>Нет данных</b>}
            </div>
        </div>
    );
};

export default ProjectBudget;
