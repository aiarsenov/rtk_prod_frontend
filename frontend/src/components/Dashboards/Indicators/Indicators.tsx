import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { canAccess } from "../../../utils/permissions";

import getData from "../../../utils/getData";
import buildQueryParams from "../../../utils/buildQueryParams";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useBodyScrollLock } from "../../../hooks/useBodyScrollLock.js";
import { useWindowWidth } from "../../../hooks/useWindowWidth.js";

import Loader from "../../Loader";
import IndicatorsFilters from "./IndicatorsFilters";
import FinancialMetrics from "./FinancialMetrics";
import IndicatorsSales from "./IndicatorsSales";
import GrossMetrics from "./GrossMetrics";
import CompletedReportsList from "./CompletedReportsList";
import EmployeesStats from "./EmployeesStats";
import FinancialIndicators from "./FinancialIndicators";
import ProjectManagerReports from "./ProjectManagerReports";
import ManagerReports from "./ManagerReports";
import BottomSheet from "../../BottomSheet/BottomSheet";
import AccessDenied from "../../AccessDenied/AccessDenied";

import "../Dashboards.scss";

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
    const user = useSelector((state: any) => state.user.data);
    const [isLoading, setIsLoading] = useState(true);
    const [isActiveFilters, setIsActiveFilters] = useState(false); // Состояние окна фильтров

    const [selectedReportMonth, setSelectedReportMonth] = useState([]); // Отчетный месяц
    const [selectedFilters, setSelectedFilters] = useState({}); // Отчетный месяц, отчетный период
    const [mainFilters, setMainFilters] = useState({}); // Отчетный месяц, отчетный период, заказчик, проект

    const [financialMetrics, setFinancialMetrics] = useState({}); // Ключевые финансовые показатели
    const [financialList, setFinancialList] = useState({}); // Сортированные ключевые финансовые показатели - Поступления и выручка
    const [financialProfitList, setFinancialProfitList] = useState({}); // Сортированные ключевые финансовые показатели - Выловая прибыль и рентабельность
    const [funnelMetrics, setFunnelMetrics] = useState({}); // Продажи
    const [employeeMetrics, setEmployeeMetrics] = useState({}); // Персонал
    const [completedReports, setCompletedReports] = useState([]); // Завершенные отчеты
    const [projectManagerReports, setProjectManagerReports] = useState([]); // Отчеты руководителей проектов

    const [isFinancialListLoaded, setIsFinancialListLoaded] = useState(false);
    const [isFinancialProfitListLoaded, setIsFinancialProfitListLoaded] =
        useState(false);

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
                label: "Выручка",
                data: financialMetrics.monthly_chart?.map((item) =>
                    parseFloat(item.revenue?.toString().replace(",", "."))
                ),
                backgroundColor: "#7CD4FD",
                barPercentage: 0.25,
                borderRadius: 3,
                barThickness: 10,
                categoryPercentage: 0.8,
                order: 1,
            },
            {
                label: "Поступления",
                data: financialMetrics.monthly_chart?.map((item) =>
                    parseFloat(item.receipts?.toString().replace(",", "."))
                ),
                backgroundColor: "#E0F2FE",
                borderRadius: 10,
                barPercentage: 1,
                barThickness: 40,
                categoryPercentage: 0.8,
                order: 2,
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
                backgroundColor: "#36BFFA",
                borderColor: "#36BFFA",
                borderWidth: 1,
                fill: false,
                pointBackgroundColor: "#36BFFA",
                pointRadius: 4,
                tension: 0,
                yAxisID: "y1",
            },
            {
                type: "bar",
                label: "",
                data: financialMetrics.monthly_chart?.map((item) =>
                    parseFloat(item.gross_profit?.toString().replace(",", "."))
                ),
                backgroundColor: "#E0F2FE",
                borderRadius: 10,
                barThickness: 40,
                categoryPercentage: 1,
                stack: "stack1",
                yAxisID: "y",
            },
        ],
    };

    const verticalOptions = {
        maintainAspectRatio: false,
        aspectRatio: 2,
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
                grid: {
                    display: false,
                },
                border: {
                    display: true,
                    color: "#E4E7EC",
                    width: 1,
                },
                ticks: {
                    color: "#002033",
                },
            },
            y: {
                ticks: {
                    color: "#98A2B3",
                },
                grid: {
                    drawBorder: false,
                    drawOnChartArea: true,
                    color: "#E4E7EC",
                },
                border: {
                    dash: [3, 3],
                    display: false,
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
                barThickness: 40,
                grid: {
                    display: false,
                },
                border: {
                    display: true,
                    color: "#E4E7EC",
                    width: 1,
                },
                ticks: {
                    color: "#002033",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: false,
                    text: "Валовая прибыль, млн руб.",
                },
                grid: {
                    drawBorder: false,
                    drawOnChartArea: true,
                    color: "#E4E7EC",
                },
                border: {
                    dash: [3, 3],
                    display: false,
                },
                ticks: {
                    color: "#98A2B3",
                },
            },
            y1: {
                beginAtZero: true,
                position: "right",
                grid: {
                    display: false,
                    drawOnChartArea: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: "#98A2B3",
                },
                title: {
                    display: false,
                    text: "Валовая рентаб., %",
                },
            },
        },
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
        };

        const queryString = buildQueryParams(query);

        getData(
            `${
                import.meta.env.VITE_API_URL
            }company/project-manager-reports-dashboard?${queryString}`
        ).then((response) => {
            if (response?.status == 200) {
                setProjectManagerReports(response.data.items);
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
        setIsFinancialListLoaded(false);

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
                setIsFinancialListLoaded(true);
            }
        });
    };

    // Ключевые финансовые показатели - правый блок
    const getFinancialProfitList = () => {
        setIsFinancialProfitListLoaded(false);

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
                setIsFinancialProfitListLoaded(true);
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
            mainFilters?.report_month &&
            mainFilters.report_month.length > 0 &&
            mainFilters.report_month[0] !== ""
        ) {
            getProjectManagerReports(); // Отчёты руководителей проектов
        }
    }, [mainFilters]);

    useBodyScrollLock(isLoading || isActiveFilters);

    const width = useWindowWidth(); // Снимаем блокировку на десктопе

    useEffect(() => {
        if (width >= 1440) {
            setIsActiveFilters(false);
        }
    }, [width]);

    if (!user) {
        return null;
    }

    if (!canAccess(user, "main")) {
        return (
            <AccessDenied message="У вас нет прав для просмотра дашборда ключевых показателей" />
        );
    }

    return (
        <section className="indicators">
            {isLoading && <Loader />}

            <div className=" dashboards__container">
                <BottomSheet
                    onClick={() => setIsActiveFilters(false)}
                    className={`bottom-sheet_desk filters-bottomsheet ${
                        isActiveFilters ? "active" : ""
                    }`}
                >
                    <IndicatorsFilters
                        mainFilters={mainFilters}
                        setMainFilters={setMainFilters}
                        // setSelectedReportMonth={setSelectedReportMonth}
                        setSelectedFilters={setSelectedFilters}
                        selectedFilters={selectedFilters}
                        setFinancialListFilters={setFinancialListFilters}
                        setFinancialProfitListFilters={
                            setFinancialProfitListFilters
                        }
                        setEmployeeFilters={setEmployeeFilters}
                    />
                </BottomSheet>

                <section className="dashboards__content container">
                    <section className="indicators__financial-metrics">
                        <h2 className="subtitle indicators__financial-metrics-title">
                            Ключевые финансовые показатели
                        </h2>

                        <div className="dashboards__row">
                            <div className="dashboards__block">
                                <FinancialMetrics
                                    financialMetrics={financialMetrics}
                                />

                                <ul className="indicators__financial-labels">
                                    <li>
                                        <div className="bg-[#7CD4FD]"></div>
                                        <span>Выручка</span>
                                    </li>
                                    <li>
                                        <div className="bg-[#E0F2FE]"></div>
                                        <span>Поступления</span>
                                    </li>
                                </ul>

                                <div
                                    style={{
                                        height: "320px",
                                    }}
                                >
                                    <Bar
                                        data={financialMetricsData}
                                        options={verticalOptions}
                                        height={320}
                                    />
                                </div>
                            </div>

                            <div className="dashboards__block">
                                <GrossMetrics
                                    financialMetrics={financialMetrics}
                                />

                                <ul className="indicators__financial-labels">
                                    <li>
                                        <div className="bg-[#7CD4FD]"></div>
                                        <span>Валовая рентабельность</span>
                                    </li>
                                    <li>
                                        <div className="bg-[#E0F2FE]"></div>
                                        <span>Валовая прибыль</span>
                                    </li>
                                </ul>

                                <div
                                    style={{
                                        height: "320px",
                                    }}
                                >
                                    <Bar
                                        data={grossMetricsData}
                                        options={verticalOptions2}
                                        height={320}
                                    />
                                </div>
                            </div>
                        </div>

                        <FinancialIndicators
                            isFinancialListLoaded={isFinancialListLoaded}
                            isFinancialProfitListLoaded={
                                isFinancialProfitListLoaded
                            }
                            financialList={financialList}
                            financialProfitList={financialProfitList}
                            financialListFilters={financialListFilters}
                            setFinancialListFilters={setFinancialListFilters}
                            setFinancialProfitListFilters={
                                setFinancialProfitListFilters
                            }
                        />
                    </section>

                    <EmployeesStats
                        employeeMetrics={employeeMetrics}
                        setEmployeeFilters={setEmployeeFilters}
                        employeeFilters={employeeFilters}
                    />

                    <section>
                        <div className="dashboards__row">
                            <ManagerReports selectedFilters={selectedFilters} />

                            <IndicatorsSales funnelMetrics={funnelMetrics} />
                        </div>
                    </section>

                    <section>
                        <div className="dashboards__row">
                            <ProjectManagerReports
                                projectManagerReports={projectManagerReports}
                            />

                            <CompletedReportsList
                                completedReports={completedReports}
                            />
                        </div>
                    </section>
                </section>
            </div>

            <div className="card__bottom-actions">
                <button
                    type="button"
                    title="Открыть фильтры"
                    onClick={() => {
                        setIsActiveFilters(true);
                    }}
                >
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8.83116 9.62235H21.1633M8.83116 14.6909H21.1633M8.83116 19.4801H17.4517M6.06055 26.2405H24.0007C24.553 26.2405 25.0007 25.7928 25.0007 25.2405V4.75928C25.0007 4.20699 24.553 3.75928 24.0007 3.75928H6.06055C5.50826 3.75928 5.06055 4.20699 5.06055 4.75928V25.2405C5.06055 25.7928 5.50826 26.2405 6.06055 26.2405Z"
                            stroke="#F38B00"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default Indicators;
