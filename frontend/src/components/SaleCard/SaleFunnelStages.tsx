import { useState, useEffect } from "react";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import parseFormattedMoney from "../../utils/parseFormattedMoney";

import SaleFunnelItem from "./SaleFunnelItem";
import Popup from "../Popup/Popup";
import ResumableStages from "./ResumableStages";

import { ToastContainer, toast } from "react-toastify";

const SaleFunnelStages = ({
    saleId,
    saleStages,
    getStages,
    fetchServices,
    setSaleStages,
    mode,
}) => {
    const [popupState, setPopupState] = useState(false);
    const [resumableStages, setResumableStages] = useState([]);
    const [stageMetrics, setStageMetrics] = useState({});

    // Получаем детализацию выбранного этапа
    const getStageDetails = (stageId) => {
        const stageData = saleStages.stages?.find(
            (item) => item.instance_id === stageId
        );

        if (stageData) {
            setStageMetrics(stageData);
            setStageMetrics((prev) => ({
                ...prev,
                stage_id: stageData.id,
            }));
        }
    };

    // Закрепляем дату за этапом
    const setDate = (date, instance_id) => {
        const newDate = new Date(date).toLocaleDateString("ru-RU");

        const [day, month, year] = newDate.split(".");
        const formattedDate = `${year}-${month}-${day}`;

        postData(
            "PATCH",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages/${
                stageMetrics.stage_id
            }/date`,
            { stage_date: formattedDate, stage_instance_id: instance_id }
        )
            .then((response) => {
                if (response.ok) {
                    toast.success(
                        response.message || "Дата этапа успешно обновлена",
                        {
                            containerId: "toastContainerStages",
                            isLoading: false,
                            autoClose: 1200,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            position:
                                window.innerWidth >= 1440
                                    ? "bottom-right"
                                    : "top-right",
                        }
                    );
                } else {
                    toast.error(response.error || "Ошибка запроса", {
                        containerId: "toastContainerStages",
                        isLoading: false,
                        autoClose: 2000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                }
            })
            .catch((response) => {
                toast.error(response.error || "Ошибка запроса", {
                    containerId: "toastContainerStages",
                    isLoading: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            });
    };

    // Обработка даты у этапа
    const handleStageDate = (date, instance_id) => {
        setSaleStages((prev) => {
            const updatedStages = prev.stages.map((stage) => {
                if (stage.instance_id === instance_id) {
                    return {
                        ...stage,
                        stage_date: date,
                    };
                }
                return stage;
            });

            return { ...prev, stages: updatedStages };
        });
        setDate(date, instance_id);
    };

    // Обновляем детализацию этапа продажи
    const updateStageDetails = (stage, nextStage = false, stage_status) => {
        let stageMetricsData = {};

        stageMetricsData.stage_instance_id = stage.instance_id;

        stageMetricsData.metrics = stage.dynamic_metrics.map((item) => ({
            ...item,
            current_value: parseFormattedMoney(item.current_value),
        }));

        stageMetricsData.comment = stage.comment || "";

        postData(
            "PATCH",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages/${stage.id}/metrics`,
            stageMetricsData
        )
            .then((response) => {
                if (response.ok) {
                    getStages();

                    if (nextStage) {
                        requestNextStage(nextStage.id, stage_status);
                    } else {
                        toast.success(response.message, {
                            type: "success",
                            containerId: "toastContainerStages",
                            isLoading: false,
                            autoClose: 1200,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            draggable: true,
                            position:
                                window.innerWidth >= 1440
                                    ? "bottom-right"
                                    : "top-right",
                        });
                        fetchServices();
                    }
                } else {
                    toast.error(response.data.error || "Ошибка запроса", {
                        containerId: "toastContainerStages",
                        isLoading: false,
                        autoClose: 2000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                }
            })
            .catch((response) => {
                toast.error(response.data.error || "Ошибка запроса", {
                    containerId: "toastContainerStages",
                    isLoading: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            });
    };

    // Обработчик переключателя этапа
    const handleStage = (stage, next_stage, action) => {
        if (stage.stage_date) {
            if (stage.next_possible_stages?.selected) {
                requestNextStage(next_stage, action);
            } else {
                handleNextStage(stage, next_stage, action);
            }
        } else {
            toast.error("Выберите дату", {
                containerId: "toastContainerStages",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
        }
    };

    // Предзаполнение метрик нового этапа значениями из предыдущего этапа
    const prefillNextStageMetrics = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages`
        ).then((response) => {
            if (response?.status === 200 && response.data?.stages) {
                const stages = response.data.stages;

                if (stages.length >= 2) {
                    const newStage = stages[stages.length - 1]
                    const previousStage = stages[stages.length - 2]
                    const requiresValidation =
                        newStage.name?.toLowerCase() !== "получен запрос" &&
                        newStage.name?.toLowerCase() !== "проект отложен" &&
                        newStage.name?.toLowerCase() !== "получен отказ" &&
                        newStage.name?.toLowerCase() !== "отказ от участия" &&
                        newStage.name?.toLowerCase() !== "подготовка кп";

                    if (
                        requiresValidation &&
                        newStage.dynamic_metrics?.length > 0 &&
                        previousStage.dynamic_metrics?.length > 0
                    ) {
                        const needsPrefill = newStage.dynamic_metrics.every(
                            (metric) =>
                                metric.current_value === null ||
                                metric.current_value === ""
                        );

                        if (needsPrefill) {
                            const metricsToPrefill = newStage.dynamic_metrics.map(
                                (newMetric) => {
                                    const previousMetric =
                                        previousStage.dynamic_metrics.find(
                                            (pm) =>
                                                pm.report_type_id ===
                                                newMetric.report_type_id
                                        );

                                    return {
                                        ...newMetric,
                                        current_value:
                                            previousMetric?.current_value || null,
                                    };
                                }
                            );

                            const stageMetricsData = {
                                stage_instance_id: newStage.instance_id,
                                metrics: metricsToPrefill.map((item) => ({
                                    ...item,
                                    current_value: parseFormattedMoney(
                                        item.current_value
                                    ),
                                })),
                                comment: newStage.comment || "",
                            };

                            postData(
                                "PATCH",
                                `${
                                    import.meta.env.VITE_API_URL
                                }sales-funnel-projects/${saleId}/stages/${
                                    newStage.id
                                }/metrics`,
                                stageMetricsData
                            )
                                .then((response) => {
                                    if (response.ok) {
                                        getStages();
                                    }
                                })
                                .catch(() => {

                                });
                        }
                    }
                }
            }
        });
    };

    // Запрос следующего этапа в воронке продаж
    const requestNextStage = (stage_id, stage_status) => {
        postData(
            "POST",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages`,
            { stage_id, status: stage_status }
        )
            .then((response) => {
                if (response?.ok) {
                    toast.success(response.message, {
                        type: "success",
                        containerId: "toastContainerStages",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });

                    getStages();


                    if (stage_status === "success") {
                        setTimeout(() => {
                            prefillNextStageMetrics();
                        }, 500);
                    }

                    fetchServices();
                }
            })
            .catch((response) => {
                toast.error(response.error || "Ошибка запроса", {
                    containerId: "toastContainerStages",
                    isLoading: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            });
    };

    // Валидируем поля стоимости предложения перед запросом следующего этапа
    const handleNextStage = (stage, next_stage, stage_status) => {
        if (
            stage_status === "success" &&
            stage.name.toLowerCase() !== "получен запрос" &&
            stage.name.toLowerCase() !== "проект отложен" &&
            stage.name.toLowerCase() !== "получен отказ" &&
            stage.name.toLowerCase() !== "отказ от участия" &&
            stage.name.toLowerCase() !== "подготовка кп"
        ) {
            if (
                stage.dynamic_metrics?.length > 0 &&
                stage.dynamic_metrics?.every(
                    (item) =>
                        item.current_value !== null && item.current_value !== ""
                )
            ) {
                updateStageDetails(stage, next_stage, stage_status);
            } else {
                toast.error("Заполните все поля стоимости предложения", {
                    containerId: "toastContainerStages",
                    isLoading: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            }
        } else {
            updateStageDetails(stage, next_stage, stage_status);
        }
    };

    // Попап возобновление воронки
    const openResumableStagesPopup = () => {
        if (saleStages.stages[saleStages.stages.length - 1]?.stage_date) {
            getData(
                `${
                    import.meta.env.VITE_API_URL
                }sales-funnel-projects/${saleId}/resumable-stages`
            ).then((response) => {
                if (response?.status == 200) {
                    setResumableStages(response.data.stages);
                    setPopupState(true);
                }
            });
        } else {
            toast.error(
                "Необходимо заполнить дату перед возобновлением воронки",
                {
                    containerId: "toastContainerStages",
                    isLoading: false,
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                }
            );
        }
    };

    // Возобновить воронку продаж
    const resumeSaleFunnel = (id) => {
        postData(
            "POST",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/resume`,
            { stage_id: id }
        )
            .then((response) => {
                if (response?.ok) {
                    toast.success(response.message || "Воронка возобновления", {
                        containerId: "toast",
                        isLoading: false,
                        autoClose: 3000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position: "top-center",
                    });

                    getStages();
                    setPopupState(false);
                    setResumableStages([]);
                }
            })
            .catch((error) => {
                toast.error(error.message || "Ошибка возобновления", {
                    containerId: "toast",
                    isLoading: false,
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position: "top-center",
                });
            });
    };

    // Отменить возобновление воронки продаж
    const cancelResumeSaleFunnel = () => {
        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/resume`
        )
            .then((response) => {
                if (response?.ok) {
                    toast.success(
                        response.message || "Возобновление отменено",
                        {
                            containerId: "toast",
                            isLoading: false,
                            autoClose: 3000,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            position:
                                window.innerWidth >= 1440
                                    ? "bottom-right"
                                    : "top-right",
                        }
                    );

                    fetchServices();
                    getStages();
                }
            })
            .catch((error) => {
                toast.error(error.message || "Ошибка отмены", {
                    containerId: "toast",
                    isLoading: false,
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            });
    };

    useEffect(() => {
        if (saleStages.stages && saleStages.stages.length > 0) {
            getStageDetails(
                saleStages.stages[saleStages.stages?.length - 1].instance_id
            );
        }
    }, [saleStages]);

    return (
        <div className="sale-funnel-stages">
            <h2 className="card__subtitle">Воронка продажи</h2>

            <ul className="sale-funnel-stages__list">
                <ToastContainer containerId="toastContainerStages" />

                {saleStages.stages?.length > 0 &&
                    saleStages.stages.map((stage, index, arr) => {
                        const prevStages = arr.slice(0, index);

                        // Максимальная дата среди предшественников
                        const maxPrevDate = prevStages.length
                            ? new Date(
                                  Math.max(
                                      ...prevStages.map((s) =>
                                          s.stage_date
                                              ? new Date(s.stage_date).getTime()
                                              : 0
                                      )
                                  )
                              )
                            : null;

                        const isLast = index === arr.length - 1; // Последний этап

                        const nextStage = arr[index + 1];

                        const showStageDots = index < arr.length - 2; // Показываем только индикаторы
                        const showStageActions = index >= arr.length - 2; // Показываем кнопки для последнего и предпоследнего этапов

                        const showCancelButton =
                            nextStage && nextStage.can_cancel_resume === true;

                        return stage.name.toLowerCase() ==
                            "воронка возобновлена" ||
                            stage.name.toLowerCase() ==
                                "продажа возобновлена" ? (
                            <div
                                key={stage.instance_id}
                                className="text-[#667085] p-[15px] flex flex-wrap items-center gap-[10px]"
                            >
                                {stage.name}

                                {showCancelButton && (
                                    <button
                                        className="cancel-button"
                                        type="button"
                                        title="Отменить возобновление воронки"
                                        onClick={() => {
                                            cancelResumeSaleFunnel();
                                        }}
                                    >
                                        Отменить возобновление
                                    </button>
                                )}
                            </div>
                        ) : (
                            <SaleFunnelItem
                                key={stage.instance_id}
                                stage={stage}
                                handleStage={handleStage}
                                getStageDetails={getStageDetails}
                                maxPrevDate={maxPrevDate}
                                showStageDots={showStageDots}
                                showStageActions={showStageActions}
                                handleStageDate={handleStageDate}
                                updateStageDetails={updateStageDetails}
                                isLast={isLast}
                                mode={mode}
                            />
                        );
                    })}

                {saleStages.stages &&
                (saleStages.stages[
                    saleStages.stages?.length - 1
                ]?.name?.toLowerCase() === "отказ от участия" ||
                    saleStages.stages[
                        saleStages.stages?.length - 1
                    ]?.name?.toLowerCase() === "получен отказ" ||
                    saleStages.stages[
                        saleStages.stages?.length - 1
                    ]?.name?.toLowerCase() === "проект отложен") ? (
                    <button
                        type="button"
                        className="button-active"
                        onClick={() => openResumableStagesPopup()}
                        title="Возобновить воронку"
                    >
                        Возобновить воронку
                    </button>
                ) : null}
            </ul>

            {popupState && (
                <Popup
                    onClick={() => setPopupState(false)}
                    title="Возобновление воронки"
                >
                    <ResumableStages
                        resumableStages={resumableStages}
                        resumeSaleFunnel={resumeSaleFunnel}
                        setPopupState={setPopupState}
                    />
                </Popup>
            )}
        </div>
    );
};

export default SaleFunnelStages;
