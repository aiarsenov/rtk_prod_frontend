import { useEffect } from "react";

import Hint from "../Hint/Hint";

// Форматирование числа с запятой вместо точки для отображения
const formatNumberWithComma = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
        return "0,00";
    }
    return num.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const SupplierStatisticBlock = ({
    revenue,
    supplierId,
    activeProject,
    getRevenue,
    period,
    setPeriod,
}: {
    revenue: object[];
    supplierId: number;
    activeProject: number;
    getRevenue: () => void;
    period: string;
    setPeriod: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const URL =
        activeProject != null
            ? `${
                  import.meta.env.VITE_API_URL
              }contragents/${supplierId}/projects/${activeProject}/supplier-metrics/?period=${period}`
            : `${
                  import.meta.env.VITE_API_URL
              }contragents/${supplierId}/supplier-metrics?period=${period}`;

    useEffect(() => {
        getRevenue(URL);
    }, [period, activeProject]);

    return (
        <div className="statistics-block project-card__statistics-block">
            <nav className="card__tabs statistics-block__tabs">
                <div className="card__tabs-item radio-field_tab">
                    <input
                        type="radio"
                        name="time_sort"
                        id="this_year"
                        checked={period === "current_year"}
                        onChange={() => setPeriod("current_year")}
                    />
                    <label htmlFor="this_year">Текущий год</label>
                </div>
                <div className="card__tabs-item radio-field_tab">
                    <input
                        type="radio"
                        name="time_sort"
                        id="all_time"
                        checked={period === "all"}
                        onChange={() => setPeriod("all")}
                    />
                    <label htmlFor="all_time">За всё время</label>
                </div>
            </nav>

            <div className="statistics-block__content">
                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Выполнено
                        <Hint message={"Выполнено"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.revenue?.value +
                            " " +
                            revenue.revenue?.label
                        }
                    >
                        <div>
                            <strong>
                                {formatNumberWithComma(
                                    parseFloat(
                                        revenue.revenue?.value?.replace(
                                            ",",
                                            "."
                                        ) || "0"
                                    )
                                )}
                            </strong>
                            <small>{revenue.revenue?.label}</small>
                        </div>
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Оплачено
                        <Hint message={"Оплачено"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.receipts?.value +
                            " " +
                            revenue.receipts?.label
                        }
                    >
                        <div>
                            <strong>
                                {formatNumberWithComma(
                                    parseFloat(
                                        revenue.receipts?.value?.replace(
                                            ",",
                                            "."
                                        ) || "0"
                                    )
                                )}
                            </strong>
                            <small>{revenue.receipts?.label}</small>
                        </div>
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        КЗ
                        <Hint message={"КЗ"} />
                    </div>
                    <div
                        className="statistics-block__item-value"
                        title={
                            revenue.debts?.value + " " + revenue.debts?.label
                        }
                    >
                        <div>
                            <strong>
                                {formatNumberWithComma(
                                    parseFloat(
                                        revenue.debts?.value?.replace(
                                            ",",
                                            "."
                                        ) || "0"
                                    )
                                )}
                            </strong>
                            <small>{revenue.debts?.label}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierStatisticBlock;
