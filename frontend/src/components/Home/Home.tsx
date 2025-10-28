import { useState } from "react";

import Indicators from "../Dashboards/Indicators/Indicators";
import Finance from "../Dashboards/Finance/Finance";
import Projects from "../Dashboards/Projects/Projects";
import Sales from "../Dashboards/Sales/Sales";
import Staff from "../Dashboards/Staff/Staff";

import "./Home.scss";

const TABS = [
    {
        label: "Ключевые показатели",
        key: "indicators",
    },
    { label: "Финансы", key: "finance" },
    { label: "Проекты", key: "projects" },
    { label: "Продажи", key: "sales" },
    { label: "Персонал", key: "staff" },
];

const TAB_CONTENT = {
    indicators: <Indicators />,
    finance: <Finance />,
    projects: <Projects />,
    sales: <Sales />,
    staff: <Staff />,
};

const Home = () => {
    const [activeTab, setActiveTab] = useState("indicators");

    return (
        <main className="page">
            <section className="home">
                <div className="container home__container">
                    <ul className="card__tabs home__tabs">
                        {TABS.map((tab) => (
                            <li
                                className="card__tabs-item radio-field_tab"
                                key={tab.key}
                            >
                                <input
                                    type="radio"
                                    id={tab.key}
                                    checked={activeTab === tab.key}
                                    onChange={() => setActiveTab(tab.key)}
                                />
                                <label htmlFor={tab.key}>{tab.label}</label>
                            </li>
                        ))}
                    </ul>
                </div>

                <section className="dashboards">
                    {TAB_CONTENT[activeTab] || null}
                </section>
            </section>
        </main>
    );
};

export default Home;
