import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAdmin, canAccess } from "../../utils/permissions";

import "./HeaderNav.scss";

type NavLinkItem = {
    url: string;
    title: string;
    label: string;
    requiresAdmin?: boolean;
    section?: string;
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
        section: "project_reports",
    },
    {
        url: "/projects",
        title: "Перейти в реестр проектов",
        label: "Проекты",
        section: "project_reports",
    },
    {
        url: "/sales",
        title: "Перейти в реестр продаж",
        label: "Продажи",
        section: "sales",
    },
    {
        url: "/contragents",
        title: "Перейти в реестр заказчиков",
        label: "Заказчики",
        section: "customers",
    },

    {
        url: "/employees",
        title: "Перейти в реестр сотрудников",
        label: "Сотрудники",
        section: "employees",
    },
    {
        url: "/suppliers",
        title: "Перейти в реестр подрядчиков",
        label: "Подрядчики",
        section: "contractors",
    },
    {
        url: "/reference-books",
        title: "Перейти в справочники",
        label: "Справочники",
        section: "dictionaries",
    },
    {
        url: "/admin",
        title: "Перейти в панель администрирования",
        label: "Администрирование",
        requiresAdmin: true,
        section: "main",
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

    const visibleLinks = LINKS.filter((link) => {
        if (link.requiresAdmin) {
            return isAdmin(user);
        }
        if (link.section) {
            return canAccess(user, link.section);
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
