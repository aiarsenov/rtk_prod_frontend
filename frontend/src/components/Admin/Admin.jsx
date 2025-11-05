import { useState } from "react";
import AdminUsers from "./AdminUsers";
import AdminGroups from "./AdminGroups";
import "./Admin.scss";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("users");

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
