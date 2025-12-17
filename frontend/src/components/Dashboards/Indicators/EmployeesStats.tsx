import { useEffect, useState } from "react";

import EmployeeMetrics from "./EmployeeMetrics";
import EmployeeItem from "./EmployeeItem";
import Hint from "../../Hint/Hint";
import Select from "react-select";

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
    Legend
);

import { Bar } from "react-chartjs-2";

const OPTIONS = [
    { value: "headcount", label: "Численность, чел" },
    { value: "gross_salary", label: "ФОТ gross, млн руб." },
    { value: "average_salary", label: "Средняя зп, тыс. руб." },
];

interface EmployeeMetrics {
    positions_histogram: [];
    hired_employees: [];
    dismissed_employees: [];
}

const EmployeesStats = ({
    employeeMetrics,
    employeeFilters,
    setEmployeeFilters,
}: {
    employeeMetrics: EmployeeMetrics;
    employeeFilters: { metric_type: ["headcount"] };
    setEmployeeFilters: React.Dispatch<React.SetStateAction<object>>;
}) => {
    const [activeTab, setActiveTab] = useState("employee_new");

    // Функция для преобразования строки с запятой в число
    const parseValue = (value: string | number | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        if (typeof value === "number") return value;
        if (typeof value === "string") {
            // Заменяем запятую на точку и парсим в число
            return parseFloat(value.replace(",", ".")) || 0;
        }
        return 0;
    };

    const EmployeeMetricsData = {
        labels: employeeMetrics.positions_histogram?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: employeeMetrics.positions_histogram?.map((item) =>
                    parseValue(item.previous_value)
                ),
                backgroundColor: "#F4F3FF",
                hoverBackgroundColor: "#E0E0FF",
                borderColor: "#BDB4FE",
                borderWidth: { right: 2 },
                borderRadius: 0,
                barPercentage: 1,
                barThickness:
                    employeeFilters.metric_type[0] === "headcount" ? 38.5 : 39,
                maxBarThickness:
                    employeeFilters.metric_type[0] === "headcount" ? 38.5 : 39,
                minBarThickness:
                    employeeFilters.metric_type[0] === "headcount" ? 38.5 : 39,
                datalabels: {
                    display: false,
                },
                borderSkipped: false,
                order: 2,
            },
            {
                label: "",
                data: employeeMetrics.positions_histogram?.map((item) =>
                    parseValue(item.value)
                ),
                backgroundColor: "#BDB4FE",
                borderRadius: 5,
                barThickness: 20,
                maxBarThickness: 20,
                minBarThickness: 20,
                barPercentage: 1,
                order: 1,
            },
        ],
    };

    const horizontalOptions = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        normalized: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: "",
            },
            datalabels: {
                anchor: "end",
                align: "right",
                offset: 8,
                color: "#002033",
                clip: false,
                formatter: (value) => {
                    if (!Number.isFinite(value)) return "";
                    // Форматируем с запятой вместо точки, 2 знака после запятой
                    return value.toFixed(2).toString().replace(".", ",");
                },
            },
            tooltip: {
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        const item =
                            employeeMetrics.positions_histogram?.[
                                context.dataIndex
                            ];
                        if (context.datasetIndex === 0) {
                            return `Прошлое значение: ${item.previous_value}`;
                        } else if (context.datasetIndex === 1) {
                            return `Текущее значение: ${item.value}`;
                        }
                    },
                    title: () => "",
                },
            },
        },

        scales: {
            y: {
                stacked: true,
                position: "left",
                ticks: {
                    color: "#002033",
                    font: { size: 14 },
                    crossAlign: "far",
                    padding: 15,
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);
                        return label.length > 25
                            ? label.slice(0, 25) + "…"
                            : label;
                    },
                },
                grid: {
                    drawBorder: false,
                    drawTicks: false,
                    lineWidth: 1,
                    color: "#E4E7EC",
                },
                border: {
                    dash: [3, 3],
                    display: false,
                },
            },

            x: {
                beginAtZero: true,
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                    display: false,
                },
                border: { display: false },
                afterDataLimits: (axis) => {
                    const max = axis.max ?? 0;
                    axis.max = max * 1.1;
                },
            },
        },
    };

    return (
        <section className="indicators__employees">
            <h2 className="subtitle indicators__employees-title">Персонал</h2>

            <div className="dashboards__block">
                <div className="indicators__employees-left relative">
                    <EmployeeMetrics {...employeeMetrics} />

                    <div className="flex items-start gap-[5px]">
                        <Select
                            className="form-select-extend w-[200px]"
                            options={OPTIONS}
                            placeholder="Выбрать"
                            value={OPTIONS.find(
                                (opt) =>
                                    opt.value ===
                                    (employeeFilters?.metric_type?.[0] ||
                                        "headcount")
                            )}
                            onChange={(evt) =>
                                setEmployeeFilters((prev) => ({
                                    ...prev,
                                    metric_type: [evt.value],
                                }))
                            }
                        />

                        <Hint message={""} />
                    </div>

                    <div className="h-[225px] overflow-auto">
                        {employeeMetrics.positions_histogram ? (
                            <div
                                style={{
                                    minWidth: "600px",
                                    height:
                                        (EmployeeMetricsData.labels?.length ||
                                            0) > 5
                                            ? `${
                                                  EmployeeMetricsData.labels
                                                      .length * 47
                                              }px`
                                            : "225px",
                                }}
                            >
                                <Bar
                                    data={EmployeeMetricsData}
                                    options={horizontalOptions}
                                />
                            </div>
                        ) : (
                            <span className="absolute inset-0 text-[#667085] flex items-center justify-center">
                                нет данных
                            </span>
                        )}
                    </div>
                </div>

                <div className="indicators__employees-right">
                    <div className="statistics-block__content indicators__employees-metrics-statistics">
                        <div className="statistics-block__item">
                            <div className="statistics-block__item-label">
                                Пришли
                            </div>

                            <div className="statistics-block__item-value">
                                <div className="statistics-block__item-value-block">
                                    <strong>
                                        <span>
                                            {employeeMetrics.hired_employees
                                                ?.length || 0}
                                        </span>
                                    </strong>

                                    <small>чел.</small>
                                </div>
                            </div>
                        </div>

                        <div className="statistics-block__item">
                            <div className="statistics-block__item-label">
                                Ушли
                            </div>

                            <div className="statistics-block__item-value">
                                <div className="statistics-block__item-value-block">
                                    <strong>
                                        <span>
                                            {employeeMetrics.dismissed_employees
                                                ?.length || 0}
                                        </span>
                                    </strong>

                                    <small>чел.</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ul className="card__tabs">
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                id="employee_new"
                                checked={activeTab === "employee_new"}
                                onChange={() => setActiveTab("employee_new")}
                            />
                            <label htmlFor="employee_new">
                                Новые сотрудники
                            </label>
                        </li>

                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                id="employee_departed"
                                checked={activeTab === "employee_departed"}
                                onChange={() =>
                                    setActiveTab("employee_departed")
                                }
                            />
                            <label htmlFor="employee_departed">
                                Ушедшие сотрудники
                            </label>
                        </li>
                    </ul>

                    <ul className="indicators__employees-list">
                        {activeTab == "employee_new"
                            ? employeeMetrics.hired_employees?.length > 0 &&
                              employeeMetrics.hired_employees.map((item) => (
                                  <EmployeeItem key={item.id} {...item} />
                              ))
                            : employeeMetrics.dismissed_employees?.length > 0 &&
                              employeeMetrics.dismissed_employees.map(
                                  (item) => (
                                      <EmployeeItem key={item.id} {...item} />
                                  )
                              )}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default EmployeesStats;
