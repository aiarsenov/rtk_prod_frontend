import { useState, useEffect } from "react";

import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";

import "./CustomDatePicker.scss";

registerLocale("ru", ru);

const formatDate = (date: Date, type) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return type === "months" ? `${year}-${month}` : `${year}-${month}-${day}`;
};

const areDatesEqual = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

const CustomDatePicker = ({
    type = "days",
    closePicker,
    onChange,
    fieldkey,
    single = false,
    value,
    minDate,
}: {
    type: string;
    closePicker: () => void;
    onChange: () => void;
    fieldkey: string;
    single?: boolean;
    value: string | Date;
    minDate: string | Date;
}) => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);
    const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);

    const [singleDate, setSingleDate] = useState<Date | null>(
        value ? new Date(value) : null
    );

    // Инициализируем singleDate при открытии календаря
    useEffect(() => {
        if (single) {
            setSingleDate(value ? new Date(value) : null);
        }
    }, [value, single]);

    const handleApply = () => {
        setDateRange(tempRange);

        const [start, end] = tempRange;
        const filters = {};

        if (start && end) {
            const fromKey = fieldkey ? `${fieldkey}_from` : "date_from";
            const toKey = fieldkey ? `${fieldkey}_to` : "date_to";

            filters[fromKey] = [formatDate(start, type)];
            filters[toKey] = [formatDate(end, type)];
        } else if (start && !end) {
            const fromKey = fieldkey ? `${fieldkey}_from` : "date_from";
            const toKey = fieldkey ? `${fieldkey}_to` : "date_to";

            filters[fromKey] = [formatDate(start, type)];
            filters[toKey] = [formatDate(start, type)];
        }

        if (!single && Object.keys(filters).length > 0) {
            onChange(filters);
        } else if (single) {
            // Если дата была снята (null), очищаем поле
            onChange(singleDate || null);
        }

        closePicker("");
    };

    const displayedYear = singleDate
        ? singleDate.getFullYear()
        : new Date().getFullYear();

    return (
        <div className={`custom-datepicker custom-datepicker_${type}`}>
            <DatePicker
                minDate={minDate}
                onChange={(update) => {
                    if (single) {
                        const clickedDate = update as Date;
                        // Если кликнули на уже выбранную дату, снимаем выбор
                        if (
                            singleDate &&
                            areDatesEqual(clickedDate, singleDate)
                        ) {
                            setSingleDate(null);
                        } else {
                            setSingleDate(clickedDate);
                        }
                    } else {
                        setTempRange(update as [Date | null, Date | null]);
                    }
                }}
                startDate={!single ? tempRange[0] ?? null : singleDate ?? null}
                selected={!single ? tempRange[0] ?? null : singleDate ?? null}
                endDate={!single ? tempRange[1] : undefined}
                selectsRange={!single}
                inline
                locale="ru"
                dateFormat={type === "months" ? "MM.yyyy" : "dd.MM.yyyy"}
                showMonthYearPicker={type === "months"}
                renderDayContents={(day, date) => {
                    const today = new Date();
                    const isToday =
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();

                    const isSelected = singleDate
                        ? areDatesEqual(date, singleDate)
                        : false;

                    return (
                        <>
                            <div
                                className={`react-datepicker__day-number ${
                                    isToday && !isSelected ? "today" : ""
                                } ${isSelected ? "selected" : ""}`}
                            >
                                {day}
                            </div>
                            <div className="react-datepicker__day-overlay"></div>
                        </>
                    );
                }}
                renderMonthContent={(monthIndex) => {
                    const monthName = new Date(0, monthIndex).toLocaleString(
                        "ru-RU",
                        { month: "long" }
                    );
                    const capitalized =
                        monthName.charAt(0).toUpperCase() + monthName.slice(1);

                    const today = new Date();

                    const isCurrentMonth =
                        monthIndex === today.getMonth() &&
                        displayedYear === today.getFullYear();

                    const isSelectedMonth =
                        singleDate &&
                        singleDate.getMonth() === monthIndex &&
                        singleDate.getFullYear() === displayedYear;

                    return (
                        <div
                            className={`custom-month ${
                                isCurrentMonth && !isSelectedMonth
                                    ? "current-month"
                                    : ""
                            } ${isSelectedMonth ? "selected-month" : ""}`}
                        >
                            {capitalized}
                        </div>
                    );
                }}
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseYear,
                    increaseYear,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => {
                    // Массив года (1900 -> текущий -> +15 лет)
                    const currentYear = new Date().getFullYear();
                    const years = Array.from(
                        { length: currentYear - 1900 + 11 },
                        (_, i) => 1900 + i
                    );

                    return (
                        <div
                            className={`custom-datepicker__header custom-datepicker__header_${type}`}
                        >
                            <div className="flex items-center gap-[10px]">
                                {type === "months" ? (
                                    <>
                                        <button
                                            onClick={decreaseYear}
                                            disabled={prevMonthButtonDisabled}
                                            className="custom-datepicker__header-actions-prev-btn"
                                            title="Предыдущий год"
                                        ></button>

                                        <select
                                            className="form-select custom-datepicker__select-year"
                                            value={date.getFullYear()}
                                            onChange={(e) =>
                                                changeYear(
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {years.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={increaseYear}
                                            disabled={nextMonthButtonDisabled}
                                            className="custom-datepicker__header-actions-next-btn"
                                            title="Следующий год"
                                        ></button>
                                    </>
                                ) : (
                                    <>
                                        <select
                                            className="form-select"
                                            value={date.getMonth()}
                                            onChange={(e) =>
                                                changeMonth(
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {Array.from(
                                                { length: 12 },
                                                (_, i) => {
                                                    const monthName = new Date(
                                                        0,
                                                        i
                                                    ).toLocaleString("ru-RU", {
                                                        month: "long",
                                                    });
                                                    const capitalized =
                                                        monthName
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        monthName.slice(1);
                                                    return (
                                                        <option
                                                            key={i}
                                                            value={i}
                                                        >
                                                            {capitalized}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>

                                        <select
                                            className="form-select custom-datepicker__select-year"
                                            value={date.getFullYear()}
                                            onChange={(e) =>
                                                changeYear(
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            {years.map((year) => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>

                            {type === "days" && (
                                <div className="custom-datepicker__header-actions">
                                    <button
                                        onClick={decreaseMonth}
                                        disabled={prevMonthButtonDisabled}
                                        className="custom-datepicker__header-actions-prev-btn"
                                        title="Предыдущий месяц"
                                    ></button>

                                    <button
                                        onClick={increaseMonth}
                                        disabled={nextMonthButtonDisabled}
                                        className="custom-datepicker__header-actions-next-btn"
                                        title="Следующий месяц"
                                    ></button>
                                </div>
                            )}
                        </div>
                    );
                }}
            />

            <div className="custom-datepicker__actions">
                <button
                    className="cancel-button"
                    onClick={() => closePicker(false)}
                >
                    Отменить
                </button>
                <button className="action-button" onClick={handleApply}>
                    Применить
                </button>
            </div>
        </div>
    );
};

export default CustomDatePicker;
