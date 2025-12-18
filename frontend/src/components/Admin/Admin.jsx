import { useState } from "react";
import { useSelector } from "react-redux";
import { isAdmin } from "../../utils/permissions";
import AdminUsers from "./AdminUsers";
import AdminGroups from "./AdminGroups";
import AccessDenied from "../AccessDenied/AccessDenied";
import "../AccessDenied/AccessDenied.scss";
import "./Admin.scss";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("users");
    const user = useSelector((state) => state.user.data);

    const userPermitions = useSelector(
        (state) => state.user?.data?.permissions
    );

    const mode = userPermitions?.admin || {
        delete: "read",
        edit: "read",
        view: "read",
    };

    // Если нет прав на управление пользователями - показываем заглушку
    if (!isAdmin(user)) {
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
                        {activeTab === "users" && <AdminUsers mode={mode} />}
                        {activeTab === "groups" && <AdminGroups mode={mode} />}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Admin;
