import { useState } from "react";
import { useSelector } from "react-redux";
import AdminUsers from "./AdminUsers";
import AdminGroups from "./AdminGroups";
import AccessDenied from "./AccessDenied";
import "./Admin.scss";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("users");
    const user = useSelector((state) => state.user.data);

    // Проверяем, является ли пользователь админом
    const isAdmin = user?.roles?.includes("admin");

    // Если не админ - показываем заглушку
    if (!isAdmin) {
        return (
            <main className="page">
                <div className="container py-8">
                    <AccessDenied message="Доступ к админ-панели разрешен только администраторам" />
                </div>
            </main>
        );
    }

    return (
        <main className="page">
            <div className="container py-8">
                <div className="flex justify-between items-center gap-6 mb-8">
                    <h1 className="text-3xl font-medium">Администрирование</h1>
                </div>

                <div className="admin-tabs">
                    <div className="admin-tabs__header">
                        <button
                            className={`admin-tabs__tab ${
                                activeTab === "users" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("users")}
                        >
                            Пользователи
                        </button>
                        <button
                            className={`admin-tabs__tab ${
                                activeTab === "groups" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("groups")}
                        >
                            Группы
                        </button>
                    </div>

                    <div className="admin-tabs__content">
                        {activeTab === "users" && <AdminUsers />}
                        {activeTab === "groups" && <AdminGroups />}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Admin;
