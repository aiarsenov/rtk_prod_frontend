import { useState } from "react";

import CustomDatePickerField from "../CustomDatePicker/CustomDatePickerField";
import SaleStageDetails from "./SaleStageDetails";

const SaleFunnelItem = ({
    stage,
    handleStage,
    getStageDetails,
    maxPrevDate,
    showStageDots,
    showStageActions,
    isLast,
    handleActiveStageDate,
    updateStageDetails,
    mode,
}) => {
    const [activeStage, setActiveStage] = useState(null);

    const handleStatusClass = () => {
        if (stage.next_possible_stages[1]?.selected) {
            return "rate-switch_red";
        } else if (stage.next_possible_stages[2]?.selected) {
            return "rate-switch_orange";
        } else if (stage.next_possible_stages[0]?.selected) {
            return "rate-switch_green";
        }
    };

    const handleStaticStatusClass = () => {
        if (stage.selected_status == "rejected") {
            return "rate-switch_red";
        } else if (stage.selected_status == "postponed") {
            return "rate-switch_orange";
        } else if (stage.selected_status == "success") {
            return "rate-switch_green";
        }
    };

    const handleNameClass = () => {
        if (stage.name.toLowerCase() == "получен запрос") {
            return "";
        } else if (
            stage.name.toLowerCase() == "получен отказ" ||
            stage.name.toLowerCase() == "отказ от участия"
        ) {
            return "status_canceled";
        } else if (stage.name.toLowerCase() == "проект отложен") {
            return "status_completed";
        } else {
            return "status_active";
        }
    };

    const noActionStages =
        stage.name.toLowerCase() !== "отказ от участия" &&
        stage.name.toLowerCase() !== "получен отказ" &&
        stage.name.toLowerCase() !== "проект отложен" &&
        stage.name.toLowerCase() !== "договор заключён";

    return (
        <li
            className={`sale-funnel-stages__list-item ${
                activeStage ? "active" : ""
            }`}
            onClick={() => {
                if (activeStage != stage.instance_id) {
                    getStageDetails(stage.instance_id);
                }
            }}
        >
            <div className="sale-funnel-stages__list-item__row">
                <div className="sale-funnel-stages__list-item__name">
                    <div className={`status ${handleNameClass()}`}>
                        {stage.name}
                    </div>
                </div>

                <div className="sale-funnel-stages__list-item__date">
                    <CustomDatePickerField
                        value={stage.stage_date || ""}
                        onChange={(updated) => {
                            handleActiveStageDate(
                                updated,
                                stage.id,
                                stage.instance_id
                            );
                        }}
                        minDate={maxPrevDate}
                        disabled={!isLast}
                        single={true}
                    />
                </div>

                {stage.hasOwnProperty("next_possible_stages") &&
                    stage.next_possible_stages.length > 0 &&
                    showStageActions &&
                    noActionStages && (
                        <nav className={`rate-switch ${handleStatusClass()}`}>
                            <button
                                type="button"
                                className="rate-switch__button"
                                title="Отказ от участия"
                                onClick={(evt) => {
                                    evt.stopPropagation();

                                    if (confirm("Вы уверены?")) {
                                        handleStage(
                                            stage,
                                            stage.next_possible_stages[1],
                                            "rejected"
                                        );
                                    }
                                }}
                            ></button>

                            <button
                                type="button"
                                className="rate-switch__button"
                                title="Отложить проект"
                                onClick={(evt) => {
                                    evt.stopPropagation();

                                    handleStage(
                                        stage,
                                        stage.next_possible_stages[2],
                                        "postponed"
                                    );
                                }}
                            ></button>

                            <button
                                type="button"
                                className="rate-switch__button"
                                title="Принять"
                                onClick={(evt) => {
                                    evt.stopPropagation();

                                    handleStage(
                                        stage,
                                        stage.next_possible_stages[0],
                                        "success"
                                    );
                                }}
                            ></button>
                        </nav>
                    )}

                {/* Отображаем индикатор примененного действия у этапа, если действия ему больше не доступны */}
                {stage.hasOwnProperty("next_possible_stages") &&
                    showStageDots &&
                    noActionStages && (
                        <div
                            className={`rate-switch ${handleStaticStatusClass()}`}
                        >
                            <div className="rate-switch__button"></div>
                            <div className="rate-switch__button"></div>
                            <div className="rate-switch__button"></div>
                        </div>
                    )}

                {!noActionStages && <div></div>}

                <button
                    type="button"
                    className="sale-funnel-stages__list-item__open-btn"
                    onClick={() => setActiveStage(!activeStage)}
                    title={
                        activeStage
                            ? "Скрыть детализацию"
                            : "Показать детализацию"
                    }
                ></button>
            </div>

            {activeStage && (
                <SaleStageDetails
                    stage={stage}
                    mode={mode}
                    updateStageDetails={updateStageDetails}
                />
            )}
        </li>
    );
};

export default SaleFunnelItem;
