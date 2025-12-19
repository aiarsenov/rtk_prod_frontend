import { useRef, useMemo, useState } from "react";
import isValidDateFormat from "../../utils/isValidDateFormat";
import { IMaskInput } from "react-imask";
import IMask from "imask";

// const DateFields = ({
//     mode,
//     value = "",
//     onChange,
//     className,
// }: {
//     mode: object;
//     value: string;
//     onChange: () => void;
//     className: string;
// }) => {
//     const dateFromRef = useRef(null);
//     const dateToRef = useRef(null);

//     const [errorMessage, setErrorMessage] = useState("");

//     // Преобразуем входящую строку в объект
//     const period = useMemo(() => {
//         if (value) {
//             const [from = "", to = ""] = value.split(" - ");
//             return { date_from: from, date_to: to };
//         }
//     }, [value]);

//     const handleChange = (field, val) => {
//         const newPeriod = { ...period, [field]: val };
//         const newValue =
//             newPeriod.date_from && newPeriod.date_to
//                 ? `${newPeriod.date_from} - ${newPeriod.date_to}`
//                 : `${newPeriod.date_from}${
//                       newPeriod.date_to ? " - " + newPeriod.date_to : ""
//                   }`;

//         onChange?.(newValue);

//         if (
//             newPeriod?.date_from?.length === 10 &&
//             newPeriod?.date_to?.length === 10 &&
//             isValidDateFormat(newPeriod.date_from) &&
//             isValidDateFormat(newPeriod.date_to)
//         ) {
//             const from = new Date(
//                 newPeriod.date_from.split(".").reverse().join("-")
//             );
//             const to = new Date(
//                 newPeriod.date_to.split(".").reverse().join("-")
//             );

//             if (from <= to) {
//                 setErrorMessage("");
//             } else {
//                 setErrorMessage("Дата окончания не может раньше даты начала");
//             }
//         }
//     };

//     return (
//         <div className="grid gap-1 form-fields">
//             <div className={`${className}`}>
//                 <IMaskInput
//                     inputRef={dateFromRef}
//                     mask={Date}
//                     pattern="d.`m.`Y"
//                     blocks={{
//                         d: { mask: IMask.MaskedRange, from: 1, to: 31 },
//                         m: { mask: IMask.MaskedRange, from: 1, to: 12 },
//                         Y: { mask: IMask.MaskedRange, from: 1900, to: 2099 },
//                     }}
//                     lazy={true}
//                     autofix={true}
//                     value={period?.date_from}
//                     onAccept={(val, maskRef) => {
//                         if (maskRef.el.input?.matches(":focus")) {
//                             handleChange("date_from", val);
//                         }
//                     }}
//                     onComplete={(val, maskRef) => {
//                         if (maskRef.el.input?.matches(":focus")) {
//                             dateToRef.current?.focus();
//                         }
//                     }}
//                     placeholder={`${mode.edit !== "full" ? "" : "дд.мм.гггг"}`}
//                     className="h-full min-w-[5ch] max-w-[9ch]"
//                     inputMode="numeric"
//                     disabled={mode.edit !== "full"}
//                 />

//                 <span className="self-center text-gray-400 mr-[4px]">-</span>

//                 <IMaskInput
//                     inputRef={dateToRef}
//                     mask={Date}
//                     pattern="d.`m.`Y"
//                     blocks={{
//                         d: { mask: IMask.MaskedRange, from: 1, to: 31 },
//                         m: { mask: IMask.MaskedRange, from: 1, to: 12 },
//                         Y: { mask: IMask.MaskedRange, from: 1900, to: 2099 },
//                     }}
//                     lazy={true}
//                     autofix={true}
//                     value={period?.date_to}
//                     onAccept={(val, maskRef) => {
//                         if (maskRef.el.input?.matches(":focus")) {
//                             handleChange("date_to", val);
//                             if (val == "") {
//                                 dateFromRef.current?.focus();
//                             }
//                         }
//                     }}
//                     placeholder={`${mode.edit !== "full" ? "" : "дд.мм.гггг"}`}
//                     className="h-full min-w-[5ch] max-w-[9ch]"
//                     inputMode="numeric"
//                     disabled={mode.edit !== "full"}
//                 />
//             </div>

//             {errorMessage !== "" && (
//                 <span className="text-red-400 top-[100%] text-sm">
//                     {errorMessage}
//                 </span>
//             )}
//         </div>
//     );
// };

