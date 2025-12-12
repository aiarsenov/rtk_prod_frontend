import { useState, useEffect } from "react";

import { sortFinanceValues } from "../../../utils/sortFinanceValues";
import ChartDataLabels from "chartjs-plugin-datalabels";

import Select from "react-select";
import SortBtn from "../../SortBtn";
import Loader from "../../Loader";

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

const OPTIONS = [
    { value: "project", label: "Проект" },
    { value: "customer", label: "Заказчик" },
];

const FinancialIndicators = ({
    financialList,
    financialProfitList,
    financialListFilters,
    setFinancialListFilters,
    setFinancialProfitListFilters,
}: {
    financialList: { items: [] };
    financialProfitList: { items: [] };
    financialListFilters: { type: [] };
    setFinancialListFilters: React.Dispatch<
        React.SetStateAction<{ type: string[] }>
    >;
    setFinancialProfitListFilters: React.Dispatch<
        React.SetStateAction<{ type: string[] }>
    >;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [mergedList, setMergetList] = useState([]);
    const [sortedMergedList, setSortedMergetList] = useState([]);

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
                categoryPercentage: 0.1,
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
                categoryPercentage: 0.1,
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
                categoryPercentage: 0.1,
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
                categoryPercentage: 0.1,
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
                    if (!Number.isFinite(value)) return "";

                    return value.toFixed(2).toString().replace(".", ",");
                },
            },
            tooltip: {
                enabled: false,
            },
        },
        scales: {
            y: {
                position: "left",
                ticks: {
                    color: "#002033",
                    font: { size: 14 },
                    padding: 0,
                    crossAlign: "far",
                    autoSkip: false,
                    maxRotation: 0,
                    callback: function (value) {
                        let label = this.getLabelForValue(value);

                        const isUpperCase = label === label.toUpperCase();

                        const maxLength = isUpperCase ? 14 : 17;

                        if (label.length > maxLength) {
                            label = label.slice(0, maxLength) + "…";

                            return label + "\u00A0\u00A0\u00A0";
                        } else {
                            return (
                                label +
                                "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"
                            );
                        }
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
                border: { display: false },
                afterDataLimits: (axis) => {
                    const max = axis.max ?? 0;
                    axis.max = max * 1.15;
                },
            },
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
                    if (!Number.isFinite(value)) return "";

                    return value.toFixed(2).toString().replace(".", ",");
                },
            },
            tooltip: { enabled: false },
        },

        scales: {
            y: {
                ticks: {
                    font: { size: 14 },
                    autoSkip: false,
                    maxRotation: 0,
                    padding: 0,
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
                    display: false,
                },
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawBorder: false,
                    drawTicks: false,
                    display: false,
                },
                border: {
                    display: false,
                },
                afterDataLimits: (axis) => {
                    const max = axis.max ?? 0;
                    axis.max = max * 1.1;
                },
            },
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
                formatter: (value) => {
                    if (!Number.isFinite(value)) return "";

                    return `${value.toFixed(1).toString().replace(".", ",")}%`;
                },
            },
            tooltip: {
                enabled: false,
            },
        },
        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    padding: 0,
                    font: { size: 14 },
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
                    display: false,
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
                border: { display: false },
                afterDataLimits: (axis) => {
                    const max = axis.max ?? 0;
                    axis.max = max * 1.1;
                },
            },
        },
    };

    useEffect(() => {
        if (mergedList) {
            setSortedMergetList(sortFinanceValues(mergedList, sortBy));
            setIsLoading(false);
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
        <div className="dashboards__block indicators__financial-indicators">
            <div className="indicators__financial-indicators__wrapper">
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="indicators__financial-indicators__body">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-[40px]">
                                <Select
                                    className="form-select-extend w-[120px]"
                                    options={OPTIONS}
                                    placeholder="Выбрать"
                                    value={OPTIONS.find(
                                        (opt) =>
                                            opt.value ===
                                            (financialListFilters?.type?.[0] ||
                                                "project")
                                    )}
                                    onChange={(evt) => {
                                        setMergetList([]);
                                        setSortedMergetList([]);
                                        setIsLoading(true);

                                        setFinancialListFilters((prev) => ({
                                            ...prev,
                                            type: [evt.value],
                                        }));
                                        setFinancialProfitListFilters(
                                            (prev) => ({
                                                ...prev,
                                                type: [evt.value],
                                            })
                                        );
                                    }}
                                />

                                <SortBtn
                                    label="Поступления, млн руб."
                                    value="receipts.value"
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                    className="h-[40px]"
                                />
                            </div>

                            <div
                                style={{
                                    height:
                                        (financialProfitListData1.labels
                                            ?.length || 0) > 5
                                            ? `${
                                                  financialProfitListData1
                                                      .labels.length * 60
                                              }px`
                                            : "300px",
                                }}
                            >
                                <Bar
                                    data={financialListData1}
                                    options={horizontalOptions}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <SortBtn
                                label={"Выручка, млн руб."}
                                value={"revenue.value"}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                className={"text-left h-[40px]"}
                            />

                            <div
                                style={{
                                    height:
                                        (financialProfitListData1.labels
                                            ?.length || 0) > 5
                                            ? `${
                                                  financialProfitListData1
                                                      .labels.length * 60
                                              }px`
                                            : "300px",
                                }}
                            >
                                <Bar
                                    data={financialListData2}
                                    options={horizontalOptionsNoLabels}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <SortBtn
                                label={"Валовая прибыль, млн руб."}
                                value={"gross_profit.value"}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                className={"text-left h-[40px]"}
                            />

                            <div
                                style={{
                                    height:
                                        (financialProfitListData1.labels
                                            ?.length || 0) > 5
                                            ? `${
                                                  financialProfitListData1
                                                      .labels.length * 60
                                              }px`
                                            : "300px",
                                }}
                            >
                                <Bar
                                    data={financialProfitListData1}
                                    options={horizontalOptionsNoLabels}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <SortBtn
                                label={"Валовая рентабельность"}
                                value={"gross_margin.value"}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                className={"text-left h-[40px]"}
                            />

                            <div
                                style={{
                                    height:
                                        (financialProfitListData1.labels
                                            ?.length || 0) > 5
                                            ? `${
                                                  financialProfitListData1
                                                      .labels.length * 60
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
                )}
            </div>
        </div>
    );
};

export default FinancialIndicators;
