import CountUp from "react-countup";
import Hint from "../../Hint/Hint";

const FinancialMetrics = ({ financialMetrics }) => {
    return (
        <div className="statistics-block__content">
            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    Выручка
                    <Hint message="Выручка" />
                </div>
                <div className="statistics-block__item-value">
                    {financialMetrics.revenue?.value ? (
                        <div className="statistics-block__item-value-block">
                            <strong>
                                <CountUp
                                    end={parseFloat(
                                        (
                                            financialMetrics.revenue?.value ||
                                            "0"
                                        ).replace(",", ".")
                                    )}
                                    duration={1}
                                    separator=" "
                                    decimals={2}
                                    decimal=","
                                />
                            </strong>

                            <small>{financialMetrics.revenue?.label}</small>

                            {typeof financialMetrics.revenue?.change_percent ===
                                "string" && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        financialMetrics.revenue
                                            ?.change_percent > 0
                                            ? "green"
                                            : financialMetrics.revenue
                                                  ?.change_percent < 0
                                            ? "red"
                                            : ""
                                    }`}
                                >
                                    {financialMetrics.revenue?.change_percent >
                                    0
                                        ? `${financialMetrics.revenue?.change_percent}%`
                                        : `${financialMetrics.revenue?.change_percent}%`}
                                </div>
                            )}
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>

            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    Поступления
                    <Hint message="Поступления" />
                </div>
                <div className="statistics-block__item-value">
                    {financialMetrics.receipts?.value ? (
                        <div className="statistics-block__item-value-block">
                            <strong>
                                <CountUp
                                    end={parseFloat(
                                        (
                                            financialMetrics.receipts?.value ||
                                            "0"
                                        ).replace(",", ".")
                                    )}
                                    duration={1}
                                    separator=" "
                                    decimals={2}
                                    decimal=","
                                />
                            </strong>

                            <small>{financialMetrics.receipts?.label}</small>

                            {typeof financialMetrics.receipts
                                ?.change_percent === "string" && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        financialMetrics.receipts
                                            ?.change_percent > 0
                                            ? "green"
                                            : financialMetrics.receipts
                                                  ?.change_percent < 0
                                            ? "red"
                                            : ""
                                    }`}
                                >
                                    {financialMetrics.receipts?.change_percent >
                                    0
                                        ? `${financialMetrics.receipts?.change_percent}%`
                                        : `${financialMetrics.receipts?.change_percent}%`}
                                </div>
                            )}
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>

            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    ДЗ
                    <Hint message="ДЗ" />
                </div>
                <div className="statistics-block__item-value">
                    {financialMetrics.debts?.value ? (
                        <div className="statistics-block__item-value-block">
                            <strong>
                                <CountUp
                                    end={parseFloat(
                                        (
                                            financialMetrics.debts?.value || "0"
                                        ).replace(",", ".")
                                    )}
                                    duration={1}
                                    separator=" "
                                    decimals={2}
                                    decimal=","
                                />
                            </strong>

                            <small>{financialMetrics.debts?.label}</small>

                            {typeof financialMetrics.debts?.change_percent ===
                                "string" && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        financialMetrics.debts?.change_percent >
                                        0
                                            ? "red"
                                            : financialMetrics.debts
                                                  ?.change_percent < 0
                                            ? "green"
                                            : ""
                                    }`}
                                >
                                    {financialMetrics.debts?.change_percent > 0
                                        ? `${financialMetrics.debts?.change_percent}%`
                                        : `${financialMetrics.debts?.change_percent}%`}
                                </div>
                            )}
                        </div>
                    ) : (
                        <b>Нет данных</b>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialMetrics;
