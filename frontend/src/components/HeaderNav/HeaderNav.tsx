import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
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
        section: "main",
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
    const location = useLocation();
    const [, forceUpdate] = useState(0);

    // Отслеживаем изменения location и событий доступа для обновления навигации
    useEffect(() => {
        const handleAccessDeniedChange = () => {
            forceUpdate((prev) => prev + 1);
        };

        // Слушаем кастомное событие об изменении доступа
        window.addEventListener('accessDeniedChanged', handleAccessDeniedChange);

        // Также обновляем при изменении пути
        forceUpdate((prev) => prev + 1);

        return () => {
            window.removeEventListener('accessDeniedChanged', handleAccessDeniedChange);
        };
    }, [location.pathname]);

    const getLinkAccess = (link: NavLinkItem): boolean => {
        if (link.requiresAdmin) {
            return isAdmin(user);
        }
        if (link.section) {
            return canAccess(user, link.section);
        }
        return true;
    };

    const isLinkActive = (link: NavLinkItem, hasAccess: boolean): boolean => {
        // Если нет доступа, ссылка не может быть активной
        if (!hasAccess) {
            return false;
        }

        // Проверяем, совпадает ли путь
        const pathMatches = link.url === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(link.url);

        if (!pathMatches) {
            return false;
        }

        // Проверяем, есть ли информация об ошибке доступа в sessionStorage
        // Это означает, что API вернул 403 для этого раздела
        const accessDeniedKey = `access_denied_${link.url.replace('/', '') || 'home'}`;
        const hasAccessDenied = sessionStorage.getItem(accessDeniedKey);
        if (hasAccessDenied === 'true') {
            return false;
        }

        return true;
    };

    return (
        <nav className={`header__nav ${state ? "active" : ""}`}>
            {LINKS.map((link) => {
                const hasAccess = getLinkAccess(link);

                if (!hasAccess) {
                    return (
                        <span
                            className="header__nav-item disabled"
                            title={link.title}
                            key={link.url}
                        >
                            {link.label}
                        </span>
                    );
                }

                return (
                    <NavLink
                        to={link.url}
                        className={({ isActive }) =>
                            `header__nav-item ${isActive ? "active" : ""}`
                        }
                        isActive={() => isLinkActive(link, hasAccess)}
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
                );
            })}
        </nav>
    );
};

export default HeaderNav;
