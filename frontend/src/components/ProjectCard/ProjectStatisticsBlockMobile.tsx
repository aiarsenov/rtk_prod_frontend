import Hint from "../Hint/Hint";

const ProjectStatisticsBlockMobile = ({
    revenue,
    getRevenue,
    period,
    setPeriod,
}) => {
    return (
        <div className="statistics-block project-card__statistics-block">
            <nav className="card__tabs statistics-block__tabs">
                <div className="card__tabs-item radio-field_tab">
                    <input
                        type="radio"
                        name="time_sort_1"
                        id="this_year"
                        checked={period === "current_year"}
                        onChange={() => {
                            getRevenue();
                            setPeriod("current_year");
                        }}
                    />
                    <label htmlFor="this_year">Текущий год</label>
                </div>
                <div className="card__tabs-item radio-field_tab">
                    <input
                        type="radio"
                        name="time_sort_1"
                        id="all_time"
                        checked={period === "all"}
                        onChange={() => {
                            getRevenue();
                            setPeriod("all");
                        }}
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
                        {revenue.revenue?.value !== "0" ? (
                            <div>
                                <strong>{revenue.revenue?.value || 0}</strong>
                                <small>{revenue.revenue?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Поступления
                        <Hint message={"Поступления"} />
                    </div>
                    <div className="statistics-block__item-value">
                        {revenue.receipts?.value !== "0" ? (
                            <div>
                                <strong>{revenue.receipts?.value || 0}</strong>
                                <small>{revenue.receipts?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        ДЗ
                        <Hint message={"Дебиторская задолженность заказчика по проекту с НДС на 09:00 текущего дня."} />
                    </div>
                    <div className="statistics-block__item-value">
                        {revenue.debts?.value !== "0" ? (
                            <div>
                                <strong>{revenue.debts?.value || 0}</strong>
                                <small>{revenue.debts?.label}</small>
                            </div>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Валовая прибыль
                        <Hint message="Валовая прибыль рассчитывается как выручка с НДС за вычетом расходов на подрядчиков с НДС и ФОТ сотрудников, задействованных в реализации проекта.

Валовая рентабельность рассчитывается как отношение валовой прибыли к выручке." />
                    </div>
                    <div className="statistics-block__item-value">
                        {revenue.gross_profit?.value !== "0" ? (
                            <>
                                <div>
                                    <strong>
                                        {revenue.gross_profit?.value || 0}
                                    </strong>
                                    <small>{revenue.gross_profit?.label}</small>
                                </div>

                                {revenue.gross_margin?.value !== "0" && (
                                    <i>
                                        {revenue.gross_margin?.value || 0}
                                        {revenue.gross_margin?.label} рент-ть
                                    </i>
                                )}
                            </>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        ФОТ
                        <Hint message={"ФОТ"} />
                    </div>
                    <div className="statistics-block__item-value">
                        {revenue.fot?.value !== "0" ? (
                            <>
                                <div>
                                    <strong>{revenue.fot?.value || 0}</strong>
                                    <small>{revenue.fot?.label}</small>
                                </div>

                                {revenue.fot_percentage?.value !== "0" && (
                                    <i>
                                        {revenue.fot_percentage?.value || 0}
                                        {revenue.fot_percentage?.label} от
                                        выручки
                                    </i>
                                )}
                            </>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>

                <div className="statistics-block__item">
                    <div className="statistics-block__item-label">
                        Подрячики
                        <Hint message={"Подрячики"} />
                    </div>
                    <div className="statistics-block__item-value">
                        {revenue.suppliers_expenses?.value !== "0" ? (
                            <>
                                <div>
                                    <strong>
                                        {revenue.suppliers_expenses?.value || 0}
                                    </strong>
                                    <small>
                                        {revenue.suppliers_expenses?.label}
                                    </small>
                                </div>

                                {revenue.suppliers_fot_percentage?.value !==
                                    "0" && (
                                    <i>
                                        {revenue.suppliers_fot_percentage
                                            ?.value || 0}
                                        {
                                            revenue.suppliers_fot_percentage
                                                ?.label
                                        }
                                        от выручки
                                    </i>
                                )}
                            </>
                        ) : (
                            <b>Нет данных</b>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectStatisticsBlockMobile;
