import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { canAccess } from "../../utils/permissions";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import { sortDateList } from "../../utils/sortDateList";
import buildQueryParams from "../../utils/buildQueryParams";

import TheadRow from "./TheadRow";
import ReportItem from "./ReportItem";
import ManagementItem from "./ManagementItem";

import ManagementReportEditor from "./ManagementReportEditor";
import ReportRateEditor from "../ReportRateEditor/ReportRateEditor";
import ReportWindow from "../ReportWindow/ReportWindow";
import Loader from "../Loader";
import AccessDenied from "../AccessDenied/AccessDenied";
import "../AccessDenied/AccessDenied.scss";

import OverlayTransparent from "../Overlay/OverlayTransparent";

import { ToastContainer, toast } from "react-toastify";

import "./Reports.scss";

const rateOptions = [
    {
        label: (
            <span className="flex items-center gap-[5px]">
                <span
                    style={{
                        display: "block",
                        background: "var(--color-green-60)",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                    }}
                ></span>
                Проблем нет
            </span>
        ),
        value: 2,
    },
    {
        label: (
            <span className="flex items-center gap-[5px]">
                <span
                    style={{
                        display: "block",
                        background: "var(--color-orange-60)",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                    }}
                ></span>
                Есть сложности
            </span>
        ),
        value: 1,
    },
    {
        label: (
            <span className="flex items-center gap-[5px]">
                <span
                    style={{
                        display: "block",
                        background: "var(--color-red-60)",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                    }}
                ></span>
                Есть проблемы
            </span>
        ),
        value: 0,
    },
];

