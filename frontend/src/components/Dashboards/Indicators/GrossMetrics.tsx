import CountUp from "react-countup";
import Hint from "../../Hint/Hint";

interface FinancialMetrics {
    gross_profit: { value: string | number; change_percent: string | number };
    gross_margin: {
        value: string | number;
        label: string;
        change_percent: string | number;
    };
}

// Функция для определения цвета на основе change_percent (строка или число)
const getChangePercentColor = (changePercent: string | number | undefined): string => {
    if (changePercent === undefined || changePercent === null) return "";

    // Если строка, проверяем знак
    if (typeof changePercent === "string") {
        const trimmed = changePercent.trim();
        if (trimmed.startsWith("+")) return "green";
        if (trimmed.startsWith("-")) return "red";
        // Если нет знака, пытаемся преобразовать в число
        const num = parseFloat(trimmed.replace(",", "."));
        if (!isNaN(num)) {
            if (num > 0) return "green";
            if (num < 0) return "red";
        }
        return "";
    }

    // Если число
    if (changePercent > 0) return "green";
    if (changePercent < 0) return "red";
    return "";
};

// Функция для преобразования change_percent в число для сравнения
const parseChangePercent = (changePercent: string | number | undefined): number => {
    if (changePercent === undefined || changePercent === null) return 0;
    if (typeof changePercent === "number") return changePercent;
    return parseFloat(changePercent.replace(",", ".").replace(/[^\d.,+-]/g, "")) || 0;
};

const GrossMetrics = ({
    financialMetrics,
}: {
    financialMetrics: FinancialMetrics;
}) => {
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
                                млн <br /> руб.
                            </small>

                            {financialMetrics.gross_profit?.change_percent !== undefined &&
                                financialMetrics.gross_profit?.change_percent !== null && (
                                <div
                                    className={`statistics-block__item-value-percent ${getChangePercentColor(
                                        financialMetrics.gross_profit?.change_percent
                                    )}`}
                                >
                                    {typeof financialMetrics.gross_profit?.change_percent === "string"
                                        ? financialMetrics.gross_profit.change_percent.includes("%")
                                            ? financialMetrics.gross_profit.change_percent
                                            : `${financialMetrics.gross_profit.change_percent}%`
                                        : parseChangePercent(financialMetrics.gross_profit?.change_percent) > 0
                                        ? `+${financialMetrics.gross_profit.change_percent}%`
                                        : `${financialMetrics.gross_profit.change_percent}%`}
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
                                />
                                {financialMetrics.gross_margin?.label}
                            </strong>

                            {financialMetrics.gross_margin?.change_percent !== undefined &&
                                financialMetrics.gross_margin?.change_percent !== null && (
                                <div
                                    className={`statistics-block__item-value-percent ${getChangePercentColor(
                                        financialMetrics.gross_margin?.change_percent
                                    )}`}
                                >
                                    {typeof financialMetrics.gross_margin?.change_percent === "string"
                                        ? financialMetrics.gross_margin.change_percent.includes("%") ||
                                          financialMetrics.gross_margin.change_percent.includes("п.п.")
                                            ? financialMetrics.gross_margin.change_percent
                                            : `${financialMetrics.gross_margin.change_percent}%`
                                        : parseChangePercent(financialMetrics.gross_margin?.change_percent) > 0
                                        ? `+${financialMetrics.gross_margin.change_percent}%`
                                        : `${financialMetrics.gross_margin.change_percent}%`}
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
