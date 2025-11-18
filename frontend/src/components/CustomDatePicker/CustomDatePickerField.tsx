import { useState } from "react";

import CustomDatePicker from "./CustomDatePicker";
import OverlayTransparent from "../Overlay/OverlayTransparent";
import formatDateDMY from "../../utils/formatDateDMY";

import "./CustomDatePicker.scss";

const CustomDatePickerField = ({
    className = "",
    type = "days",
    value,
    startDate,
    endDate,
    single = false,
    placeholder = type === "months"
        ? "мм.гггг"
        : single
        ? "дд.мм.гггг"
        : "мм.гггг - мм.гггг",
    showMonthYear = false,
    onChange,
    disabled,
    minDate,
}: {
    className: string;
    type: string;
    startDate: string;
    endDate: string;
    minDate: string | Date;
    value: string | Date;
    placeholder: string;
    onChange: () => void;
    showMonthYear: boolean;
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

    const formatMonthYear = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";

        const formatted = new Intl.DateTimeFormat("ru-RU", {
            month: "long",
            year: "numeric",
        }).format(d);

        return formatted
            .replace(" г.", "")
            .replace(/^./, (ch) => ch.toUpperCase());
    };

    const displayValue = (() => {
        if (showMonthYear) {
            if (startDate && endDate)
                return `${formatMonthYear(startDate)} - ${formatMonthYear(
                    endDate
                )}`;
            if (startDate) return formatMonthYear(startDate);
            return formatted || "";
        }

        if (startDate && endDate)
            return `${formatDateDMY(startDate, type)} - ${formatDateDMY(
                endDate,
                type
            )}`;
        if (startDate) return formatDateDMY(startDate, type);
        return formatted || "";
    })();

    return (
        <div className="custom-datepicker-wrapper">
            <div
                className={`custom-datepicker__field ${className} ${
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
