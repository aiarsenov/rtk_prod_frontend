import { useState } from "react";

// Хук, предотвращающий закрытие CreatableSelect при повторном клике на поле
export const useControlledSelect = (prefix) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);

    const close = () => setIsOpen(false);

    const handleMenuClose = () => {
        const active = document.activeElement;

        // Если фокус остался на инпуте текущего Select — не закрываем
        if (active && active.classList.contains(`${prefix}__input`)) {
            return;
        }

        close();
    };

    return {
        isOpen,
        open,
        close,
        handleMenuClose,
    };
};
