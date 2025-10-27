import { useState, useEffect } from "react";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import parseFormattedMoney from "../../utils/parseFormattedMoney";

import SaleFunnelItem from "./SaleFunnelItem";

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

    // const [activeStage, setActiveStage] = useState(null);

    const [stageMetrics, setStageMetrics] = useState({});

    const [metrics, setMetrics] = useState([]); // Прослойка - значения динамических полей в детализации

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
                            containerId: "toastContainer",
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
                        containerId: "toastContainer",
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
                    containerId: "toastContainer",
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
    const handleActiveStageDate = (date, stageId, instance_id) => {
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
    const updateStageDetails = (nextStage = false, stage_status) => {
        // let stageMetricsData = stageMetrics;

        let stageMetricsData = metrics;

        stageMetricsData.stage_instance_id = stageMetrics.instance_id;

        stageMetricsData.metrics = stageMetricsData.metrics.map((item) => ({
            ...item,
            current_value: parseFormattedMoney(item.current_value),
        }));

        postData(
            "PATCH",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages/${
                stageMetrics.stage_id
            }/metrics`,
            stageMetricsData
        )
            .then((response) => {
                if (response.ok) {
                    getStages();

                    if (nextStage) {
                        requestNextStage(nextStage, stage_status);
                    } else {
                        toast.success(response.message, {
                            type: "success",
                            containerId: "toastContainer",
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
                        containerId: "toastContainer",
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
                    containerId: "toastContainer",
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

    // Валидация полей стоимости этапа перед сохранением
    const handleSaveDetails = () => {
        const activeStageData = saleStages.stages.find(
            (item) => item.instance_id === stageMetrics.instance_id
        );

        if (
            activeStageData.name.toLowerCase() !== "получен запрос" &&
            activeStageData.name.toLowerCase() !== "проект отложен" &&
            activeStageData.name.toLowerCase() !== "получен отказ" &&
            activeStageData.name.toLowerCase() !== "отказ от участия" &&
            activeStageData.name.toLowerCase() !== "подготовка кп"
        ) {
            if (
                metrics.metrics?.length > 0 &&
                metrics.metrics?.every(
                    (item) =>
                        item.current_value !== null && item.current_value !== ""
                )
            ) {
                // updateStageDetails();
            } else {
                toast.error("Заполните все поля стоимости предложения", {
                    containerId: "toastContainer",
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
            // updateStageDetails();
        }
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
                        containerId: "toastContainer",
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
                    fetchServices();
                }
            })
            .catch((response) => {
                toast.error(response.error || "Ошибка запроса", {
                    containerId: "toastContainer",
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
    const handleNextStage = (stage_id, name, stage_status) => {
        if (
            stage_status === "success" &&
            name.toLowerCase() !== "получен запрос" &&
            name.toLowerCase() !== "проект отложен" &&
            name.toLowerCase() !== "получен отказ" &&
            name.toLowerCase() !== "отказ от участия" &&
            name.toLowerCase() !== "подготовка кп"
        ) {
            if (
                metrics.metrics?.length > 0 &&
                metrics.metrics?.every(
                    (item) =>
                        item.current_value !== null && item.current_value !== ""
                )
            ) {
                // updateStageDetails(stage_id, stage_status);
            } else {
                toast.error("Заполните все поля стоимости предложения", {
                    containerId: "toastContainer",
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
            // updateStageDetails(stage_id, stage_status);
        }
    };

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
                    containerId: "toast",
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
            // setActiveStage(
            //     saleStages.stages[saleStages.stages?.length - 1].instance_id
            // );
            getStageDetails(
                saleStages.stages[saleStages.stages?.length - 1].instance_id
            );
        }

        // if (activeStage) {
        //     getStageDetails(activeStage);
        // }
    }, [saleStages]);

    return (
        <div className="sale-funnel-stages">
            <h2 className="card__subtitle">Воронка продажи</h2>

            {/* {mode === "edit" && (
                <button
                    type="button"
                    className="save-icon w-[20px] h-[20px]"
                    title="Сохранить детализацию этапа продажи"
                    onClick={() => handleSaveDetails()}
                ></button>
            )} */}

            <ul className="sale-funnel-stages__list">
                <ToastContainer containerId="toast" />

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
                            "воронка возобновлена" ? (
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
                                getStageDetails={getStageDetails}
                                // activeStage={activeStage}
                                maxPrevDate={maxPrevDate}
                                showStageDots={showStageDots}
                                showStageActions={showStageActions}
                                isLast={isLast}
                                // setActiveStage={setActiveStage}
                                handleNextStage={handleNextStage}
                                handleActiveStageDate={handleActiveStageDate}
                                requestNextStage={requestNextStage}
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

                {popupState && (
                    <div
                        className="fixed w-[100vw] h-[100vh] inset-0 z-2 flex items-center justify-center"
                        style={{ background: "rgba(0, 0, 0, 0.2)" }}
                        onClick={() => {
                            setPopupState(false);
                        }}
                    >
                        <div
                            className="bg-white p-6"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className="flex items-center justify-between gap-8 mb-5 text-lg">
                                <b>
                                    Выберите этап для возобновления воронки
                                    продаж
                                </b>

                                <button
                                    type="button"
                                    className="border rounded-[50%] flex items-center justify-center w-[20px] h-[20px] flex-[0_0_20px] leading-4"
                                    style={{ lineHeight: "150%" }}
                                    title="Закрыть окно"
                                    onClick={() => {
                                        setPopupState(false);
                                    }}
                                >
                                    x
                                </button>
                            </div>

                            {resumableStages.length > 0 && (
                                <ul className="grid gap-4">
                                    {resumableStages.map((item) => (
                                        <button
                                            type="button"
                                            className="w-fit text-lg"
                                            key={item.id}
                                            title={`Перейти к этапу ${item.name}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                resumeSaleFunnel(item.id);
                                            }}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </ul>
        </div>
    );
};

export default SaleFunnelStages;
