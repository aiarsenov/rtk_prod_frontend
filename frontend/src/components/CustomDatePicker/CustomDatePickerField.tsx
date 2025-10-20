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

    const date = value ? new Date(value) : null;

    const formatted = date
        ? date.toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          })
        : null;

    return (
        <div className="custom-datepicker-wrapper">
            <div
                className={`custom-datepicker__field ${
                    disabled ? "disabled" : ""
                }`}
                onClick={() => {
                    if (disabled) return;
                    setIsOpen(!isOpen);
                }}
            >
                {formatted || (
                    <span className="placeholder">{placeholder}</span>
                )}
            </div>

            {isOpen !== "" && (
                <OverlayTransparent
                    state={true}
                    toggleMenu={() => setIsOpen("")}
                />
            )}

            {isOpen != "" && !disabled && (
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
