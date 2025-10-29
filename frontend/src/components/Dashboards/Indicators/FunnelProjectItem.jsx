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
                <div className="text-lg">{name}</div>
                <span className="text-gray-400">{industry?.name}</span>
            </div>

            <div className="reports__list-item__col">{source}</div>

            <div className="reports__list-item__col">
                <strong className="text-lg font-normal max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {service_cost}
                </strong>
            </div>

            <div className="reports__list-item__col">
                <div
                    className={`text-lg ${handleStatusString(
                        current_stage?.name
                    )}`}
                >
                    {current_stage?.name}
                </div>
                <span className="text-gray-400">
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
