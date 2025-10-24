import DatePicker from "react-datepicker";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SaleFunnelItem = ({
    stage,
    getStageDetails,
    activeStage,
    maxPrevDate,
    showStageDots,
    showStageActions,
    isLast,
    setActiveStage,
    handleNextStage,
    handleActiveStageDate,
    requestNextStage,
}) => {
    const handleStage = (next_possible_stages, action) => {
        if (stage.stage_date) {
            if (next_possible_stages?.selected) {
                if (action === "rejected") {
                    if (confirm("Вы уверены?")) {
                        requestNextStage(next_possible_stages.id, action);
                    }
                    return;
                } else {
                    requestNextStage(next_possible_stages.id, action);
                }
            } else {
                if (action === "rejected") {
                    if (confirm("Вы уверены?")) {
                        handleNextStage(
                            next_possible_stages.id,
                            stage.name,
                            action
                        );
                    }
                    return;
                } else {
                    handleNextStage(
                        next_possible_stages.id,
                        stage.name,
                        action
                    );
                }
            }
        } else {
            toast.error("Выберите дату", {
                containerId: "container",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
        }
    };

    const handleStatusClass = () => {
        if (stage.next_possible_stages[2]?.selected) {
            return "rate-switch_red";
        } else if (stage.next_possible_stages[1]?.selected) {
            return "rate-switch_orange";
        } else {
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
        <>
            <ToastContainer containerId="container" />

            <li
                className={`sale-funnel-stages__list-item ${
                    activeStage === stage.instance_id ? "active" : ""
                }`}
                onClick={() => {
                    if (activeStage != stage.instance_id) {
                        setActiveStage(stage.instance_id);
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
                        {/* <CustomDatePickerField
                        value={cardDataCustom.employment_date}
                        onChange={(updated) => {
                            setCardDataCustom((prev) => ({
                                ...prev,
                                employment_date:
                                    formatToUtcDateOnly(updated) || null,
                            }));

                            updateData(true, {
                                employment_date:
                                    formatToUtcDateOnly(updated) || null,
                            });
                        }}
                        disabled={mode === "read" || !cardDataCustom.is_staff}
                        single={true}
                    /> */}

                        <DatePicker
                            className="form-field"
                            startDate={stage.stage_date}
                            selected={stage.stage_date || ""}
                            onChange={(date) =>
                                handleActiveStageDate(
                                    date,
                                    stage.id,
                                    stage.instance_id
                                )
                            }
                            dateFormat="dd.MM.yyyy"
                            minDate={maxPrevDate}
                            disabled={!isLast}
                        />
                    </div>

                    {stage.hasOwnProperty("next_possible_stages") &&
                        stage.next_possible_stages.length > 0 &&
                        showStageActions &&
                        noActionStages && (
                            <nav
                                className={`rate-switch ${handleStatusClass()}`}
                            >
                                <button
                                    type="button"
                                    className="rate-switch__button"
                                    title="Отказ от участия"
                                    onClick={(evt) => {
                                        evt.stopPropagation();

                                        handleStage(
                                            stage.next_possible_stages[1],
                                            "rejected"
                                        );
                                    }}
                                ></button>

                                <button
                                    type="button"
                                    className="rate-switch__button"
                                    title="Отложить проект"
                                    onClick={(evt) => {
                                        evt.stopPropagation();

                                        handleStage(
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
                                className={`rate-switch ${handleStatusClass()}`}
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
                    ></button>
                </div>
            </li>
        </>
    );
};

export default SaleFunnelItem;
