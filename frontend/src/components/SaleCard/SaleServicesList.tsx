import getColorBySign from "../../utils/getColorBySign";

const SaleServicesList = ({
    services,
    mode,
    deleteService,
}: {
    services: object[];
    mode: string;
    deleteService: () => void;
}) => {
    // Функция для проверки, равно ли значение нулю
    const isZeroPercent = (value: string | number | null | undefined): boolean => {
        if (!value) return true;

        // Если это число
        if (typeof value === "number") {
            return value === 0;
        }

        // Если это строка, убираем знак процента и пробелы, парсим число
        const numericValue = parseFloat(
            String(value).replace(/%/g, "").trim()
        );

        return !isNaN(numericValue) && numericValue === 0;
    };

    return (
        services && (
            <ul className="services__list">
                {services.length > 0 &&
                    services.map((item) => (
                        <li className="services__list-item" key={item.id}>
                            <div className="services__list-item-name">
                                {item.full_name}
                            </div>

                            <div className="services__list-item-row">
                                <div className="services__list-item-cost">
                                    {item.cost_change_percent &&
                                        !isZeroPercent(item.cost_change_percent) && (
                                            <div
                                                className={`services__list-item-percent ${getColorBySign(
                                                    item.cost_change_percent,
                                                    "text-[#039855] bg-[#d1fadf]",
                                                    "text-[#E84D42] bg-[#fee4e2]"
                                                )}`}
                                            >
                                                {item.cost_change_percent}
                                            </div>
                                        )}

                                    {item.cost}
                                </div>

                                {mode === "read" ? (
                                    <div className="w-[20px] h-[20px]"></div>
                                ) : (
                                    <button
                                        className="delete-button"
                                        title="Удалить услугу"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteService(item.id);
                                        }}
                                    >
                                        <svg
                                            width="20"
                                            height="21"
                                            viewBox="0 0 20 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5.833 8v9.166h8.333V8h1.667v10c0 .46-.373.833-.833.833H5A.833.833 0 014.166 18V8h1.667zm3.333 0v7.5H7.5V8h1.666zM12.5 8v7.5h-1.667V8H12.5zm0-5.833c.358 0 .677.229.79.57l.643 1.929h2.733v1.667H3.333V4.666h2.733l.643-1.93a.833.833 0 01.79-.57h5zm-.601 1.666H8.1l-.278.833h4.354l-.277-.833z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
            </ul>
        )
    );
};

export default SaleServicesList;
