import { toast } from "react-toastify";

import postData from "../../utils/postData";

import AdminUserItem from "./AdminUserItem";
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
                                <AdminUserItem
                                    user={user}
                                    mode={mode}
                                    handleResendInvitation={
                                        handleResendInvitation
                                    }
                                    handleCancelInvitation={
                                        handleCancelInvitation
                                    }
                                    handleDeactivate={handleDeactivate}
                                    handleActivate={handleActivate}
                                    handleRemove2FA={handleRemove2FA}
                                    handleRequire2FA={handleRequire2FA}
                                    handleDeleteUser={handleDeleteUser}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
