import { useState, useEffect } from "react";

import { sortFinanceValues } from "../../../utils/sortFinanceValues";
import ChartDataLabels from "chartjs-plugin-datalabels";

import SortBtn from "../../SortBtn";

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

const FinancialIndicators = ({
    financialList,
    financialProfitList,
    setFinancialListFilters,
    setFinancialProfitListFilters,
}) => {
    const [mergedList, setMergetList] = useState([]);
    const [sortedMergedList, setSortedMergetList] = useState([]);

    const [hoverLabel, setHoverLabel] = useState("");

    const [sortBy, setSortBy] = useState({
        key: "receipts.value",
        action: "ascending",
    });

    // Ключевые финансовые показатели - Поступления
    const financialListData1 = {
        labels: sortedMergedList?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedMergedList?.map((item) =>
                    parseFloat(
                        item.receipts?.value?.toString().replace(",", ".")
                    )
                ),
                backgroundColor: "#FEDF89",
                borderRadius: 5,
                categoryPercentage: 0.3,
                barThickness: 30,
            },
        ],
    };

    // Ключевые финансовые показатели - Выручка
    const financialListData2 = {
        labels: sortedMergedList?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedMergedList?.map((item) =>
                    parseFloat(
                        item.revenue?.value?.toString().replace(",", ".")
                    )
                ),

                backgroundColor: "#FEDF89",
                borderRadius: 5,
                categoryPercentage: 0.3,
                barThickness: 30,
            },
        ],
    };

    // Ключевые финансовые показатели - Выловая прибыль
    const financialProfitListData1 = {
        labels: sortedMergedList?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedMergedList?.map((item) =>
                    parseFloat(
                        item.gross_profit?.value?.toString().replace(",", ".")
                    )
                ),
                backgroundColor: "#FEDF89",
                borderRadius: 5,
                categoryPercentage: 0.3,
                barThickness: 30,
            },
        ],
    };

    // Ключевые финансовые показатели - Валовая рентабельность
    const financialProfitListData2 = {
        labels: sortedMergedList?.map((item) => item.name),
        datasets: [
            {
                label: "",
                data: sortedMergedList?.map((item) =>
                    parseFloat(
                        item.gross_margin?.value?.toString().replace(",", ".")
                    )
                ),
                backgroundColor: "#FEDF89",
                borderRadius: 5,
                categoryPercentage: 0.3,
                barThickness: 30,
            },
        ],
    };

    const horizontalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: "y",
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
                    return typeof value === "number"
                        ? value.toFixed(2).toString().replace(".", ",")
                        : value;
                },
            },
            tooltip: { enabled: false },
        },
        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);

                        const maxLength = 20;
                        if (label.length > maxLength) {
                            return label.slice(0, maxLength) + "…";
                        }

                        return label;
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
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                    display: false,
                },
                afterDataLimits: (axis) => {
                    const max = axis.max ?? 0;
                    axis.max = max * 1.1;
                },
            },
        },
        onHover: (event, chartElements) => {
            if (chartElements.length > 0) {
                const index = chartElements[0].index;
                setHoverLabel(financialListData1.labels[index]);
            } else {
                setHoverLabel("");
            }
        },
    };

    const horizontalOptionsNoLabels = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: "y",
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
                    return typeof value === "number"
                        ? value.toFixed(2).toString().replace(".", ",")
                        : value;
                },
            },
            tooltip: { enabled: false },
        },

        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);
                        return label.length > 0 ? label.slice(0, 0) : label;
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
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                    display: false,
                },
                afterDataLimits: (axis) => {
                    const max = axis.max ?? 0;
                    axis.max = max * 1.1;
                },
            },
        },
        onHover: (event, chartElements) => {
            if (chartElements.length > 0) {
                const index = chartElements[0].index;
                setHoverLabel(financialListData1.labels[index]);
            } else {
                setHoverLabel("");
            }
        },
    };

    const horizontalOptionsWithPercent = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        indexAxis: "y",
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
                formatter: (value) => `${value}%`,
            },
            tooltip: {
                enabled: false,
                // callbacks: {
                //     label: (context) => {
                //         let value = context.raw;
                //         return `${value}%`;
                //     },
                // },
            },
        },
        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);
                        return label.length > 0 ? label.slice(0, 0) : label;
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
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                    display: false,
                },
                afterDataLimits: (axis) => {
                    const max = axis.max ?? 0;
                    axis.max = max * 1.1;
                },
            },
        },
        onHover: (event, chartElements) => {
            if (chartElements.length > 0) {
                const index = chartElements[0].index;
                setHoverLabel(financialListData1.labels[index]);
            } else {
                setHoverLabel("");
            }
        },
    };

    useEffect(() => {
        if (mergedList.length > 0) {
            setSortedMergetList(sortFinanceValues(mergedList, sortBy));
        }
    }, [sortBy, mergedList]);

    useEffect(() => {
        if (financialList.items && financialProfitList.items) {
            const merged = [
                ...(financialList?.items || []),
                ...(financialProfitList?.items || []),
            ]
                // Убираем дубликаты по id
                .reduce((acc, item) => {
                    const existing = acc.find((el) => el.id === item.id);
                    if (existing) {
                        // если такой id уже был — объединяем данные
                        Object.assign(existing, item);
                    } else {
                        acc.push({ ...item });
                    }
                    return acc;
                }, []);

            setMergetList(merged);
            setSortedMergetList(merged);
        }
    }, [financialList, financialProfitList]);

    return (
        <div className="dashboards__block">
            <div className="grid grid-cols-[32%_1fr_1fr_1fr] pl-4">
                <div className="flex items-center gap-5">
                    <select
                        className="border-2 h-[30px] p-1 border-gray-300 w-full max-w-[125px] cursor-pointer"
                        onChange={(evt) => {
                            setFinancialListFilters((prev) => ({
                                ...prev,
                                type: [evt.target.value],
                            }));
                            setFinancialProfitListFilters((prev) => ({
                                ...prev,
                                type: [evt.target.value],
                            }));
                        }}
                    >
                        <option value="project">Проект</option>
                        <option value="customer">Заказчик</option>
                    </select>

                    <SortBtn
                        label="Поступления, млн руб."
                        value="receipts.value"
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </div>

                <SortBtn
                    label={"Выручка, млн руб."}
                    value={"revenue.value"}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    className={"text-left ml-[10px]"}
                />

                <SortBtn
                    label={"Валовая прибыль, млн руб."}
                    value={"gross_profit.value"}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    className={"text-left ml-[10px]"}
                />
                <SortBtn
                    label={"Валовая рентабельность"}
                    value={"gross_margin.value"}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    className={"text-left ml-[10px]"}
                />
            </div>

            <div
                className={`relative ml-4 pl-4 py-2 flex items-center w-full max-w-[1000px] h-[30px] transition-all border-l-2 border-black  ${
                    hoverLabel != "" ? "opacity-100" : "opacity-0"
                }`}
            >
                {hoverLabel}
            </div>

            <div className="h-[300px] overflow-x-hidden overflow-y-auto grid grid-cols-[32%_1fr_1fr_1fr]">
                <div
                    style={{
                        height:
                            (financialProfitListData1.labels?.length || 0) > 5
                                ? `${
                                      financialProfitListData1.labels.length *
                                      60
                                  }px`
                                : "300px",
                    }}
                >
                    <Bar
                        data={financialListData1}
                        options={horizontalOptions}
                    />
                </div>

                <div
                    style={{
                        height:
                            (financialProfitListData1.labels?.length || 0) > 5
                                ? `${
                                      financialProfitListData1.labels.length *
                                      60
                                  }px`
                                : "300px",
                    }}
                >
                    <Bar
                        data={financialListData2}
                        options={horizontalOptionsNoLabels}
                    />
                </div>

                <div
                    style={{
                        height:
                            (financialProfitListData1.labels?.length || 0) > 5
                                ? `${
                                      financialProfitListData1.labels.length *
                                      60
                                  }px`
                                : "300px",
                    }}
                >
                    <Bar
                        data={financialProfitListData1}
                        options={horizontalOptionsNoLabels}
                    />
                </div>

                <div
                    style={{
                        height:
                            (financialProfitListData1.labels?.length || 0) > 5
                                ? `${
                                      financialProfitListData1.labels.length *
                                      60
                                  }px`
                                : "300px",
                    }}
                >
                    <Bar
                        data={financialProfitListData2}
                        options={horizontalOptionsWithPercent}
                    />
                </div>
            </div>
        </div>
    );
};

export default FinancialIndicators;
