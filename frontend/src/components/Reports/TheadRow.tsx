import TheadSortButton from "../TheadSortButton/TheadSortButton";
import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import FilterButton from "../FilterButton";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";

interface projectReportsFilters {
    selectedReports: string[];
    selectedProjects: string[];
    selectedIndusties: string[];
    selectedContragents: string[];
    selectedCreditors: string[];
    selectedManagers: string[];
    selectedPeriod: string[];
    selectedStatus: string[];
}

interface ManagementReportsFilters {
    selectedManagementReports: string[];
    selectedReportMonths: string[];
    selectedRates: string[];
    selectedResponsiblePersons: string[];
    selectedManagementStatus: string[];
}

type Props = {
    columns: object[];
    activeTab: string;
    projectReportsFilters: object;
    managementReportsFilters: object;
    setProjectReportsFilters: () => React.Dispatch<
        React.SetStateAction<projectReportsFilters>
    >;
    setManagementReportsFilters: () => React.Dispatch<
        React.SetStateAction<ManagementReportsFilters>
    >;
    sortBy: object;
    setSortBy: () => React.Dispatch<React.SetStateAction<object>>;
    openFilter: string;
    setOpenFilter: () => React.Dispatch<React.SetStateAction<string>>;
};

const TheadRow = ({
    columns,
    activeTab,
    projectReportsFilters,
    managementReportsFilters,
    setProjectReportsFilters,
    setManagementReportsFilters,
    sortBy,
    setSortBy,
    openFilter,
    setOpenFilter,
}: Props) => {
    return (
        <tr>
            {columns[activeTab === "projects" ? 0 : 1].map(
                ({
                    label,
                    key,
                    filter,
                    options,
                    is_sortable,
                    setFunc,
                    date,
                    dateValue,
                }) => {
                    return (
                        <th className="min-w-[125px]" rowSpan="2" key={key}>
                            <div className="registry-table__thead-item">
                                {(() => {
                                    if (filter) {
                                        return (
                                            <>
                                                <div className="registry-table__thead-label">
                                                    {label}
                                                </div>

                                                {(activeTab === "projects"
                                                    ? projectReportsFilters[
                                                          filter
                                                      ]
                                                    : managementReportsFilters[
                                                          filter
                                                      ]
                                                )?.length > 0 && (
                                                    <button
                                                        type="button"
                                                        title="Сбросить фильтр"
                                                        onClick={() => {
                                                            if (
                                                                activeTab ===
                                                                "projects"
                                                            ) {
                                                                setProjectReportsFilters(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [filter]:
                                                                            [],
                                                                    })
                                                                );
                                                            } else {
                                                                setManagementReportsFilters(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [filter]:
                                                                            [],
                                                                    })
                                                                );
                                                            }
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

                                                {options &&
                                                    options.length > 0 &&
                                                    options.some(
                                                        (val) =>
                                                            val !== undefined
                                                    ) && (
                                                        <FilterButton
                                                            label={label}
                                                            key={key}
                                                            filterKey={key}
                                                            openFilter={
                                                                openFilter
                                                            }
                                                            setOpenFilter={
                                                                setOpenFilter
                                                            }
                                                        />
                                                    )}

                                                {openFilter === key && (
                                                    <MultiSelectWithSearch
                                                        options={
                                                            Array.isArray(
                                                                options
                                                            ) &&
                                                            options.length > 0
                                                                ? options.map(
                                                                      (opt) =>
                                                                          typeof opt ===
                                                                          "string"
                                                                              ? {
                                                                                    value: opt,
                                                                                    label: opt,
                                                                                }
                                                                              : {
                                                                                    value:
                                                                                        opt.value ??
                                                                                        opt.name,
                                                                                    label:
                                                                                        opt.label ??
                                                                                        opt.name,
                                                                                }
                                                                  )
                                                                : []
                                                        }
                                                        selectedValues={
                                                            activeTab ===
                                                            "projects"
                                                                ? projectReportsFilters[
                                                                      filter
                                                                  ]
                                                                : managementReportsFilters[
                                                                      filter
                                                                  ]
                                                        }
                                                        onChange={(updated) => {
                                                            if (
                                                                activeTab ===
                                                                "projects"
                                                            ) {
                                                                setProjectReportsFilters(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        ...updated,
                                                                    })
                                                                );
                                                            } else {
                                                                setManagementReportsFilters(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        ...updated,
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                        filterNoSearch={
                                                            key === "score"
                                                        }
                                                        fieldName={filter}
                                                        close={setOpenFilter}
                                                    />
                                                )}

                                                {is_sortable && (
                                                    <TheadSortButton
                                                        label={label}
                                                        value={key}
                                                        sortBy={sortBy}
                                                        setSortBy={setSortBy}
                                                    />
                                                )}
                                            </>
                                        );
                                    } else if (date) {
                                        return (
                                            <>
                                                <div
                                                    className="registry-table__thead-label"
                                                    style={
                                                        dateValue &&
                                                        dateValue[
                                                            Object.keys(
                                                                dateValue
                                                            )[0]
                                                        ][0]
                                                            ? {
                                                                  overflow:
                                                                      "visible",
                                                              }
                                                            : {}
                                                    }
                                                >
                                                    {dateValue[
                                                        Object.keys(
                                                            dateValue
                                                        )[0]
                                                    ] ? (
                                                        <div className="registry-table__thead-label-date">
                                                            <span>
                                                                {dateValue &&
                                                                    dateValue[
                                                                        Object.keys(
                                                                            dateValue
                                                                        )[0]
                                                                    ][0]
                                                                        .split(
                                                                            "-"
                                                                        )
                                                                        .reverse()
                                                                        .join(
                                                                            "."
                                                                        )}
                                                            </span>

                                                            <div className="hint__message">
                                                                {(() => {
                                                                    const from =
                                                                        dateValue[
                                                                            Object.keys(
                                                                                dateValue
                                                                            )[0]
                                                                        ][0];

                                                                    const to =
                                                                        dateValue[
                                                                            Object.keys(
                                                                                dateValue
                                                                            )[1]
                                                                        ][0];

                                                                    if (!from)
                                                                        return "";

                                                                    const formattedFrom =
                                                                        from
                                                                            .split(
                                                                                "-"
                                                                            )
                                                                            .reverse()
                                                                            .join(
                                                                                "."
                                                                            );
                                                                    const formattedTo =
                                                                        to
                                                                            ? to
                                                                                  .split(
                                                                                      "-"
                                                                                  )
                                                                                  .reverse()
                                                                                  .join(
                                                                                      "."
                                                                                  )
                                                                            : null;

                                                                    return formattedTo
                                                                        ? `${formattedFrom} - ${formattedTo}`
                                                                        : formattedFrom;
                                                                })()}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        label
                                                    )}
                                                </div>

                                                {Object.keys(dateValue).length >
                                                    0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFunc("");
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

                                                <FilterButton
                                                    label={label}
                                                    key={key}
                                                    filterKey={key}
                                                    openFilter={openFilter}
                                                    setOpenFilter={
                                                        setOpenFilter
                                                    }
                                                />

                                                {openFilter === key && (
                                                    <CustomDatePicker
                                                        fieldkey={key}
                                                        closePicker={
                                                            setOpenFilter
                                                        }
                                                        onChange={(updated) => {
                                                            setFunc(updated);
                                                        }}
                                                        type={date}
                                                    />
                                                )}
                                            </>
                                        );
                                    } else {
                                        return (
                                            <>
                                                <div className="registry-table__thead-label">
                                                    {label}
                                                </div>

                                                {is_sortable && (
                                                    <TheadSortButton
                                                        label={label}
                                                        value={key}
                                                        sortBy={sortBy}
                                                        setSortBy={setSortBy}
                                                    />
                                                )}
                                            </>
                                        );
                                    }
                                })()}
                            </div>
                        </th>
                    );
                }
            )}
        </tr>
    );
};

export default TheadRow;
