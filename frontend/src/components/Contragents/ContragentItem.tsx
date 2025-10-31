import { useNavigate } from "react-router-dom";
import handleStatus from "../../utils/handleStatus";

const ContragentItem = ({ props, columns }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        navigate(`/contragents/${props.id}`, { state: { mode: "read" } });
    };

    return (
        <tr
            className="registry-table__item transition text-base text-left cursor-pointer"
            onClick={handleRowClick}
        >
            {columns.map(({ key }) => {
                const value = props[key];

                let statusClass;

                if (key === "status") {
                    if (value === "completed") {
                        statusClass = "registry-table__item-status_completed";
                    } else if (value === "active") {
                        statusClass = "registry-table__item-status_active";
                    }
                }

                if (Array.isArray(value) && value !== null) {
                    if (value?.length > 0) {
                        return (
                            <td
                                className="min-w-[130px] max-w-[280px]"
                                key={key}
                            >
                                <table className="w-full">
                                    <tbody>
                                        {value?.map((item, index) => (
                                            <tr key={`${key}_${index}`}>
                                                <td className="flex items-center gap-[5px] flex-wrap">
                                                    {item?.toString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td>
                        );
                    } else {
                        return (
                            <td className="w-[130px] max-w-[130px]" key={key}>
                                —
                            </td>
                        );
                    }
                } else if (typeof value === "object" && value !== null) {
                    return Object.entries(value).map(([subKey, subValue]) => (
                        <td className="w-[210px]" key={subKey}>
                            {subValue?.toString()}
                        </td>
                    ));
                } else {
                    if (key === "status") {
                        return (
                            <td className="w-[110px]" key={key}>
                                <div
                                    className={`registry-table__item-status ${statusClass}`}
                                >
                                    {handleStatus(value?.toString()) || "—"}
                                </div>
                            </td>
                        );
                    } else if (key === "program_name") {
                        return (
                            <td
                                className="min-w-[130px] max-w-[280px]"
                                key={value?.main?.id}
                            >
                                <div className="hidden-group">
                                    <div
                                        className="visible-text text-blue"
                                        style={{ maxWidth: "280px" }}
                                    >
                                        <div className="w-full">
                                            {value?.toString() || "—"}
                                        </div>
                                    </div>

                                    <div className="hidden-text">
                                        {value?.toString() || "—"}
                                    </div>
                                </div>
                            </td>
                        );
                    } else {
                        return (
                            <td className="w-[130px]" key={key}>
                                {value?.toString() || "—"}
                            </td>
                        );
                    }
                }
            })}
        </tr>
    );
};

export default ContragentItem;
