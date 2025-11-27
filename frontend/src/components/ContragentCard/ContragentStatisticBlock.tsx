import { useEffect } from "react";

import Hint from "../Hint/Hint";

// Форматирование числа с запятой вместо точки для отображения
const formatNumberWithComma = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
        return "0,00";
    }
    return num.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const ContragentStatisticBlock = ({
    revenue,
    contragentId,
    activeProject,
    getRevenue,
    period,
    setPeriod,
}: {
    revenue: object[];
    contragentId: number;
    activeProject: number;
    getRevenue: () => void;
    period: string;
    setPeriod: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const URL =
        activeProject != null
            ? `${
                  import.meta.env.VITE_API_URL
              }projects/${activeProject}/revenue?period=${period}`
            : `${
                  import.meta.env.VITE_API_URL
              }contragents/${contragentId}/financial-metrics?period=${period}`;

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
                        Выручка
                        <Hint message={"Выручка"} />
                    </div>
                    <div className="statistics-block__item-value">
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
                        Поступления
                        <Hint message={"Поступления"} />
                    </div>
                    <div className="statistics-block__item-value">
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
                        ДЗ
                        <Hint message={"ДЗ"} />
                    </div>
                    <div className="statistics-block__item-value">
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

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Валовая прибыль
                        <Hint message={"Валовая прибыль"} />
                    </div>
                    <div className="statistics-block__item-value">
                        <>
                            <div>
                                <strong>
                                    {formatNumberWithComma(
                                        parseFloat(
                                            revenue.gross_profit?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )
                                    )}
                                </strong>
                                <small>{revenue.gross_profit?.label}</small>
                            </div>

                            {revenue.gross_margin?.value !== "0" && (
                                <i>
                                    {formatNumberWithComma(
                                        parseFloat(
                                            revenue.gross_margin?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )
                                    )}
                                    {revenue.gross_margin?.label} рент-ть
                                </i>
                            )}
                        </>
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        ФОТ
                        <Hint message={"ФОТ"} />
                    </div>
                    <div className="statistics-block__item-value">
                        <>
                            <div>
                                <strong>
                                    {formatNumberWithComma(
                                        parseFloat(
                                            revenue.fot?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )
                                    )}
                                </strong>
                                <small>{revenue.fot?.label}</small>
                            </div>

                            {revenue.fot_percentage?.value !== "0" && (
                                <i>
                                    {formatNumberWithComma(
                                        parseFloat(
                                            revenue.fot_percentage?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )
                                    )}
                                    {revenue.fot_percentage?.label} от
                                    выручки
                                </i>
                            )}
                        </>
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Подрячики
                        <Hint message={"Подрячики"} />
                    </div>
                    <div className="statistics-block__item-value">
                        <>
                            <div>
                                <strong>
                                    {formatNumberWithComma(
                                        parseFloat(
                                            revenue.suppliers_expenses?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )
                                    )}
                                </strong>
                                <small>
                                    {revenue.suppliers_expenses?.label}
                                </small>
                            </div>

                            {revenue.suppliers_fot_percentage?.value !==
                                "0" && (
                                <i>
                                    {formatNumberWithComma(
                                        parseFloat(
                                            revenue.suppliers_fot_percentage?.value?.replace(
                                                ",",
                                                "."
                                            ) || "0"
                                        )
                                    )}
                                    {
                                        revenue.suppliers_fot_percentage
                                            ?.label
                                    }{" "}
                                    от выручки
                                </i>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContragentStatisticBlock;
