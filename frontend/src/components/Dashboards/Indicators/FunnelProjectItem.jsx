import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import handleStatusString from "../../../utils/handleStatusString";

const FunnelProjectItem = ({
    name,
    industry,
    source,
    service_cost,
    current_stage,
}) => {
    return (
        <li className="reports__list-item">
            <div className="reports__list-item__col">
                <div>{name}</div>
                <span>{industry?.name}</span>
            </div>

            <div className="reports__list-item__col">{source}</div>

            <div className="reports__list-item__col">
                <div>{service_cost}</div>
                <span></span>
            </div>

            <div className="reports__list-item__col">
                <div className={`${handleStatusString(current_stage?.name)}`}>
                    {current_stage?.name}
                </div>
                <span>
                    {current_stage?.stage_date &&
                        format(
                            parseISO(current_stage?.stage_date),
                            "dd.MM.yyyy",
                            {
                                locale: ru,
                            }
                        )}
                </span>
            </div>
        </li>
    );
};

export default FunnelProjectItem;
