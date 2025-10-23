import pepcentColorHandler from "../../utils/percentColorHandler";

const SaleServicesList = ({ services, mode, deleteService }) => {
    return (
        <ul className="services__list">
            {services &&
                services.length > 0 &&
                services.map((item) => (
                    <li className="services__list-item" key={item.id}>
                        <div className="services__list-item-name">
                            {item.full_name}
                        </div>

                        <div className="services__list-item-row">
                            <div className="services__list-item-cost">
                                <div
                                    className={`${
                                        item.cost_change_percent
                                            ? pepcentColorHandler(
                                                  item.cost_change_percent
                                              )
                                            : ""
                                    }`}
                                >
                                    {item.cost_change_percent}
                                </div>

                                {item.cost}
                            </div>

                            {mode === "read" ? (
                                <div className="w-[20px] h-[20px]"></div>
                            ) : (
                                <button
                                    className="delete-icon"
                                    title="Удалить услугу"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteService(item.id);
                                    }}
                                ></button>
                            )}
                        </div>
                    </li>
                ))}
        </ul>
    );
};

export default SaleServicesList;
