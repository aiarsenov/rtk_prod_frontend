import CountUp from "react-countup";
import Hint from "../../Hint/Hint";

import getColorBySign from "../../../utils/getColorBySign";

const FinancialMetrics = ({ financialMetrics }) => {
    return (
        <div className="statistics-block__content indicators__financial-metrics-statistics">
            {/* <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    Выручка
                    <Hint message={"Выручка"} />
                </div>
                <div className="statistics-block__item-value">
                    {financialMetrics.revenue?.value !== "0" ? (
                        <div>
                            <strong>
                                <CountUp
                                    end={financialMetrics.revenue?.value || 0}
                                    duration={1}
                                    separator=" "
                                />
                            </strong>
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div> */}

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Выручка
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={
                        financialMetrics.revenue?.value +
                        " " +
                        financialMetrics.revenue?.label
                    }
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (
                                    financialMetrics.revenue?.value || "0"
                                ).replace(",", ".")
                            )}
                            duration={1}
                            separator=" "
                            decimals={2}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.revenue?.label}
                    </small>
                </div>

                {financialMetrics.revenue &&
                    financialMetrics.revenue?.change_percent != "" && (
                        <div
                            className={`flex gap-1 ${getColorBySign(
                                financialMetrics.revenue?.change_percent.toString(),
                                "text-green-400",
                                "text-red-400"
                            )}`}
                        >
                            {`${financialMetrics.revenue?.change_percent}%`}
                        </div>
                    )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    Поступления
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={
                        financialMetrics.receipts?.value +
                        " " +
                        financialMetrics.receipts?.label
                    }
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (
                                    financialMetrics.receipts?.value || "0"
                                ).replace(",", ".")
                            )}
                            duration={1}
                            separator=" "
                            decimals={2}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.receipts?.label}
                    </small>
                </div>

                {financialMetrics.receipts &&
                    financialMetrics.receipts?.change_percent != "" && (
                        <div
                            className={`flex gap-1 ${getColorBySign(
                                financialMetrics.receipts?.change_percent.toString(),
                                "text-green-400",
                                "text-red-400"
                            )}`}
                        >
                            {`${financialMetrics.receipts?.change_percent}%`}
                        </div>
                    )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                    ДЗ
                    <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                        ?
                    </span>
                </div>
                <div
                    className="flex items-center flex-grow gap-2"
                    title={
                        financialMetrics.debts?.value +
                        " " +
                        financialMetrics.debts?.label
                    }
                >
                    <strong className="font-normal text-3xl max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                        <CountUp
                            end={parseFloat(
                                (financialMetrics.debts?.value || "0").replace(
                                    ",",
                                    "."
                                )
                            )}
                            duration={1}
                            separator=" "
                            decimals={2}
                            decimal=","
                        />
                    </strong>
                    <small className="text-sm">
                        {financialMetrics.debts?.label}
                    </small>
                </div>

                {financialMetrics.debts &&
                    financialMetrics.debts?.change_percent != "" && (
                        <div
                            className={`flex gap-1 ${getColorBySign(
                                financialMetrics.debts?.change_percent.toString(),
                                "text-red-400",
                                "text-green-400"
                            )}`}
                        >
                            {`${financialMetrics.debts?.change_percent}%`}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default FinancialMetrics;
