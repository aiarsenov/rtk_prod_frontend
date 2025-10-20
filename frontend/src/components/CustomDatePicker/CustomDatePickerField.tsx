import { useState } from "react";

import CustomDatePicker from "./CustomDatePicker";
import OverlayTransparent from "../Overlay/OverlayTransparent";

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

    const date = new Date(value);

    const formatted = date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className="custom-datepicker-wrapper">
            <input
                type="text"
                className="form-select"
                onFocus={() => setIsOpen(!isOpen)}
                placeholder={placeholder}
                value={formatted || ""}
            />

            {isOpen !== "" && (
                <OverlayTransparent
                    state={true}
                    toggleMenu={() => setIsOpen("")}
                />
            )}

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
