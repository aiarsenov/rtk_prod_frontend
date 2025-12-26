import { useEffect, useState } from "react";
import Select from "react-select";

const ScrollCloseSelect = ({
    options,
    placeholder = "—",
    className = "form-select-extend",
    classNamePrefix = "form-select-extend",
    isSearchable = false,
    onChange,
    value,
    ...props
}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return;

        const handleScroll = (e) => {
            const menu = document.querySelector(
                `.${classNamePrefix}__menu-portal`
            );

            if (!menu) return;

            if (!menu.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("scroll", handleScroll, true);

        return () => {
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, [menuOpen, classNamePrefix]);

    return (
        <Select
            className={className}
            classNamePrefix={classNamePrefix}
            options={options}
            placeholder={placeholder}
            isSearchable={isSearchable}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            menuIsOpen={menuOpen}
            onMenuOpen={() => setMenuOpen(true)}
            onMenuClose={() => setMenuOpen(false)}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
};

export default ScrollCloseSelect;
