import { useEffect, useState, useMemo } from "react";

import getData from "../../utils/getData";
import handleStatus from "../../utils/handleStatus";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { sortList } from "../../utils/sortList";

import SupplierItem from "./SupplierItem";
import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import TheadSortButton from "../TheadSortButton/TheadSortButton";
import FilterButton from "../FilterButton";
import OverlayTransparent from "../Overlay/OverlayTransparent";
import Loader from "../Loader";

const Suppliers = () => {
    const [sortBy, setSortBy] = useState({ key: "", action: "" });

    const [list, setList] = useState([]);
    const [sortedList, setSortedList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({
        current_page: 1,
        last_page: 1,
    });

    const [openFilter, setOpenFilter] = useState("");

    const URL = `${import.meta.env.VITE_API_URL}suppliers?active=true`;

    // Заполняем селектор заказчиков
    const nameOptions = useMemo(() => {
        const allNames = list
            .map((item) => item.program_name)
            .filter((program_name) => program_name !== null);

        return Array.from(new Set(allNames));
    }, [list]);

    // Заполняем селектор статусов
    const statusOptions = useMemo(() => {
        const allStatuses = list
            .map((item) => handleStatus(item.status))
            .filter((status) => status !== null);

        return Array.from(new Set(allStatuses));
    }, [list]);

    // Заполняем селектор ролей
    const roleOptions = useMemo(() => {
        const allRoles = list
            .flatMap((item) => item.roles)
            .filter((role) => role !== null);

        return Array.from(new Set(allRoles));
    }, [list]);

    const COLUMNS = [
        {
            label: "Наименование подрядчиков",
            key: "program_name",
            filter: "selectedNames",
            options: nameOptions,
        },
        {
            label: "Проектов всего",
            key: "projects_total_count",
            is_sortable: true,
        },
        {
            label: "Активные проекты",
            key: "projects_active_count",
            is_sortable: true,
        },
        {
            label: "Роли",
            key: "roles",
            filter: "selectedRoles",
            options: roleOptions,
        },
        {
            label: "Оплачено услуг, млн руб.",
            key: "total_receipts",
            is_sortable: true,
        },
        {
            label: "Статус",
            key: "status",
            filter: "selectedStatuses",
            options: statusOptions,
        },
    ];

    useEffect(() => {
        setSortedList(sortList(list, sortBy));
    }, [sortBy]);

    useEffect(() => {
        setIsLoading(true);
        getData(`${URL}&page=${page}`, { Accept: "application/json" })
            .then((response) => {
                setList((prev) => [...prev, ...response.data.data]);
                setSortedList((prev) => [...prev, ...response.data.data]);
                setMeta(response.data.meta);
            })
            .finally(() => setIsLoading(false));
    }, [page]);

    const loaderRef = useInfiniteScroll({
        isLoading,
        meta,
        setPage,
        isFiltering,
    });

    const [filters, setFilters] = useState({
        selectedNames: [],
        selectedRoles: [],
        selectedStatuses: [],
    });

    const filteredList = useMemo(() => {
        const allEmpty = Object.values(filters).every(
            (arr) => arr.length === 0
        );

        if (allEmpty) {
            setIsFiltering(false);
        } else {
            setIsFiltering(true);
        }

        return sortedList.filter((item) => {
            return (
                (filters.selectedNames.length === 0 ||
                    filters.selectedNames.includes(item.program_name)) &&
                (filters.selectedRoles.length === 0 ||
                    item.roles.some((role) =>
                        filters.selectedRoles.includes(role)
                    )) &&
                (filters.selectedStatuses.length === 0 ||
                    filters.selectedStatuses.includes(
                        handleStatus(item.status)
                    ))
            );
        });
    }, [sortedList, filters]);

    return (
        <main className="page suppliers">
            <div className="container registry__container">
                <section className="registry__header projects__header flex justify-between items-center">
                    <h1 className="title">
                        Реестр подрядчиков
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
                                    <SupplierItem
                                        key={item.id}
                                        props={item}
                                        columns={COLUMNS}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>

                    <div ref={loaderRef} className="h-4" />
                </section>
            </div>
        </main>
    );
};

export default Suppliers;
