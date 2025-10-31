const ReportServices = ({ services }) => {
    return (
        <ul className="grid gap-3 max-h-[175px] overflow-y-auto">
            {services && services.length > 0 ? (
                services.map((service, index) => (
                    <li
                        key={index}
                        className="project-card__services-list__item"
                    >
                        <div className="project-card__services-list__item-name">
                            {service.name}
                        </div>
                        <div className="project-card__services-list__item-status">
                            <div> {service.status}</div>
                        </div>
                        <div className="project-card__services-list__item-period">
                            {service.regularity}
                        </div>

                        <div className="project-card__services-list__item-cost">
                            {service.cost !== "-" ? (
                                <>{service.cost} млн руб.</>
                            ) : (
                                "-"
                            )}
                        </div>
                    </li>
                ))
            ) : (
                <li>Нет данных</li>
            )}
        </ul>
    );
};

export default ReportServices;
