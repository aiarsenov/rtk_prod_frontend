import { useEffect } from "react";

import Hint from "../Hint/Hint";

// Форматирование числа с запятой вместо точки для отображения
const formatNumberWithComma = (num) => {
    if (num === null || num === undefined || isNaN(num)) {
        return "0,00";
    }
    return num.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const ProjectStatisticsBlock = ({ revenue, getRevenue, period, setPeriod }) => {
    useEffect(() => {
        getRevenue(period);
    }, [period]);

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
                        <Hint message={"Выручка с НДС (по методу начисления) по проекту. Источник данных — 1С:Бухгалтерия, на основании договоров с заказчиками, добавленных в отчёты проекта."} />
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
                        <Hint message={"Поступления денежных средств по проекту с НДС. Источник данных — 1С:Бухгалтерия, на основании договоров с заказчиками, добавленных в отчёты проекта."} />
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
                        <Hint message={"Дебиторская задолженность заказчика по проекту с НДС на 09:00 текущего дня."} />
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
                        <Hint message="Валовая прибыль рассчитывается как выручка с НДС за вычетом расходов на подрядчиков с НДС и ФОТ сотрудников, задействованных в реализации проекта.

Валовая рентабельность рассчитывается как отношение валовой прибыли к выручке." />
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
                        <Hint message="ФОТ gross (с учётом НДФЛ, без учёта социальных отчислений), распределённый на проект на основании заполнения процента месячных трудозатрат по отчётам проекта сотрудниками. Источник данных по суммам ФОТ — 1С:Бухгалтерия.

Доля ФОТ от выручки рассчитывается как отношение ФОТ к выручке." />
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
                        <Hint message={"Расходы на подрядчиков с НДС. Источник данных — 1С:Бухгалтерия, на основании договоров с подрядчиками, добавленных в отчёты проекта."} />
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

export default ProjectStatisticsBlock;
