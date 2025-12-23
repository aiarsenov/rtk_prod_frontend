import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";

const AdminGroupItem = ({
    PERMISSION_TYPES,
    SCOPES,
    item,
    mode,
    handleEditGroup,
    handleDeleteGroup,
}) => {
    return (
        <tr className="registry-table__item transition text-base text-left">
            <td>{item.name || "—"}</td>

            <td>{item.users.length || "—"}</td>

            <td>{item.created_by || "—"}</td>

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
                            {mode.edit === "full" && (
                                <EditButton
                                    title="Редактировать группу"
                                    className="button-hint--left"
                                    hint={true}
                                    onClick={() => handleEditGroup(item)}
                                />
                            )}

                            {mode.delete === "full" && (
                                <DeleteButton
                                    onClick={() => handleDeleteGroup(item.id)}
                                    className="button-hint--left"
                                    hint={true}
                                    title="Удалить группу"
                                    isDisabled={mode.delete !== "full"}
                                />
                            )}
                        </div>
                    )}
                </div>
            </td>

            {/* <div className="admin-group-card__permissions">
                <div className="flex justify-between items-center mb-2">
                    <h4>Права доступа</h4>
                    {!item.is_system && mode.delete === "full" && (
                        <button
                            className="admin-btn admin-btn--secondary"
                            onClick={() => {
                                setSelectedGroup(group);

                                // Предзаполняем существующие права группы
                                const existingPermissions = {};
                                const existingScopes = {};

                                if (
                                    item.permissions &&
                                    item.permissions.length > 0
                                ) {
                                    item.permissions.forEach((perm) => {
                                        const key = `${perm.section}_${perm.permission_type}`;
                                        existingPermissions[key] = true;
                                        existingScopes[key] =
                                            perm.scope || "full";
                                    });
                                }

                                setSelectedPermissions(existingPermissions);
                                setPermissionScopes(existingScopes);
                                setShowAddPermissionModal(true);
                            }}
                        >
                            Редактировать права
                        </button>
                    )}
                </div>
                {item.permissions && item.permissions.length > 0 ? (
                    <div className="permission-list">
                        {item.permissions.map((perm) => (
                            <div key={perm.id} className="permission-tag">
                                {SECTIONS[perm.section] || perm.section} →{" "}
                                {PERMISSION_TYPES[perm.permission_type] ||
                                    perm.permission_type}{" "}
                                ({SCOPES[perm.scope] || perm.scope})
                                {!item.is_system && mode.delete === "full" && (
                                    <button
                                        onClick={() =>
                                            handleDeletePermission(
                                                item.id,
                                                perm.id
                                            )
                                        }
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm">Нет прав</div>
                )}
            </div>

            <div className="admin-group-card__users">
                <div className="flex justify-between items-center mb-2">
                    <h4>
                        Пользователи
                        <span className="text-gray-500 text-sm font-normal">
                            ({item.users?.length || 0})
                        </span>
                    </h4>
                    {!item.is_system && mode.edit === "full" && (
                        <button
                            className="admin-btn admin-btn--secondary"
                            onClick={() => {
                                setSelectedGroup(group);
                                setSelectedUsers([]);
                                setShowAddUserModal(true);
                            }}
                        >
                            Добавить пользователя
                        </button>
                    )}
                </div>
                {item.users && item.users.length > 0 ? (
                    <div className="user-list">
                        {item.users.map((user) => (
                            <div key={user.id} className="user-tag">
                                {user.name || user.email}
                                {!item.is_system && mode.delete === "full" && (
                                    <button
                                        onClick={() =>
                                            handleRemoveUser(item.id, user.id)
                                        }
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm">
                        Нет пользователей
                    </div>
                )}
            </div> */}
        </tr>
    );
};

export default AdminGroupItem;
