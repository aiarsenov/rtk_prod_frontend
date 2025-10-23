import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import parseFormattedMoney from "../../utils/parseFormattedMoney";

import CustomSelect from "../CustomSelect/CustomSelect";
import MultiSelect from "../MultiSelect/MultiSelect";
import CreatableSelect from "react-select/creatable";
import AutoResizeTextarea from "../AutoResizeTextarea";

import SaleNewContragentWindow from "./SaleNewContragentWindow";
import SaleServicesList from "./SaleServicesList";
import SaleFunnelStages from "./SaleFunnelStages";
import SaleStageDetails from "./SaleStageDetails";

import Popup from "../Popup/Popup";
import Loader from "../Loader";
import Hint from "../Hint/Hint";

import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./SaleCard.scss";

const SaleCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales-funnel-projects`;
    // const location = useLocation();
    const { saleId } = useParams();
    const navigate = useNavigate();

    // const [mode, setMode] = useState(location.state?.mode || "read");
    const [mode, setMode] = useState("edit");
    const [isFirstInit, setIsFirstInit] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [availableToChange, setAvailableToChange] = useState(true); // Можем ли мы вносить изменения в проект (до закрепления заказчика)

    const [cardData, setCardData] = useState({
        industries: { main: null, others: [] },
    });

    const [cardDataCustom, setCardDataCustom] = useState({
        industries: { main: null, others: [] },
    });

    const [addCustomer, setAddCustomer] = useState(false); // Добавить заказчика
    const [addServices, setAddServices] = useState(false); // Добавить услугу

    const [activeStage, setActiveStage] = useState(null);

    const [industries, setIndustries] = useState([]); // Отрасли
    const [contragents, setContragents] = useState([]); // Заказчики
    const [banks, setBanks] = useState([]); // Банки

    const [reportTypes, setReportTypes] = useState([]);
    const [services, setServices] = useState([]); // Услуги
    const [sources, setSources] = useState([]); // Источники
    const [saleStages, setSaleStages] = useState([]);

    const [newServices, setNewServices] = useState({ report_type_id: [] });
    const [stageMetrics, setStageMetrics] = useState({});

    const [metrics, setMetrics] = useState([]); // Прослойка - значения динамических полей в детализации

    let query;

    const validateFields = () => {
        const newErrors = {};

        if (!cardData?.contragent_id) {
            newErrors.contragent_id = "Необходимо назначить заказчика";
        }

        if (!cardData?.industries.main) {
            newErrors.industries = "Необходимо выбрать отрасль";
        }

        if (!cardData?.request_source_id) {
            newErrors.request_source_id = "Необходимо выбрать источник";
        }

        return newErrors;
    };

    // Обработка ввода данных проекта
    // const handleInputChange = useCallback((e, name) => {
    // if (name == "contragent_id") {
    // setFormFields((prev) => ({ ...prev, [name]: e }));
    // setcardData((prev) => ({ ...prev, [name]: e }));
    // } else {
    // setFormFields((prev) => ({ ...prev, [name]: e.target.value }));
    // setProjectData((prev) => ({ ...prev, [name]: e.target.value }));
    // }
    // }, []);

    // Получение отраслей
    const fetchIndustries = () => {
        getData(`${import.meta.env.VITE_API_URL}industries`, {
            Accept: "application/json",
        }).then((response) => {
            if (response?.status == 200) {
                if (response?.data?.data?.length > 0) {
                    setIndustries(
                        response.data.data.map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))
                    );
                }
            }
        });
    };

    // Получение заказчика
    const fetchContragents = () => {
        getData(`${import.meta.env.VITE_API_URL}contragents?all=true`, {
            Accept: "application/json",
        }).then((response) => {
            if (response?.status == 200) {
                if (response.data.length > 0) {
                    setContragents(
                        response.data.map((item) => ({
                            value: item.id,
                            label: item.program_name,
                        }))
                    );
                }
            }
        });
    };

    // Получение банков
    const fetchBanks = () => {
        getData(`${import.meta.env.VITE_API_URL}banks`).then((response) => {
            if (response?.status == 200) {
                if (response.data.data.length > 0) {
                    setBanks(
                        response.data.data.map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))
                    );
                }
            }
        });
    };

    // Получение услуг
    const fetchServices = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services`
        ).then((response) => {
            if (response?.status == 200) {
                setServices(response.data);

                if (response.data.length > 0) {
                    getStages();
                }
            }
        });
    };

    // Получение источников
    const fetchSources = () => {
        getData(`${import.meta.env.VITE_API_URL}request-sources`).then(
            (response) => {
                if (response?.status == 200) {
                    if (response?.data?.data?.length > 0) {
                        setSources(
                            response.data.data.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))
                        );
                    }
                }
            }
        );
    };

    // Получение тупов отчетов
    const fetchReportTypes = () => {
        getData(`${import.meta.env.VITE_API_URL}report-types`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setReportTypes(response.data.data);
            }
        });
    };

    // Прикрепляем услугу
    const sendService = () => {
        query = toast.loading("Обновление", {
            containerId: "toastContainer",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData(
            "POST",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services`,
            newServices
        )
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: response.message,
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
                    setAddServices(false);
                    fetchServices();
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(
                    error.message ||
                        "Ошибка добавления. Возможно, такая услуга уже добавлена",
                    {
                        containerId: "toastContainer",
                        isLoading: false,
                        autoClose: 3000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    }
                );
            });
    };

    // Удалить услугу
    const deleteService = (id) => {
        query = toast.loading("Обновление", {
            containerId: "toastContainer",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                toast.update(query, {
                    render: response.message,
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
                getStages();

                if (services.length == 0) {
                    setStageMetrics({});
                }
            }
        });
    };

    // Обновление заказчика
    const updateContragent = async (showMessage = true, data) => {
        query = toast.loading("Обновление", {
            containerId: "toastContainer",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        try {
            const response = await postData("PATCH", `${URL}/${saleId}`, data);
            if (response?.ok && showMessage) {
                toast.update(query, {
                    render: "Проект успешно обновлен",
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
            }

            setCardData(response);
            setCardDataCustom(response);

            return response;
        } catch (error) {
            toast.dismiss(query);
            toast.error("Ошибка при обновлении проекта", {
                containerId: "toastContainer",
                isLoading: false,
                autoClose: 1500,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });

            throw error;
        }
    };

    // Создание нового заказчика
    const createNewContragent = (program_name) => {
        postData(
            "POST",
            `${import.meta.env.VITE_API_URL}contragents/sales-funnel`,
            { program_name }
        ).then((response) => {
            if (response?.ok) {
                updateContragent(true, { contragent_id: response.id });
            }
        });
    };

    // Получаем этапы в воронке продаж
    const getStages = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages`
        ).then((response) => {
            if (response?.status == 200) {
                setSaleStages(response.data);
            }
        });
    };

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
                updateStageDetails();
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
            updateStageDetails();
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
                updateStageDetails(stage_id, stage_status);
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
            updateStageDetails(stage_id, stage_status);
        }
    };

    // Получение проекта
    const getProject = async (id) => {
        setIsDataLoaded(false);

        try {
            const response = await getData(`${URL}/${id}`, {
                Accept: "application/json",
            });

            setCardData(response.data);
            setCardDataCustom(response.data);

            await Promise.all([
                fetchIndustries(),
                fetchContragents(),
                fetchBanks(),
                fetchSources(),
                fetchServices(),
                fetchReportTypes(),
            ]);

            setIsDataLoaded(true);
        } catch (error) {
            if (error && error.status === 404) {
                navigate("/not-found", {
                    state: {
                        message: "Проект не найден",
                        errorCode: 404,
                        additionalInfo: "",
                    },
                });
            }
        }
    };

    // Обновление проекта
    const updateProject = async (showMessage = true, data = cardDataCustom) => {
        query = toast.loading("Обновление", {
            containerId: "toastContainer",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("PATCH", `${URL}/${saleId}`, data)
            .then((response) => {
                if (response?.ok) {
                    setCardData(response);
                    setCardDataCustom(response);
                    fetchServices();

                    if (showMessage) {
                        toast.update(query, {
                            render: "Проект успешно обновлен",
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
                    }
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка при обновлении проекта", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 1500,
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

    // Сохранение отчета
    const handleSave = () => {
        const newErrors = validateFields();

        if (Object.keys(newErrors).length === 0) {
            updateProject();
        } else {
            alert(
                "Исправьте ошибки перед сохранением:\n" +
                    Object.values(newErrors).join("\n")
            );
        }
    };

    useEffect(() => {
        if (saleId) {
            getProject(saleId);
        }

        if (services.length > 0) {
            getStages();
        }
    }, []);

    useEffect(() => {
        if (services.length > 0) {
            setNewServices((prev) => ({
                ...prev,
                report_type_id: services.map((item) => item.id),
            }));
        } else {
            setStageMetrics({}); // Сбрасываем состояние при удалении всех услуг для перезагрузки экрана детализации
            setIsFirstInit(true);
            setNewServices({ report_type_id: [] });
        }
    }, [services]);

    useEffect(() => {
        if (saleStages.stages && saleStages.stages.length > 0 && isFirstInit) {
            setActiveStage(
                saleStages.stages[saleStages.stages?.length - 1].instance_id
            );
            getStageDetails(
                saleStages.stages[saleStages.stages?.length - 1].instance_id
            );
            setIsFirstInit(false);
        }

        if (activeStage) {
            getStageDetails(activeStage);
        }
    }, [saleStages]);

    return !isDataLoaded ? (
        <Loader />
    ) : (
        <main className="page">
            <section
                className={`card sale-card ${
                    mode === "read" ? "read-mode" : ""
                }`}
            >
                <div className="container card__container sale-card__container">
                    <ToastContainer containerId="toastContainer" />

                    <div className="card__wrapper project-card__wrapper">
                        <section className="card__main-content sale-card__main-content">
                            <div className="card__main-name">
                                <input
                                    type="text"
                                    name="name"
                                    value={cardDataCustom?.name}
                                    onChange={(e) => {
                                        if (mode === "read") return;
                                        setCardDataCustom((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }));
                                    }}
                                    onBlur={() => {
                                        if (mode === "read") return;
                                        if (
                                            cardData?.name !=
                                            cardDataCustom?.name
                                        ) {
                                            updateProject(true, {
                                                name: cardDataCustom.name,
                                            });
                                        }
                                    }}
                                    disabled={mode == "read"}
                                />

                                <span className={`status`}>Статус</span>
                            </div>

                            <div className="project-card__services">
                                <h2 className="card__subtitle">Услуги</h2>

                                <SaleServicesList
                                    services={services}
                                    deleteService={deleteService}
                                    mode={mode}
                                />

                                {mode == "edit" && availableToChange && (
                                    <button
                                        type="button"
                                        className="button-add"
                                        onClick={() => setAddServices(true)}
                                        title="Добавить услугу"
                                    >
                                        Добавить
                                        <span>
                                            <svg
                                                width="10"
                                                height="9"
                                                viewBox="0 0 10 9"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M5.75 3.75H9.5v1.5H5.75V9h-1.5V5.25H.5v-1.5h3.75V0h1.5v3.75z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                    </button>
                                )}
                            </div>

                            <div className="project-card__services">
                                <h2 className="card__subtitle">Заказчик</h2>

                                <ul className="sale-contragents__list">
                                    {cardDataCustom.contragent
                                        ?.program_name && (
                                        <li className="sale-contragents__list-item">
                                            <div>
                                                {
                                                    cardDataCustom.contragent
                                                        ?.program_name
                                                }
                                            </div>
                                            {/* 
                                        <button
                                            type="button"
                                            className="delete-button sale-contragents__list-item__delete"
                                        >
                                            <svg
                                                width="20"
                                                height="21"
                                                viewBox="0 0 20 21"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M5.833 8v9.166h8.333V8h1.667v10c0 .46-.373.833-.833.833H5A.833.833 0 014.166 18V8h1.667zm3.333 0v7.5H7.5V8h1.666zM12.5 8v7.5h-1.667V8H12.5zm0-5.833c.358 0 .677.229.79.57l.643 1.929h2.733v1.667H3.333V4.666h2.733l.643-1.93a.833.833 0 01.79-.57h5zm-.601 1.666H8.1l-.278.833h4.354l-.277-.833z"
                                                    fill="currentColor"
                                                ></path>
                                            </svg>
                                        </button> */}
                                        </li>
                                    )}
                                </ul>

                                {mode == "edit" && availableToChange && (
                                    <button
                                        type="button"
                                        className="button-add"
                                        onClick={() => setAddCustomer(true)}
                                        title="Добавить заказчика"
                                    >
                                        {!cardDataCustom.contragent
                                            ?.program_name ? (
                                            <>
                                                Добавить
                                                <span>
                                                    <svg
                                                        width="10"
                                                        height="9"
                                                        viewBox="0 0 10 9"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M5.75 3.75H9.5v1.5H5.75V9h-1.5V5.25H.5v-1.5h3.75V0h1.5v3.75z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </span>
                                            </>
                                        ) : (
                                            "Изменить"
                                        )}
                                    </button>
                                )}
                            </div>

                            <section className="card__general-info">
                                <h2 className="card__subtitle">
                                    Общая информация
                                </h2>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Основная отрасль
                                        <Hint message={"Основная отрасль"} />
                                    </div>

                                    <CreatableSelect
                                        options={industries}
                                        className="form-select-extend"
                                        placeholder={
                                            mode === "edit"
                                                ? "Выбрать из списка"
                                                : ""
                                        }
                                        noOptionsMessage={() =>
                                            "Совпадений нет"
                                        }
                                        isValidNewOption={() => false}
                                        value={
                                            (industries.length > 0 &&
                                                industries.find(
                                                    (option) =>
                                                        option.value ===
                                                            cardDataCustom
                                                                ?.industries
                                                                ?.main || ""
                                                )) ||
                                            null
                                        }
                                        onChange={(selectedOption) => {
                                            if (mode === "read") return;

                                            const newValue =
                                                selectedOption?.value || null;

                                            setCardDataCustom({
                                                ...cardDataCustom,
                                                industries: {
                                                    ...cardDataCustom.industries,
                                                    main: newValue,
                                                },
                                            });

                                            updateProject(true, {
                                                industries: {
                                                    ...cardDataCustom.industries,
                                                    main: newValue,
                                                },
                                            });
                                        }}
                                        isDisabled={mode == "read"}
                                        styles={{
                                            input: (base) => ({
                                                ...base,
                                                maxWidth: "100%",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }),
                                        }}
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Дополнительная отрасль
                                        <Hint
                                            message={"Дополнительная отрасль"}
                                        />
                                    </div>

                                    <CustomSelect
                                        type={"checkbox"}
                                        placeholder={
                                            mode === "edit"
                                                ? "Выбрать из списка"
                                                : ""
                                        }
                                        options={industries.filter(
                                            (industry) =>
                                                industry.value !==
                                                cardDataCustom?.industries?.main
                                        )}
                                        selectedValues={
                                            (industries?.length > 0 &&
                                                industries
                                                    .filter((item) =>
                                                        cardDataCustom.industries?.others.includes(
                                                            item.value
                                                        )
                                                    )
                                                    .map(
                                                        (item) => item.value
                                                    )) ||
                                            []
                                        }
                                        onChange={(values) => {
                                            if (mode === "read") return;

                                            const newArray = values.map(
                                                (item) => item.value
                                            );

                                            setCardDataCustom({
                                                ...cardDataCustom,
                                                industries: {
                                                    ...cardDataCustom.industries,
                                                    others: newArray,
                                                },
                                            });

                                            updateProject(true, {
                                                industries: {
                                                    ...cardDataCustom.industries,
                                                    others: newArray,
                                                },
                                            });
                                        }}
                                        mode={mode}
                                        isDisabled={mode == "read"}
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Источник
                                        <Hint message={"Источник"} />
                                    </div>

                                    <CreatableSelect
                                        options={sources}
                                        className="form-select-extend"
                                        placeholder={
                                            mode === "edit"
                                                ? "Выбрать из списка"
                                                : ""
                                        }
                                        noOptionsMessage={() =>
                                            "Совпадений нет"
                                        }
                                        isValidNewOption={() => false}
                                        value={
                                            (sources.length > 0 &&
                                                sources.find(
                                                    (option) =>
                                                        option.value ===
                                                            cardDataCustom?.request_source_id ||
                                                        ""
                                                )) ||
                                            []
                                        }
                                        onChange={(selectedOption) => {
                                            if (mode === "read") return;

                                            const newValue =
                                                selectedOption?.value || null;

                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                request_source_id: newValue,
                                            }));
                                            updateProject(true, {
                                                request_source_id: newValue,
                                            });
                                        }}
                                        isDisabled={mode == "read"}
                                        onMenuOpen={() => {}}
                                        styles={{
                                            input: (base) => ({
                                                ...base,
                                                maxWidth: "100%",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }),
                                        }}
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Банк
                                        <Hint message={"Банк"} />
                                    </div>

                                    <CustomSelect
                                        type={"checkbox"}
                                        placeholder={
                                            mode === "edit"
                                                ? "Выбрать из списка"
                                                : ""
                                        }
                                        options={banks}
                                        selectedValues={(banks || [])
                                            .filter((bank) =>
                                                (
                                                    cardDataCustom?.creditors ??
                                                    []
                                                ).some(
                                                    (creditor) =>
                                                        creditor.id ===
                                                        bank.value
                                                )
                                            )
                                            .map((bank) => bank.value)}
                                        onChange={(values) => {
                                            if (mode === "read") return;

                                            const newArray = values.map(
                                                (item) => item.value
                                            );

                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                creditors: [
                                                    ...(prev.creditors || []),
                                                    ...newArray,
                                                ],
                                            }));

                                            updateProject(true, {
                                                creditors: newArray,
                                            });
                                        }}
                                        mode={mode}
                                        isDisabled={mode == "read"}
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Ответственный
                                        <Hint message={"Ответственный"} />
                                    </div>
                                    <CreatableSelect
                                        // options={contragents}
                                        className="form-select-extend"
                                        placeholder={
                                            mode === "edit"
                                                ? "Выбрать из списка"
                                                : ""
                                        }
                                        noOptionsMessage={() =>
                                            "Совпадений нет"
                                        }
                                        isValidNewOption={() => false}
                                        // value={
                                        //     (contragents.length > 0 &&
                                        //         contragents.find(
                                        //             (option) =>
                                        //                 option.value ===
                                        //                 projectDataCustom?.contragent_id
                                        //         )) ||
                                        //     null
                                        // }
                                        // onChange={(selectedOption) => {
                                        //     if (mode === "read") return;

                                        // const newValue =
                                        //     selectedOption?.value || null;

                                        // setProjectDataCustom((prev) => ({
                                        //     ...prev,
                                        //     contragent_id: newValue,
                                        // }));
                                        // updateProject(projectId, true, {
                                        //     contragent_id: newValue,
                                        // });
                                        // }}
                                        isDisabled={mode == "read"}
                                        styles={{
                                            input: (base) => ({
                                                ...base,
                                                maxWidth: "100%",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }),
                                        }}
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Краткое описание проекта
                                        <Hint
                                            message={"Краткое описание проекта"}
                                        />
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode === "edit"
                                                ? "Например: создание производства заготовки с микрокристаллической структурой..."
                                                : ""
                                        }
                                        type="text"
                                        name="description"
                                        value={
                                            cardDataCustom?.short_description ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            if (mode === "read") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                short_description:
                                                    e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode === "read") return;
                                            if (
                                                cardData?.short_description !=
                                                cardDataCustom?.short_description
                                            ) {
                                                updateProject(true, {
                                                    short_description:
                                                        cardDataCustom.short_description,
                                                });
                                            }
                                        }}
                                        disabled={
                                            mode == "read" || !availableToChange
                                        }
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Местоположение
                                        <Hint message={"Местоположение"} />
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode === "edit"
                                                ? "Страна, город, область..."
                                                : ""
                                        }
                                        value={cardDataCustom?.location || ""}
                                        onChange={(e) => {
                                            if (mode === "read") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                location: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode === "read") return;
                                            if (
                                                cardData?.location !=
                                                cardDataCustom?.location
                                            ) {
                                                updateProject(true, {
                                                    location:
                                                        cardDataCustom.location,
                                                });
                                            }
                                        }}
                                        disabled={
                                            mode == "read" || !availableToChange
                                        }
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        ТЭП
                                        <Hint message={"ТЭП"} />
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode === "edit"
                                                ? "Заполните ТЭП"
                                                : ""
                                        }
                                        value={cardDataCustom?.tep || ""}
                                        onChange={(e) => {
                                            if (mode === "read") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                tep: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode === "read") return;
                                            if (
                                                cardData?.tep !=
                                                cardDataCustom?.tep
                                            ) {
                                                updateProject(true, {
                                                    tep: cardDataCustom.tep,
                                                });
                                            }
                                        }}
                                        disabled={
                                            mode == "read" || !availableToChange
                                        }
                                    />
                                </div>
                            </section>
                        </section>

                        <section className="card__aside-content">
                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Воронка продажи
                                    </span>
                                </div>

                                <div className="border-2 border-gray-300 p-3 h-full overflow-x-hidden overflow-y-auto">
                                    {saleStages.stages?.length > 0 &&
                                        services.length > 0 && (
                                            <SaleFunnelStages
                                                saleId={saleId}
                                                saleStages={saleStages}
                                                handleNextStage={
                                                    handleNextStage
                                                }
                                                getStageDetails={
                                                    getStageDetails
                                                }
                                                activeStage={activeStage}
                                                setActiveStage={setActiveStage}
                                                handleActiveStageDate={
                                                    handleActiveStageDate
                                                }
                                                getStages={getStages}
                                                requestNextStage={
                                                    requestNextStage
                                                }
                                                fetchServices={fetchServices}
                                                mode={mode}
                                            />
                                        )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">
                                        Детализация этапа продажи
                                    </span>
                                    {mode === "edit" && activeStage && (
                                        <button
                                            type="button"
                                            className="save-icon w-[20px] h-[20px]"
                                            title="Сохранить детализацию этапа продажи"
                                            onClick={() => handleSaveDetails()}
                                        ></button>
                                    )}
                                </div>

                                <div className="border-2 border-gray-300 py-5 px-4 h-full">
                                    {activeStage && services.length > 0 && (
                                        <SaleStageDetails
                                            stageMetrics={stageMetrics}
                                            metrics={metrics}
                                            setMetrics={setMetrics}
                                            mode={mode}
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>

            {addServices && (
                <Popup
                    onClick={() => setAddServices(false)}
                    title="Добавить услугу"
                >
                    <div className="action-form__body">
                        <MultiSelect
                            options={reportTypes.map((type) => ({
                                value: type.id,
                                label: type.full_name,
                            }))}
                            selectedValues={newServices.report_type_id ?? []}
                            onChange={(updatedField) => {
                                console.log(updatedField);

                                setNewServices((prev) => ({
                                    ...prev,
                                    ...updatedField,
                                }));
                            }}
                            fieldName="report_type_id"
                        />
                    </div>

                    <div className="action-form__footer">
                        <button
                            type="button"
                            onClick={() => {
                                setAddServices(false);
                                setNewServices((prev) => ({
                                    ...prev,
                                    report_type_id: services.map(
                                        (item) => item.id
                                    ),
                                }));
                            }}
                            className="cancel-button flex-[0_0_fit-content]"
                            title="Отменить добавление услуг"
                        >
                            Отменить
                        </button>

                        <button
                            type="button"
                            className="action-button flex-[0_0_fit-content]"
                            onClick={() => sendService()}
                            title="Применить добавление услуг"
                            disabled={
                                newServices.report_type_id &&
                                Object.keys(newServices.report_type_id)
                                    .length == 0
                            }
                        >
                            Добавить услугу
                        </button>
                    </div>
                </Popup>
            )}

            {addCustomer && (
                <Popup
                    onClick={() => setAddCustomer(false)}
                    title="Добавить заказчика"
                >
                    <SaleNewContragentWindow
                        setAddCustomer={setAddCustomer}
                        updateProject={updateProject}
                        contragents={contragents}
                        createNewContragent={createNewContragent}
                    />
                </Popup>
            )}
        </main>
    );
};
export default SaleCard;