const DateFields = ({
    mode,
    value = "",
    onChange,
    className,
}: {
    mode: object;
    value: string;
    onChange: (value: string) => void;
    className: string;
}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const inputRef = useRef(null);

    const maskOptions = useMemo(() => {
        return {
            mask: "DD.MM.YYYY - DD.MM.YYYY",
            blocks: {
                DD: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31,
                    maxLength: 2,
                },
                MM: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12,
                    maxLength: 2,
                },
                YYYY: {
                    mask: IMask.MaskedRange,
                    from: 1900,
                    to: 2099,
                    maxLength: 4,
                },
            },
            lazy: true,
            overwrite: true,
            autofix: true,
            placeholderChar: " ",
            definitions: {
                D: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31,
                    maxLength: 2,
                },
                M: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12,
                    maxLength: 2,
                },
                Y: {
                    mask: IMask.MaskedRange,
                    from: 1900,
                    to: 2099,
                    maxLength: 4,
                },
            },
        };
    }, []);

    // Копирование диапазона в буфер обмена
    const copyToClipboard = async () => {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);
        } catch (err) {
            // Fallback для старых браузеров
            const textArea = document.createElement("textarea");
            textArea.value = value;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
    };

    const handleChange = (val: string) => {
        let cleanValue = val;

        if (cleanValue.includes(" - ")) {
            const [first, second] = cleanValue.split(" - ");

            if (first && first.trim().length > 0) {
                let cleanSecond = second || "";
                cleanSecond = cleanSecond.replace(/\s/g, "");

                if (cleanSecond.length > 0) {
                    const digits = cleanSecond.replace(/\D/g, "");
                    let formattedSecond = "";

                    if (digits.length > 0) {
                        formattedSecond = digits.slice(0, 2);
                        if (digits.length > 2) {
                            formattedSecond += "." + digits.slice(2, 4);
                            if (digits.length > 4) {
                                formattedSecond += "." + digits.slice(4, 8);
                            }
                        }
                    }

                    cleanValue = `${first} - ${formattedSecond}`;
                } else {
                    cleanValue = `${first} - `;
                }
            }
        }

        onChange?.(cleanValue.trim());

        // Валидация
        if (cleanValue && cleanValue.includes(" - ")) {
            const [from, to] = cleanValue.split(" - ");

            const isFromComplete = from?.match(/^\d{2}\.\d{2}\.\d{4}$/);
            const isToComplete = to?.match(/^\d{2}\.\d{2}\.\d{4}$/);

            if (isFromComplete && isToComplete) {
                if (isValidDateFormat(from) && isValidDateFormat(to)) {
                    const fromDate = new Date(
                        from.split(".").reverse().join("-")
                    );
                    const toDate = new Date(to.split(".").reverse().join("-"));

                    if (fromDate <= toDate) {
                        setErrorMessage("");
                    } else {
                        setErrorMessage(
                            "Дата окончания не может быть раньше даты начала"
                        );
                    }
                } else {
                    setErrorMessage("Неверный формат даты");
                }
            } else {
                setErrorMessage("");
            }
        } else {
            setErrorMessage("");
        }
    };

    const formatValueForMask = (val: string) => {
        if (!val) return "";

        if (val.includes(" - ")) {
            const [first, second] = val.split(" - ");

            if (!second || second === "") {
                return `${first} - `;
            }

            const digits = second.replace(/\D/g, "");
            let formattedSecond = "";

            if (digits.length > 0) {
                formattedSecond = digits.slice(0, 2);
                if (digits.length > 2) {
                    formattedSecond += "." + digits.slice(2, 4);
                    if (digits.length > 4) {
                        formattedSecond += "." + digits.slice(4, 8);
                    }
                }
            }

            return `${first} - ${formattedSecond}`;
        }

        return val;
    };

    // Обработчик клавиш
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+C / Cmd+C - копировать диапазон
        if ((e.ctrlKey || e.metaKey) && e.key === "c") {
            e.preventDefault();
            copyToClipboard();
            return;
        }

        // Delete - удалить весь диапазон если поле в фокусе и есть значение
        if (e.key === "Delete") {
            // Если нет модификаторов (только Delete, не Shift+Delete и т.д.)
            if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                const input = e.target as HTMLInputElement;
                const selectionStart = input.selectionStart;
                const selectionEnd = input.selectionEnd;

                // Если нет выделения текста (курсор просто мигает)
                if (selectionStart === selectionEnd) {
                    // Удаляем весь диапазон
                    onChange?.("");
                    e.preventDefault();
                }
                // Если есть выделение текста - оставляем стандартное поведение
            }
            return;
        }
    };

    return (
        <div className="grid gap-1 form-fields">
            <div className={`${className}`}>
                <IMaskInput
                    ref={inputRef}
                    {...maskOptions}
                    value={formatValueForMask(value)}
                    onAccept={(val: string) => {
                        handleChange(val);
                    }}
                    placeholder={
                        mode.edit === "full" ? "дд.мм.гггг - дд.мм.гггг" : ""
                    }
                    className="h-full min-w-full"
                    inputMode="numeric"
                    disabled={mode.edit !== "full"}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        // При фокусе, если есть дефис, ставим курсор после дефиса
                        if (value.includes(" - ")) {
                            setTimeout(() => {
                                const input = inputRef.current as any;
                                if (input && input.el) {
                                    const cursorPos = value.indexOf(" - ") + 3;
                                    input.el.setSelectionRange(
                                        cursorPos,
                                        cursorPos
                                    );
                                }
                            }, 0);
                        }
                    }}
                />
            </div>

            {errorMessage !== "" && (
                <span className="text-red-400 text-sm">{errorMessage}</span>
            )}
        </div>
    );
};

export default DateFields;
