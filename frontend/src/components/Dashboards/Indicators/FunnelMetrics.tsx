import Hint from "../../Hint/Hint";

interface FunnelMetrics {
    request_received: { label: string; value: number | string };
    proposal_sent: { label: string; value: number | string };
    agreement: { label: string; value: number | string };
    rejected: { label: string; value: number | string };
    postponed: { label: string; value: number | string };
}

const FunnelMetrics = ({ funnelMetrics }: { funnelMetrics: FunnelMetrics }) => {
    return (
        <div className="statistics-block__content indicators__funnel-metrics-statistics">
            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    {funnelMetrics?.request_received?.label}
                    <Hint message="Количество запросов, полученных за отчётный период.
" />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.request_received?.value !== "0" ? (
                        <div>
                            <strong>
                                {funnelMetrics?.request_received?.value || 0}
                            </strong>
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>

            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    {funnelMetrics?.proposal_sent?.label}
                    <Hint message="Количество коммерческих предложений, отправленных за отчётный период." />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.proposal_sent?.value !== "0" ? (
                        <div>
                            <strong>
                                {funnelMetrics?.proposal_sent?.value || 0}
                            </strong>
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>

            <div className="h-[46.8px] w-[1px] bg-[#f2f4f7]"></div>

            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    {funnelMetrics?.agreement?.label}
                    <Hint message="Количество договоров, заключённых за отчётный период." />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.agreement?.value !== "0" ? (
                        <div>
                            <strong>
                                {funnelMetrics?.agreement?.value || 0}
                            </strong>
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>

            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    {funnelMetrics?.rejected?.label}
                    <Hint message="Количество отказов, полученных за отчётный период" />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.rejected?.value !== "0" ? (
                        <div>
                            <strong>
                                {funnelMetrics?.rejected?.value || 0}
                            </strong>
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>

            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    {funnelMetrics?.postponed?.label}
                    <Hint message="Количество заявок (лидов), отложенных за отчётный период." />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.postponed?.value !== "0" ? (
                        <div>
                            <strong>
                                {funnelMetrics?.postponed?.value || 0}
                            </strong>
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FunnelMetrics;
