import { useState } from "react";

import MultiSelectWithSearch from "./MultiSelectWithSearch";
import OverlayTransparent from "../Overlay/OverlayTransparent";

const MultiSelectField = ({
    mode,
    placeholder,
    target,
    options,
    fieldName,
    selectedValues,
    onChange,
    isDisabled,
}) => {
    const [isActiveSelect, setIsActiveSelect] = useState("");

    const selectedItems = selectedValues.map((item) =>
        options.find((option) => option.value === item)
    );

    return (
        <div className="form-multiselect">
            {isActiveSelect === target && (
                <OverlayTransparent
                    state={true}
                    toggleMenu={() => setIsActiveSelect("")}
                />
            )}

            <button
                type="button"
                title="Выбрать из списка"
                className="form-multiselect__field"
                onClick={() => {
                    if (isDisabled) return;
                    setIsActiveSelect(target);
                }}
                disabled={isDisabled}
            >
                {placeholder}
            </button>

            {isActiveSelect === target && (
                <MultiSelectWithSearch
                    options={options}
                    selectedValues={selectedValues}
                    onChange={onChange}
                    fieldName={fieldName}
                    close={setIsActiveSelect}
                />
            )}

            {selectedItems.length > 0 && (
                <ul className="form-multiselect__list">
                    {selectedItems.map((item) => (
                        <li
                            className="form-multiselect__item"
                            key={item?.value}
                        >
                            <span>{item?.label}</span>

                            {mode === "edit" && (
                                <button
                                    type="button"
                                    title={`Удалить ${item?.label} из списка`}
                                    onClick={() =>
                                        onChange({
                                            [fieldName]: selectedValues.filter(
                                                (selectedValue) =>
                                                    selectedValue !==
                                                    item?.value
                                            ),
                                        })
                                    }
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.06 6l2.652 2.652-1.06 1.06L6 7.061 3.348 9.712l-1.06-1.06L4.939 6 2.288 3.348l1.06-1.06L6 4.939l2.652-2.651 1.06 1.06L7.061 6z"
                                            fill="#98A2B3"
                                        />
                                    </svg>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MultiSelectField;
