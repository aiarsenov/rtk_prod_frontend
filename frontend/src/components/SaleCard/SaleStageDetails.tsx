import { useState } from "react";

import getColorBySign from "../../utils/getColorBySign";
import formatMoney from "../../utils/formatMoney";

import AutoResizeTextarea from "../AutoResizeTextarea";
import Hint from "../Hint/Hint";

const SaleStageDetails = ({ stage, mode, updateStageDetails }) => {
    const [stageData, setStageData] = useState(stage || {});

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
                                {stageData.dynamic_metrics?.length > 0 &&
                                    stageData.dynamic_metrics?.map((item) => (
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

                                                    setStageData((prev) => ({
                                                        ...prev,
                                                        dynamic_metrics:
                                                            prev.dynamic_metrics.map(
                                                                (metric) =>
                                                                    metric.report_type_id ===
                                                                    item.report_type_id
                                                                        ? {
                                                                              ...metric,
                                                                              current_value:
                                                                                  newValue,
                                                                          }
                                                                        : metric
                                                            ),
                                                    }));
                                                }}
                                                onBlur={() => {
                                                    if (mode === "read") return;

                                                    const originalMetric =
                                                        stage?.dynamic_metrics?.find(
                                                            (m) =>
                                                                m.report_type_id ===
                                                                item.report_type_id
                                                        );

                                                    if (
                                                        originalMetric &&
                                                        originalMetric.current_value !==
                                                            item.current_value
                                                    ) {
                                                        updateStageDetails(
                                                            stageData,
                                                            false
                                                        );
                                                    }
                                                }}
                                                disabled={mode == "read"}
                                            />
                                        </div>
                                    ))}
                            </div>

                            {stage.name?.toLowerCase() !== "отправлено кп" &&
                                stage.dynamic_metrics?.length > 0 && (
                                    <div className="sale-stage-datails__change">
                                        {stage.dynamic_metrics?.map((item) => {
                                            return (
                                                <div
                                                    className="form-field"
                                                    key={item.report_type_id}
                                                >
                                                    <span>Изменение:</span>

                                                    <div
                                                        className={
                                                            item.change_percent
                                                                ? getColorBySign(
                                                                      item.change_percent,
                                                                      "text-[#039855]",
                                                                      "text-[#E84D42]"
                                                                  )
                                                                : ""
                                                        }
                                                    >
                                                        {item.change_percent ||
                                                            0}
                                                        %
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>
                    </div>
                )}

            <div className="sale-stage-datails__body">
                <div className="form-label">Комментарий</div>

                <AutoResizeTextarea
                    className="form-textarea"
                    placeholder={
                        mode == "edit" ? "Ваш комментарий по этапу продажи" : ""
                    }
                    style={{ resize: "none" }}
                    value={stageData?.comment || ""}
                    onChange={(evt) => {
                        setStageData((prev) => ({
                            ...prev,
                            comment: evt.target.value,
                        }));
                    }}
                    onBlur={() => {
                        if (mode === "read") return;
                        if (stage?.comment != stageData?.comment) {
                            updateStageDetails(stageData, false);
                        }
                    }}
                    disabled={mode == "read"}
                />
            </div>
        </div>
    );
};

export default SaleStageDetails;
