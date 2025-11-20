import CountUp from "react-countup";
import Hint from "../../Hint/Hint";

interface Interface {
    value: number | string;
    label: string;
    change_percent: string | number;
}

// Функция для определения цвета на основе change_percent (строка или число)
const getChangePercentColor = (changePercent: string | number | undefined): string => {
    if (changePercent === undefined || changePercent === null) return "";

    // Если строка, проверяем знак
    if (typeof changePercent === "string") {
        const trimmed = changePercent.trim();
        if (trimmed.startsWith("+")) return "red";
        if (trimmed.startsWith("-")) return "green";
        // Если нет знака, пытаемся преобразовать в число
        const num = parseFloat(trimmed.replace(",", "."));
        if (!isNaN(num)) {
            if (num > 0) return "red";
            if (num < 0) return "green";
        }
        return "";
    }

    // Если число
    if (changePercent > 0) return "red";
    if (changePercent < 0) return "green";
    return "";
};

// Функция для преобразования change_percent в число для сравнения
const parseChangePercent = (changePercent: string | number | undefined): number => {
    if (changePercent === undefined || changePercent === null) return 0;
    if (typeof changePercent === "number") return changePercent;
    return parseFloat(changePercent.replace(",", ".").replace(/[^\d.,+-]/g, "")) || 0;
};

const EmployeeMetrics = ({
    total_active_employees,
    average_salary,
    gross_salary,
}: {
    total_active_employees: Interface;
    average_salary: Interface;
    gross_salary: Interface;
}) => {
    return (
        <div className="statistics-block__content indicators__employees-metrics-statistics">
            <div className="statistics-block__item">
                <div className="statistics-block__item-label">
                    Численность
                    <Hint message="Численность" />
                </div>
                <div className="statistics-block__item-value">
                    {total_active_employees?.value ? (
                        <div className="statistics-block__item-value-block">
                            <strong>
                                <CountUp
                                    end={total_active_employees?.value || 0}
                                    duration={1}
                                    separator=" "
                                    decimals={2}
                                    decimal=","
                                />
                            </strong>

                            <small>{total_active_employees?.label}</small>

                            {total_active_employees?.change_percent !== undefined &&
                                total_active_employees?.change_percent !== null && (
                                <div
                                    className={`statistics-block__item-value-percent ${getChangePercentColor(
                                        total_active_employees?.change_percent
                                    )}`}
                                >
                                    {typeof total_active_employees?.change_percent === "string"
                                        ? total_active_employees.change_percent.includes("%")
                                            ? total_active_employees.change_percent
                                            : `${total_active_employees.change_percent}%`
                                        : parseChangePercent(total_active_employees?.change_percent) > 0
                                        ? `+${total_active_employees.change_percent}%`
                                        : `${total_active_employees.change_percent}%`}
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
                    ФОТ gross
                    <Hint message="ФОТ gross" />
                </div>
                <div className="statistics-block__item-value">
                    {gross_salary?.value ? (
                        <div className="statistics-block__item-value-block">
                            <strong>
                                <CountUp
                                    end={parseFloat(
                                        (gross_salary?.value || "0").replace(
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

                            <small>
                                млн <br /> руб.
                            </small>

                            {gross_salary?.change_percent !== undefined &&
                                gross_salary?.change_percent !== null && (
                                <div
                                    className={`statistics-block__item-value-percent ${getChangePercentColor(
                                        gross_salary?.change_percent
                                    )}`}
                                >
                                    {typeof gross_salary?.change_percent === "string"
                                        ? gross_salary.change_percent.includes("%")
                                            ? gross_salary.change_percent
                                            : `${gross_salary.change_percent}%`
                                        : parseChangePercent(gross_salary?.change_percent) > 0
                                        ? `+${gross_salary.change_percent}%`
                                        : `${gross_salary.change_percent}%`}
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
                    Средняя з/п
                    <Hint message="Средняя з/п" />
                </div>
                <div className="statistics-block__item-value">
                    {average_salary?.value ? (
                        <div className="statistics-block__item-value-block">
                            <strong>
                                <CountUp
                                    end={parseFloat(
                                        (average_salary?.value || "0").replace(
                                            ",",
                                            "."
                                        )
                                    )}
                                    duration={1}
                                    separator=" "
                                    decimals={1}
                                    decimal=","
                                />
                            </strong>

                            <small>
                                тыс. <br /> руб.
                            </small>

                            {average_salary?.change_percent !== undefined &&
                                average_salary?.change_percent !== null && (
                                <div
                                    className={`statistics-block__item-value-percent ${getChangePercentColor(
                                        average_salary?.change_percent
                                    )}`}
                                >
                                    {typeof average_salary?.change_percent === "string"
                                        ? average_salary.change_percent.includes("%")
                                            ? average_salary.change_percent
                                            : `${average_salary.change_percent}%`
                                        : parseChangePercent(average_salary?.change_percent) > 0
                                        ? `+${average_salary.change_percent}%`
                                        : `${average_salary.change_percent}%`}
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

export default EmployeeMetrics;
