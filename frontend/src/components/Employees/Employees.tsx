import { useEffect, useState, useMemo } from "react";

import getData from "../../utils/getData";
import { sortList } from "../../utils/sortList";

import EmployeeItem from "./EmployeeItem";

import TheadSortButton from "../TheadSortButton/TheadSortButton";
import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import FilterButton from "../FilterButton";
import OverlayTransparent from "../Overlay/OverlayTransparent";
import Loader from "../Loader";

const types = [
    { label: "штатный", value: true },
    { label: "внештатный", value: false },
];

const statuses = [
    { label: "работает", value: true },
    { label: "не работает", value: false },
];

const Employees = () => {
    const [sortBy, setSortBy] = useState({ key: "", action: "" });

    const [list, setList] = useState([]);
    const [sortedList, setSortedList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [departments, setDepartments] = useState([]);

    const [openFilter, setOpenFilter] = useState("");

    // Заполняем селектор сотрудников
    const nameOptions = useMemo(() => {
        const allNames = list
            .map((item) => item.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allNames));
    }, [list]);

    const positionOptions = useMemo(() => {
        const allPositions = list
            .map((item) => item?.position?.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allPositions));
    }, [list]);

    // Получени списка сотрудников
    const getList = () => {
        setIsLoading(true);
        getData(`${import.meta.env.VITE_API_URL}physical-persons`)
            .then((response) => {
                if (response.status == 200) {
                    setList(response.data);
                    setSortedList(response.data);
                }
            })
            .finally(() => setIsLoading(false));
    };

    // Получение списка подразделений
    const getDepartments = () => {
        getData(`${import.meta.env.VITE_API_URL}departments`).then(
            (response) => {
                if (response.status == 200) {
                    if (response.data.data.length > 0) {
                        setDepartments(response.data.data);
                    }
                }
            }
        );
    };

    const COLUMNS = [
        {
            label: "ФИО сотрудника",
            key: "name",
            filter: "selectedNames",
            options: nameOptions,
        },
        { label: "Загрузка", key: "reports_count", is_sortable: true },
        {
            label: "Должность",
            key: "position",
            filter: "selectedPositions",
            options: positionOptions,
        },
        { label: "Телефон", key: "phone_number" },
        { label: "Email", key: "email" },
        {
            label: "Подразделение",
            key: "department",
            filter: "selectedDepartments",
            options: departments
                .map((item) => item?.name)
                .filter((name) => name !== null),
        },
        {
            label: "Тип",
            key: "is_staff",
            filter: "selectedTypes",
            filterNoSearch: true,
            options: types
                .map((item) => item?.label)
                .filter((item) => item !== null),
        },
        {
            label: "Статус",
            key: "status",
            filter: "selectedStatuses",
            filterNoSearch: true,
            options: statuses
                .map((item) => item?.label)
                .filter((item) => item !== null),
        },
    ];

    useEffect(() => {
        setSortedList(sortList(list, sortBy));
    }, [sortBy]);

    useEffect(() => {
        getDepartments();
        getList();
    }, []);

    const [filters, setFilters] = useState({
        selectedNames: [],
        selectedPositions: [],
        selectedDepartments: [],
        selectedTypes: [],
        selectedStatuses: [],
    });

    const filteredList = useMemo(() => {
        return sortedList.filter((item) => {
            return (
                (filters.selectedNames.length === 0 ||
                    filters.selectedNames.includes(item.name)) &&
                (filters.selectedPositions.length === 0 ||
                    filters.selectedPositions.includes(item?.position?.name)) &&
                (filters.selectedDepartments.length === 0 ||
                    filters.selectedDepartments.includes(
                        item?.department?.name
                    )) &&
                (filters.selectedTypes.length === 0 ||
                    filters.selectedTypes.some((label) => {
                        const type = types.find((t) => t.label === label);
                        return type?.value === item.is_staff;
                    })) &&
                (filters.selectedStatuses.length === 0 ||
                    filters.selectedStatuses.some((label) => {
                        const status = statuses.find((s) => s.label === label);
                        return status?.value === item.is_active;
                    }))
            );
        });
    }, [sortedList, filters]);

    return (
        <main className="page suppliers">
            <div className="container registry__container">
                <section className="registry__header projects__header flex justify-between items-center">
                    <h1 className="title">
                        Реестр сотрудников
                        {filteredList.length > 0 && (
                            <span>{filteredList.length}</span>
                        )}
                    </h1>
                </section>

                <section className="registry__table-section w-full">
                    {openFilter !== "" && (
                        <OverlayTransparent
                            state={true}
                            toggleMenu={() => setOpenFilter("")}
                        />
                    )}

                    <table className="registry-table table-auto w-full border-collapse">
                        <thead className="registry-table__thead">
                            <tr>
                                {COLUMNS.map(
                                    ({
                                        label,
                                        key,
                                        filter,
                                        options,
                                        is_sortable,
                                        filterNoSearch,
                                    }) => {
                                        return (
                                            <th
                                                className="min-w-[125px]"
                                                rowSpan="2"
                                                key={key}
                                            >
                                                <div className="registry-table__thead-item">
                                                    {filter ? (
                                                        <>
                                                            <div
                                                                className="registry-table__thead-label"
                                                                style={{
                                                                    maxWidth:
                                                                        "200px",
                                                                }}
                                                            >
                                                                {label}
                                                            </div>

                                                            {filters[filter]
                                                                .length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                [filter]:
                                                                                    [],
                                                                            })
                                                                        );
                                                                    }}
                                                                >
                                                                    <svg
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M9.06 8l3.713 3.712-1.06 1.06L8 9.06l-3.712 3.713-1.061-1.06L6.939 8 3.227 4.287l1.06-1.06L8 6.939l3.712-3.712 1.061 1.06L9.061 8z"
                                                                            fill="#000"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            )}

                                                            {options.length >
                                                                0 &&
                                                                options.some(
                                                                    (val) =>
                                                                        val !==
                                                                        undefined
                                                                ) && (
                                                                    <FilterButton
                                                                        label={
                                                                            label
                                                                        }
                                                                        key={
                                                                            key
                                                                        }
                                                                        filterKey={
                                                                            key
                                                                        }
                                                                        openFilter={
                                                                            openFilter
                                                                        }
                                                                        setOpenFilter={
                                                                            setOpenFilter
                                                                        }
                                                                    />
                                                                )}

                                                            {openFilter ===
                                                                key && (
                                                                <MultiSelectWithSearch
                                                                    options={
                                                                        options.length >
                                                                        0
                                                                            ? options.map(
                                                                                  (
                                                                                      name
                                                                                  ) => ({
                                                                                      value: name,
                                                                                      label: name,
                                                                                  })
                                                                              )
                                                                            : []
                                                                    }
                                                                    selectedValues={
                                                                        filters[
                                                                            filter
                                                                        ]
                                                                    }
                                                                    filterNoSearch={
                                                                        filterNoSearch
                                                                    }
                                                                    onChange={(
                                                                        updated
                                                                    ) =>
                                                                        setFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                ...updated,
                                                                            })
                                                                        )
                                                                    }
                                                                    fieldName={
                                                                        filter
                                                                    }
                                                                    close={
                                                                        setOpenFilter
                                                                    }
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div
                                                            className="registry-table__thead-label"
                                                            style={{
                                                                maxWidth:
                                                                    "200px",
                                                            }}
                                                        >
                                                            {label}
                                                        </div>
                                                    )}

                                                    {is_sortable && (
                                                        <TheadSortButton
                                                            label={label}
                                                            value={key}
                                                            sortBy={sortBy}
                                                            setSortBy={
                                                                setSortBy
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    }
                                )}
                            </tr>
                        </thead>

                        <tbody className="registry-table__tbody">
                            {isLoading ? (
                                <tr>
                                    <td>
                                        <Loader />
                                    </td>
                                </tr>
                            ) : (
                                filteredList.length > 0 &&
                                filteredList.map((item) => (
                                    <EmployeeItem
                                        key={item.id}
                                        props={item}
                                        columns={COLUMNS}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
            </div>
        </main>
    );
};

export default Employees;
