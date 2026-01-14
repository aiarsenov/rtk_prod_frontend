import "./TheadSortButton.scss";

const TheadSortButton = ({
    value,
    sortBy,
    setSortBy,
}: {
    value: string;
    sortBy: { key: string; action: string };
    setSortBy: React.Dispatch<
        React.SetStateAction<{ key: string; action: string }>
    >;
}) => {
    const isActive = sortBy.key === value;

    const className = isActive
        ? sortBy.action === "ascending"
            ? "thead__item-sort-btn_ascending"
            : sortBy.action === "descending"
            ? "thead__item-sort-btn_descending"
            : ""
        : "";

    const title = !isActive
        ? "Сортировать по убыванию"
        : sortBy.action === "ascending"
        ? "Сортировать по возрастанию"
        : sortBy.action === "descending"
        ? "Отменить сортировку"
        : "Сортировать по убыванию";

    const handleClick = () => {
        if (!isActive) {
            setSortBy({ key: value, action: "ascending" });
            return;
        }

        if (sortBy.action === "ascending") {
            setSortBy({ key: value, action: "descending" });
            return;
        }

        if (sortBy.action === "descending") {
            setSortBy({ key: "", action: "" });
        }
    };

    return (
        <button
            type="button"
            className={`thead__item-sort-btn ${className}`}
            onClick={handleClick}
            title={title}
        >
            <div />
        </button>
    );
};

export default TheadSortButton;
