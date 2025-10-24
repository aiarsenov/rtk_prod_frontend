import { useState } from "react";

import CustomDatePicker from "./CustomDatePicker";
import OverlayTransparent from "../Overlay/OverlayTransparent";
import formatDateDMY from "../../utils/formatDateDMY";

import "./CustomDatePicker.scss";

const CustomDatePickerField = ({
    type = "days",
    value,
    startDate,
    endDate,
    single = false,
    placeholder = single ? "дд.мм.гггг" : "мм.гггг - мм.гггг",
    onChange,
    disabled,
    minDate,
}: {
    type: string;
    startDate: string;
    endDate: string;
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

    const displayValue = (() => {
        if (startDate && endDate)
            return `${formatDateDMY(startDate, type)} - ${formatDateDMY(
                endDate,
                type
            )}`;
        if (startDate) return formatDateDMY(startDate, type);
        return formatted;
    })();

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
                {displayValue || (
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
                    type={type}
                    minDate={minDate}
                />
            )}
        </div>
    );
};

export default CustomDatePickerField;
