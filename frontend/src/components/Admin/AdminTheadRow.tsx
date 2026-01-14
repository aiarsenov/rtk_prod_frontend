import TheadSortButton from "../TheadSortButton/TheadSortButton";
import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import FilterButton from "../FilterButton";

type Props = {
    COLUMNS: object[];
    mode: string;
    filters: object;
    setFilters: () => React.Dispatch<React.SetStateAction<object>>;
    sortBy: object;
    setSortBy: () => React.Dispatch<React.SetStateAction<object>>;
    openFilter: string;
    setOpenFilter: () => React.Dispatch<React.SetStateAction<string>>;
};

const AdminTheadRow = ({
    COLUMNS,
    mode,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    openFilter,
    setOpenFilter,
}: Props) => {
    return (
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
                        <th key={key}>
                            <div className="registry-table__thead-item">
                                {filter ? (
                                    <>
                                        <div
                                            className="registry-table__thead-label"
                                            style={{
                                                maxWidth: "200px",
                                            }}
                                        >
                                            {label}
                                        </div>

                                        {filters[filter].length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        [filter]: [],
                                                    }));
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

                                        {options.length > 0 &&
                                            options.some(
                                                (val) => val !== undefined
                                            ) && (
                                                <FilterButton
                                                    label={label}
                                                    key={key}
                                                    filterKey={key}
                                                    openFilter={openFilter}
                                                    setOpenFilter={
                                                        setOpenFilter
                                                    }
                                                />
                                            )}

                                        {openFilter === key && (
                                            <MultiSelectWithSearch
                                                options={
                                                    options.length > 0
                                                        ? options.map(
                                                              (name) => ({
                                                                  value: name,
                                                                  label: name,
                                                              })
                                                          )
                                                        : []
                                                }
                                                selectedValues={filters[filter]}
                                                filterNoSearch={filterNoSearch}
                                                onChange={(updated) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        ...updated,
                                                    }))
                                                }
                                                fieldName={filter}
                                                close={setOpenFilter}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div
                                        className="registry-table__thead-label"
                                        style={{
                                            maxWidth: "200px",
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
                                        setSortBy={setSortBy}
                                    />
                                )}
                            </div>
                        </th>
                    );
                }
            )}

            {(mode.edit === "full" || mode.delete === "full") && (
                <th className="max-w-[100px]">Действия</th>
            )}
        </tr>
    );
};

export default AdminTheadRow;
