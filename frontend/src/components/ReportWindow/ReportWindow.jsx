import { useState, useEffect, useCallback } from "react";

import getData from "../../utils/getData";
import formatMoney from "../../utils/formatMoney";
import parseDate from "../../utils/parseDate";
import buildQueryParams from "../../utils/buildQueryParams";
import CreatableSelect from "react-select/creatable";

import TeammatesSection from "../TeammatesSection";
import ContractorsSection from "../ContractorsSection";
import DateFields from "../DateField/DateFields";
import DateField from "../DateField/DateField";
import Loader from "../Loader";
import Popup from "../Popup/Popup";

import "./ReportWindow.scss";

const isValidDateRange = (str) => {
    if (!str) return;
    const regex = /^(\d{2})\.(\d{2})\.(\d{4}) - (\d{2})\.(\d{2})\.(\d{4})$/;
    return regex.test(str);
};

const isFirstDateValid = (str) => {
    if (!str) return;
    const match = str.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    return !!match;
};

const isValidDate = (str) => {
    if (!str) return;
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    return regex.test(str);
};

const handleStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case "в работе":
            return "form-field__status_progress";

        case "в процессе":
            return "form-field__status_progress";

        case "завершен":
            return "form-field__status_completed";

        case "завершён":
            return "form-field__status_completed";

        case "отменен":
            return "form-field__status_cancel";

        case "отменён":
            return "form-field__status_cancel";

        case "запланирован":
            return "";

        default:
            return "";
    }
};

