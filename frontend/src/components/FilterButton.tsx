const FilterButton = ({
    label,
    filterKey,
    openFilter,
    setOpenFilter,
}: {
    label: string;
    filterKey: string;
    openFilter: string;
    setOpenFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <button
            className={`filter-button ${
                openFilter === filterKey ? "active" : ""
            }`}
            title={`Открыть фильтр ${label}`}
            onClick={() => {
                if (!openFilter) {
                    setOpenFilter(filterKey);
                } else {
                    setOpenFilter("");
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
                    d="M2 5.093l4.8 3.429v6l2.4-1.286V8.522L14 5.093V2.522H2v2.571z"
                    fill="currentColor"
                />
            </svg>
        </button>
    );
};

export default FilterButton;
