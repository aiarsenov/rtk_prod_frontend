import getColorBySign from "../../utils/getColorBySign";
import formatMoney from "../../utils/formatMoney";

import AutoResizeTextarea from "../AutoResizeTextarea";

const SaleStageDetails = ({ stage, mode }) => {
    return (
        <div className="sale-stage-datails flex flex-col gap-4">
            {stage.name?.toLowerCase() !== "получен запрос" &&
                stage.name?.toLowerCase() !== "получен отказ" &&
                stage.name?.toLowerCase() !== "проект отложен" &&
                stage.name?.toLowerCase() !== "подготовка кп" && (
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-2 flex-grow">
                            <span className="flex items-center gap-2 text-gray-400">
                                Стоимость предложения, руб.
                                <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] w-[20px] h-[20px]">
                                    ?
                                </span>
                            </span>

                            {stage.dynamic_metrics?.length > 0 &&
                                stage.dynamic_metrics?.map((item) => (
                                    <div
                                        className="grid grid-cols-[50px_1fr] items-center gap-4"
                                        key={item.report_type_id}
                                    >
                                        <span>{item?.report_type_name}:</span>

                                        <input
                                            type="text"
                                            className="form-field"
                                            value={
                                                formatMoney(
                                                    item.current_value
                                                ) || ""
                                            }
                                            onChange={(evt) => {
                                                const newValue =
                                                    evt.target.value;

                                                // setMetrics((prev) => ({
                                                //     ...prev,
                                                //     metrics:
                                                //         prev.metrics.map(
                                                //             (metric) =>
                                                //                 metric.report_type_id ===
                                                //                 item.report_type_id
                                                //                     ? {
                                                //                           ...metric,
                                                //                           current_value:
                                                //                               newValue,
                                                //                       }
                                                //                     : metric
                                                //         ),
                                                // }));
                                            }}
                                            disabled={mode == "read"}
                                        />
                                    </div>
                                ))}
                        </div>

                        {stage.name?.toLowerCase() !== "отправлено кп" && (
                            <div
                                className="flex flex-col gap-2"
                                style={{ flex: "0 0 60px" }}
                            >
                                <span className="flex items-center gap-2 text-gray-400">
                                    Изменение
                                </span>

                                {stage.dynamic_metrics?.length > 0 &&
                                    stage.dynamic_metrics?.map((item) => (
                                        <div
                                            className={`form-field ${
                                                item.change_percent
                                                    ? getColorBySign(
                                                          item.change_percent,
                                                          "text-[#32d583]",
                                                          "text-[#f97066]"
                                                      )
                                                    : ""
                                            }`}
                                            key={item.report_type_id}
                                        >
                                            {item.change_percent || 0}%
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">
                {stage.name?.toLowerCase() !== "получен запрос" &&
                    stage.name?.toLowerCase() !== "подготовка кп" &&
                    stage.name?.toLowerCase() !== "проект отложен" &&
                    stage.name?.toLowerCase() !== "получен отказ" && (
                        <span className="text-gray-400">Комментарий:</span>
                    )}

                <AutoResizeTextarea
                    className={`form-textarea ${
                        stage.name?.toLowerCase() === "получен запрос" ||
                        stage.name?.toLowerCase() === "подготовка кп" ||
                        stage.name?.toLowerCase() === "проект отложен" ||
                        stage.name?.toLowerCase() === "получен отказ"
                            ? "p-3"
                            : "border-2 border-gray-300 p-5"
                    } min-h-[300px]`}
                    placeholder="Оставьте комментарий по этапу"
                    style={{ resize: "none" }}
                    value={stage?.comment || ""}
                    onChange={(evt) => {
                        // setMetrics((prev) => ({
                        //     ...prev,
                        //     comment: evt.target.value,
                        // }));
                    }}
                    disabled={mode == "read"}
                />
            </div>
        </div>
    );
};

export default SaleStageDetails;
