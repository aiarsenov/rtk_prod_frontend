import Hint from "../Hint/Hint";

const SupplierStatisticBlockMobile = ({
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
                            setPeriod("current_year");
                            getRevenue(URL);
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
                            getRevenue(URL);
                            setPeriod("all");
                        }}
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
                        Оплачено
                        <Hint message={"Оплачено"} />
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
                        КЗ
                        <Hint message={"КЗ"} />
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
            </div>
        </div>
    );
};

export default SupplierStatisticBlockMobile;
