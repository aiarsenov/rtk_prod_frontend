import CreatableSelect from "react-select/creatable";
import { components } from "react-select";

import "./CustomSelect.scss";

type OptionType = {
    value: string;
    label: string;
};

interface CustomSelectProps {
    placeholder: string;
    mode: string;
    options: OptionType[];
    onChange: () => void;
    selectedValues: number[];
    isDisabled: boolean;
}

const CustomSelect = ({
    placeholder,
    mode,
    options,
    selectedValues,
    onChange,
    isDisabled,
}: CustomSelectProps) => {
    const MultiValue = () => null;

    let selectedItems = [];

    if (selectedValues.length > 0) {
        selectedItems = selectedValues
            .map((item) => options.find((option) => option.value === item))
            .filter((option) => option !== undefined);
    }

    const Option = (props) => {
        return (
            <components.Option {...props}>
                <label
                    className="custom-select__item form-checkbox"
                    htmlFor={props.id}
                >
                    <input
                        type="checkbox"
                        id={props.id}
                        checked={props.isSelected}
                        onChange={() => null}
                    />
                    <span className="checkbox"></span>
                    <span>{props.label}</span>
                </label>
            </components.Option>
        );
    };

    return (
        <>
            <CreatableSelect
                isClearable={false}
                isMulti
                options={options}
                className="custom-select form-select-extend"
                placeholder={placeholder}
                noOptionsMessage={() => "Совпадений нет"}
                isValidNewOption={() => false}
                value={selectedItems || null}
                onChange={onChange}
                isDisabled={isDisabled}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue }}
                // menuIsOpen={true}
            />

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
                                    onClick={() => {
                                        const updated = selectedItems.filter(
                                            (selectedItem) =>
                                                selectedItem?.value !==
                                                item?.value
                                        );
                                        onChange(updated);
                                    }}
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
        </>
    );
};

export default CustomSelect;
