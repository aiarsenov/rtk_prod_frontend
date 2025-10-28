import { useState, useEffect, useRef } from "react";

import getData from "../../../utils/getData";
import buildQueryParams from "../../../utils/buildQueryParams";
import ChartDataLabels from "chartjs-plugin-datalabels";

import Loader from "../../Loader";
import CreatableSelect from "react-select/creatable";
import FinancialMetrics from "./FinancialMetrics";
import Sales from "./Sales";
import GrossMetrics from "./GrossMetrics";
import CompletedReportsList from "./CompletedReportsList";
import EmployeesStats from "./EmployeesStats";
import FinancialIndicators from "./FinancialIndicators";
import ProjectManagerReports from "./ProjectManagerReports";
import ManagerReports from "./ManagerReports";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    LineController,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    LineController,
    PointElement,
    Tooltip,
    Legend,
    ChartDataLabels
);

import { Bar } from "react-chartjs-2";

const Indicators = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [filtertOptions, setFilterOptions] = useState([]);

    const [selectedReportMonth, setSelectedReportMonth] = useState([]); // Отчетный месяц

    const [selectedFilters, setSelectedFilters] = useState({}); // Отчетный месяц, отчетный период

    const [mainFilters, setMainFilters] = useState({}); // Отчетный месяц, отчетный период, заказчик, проект

    const [financialMetrics, setFinancialMetrics] = useState({});

    const [financialList, setFinancialList] = useState({}); // Сортированные ключевые финансовые показатели - Поступления и выручка
    const [financialProfitList, setFinancialProfitList] = useState({}); // Сортированные ключевые финансовые показатели - Выловая прибыль и рентабельность

    const [funnelMetrics, setFunnelMetrics] = useState({}); // Продажи

    const [employeeMetrics, setEmployeeMetrics] = useState({});

    const [contragents, setContragents] = useState([]);
    const [projects, setProjects] = useState([]);

    const [filteredContragents, setFilteredContragents] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    const [completedReports, setCompletedReports] = useState([]);
    const [projectManagerReports, setProjectManagerReports] = useState([]);

    const [financialListFilters, setFinancialListFilters] = useState({
        type: ["project"],
        metric: ["revenue"],
    });

    const [financialProfitListFilters, setFinancialProfitListFilters] =
        useState({
            type: ["project"],
            metric: ["gross_profit"],
        });

    const [employeeFilters, setEmployeeFilters] = useState({
        view_type: ["headcount"],
        metric_type: ["headcount"],
    });

    const hasInitialized = useRef(false);

    const hasCalledListOnSelected = useRef(false);

    const hasCalledProfitListOnSelected = useRef(false);

    const hasCalledMainMetricsOnSelected = useRef(false);

    const hasEmployeeMetricsOnSelected = useRef(false);

    const isFinancialListFiltersReady =
        Object.keys(financialListFilters).length > 2;

    const isFinancialProfitListFiltersReady =
        Object.keys(financialProfitListFilters).length > 2;

    const isMainFiltersReady = Object.keys(mainFilters).length > 1;

    const isEmployeeMetricsFiltersReady =
        Object.keys(employeeFilters).length > 3;

    const financialMetricsData = {
        labels: financialMetrics.monthly_chart?.map((item) => item.month),
        datasets: [
            {
                label: "",
                data: financialMetrics.monthly_chart?.map((item) =>
                    parseFloat(item.revenue?.toString().replace(",", "."))
                ),
                backgroundColor: "black",
                categoryPercentage: 0.5,
                stack: "stack1",
                borderRadius: 2,
            },
            {
                label: "",
                data: financialMetrics.monthly_chart?.map((item) =>
                    parseFloat(item.receipts?.toString().replace(",", "."))
                ),
                backgroundColor: "rgba(204, 204, 204, 0.5)",
                categoryPercentage: 0.5,
                stack: "stack2",
                borderRadius: 2,
            },
        ],
    };

    const grossMetricsData = {
        labels: financialMetrics.monthly_chart?.map((item) => item.month),
        datasets: [
            {
                type: "line",
                label: "",
                data: financialMetrics.monthly_chart?.map((item) =>
                    parseFloat(item.gross_margin?.toString().replace(",", "."))
                ),
                backgroundColor: "rgba(204, 204, 204, 1)",
                borderColor: "rgba(204, 204, 204, 1)",
                borderWidth: 2,
                fill: false,
                pointBackgroundColor: "#ccc",
                pointRadius: 4,
                tension: 0.3,
                yAxisID: "y1",
            },
            {
                type: "bar",
                label: "",
                data: financialMetrics.monthly_chart?.map((item) =>
                    parseFloat(item.gross_profit?.toString().replace(",", "."))
                ),
                backgroundColor: "black",
                categoryPercentage: 0.5,
                stack: "stack1",
                borderRadius: 2,
                yAxisID: "y",
            },
        ],
    };

    const verticalOptions = {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: "",
            },
            datalabels: false,

            tooltip: {
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        const month = context.label;
                        const value = context.raw;

                        const formattedValue = value
                            ? value.toLocaleString("ru-RU", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                              })
                            : "—";

                        let labelText = "";
                        if (context.datasetIndex === 0) {
                            labelText = "Выручка, млн руб.";
                        } else if (context.datasetIndex === 1) {
                            labelText = "Поступления, млн руб.";
                        }

                        return [month, labelText, formattedValue];
                    },
                    title: () => "",
                },
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                ticks: {
                    // display: false,
                },
            },
        },
    };

    const verticalOptions2 = {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        indexAxis: "x",
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            datalabels: false,
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        const month = context.label;
                        const value = context.raw;

                        let formattedValue = "—";
                        if (typeof value === "number" && !isNaN(value)) {
                            formattedValue = value.toLocaleString("ru-RU", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            });
                        }

                        let labelText = "";
                        if (context.datasetIndex === 0) {
                            labelText = "Валовая рентаб.";
                            formattedValue = `${formattedValue}%`;
                        } else if (context.datasetIndex === 1) {
                            labelText = "Валовая прибыль, млн руб.";
                        }

                        return [month, labelText, formattedValue];
                    },
                    title: () => "",
                },
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Валовая прибыль, млн руб.",
                },
            },
            y1: {
                beginAtZero: true,
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: "Валовая рентаб., %",
                },
            },
        },
    };

    // Добавляем значение отчетного месяца и периода в параметры запроса
    const handleFilterChange = (filterKey, value) => {
        const filteredValues = value.filter((v) => v !== "");

        setSelectedReportMonth({
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        });

        setSelectedFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));

        setFinancialListFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));

        setFinancialProfitListFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));

        setMainFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));

        setEmployeeFilters((prev) => ({
            ...prev,
            [filterKey]: filteredValues.length > 0 ? filteredValues : [],
        }));
    };

    // Получаем доступные фильтры
    const getFilterOptions = () => {
        getData(`${import.meta.env.VITE_API_URL}company/filter-options`).then(
            (response) => {
                if (response?.status == 200) {
                    setFilterOptions(response.data);

                    const periodValue = response.data.periods[1]?.value;
                    const reportMonthValue = response.data.months[1]?.value
                        ? response.data.months[1]?.value
                        : response.data.months[0]?.value;

                    setSelectedReportMonth({
                        report_month: [reportMonthValue],
                    });

                    setSelectedFilters({
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    });

                    setMainFilters((prev) => ({
                        ...prev,
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    }));

                    setFinancialListFilters((prev) => ({
                        ...prev,
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    }));

                    setFinancialProfitListFilters((prev) => ({
                        ...prev,
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    }));

                    setEmployeeFilters((prev) => ({
                        ...prev,
                        period: [periodValue],
                        report_month: [reportMonthValue],
                    }));
                }
            }
        );
    };

    // Получение сотрудников
    const getEmployeeMetrics = () => {
        const queryString = buildQueryParams(employeeFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company-metrics/employee-metrics?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setEmployeeMetrics(response.data);
            }
        });
    };

    // Получение завершенных отчетов
    const getCompletedReports = () => {
        const queryString = buildQueryParams(mainFilters);

        getData(
            `${import.meta.env.VITE_API_URL}completed-reports?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setCompletedReports(response.data);
            }
        });
    };

    // Получение отчетов руководителя проектов
    const getProjectManagerReports = () => {
        const query = {
            ...mainFilters,
            ...selectedReportMonth,
        };

        const queryString = buildQueryParams(query);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/project-manager-reports-dashboard?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setProjectManagerReports(response.data);
            }
        });
    };

    // Ключевые финансовые показатели - верхняя часть
    const getFinancialMetrics = () => {
        setIsLoading(true);

        const queryString = buildQueryParams(mainFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-metrics?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialMetrics(response.data);

                setIsLoading(false);
            }
        });
    };

    // Ключевые финансовые показатели - левый блок
    const getFinancialList = () => {
        const query = {
            ...financialListFilters,
            ...mainFilters,
        };

        const queryString = buildQueryParams(query);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-list?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialList(response.data);
            }
        });
    };

    // Ключевые финансовые показатели - правый блок
    const getFinancialProfitList = () => {
        const query = {
            ...financialProfitListFilters,
            ...mainFilters,
        };

        const queryString = buildQueryParams(query);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/financial-profit-list?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFinancialProfitList(response.data);
            }
        });
    };

    // Продажи
    const getFunnelMetrics = () => {
        const queryString = buildQueryParams(mainFilters);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/funnel-metrics?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setFunnelMetrics(response.data);
            }
        });
    };

    // Получение заказчиков
    const getContragents = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }contragents?all=true&has_projects=true&scope=both`
        ).then((response) => {
            if (response?.status == 200) {
                setContragents(response.data);
                setFilteredContragents(response.data);
            }
        });
    };

    // Получение проектов
    const getProjects = () => {
        getData(`${import.meta.env.VITE_API_URL}projects`).then((response) => {
            if (response?.status == 200) {
                setProjects(response.data);
                setFilteredProjects(response.data);
            }
        });
    };

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            return;
        }

        if (isMainFiltersReady) {
            if (hasCalledMainMetricsOnSelected.current) {
                hasCalledMainMetricsOnSelected.current = false;
                return;
            }

            getFinancialMetrics(); // Ключевые финансовые показатели - верхняя часть
            getFinancialList(); // Ключевые финансовые показатели - левый блок
            getFinancialProfitList(); // Ключевые финансовые показатели - правый блок
            getFunnelMetrics(); // Продажи
            getCompletedReports(); // Завершенные отчеты
        }
    }, [mainFilters]); // Отчетный месяц, отчетный период, заказчик, проект

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (isEmployeeMetricsFiltersReady) {
            getEmployeeMetrics();
            hasEmployeeMetricsOnSelected.current = true;
        }
    }, [selectedFilters]); // Отчетный месяц, отчетный период

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (isEmployeeMetricsFiltersReady) {
            if (hasEmployeeMetricsOnSelected.current) {
                hasEmployeeMetricsOnSelected.current = false;
                return;
            }
            getEmployeeMetrics();
        }
    }, [employeeFilters]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (isFinancialListFiltersReady) {
            if (hasCalledListOnSelected.current) {
                hasCalledListOnSelected.current = false;
                return;
            }
            getFinancialList();
        }
    }, [financialListFilters.type]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (isFinancialProfitListFiltersReady) {
            if (hasCalledProfitListOnSelected.current) {
                hasCalledProfitListOnSelected.current = false;
                return;
            }
            getFinancialProfitList();
        }
    }, [financialProfitListFilters.type]);

    useEffect(() => {
        if (!hasInitialized.current) return;

        if (
            selectedReportMonth?.report_month &&
            selectedReportMonth.report_month.length > 0 &&
            selectedReportMonth.report_month[0] !== ""
        ) {
            getProjectManagerReports(); // Отчёты руководителей проектов
        }
    }, [
        selectedReportMonth.report_month,
        mainFilters.contragent_id,
        mainFilters.project_id,
    ]);

    useEffect(() => {
        getFilterOptions();
        getContragents();
        getProjects();
    }, []);

    return isLoading ? (
        <Loader />
    ) : (
        <section className="indicators">
            <div className="container dashboaƒrds__container">
                {/* ФИЛЬТРЫ */}
                <section className="filters flex items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                            <span className="block mb-2 text-gray-400">
                                Отчётный месяц
                            </span>
                            <select
                                className="border-2 h-[32px] p-1 border-gray-300 min-w-full max-w-[140px] cursor-pointer"
                                value={selectedFilters?.report_month?.[0] ?? ""}
                                onChange={(e) => {
                                    const selectedValue = Array.from(
                                        e.target.selectedOptions
                                    ).map((option) => option.value);

                                    handleFilterChange(
                                        "report_month",
                                        selectedValue
                                    );
                                }}
                            >
                                {filtertOptions?.months?.length > 0 &&
                                    filtertOptions?.months?.map((month) => (
                                        <option
                                            key={month.value}
                                            value={month.value}
                                        >
                                            {month.label}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <span className="block mb-2 text-gray-400">
                                Отчётный период
                            </span>
                            <select
                                className="border-2 h-[32px] p-1 border-gray-300 min-w-full max-w-[140px] cursor-pointer"
                                value={selectedFilters?.period?.[0] ?? ""}
                                onChange={(e) => {
                                    const selectedValue = Array.from(
                                        e.target.selectedOptions
                                    ).map((option) => option.value);
                                    handleFilterChange("period", selectedValue);
                                }}
                            >
                                {filtertOptions?.periods?.length > 0 &&
                                    filtertOptions?.periods?.map((period) => (
                                        <option
                                            key={period.value}
                                            value={period.value}
                                        >
                                            {period.label}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-end gap-8">
                        <div className="flex flex-col">
                            <span className="block mb-2 text-gray-400">
                                Фильтры
                            </span>

                            <div className="grid grid-cols-2 gap-5">
                                <CreatableSelect
                                    isClearable
                                    options={
                                        filteredContragents.length > 0 &&
                                        filteredContragents.map((item) => ({
                                            value: item.id,
                                            label: item.program_name,
                                        }))
                                    }
                                    className="executor-block__name-field border-2 border-gray-300 w-[240px]"
                                    placeholder="Заказчик"
                                    noOptionsMessage={() => "Совпадений нет"}
                                    isValidNewOption={() => false}
                                    value={
                                        contragents
                                            .map((item) => ({
                                                value: item.id,
                                                label: item.program_name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    mainFilters
                                                        .contragent_id?.[0]
                                            ) || null
                                    }
                                    onChange={(selectedOption) => {
                                        const newValue =
                                            selectedOption?.value || "";

                                        setMainFilters((prev) => ({
                                            ...prev,
                                            contragent_id: [newValue],
                                        }));

                                        if (newValue != "") {
                                            const selectedContragentProjects =
                                                contragents.find(
                                                    (item) =>
                                                        item.id === +newValue
                                                ).project_ids;

                                            if (
                                                selectedContragentProjects.length >
                                                0
                                            ) {
                                                setFilteredProjects(
                                                    projects.filter((item) =>
                                                        selectedContragentProjects.includes(
                                                            item.id
                                                        )
                                                    )
                                                );
                                            } else {
                                                setFilteredProjects(projects);
                                            }
                                        } else {
                                            setFilteredProjects(projects);
                                        }
                                    }}
                                />

                                <CreatableSelect
                                    isClearable
                                    options={
                                        filteredProjects.length > 0 &&
                                        filteredProjects.map((item) => ({
                                            value: item.id,
                                            label: item.name,
                                        }))
                                    }
                                    className="executor-block__name-field border-2 border-gray-300 w-[240px]"
                                    placeholder="Проект"
                                    noOptionsMessage={() => "Совпадений нет"}
                                    isValidNewOption={() => false}
                                    value={
                                        filteredProjects
                                            .map((item) => ({
                                                value: item.id,
                                                label: item.name,
                                            }))
                                            .find(
                                                (opt) =>
                                                    opt.value ===
                                                    mainFilters.project_id?.[0]
                                            ) || null
                                    }
                                    onChange={(selectedOption) => {
                                        const newValue =
                                            selectedOption?.value || "";

                                        setMainFilters((prev) => ({
                                            ...prev,
                                            project_id: [newValue],
                                        }));

                                        if (newValue != "") {
                                            setFilteredContragents(
                                                contragents.filter((item) =>
                                                    item.project_ids.includes(
                                                        newValue
                                                    )
                                                )
                                            );
                                        } else {
                                            setFilteredContragents(contragents);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="border rounded-lg py-1 px-5 h-[32px] mb-2"
                            onClick={() => {
                                setMainFilters((prev) => {
                                    const {
                                        project_id,
                                        contragent_id,
                                        ...rest
                                    } = prev;
                                    return rest;
                                });
                                setFilteredProjects(projects);
                                setFilteredContragents(contragents);
                            }}
                        >
                            Очистить
                        </button>
                    </div>
                </section>

                <section className="flex flex-col gap-5">
                    <section className="flex flex-col gap-8 border border-gray-300 p-4">
                        <h2 className="mb-2 text-2xl font-semibold tracking-tight text-balance">
                            Ключевые финансовые показатели
                        </h2>

                        <div className="grid grid-cols-2 gap-10">
                            <div>
                                <FinancialMetrics
                                    financialMetrics={financialMetrics}
                                />

                                <div className="h-[320px]">
                                    <Bar
                                        data={financialMetricsData}
                                        options={verticalOptions}
                                        height={320}
                                    />
                                </div>
                            </div>

                            <div>
                                <GrossMetrics
                                    financialMetrics={financialMetrics}
                                />

                                <div className="h-[320px]">
                                    <Bar
                                        data={grossMetricsData}
                                        options={verticalOptions2}
                                        height={320}
                                    />
                                </div>
                            </div>
                        </div>

                        <FinancialIndicators
                            financialList={financialList}
                            financialProfitList={financialProfitList}
                            setFinancialListFilters={setFinancialListFilters}
                            setFinancialProfitListFilters={
                                setFinancialProfitListFilters
                            }
                        />
                    </section>

                    <EmployeesStats
                        employeeMetrics={employeeMetrics}
                        setEmployeeFilters={setEmployeeFilters}
                    />

                    <section className="grid grid-cols-2 gap-4">
                        <ManagerReports selectedFilters={selectedFilters} />

                        <Sales funnelMetrics={funnelMetrics} />
                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <ProjectManagerReports
                            projectManagerReports={projectManagerReports}
                        />

                        <CompletedReportsList
                            completedReports={completedReports}
                        />
                    </section>
                </section>
            </div>
        </section>
    );
};

export default Indicators;