const ReportWindow = ({
    reportName,
    reportWindowsState,
    setReportWindowsState,
    contracts,
    reportId,
    projectId,
    updateReport,
    sendReport,
    setReportId,
    mode,
}) => {
    const [reportData, setReportData] = useState({
        report_status_id: "",
        report_type_id: "",
        budget_in_billions: "",
        service_cost_in_rubles: "",
        approval_date: "",
        contract_id: "",
        report_period: "",
        implementation_period: "",
        execution_period: "",
        responsible_persons: [],
        contragents: [],
        show_cost: true,
        regularity: "",
    });

    const [preFillReportData, setPreFillReportData] = useState({});

    const [teammates, setTeammates] = useState([]); // Члены команды
    const [contractors, setContractors] = useState([]); // Подрядчики

    const [reportTypes, setReportTypes] = useState([]);
    const [physicalPersons, setPhysicalPersons] = useState([]);
    const [roles, setRoles] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [reportStatuses, setReportStatuses] = useState([]);
    const [regularityOptions, setRegularityOptions] = useState([]);

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveBeforeClose, setSaveBeforeClose] = useState(false);
    const [isAutoPrefill, setIsAutoPrefill] = useState(false); // Нужно ли предзаполнять отчет

    const [errorMessage, setErrorMessage] = useState("");

    // Валидация полей
    const validateFields = () => {
        const newErrors = {};

        if (!reportData.report_type_id) {
            newErrors.report_type_id = "Тип отчёта обязателен";
        } else {
            if (reportData.show_cost === true) {
                if (
                    !reportData.service_cost_in_rubles ||
                    reportData.service_cost_in_rubles <= 0
                ) {
                    newErrors.service_cost_in_rubles =
                        "Стоимость услуг для этого типа отчета обязательна";
                }
            }
        }

        if (isValidDate(reportData.approval_date)) {
            if (
                !reportData.budget_in_billions ||
                reportData.budget_in_billions <= 0
            ) {
                newErrors.budget_in_billions = "Бюджет должен быть больше 0";
            }

            if (!isValidDateRange(reportData.implementation_period)) {
                newErrors.implementation_period =
                    "Укажите полный период реализации";
            }
        }

        if (!reportData.contract_id) {
            newErrors.contract_id = "Договор обязателен";
        }

        if (!reportData.regularity) {
            newErrors.regularity = "Регулярность обязателена";
        }

        if (!isValidDateRange(reportData.report_period)) {
            newErrors.report_period = "Укажите полный отчетный период";
        }

        if (!isFirstDateValid(reportData.execution_period)) {
            newErrors.execution_period = "Укажите начало периода выполнения";
        } else {
            if (isValidDate(reportData.approval_date)) {
                const today = new Date();
                const approvalDate = parseDate(reportData.approval_date);
                const [startStr, endStr] =
                    reportData.execution_period.split(" - ");

                if (
                    endStr &&
                    isFirstDateValid(endStr) &&
                    isValidDate(reportData.approval_date)
                ) {
                    const endDate = parseDate(endStr);

                    if (approvalDate < endDate) {
                        newErrors.execution_period =
                            "Дата утверждения не может быть раньше даты окончания периода выполнения";
                    } else if (approvalDate > today) {
                        newErrors.execution_period =
                            "Дата утверждения не может быть в будущем от текущей даты";
                    }
                }
            }
        }

        if (reportData.responsible_persons.length === 0) {
            newErrors.responsible_persons =
                "Добавьте хотя бы одного сотрудника";
        } else {
            const invalidResponsiblePersons =
                reportData.responsible_persons.filter(
                    (person) => !person.physical_person_id || !person.role_id
                );

            if (invalidResponsiblePersons.length > 0) {
                newErrors.responsible_persons =
                    "Убедитесь, что у каждого члена команды заполнены все поля";
            }
        }

        if (reportData.contragents.length > 0) {
            const invalidContragents = reportData.contragents.filter(
                (contractor) =>
                    !contractor.contract_id ||
                    !contractor.contragent_id ||
                    !contractor.role_id
            );

            if (invalidContragents.length > 0) {
                newErrors.contragents =
                    "Убедитесь, что у каждого подрядчика заполнены все поля";
            }
        }

        return newErrors;
    };

    // Сохранение отчета
    const handleSave = () => {
        const newErrors = validateFields();

        if (Object.keys(newErrors).length === 0) {
            if (reportId) {
                updateReport(reportData, reportId);
                resetState();
            } else {
                sendReport(reportData);
                resetState();
            }
        } else {
            alert(
                "Исправьте ошибки перед сохранением:\n" +
                    Object.values(newErrors).join("\n")
            );
        }
    };

    // Сброс состояния компонента
    const resetState = () => {
        setErrorMessage("");
        setReportWindowsState(false);
        setSaveBeforeClose(false);
        setIsDataLoaded(false);
        setIsLoading(true);
        setReportId(null);

        setTeammates([]);
        setContractors([]);
        setReportTypes([]);
        setPhysicalPersons([]);
        setRoles([]);
        setSuppliers([]);
        setReportStatuses([]);
        setRegularityOptions([]);
        setReportData({
            report_status_id: "",
            report_type_id: "",
            budget_in_billions: "",
            service_cost_in_rubles: "",
            approval_date: "",
            contract_id: "",
            report_period: "",
            implementation_period: "",
            execution_period: "",
            responsible_persons: [],
            contragents: [],
            show_cost: true,
        });
    };

    // Обработка полей
    const handleInputChange = (e, name) => {
        let value;

        if (
            name === "approval_date" ||
            name === "report_period" ||
            name === "implementation_period" ||
            name === "execution_period" ||
            name === "contract_id"
        ) {
            value = e;
        } else if (name === "report_type_id") {
            value = +e.target.value;
        } else {
            value = e.target.value;
        }

        if (name === "budget_in_billions") {
            value = value.replace(/[^0-9.,]/g, "");
            value = value.replace(".", ",");

            const parts = value.split(",");
            if (parts.length > 2) {
                value = parts[0] + "," + parts[1];
            }

            if (parts[1]?.length > 5) {
                value = `${parts[0]},${parts[1].slice(0, 5)}`;
            }
        }

        if (name === "service_cost_in_rubles") {
            value = formatMoney(value);
        }

        setReportData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Добавление блока заказчика или кредитора
    const addBlock = useCallback((type) => {
        if (type === "teammate") {
            setTeammates((prev) => [...prev, { id: Date.now() }]);
        } else if (type === "contractor") {
            setContractors((prev) => [...prev, { id: Date.now() }]);
        }
    }, []);

    // Обработка селектов команды проекта
    const handleTeammateChange = (index, key, value) => {
        setReportData((prev) => {
            const updatedPersons = [...prev.responsible_persons];
            if (!updatedPersons[index]) {
                updatedPersons[index] = {
                    physical_person_id: null,
                    role_id: null,
                };
            }
            updatedPersons[index][key] = value;
            return { ...prev, responsible_persons: updatedPersons };
        });
    };

    // Обработка селектов подрядчиков
    const handleContractorChange = (index, key, value) => {
        setReportData((prev) => {
            const updatedContractors = [...prev.contragents];
            if (!updatedContractors[index]) {
                updatedContractors[index] = {
                    contragent_id: null,
                    role_id: null,
                    contract_id: null,
                };
            }
            updatedContractors[index][key] = value;
            return { ...prev, contragents: updatedContractors };
        });
    };

    // Удаление сотрудника из teammates
    const removeTeammate = (index) => {
        setTeammates((prev) => {
            const updatedTeammates = [...prev];
            updatedTeammates.splice(index, 1);
            return updatedTeammates;
        });

        setReportData((prev) => {
            const updatedPersons = [...prev.responsible_persons];
            updatedPersons.splice(index, 1);
            return { ...prev, responsible_persons: updatedPersons };
        });
    };

    // Удаление подрядчика из contractors
    const removeContractor = (index) => {
        setContractors((prev) => {
            const updatedContractors = [...prev];
            updatedContractors.splice(index, 1);
            return updatedContractors;
        });

        setReportData((prev) => {
            const updatedContragents = [...prev.contragents];
            updatedContragents.splice(index, 1);
            return { ...prev, contragents: updatedContragents };
        });
    };

    // Выставление статуса отчета
    const validateApprovalDate = () => {
        if (isValidDate(reportData.approval_date)) {
            const today = new Date();
            const approvalDate = parseDate(reportData.approval_date);
            const [startStr, endStr] = reportData.execution_period.split(" - ");

            if (
                endStr &&
                isFirstDateValid(endStr) &&
                isValidDate(reportData.approval_date)
            ) {
                const endDate = parseDate(endStr);

                if (approvalDate < endDate) {
                    setErrorMessage(
                        "Дата утверждения не может быть раньше даты окончания периода выполнения"
                    );
                } else if (approvalDate > today) {
                    setErrorMessage(
                        "Дата утверждения не может быть в будущем от текущей даты"
                    );
                } else {
                    setErrorMessage("");
                    setReportData((prev) => ({
                        ...prev,
                        report_status: "Завершен",
                    }));
                }
            }
        } else {
            if (isFirstDateValid(reportData.execution_period)) {
                const today = new Date();
                const [startStr, endStr] =
                    reportData.execution_period.split(" - ");
                const startDate = parseDate(startStr);

                if (today > startDate) {
                    setReportData((prev) => ({
                        ...prev,
                        report_status: "В работе",
                    }));
                } else if (today < startDate) {
                    setReportData((prev) => ({
                        ...prev,
                        report_status: "Запланирован",
                    }));
                }
            } else {
                setReportData((prev) => ({
                    ...prev,
                    report_status: "",
                }));
            }
        }
    };

    // Обработка значения статуса отчета в селекте
    const handleStatus = () => {
        let statusId;

        switch (reportData.report_status?.toLowerCase()) {
            case "в работе":
                statusId = reportStatuses?.find(
                    (status) => status.name == "В работе"
                )?.id;
                break;

            case "в процессе":
                statusId = reportStatuses?.find(
                    (status) => status.name == "В работе"
                )?.id;
                break;

            case "завершен":
                statusId = reportStatuses?.find(
                    (status) => status.name == "Завершен"
                )?.id;
                break;

            case "завершён":
                statusId = reportStatuses?.find(
                    (status) => status.name == "Завершен"
                )?.id;

                break;

            case "запланирован":
                statusId = reportStatuses?.find(
                    (status) => status.name == "Запланирован"
                )?.id;

                break;

            default:
                statusId = "";
                break;
        }

        setReportData((prev) => ({
            ...prev,
            report_status_id: statusId,
        }));
    };

    // Получение данных для предзаполнения отчета
    const handleReportPrefillUrl = () => {
        const selectedType = reportTypes.find(
            (type) => type.id === +reportData.report_type_id
        );

        if (selectedType) {
            if (
                selectedType.is_regular &&
                reportData.regularity != "" &&
                reportData.regularity != "one_time"
            ) {
                const queryString = buildQueryParams({
                    regularity: [reportData.regularity],
                });

                getReportPrefill(
                    `${
                        import.meta.env.VITE_API_URL
                    }reports/prefill/${projectId}/${
                        selectedType.id
                    }?${queryString}`
                );
            } else if (
                !selectedType.is_regular &&
                reportData.regularity != "" &&
                reportData.regularity == "one_time"
            ) {
                getReportPrefill(
                    `${
                        import.meta.env.VITE_API_URL
                    }reports/prefill/${projectId}/${selectedType.id}`
                );
            }
        }
    };

    // Получение данных отчета для автоподстановки
    const getReportPrefill = (url) => {
        getData(url).then((response) => {
            if (response.status == 200 && response.data.has_prefill_data) {
                setPreFillReportData(response.data.data);

                setIsAutoPrefill(false);
            }
        });
    };

    const handleReportPrefill = () => {
        let result;

        const selectedType = reportTypes.find(
            (type) => type.id === +reportData.report_type_id
        );

        if (selectedType) {
            if (
                selectedType.is_regular &&
                reportData.regularity != "" &&
                reportData.regularity != "one_time"
            ) {
                result = confirm(
                    `Вам доступно автозаполнение отчета. Будут заполнены следующие поля:\n- Отчетный период\n- Бюджет проекта\n- Период реализации\n- Договор\n- Стоимость услуг\n- Период выполнения\n- Команда проекта\n- Подрядчики`
                );
            } else if (
                !selectedType.is_regular &&
                reportData.regularity != "" &&
                reportData.regularity == "one_time"
            ) {
                result = confirm(
                    `Вам доступно автозаполнение отчета. Будут заполнены следующие поля:\n- Договор\n- Стоимость услуг\n- Команда проекта\n- Подрядчики`
                );
            }
        }

        if (result) {
            setPrefillData();
        }
    };

    const setPrefillData = () => {
        // Добавляем основные данные
        setReportData((prev) => ({
            ...prev,
            ...preFillReportData,
        }));

        // Добавляем членов команды
        if (
            preFillReportData.team_members &&
            preFillReportData.team_members.length > 0
        ) {
            setTeammates(preFillReportData.team_members);

            setReportData((prev) => ({
                ...prev,
                responsible_persons: preFillReportData.team_members,
            }));
        }

        // Добавляем подрядчиков
        if (
            preFillReportData.contragents &&
            preFillReportData.contragents.length > 0
        ) {
            setContractors(preFillReportData.contragents);
        }

        setPreFillReportData({});
    };

    // Получение данных отчета
    const fetchReportData = () => {
        getData(`${import.meta.env.VITE_API_URL}reports/${reportId}`).then(
            (response) => {
                setReportData(response.data);

                setTeammates(response.data.responsible_persons);

                setContractors(response.data.contragents);

                setIsLoading(false);
            }
        );
    };

    // Получение полей редактора
    const fetchEditorData = async () => {
        const [
            reportTypesRes,
            physicalPersonsRes,
            suppliersRes,
            rolesRes,
            reportStatusesRes,
            regularityOptionsRes,
        ] = await Promise.allSettled([
            getData(
                `${import.meta.env.VITE_API_URL}report-types?with-count=true`
            ),
            getData(`${import.meta.env.VITE_API_URL}physical-persons`),
            getData(`${import.meta.env.VITE_API_URL}suppliers`),
            getData(`${import.meta.env.VITE_API_URL}roles`),
            getData(`${import.meta.env.VITE_API_URL}report-statuses`),
            getData(
                `${import.meta.env.VITE_API_URL}reports/regularity-options`
            ),
        ]);

        if (reportTypesRes.status === "fulfilled")
            setReportTypes(reportTypesRes.value.data.data); // Получение Типов отчета

        if (physicalPersonsRes.status === "fulfilled") {
            setPhysicalPersons(physicalPersonsRes.value.data); // Получение физ. лиц для команды проекта
        }

        if (suppliersRes.status === "fulfilled")
            setSuppliers(suppliersRes.value.data.data); // Получение подрядчиков

        if (rolesRes.status === "fulfilled") setRoles(rolesRes.value.data.data); // Получение ролей

        if (reportStatusesRes.status === "fulfilled")
            setReportStatuses(reportStatusesRes.value.data); // Получение статусов отчета

        if (regularityOptionsRes.status === "fulfilled")
            setRegularityOptions(regularityOptionsRes.value.data); // Получение статусов отчета

        setIsDataLoaded(true);
    };

    // События зависимости от выбранного типа отчета
    useEffect(() => {
        const selectedType = reportTypes.find(
            (type) => type.id === +reportData.report_type_id
        );

        if (selectedType) {
            setReportData((prev) => ({
                ...prev,
                show_cost: selectedType.show_cost,
                is_regular: selectedType.is_regular,
                ...(selectedType.is_regular === false && {
                    regularity: "one_time",
                }),
            }));
        } else {
            setReportData((prev) => ({
                ...prev,
                regularity: "",
                is_regular: true,
            }));
        }
    }, [reportData.report_type_id]);

    // Обновление статуса проекта в отчете
    useEffect(() => {
        validateApprovalDate();
    }, [reportData.execution_period, reportData.approval_date]);

    useEffect(() => {
        handleStatus();
    }, [reportData.report_status, reportStatuses]);

    useEffect(() => {
        if (isDataLoaded && reportId && reportWindowsState) {
            fetchReportData();
        }
    }, [isDataLoaded, reportId, reportWindowsState]);

    // События для возможной подстановки данных для НОВОГО отчета
    useEffect(() => {
        if (isAutoPrefill && !reportId) {
            handleReportPrefillUrl();
        }
    }, [reportData.report_type_id, reportData.regularity]);

    useEffect(() => {
        if (isDataLoaded) {
            setIsAutoPrefill(!reportId);
        }
    }, [isDataLoaded]);

    useEffect(() => {
        if (reportWindowsState) {
            fetchEditorData();
        }
    }, [reportWindowsState]);

    return !saveBeforeClose ? (
        <div
            className={`bottom-sheet bottom-sheet_desk ${
                reportWindowsState ? "active" : ""
            }`}
            onClick={() => {
                resetState();
            }}
        >
            <div
                className="bottom-sheet__wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet__icon"></div>

                <div className="bottom-sheet__body">
                    {reportWindowsState && (
                        <div
                            className={`report-window form ${
                                mode === "read"
                                    ? "report-window_read-mode read-mode"
                                    : ""
                            }`}
                        >
                            {reportId
                                ? isLoading && <Loader />
                                : !isDataLoaded && <Loader />}

                            <div className="report-window__wrapper">
                                <div className="report-window__header">
                                    <div className="report-window__name">
                                        {reportId
                                            ? reportName
                                                ? reportName
                                                : reportData.report_period_code
                                            : "Создать отчёт"}
                                    </div>
                                </div>

                                {!(reportId ? isLoading : !isDataLoaded) && (
                                    <div className="report-window__body">
                                        {!reportId &&
                                            Object.keys(preFillReportData)
                                                .length > 0 && (
                                                <button
                                                    type="button"
                                                    className="action-button"
                                                    title="Доступно автозаполнение"
                                                    onClick={() =>
                                                        handleReportPrefill()
                                                    }
                                                >
                                                    Доступно автозаполнение
                                                </button>
                                            )}

                                        <div className="report-window__fields">
                                            <div>
                                                {" "}
                                                <label className="form-label">
                                                    Тип отчёта
                                                </label>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            "report_type_id"
                                                        )
                                                    }
                                                    value={
                                                        reportData.report_type_id
                                                    }
                                                    disabled={mode === "read"}
                                                >
                                                    <option value="">
                                                        Выбрать тип
                                                    </option>
                                                    {reportTypes.length > 0 &&
                                                        reportTypes.map(
                                                            (type) => (
                                                                <option
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    value={
                                                                        type.id
                                                                    }
                                                                >
                                                                    {type.name}
                                                                </option>
                                                            )
                                                        )}
                                                </select>
                                            </div>

                                            <div>
                                                {" "}
                                                <label className="form-label">
                                                    Регулярность
                                                </label>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            "regularity"
                                                        )
                                                    }
                                                    value={
                                                        reportData.regularity ||
                                                        ""
                                                    }
                                                    disabled={
                                                        mode === "read" ||
                                                        reportData.is_regular ===
                                                            false
                                                    }
                                                >
                                                    <option value="">
                                                        Выбрать из списка
                                                    </option>
                                                    {regularityOptions.length >
                                                        0 &&
                                                        regularityOptions.map(
                                                            (item) => {
                                                                if (
                                                                    item.alias ===
                                                                        "one_time" &&
                                                                    reportData.is_regular ===
                                                                        true
                                                                ) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <option
                                                                        value={
                                                                            item.alias
                                                                        }
                                                                        key={
                                                                            item.alias
                                                                        }
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="report-window__field">
                                            <label className="form-label">
                                                Отчетный период
                                            </label>

                                            <DateFields
                                                mode={mode}
                                                className={"form-field"}
                                                value={reportData.report_period}
                                                onChange={(val) =>
                                                    setReportData((prev) => ({
                                                        ...prev,
                                                        report_period: val,
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="report-window__fields">
                                            <div>
                                                <label className="form-label">
                                                    Бюджет проекта, млрд руб.
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-field"
                                                    placeholder={`${
                                                        mode === "read"
                                                            ? ""
                                                            : "0.0"
                                                    }`}
                                                    value={reportData.budget_in_billions?.replace(
                                                        ".",
                                                        ","
                                                    )}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            e,
                                                            "budget_in_billions"
                                                        )
                                                    }
                                                    disabled={mode === "read"}
                                                />
                                            </div>

                                            <div>
                                                <label className="form-label">
                                                    Период реализации
                                                </label>

                                                <DateFields
                                                    mode={mode}
                                                    className="form-field"
                                                    value={
                                                        reportData.implementation_period
                                                    }
                                                    onChange={(val) =>
                                                        setReportData(
                                                            (prev) => ({
                                                                ...prev,
                                                                implementation_period:
                                                                    val,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="report-window__field">
                                            <label className="form-label">
                                                Договор
                                            </label>

                                            <CreatableSelect
                                                options={
                                                    contracts.length > 0 &&
                                                    contracts.map((item) => ({
                                                        value: item.id,
                                                        label: item.contract_name,
                                                    }))
                                                }
                                                className="form-select-extend"
                                                placeholder={`${
                                                    mode === "read"
                                                        ? ""
                                                        : "Выберите договор"
                                                }`}
                                                noOptionsMessage={() =>
                                                    "Совпадений нет"
                                                }
                                                isValidNewOption={() => false}
                                                value={
                                                    (contracts.length > 0 &&
                                                        contracts
                                                            ?.map((item) => ({
                                                                value: item.id,
                                                                label: item.contract_name,
                                                            }))
                                                            .find(
                                                                (option) =>
                                                                    option.value ===
                                                                    reportData.contract_id
                                                            )) ||
                                                    null
                                                }
                                                onChange={(selectedOption) => {
                                                    const newValue =
                                                        selectedOption?.value ||
                                                        "";

                                                    handleInputChange(
                                                        newValue,
                                                        "contract_id"
                                                    );
                                                }}
                                                isDisabled={mode === "read"}
                                            />
                                        </div>

                                        <div className="report-window__fields">
                                            {reportData.show_cost === true && (
                                                <div>
                                                    <label className="form-label">
                                                        Стоимость услуг, руб.
                                                    </label>

                                                    <input
                                                        type="text"
                                                        className="form-field"
                                                        placeholder={`${
                                                            mode === "read"
                                                                ? ""
                                                                : "0.0"
                                                        }`}
                                                        value={formatMoney(
                                                            reportData.service_cost_in_rubles
                                                        )}
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                "service_cost_in_rubles"
                                                            )
                                                        }
                                                        disabled={
                                                            mode === "read"
                                                        }
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="form-label">
                                                    Период выполнения
                                                </label>

                                                <DateFields
                                                    mode={mode}
                                                    className={"form-field"}
                                                    value={
                                                        reportData.execution_period
                                                    }
                                                    onChange={(val) =>
                                                        setReportData(
                                                            (prev) => ({
                                                                ...prev,
                                                                execution_period:
                                                                    val,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="report-window__fields">
                                            <div>
                                                <label className="form-label">
                                                    Статус
                                                </label>

                                                <div
                                                    className={`form-field form-field__status ${handleStatusClass(
                                                        reportData.report_status
                                                    )}`}
                                                >
                                                    <span></span>
                                                    <select
                                                        value={
                                                            reportData?.report_status_id
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                e,
                                                                "report_status_id"
                                                            )
                                                        }
                                                        disabled
                                                    >
                                                        <option value=""></option>
                                                        {reportStatuses.map(
                                                            (status) => (
                                                                <option
                                                                    value={
                                                                        status.id
                                                                    }
                                                                    key={
                                                                        status.id
                                                                    }
                                                                >
                                                                    {
                                                                        status.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <label className="form-label">
                                                    Дата утверждения
                                                </label>

                                                <DateField
                                                    mode={mode}
                                                    className="form-field"
                                                    value={
                                                        reportData.approval_date
                                                    }
                                                    onChange={(val) =>
                                                        setReportData(
                                                            (prev) => ({
                                                                ...prev,
                                                                approval_date:
                                                                    val,
                                                            })
                                                        )
                                                    }
                                                />

                                                {errorMessage !== "" && (
                                                    <span className="text-red-400 absolute top-[105%] left-0 text-sm">
                                                        {errorMessage}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="report-window__block">
                                            <b className="report-window__subtitle">
                                                Команда проекта
                                            </b>

                                            {teammates.length > 0 && (
                                                <ul className="person__list">
                                                    {teammates.map(
                                                        (person, index) => (
                                                            <TeammatesSection
                                                                key={index}
                                                                index={index}
                                                                person={person}
                                                                handleTeammateChange={
                                                                    handleTeammateChange
                                                                }
                                                                physicalPersons={
                                                                    physicalPersons
                                                                }
                                                                roles={roles}
                                                                removeTeammate={
                                                                    removeTeammate
                                                                }
                                                                mode={mode}
                                                            />
                                                        )
                                                    )}
                                                </ul>
                                            )}

                                            {mode === "edit" && (
                                                <button
                                                    type="button"
                                                    className="button-add"
                                                    title="Добавить члена команды"
                                                    onClick={() =>
                                                        addBlock("teammate")
                                                    }
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
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="report-window__block">
                                            <b className="report-window__subtitle">
                                                Подрядчики
                                            </b>

                                            {contractors.length > 0 && (
                                                <ul className="person__list">
                                                    {contractors.map(
                                                        (person, index) => (
                                                            <ContractorsSection
                                                                key={index}
                                                                index={index}
                                                                person={person}
                                                                handleContractorChange={
                                                                    handleContractorChange
                                                                }
                                                                suppliers={
                                                                    suppliers
                                                                }
                                                                roles={roles}
                                                                removeContractor={
                                                                    removeContractor
                                                                }
                                                                mode={mode}
                                                            />
                                                        )
                                                    )}
                                                </ul>
                                            )}

                                            {mode === "edit" && (
                                                <button
                                                    type="button"
                                                    className="button-add"
                                                    title="Добавить подрядчика"
                                                    onClick={() =>
                                                        addBlock("contractor")
                                                    }
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
                                                            ></path>
                                                        </svg>
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="bottom-nav">
                                    <div className="container">
                                        {mode === "edit" ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newErrors =
                                                            validateFields();

                                                        if (
                                                            Object.keys(
                                                                newErrors
                                                            ).length === 0
                                                        ) {
                                                            setReportWindowsState(
                                                                false
                                                            );
                                                            setSaveBeforeClose(
                                                                true
                                                            );
                                                        } else {
                                                            setReportId(null);
                                                            setReportWindowsState(
                                                                false
                                                            );
                                                        }
                                                    }}
                                                    className="cancel-button"
                                                    title="Отменить сохранение отчёта"
                                                >
                                                    Отменить
                                                </button>

                                                <button
                                                    type="button"
                                                    className="action-button"
                                                    onClick={() => handleSave()}
                                                    title="Сохранить отчёт"
                                                >
                                                    Сохранить
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    resetState();
                                                }}
                                                style={{ gridColumn: "1 /-1" }}
                                                className="cancel-button"
                                                title="Закрыть отчёт"
                                            >
                                                Закрыть
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : (
        <Popup
            className="report-window-popup"
            onClick={() => resetState()}
            title={"Сохранить отчёт?"}
        >
            <div className="action-form__body">
                <p>Иначе данные будут безвозвратно утеряны.</p>
            </div>

            <div className="action-form__footer">
                <div className="report-window-alert__actions">
                    <button
                        type="button"
                        onClick={() => {
                            resetState();
                        }}
                        className="cancel-button"
                    >
                        Не сохранять
                    </button>

                    <button
                        type="button"
                        className="action-button"
                        onClick={() => handleSave()}
                    >
                        Сохранить отчёт
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default ReportWindow;
