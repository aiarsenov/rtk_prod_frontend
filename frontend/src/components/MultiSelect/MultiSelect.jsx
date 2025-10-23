const MultiSelect = ({ options, selectedValues = [], onChange, fieldName }) => {
    const toggleValue = (value) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];

        onChange({ [fieldName]: newValues });
    };

    return (
        <ul className="grid gap-2">
            {options.map((option) => (
                <li className="multi-select__list-item" key={option.value}>
                    <label
                        className="form-checkbox"
                        htmlFor={`${option.label}_${option.value}`}
                    >
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            onChange={() => toggleValue(option.value)}
                            id={`${option.label}_${option.value}`}
                        />
                        <span className="checkbox"></span>

                        <span>{option.label}</span>
                    </label>
                </li>
            ))}
        </ul>
    );
};

export default MultiSelect;
