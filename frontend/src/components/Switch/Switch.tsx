import "./Switch.scss";

const Switch = ({ value, label, onChange, disabled }) => {
    return (
        <label className={`switch ${value ? "checked" : ""}`} htmlFor={label}>
            <input
                type="checkbox"
                name="switch"
                id={label}
                checked={value}
                onChange={() => {
                    if (disabled) return;
                    onChange(!value);
                }}
                disabled={disabled}
            />
        </label>
    );
};

export default Switch;
