import { useState, useEffect } from "react";

const SortBtn = ({ label, value, sortBy, setSortBy, className = "" }) => {
    const getInitialState = () => {
        if (sortBy.key === value) {
            switch (sortBy.action) {
                case "ascending":
                    return {
                        class: "sort-btn_ascending",
                        title: "Сортировать по возрастанию",
                    };
                case "descending":
                    return {
                        class: "sort-btn_descending",
                        title: "Отменить сортировку",
                    };
            }
        }
        return { class: "", title: "Сортировать по убыванию" };
    };

    const [state, setState] = useState(getInitialState);

    const handleState = () => {
        switch (state.class) {
            case "":
                setSortBy({ key: value, action: "ascending" });
                break;

            case "sort-btn_ascending":
                setSortBy({ key: value, action: "descending" });
                break;

            case "sort-btn_descending":
                setSortBy({ key: "", action: "" });
                break;
        }
    };

    useEffect(() => {
        setState(getInitialState());
    }, [sortBy, value]);

    return (
        <button
            type="button"
            className={`sort-btn ${className} ${state.class}`}
            onClick={handleState}
            title={state.title}
        >
            {label}
            <span></span>
        </button>
    );
};

export default SortBtn;
