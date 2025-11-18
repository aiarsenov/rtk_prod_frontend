import FunnelMetrics from "./FunnelMetrics";
import FunnelProjectItem from "./FunnelProjectItem";

interface FunnelMetrics {
    request_received: { label: string; value: number | string };
    proposal_sent: { label: string; value: number | string };
    agreement: { label: string; value: number | string };
    rejected: { label: string; value: number | string };
    postponed: { label: string; value: number | string };
}

const IndicatorsSales = ({
    funnelMetrics,
}: {
    funnelMetrics: {
        metrics: FunnelMetrics;
        sales_funnel_projects_with_stage_changes: [];
    };
}) => {
    return (
        <div className="dashboards__block indicators__funnel-metrics">
            <h2 className="card__subtitle">Продажи</h2>

            <FunnelMetrics funnelMetrics={funnelMetrics.metrics} />

            <div className="reports__list-header">
                <span>Проект</span>
                <span>Источник</span>
                <span>Стоимость</span>
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

export default IndicatorsSales;
