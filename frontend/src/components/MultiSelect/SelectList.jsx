import { useState } from "react";

const SelectList = ({ options = [], onChange, selectedContact }) => {
    const [selected, setSelected] = useState(
        selectedContact?.full_name || null
    );

    const handleChange = (value) => {
        const newValue = selected === value ? null : value;
        setSelected(newValue);

        const selectedOption =
            options.find((item) => item.value === newValue) || null;
        onChange?.(selectedOption);
    };

    return (
        <ul className="form-select__list">
            {options.map((item, index) => (
                <li
                    key={`${item.value}_${index}`}
                    className={`${selected === item.value ? "active" : ""}`}
                >
                    <label htmlFor={item.value}>
                        <input
                            id={item.value}
                            type="checkbox"
                            value={item.value}
                            checked={selected === item.value}
                            onChange={() => handleChange(item.value)}
                        />
                        <span>{item.label}</span>
                    </label>
                </li>
            ))}
        </ul>
    );
};

export default SelectList;
