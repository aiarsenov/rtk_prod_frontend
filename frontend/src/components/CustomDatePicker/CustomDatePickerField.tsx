import { useState } from "react";

import CustomDatePicker from "./CustomDatePicker";

import "./CustomDatePicker.scss";

const CustomDatePickerField = ({
    value,
    placeholder = "дд.мм.гггг",
    onChange,
    single = false,
    disabled,
}: {
    single: boolean;
    disabled: boolean;
}) => {
    const [isOpen, setIsOpen] = useState("");

    return (
        <div className="custom-datepicker-wrapper">
            <input
                type="text"
                className="form-select"
                onFocus={() => setIsOpen(!isOpen)}
                onBlur={() => setIsOpen("")}
                placeholder={placeholder}
                value={value || ""}
            />

            {isOpen != "" && (
                <CustomDatePicker
                    closePicker={setIsOpen}
                    onChange={(updated) => onChange(updated)}
                    value={value}
                    single={single}
                />
            )}
        </div>
    );
};

export default CustomDatePickerField;
