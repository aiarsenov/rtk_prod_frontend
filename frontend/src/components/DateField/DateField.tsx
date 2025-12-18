import { IMaskInput } from "react-imask";
import IMask from "imask";
import { useRef } from "react";

const DateField = ({
    mode = "edit",
    value = "",
    onChange,
    className,
}: {
    mode: string;
    value: string | number;
    onChange: () => void;
    className: string;
}) => {
    const isFirstRender = useRef(true);

    const handleAccept = (val: string) => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        onChange(val);
    };

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
            onAccept={handleAccept}
            placeholder={`${mode === "read" ? "" : "дд.мм.гггг"}`}
            className={className}
            inputMode="numeric"
            disabled={mode === "read"}
        />
    );
};

export default DateField;
