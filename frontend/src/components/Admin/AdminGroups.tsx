import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import AccessDenied from "../AccessDenied/AccessDenied";
import Loader from "../Loader";
import AdminGroupItem from "./AdminGroupItem";
import GroupEditor from "./GroupEditor";
import Popup from "../Popup/Popup";

const AdminGroups = ({
    mode,
    isLoading,
    accessDenied,
    loadGroups,
    groups,
    showGroupEditor,
    setShowGroupEditor,
    editorState,
    setEditorState,
}) => {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [error, setError] = useState("");

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [deleteGroupId, setDeleteGroupId] = useState(null);

    const [selectedPermissions, setSelectedPermissions] = useState({}); // Чекбоксы выбора прав
    // Формат: { 'section_permissionType': true/false }

    const [permissionScopes, setPermissionScopes] = useState({}); // Скоупы для каждой конкретной ячейки (раздел + тип права)
    // Формат: { 'section_permissionType': 'full' | 'limited' }

    const loadAllUsers = async () => {
        try {
            const response = await getData(
                `${import.meta.env.VITE_API_URL}admin/users`
            );
            if (response.status === 200) {
                setAllUsers(response.data.data || []);
            }
        } catch (err) {
            console.error("Ошибка загрузки пользователей:", err);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            await postData(
                "DELETE",
                `${
                    import.meta.env.VITE_API_URL
                }admin/permission-groups/${deleteGroupId}`
            );

            setDeleteGroupId(null);
            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления группы", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
        }
    };

    const handleAddUsers = async () => {
        setError("");

        if (selectedUsers.length === 0) {
            setError("Выберите хотя бы одного пользователя");
            return;
        }

        try {
            await postData(
                "POST",
                `${import.meta.env.VITE_API_URL}admin/permission-groups/${
                    selectedGroup.id
                }/users`,
                {
                    user_ids: selectedUsers,
                }
            );

            setShowAddUserModal(false);
            setSelectedUsers([]);
            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка добавления пользователей", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
            setError(err.message || "Ошибка добавления пользователей");
        }
    };

    const handleRemoveUser = async (groupId, userId) => {
        if (!confirm("Удалить пользователя из группы?")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${API_URL}admin/permission-groups/${groupId}/users/${userId}`
            );

            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления пользователя", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const closeEditor = () => {
        setShowGroupEditor(false);
        setSelectedGroup(null);
        setSelectedPermissions({});
        setPermissionScopes({});
    };

    useEffect(() => {
        loadAllUsers();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (accessDenied) {
        return (
            <AccessDenied message="У вас нет прав для управления группами и правами" />
        );
    }

    return (
        <div className="admin-groups">
            {groups.length === 0 ? (
                <div className="admin-empty">Нет групп</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="registry-table table-auto w-full border-collapse">
                        <thead className="registry-table__thead">
                            <tr>
                                <th>Группа</th>
                                <th>Кол-во пользователей</th>
                                <th>Автор</th>
                                <th>Дата изменения</th>
                                <th>Дата создания</th>
                            </tr>
                        </thead>

                        <tbody className="registry-table__tbody">
                            {groups.map((item) => (
                                <AdminGroupItem
                                    key={item.id}
                                    item={item}
                                    mode={mode}
                                    setDeleteGroupId={setDeleteGroupId}
                                    setSelectedGroup={setSelectedGroup}
                                    setSelectedUsers={setSelectedUsers}
                                    setShowAddUserModal={setShowAddUserModal}
                                    setSelectedPermissions={
                                        setSelectedPermissions
                                    }
                                    setPermissionScopes={setPermissionScopes}
                                    setShowGroupEditor={setShowGroupEditor}
                                    setEditorState={setEditorState}
                                    handleRemoveUser={handleRemoveUser}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Модальное окно добавления прав */}
            {showGroupEditor && (
                <GroupEditor
                    editorState={editorState}
                    closeEditor={closeEditor}
                    selectedGroup={selectedGroup}
                    selectedPermissions={selectedPermissions}
                    setSelectedPermissions={setSelectedPermissions}
                    permissionScopes={permissionScopes}
                    setPermissionScopes={setPermissionScopes}
                    loadGroups={loadGroups}
                />
            )}

            {/* Модальное окно добавления пользователей */}
            {showAddUserModal && selectedGroup && (
                <div
                    className="admin-modal"
                    onClick={() => setShowAddUserModal(false)}
                >
                    <div
                        className="admin-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal__header">
                            <h2>Добавить пользователей</h2>
                        </div>
                        <form onSubmit={handleAddUsers}>
                            <div className="admin-modal__body">
                                <div className="admin-form">
                                    <div className="admin-form__group">
                                        <label className="admin-form__label">
                                            Выберите пользователей
                                        </label>
                                        <div
                                            style={{
                                                maxHeight: "300px",
                                                overflowY: "auto",
                                                border: "1px solid var(--color-gray-40)",
                                                borderRadius: "6px",
                                                padding: "8px",
                                            }}
                                        >
                                            {allUsers
                                                .filter(
                                                    (user) =>
                                                        !selectedGroup.users?.some(
                                                            (u) =>
                                                                u.id === user.id
                                                        )
                                                )
                                                .map((user) => (
                                                    <div
                                                        key={user.id}
                                                        style={{
                                                            padding: "4px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <label
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: "8px",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedUsers.includes(
                                                                    user.id
                                                                )}
                                                                onChange={() =>
                                                                    toggleUserSelection(
                                                                        user.id
                                                                    )
                                                                }
                                                            />
                                                            {user.name ||
                                                                user.email}
                                                        </label>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="admin-form__error">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="admin-modal__footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn--secondary"
                                    onClick={() => setShowAddUserModal(false)}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn admin-btn--primary"
                                >
                                    Добавить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteGroupId && (
                <Popup
                    title="Удалить группу?"
                    onClick={() => setDeleteGroupId(null)}
                >
                    <div className="action-form__body">
                        <p>Данные будут безвозвратно утеряны.</p>
                    </div>

                    <div className="action-form__footer">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setDeleteGroupId(null)}
                            title="Отменить удаление группы"
                        >
                            Отмена
                        </button>

                        <button
                            type="button"
                            className="action-button"
                            title="Удалить группу"
                            onClick={handleDeleteGroup}
                        >
                            Удалить
                        </button>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default AdminGroups;
