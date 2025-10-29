import { useState, useEffect } from "react";

import getData from "../../../utils/getData";

import CreatableSelect from "react-select/creatable";

const IndicatorsFilters = ({
    mainFilters,
    setMainFilters,
    setSelectedFilters,
    setSelectedReportMonth,
    selectedFilters,
    setFinancialListFilters,
    setFinancialProfitListFilters,
    setEmployeeFilters,
}) => {
    const [contragents, setContragents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filtertOptions, setFilterOptions] = useState([]);

    const [filteredContragents, setFilteredContragents] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

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

    useEffect(() => {
        getFilterOptions();
        getContragents();
        getProjects();
    }, []);

    return (
        <section className="filters hidden items-center justify-between gap-6">
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

                            handleFilterChange("report_month", selectedValue);
                        }}
                    >
                        {filtertOptions?.months?.length > 0 &&
                            filtertOptions?.months?.map((month) => (
                                <option key={month.value} value={month.value}>
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
                                <option key={period.value} value={period.value}>
                                    {period.label}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="flex items-end gap-8">
                <div className="flex flex-col">
                    <span className="block mb-2 text-gray-400">Фильтры</span>

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
                                            mainFilters.contragent_id?.[0]
                                    ) || null
                            }
                            onChange={(selectedOption) => {
                                const newValue = selectedOption?.value || "";

                                setMainFilters((prev) => ({
                                    ...prev,
                                    contragent_id: [newValue],
                                }));

                                if (newValue != "") {
                                    const selectedContragentProjects =
                                        contragents.find(
                                            (item) => item.id === +newValue
                                        ).project_ids;

                                    if (selectedContragentProjects.length > 0) {
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
                                const newValue = selectedOption?.value || "";

                                setMainFilters((prev) => ({
                                    ...prev,
                                    project_id: [newValue],
                                }));

                                if (newValue != "") {
                                    setFilteredContragents(
                                        contragents.filter((item) =>
                                            item.project_ids.includes(newValue)
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
                            const { project_id, contragent_id, ...rest } = prev;
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
    );
};

export default IndicatorsFilters;
