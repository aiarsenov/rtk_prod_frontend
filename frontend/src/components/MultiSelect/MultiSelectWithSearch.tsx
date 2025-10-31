import { useState, useEffect } from "react";
import "./MultiSelect.scss";

const MultiSelectWithSearch = ({
    options,
    selectedValues = [],
    onChange,
    filterNoSearch,
    fieldName,
    close,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [draftSelected, setDraftSelected] = useState(selectedValues);

    // Синхронизация с внешним состоянием
    useEffect(() => {
        setDraftSelected(selectedValues);
    }, [selectedValues]);

    const normalizedOptions = Array.isArray(options)
        ? options.map((opt) =>
              typeof opt === "string"
                  ? { name: opt, value: opt }
                  : {
                        name: opt.label ?? opt.name ?? opt.value,
                        value: opt.value,
                    }
          )
        : [];

    // Фильтрация по поиску
    const filteredOptions = normalizedOptions.filter((opt) => {
        if (typeof opt.name !== "string") return true;
        return opt.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const allValues = normalizedOptions.map((o) => o.value);

    const toggleValue = (value) => {
        setDraftSelected((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleSelectAll = () => setDraftSelected(allValues);

    const handleReset = () => setDraftSelected([]);

    const handleApply = () => {
        onChange({ [fieldName]: draftSelected });
        close("");
    };

    return (
        <div className="multi-select">
            {!filterNoSearch && (
                <div className="multi-select__search">
                    <input
                        type="text"
                        placeholder="Найти в списке"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-search"
                    />
                </div>
            )}

            <div className="multi-select__actions">
                <button
                    className="multi-select__selectall-button"
                    type="button"
                    onClick={handleSelectAll}
                >
                    Выбрать все
                </button>

                {draftSelected.length > 0 && (
                    <button
                        className="multi-select__reset-button"
                        type="button"
                        onClick={handleReset}
                    >
                        <span>
                            <svg
                                width="12"
                                height="13"
                                viewBox="0 0 12 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.06 6.5l2.652 2.652-1.06 1.06L6 7.561l-2.652 2.651-1.06-1.06L4.939 6.5 2.288 3.848l1.06-1.06L6 5.439l2.652-2.651 1.06 1.06L7.061 6.5z"
                                    fill="#0078D2"
                                />
                            </svg>
                        </span>
                        Сбросить
                    </button>
                )}
            </div>

            <ul
                className="multi-select__list"
                style={
                    !filterNoSearch
                        ? {}
                        : { border: "none", padding: "0", minHeight: "55px" }
                }
            >
                {filteredOptions.map((option) => (
                    <li className="multi-select__list-item" key={option.value}>
                        <label className="form-checkbox" htmlFor={option.value}>
                            <input
                                type="checkbox"
                                checked={draftSelected.includes(option.value)}
                                onChange={() => toggleValue(option.value)}
                                id={option.value}
                            />
                            <span className="checkbox"></span>
                            <span>{option.label || option.name}</span>
                        </label>
                    </li>
                ))}
            </ul>

            <div className="multi-select__footer">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={() => close("")}
                >
                    Отменить
                </button>

                <button
                    type="button"
                    className="action-button"
                    onClick={handleApply}
                >
                    Применить
                </button>
            </div>
        </div>
    );
};

export default MultiSelectWithSearch;
