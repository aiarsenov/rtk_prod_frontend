import CountUp from "react-countup";

import getColorBySign from "../../../utils/getColorBySign";

const GrossMetrics = ({ financialMetrics }) => {
    return (
        <div className="grid items-stretch grid-cols-3 gap-3 mb-5 h-[90px]">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Валовая прибыль
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={`${financialMetrics.gross_profit?.value} ${financialMetrics.gross_profit?.label}`}
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (
                                    financialMetrics.gross_profit?.value || "0"
                                ).replace(",", ".")
                            )}
                            duration={1}
                            separator=" "
                            decimals={2}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.gross_profit?.label}
                    </small>
                </div>

                {financialMetrics.gross_profit &&
                    financialMetrics.gross_profit?.change_percent != "" && (
                        <div
                            className={`flex gap-1 ${getColorBySign(
                                financialMetrics.gross_profit?.change_percent.toString(),
                                "text-green-400",
                                "text-red-400"
                            )}`}
                        >
                            {`${financialMetrics.gross_profit?.change_percent}%`}
                        </div>
                    )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Валовая рентабельность
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div className="flex items-center flex-grow gap-2">
                    <strong
                        className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={`${financialMetrics.gross_margin?.value} ${financialMetrics.gross_margin?.label}`}
                    >
                        <CountUp
                            end={financialMetrics.gross_margin?.value || "0"}
                            duration={1}
                            separator=" "
                            decimals={2}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.gross_margin?.label}
                    </small>
                </div>

                {financialMetrics.gross_margin &&
                    financialMetrics.gross_margin?.change_percent != "" && (
                        <div
                            className={`flex gap-1 ${getColorBySign(
                                financialMetrics.gross_margin?.change_percent.toString(),
                                "text-green-400",
                                "text-red-400"
                            )}`}
                        >
                            {`${financialMetrics.gross_margin?.change_percent} п.п.`}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default GrossMetrics;
