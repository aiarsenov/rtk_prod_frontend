import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import { isAdmin } from "../../utils/permissions";
import { toast } from "react-toastify";

import AccessDenied from "../AccessDenied/AccessDenied";
import AdminUsers from "./AdminUsers";
import AdminGroups from "./AdminGroups";
import ActiveButton from "../Buttons/ActiveButton";
import Popup from "../Popup/Popup";
import SubmitButton from "../Buttons/SubmitButton";

import "../AccessDenied/AccessDenied.scss";
import "./Admin.scss";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("users");

    const [users, setUsers] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [usersIsLoading, setUsersIsLoading] = useState(false);
    const [usersSubmit, setIsSubmit] = useState(false);

    const [groups, setGroups] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false); // Попап приглашения пользователей
    const [showGroupEditor, setShowGroupEditor] = useState(false); // Попап добавления группы
    const [editorState, setEditorState] = useState("create"); // Режим редактора группы

    const [accessDenied, setAccessDenied] = useState(false);
    const user = useSelector((state) => state.user.data);

    const userPermitions = useSelector(
        (state) => state.user?.data?.permissions
    );

    const mode = userPermitions?.admin || {
        delete: "read",
        edit: "read",
        view: "read",
    };

    const loadUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            setAccessDenied(false);
            const response = await getData(
                `${import.meta.env.VITE_API_URL}admin/users`
            );
            if (response.status === 200) {
                setUsers(response.data.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки пользователей:", err);
            if (err.status === 403) {
                setAccessDenied(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [import.meta.env.VITE_API_URL]);

    const loadGroups = useCallback(async () => {
        try {
            setIsLoading(true);
            setAccessDenied(false);
            const response = await getData(
                `${import.meta.env.VITE_API_URL}admin/permission-groups`
            );
            if (response.status === 200) {
                setGroups(response.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки групп:", err);
            if (err.status === 403) {
                setAccessDenied(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [import.meta.env.VITE_API_URL]);

    // Получаем доступынх для приглашения сотрудников
    const fetchAvailableEmployees = () => {
        setUsersIsLoading(true);

        return getData(`${import.meta.env.VITE_API_URL}admin/users/available`)
            .then((response) => {
                if (response.status === 200) {
                    setAvailableEmployees(response.data || []);
                }
            })
            .catch((error) =>
                console.error("Ошибка загрузки сотрудников:", error)
            )
            .finally(() => setUsersIsLoading(false));
    };

    const handleInviteSubmit = () => {
        setIsSubmit(true);

        return postData(
            "POST",
            `${import.meta.env.VITE_API_URL}admin/users/invite`,
            { invitations: selectedEmployees }
        )
            .then((response) => {
                if (response.ok) {
                    setShowInviteModal(false);
                    setSelectedEmployees([]);
                    loadUsers();
                }
            })
            .catch((error) =>
                toast.error(error.message || "Ошибка отправки приглашения", {
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                })
            )
            .finally(() => setIsSubmit(false));
    };

    // Открываем попап добавления пользователей после получения списка
    const handleInviteClick = async () => {
        await fetchAvailableEmployees();
        setShowInviteModal(true);
    };

    useEffect(() => {
        if (activeTab === "users") {
            loadUsers();
        } else if (activeTab === "groups") {
            loadGroups();
        }
    }, [activeTab]);

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
        <main className="page reports-registry admin">
            <div className="container admin__container">
                <section className="registry__header flex items-center">
                    <h1 className="title">
                        Администрирование
                        <span>
                            {activeTab === "users"
                                ? users.length
                                : groups.length}
                        </span>
                    </h1>

                    <ul className="card__tabs">
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                name="active_tab"
                                id="users"
                                checked={activeTab == "users"}
                                onChange={() => {
                                    setActiveTab("users");
                                }}
                            />
                            <label htmlFor="users">Пользователи</label>
                        </li>

                        <li className="card__tabs-item radio-field_tab">
                            <input
                                type="radio"
                                name="active_tab"
                                id="groups"
                                checked={activeTab == "groups"}
                                onChange={() => {
                                    setActiveTab("groups");
                                }}
                            />
                            <label htmlFor="groups">Группы</label>
                        </li>
                    </ul>

                    {mode.edit === "full" && activeTab === "users" && (
                        <ActiveButton
                            className="ml-auto"
                            label="Добавить пользователей"
                            onClick={() => {
                                if (activeTab != "users") return;
                                handleInviteClick();
                            }}
                            isLoading={usersIsLoading}
                            isDisabled={isLoading || activeTab != "users"}
                        />
                    )}

                    {mode.edit === "full" && activeTab === "groups" && (
                        <ActiveButton
                            className="ml-auto"
                            label="Добавить группу"
                            onClick={() => {
                                if (activeTab != "groups") return;
                                setEditorState("create");
                                setShowGroupEditor(true);
                            }}
                            isDisabled={isLoading || activeTab != "groups"}
                        />
                    )}
                </section>

                <section className="admin__content registry__table-section w-full">
                    {activeTab === "users" && (
                        <AdminUsers
                            mode={mode}
                            loadUsers={loadUsers}
                            isLoading={isLoading}
                            accessDenied={accessDenied}
                            users={users}
                        />
                    )}

                    {activeTab === "groups" && (
                        <AdminGroups
                            mode={mode}
                            isLoading={isLoading}
                            accessDenied={accessDenied}
                            loadGroups={loadGroups}
                            groups={groups}
                            showGroupEditor={showGroupEditor}
                            setShowGroupEditor={setShowGroupEditor}
                            editorState={editorState}
                            setEditorState={setEditorState}
                        />
                    )}
                </section>
            </div>

            {/* Модальное окно приглашения пользователей */}
            {showInviteModal && (
                <Popup
                    onClick={() => setShowInviteModal(false)}
                    title="Добавить пользователей"
                >
                    <form className="admin-form">
                        <div className="admin-form__users">
                            <div className="multi-select__actions">
                                <button
                                    className="multi-select__selectall-button"
                                    type="button"
                                    title="Выбрать всех пользователей"
                                    onClick={() => {
                                        if (
                                            availableEmployees.length ===
                                            selectedEmployees.length
                                        )
                                            return;

                                        setSelectedEmployees(
                                            availableEmployees.map((item) => ({
                                                physical_person_id: item.id,
                                                email: item.email,
                                                resend: false,
                                            }))
                                        );
                                    }}
                                >
                                    Выбрать все
                                </button>

                                {selectedEmployees.length > 0 && (
                                    <button
                                        className="multi-select__reset-button"
                                        type="button"
                                        title="Сбросить выбор"
                                        onClick={() => setSelectedEmployees([])}
                                    >
                                        <span>
                                            <svg
                                                width="12"
                                                height="13"
                                                viewBox="0 0 12 13"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M7.06 6.5l2.652 2.652-1.06 1.06L6 7.561l-2.652 2.651-1.06-1.06L4.939 6.5 2.288 3.848l1.06-1.06L6 5.439l2.652-2.651 1.06 1.06L7.061 6.5z"
                                                    fill="#0078D2"
                                                ></path>
                                            </svg>
                                        </span>
                                        Сбросить
                                    </button>
                                )}
                            </div>

                            <div className="admin-form__users-list">
                                {availableEmployees.length > 0 &&
                                    availableEmployees.map((item) => (
                                        <label
                                            className="form-checkbox"
                                            key={item.id}
                                            htmlFor={item.id}
                                        >
                                            <div>
                                                {item.name}
                                                <span>{item.email}</span>
                                            </div>

                                            <input
                                                type="checkbox"
                                                name={item.name}
                                                id={item.id}
                                                checked={selectedEmployees.some(
                                                    (emp) =>
                                                        emp.physical_person_id ===
                                                        item.id
                                                )}
                                                onChange={(e) => {
                                                    const checked =
                                                        e.target.checked;

                                                    setSelectedEmployees(
                                                        (prev) => {
                                                            if (checked) {
                                                                const exists =
                                                                    prev.some(
                                                                        (emp) =>
                                                                            emp.physical_person_id ===
                                                                            item.id
                                                                    );

                                                                if (exists)
                                                                    return prev;

                                                                return [
                                                                    ...prev,
                                                                    {
                                                                        physical_person_id:
                                                                            item.id,
                                                                        email: item.email,
                                                                        resend: false,
                                                                    },
                                                                ];
                                                            }

                                                            return prev.filter(
                                                                (emp) =>
                                                                    emp.physical_person_id !==
                                                                    item.id
                                                            );
                                                        }
                                                    );
                                                }}
                                            />
                                            <div className="checkbox"></div>
                                        </label>
                                    ))}
                            </div>
                        </div>
                    </form>

                    <div className="action-form__footer admin-form__footer">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setShowInviteModal(false)}
                            title="Отменить приглашение"
                        >
                            Отмена
                        </button>

                        <SubmitButton
                            title="Отправить приглашение пользователям"
                            label="Добавить"
                            onClick={handleInviteSubmit}
                            isDisabled={selectedEmployees.length <= 0}
                            isLoading={usersSubmit}
                        />
                    </div>
                </Popup>
            )}
        </main>
    );
};

export default Admin;
