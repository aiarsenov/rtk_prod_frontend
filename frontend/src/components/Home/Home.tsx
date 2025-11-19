import { useSelector } from "react-redux";
import { canAccess } from "../../utils/permissions";

import Indicators from "../Dashboards/Indicators/Indicators";
import AccessDenied from "../AccessDenied/AccessDenied";
import "../AccessDenied/AccessDenied.scss";
// Импорты других дашбордов временно закомментированы, так как табы скрыты
// import Finance from "../Dashboards/Finance/Finance";
// import Projects from "../Dashboards/Projects/Projects";
// import Sales from "../Dashboards/Sales/Sales";
// import Staff from "../Dashboards/Staff/Staff";

import "./Home.scss";

// Табы временно скрыты, оставляем для будущего использования
// const TABS = [
//     {
//         label: "Ключевые показатели",
//         key: "indicators",
//     },
//     { label: "Финансы", key: "finance" },
//     { label: "Проекты", key: "projects" },
//     { label: "Продажи", key: "sales" },
//     { label: "Персонал", key: "staff" },
// ];

// const TAB_CONTENT = {
//     indicators: <Indicators />,
//     finance: <Finance />,
//     projects: <Projects />,
//     sales: <Sales />,
//     staff: <Staff />,
// };

const Home = () => {
    const user = useSelector((state: any) => state.user.data);
    // Табы временно скрыты, всегда показываем только Indicators
    // const [activeTab, setActiveTab] = useState("indicators");

    if (!user) {
        return null;
    }

    // Проверка доступа к главной странице (дашбордам)
    if (!canAccess(user, "main")) {
        return (
            <main className="page">
                <section className="home">
                    <section className="dashboards">
                        <AccessDenied message="У вас нет прав для просмотра дашбордов" />
                    </section>
                </section>
            </main>
        );
    }

    return (
        <main className="page">
            <section className="home">
                {/* Табы временно скрыты */}
                {/* <div className="container home__container">
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
                </div> */}

                <section className="dashboards">
                    <Indicators />
                </section>
            </section>
        </main>
    );
};

export default Home;
