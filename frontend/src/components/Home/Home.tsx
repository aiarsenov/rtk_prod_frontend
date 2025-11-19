import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { canAccess } from "../../utils/permissions";

import Indicators from "../Dashboards/Indicators/Indicators";
import Finance from "../Dashboards/Finance/Finance";
import Projects from "../Dashboards/Projects/Projects";
import Sales from "../Dashboards/Sales/Sales";
import Staff from "../Dashboards/Staff/Staff";
import AccessDenied from "../AccessDenied/AccessDenied";

import "./Home.scss";

const TABS = [
    {
        label: "Ключевые показатели",
        key: "indicators",
        section: "main",
    },
    { label: "Финансы", key: "finance", section: "main" },
    { label: "Проекты", key: "projects", section: "project_reports" },
    { label: "Продажи", key: "sales", section: "sales" },
    { label: "Персонал", key: "staff", section: "employees" },
];

const TAB_CONTENT = {
    indicators: <Indicators />,
    finance: <Finance />,
    projects: <Projects />,
    sales: <Sales />,
    staff: <Staff />,
};

const Home = () => {
    const user = useSelector((state: any) => state.user.data);

    const availableTabs = useMemo(() => {
        return TABS.filter((tab) => canAccess(user, tab.section));
    }, [user]);

    const tabAccessMap = useMemo(() => {
        const map: Record<string, boolean> = {};
        TABS.forEach((tab) => {
            map[tab.key] = canAccess(user, tab.section);
        });
        return map;
    }, [user]);

    const [activeTab, setActiveTab] = useState(() => {
        const firstAvailable = availableTabs[0]?.key || "indicators";
        return firstAvailable;
    });

    useEffect(() => {
        if (!tabAccessMap[activeTab]) {
            const firstAvailable = availableTabs[0]?.key;
            if (firstAvailable) {
                setActiveTab(firstAvailable);
            }
        }
    }, [activeTab, tabAccessMap, availableTabs]);

    if (availableTabs.length === 0) {
        return <AccessDenied message="У вас нет прав для просмотра дашбордов" />;
    }

    return (
        <main className="page">
            <section className="home">
                {/* <div className="container home__container">
                    <ul className="card__tabs home__tabs">
                        {TABS.map((tab) => {
                            const hasAccess = tabAccessMap[tab.key];
                            return (
                                <li
                                    className={`card__tabs-item radio-field_tab ${
                                        !hasAccess ? "disabled" : ""
                                    }`}
                                    key={tab.key}
                                >
                                    <input
                                        type="radio"
                                        id={tab.key}
                                        checked={activeTab === tab.key}
                                        onChange={() => {
                                            if (hasAccess) {
                                                setActiveTab(tab.key);
                                            }
                                        }}
                                        disabled={!hasAccess}
                                    />
                                    <label htmlFor={tab.key}>{tab.label}</label>
                                </li>
                            );
                        })}
                    </ul>
                </div> */}

                <section className="dashboards">
                    {TAB_CONTENT[activeTab] || null}
                </section>
            </section>
        </main>
    );
};

export default Home;
