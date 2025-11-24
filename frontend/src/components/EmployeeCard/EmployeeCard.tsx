import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import { format } from "date-fns";
import formatToUtcDateOnly from "../../utils/formatToUtcDateOnly";

import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";

import CustomDatePickerField from "../CustomDatePicker/CustomDatePickerField";
import CreatableSelect from "react-select/creatable";

import EmployeeWorkloadSummary from "./EmployeeWorkloadSummary";
import EmployeeCurrentWorkload from "./EmployeeCurrentWorkload";
import PersonalWorkload from "./PersonalWorkload";

import Loader from "../Loader.js";

import "./EmployeeCard.scss";

const TYPES = [
    { value: "true", label: "Штатный" },
    { value: "false", label: "Внештатный" },
];

const STATUSES = [
    { value: "true", label: "Работает" },
    { value: "false", label: "        Не работает" },
];

const EmployeeCard = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState("edit");
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [cardData, setCardData] = useState({});
    const [cardDataCustom, setCardDataCustom] = useState({});

    const [workload, setworkload] = useState({});
    const [workloadSummary, setWorkloadSummary] = useState();
    const [workloadSummaryMaxPercentage, setWorkloadSummaryMaxPercentage] =
        useState(null);

    const [selectedTypes, setSelecterTypes] = useState("");

    const [reportTypes, setReportTypes] = useState([]);
    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [dateRange, setDateRange] = useState([null, null]);

    const PhoneMask = "+{7} (000) 000 00 00";

    let query;

    // Текущая загрузка
    const getWorkload = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }physical-persons/${employeeId}/workload`
        ).then((response) => {
            if (response.status == 200) {
                setworkload(response.data.workload);
            }
        });
    };

    // Получение свода по трудозатратам
    const getWorkloadSummary = () => {
        const payload = {
            dateFrom: format(dateRange[0], "MM-yyyy"),
            dateTo: format(dateRange[1], "MM-yyyy"),
            reports_ids: selectedTypes,
        };

        getData(
            `${
                import.meta.env.VITE_API_URL
            }physical-persons/${employeeId}/workload-summary`,
            { params: payload }
        ).then((response) => {
            if (response.status === 200) {
                if (response.data.projects.length > 0) {
                    setWorkloadSummary(
                        response.data.projects.sort(
                            (a, b) => b.total_hours - a.total_hours
                        )
                    );
                }

                if (response.data.projects.length > 0) {
                    const maxValue = Math.max(
                        ...response.data.projects.map(
                            (item) => item.load_percentage
                        )
                    );

                    setWorkloadSummaryMaxPercentage(maxValue);
                }
            }
        });
    };

    // Обновление данных сотрудника
    const updateData = (showMessage = true, data = cardDataCustom) => {
        query = toast.loading("Обновление", {
            containerId: "toastContainer",
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}physical-persons/${employeeId}`,
            data
        )
            .then((response) => {
                if (response?.ok) {
                    setCardData((prev) => ({
                        ...prev,
                        ...response.data,
                    }));
                    setCardDataCustom((prev) => ({
                        ...prev,
                        ...response.data,
                    }));

                    if (showMessage) {
                        toast.update(query, {
                            render: "Данные обновлены",
                            type: "success",
                            containerId: "toastContainer",
                            isLoading: false,
                            autoClose: 1000,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            draggable: true,
                            position:
                                window.innerWidth >= 1440
                                    ? "bottom-right"
                                    : "top-right",
                        });
                    }
                } else {
                    toast.error("Ошибка обновления", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "toastContainer",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления данных", {
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

    // Получаем сотрудника
    const getEmployee = async () => {
        setIsDataLoaded(false);

        try {
            const response = await getData(
                `${import.meta.env.VITE_API_URL}physical-persons/${employeeId}`,
                {
                    Accept: "application/json",
                }
            );
            if (response.status === 200) {
                setCardData(response.data);
                setCardDataCustom(response.data);
            }

            await Promise.all([getWorkload(), getPositions(), getTypes()]);

            setIsDataLoaded(true);
        } catch (error) {
            if (error && error.status === 404) {
                navigate("/not-found", {
                    state: {
                        message: "Сотрудник не найден",
                        errorCode: 404,
                        additionalInfo: "",
                    },
                });
            }
        }
    };

    // Получаем типы отчетов
    const getTypes = () => {
        getData(
            `${import.meta.env.VITE_API_URL}report-types?with-count=true`
        ).then((response) => {
            if (response.status === 200) {
                setReportTypes([
                    {
                        value: "",
                        label: "Тип отчётов",
                    },
                    ...response.data.data.map((item) => ({
                        value: item.id,
                        label: item.name,
                    })),
                ]);
            }
        });
    };

    // Получаем список должностей
    const getPositions = () => {
        getData(`${import.meta.env.VITE_API_URL}positions`).then((response) => {
            if (response.status === 200) {
                setPositions(
                    response.data.data.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }))
                );
            }
        });
    };

    // Получение списка подразделений
    const getDepartments = () => {
        getData(`${import.meta.env.VITE_API_URL}departments`).then(
            (response) => {
                if (response.status == 200) {
                    setDepartments(
                        response.data.data.map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))
                    );
                }
            }
        );
    };

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            getWorkloadSummary();
        }
    }, [dateRange, selectedTypes]);

    useEffect(() => {
        if (!cardDataCustom?.is_staff) {
            setCardDataCustom((prev) => ({
                ...prev,
                dismissal_date: null,
                employment_date: null,
                is_active: true,
            }));
        }
    }, [cardDataCustom?.is_staff]);

    useEffect(() => {
        getDepartments();
        getEmployee();
    }, []);

    return !isDataLoaded ? (
        <Loader />
    ) : (
        <main className="page">
            <section
                className={`card employee-card ${
                    mode === "read" ? "read-mode" : ""
                }`}
            >
                <div className="container card__container project-card__container">
                    <ToastContainer containerId="toastContainer" />

                    <div className="card__wrapper project-card__wrapper">
                        <section className="card__main-content project-card__main-content">
                            <div className="card__main-name">
                                <input
                                    type="text"
                                    name="program_name"
                                    value={cardDataCustom?.full_name || ""}
                                    disabled
                                />

                                <span
                                    className={`status
                                    ${
                                        cardDataCustom?.is_active === true
                                            ? "completed"
                                            : ""
                                    }
                                `}
                                >
                                    {cardDataCustom?.is_active
                                        ? "Работает"
                                        : "Не работает"}
                                </span>
                            </div>

                            <section className="card__general-info employee-card__general-info">
                                <div className="card__general-info__row">
                                    <div>
                                        <div className="form-label">
                                            Телефон
                                        </div>

                                        <IMaskInput
                                            mask={PhoneMask}
                                            className="form-field"
                                            name="phone"
                                            type="tel"
                                            inputMode="tel"
                                            placeholder={
                                                mode === "edit"
                                                    ? "+7 999 999 99 99"
                                                    : ""
                                            }
                                            value={
                                                cardDataCustom.phone_number ||
                                                ""
                                            }
                                            onAccept={(value) => {
                                                if (mode === "read") return;

                                                setCardDataCustom((prev) => ({
                                                    ...prev,
                                                    phone_number: value,
                                                }));
                                            }}
                                            onBlur={() => {
                                                if (mode === "read") return;
                                                if (
                                                    cardData?.phone_number !=
                                                    cardDataCustom?.phone_number
                                                ) {
                                                    updateData(true, {
                                                        phone_number:
                                                            cardDataCustom.phone_number,
                                                    });
                                                }
                                            }}
                                            disabled={mode == "read"}
                                        />
                                    </div>

                                    <div>
                                        <div className="form-label">Email</div>

                                        <input
                                            className="form-field"
                                            type="email"
                                            placeholder={
                                                mode === "edit"
                                                    ? "mail@mail.ru"
                                                    : ""
                                            }
                                            value={cardDataCustom.email || ""}
                                            onChange={(e) => {
                                                if (mode === "read") return;

                                                setCardDataCustom((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }));
                                            }}
                                            onBlur={() => {
                                                if (mode === "read") return;
                                                if (
                                                    cardData?.email !=
                                                    cardDataCustom?.email
                                                ) {
                                                    updateData(true, {
                                                        email: cardDataCustom.email,
                                                    });
                                                }
                                            }}
                                            disabled={mode == "read"}
                                        />
                                    </div>
                                </div>

                                <div className="card__general-info__row">
                                    <div className="relative">
                                        <div className="form-label">
                                            Дата приема
                                        </div>

                                        <CustomDatePickerField
                                            value={
                                                cardDataCustom.employment_date
                                            }
                                            onChange={(updated) => {
                                                setCardDataCustom((prev) => ({
                                                    ...prev,
                                                    employment_date:
                                                        formatToUtcDateOnly(
                                                            updated
                                                        ) || null,
                                                }));

                                                updateData(true, {
                                                    employment_date:
                                                        formatToUtcDateOnly(
                                                            updated
                                                        ) || null,
                                                });
                                            }}
                                            disabled={
                                                mode === "read" ||
                                                !cardDataCustom.is_staff
                                            }
                                            single={true}
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="form-label">
                                            Дата увольнения
                                        </div>

                                        <CustomDatePickerField
                                            value={
                                                cardDataCustom?.is_active
                                                    ? null
                                                    : cardDataCustom.dismissal_date
                                            }
                                            onChange={(updated) => {
                                                setCardDataCustom((prev) => ({
                                                    ...prev,
                                                    dismissal_date:
                                                        formatToUtcDateOnly(
                                                            updated
                                                        ) || null,
                                                }));

                                                updateData(true, {
                                                    dismissal_date:
                                                        formatToUtcDateOnly(
                                                            updated
                                                        ) || null,
                                                });
                                            }}
                                            disabled={
                                                mode === "read" ||
                                                cardDataCustom?.is_active ||
                                                !cardDataCustom.is_staff
                                            }
                                            single={true}
                                        />

                                        {!cardDataCustom?.is_active &&
                                            !cardDataCustom.dismissal_date && (
                                                <span className="text-red-400 absolute top-[105%] left-0 text-sm">
                                                    Укажите дату увольнения
                                                </span>
                                            )}
                                    </div>
                                </div>

                                <div className="card__general-info__row">
                                    <div>
                                        <div className="form-label">
                                            Подразделение
                                        </div>

                                        <CreatableSelect
                                            options={departments}
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
                                                (departments.length > 0 &&
                                                    departments.find(
                                                        (item) =>
                                                            item.value ===
                                                            cardDataCustom.department_id
                                                    )) ||
                                                null
                                            }
                                            onChange={(selectedOption) => {
                                                if (mode === "read") return;

                                                const newValue =
                                                    +selectedOption?.value ||
                                                    null;

                                                setCardDataCustom((prev) => ({
                                                    ...prev,
                                                    department_id: newValue,
                                                }));

                                                updateData(true, {
                                                    department_id: newValue,
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

                                    <div>
                                        <div className="form-label">Тип</div>

                                        <CreatableSelect
                                            options={TYPES}
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
                                                (TYPES.length > 0 &&
                                                    TYPES.find(
                                                        (item) =>
                                                            item.value ===
                                                            String(
                                                                cardDataCustom.is_staff
                                                            )
                                                    )) ||
                                                null
                                            }
                                            onChange={(selectedOption) => {
                                                if (mode === "read") return;

                                                const newValue =
                                                    selectedOption?.value ||
                                                    null;

                                                setCardDataCustom((prev) => ({
                                                    ...prev,
                                                    is_staff:
                                                        JSON.parse(newValue),
                                                }));

                                                updateData(true, {
                                                    is_staff:
                                                        JSON.parse(newValue),
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
                                </div>

                                <div className="card__general-info__row">
                                    <div>
                                        <div className="form-label">
                                            Должность
                                        </div>

                                        <CreatableSelect
                                            options={positions}
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
                                                (positions.length > 0 &&
                                                    positions.find(
                                                        (item) =>
                                                            item.value ===
                                                            cardDataCustom.position_id
                                                    )) ||
                                                null
                                            }
                                            onChange={(selectedOption) => {
                                                if (mode === "read") return;

                                                const newValue =
                                                    +selectedOption?.value ||
                                                    null;

                                                setCardDataCustom((prev) => ({
                                                    ...prev,
                                                    position_id: newValue,
                                                }));

                                                updateData(true, {
                                                    position_id: newValue,
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

                                    <div>
                                        <div className="form-label">Статус</div>

                                        {cardDataCustom.is_staff && (
                                            <CreatableSelect
                                                options={STATUSES}
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
                                                    (STATUSES.length > 0 &&
                                                        STATUSES.find(
                                                            (item) =>
                                                                item.value ===
                                                                String(
                                                                    cardDataCustom.is_active
                                                                )
                                                        )) ||
                                                    null
                                                }
                                                onChange={(selectedOption) => {
                                                    if (mode === "read") return;

                                                    const newValue =
                                                        selectedOption?.value ||
                                                        null;

                                                    setCardDataCustom(
                                                        (prev) => ({
                                                            ...prev,
                                                            is_active:
                                                                JSON.parse(
                                                                    newValue
                                                                ),
                                                        })
                                                    );

                                                    if (JSON.parse(newValue)) {
                                                        setCardDataCustom(
                                                            (prev) => ({
                                                                ...prev,
                                                                dismissal_date:
                                                                    null,
                                                            })
                                                        );

                                                        updateData(true, {
                                                            is_active:
                                                                JSON.parse(
                                                                    newValue
                                                                ),
                                                            dismissal_date:
                                                                null,
                                                        });
                                                    } else {
                                                        updateData(true, {
                                                            is_active:
                                                                JSON.parse(
                                                                    newValue
                                                                ),
                                                        });
                                                    }
                                                }}
                                                isDisabled={mode == "read"}
                                                styles={{
                                                    input: (base) => ({
                                                        ...base,
                                                        maxWidth: "100%",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }),
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="employee-card__current-workload">
                                <h2 className="card__subtitle">
                                    Текущая загрузка
                                    <span>{workload.length}</span>
                                </h2>

                                <EmployeeCurrentWorkload projects={workload} />
                            </section>
                        </section>

                        <section className="card__aside-content">
                            <div className="employee-card__workload-summary">
                                <h2 className="card__subtitle">
                                    Свод по трудозатратам, часы
                                </h2>

                                <div className="employee-card__workload-summary__header">
                                    <div>
                                        <CustomDatePickerField
                                            startDate={dateRange[0]}
                                            endDate={dateRange[1]}
                                            onChange={(updated) => {
                                                const { date_from, date_to } =
                                                    updated;

                                                const dates = [
                                                    new Date(
                                                        `${date_from[0]}-01`
                                                    ),
                                                    new Date(
                                                        `${date_to[0]}-01`
                                                    ),
                                                ];

                                                setDateRange(dates);
                                            }}
                                            type="months"
                                            single={false}
                                        />
                                    </div>

                                    <CreatableSelect
                                        options={reportTypes}
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
                                            (reportTypes.length > 0 &&
                                                reportTypes.find(
                                                    (item) =>
                                                        item.value ===
                                                        selectedTypes
                                                )) ||
                                            ""
                                        }
                                        onChange={(selectedOption) => {
                                            if (mode === "read") return;

                                            const newValue =
                                                +selectedOption?.value || "";

                                            setSelecterTypes(newValue);
                                        }}
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

                                <div className="employee-card__workload-summary__body">
                                    <EmployeeWorkloadSummary
                                        workloadSummaryMaxPercentage={
                                            workloadSummaryMaxPercentage
                                        }
                                        workloadSummary={workloadSummary}
                                    />
                                </div>
                            </div>

                            <PersonalWorkload
                                mode={mode}
                                employeeId={employeeId}
                                getWorkloadSummary={getWorkloadSummary}
                            />
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default EmployeeCard;
