import { useState } from "react";

import CustomDatePicker from "./CustomDatePicker";

import "./CustomDatePicker.scss";

const CustomDatePickerField = ({
    value,
    single = false,
    placeholder = single ? "дд.мм.гггг" : "мм.гггг - мм.гггг",
    onChange,
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
