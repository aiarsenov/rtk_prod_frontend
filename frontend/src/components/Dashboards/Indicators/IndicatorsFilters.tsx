import { useState, useEffect } from "react";

import getData from "../../../utils/getData";

import CreatableSelect from "react-select/creatable";
import CustomDatePickerField from "../../CustomDatePicker/CustomDatePickerField";
import Hint from "../../Hint/Hint";

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
        )
            .then((response) => {
                if (response?.status == 200) {
                    setContragents(response.data);
                    setFilteredContragents(response.data);
                }
            })
            .catch((error) => {
                if (error.status === 403) {
                    console.error("Access denied to", error);
                }
            });
    };

    // Получение проектов
    const getProjects = () => {
        getData(`${import.meta.env.VITE_API_URL}projects`)
            .then((response) => {
                if (response?.status == 200) {
                    setProjects(response.data);
                    setFilteredProjects(response.data);
                }
            })
            .catch((error) => {
                if (error.status === 403) {
                    console.error("Access denied to", error);
                }
            });
    };

    // Получаем доступные фильтры
    const getFilterOptions = () => {
        getData(`${import.meta.env.VITE_API_URL}company/filter-options`)
            .then((response) => {
                if (response?.status == 200) {
                    setFilterOptions(response.data);

                    const periodValue = response.data.periods[3]?.value;
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
            })
            .catch((error) => {
                if (error.status === 403) {
                    console.error("Access denied to", error);
                }
            });
    };

    useEffect(() => {
        getFilterOptions();
        getContragents();
        getProjects();
    }, []);

    return (
        <div className="dashboards__filters container">
            <div className="dashboards__filters-wrapper">
                <div className="dashboards__filters-nav">
                    <CustomDatePickerField
                        className="calendar"
                        startDate={
                            new Date(selectedFilters?.report_month?.[0]) ??
                            new Date()
                        }
                        value={
                            new Date(selectedFilters?.report_month?.[0]) ??
                            new Date()
                        }
                        onChange={(updated) => {
                            const formatted = new Date(updated)
                                .toISOString()
                                .slice(0, 7);

                            handleFilterChange("report_month", [formatted]);
                        }}
                        showMonthYear={true}
                        type="months"
                        single={true}
                    />

                    <div className="filters__wrapper">
                    <ul className="filters__period">
                        {filtertOptions?.periods?.length > 0 &&
                            filtertOptions?.periods?.map((period) => (
                                <li
                                    className="filters__period-item"
                                    key={period.value}
                                >
                                    <input
                                        type="radio"
                                        id={period.value}
                                        checked={
                                            selectedFilters?.period?.[0] ===
                                            period.value
                                        }
                                        onChange={() =>
                                            handleFilterChange("period", [
                                                period.value,
                                            ])
                                        }
                                    />
                                    <label htmlFor={period.value}>
                                        {period.label}
                                    </label>
                                </li>
                            ))}
                    </ul>

                    <Hint
                        message="Подсказка"
                        position="bottom" />
                    </div>
                    <div className="filters__wrapper">
                    <CreatableSelect
                        options={
                            filteredContragents.length > 0 &&
                            filteredContragents.map((item) => ({
                                value: item.id,
                                label: item.program_name,
                            }))
                        }
                        className="form-select-extend"
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

                    <Hint message="Подсказка"
                    position="bottom" />
                    </div>
                    <div className="filters__wrapper">
                    <CreatableSelect
                        options={
                            filteredProjects.length > 0 &&
                            filteredProjects.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))
                        }
                        className="form-select-extend"
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

                    <Hint message="Подсказка"
                    position="bottom" />
                </div>
                </div>

                {(mainFilters.project_id || mainFilters.contragent_id) && (
                    <button
                        type="button"
                        className="dashboards__filters-clear-btn"
                        onClick={() => {
                            setMainFilters((prev) => {
                                const { project_id, contragent_id, ...rest } =
                                    prev;
                                return rest;
                            });
                            setFilteredProjects(projects);
                            setFilteredContragents(contragents);
                        }}
                    >
                        Очистить
                        <span></span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default IndicatorsFilters;
