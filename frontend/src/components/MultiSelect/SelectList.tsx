import { useState } from "react";

const SelectList = ({
    options = [],
    onChange,
    selectedContact,
    multi = false,
}) => {
    const [selected, setSelected] = useState(
        multi ? [] : selectedContact?.full_name || null
    );

    const handleChange = (value) => {
        if (multi) {
            let newSelected;

            if (selected.includes(value)) {
                newSelected = selected.filter((item) => item !== value);
            } else {
                newSelected = [...selected, value];
            }

            setSelected(newSelected);

            const selectedOptions = options.filter((item) =>
                newSelected.includes(item.value)
            );

            onChange?.(selectedOptions);
        } else {
            const newValue = selected === value ? null : value;
            setSelected(newValue);

            const selectedOption =
                options.find((item) => item.value === newValue) || null;

            onChange?.(selectedOption);
        }
    };

    const isChecked = (value) => {
        return multi ? selected.includes(value) : selected === value;
    };

    return (
        <ul className="form-select__list">
            {options.map((item, index) => (
                <li
                    key={`${item.value}_${index}`}
                    className={isChecked(item.value) ? "active" : ""}
                >
                    <label htmlFor={item.value}>
                        <input
                            id={item.value}
                            type="checkbox"
                            value={item.value}
                            checked={isChecked(item.value)}
                            onChange={() => handleChange(item.value)}
                        />
                        <div>{item.label}</div>
                        <span className="text-[#667085]">{item.position}</span>
                    </label>
                </li>
            ))}
        </ul>
    );
};

export default SelectList;
