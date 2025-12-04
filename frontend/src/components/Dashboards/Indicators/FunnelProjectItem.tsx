import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const handleStatusString = (string) => {
    if (!string) return;

    if (string.toLowerCase() === "получен запрос") {
        return "text-[#002033]";
    } else if (
        string.toLowerCase() === "получен отказ" ||
        string.toLowerCase() === "отказ от участия"
    ) {
        return "text-[#E84D42]";
    } else if (string.toLowerCase() === "проект отложен") {
        return "text-[#F38B00]";
    } else {
        return "text-[#039855]";
    }
};

const FunnelProjectItem = ({
    name,
    industry,
    source,
    service_cost_value,
    service_cost_label,
    current_stage,
}: {
    name: string;
    industry: { name: string };
    source: string;
    service_cost_value: string;
    service_cost_label: string;
    current_stage: { name: string; stage_date: string };
}) => {
    return (
        <li className="reports__list-item">
            <div className="reports__list-item__col">
                <div>{name}</div>
                <span>{industry?.name}</span>
            </div>

            <div className="reports__list-item__col">{source}</div>

            <div className="reports__list-item__col">
                {service_cost_value ? (
                    <>
                        <div>{service_cost_value}</div>
                        <span>{service_cost_label}</span>
                    </>
                ) : (
                    <div>—</div>
                )}
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
