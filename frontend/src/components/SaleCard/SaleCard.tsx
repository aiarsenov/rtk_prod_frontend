import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import MultiSelect from "../MultiSelect/MultiSelect";
import CreatableSelect from "react-select/creatable";
import AutoResizeTextarea from "../AutoResizeTextarea";
import CardMultiSelector from "../CardMultiSelector/CardMultiSelector";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import SaleNewContragentWindow from "./SaleNewContragentWindow";
import SaleServicesList from "./SaleServicesList";
import SaleFunnelStages from "./SaleFunnelStages";
import SaleAddLeadContactPopup from "./SaleAddLeadContactPopup";

import Popup from "../Popup/Popup";
import Loader from "../Loader";
import Hint from "../Hint/Hint";

import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";

import "./SaleCard.scss";

const SaleCard = () => {
    const userPermitions = useSelector(
        (state) => state.user?.data?.permissions
    );

    const mode = userPermitions?.sales || {
        delete: "read",
        edit: "read",
        view: "read",
    };

    const URL = `${import.meta.env.VITE_API_URL}sales-funnel-projects`;
    const { saleId } = useParams();
    const navigate = useNavigate();

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [saleStatus, setSaleStatus] = useState(null); // Статус продажи
    const [statusClass, setStatusClass] = useState(""); // Цвет статуса

    const [cardData, setCardData] = useState({
        industries: { main: null, others: [] },
    });

    const [cardDataCustom, setCardDataCustom] = useState({
        industries: { main: null, others: [] },
    });

    const [addCustomer, setAddCustomer] = useState(false); // Добавить заказчика
    const [addServices, setAddServices] = useState(false); // Добавить услугу
    const [addLeadContact, setAddLeadContact] = useState(false); // Добавить контакт лида

    const [industries, setIndustries] = useState([]); // Отрасли

    const [banks, setBanks] = useState([]); // Банки

    const [leadContacts, setLeadContacts] = useState([]); // Контакты лидов

    const [physicalPersons, setPhysicalPersons] = useState([]); // Сотрудники
    const [reportTypes, setReportTypes] = useState([]);
    const [services, setServices] = useState([]); // Услуги
    const [sources, setSources] = useState([]); // Источники
    const [saleStages, setSaleStages] = useState([]);

    const [newServices, setNewServices] = useState({ report_type_id: [] });

    // Получение сотрудников
    const fetchPhysicalpersons = () => {
        return getData(`${import.meta.env.VITE_API_URL}physical-persons`, {
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
        return getData(`${import.meta.env.VITE_API_URL}industries`, {
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

    // Получение банков
    const fetchBanks = () => {
        return getData(`${import.meta.env.VITE_API_URL}banks`).then(
            (response) => {
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
            }
        );
    };

    // Получение контактов лидов
    const fetchLeadContacts = () => {
        return getData(
            `${import.meta.env.VITE_API_URL}leads/${1}/contacts`
        ).then((response) => {
            if (response?.status == 200) {
                setLeadContacts(response.data.data.contacts ?? []);
            }
        });
    };

    // Получение услуг
    const fetchServices = () => {
        return getData(
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services`
        ).then((response) => {
            if (response?.status == 200) {
                setServices(response.data);
            }
        });
    };

    // Получение источников
    const fetchSources = () => {
        return getData(`${import.meta.env.VITE_API_URL}request-sources`).then(
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
        return getData(`${import.meta.env.VITE_API_URL}report-types`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setReportTypes(response.data.data);
            }
        });
    };

    // Получаем этапы в воронке продаж
    const getStages = () => {
        return getData(
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/stages`
        ).then((response) => {
            if (response?.status == 200) {
                setSaleStages(response.data);
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

            const transformedData = {
                ...response.data,
                creditors: (response.data.creditors ?? []).map(
                    (bank) => bank.id
                ),
            };

            setCardData(transformedData);
            setCardDataCustom(transformedData);

            await Promise.all([
                fetchPhysicalpersons(),
                fetchIndustries(),
                fetchSources(),
                fetchBanks(),
                fetchReportTypes(),
                fetchServices(),
                getStages(),
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

    // Прикрепляем услугу
    const sendService = () => {
        postData(
            "POST",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services`,
            newServices
        )
            .then((response) => {
                if (response?.ok) {
                    setAddServices(false);
                    fetchServices();
                    getStages();
                }
            })
            .catch((error) => {
                // toast.dismiss(query);
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
        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }sales-funnel-projects/${saleId}/services/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                fetchServices();
                getStages();
            }
        });
    };

    // Удалить услугу
    const deleteLeadContact = (id) => {
        // postData(
        //     "DELETE",
        //     `${
        //         import.meta.env.VITE_API_URL
        //     }sales-funnel-projects/${saleId}/services/${id}`,
        //     {}
        // ).then((response) => {
        //     if (response?.ok) {
        //         fetchServices();
        //         getStages();
        //     }
        // });
    };

    // Обновление заказчика
    const updateContragent = async (showMessage = true, data) => {
        try {
            const response = await postData("PATCH", `${URL}/${saleId}`, data);
            // if (response?.ok && showMessage) {
            // }
            setCardData(response);
            setCardDataCustom(response);

            return response;
        } catch (error) {
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

    // Обновление карточки
    const updateCard = async (showMessage = true, data = cardDataCustom) => {
        postData("PATCH", `${URL}/${saleId}`, data)
            .then((response) => {
                if (response?.ok) {
                    const transformedData = {
                        ...response,
                        creditors: (response.creditors ?? []).map(
                            (bank) => bank.id
                        ),
                    };

                    setCardData(transformedData);
                    setCardDataCustom(transformedData);
                    fetchServices();
                    getStages();
                }
            })
            .catch((error) => {
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
        if (cardData.contragent_id) {
            fetchLeadContacts();
        }
    }, [cardData]);

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

    // Задаем статус в названии карточки
    useEffect(() => {
        if (saleStages?.stages && saleStages?.stages?.length > 0) {
            const stagesWithDate = saleStages?.stages?.filter(
                (item) => item.stage_date
            );

            stagesWithDate.length > 0
                ? setSaleStatus(stagesWithDate[stagesWithDate.length - 1].name)
                : setSaleStatus(null);
        } else {
            setSaleStatus(null);
        }
    }, [saleStages]);

    useEffect(() => {
        if (saleId) {
            getCard();
        }
    }, []);

    return !isDataLoaded ? (
        <Loader />
    ) : (
        <main className="page">
            <section
                className={`card sale-card ${
                    mode.edit !== "full" ? "read-mode" : ""
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
                                        if (mode.edit !== "full") return;
                                        setCardDataCustom((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }));
                                    }}
                                    onBlur={() => {
                                        if (mode.edit !== "full") return;
                                        if (
                                            cardData?.name !=
                                            cardDataCustom?.name
                                        ) {
                                            updateCard(true, {
                                                name: cardDataCustom.name,
                                            });
                                        }
                                    }}
                                    disabled={mode.edit !== "full"}
                                />

                                {saleStatus && (
                                    <span className={`status ${statusClass}`}>
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

                                {mode.edit === "full" && (
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

                                {mode.edit === "full" && (
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
                                            mode.edit === "full"
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
                                            if (mode.edit !== "full") return;

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
                                        isDisabled={mode.edit !== "full"}
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

                                    <CardMultiSelector
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
                                        onChange={(updated) => {
                                            if (mode.edit !== "full") return;

                                            setCardDataCustom({
                                                ...cardDataCustom,
                                                industries: {
                                                    ...cardDataCustom.industries,
                                                    others: updated.others,
                                                },
                                            });
                                        }}
                                        submit={() =>
                                            updateCard(true, {
                                                industries: {
                                                    ...cardDataCustom.industries,
                                                    others: cardDataCustom
                                                        .industries.others,
                                                },
                                            })
                                        }
                                        filedName="others"
                                        popupTitle="Добавить дополнительные отрасли"
                                        buttonTitle="Добавить дополнительную отрасль"
                                        disabled={mode.edit !== "full"}
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
                                            mode.edit === "full"
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
                                            if (mode.edit !== "full") return;

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
                                        isDisabled={mode.edit !== "full"}
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
                                        Ответственный
                                        <Hint message={"Ответственный"} />
                                    </div>
                                    <CreatableSelect
                                        options={physicalPersons}
                                        className="form-select-extend"
                                        placeholder={
                                            mode.edit === "full"
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
                                            if (mode.edit !== "full") return;

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
                                        isDisabled={mode.edit !== "full"}
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
                                            mode.edit === "full"
                                                ? "Например: создание производства заготовки с микрокристаллической структурой..."
                                                : ""
                                        }
                                        value={
                                            cardDataCustom?.short_description ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;

                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                short_description:
                                                    e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;

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
                                        disabled={mode.edit !== "full"}
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        Местоположение
                                        <Hint message={"Местоположение"} />
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea form-textarea_single-line"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Страна, город, область..."
                                                : ""
                                        }
                                        value={cardDataCustom?.location || ""}
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;

                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                location: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;

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
                                        disabled={mode.edit !== "full"}
                                        minHeight={40}
                                    />
                                </div>

                                <div className="card__general-info__block">
                                    <div className="form-label">
                                        ТЭП
                                        <Hint message={"ТЭП"} />
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea form-textarea_single-line"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Заполните ТЭП"
                                                : ""
                                        }
                                        value={cardDataCustom?.tep || ""}
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;

                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                tep: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;

                                            if (
                                                cardData?.tep !=
                                                cardDataCustom?.tep
                                            ) {
                                                updateCard(true, {
                                                    tep: cardDataCustom.tep,
                                                });
                                            }
                                        }}
                                        disabled={mode.edit !== "full"}
                                        minHeight={40}
                                    />
                                </div>
                            </section>

                            <section className="project-card__project-executors">
                                <h2 className="card__subtitle">
                                    Ключевые лица
                                    <Hint message=" ФИО, должность и т.д. доступно только через справочник «Контакты лидов»." />
                                </h2>

                                <ul className="project-card__executors-list">
                                    {leadContacts.length > 0 ? (
                                        leadContacts.map((contanct) => (
                                            <ExecutorBlock
                                                key={contanct.id}
                                                contanct={contanct}
                                                mode={mode}
                                                type={"customer"}
                                                deleteBlock={deleteLeadContact}
                                            />
                                        ))
                                    ) : (
                                        <li className="project-card__executors-list-nodata">
                                            Нет данных
                                        </li>
                                    )}
                                </ul>

                                {mode.edit === "full" && (
                                    <button
                                        type="button"
                                        className="button-add"
                                        onClick={() => {
                                            if (!addLeadContact) {
                                                setAddLeadContact(true);
                                            }
                                        }}
                                        title="Добавить ключевое лицо"
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

                                {/* {addLeadContact && (
                                    <SaleAddLeadContactPopup
                                        supplierId={supplierId}
                                        removeBlock={() =>
                                            setAddRespPerson(false)
                                        }
                                        sendExecutor={sendExecutor}
                                    />
                                )} */}
                            </section>
                        </section>

                        <section className="card__aside-content">
                            <SaleFunnelStages
                                saleId={saleId}
                                saleStages={saleStages}
                                getStages={getStages}
                                fetchServices={fetchServices}
                                setSaleStages={setSaleStages}
                                setStatusClass={setStatusClass}
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
                        createNewContragent={createNewContragent}
                    />
                </Popup>
            )}
        </main>
    );
};
export default SaleCard;
