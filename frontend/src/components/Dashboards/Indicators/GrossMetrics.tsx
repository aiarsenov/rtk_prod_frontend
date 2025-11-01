import CountUp from "react-countup";
import Hint from "../../Hint/Hint";

const GrossMetrics = ({ financialMetrics }) => {
    return (
        <div className="statistics-block__content">
            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    Валовая прибыль
                    <Hint message="Валовая прибыль" />
                </div>
                <div className="statistics-block__item-value">
                    {financialMetrics.gross_profit?.value ? (
                        <div className="statistics-block__item-value-block">
                            <strong>
                                <CountUp
                                    end={parseFloat(
                                        (
                                            financialMetrics.gross_profit
                                                ?.value || "0"
                                        ).replace(",", ".")
                                    )}
                                    duration={1}
                                    separator=" "
                                    decimals={2}
                                    decimal=","
                                />
                            </strong>

                            <small>
                                {financialMetrics.gross_profit?.label}
                            </small>

                            {typeof financialMetrics.gross_profit
                                ?.change_percent === "string" && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        financialMetrics.gross_profit
                                            ?.change_percent > 0
                                            ? "green"
                                            : financialMetrics.gross_profit
                                                  ?.change_percent < 0
                                            ? "red"
                                            : ""
                                    }`}
                                >
                                    {financialMetrics.gross_profit
                                        ?.change_percent > 0
                                        ? `${financialMetrics.gross_profit?.change_percent}%`
                                        : `${financialMetrics.gross_profit?.change_percent}%`}
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
                    Валовая рентабельность
                    <Hint message="Валовая рентабельность" />
                </div>
                <div className="statistics-block__item-value">
                    {financialMetrics.gross_margin?.value ? (
                        <div className="statistics-block__item-value-block">
                            <strong>
                                <CountUp
                                    end={
                                        financialMetrics.gross_margin?.value ||
                                        "0"
                                    }
                                    duration={1}
                                    separator=" "
                                    decimals={2}
                                    decimal=","
                                />{" "}
                                {financialMetrics.gross_margin?.label}
                            </strong>

                            {typeof financialMetrics.gross_margin
                                ?.change_percent === "string" && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        financialMetrics.gross_margin
                                            ?.change_percent > 0
                                            ? "green"
                                            : financialMetrics.gross_margin
                                                  ?.change_percent < 0
                                            ? "red"
                                            : ""
                                    }`}
                                >
                                    {financialMetrics.gross_margin
                                        ?.change_percent > 0
                                        ? `${financialMetrics.gross_margin?.change_percent}%`
                                        : `${financialMetrics.gross_margin?.change_percent}%`}
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

export default GrossMetrics;
