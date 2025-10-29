import CountUp from "react-countup";
import Hint from "../../Hint/Hint";

{
    /* <div className="statistics-block__content">
    <div className="statistics-block__item">
        <div className="statistics-block__item-label">
            Выручка
            <Hint message={"Выручка"} />
        </div>
        <div
            className="statistics-block__item-value"
            title={revenue.revenue?.value + " " + revenue.revenue?.label}
        >
            {revenue.revenue?.value !== "0" ? (
                <div>
                    <strong>
                        <CountUp
                            end={parseFloat(
                                revenue.revenue?.value?.replace(",", ".") || "0"
                            )}
                            duration={1}
                            separator=" "
                            decimals={2}
                        />
                    </strong>
                    <small>{revenue.revenue?.label}</small>
                </div>
            ) : (
                <b>Нет данных</b>
            )}
        </div>
    </div>
</div>; */
}

const FunnelMetrics = ({ funnelMetrics }) => {
    return (
        <div className="statistics-block__content indicators__funnel-metrics-statistics">
            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    {funnelMetrics?.request_received?.label}
                    <Hint message={funnelMetrics?.request_received?.label} />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.request_received?.value !== "0" ? (
                        <div>
                            <strong>
                                <CountUp
                                    end={
                                        funnelMetrics?.request_received
                                            ?.value || 0
                                    }
                                    duration={1}
                                    separator=" "
                                />
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
                    <Hint message={funnelMetrics?.proposal_sent?.label} />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.proposal_sent?.value !== "0" ? (
                        <div>
                            <strong>
                                <CountUp
                                    end={
                                        funnelMetrics?.proposal_sent?.value || 0
                                    }
                                    duration={1}
                                    separator=" "
                                />
                            </strong>
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>

            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    {funnelMetrics?.agreement?.label}
                    <Hint message={funnelMetrics?.agreement?.label} />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.agreement?.value !== "0" ? (
                        <div>
                            <strong>
                                <CountUp
                                    end={funnelMetrics?.agreement?.value || 0}
                                    duration={1}
                                    separator=" "
                                />
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
                    <Hint message={funnelMetrics?.rejected?.label} />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.rejected?.value !== "0" ? (
                        <div>
                            <strong>
                                <CountUp
                                    end={funnelMetrics?.rejected?.value || 0}
                                    duration={1}
                                    separator=" "
                                />
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
                    <Hint message={funnelMetrics?.postponed?.label} />
                </div>
                <div className="statistics-block__item-value">
                    {funnelMetrics?.postponed?.value !== "0" ? (
                        <div>
                            <strong>
                                <CountUp
                                    end={funnelMetrics?.postponed?.value || 0}
                                    duration={1}
                                    separator=" "
                                />
                            </strong>
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>

            {/* <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    {funnelMetrics?.request_received?.label}
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div className="flex items-center flex-grow gap-2">
                    <strong
                        className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={funnelMetrics?.request_received?.value}
                    >
                        <CountUp
                            end={funnelMetrics?.request_received?.value || 0}
                            duration={1}
                            separator=" "
                        />
                    </strong>
                </div>
            </div> */}

            {/* <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    {funnelMetrics?.proposal_sent?.label}
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div className="flex items-center flex-grow gap-2">
                    <strong
                        className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={funnelMetrics?.proposal_sent?.value}
                    >
                        <CountUp
                            end={funnelMetrics?.proposal_sent?.value || 0}
                            duration={1}
                            separator=" "
                        />
                    </strong>
                </div>
            </div> */}

            {/* <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    {funnelMetrics?.agreement?.label}
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div className="flex items-center flex-grow gap-2">
                    <strong
                        className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={funnelMetrics?.agreement?.value}
                    >
                        <CountUp
                            end={funnelMetrics?.agreement?.value || 0}
                            duration={1}
                            separator=" "
                        />
                    </strong>
                </div>
            </div> */}

            {/* <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    {funnelMetrics?.rejected?.label}
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div className="flex items-center flex-grow gap-2">
                    <strong
                        className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={funnelMetrics?.rejected?.value}
                    >
                        <CountUp
                            end={funnelMetrics?.rejected?.value || 0}
                            duration={1}
                            separator=" "
                        />
                    </strong>
                </div>
            </div> */}

            {/* <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    {funnelMetrics?.postponed?.label}
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div className="flex items-center flex-grow gap-2">
                    <strong
                        className="font-normal text-4xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={funnelMetrics?.postponed?.value}
                    >
                        <CountUp
                            end={funnelMetrics?.postponed?.value || 0}
                            duration={1}
                            separator=" "
                        />
                    </strong>
                </div>
            </div> */}
        </div>
    );
};

export default FunnelMetrics;
