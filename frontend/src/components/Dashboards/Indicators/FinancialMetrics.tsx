import CountUp from "react-countup";
import Hint from "../../Hint/Hint";

interface FinancialMetrics {
    revenue: { value: string | number; change_percent: string | number };
    receipts: { value: string | number; change_percent: string | number };
    debts: { value: string | number; change_percent: string | number };
}

// Функция для определения цвета на основе change_percent (строка или число)
const getChangePercentColor = (changePercent: string | number | undefined): string => {
    if (changePercent === undefined || changePercent === null) return "";

    if (typeof changePercent === "string") {
        const trimmed = changePercent.trim();
        if (trimmed.startsWith("+")) return "green";
        if (trimmed.startsWith("-")) return "red";
        const num = parseFloat(trimmed.replace(",", "."));
        if (!isNaN(num)) {
            if (num > 0) return "green";
            if (num < 0) return "red";
        }
        return "";
    }

    if (changePercent > 0) return "green";
    if (changePercent < 0) return "red";
    return "";
};

const parseChangePercent = (changePercent: string | number | undefined): number => {
    if (changePercent === undefined || changePercent === null) return 0;
    if (typeof changePercent === "number") return changePercent;
    return parseFloat(changePercent.replace(",", ".").replace(/[^\d.,+-]/g, "")) || 0;
};

const FinancialMetrics = ({
    financialMetrics,
}: {
    financialMetrics: FinancialMetrics;
}) => {
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

                            <small>
                                млн <br /> руб.
                            </small>

                            {financialMetrics.revenue?.change_percent !== undefined &&
                                financialMetrics.revenue?.change_percent !== null && (
                                <div
                                    className={`statistics-block__item-value-percent ${getChangePercentColor(
                                        financialMetrics.revenue?.change_percent
                                    )}`}
                                >
                                    {typeof financialMetrics.revenue?.change_percent === "string"
                                        ? financialMetrics.revenue.change_percent.includes("%")
                                            ? financialMetrics.revenue.change_percent
                                            : `${financialMetrics.revenue.change_percent}%`
                                        : parseChangePercent(financialMetrics.revenue?.change_percent) > 0
                                        ? `+${String(financialMetrics.revenue.change_percent)}%`
                                        : `${String(financialMetrics.revenue.change_percent)}%`}
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

                            <small>
                                млн <br /> руб.
                            </small>

                            {financialMetrics.receipts?.change_percent !== undefined &&
                                financialMetrics.receipts?.change_percent !== null && (
                                <div
                                    className={`statistics-block__item-value-percent ${getChangePercentColor(
                                        financialMetrics.receipts?.change_percent
                                    )}`}
                                >
                                    {typeof financialMetrics.receipts?.change_percent === "string"
                                        ? financialMetrics.receipts.change_percent.includes("%")
                                            ? financialMetrics.receipts.change_percent
                                            : `${financialMetrics.receipts.change_percent}%`
                                        : parseChangePercent(financialMetrics.receipts?.change_percent) > 0
                                        ? `+${String(financialMetrics.receipts.change_percent)}%`
                                        : `${String(financialMetrics.receipts.change_percent)}%`}
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

                            <small>
                                млн <br /> руб.
                            </small>

                            {financialMetrics.debts?.change_percent !== undefined &&
                                financialMetrics.debts?.change_percent !== null && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        getChangePercentColor(financialMetrics.debts?.change_percent) === "green"
                                            ? "red"
                                            : getChangePercentColor(financialMetrics.debts?.change_percent) === "red"
                                            ? "green"
                                            : ""
                                    }`}
                                >
                                    {typeof financialMetrics.debts?.change_percent === "string"
                                        ? financialMetrics.debts.change_percent.includes("%")
                                            ? financialMetrics.debts.change_percent
                                            : `${financialMetrics.debts.change_percent}%`
                                        : parseChangePercent(financialMetrics.debts?.change_percent) > 0
                                        ? `+${String(financialMetrics.debts.change_percent)}%`
                                        : `${String(financialMetrics.debts.change_percent)}%`}
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
