import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import CustomSelect from "../CustomSelect/CustomSelect";
import MultiSelect from "../MultiSelect/MultiSelect";
import CreatableSelect from "react-select/creatable";
import AutoResizeTextarea from "../AutoResizeTextarea";

import SaleNewContragentWindow from "./SaleNewContragentWindow";
import SaleServicesList from "./SaleServicesList";
import SaleFunnelStages from "./SaleFunnelStages";

import Popup from "../Popup/Popup";
import Loader from "../Loader";
import Hint from "../Hint/Hint";

import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";

import "./SaleCard.scss";

const handleStatusClass = (status) => {
    if (status.toLowerCase() == "получен запрос") {
        return "";
    } else if (
        status.toLowerCase() == "получен отказ" ||
        status.toLowerCase() == "отказ от участия"
    ) {
        return "status_canceled";
    } else if (status.toLowerCase() == "проект отложен") {
        return "status_completed";
    } else {
        return "status_active";
    }
};

const SaleCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}sales-funnel-projects`;
    // const location = useLocation();
    const { saleId } = useParams();
    const navigate = useNavigate();

    // const [mode, setMode] = useState(location.state?.mode || "read");
    const [mode, setMode] = useState("edit");

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [availableToChange, setAvailableToChange] = useState(true); // Можем ли мы вносить изменения в проект (до закрепления заказчика)

    const [saleStatus, setSaleStatus] = useState(null); // Статус продажи

    const [cardData, setCardData] = useState({
        industries: { main: null, others: [] },
    });

    const [cardDataCustom, setCardDataCustom] = useState({
        industries: { main: null, others: [] },
    });

    const [addCustomer, setAddCustomer] = useState(false); // Добавить заказчика
    const [addServices, setAddServices] = useState(false); // Добавить услугу

    const [industries, setIndustries] = useState([]); // Отрасли
    const [contragents, setContragents] = useState([]); // Заказчики
    const [banks, setBanks] = useState([]); // Банки

    const [physicalPersons, setPhysicalPersons] = useState([]); // Сотрудники
    const [reportTypes, setReportTypes] = useState([]);
    const [services, setServices] = useState([]); // Услуги
    const [sources, setSources] = useState([]); // Источники
    const [saleStages, setSaleStages] = useState([]);

    const [newServices, setNewServices] = useState({ report_type_id: [] });

    let query;

    // Получение сотрудников
    const fetchPhysicalpersons = () => {
        getData(`${import.meta.env.VITE_API_URL}physical-persons`, {
            Accept: "application/json",
        }).then((response) => {
            if (response?.status == 200) {
                if (response?.data?.length > 0) {
                    setPhysicalPersons(
                        response.data?.map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))
                    );
                }
            }
        });
    };

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

                if (response.data.stages && response.data.stages.length > 0) {
                    setSaleStatus(
                        response.data.stages[response.data.stages.length - 1]
                            .name
                    );
                } else {
                    setSaleStatus(null);
                }
            }
        });
    };

    // Получение карточки
    const getCard = async () => {
        setIsDataLoaded(false);

        try {
            const response = await getData(`${URL}/${saleId}`, {
                Accept: "application/json",
            });

            setCardData(response.data);
            setCardDataCustom(response.data);

            await Promise.all([
                fetchPhysicalpersons(),
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

    // Обновление карточки
    const updateCard = async (showMessage = true, data = cardDataCustom) => {
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

    useEffect(() => {
        if (saleId) {
            getCard();
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
            setNewServices({ report_type_id: [] });
        }
    }, [services]);

    // useEffect(() => {
    // const hasErrors =
    //     !cardData?.contragent_id ||
    //     !cardData?.industries?.main ||
    //     !cardData?.request_source_id;

    //     setAvailableToChange(!hasErrors);
    // }, [cardData]);

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
                                            updateCard(true, {
                                                name: cardDataCustom.name,
                                            });
                                        }
                                    }}
                                    disabled={mode == "read"}
                                />

                                {saleStatus && (
                                    <span
                                        className={`status ${handleStatusClass(
                                            saleStatus
                                        )}`}
                                    >
                                        {saleStatus}
                                    </span>
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
                                        </li>
                                    )}
                                </ul>

                                {mode == "edit" && (
                                    <button
                                        type="button"
                                        className="button-add"
                                        onClick={() => setAddCustomer(true)}
                                        title={`${
                                            cardDataCustom.contragent
                                                ?.program_name
                                                ? "Изменить заказчика"
                                                : "Добавить заказчика"
                                        }`}
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

                                            updateCard(true, {
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

                                            updateCard(true, {
                                                industries: {
                                                    ...cardDataCustom.industries,
                                                    others: newArray,
                                                },
                                            });
                                        }}
                                        mode={mode}
                                        isDisabled={
                                            mode == "read" || !availableToChange
                                        }
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
                                            updateCard(true, {
                                                request_source_id: newValue,
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

                                            updateCard(true, {
                                                creditors: newArray,
                                            });
                                        }}
                                        mode={mode}
                                        isDisabled={
                                            mode == "read" || !availableToChange
                                        }
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Ответственный
                                        <Hint message={"Ответственный"} />
                                    </div>
                                    <CreatableSelect
                                        options={physicalPersons}
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
                                            (physicalPersons.length > 0 &&
                                                physicalPersons.find(
                                                    (option) =>
                                                        option.value ===
                                                            cardDataCustom?.responsible_person_id ||
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
                                                responsible_person_id: newValue,
                                            }));
                                            updateCard(true, {
                                                responsible_person_id: newValue,
                                            });
                                        }}
                                        isDisabled={
                                            mode == "read" || !availableToChange
                                        }
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
                                                updateCard(true, {
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
                                                updateCard(true, {
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
                                                updateCard(true, {
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
                            <SaleFunnelStages
                                saleId={saleId}
                                saleStages={saleStages}
                                getStages={getStages}
                                fetchServices={fetchServices}
                                setSaleStages={setSaleStages}
                                mode={mode}
                            />
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
                        updateCard={updateCard}
                        contragents={contragents}
                        createNewContragent={createNewContragent}
                    />
                </Popup>
            )}
        </main>
    );
};
export default SaleCard;