const Reports = () => {
    const userPermitions = useSelector(
        (state) => state.user?.data?.permissions
    );

    const employeeMode = userPermitions?.employee_reports || {
        delete: "read",
        edit: "read",
        view: "read",
    };

    const projectsMode = userPermitions?.project_reports || {
        delete: "read",
        edit: "read",
        view: "read",
    };

    const user = useSelector((state: any) => state.user.data);
    const REPORTS_URL = `${import.meta.env.VITE_API_URL}reports`;
    const MANAGEMENT_URL = `${import.meta.env.VITE_API_URL}management-reports`;

    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem("reportsActiveTab");
        // Проверяем, что сохраненное значение валидно
        if (saved === "projects" || saved === "management") {
            return saved;
        }
        return "projects";
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isProjectsLoading, setIsProjectsLoading] = useState(true);
    const [isManagementLoading, setIsManagementLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(true);
    const [hasProjectReportsAccess, setHasProjectReportsAccess] =
        useState(true);
    const [hasEmployeeReportsAccess, setHasEmployeeReportsAccess] =
        useState(true);

    const [sortBy, setSortBy] = useState({ key: "", action: "" });

    const [openFilter, setOpenFilter] = useState("");

    const [reportsList, setReportsList] = useState([]);
    const [managementList, setManagementList] = useState([]);
    const [sortedManagementList, setSortedManagementList] = useState([]);

    const [managementEditorState, setManagementEditorState] = useState(false); // Редактор отчёта менеджмента
    const [rateEditorState, setRateEditorState] = useState(false); // Редактор оценки
    const [reportWindowsState, setReportWindowsState] = useState(false); // Редактор отчёта

    const [reportExecutionPeriodQuery, setReportExecutionPeriodQuery] =
        useState(""); // Период выполнение
    const [reportMonthQuery, setReportMonthQuery] = useState(""); // Отчетный месяц

    const [reportData, setReportData] = useState({});
    const [reportName, setReportName] = useState("");
    const [contracts, setContracts] = useState([]);
    const [reportId, setReportId] = useState(null);
    const [managementReportId, setManagementReportId] = useState(null);

    const [managementReportData, setManagementReportData] = useState({
        name: "",
        physical_person_id: 1,
        report_month: "",
        status_summary: "",
        problems: "",
        prospects: "",
        team: "",
        legal_issues: "",
        misc: "",
    });

    // Получение списка отчетов
    const getReports = () => {
        setIsLoading(true);
        setIsProjectsLoading(true);
        setHasAccess(true);
        setHasProjectReportsAccess(true);

        if (Object.keys(reportExecutionPeriodQuery).length > 0) {
            reportExecutionPeriodQuery.date_from =
                reportExecutionPeriodQuery.days_from;

            reportExecutionPeriodQuery.date_to =
                reportExecutionPeriodQuery.days_to;

            delete reportExecutionPeriodQuery.days_from;
            delete reportExecutionPeriodQuery.days_to;
        }

        getData(
            `${REPORTS_URL}?${buildQueryParams(reportExecutionPeriodQuery)}`
        )
            .then((response) => {
                if (response.status === 200) {
                    setReportsList(response.data);
                    setIsProjectsLoading(false);
                }
            })
            .catch((error) => {
                if (error.status === 403) {
                    setHasAccess(false);
                    setHasProjectReportsAccess(false);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Получение списка доступных фильтров
    const getManagementReports = () => {
        setIsLoading(true);
        setIsManagementLoading(true);
        setHasEmployeeReportsAccess(true);

        getData(`${MANAGEMENT_URL}?${buildQueryParams(reportMonthQuery)}`)
            .then((response) => {
                if (response.status === 200) {
                    setManagementList(response.data);
                    setSortedManagementList(response.data);
                    setIsManagementLoading(false);
                }
            })
            .catch((error) => {
                if (error.status === 403) {
                    setHasEmployeeReportsAccess(false);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Открытие окна отчёта проекта
    const openReportEditor = (reportData) => {
        getContracts(reportData.contragent?.id);
        setReportId(reportData.id);

        setReportName(
            `${reportData?.project?.name} / ${reportData?.report_period_code}`
        );

        if (
            reportData.id &&
            `${reportData?.project?.name} / ${reportData?.report_period_code}` !=
                ""
        ) {
            setReportWindowsState(true);
        }
    };

    // Открытие окна редактора оценки отчета
    const openRateReportEditor = (props) => {
        setManagementReportId(props.real_id);
        setReportData(props);
        setRateEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeRateReportEditor = () => {
        setManagementReportId(null);
        setReportData({});
        setRateEditorState(false);
    };

    // Открытие окна редактора отчета менеджмента
    const openManagementReportEditor = (props) => {
        setManagementReportId(props.real_id);
        setManagementReportData(props);
        setManagementEditorState(true);
    };

    // Закрытие окно редактора отчета менеджмента
    const closeManagementReportEditor = () => {
        setManagementReportId(null);
        setManagementReportData({});
        setManagementEditorState(false);
    };

    // Обработчик открытия отчета руководителя с учетов выставленной оценки
    const managementReportEditorHandler = (reportData, rate) => {
        switch (rate) {
            case 0: {
                const newReportData = {
                    ...reportData,
                    general_assessment: 0,
                    show_save_bar: true,
                };
                openRateReportEditor(newReportData);
                break;
            }

            case 1: {
                const newReportData = {
                    ...reportData,
                    general_assessment: 1,
                    show_save_bar: true,
                };
                openRateReportEditor(newReportData);
                break;
            }

            case 2: {
                const newReportData = {
                    ...reportData,
                    general_assessment: 2,
                    bank_assessment: 2,
                    customer_assessment: 2,
                    team_assessment: 2,
                    contractor_assessment: 2,
                };

                updateReportDetails(newReportData, "approve");
                break;
            }

            default:
                break;
        }
    };

    // Обновляем  отчёт менеджмента
    const updateReport = (extendReportData, action) => {
        extendReportData.action = action;

        return postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}management-reports/${
                extendReportData.real_id
            }`,
            extendReportData
        )
            .then((response) => {
                if (response?.ok) {
                    getManagementReports();
                    // Закрываем модальное окно только после успешного сохранения
                    setManagementEditorState(false);
                    return response;
                } else {
                    toast.error("Ошибка обновления данных", {
                        containerId: "report",
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
                    throw new Error("Ошибка обновления данных");
                }
            })
            .catch((error) => {
                toast.error(error.message || "Ошибка при обновлении", {
                    containerId: "report",
                    isLoading: false,
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
                throw error;
            });
    };

    // Обновляем отчет с оценками
    const updateReportDetails = (report, action) => {
        report.action = action;

        return postData(
            "PATCH",
            `${
                import.meta.env.VITE_API_URL
            }management-reports/project-manager/${report.real_id}`,
            report
        )
            .then((response) => {
                if (response?.ok) {
                    const updatedReport = response;
                    setManagementList((prevList) => {
                        const updatedList = prevList.map((item) => {
                            if (
                                item.real_id === updatedReport.real_id ||
                                item.id === updatedReport.id
                            ) {
                                return updatedReport;
                            }
                            return item;
                        });
                        setSortedManagementList(updatedList);
                        return updatedList;
                    });

                    closeRateReportEditor();
                    return response;
                } else {
                    toast.error("Ошибка обновления данных", {
                        containerId: "report",
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
                    throw new Error("Ошибка обновления данных");
                }
            })
            .catch((error) => {
                toast.error(error.message || "Ошибка обновления данных", {
                    containerId: "report",
                    isLoading: false,
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
                throw error;
            });
    };

    // Получение договоров для детального отчёта
    const getContracts = (contragentId) => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }contragents/${contragentId}/contracts`
        ).then((response) => {
            if (response?.status == 200) {
                setContracts(response.data);
            }
        });
    };

    useEffect(() => {
        if (rateEditorState === true) {
            setManagementEditorState(false);
        }
    }, [rateEditorState]);

    useEffect(() => {
        if (managementEditorState === true) {
            setRateEditorState(false);
        }
    }, [managementEditorState]);

    // ОТЧЕТЫ ПРОЕКТОВ //

    // Заполняем селектор Отчетов
    const reportOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.report_period_code)
            .filter((report_period_code) => report_period_code !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор проектов
    const projectOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.project.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор отраслей
    const industryOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.industry)
            .filter((industry) => industry !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор заказчиков
    const contragentOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.contragent.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор банков
    const creditorOptions = useMemo(() => {
        const allItems = reportsList.flatMap((item) =>
            item.creditors?.map((bank) => bank.name)
        );

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор руководителей
    const managerOptions = useMemo(() => {
        const allItems = reportsList.flatMap((item) =>
            item.project_managers?.map((item) => item.name)
        );

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // Заполняем селектор руководителей
    const statusOptions = useMemo(() => {
        const allItems = reportsList
            .map((item) => item.status)
            .filter((status) => status !== null);

        return Array.from(new Set(allItems));
    }, [reportsList]);

    // ОТЧЕТЫ СОТРУДНИКОВ //

    // Заполняем селектор Отчетов
    const managementReportOptions = useMemo(() => {
        const allItems = managementList
            .map((item) => item.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allItems));
    }, [managementList]);

    // Заполняем селектор Ответственных
    const managemenReponsiblePersontOptions = useMemo(() => {
        const allItems = managementList
            .map((item) => item.physical_person?.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allItems));
    }, [managementList]);

    // Заполняем селектор оценок
    const managemenStatusOptions = useMemo(() => {
        const allItems = managementList
            .map((item) => item.status)
            .filter((status) => status !== null);

        return Array.from(new Set(allItems));
    }, [managementList]);

    const COLUMNS = [
        [
            {
                label: "Проект",
                key: "project",
                filter: "selectedProjects",
                options: projectOptions,
            },
            {
                label: "Отчёт",
                key: "report_period_code",
                filter: "selectedReports",
                options: reportOptions,
            },
            {
                label: "Отрасль",
                key: "industry",
                filter: "selectedIndusties",
                options: industryOptions,
            },
            {
                label: "Заказчик",
                key: "contragent",
                filter: "selectedContragents",
                options: contragentOptions,
            },
            {
                label: "Банк",
                key: "creditors",
                filter: "selectedCreditors",
                options: creditorOptions,
            },
            { label: "Бюджет", key: "project_budget" },
            { label: "Срок", key: "implementation_period" },
            {
                label: "Руководитель",
                key: "project_managers",
                filter: "selectedManagers",
                options: managerOptions,
            },
            {
                label: "Период вып.",
                key: "days",
                date: "days",
                dateValue: reportExecutionPeriodQuery,
                setFunc: setReportExecutionPeriodQuery,
            },
            {
                label: "Статус",
                key: "report_status",
                filter: "selectedStatus",
                options: statusOptions,
            },
        ],
        [
            {
                label: "Отчёт",
                key: "name",
                filter: "selectedManagementReports",
                options: managementReportOptions,
                hint_message: `В списке содержатся отчёты двух типов:

- Отчёты менеджмента: задаются в справочнике «Типы отчётов менеджмента» и генерируются автоматически в 00:00 1-го числа за предыдущий месяц.

- Отчёты ответственных за проекты: генерируются автоматически в 00:00 1-го числа за предыдущий месяц по всем проектам, по которым в отчётном месяце велась работа хотя бы по одному отчёту (ФТА, ФТМ, ИЗ и т.д.).`,
                hint_position: "right",
            },
            {
                label: "Отчётный месяц",
                key: "report_month",
                date: "months",
                dateValue: reportMonthQuery,
                setFunc: setReportMonthQuery,
            },
            {
                label: "Оценка",
                key: "score",
                filter: "selectedRates",
                options: rateOptions,
                hint_message: `Оценка ситуации в проекте по итогам отчётного месяца со стороны ответственного: проблем нет, есть сложности, есть проблемы.`,
            },
            {
                label: "Отвественный",
                key: "physical_person",
                filter: "selectedResponsiblePersons",
                options: managemenReponsiblePersontOptions,
                hint_message: `Отчёты генерируются для сотрудников, которым в отчётах проекта (ФТА, ФТМ и т.д.) за отчётный месяц присвоена роль, помеченная как «Ответственный за отчёты по проектам» в справочнике «Роли в проектах».`,
            },
            {
                label: "Статус",
                key: "status",
                filter: "selectedManagementStatus",
                options: managemenStatusOptions,
                hint_message: `- Не начат — ответственный не внёс ни одного сохранённого изменения в отчёт.
- В работе — ответственный выполнил хотя бы одно сохранение изменений, но не утвердил отчёт.
- Утверждён — ответственный завершил работу над отчётом и утвердил его.`,
            },
            {
                label: "Дата утверждения",
                key: "approval_date",
                is_sortable: true,
            },
            { label: "Дата изменения", key: "updated_at" },
        ],
    ];

    const [projectReportsFilters, setProjectReportsFilters] = useState({
        selectedReports: [],
        selectedProjects: [],
        selectedIndusties: [],
        selectedContragents: [],
        selectedCreditors: [],
        selectedManagers: [],
        selectedPeriod: [],
        selectedStatus: [],
    });

    // ОТЧЕТЫ ПРОЕКТОВ //
    const filteredProjectReports = useMemo(() => {
        return reportsList.filter((report) => {
            return (
                (projectReportsFilters.selectedReports.length === 0 ||
                    projectReportsFilters.selectedReports.includes(
                        report.report_period_code
                    )) &&
                (projectReportsFilters.selectedProjects.length === 0 ||
                    projectReportsFilters.selectedProjects.includes(
                        report.project?.name
                    )) &&
                (projectReportsFilters.selectedIndusties.length === 0 ||
                    projectReportsFilters.selectedIndusties.includes(
                        report.industry
                    )) &&
                (projectReportsFilters.selectedContragents.length === 0 ||
                    projectReportsFilters.selectedContragents.includes(
                        report.contragent?.name
                    )) &&
                (projectReportsFilters.selectedCreditors.length === 0 ||
                    report.creditors?.some((c) =>
                        projectReportsFilters.selectedCreditors.includes(c.name)
                    )) &&
                (projectReportsFilters.selectedManagers.length === 0 ||
                    report.project_managers?.some((c) =>
                        projectReportsFilters.selectedManagers.includes(c.name)
                    )) &&
                (projectReportsFilters.selectedStatus.length === 0 ||
                    projectReportsFilters.selectedStatus.includes(
                        report.status
                    ))
            );
        });
    }, [reportsList, projectReportsFilters]);

    const [managementReportsFilters, setManagementReportsFilters] = useState({
        selectedManagementReports: [],
        selectedRates: [],
        selectedResponsiblePersons: [],
        selectedManagementStatus: [],
    });

    // ОТЧЕТЫ СОТРУДНИКОВ //
    const filteredManagementReports = useMemo(() => {
        return managementList.filter((report) => {
            return (
                (managementReportsFilters.selectedManagementReports.length ===
                    0 ||
                    managementReportsFilters.selectedManagementReports.includes(
                        report.name
                    )) &&
                (managementReportsFilters.selectedResponsiblePersons.length ===
                    0 ||
                    managementReportsFilters.selectedResponsiblePersons.includes(
                        report?.physical_person?.name
                    )) &&
                (managementReportsFilters.selectedRates.length === 0 ||
                    managementReportsFilters.selectedRates.includes(
                        report?.general_assessment?.toString()
                    )) &&
                (managementReportsFilters.selectedManagementStatus.length ===
                    0 ||
                    managementReportsFilters.selectedManagementStatus.includes(
                        report.status
                    ))
            );
        });
    }, [managementList, managementReportsFilters]);

    useEffect(() => {
        getReports();
    }, [reportExecutionPeriodQuery]);

    useEffect(() => {
        getManagementReports();
    }, [reportMonthQuery]);

    useEffect(() => {
        setSortedManagementList(
            sortDateList(filteredManagementReports, sortBy)
        );
    }, [sortBy, filteredManagementReports]);

    // Сохраняем активную вкладку в localStorage при изменении
    useEffect(() => {
        try {
            localStorage.setItem("reportsActiveTab", activeTab);
        } catch (error) {}
    }, [activeTab]);

    useEffect(() => {
        if (user) {
            const hasProjectAccess = canAccess(user, "project_reports");
            const hasEmployeeAccess = canAccess(user, "employee_reports");

            if (!hasProjectAccess && !hasEmployeeAccess) {
                setHasAccess(false);
            } else {
                setHasAccess(true);

                // Проверяем доступ к сохраненной вкладке и переключаем на доступную, если нужно
                // Делаем это только один раз при загрузке пользователя
                const savedTab = localStorage.getItem("reportsActiveTab");
                if (
                    savedTab === "projects" &&
                    !hasProjectAccess &&
                    hasEmployeeAccess
                ) {
                    setActiveTab("management");
                    localStorage.setItem("reportsActiveTab", "management");
                } else if (
                    savedTab === "management" &&
                    !hasEmployeeAccess &&
                    hasProjectAccess
                ) {
                    setActiveTab("projects");
                    localStorage.setItem("reportsActiveTab", "projects");
                }
            }
        }
    }, [user]);

    if (!hasAccess) {
        return (
            <AccessDenied message="У вас нет прав для доступа в данный раздел." />
        );
    }

    const checkTabAccess = () => {
        if (activeTab === "projects") {
            return (
                hasProjectReportsAccess && canAccess(user, "project_reports")
            );
        } else if (activeTab === "management") {
            return (
                hasEmployeeReportsAccess && canAccess(user, "employee_reports")
            );
        }
        return true;
    };

    return (
        <main className="page reports-registry">
            <ToastContainer containerId="report" />

            <div className="container registry__container">
                <section className="registry__header flex items-center">
                    <h1 className="title">Реестр отчётов</h1>

                    <ul className="card__tabs">
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                name="active_tab"
                                id="project_reports"
                                checked={activeTab == "projects"}
                                onChange={() => setActiveTab("projects")}
                            />
                            <label htmlFor="project_reports">
                                Отчёты проектов
                                {hasProjectReportsAccess &&
                                    canAccess(user, "project_reports") &&
                                    !isProjectsLoading && (
                                        <span>
                                            {filteredProjectReports.length}
                                        </span>
                                    )}
                            </label>
                        </li>

                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                name="active_tab"
                                id="management_reports"
                                checked={activeTab == "management"}
                                onChange={() => setActiveTab("management")}
                            />
                            <label htmlFor="management_reports">
                                Отчёты сотрудников
                                {hasEmployeeReportsAccess &&
                                    canAccess(user, "employee_reports") &&
                                    !isManagementLoading && (
                                        <span>
                                            {filteredManagementReports.length}
                                        </span>
                                    )}
                            </label>
                        </li>
                    </ul>
                </section>

                <section className="registry__table-section w-full">
                    {openFilter !== "" && (
                        <OverlayTransparent
                            state={true}
                            toggleMenu={() => setOpenFilter("")}
                        />
                    )}

                    {!checkTabAccess() ? (
                        <AccessDenied message="У вас нет прав для доступа в данный раздел." />
                    ) : (
                        <table className="registry-table table-auto w-full border-collapse">
                            <thead className="registry-table__thead">
                                {!isLoading && (
                                    <TheadRow
                                        columns={COLUMNS}
                                        activeTab={activeTab}
                                        projectReportsFilters={
                                            projectReportsFilters
                                        }
                                        managementReportsFilters={
                                            managementReportsFilters
                                        }
                                        setProjectReportsFilters={
                                            setProjectReportsFilters
                                        }
                                        setManagementReportsFilters={
                                            setManagementReportsFilters
                                        }
                                        sortBy={sortBy}
                                        setSortBy={setSortBy}
                                        openFilter={openFilter}
                                        setOpenFilter={setOpenFilter}
                                    />
                                )}
                            </thead>

                            <tbody className="registry-table__tbody">
                                {isLoading ? (
                                    <tr>
                                        <td>
                                            <Loader />
                                        </td>
                                    </tr>
                                ) : activeTab === "projects" ? (
                                    filteredProjectReports.length > 0 &&
                                    filteredProjectReports.map((item) => (
                                        <ReportItem
                                            mode={projectsMode}
                                            key={item.id}
                                            columns={COLUMNS[0]}
                                            props={item}
                                            openReportEditor={openReportEditor}
                                            activeReportId={reportId}
                                        />
                                    ))
                                ) : (
                                    sortedManagementList.length > 0 &&
                                    sortedManagementList.map((item) => (
                                        <ManagementItem
                                            key={item.id}
                                            columns={COLUMNS[1]}
                                            props={item}
                                            mode={employeeMode}
                                            openManagementReportEditor={
                                                openManagementReportEditor
                                            }
                                            openRateReportEditor={
                                                openRateReportEditor
                                            }
                                            managementReportEditorHandler={
                                                managementReportEditorHandler
                                            }
                                            activeReportId={managementReportId}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === "projects" && checkTabAccess() && (
                        <ReportWindow
                            reportWindowsState={reportWindowsState}
                            setReportWindowsState={setReportWindowsState}
                            contracts={contracts}
                            reportId={reportId}
                            setReportId={setReportId}
                            reportName={reportName}
                            mode={{
                                delete: "read",
                                edit: "read",
                                view: "read",
                            }}
                        />
                    )}

                    {activeTab === "management" && checkTabAccess() && (
                        <>
                            <ReportRateEditor
                                rateEditorState={rateEditorState}
                                reportData={reportData}
                                closeEditor={closeRateReportEditor}
                                updateReportDetails={updateReportDetails}
                                mode={employeeMode}
                            />

                            <ManagementReportEditor
                                editorState={managementEditorState}
                                managementReportData={managementReportData}
                                setManagementReportData={
                                    setManagementReportData
                                }
                                updateReport={updateReport}
                                closeEditor={closeManagementReportEditor}
                                mode={employeeMode}
                            />
                        </>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Reports;
