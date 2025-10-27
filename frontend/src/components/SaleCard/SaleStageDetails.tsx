import getColorBySign from "../../utils/getColorBySign";
import formatMoney from "../../utils/formatMoney";

import AutoResizeTextarea from "../AutoResizeTextarea";
import Hint from "../Hint/Hint";

const SaleStageDetails = ({ stage, mode }) => {
    return (
        <div className="sale-stage-datails">
            {stage.name?.toLowerCase() !== "получен запрос" &&
                stage.name?.toLowerCase() !== "получен отказ" &&
                stage.name?.toLowerCase() !== "проект отложен" &&
                stage.name?.toLowerCase() !== "подготовка кп" && (
                    <div className="sale-stage-datails__header">
                        <div className="form-label">
                            Стоимость предложения, руб.
                            <Hint message={"Стоимость предложения, руб."} />
                        </div>

                        <div className="sale-stage-datails__list">
                            <div>
                                {stage.dynamic_metrics?.length > 0 &&
                                    stage.dynamic_metrics?.map((item) => (
                                        <div
                                            className="form-field"
                                            key={item.report_type_id}
                                        >
                                            <span>
                                                {item?.report_type_name}:
                                            </span>

                                            <input
                                                type="text"
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

                            <div>
                                {stage.name?.toLowerCase() !==
                                    "отправлено кп" &&
                                    stage.dynamic_metrics?.length > 0 &&
                                    stage.dynamic_metrics?.map((item) => (
                                        <div
                                            className="form-field"
                                            key={item.report_type_id}
                                        >
                                            <span>Изменение:</span>

                                            <div
                                                className={`${
                                                    item.change_percent
                                                        ? getColorBySign(
                                                              item.change_percent,
                                                              "text-[#32d583]",
                                                              "text-[#E84D42]"
                                                          )
                                                        : ""
                                                }`}
                                            >
                                                {item.change_percent || 0}%
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

            <div className="sale-stage-datails__body">
                {stage.name?.toLowerCase() !== "получен запрос" &&
                    stage.name?.toLowerCase() !== "подготовка кп" &&
                    stage.name?.toLowerCase() !== "проект отложен" &&
                    stage.name?.toLowerCase() !== "получен отказ" && (
                        <div className="form-label">Комментарий</div>
                    )}

                <AutoResizeTextarea
                    className="form-textarea"
                    placeholder="Ваш комментарий по этапу продажи"
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
