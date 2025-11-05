import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import "./HeaderNav.scss";

type NavLinkItem = {
    url: string;
    title: string;
    label: string;
    requiresAdmin?: boolean;
};

const LINKS: NavLinkItem[] = [
    {
        url: "/",
        title: "Показатели компании",
        label: "Главная",
    },
    {
        url: "/reports",
        title: "Перейти в реестр отчетов",
        label: "Отчеты",
    },
    {
        url: "/projects",
        title: "Перейти в реестр проектов",
        label: "Проекты",
    },
    {
        url: "/sales",
        title: "Перейти в реестр продаж",
        label: "Продажи",
    },
    {
        url: "/contragents",
        title: "Перейти в реестр заказчиков",
        label: "Заказчики",
    },

    {
        url: "/employees",
        title: "Перейти в реестр сотрудников",
        label: "Сотрудники",
    },
    {
        url: "/suppliers",
        title: "Перейти в реестр подрядчиков",
        label: "Подрядчики",
    },
    {
        url: "/reference-books",
        title: "Перейти в справочники",
        label: "Справочники",
    },
    {
        url: "/admin",
        title: "Перейти в панель администрирования",
        label: "Администрирование",
        requiresAdmin: true,
    },
];

const HeaderNav = ({
    state,
    toggleMenu,
}: {
    state: boolean;
    toggleMenu: () => void;
}) => {
    const user = useSelector((state: any) => state.user.data);

    // Проверяем, является ли пользователь админом
    const isAdmin = user?.roles?.includes("admin");
    
    const visibleLinks = LINKS.filter((link) => {
        if (link.requiresAdmin) {
            return isAdmin;
        }
        return true;
    });

    return (
        <nav className={`header__nav ${state ? "active" : ""}`}>
            {visibleLinks.map((link) => (
                <NavLink
                    to={link.url}
                    className={({ isActive }) =>
                        isActive
                            ? "header__nav-item active"
                            : "header__nav-item"
                    }
                    title={link.title}
                    key={link.url}
                    onClick={() => {
                        if (state) {
                            toggleMenu();
                        }
                    }}
                >
                    {link.label}
                </NavLink>
            ))}
        </nav>
    );
};

export default HeaderNav;
