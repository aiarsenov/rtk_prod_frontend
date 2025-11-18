import CountUp from "react-countup";
import Hint from "../../Hint/Hint";

interface Interface {
    value: number | string;
    label: string;
    change_percent: number;
}

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

                            {typeof total_active_employees?.change_percent ===
                                "number" && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        total_active_employees.change_percent >
                                        0
                                            ? "red"
                                            : total_active_employees.change_percent <
                                              0
                                            ? "green"
                                            : ""
                                    }`}
                                >
                                    {total_active_employees.change_percent > 0
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

                            {typeof gross_salary?.change_percent ===
                                "number" && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        gross_salary.change_percent > 0
                                            ? "red"
                                            : gross_salary.change_percent < 0
                                            ? "green"
                                            : ""
                                    }`}
                                >
                                    {gross_salary.change_percent > 0
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

                            {typeof average_salary?.change_percent ===
                                "number" && (
                                <div
                                    className={`statistics-block__item-value-percent ${
                                        average_salary.change_percent > 0
                                            ? "red"
                                            : average_salary.change_percent < 0
                                            ? "green"
                                            : ""
                                    }`}
                                >
                                    {average_salary.change_percent > 0
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
