import { useRef, useEffect } from "react";
import { IMaskInput } from "react-imask";
import IMask from "imask";

const DateField = ({
    mode = "edit",
    value = "",
    onChange,
    className,
}: {
    mode: string;
    value: string | number;
    onChange: (value: string) => void;
    className: string;
}) => {
    const isFirstRender = useRef(true);
    const inputRef = useRef(null);

    const handleAccept = (val: string) => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        onChange(val);
    };

    // Копирование в буфер обмена
    const copyToClipboard = async () => {
        if (!value) return;
        
        try {
            await navigator.clipboard.writeText(String(value));
        } catch (err) {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = String(value);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    };

    // Обработчик клавиш
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Ctrl+C / Cmd+C - копировать значение
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            copyToClipboard();
            return;
        }

        // Delete - удалить значение если нет выделения текста
        if (e.key === 'Delete') {
            // Проверяем, что нет модификаторов и нет выделения
            if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                const input = e.target as HTMLInputElement;
                const selectionStart = input.selectionStart;
                const selectionEnd = input.selectionEnd;
                
                // Если нет выделения текста (курсор просто мигает)
                if (selectionStart === selectionEnd) {
                    // Удаляем все значение
                    onChange("");
                    e.preventDefault();
                }
                // Если есть выделение текста - оставляем стандартное поведение
            }
            return;
        }
    };

    useEffect(() => {
        isFirstRender.current = false;
    }, []);

    return (
        <IMaskInput
            ref={inputRef}
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
            onKeyDown={handleKeyDown}
            placeholder={`${mode === "read" ? "" : "дд.мм.гггг"}`}
            className={className}
            inputMode="numeric"
            disabled={mode === "read"}
        />
    );
};

export default DateField;