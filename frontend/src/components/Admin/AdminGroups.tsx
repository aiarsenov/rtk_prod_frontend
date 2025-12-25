import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";

import AccessDenied from "../AccessDenied/AccessDenied";
import Loader from "../Loader";
import Popup from "../Popup/Popup";
import AdminGroupItem from "./AdminGroupItem";
import GroupEditor from "./GroupEditor";
import AdminGroupAddUsersModal from "./AdminGroupAddUsersModal";

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

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [deleteGroupId, setDeleteGroupId] = useState(null);

    const [selectedPermissions, setSelectedPermissions] = useState({}); // Чекбоксы выбора прав
    // Формат: { 'section_permissionType': true/false }

    const [permissionScopes, setPermissionScopes] = useState({}); // Скоупы для каждой конкретной ячейки (раздел + тип права)
    // Формат: { 'section_permissionType': 'full' | 'limited' }

    // Получение пользователей
    const loadAllUsers = () => {
        return getData(`${import.meta.env.VITE_API_URL}admin/users`)
            .then((response) => {
                if (response.status === 200) {
                    setAllUsers(response.data.data || []);
                }
            })
            .catch((error) =>
                console.error("Ошибка загрузки пользователей:", error)
            );
    };

    // Удаление группы
    const handleDeleteGroup = () => {
        return postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }admin/permission-groups/${deleteGroupId}`
        )
            .then((response) => {
                if (response?.ok) {
                    setDeleteGroupId(null);
                    loadGroups();
                }
            })
            .catch((error) =>
                toast.error(error.message || "Ошибка удаления группы", {
                    isLoading: false,
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                })
            );
    };

    // Закрепление пользователей за группой
    const handleAddGroupUsers = (users) => {
        if (users.length === 0) {
            alert("Выберите хотя бы одного пользователя");
            return;
        }

        return postData(
            "POST",
            `${import.meta.env.VITE_API_URL}admin/permission-groups/${
                selectedGroup.id
            }/users`,
            {
                user_ids: users,
            }
        )
            .then((response) => {
                if (response?.ok) {
                    setShowAddUserModal(false);
                    setSelectedUsers([]);
                    loadGroups();
                }
            })
            .catch((error) =>
                toast.error(
                    error.message || "Ошибка добавления пользователей",
                    {
                        isLoading: false,
                        autoClose: 3000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    }
                )
            );
    };

    // const handleRemoveUser = async (groupId, userId) => {
    //     if (!confirm("Удалить пользователя из группы?")) {
    //         return;
    //     }

    //     try {
    //         await postData(
    //             "DELETE",
    //             `${API_URL}admin/permission-groups/${groupId}/users/${userId}`
    //         );

    //         loadGroups();
    //     } catch (err) {
    //         toast.error(err.message || "Ошибка удаления пользователя", {
    //             isLoading: false,
    //             autoClose: 3000,
    //             pauseOnFocusLoss: false,
    //             pauseOnHover: false,
    //             position:
    //                 window.innerWidth >= 1440 ? "bottom-right" : "top-right",
    //         });
    //     }
    // };

    const closeEditor = () => {
        setShowGroupEditor(false);
        setSelectedGroup(null);
        setSelectedPermissions({});
        setPermissionScopes({});
    };

    const closeAddUsersModal = () => {
        setShowAddUserModal(false);
        setSelectedGroup(null);
    };

    useEffect(() => {
        loadAllUsers();
    }, []);

    useBodyScrollLock(showAddUserModal || deleteGroupId || showGroupEditor); // Блокируем экран при открытии попапа или редактора отчета

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
                                    // handleRemoveUser={handleRemoveUser}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Модальное окно добавления прав */}
            {/* {showGroupEditor && ( */}
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
            {/* )} */}

            {/* Модальное окно закрепления пользователей за группой */}
            {showAddUserModal && selectedGroup && (
                <AdminGroupAddUsersModal
                    allUsers={allUsers}
                    selectedGroup={selectedGroup}
                    closeModal={closeAddUsersModal}
                    handleAddGroupUsers={handleAddGroupUsers}
                />
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
