import { IMaskInput } from "react-imask";
import IMask from "imask";

const DateField = ({ mode = "edit", value = "", onChange, className }) => {
    return (
        <IMaskInput
            mask={Date}
            blocks={{
                d: { mask: IMask.MaskedRange, from: 1, to: 31 },
                m: { mask: IMask.MaskedRange, from: 1, to: 12 },
                Y: { mask: IMask.MaskedRange, from: 1900, to: 2099 },
            }}
            lazy={true}
            autofix={true}
            value={value}
            onAccept={(val) => onChange?.(val)}
            placeholder={`${mode === "read" ? "" : "дд.мм.гггг"}`}
            className={className}
            inputMode="numeric"
            disabled={mode === "read"}
        />
    );
};

export default DateField;
