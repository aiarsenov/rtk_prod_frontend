import FilterButton from "../FilterButton";
import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import Hint from "../Hint/Hint";

const ReferenceBooksTheadItems = ({
    bookId,
    COLUMNS,
    filterOptions,
    filters,
    setFilters,
    openFilter,
    setOpenFilter,
}) => {
    return (
        <>
            {COLUMNS[bookId].map(({ label, key, filter, options, hint }) => {
                return (
                    <th className="min-w-[80px]" rowSpan="2" key={key}>
                        <div className="registry-table__thead-item">
                            {filter ? (
                                <>
                                    <div
                                        className="registry-table__thead-label"
                                        // style={{
                                        //     maxWidth: "200px",
                                        // }}
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

                                    {filterOptions[options]?.length > 0 &&
                                        filterOptions[options]?.some(
                                            (val) => val !== undefined
                                        ) && (
                                            <FilterButton
                                                label={label}
                                                key={key}
                                                filterKey={key}
                                                openFilter={openFilter}
                                                setOpenFilter={setOpenFilter}
                                            />
                                        )}

                                    {openFilter === key && (
                                        <MultiSelectWithSearch
                                            options={
                                                filterOptions[options]?.length >
                                                0
                                                    ? filterOptions[
                                                          options
                                                      ]?.map((name) => ({
                                                          value: name,
                                                          label: name,
                                                      }))
                                                    : []
                                            }
                                            selectedValues={filters[filter]}
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
                                <div className="flex items-center gap-[5px]">
                                    <div
                                        className="registry-table__thead-label"
                                        // style={{
                                        //     maxWidth: "200px",
                                        // }}
                                    >
                                        {label}
                                    </div>

                                    {hint && <Hint message="" />}
                                </div>
                            )}
                        </div>
                    </th>
                );
            })}
        </>
    );
};

export default ReferenceBooksTheadItems;
