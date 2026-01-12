import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import DeleteButton from "../Buttons/DeleteButton";
import AddButton from "../Buttons/AddButton";

const AdminGroupItem = ({
    item,
    mode,
    setDeleteGroupId,
    setSelectedGroup,
    setShowAddUserModal,
    setSelectedPermissions,
    setPermissionScopes,
    setShowGroupEditor,
    setEditorState,
}) => {
    const handleOpenEditor = () => {
        setSelectedGroup(item);
        setEditorState("edit");

        // Предзаполняем существующие права группы
        const existingPermissions = {};
        const existingScopes = {};

        if (item.permissions && item.permissions.length > 0) {
            item.permissions.forEach((perm) => {
                const key = `${perm.section}_${perm.permission_type}`;
                existingPermissions[key] = true;
                existingScopes[key] = perm.scope || "full";
            });
        }

        setSelectedPermissions(existingPermissions);
        setPermissionScopes(existingScopes);
        setShowGroupEditor(true);
    };

    return (
        <tr className="registry-table__item transition text-base text-left">
            <td>
                {!item.is_system && mode.delete === "full" ? (
                    <button
                        className="text-blue"
                        type="button"
                        title="Редактировать группу"
                        onClick={handleOpenEditor}
                    >
                        {item.name || "—"}
                    </button>
                ) : (
                    item.name || "—"
                )}
            </td>

            <td>{item.users.length || "—"}</td>

            <td>{item?.creator?.name || "—"}</td>

            <td>
                {item.updated_at
                    ? format(parseISO(item.updated_at), "d MMMM yyyy, HH:mm", {
                          locale: ru,
                      })
                    : "—"}
            </td>

            <td>
                {item.created_at
                    ? format(parseISO(item.created_at), "d MMMM yyyy, HH:mm", {
                          locale: ru,
                      })
                    : "—"}
            </td>

            <td>
                <div className="admin-actions">
                    {!item.is_system && (
                        <div className="flex gap-2">
                            {!item.is_system && mode.edit === "full" && (
                                <>
                                    <AddButton
                                        label=""
                                        className="button-hint--left"
                                        title="Добавить пользователя"
                                        hint={true}
                                        onClick={() => {
                                            setSelectedGroup(item);
                                            setShowAddUserModal(true);
                                        }}
                                    />
                                    <DeleteButton
                                        onClick={() =>
                                            setDeleteGroupId(item.id)
                                        }
                                        className="button-hint--left"
                                        hint={true}
                                        title="Удалить группу"
                                        isDisabled={mode.delete !== "full"}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default AdminGroupItem;
