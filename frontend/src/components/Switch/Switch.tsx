import "./Switch.scss";

const Switch = ({ value, label, onChange }) => {
    return (
        <label className={`switch ${value ? "checked" : ""}`} htmlFor={label}>
            <input
                type="checkbox"
                name="switch"
                id={label}
                checked={value}
                onChange={() => onChange(!value)}
            />
        </label>
    );
};

export default Switch;
