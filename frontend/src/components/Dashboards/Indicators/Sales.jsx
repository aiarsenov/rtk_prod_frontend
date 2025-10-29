import FunnelMetrics from "./FunnelMetrics";
import FunnelProjectItem from "./FunnelProjectItem";

const Sales = ({ funnelMetrics }) => {
    return (
        <div className="dashboards__block">
            <h2 className="card__subtitle">Продажи</h2>

            <FunnelMetrics funnelMetrics={funnelMetrics.metrics} />

            <div className="reports__list-header">
                <span>Проект</span>
                <span>Источник</span>
                <span>Стоим.</span>
                <span>Статус</span>
            </div>

            <ul className="reports__list">
                {funnelMetrics.sales_funnel_projects_with_stage_changes
                    ?.length > 0 &&
                    funnelMetrics.sales_funnel_projects_with_stage_changes.map(
                        (project) => (
                            <FunnelProjectItem key={project.id} {...project} />
                        )
                    )}
            </ul>
        </div>
    );
};

export default Sales;
