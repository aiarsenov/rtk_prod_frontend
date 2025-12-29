import { useState, useEffect } from "react";

import getColorBySign from "../../utils/getColorBySign";

import AutoResizeTextarea from "../AutoResizeTextarea";
import Hint from "../Hint/Hint";

const formatMoneyDisplay = (raw) => {
    if (!raw) return "";

    const [whole, fraction] = raw.split(".");
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return fraction !== undefined
        ? `${formattedWhole},${fraction.slice(0, 2)}`
        : formattedWhole;
};

const parseMoneyDisplay = (display) => {
    if (!display) return "";

    // Оставляем только цифры и запятую
    let cleaned = display.replace(/[^0-9,]/g, "");

    // Запрещаем вторую запятую
    const parts = cleaned.split(",");
    if (parts.length > 2) {
        cleaned = parts[0] + "," + parts.slice(1).join("");
    }

    return cleaned.replace(",", ".");
};

const SaleStageDetails = ({ stage, mode, updateStageDetails }) => {
    const [stageData, setStageData] = useState(stage || {});

    // Синхронизируем локальное состояние с пропсом stage при его изменении
    useEffect(() => {
        if (stage) {
            setStageData(stage);
        }
    }, [stage]);

    return (
        <div className="sale-stage-datails">
            {stage.name?.toLowerCase() !== "получен запрос" &&
                stage.name?.toLowerCase() !== "получен отказ" &&
                stage.name?.toLowerCase() !== "отказ от участия" &&
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
                                                inputMode="decimal"
                                                pattern="[0-9, ]*"
                                                value={formatMoneyDisplay(
                                                    item.current_value
                                                )}
                                                onChange={(e) => {
                                                    if (mode.edit !== "full")
                                                        return;

                                                    const input = e.target;
                                                    const cursor =
                                                        input.selectionStart;
                                                    const displayValue =
                                                        input.value;

                                                    const commaJustTyped =
                                                        displayValue[
                                                            cursor - 1
                                                        ] === ",";

                                                    const digitsBefore =
                                                        displayValue
                                                            .slice(0, cursor)
                                                            .replace(
                                                                /\D/g,
                                                                ""
                                                            ).length;

                                                    const rawValue =
                                                        parseMoneyDisplay(
                                                            displayValue
                                                        );

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
                                                                                  rawValue,
                                                                          }
                                                                        : metric
                                                            ),
                                                    }));

                                                    requestAnimationFrame(
                                                        () => {
                                                            const formatted =
                                                                formatMoneyDisplay(
                                                                    rawValue
                                                                );

                                                            let pos = 0;
                                                            let digitsCount = 0;

                                                            while (
                                                                digitsCount <
                                                                    digitsBefore &&
                                                                pos <
                                                                    formatted.length
                                                            ) {
                                                                if (
                                                                    /\d/.test(
                                                                        formatted[
                                                                            pos
                                                                        ]
                                                                    )
                                                                )
                                                                    digitsCount++;
                                                                pos++;
                                                            }

                                                            if (
                                                                commaJustTyped &&
                                                                formatted[
                                                                    pos
                                                                ] === ","
                                                            ) {
                                                                pos++;
                                                            }

                                                            input.setSelectionRange(
                                                                pos,
                                                                pos
                                                            );
                                                        }
                                                    );
                                                }}
                                                onBlur={() => {
                                                    if (mode.edit !== "full")
                                                        return;

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
                                                disabled={mode.edit !== "full"}
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
                        mode.edit === "full"
                            ? "Ваш комментарий по этапу продажи"
                            : ""
                    }
                    style={{ resize: "none" }}
                    value={stageData?.comment || ""}
                    onChange={(evt) => {
                        if (mode.edit !== "full") return;

                        setStageData((prev) => ({
                            ...prev,
                            comment: evt.target.value,
                        }));
                    }}
                    onBlur={() => {
                        if (mode.edit !== "full") return;
                        if (stage?.comment != stageData?.comment) {
                            updateStageDetails(stageData, false);
                        }
                    }}
                    disabled={mode.edit !== "full"}
                />
            </div>
        </div>
    );
};

export default SaleStageDetails;
