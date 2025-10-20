import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import DatePicker from "react-datepicker";
import formatToUtcDateOnly from "../../utils/formatToUtcDateOnly";

import { ru } from "date-fns/locale";
import { format } from "date-fns";

import EmployeeWorkloadSummary from "./EmployeeWorkloadSummary";
import EmployeeCurrentWorkload from "./EmployeeCurrentWorkload";
import PersonalWorkload from "./PersonalWorkload";

import CustomDatePickerField from "../CustomDatePicker/CustomDatePickerField";

import Loader from "../Loader.jsx";

import "./EmployeeCard.scss";
import "react-toastify/dist/ReactToastify.css";

// const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// };

const EmployeeCard = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState("edit");
    const [errors, setErrors] = useState({});

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [cardData, setCardData] = useState({});
    const [cardDataCustom, setCardDataCustom] = useState({});

    const [departments, setDepartments] = useState([]);

    const [workload, setworkload] = useState({});

    const [workloadSummary, setWorkloadSummary] = useState();
    const [workloadSummaryMaxPercentage, setWorkloadSummaryMaxPercentage] =
        useState(null);

    const [selectedTypes, setSelecterTypes] = useState([]);

    const [reportTypes, setReportTypes] = useState([]);
    const [positions, setPositions] = useState([]);

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const PhoneMask = "+{7} (000) 000 00 00";

    let query;

    // Свод по трудозатратам, массив доступных дат периода
    // const allowedDates = useMemo(() => {
    //     return datesData.flatMap((yearData) =>
    //         yearData.months.map(
    //             (month) => new Date(yearData.year, month.number - 1, 1)
    //         )
    //     );
    // }, [datesData]);

    const handleSave = () => {
        const newErrors = {
            dismissal_date:
                !cardDataCustom?.is_active && !cardDataCustom.dismissal_date,
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some((err) => err)) return;
        updateEmployee();
    };

    const handleInputChange = (e, name) => {
        let value;

        if (name === "employment_date" || name === "dismissal_date") {
            value = e ? formatToUtcDateOnly(e) : null;
        } else if (name === "phone_number") {
            value = e;
        } else if (name === "is_staff" || name === "is_active") {
            value = JSON.parse(e.target.value);
        } else {
            value = e.target.value;
        }

        setCardData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    const getTypes = () => {
        getData(
            `${import.meta.env.VITE_API_URL}report-types?with-count=true`
        ).then((response) => {
            if (response.status === 200) {
                setReportTypes(response.data.data);
            }
        });
    };

    // Получаем список должностей
    const getPositions = () => {
        getData(`${import.meta.env.VITE_API_URL}positions`).then((response) => {
            if (response.status === 200) {
                setPositions(response.data.data);
            }
        });
    };

    // Получение свода по трудозатратам
    const getWorkloadSummary = () => {
        const payload = {
            dateFrom: format(dateRange[0], "MM-yyyy"),
            dateTo: format(dateRange[1], "MM-yyyy"),
            reports_ids: selectedTypes.join(","),
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
    const updateEmployee = () => {
        query = toast.loading("Обновление", {
            containerId: "toastContainer",
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}physical-persons/${employeeId}`,
            cardDataCustom
        )
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Успешно обновлено!",
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

    // Получение списка подразделений
    const getDepartments = () => {
        getData(`${import.meta.env.VITE_API_URL}departments`).then(
            (response) => {
                if (response.status == 200) {
                    setDepartments(response.data.data);
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
        if (cardDataCustom?.is_active) {
            setCardDataCustom((prev) => ({
                ...prev,
                dismissal_date: null,
            }));
        }
    }, [cardDataCustom?.is_active]);

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

    // Инициируем даты периода в своде по трудозатратам
    useEffect(() => {
        const today = new Date();

        const endDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);

        const startDate = new Date(
            endDate.getFullYear(),
            endDate.getMonth() - 2,
            1
        );

        setDateRange([startDate, endDate]);
    }, []);

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
                                    value={cardDataCustom?.name || ""}
                                    disabled
                                />

                                <span
                                    className={`status
                                    ${
                                        cardDataCustom?.status === "Работает"
                                            ? "completed"
                                            : ""
                                    }
                                `}
                                >
                                    {cardDataCustom?.status}
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
                                            // onAccept={(value) => {
                                            //     if (mode === "read") return;
                                            //     handleInputChange(
                                            //         value || "",
                                            //         "phone_number"
                                            //     );
                                            // }}
                                            // onBlur={() => {
                                            //     if (mode === "read") return;
                                            //     if (
                                            //         cardData?.company_website !=
                                            //         cardDataCustom?.company_website
                                            //     ) {
                                            //         updateData(true, {
                                            //             company_website:
                                            //                 cardDataCustom.company_website,
                                            //         });
                                            //     }
                                            // }}
                                            value={
                                                cardDataCustom.phone_number ||
                                                ""
                                            }
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
                                                handleInputChange(e, "email");
                                            }}
                                            // onBlur={() => {
                                            //     if (mode === "read") return;
                                            //     if (
                                            //         cardData?.company_website !=
                                            //         cardDataCustom?.company_website
                                            //     ) {
                                            //         updateData(true, {
                                            //             company_website:
                                            //                 cardDataCustom.company_website,
                                            //         });
                                            //     }
                                            // }}
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
                                                console.log(updated);

                                                // setCardDataCustom((prev) => ({
                                                //     ...prev,
                                                //     employment_date: updated,
                                                // }));
                                                // updateProject(projectId, true, {
                                                //     contragent_id: newValue,
                                                // });
                                            }}
                                            disabled={
                                                mode === "read" ||
                                                !cardDataCustom.is_staff
                                            }
                                            single={true}
                                        />

                                        {/* <DatePicker
                                            className={`border-2 border-gray-300 p-1 w-full h-[32px] transition ${
                                                !cardDataCustom.is_staff
                                                    ? "bg-gray-100"
                                                    : ""
                                            }`}
                                            selected={
                                                cardDataCustom.employment_date
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    "employment_date"
                                                )
                                            }
                                            dateFormat="dd.MM.yyyy"
                                            disabled={
                                                mode === "read" ||
                                                !cardDataCustom.is_staff
                                            }
                                        /> */}
                                    </div>

                                    <div className="relative">
                                        <div className="form-label">
                                            Дата увольнения
                                        </div>

                                        <CustomDatePickerField
                                            value={
                                                cardDataCustom.dismissal_date
                                            }
                                            onChange={(updated) => {
                                                console.log(updated);

                                                // setCardDataCustom((prev) => ({
                                                //     ...prev,
                                                //     employment_date: updated,
                                                // }));
                                                // updateProject(projectId, true, {
                                                //     contragent_id: newValue,
                                                // });
                                            }}
                                            disabled={
                                                mode === "read" ||
                                                cardDataCustom?.is_active ||
                                                !cardDataCustom.is_staff
                                            }
                                            single={true}
                                        />

                                        {/* <DatePicker
                                            className={`border-2 border-gray-300 p-1 w-full h-[32px] transition ${
                                                cardDataCustom?.is_active ||
                                                !cardDataCustom.is_staff
                                                    ? "bg-gray-100"
                                                    : ""
                                            }`}
                                            selected={
                                                cardDataCustom.dismissal_date
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    "dismissal_date"
                                                )
                                            }
                                            dateFormat="dd.MM.yyyy"
                                            disabled={
                                                mode === "read" ||
                                                cardDataCustom?.is_active ||
                                                !cardDataCustom.is_staff
                                            }
                                        /> */}

                                        {errors.dismissal_date && (
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

                                        {departments.length > 0 && (
                                            <select
                                                className="form-select"
                                                value={
                                                    cardDataCustom.department_id ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        "department_id"
                                                    )
                                                }
                                                disabled={mode == "read"}
                                            >
                                                <option value="">
                                                    Подразделение
                                                </option>
                                                {departments.map((item) => (
                                                    <option
                                                        value={item.id}
                                                        key={item.id}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div>
                                        <div className="form-label">Тип</div>

                                        <select
                                            className="form-select"
                                            value={
                                                String(
                                                    cardDataCustom.is_staff
                                                ) || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(e, "is_staff")
                                            }
                                            disabled={mode == "read"}
                                        >
                                            <option value="true">
                                                штатный
                                            </option>
                                            <option value="false">
                                                внештатный
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="card__general-info__row">
                                    <div>
                                        <div className="form-label">
                                            Должность
                                        </div>

                                        <select
                                            className="form-select"
                                            name="position_id"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    e,
                                                    "position_id"
                                                )
                                            }
                                            value={
                                                cardDataCustom.position_id || ""
                                            }
                                            disabled={mode == "read"}
                                        >
                                            <option value="">
                                                Выбрать должность
                                            </option>
                                            {positions.length > 0 &&
                                                positions.map((position) => (
                                                    <option
                                                        key={position.id}
                                                        value={position.id}
                                                    >
                                                        {position.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="form-label">Статус</div>

                                        {cardDataCustom.is_staff && (
                                            <select
                                                className="form-select"
                                                value={
                                                    String(
                                                        cardDataCustom.is_active
                                                    ) || ""
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        e,
                                                        "is_active"
                                                    )
                                                }
                                                disabled={mode == "read"}
                                            >
                                                <option value="true">
                                                    работает
                                                </option>
                                                <option value="false">
                                                    не работает
                                                </option>
                                            </select>
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

                        <section className="card__aside-content project-card__aside-content employee-card__aside-content">
                            <div className="employee-card__workload-summary">
                                <h2 className="card__subtitle">
                                    Свод по трудозатратам, часы
                                </h2>

                                <div className="employee-card__workload-summary__header">
                                    <DatePicker
                                        className="border-2 border-gray-300 p-1 w-full h-[32px]"
                                        selectsRange
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) =>
                                            setDateRange(update)
                                        }
                                        dateFormat="MM-yyyy"
                                        placeholderText="мм.гггг - мм.гггг"
                                        showMonthYearPicker
                                        // includeDates={allowedDates}
                                        locale={ru}
                                    />

                                    <Select
                                        closeMenuOnSelect={false}
                                        isMulti
                                        name="colors"
                                        options={reportTypes.map((type) => ({
                                            value: type.id,
                                            label: type.name,
                                        }))}
                                        className="basic-multi-select min-w-[170px] min-h-[32px]"
                                        classNamePrefix="select"
                                        placeholder="Выбрать тип отчёта"
                                        onChange={(selectedOptions) => {
                                            setSelecterTypes(
                                                selectedOptions.map(
                                                    (option) => option.value
                                                )
                                            );
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
