import { useEffect } from "react";
import { toast } from "react-toastify";

import postData from "../../utils/postData";

import Loader from "../Loader";
import AccessDenied from "../AccessDenied/AccessDenied";

import "../AccessDenied/AccessDenied.scss";

const AdminUsers = ({ mode, loadUsers, isLoading, accessDenied, users }) => {
    const handleActivate = async (userId) => {
        if (!confirm("Вы уверены, что хотите активировать пользователя?")) {
            return;
        }

        try {
            await postData(
                "PATCH",
                `${import.meta.env.VITE_API_URL}admin/users/${userId}/activate`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка активации пользователя", {
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleDeactivate = async (userId) => {
        if (!confirm("Вы уверены, что хотите деактивировать пользователя?")) {
            return;
        }

        try {
            await postData(
                "PATCH",
                `${
                    import.meta.env.VITE_API_URL
                }admin/users/${userId}/deactivate`
            );
            loadUsers();
        } catch (err) {
            toast.error(
                err.status === 403
                    ? "Нельзя деактивировать собственную учетную запись"
                    : err.message || "Ошибка деактивации пользователя",
                {
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                }
            );
        }
    };

    const handleResendInvitation = async (invitationId) => {
        if (
            !confirm("Вы уверены, что хотите повторно отправить приглашение?")
        ) {
            return;
        }

        try {
            await postData(
                "POST",
                `${
                    import.meta.env.VITE_API_URL
                }admin/users/invitations/${invitationId}/resend`
            );
            loadUsers();
        } catch (err) {
            toast.error(
                err.message || "Ошибка повторной отправки приглашения",
                {
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    autoClose: 3000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                }
            );
        }
    };

    const handleCancelInvitation = async (invitationId) => {
        if (!confirm("Вы уверены, что хотите отозвать приглашение?")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${
                    import.meta.env.VITE_API_URL
                }admin/users/invitations/${invitationId}`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка отзыва приглашения", {
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (
            !confirm(
                "Вы уверены, что хотите удалить пользователя? Это действие необратимо!"
            )
        ) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${import.meta.env.VITE_API_URL}admin/users/${userId}`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления пользователя", {
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleRemove2FA = async (userId) => {
        if (!confirm("Вы уверены, что хотите удалить 2FA у пользователя?")) {
            return;
        }

        try {
            await postData(
                "DELETE",
                `${import.meta.env.VITE_API_URL}admin/users/${userId}/2fa`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка удаления 2FA", {
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    const handleRequire2FA = async (userId) => {
        if (
            !confirm(
                "Вы уверены, что хотите установить требование 2FA для пользователя?"
            )
        ) {
            return;
        }

        try {
            await postData(
                "POST",
                `${
                    import.meta.env.VITE_API_URL
                }admin/users/${userId}/require-2fa`
            );
            loadUsers();
        } catch (err) {
            toast.error(err.message || "Ошибка установки требования 2FA", {
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
            });
        }
    };

    if (isLoading) {
        return <Loader absolute={true} />;
    }

    if (accessDenied) {
        return (
            <AccessDenied message="У вас нет прав для управления пользователями" />
        );
    }

    return (
        <div className="admin-users">
            {users.length === 0 ? (
                <div className="admin-empty">Нет пользователей</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="registry-table table-auto w-full border-collapse">
                        <thead className="registry-table__thead">
                            <tr>
                                <th>ID</th>
                                <th>Имя</th>
                                <th>Email</th>
                                <th>Статус</th>
                                <th>Последний вход</th>
                                {mode.edit === "full" ||
                                    (mode.delete === "full" && (
                                        <th>Действия</th>
                                    ))}
                            </tr>
                        </thead>

                        <tbody className="registry-table__tbody">
                            {users.map((user) => (
                                <tr
                                    className="registry-table__item transition text-base text-left"
                                    key={user.id}
                                >
                                    <td>
                                        {user.type === "invitation"
                                            ? "—"
                                            : user.id}
                                    </td>
                                    <td>{user.name || "—"}</td>
                                    <td>{user.email || "—"}</td>
                                    <td>
                                        <span
                                            className={`admin-badge ${
                                                user.status === "invited"
                                                    ? "admin-badge--warning"
                                                    : user.is_active
                                                    ? "admin-badge--active"
                                                    : "admin-badge--inactive"
                                            }`}
                                        >
                                            {user.status === "invited"
                                                ? "Приглашен"
                                                : user.is_active
                                                ? "Активен"
                                                : "Неактивен"}
                                        </span>
                                    </td>
                                    <td>
                                        {user.status === "invited"
                                            ? user.invited_at
                                                ? new Date(
                                                      user.invited_at
                                                  ).toLocaleString("ru-RU")
                                                : "—"
                                            : user.last_login_at
                                            ? new Date(
                                                  user.last_login_at
                                              ).toLocaleString("ru-RU")
                                            : "—"}
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            {user.status === "invited" ? (
                                                mode.edit === "full" && (
                                                    <>
                                                        <button
                                                            className="admin-btn admin-btn--primary admin-btn--sm"
                                                            onClick={() =>
                                                                handleResendInvitation(
                                                                    user.invitation_id
                                                                )
                                                            }
                                                            title="Повторно отправить приглашение"
                                                        >
                                                            Отправить повторно
                                                        </button>
                                                        <button
                                                            className="admin-btn admin-btn--danger admin-btn--sm"
                                                            onClick={() =>
                                                                handleCancelInvitation(
                                                                    user.invitation_id
                                                                )
                                                            }
                                                            title="Отозвать приглашение"
                                                        >
                                                            Отозвать
                                                        </button>
                                                    </>
                                                )
                                            ) : (
                                                <>
                                                    {mode.edit === "full" && (
                                                        <>
                                                            {user.is_active ? (
                                                                <button
                                                                    className="admin-btn admin-btn--danger admin-btn--sm"
                                                                    onClick={() =>
                                                                        handleDeactivate(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    title="Деактивировать пользователя"
                                                                >
                                                                    Деактивировать
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="admin-btn admin-btn--success admin-btn--sm"
                                                                    onClick={() =>
                                                                        handleActivate(
                                                                            user.id
                                                                        )
                                                                    }
                                                                    title="Активировать пользователя"
                                                                >
                                                                    Активировать
                                                                </button>
                                                            )}
                                                            {user.keycloak_id && (
                                                                <>
                                                                    {user.has_2fa ? (
                                                                        <button
                                                                            className="admin-btn admin-btn--danger admin-btn--sm"
                                                                            onClick={() =>
                                                                                handleRemove2FA(
                                                                                    user.id
                                                                                )
                                                                            }
                                                                            title="Удалить 2FA"
                                                                        >
                                                                            🗑️
                                                                            Удалить
                                                                            2FA
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="admin-btn admin-btn--primary admin-btn--sm"
                                                                            onClick={() =>
                                                                                handleRequire2FA(
                                                                                    user.id
                                                                                )
                                                                            }
                                                                            title="Требовать 2FA"
                                                                        >
                                                                            🔒
                                                                            Требовать
                                                                            2FA
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}

                                                    {mode.delete === "full" && (
                                                        <button
                                                            className="admin-btn admin-btn--danger admin-btn--sm"
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user.id
                                                                )
                                                            }
                                                            title="Удалить пользователя из системы"
                                                        >
                                                            Удалить
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
