import { useState } from "react";

import { toast } from "react-toastify";
import postData from "../../utils/postData";

import Popup from "../Popup/Popup";
import AdminUserItem from "./AdminUserItem";
import Loader from "../Loader";
import AccessDenied from "../AccessDenied/AccessDenied";

const AdminUsers = ({ mode, loadUsers, isLoading, accessDenied, users }) => {
    const [alert, setAlert] = useState({
        isOpen: false,
        title: "",
        text: "",
        confirmText: "",
        onConfirm: null,
    });

    // Обработчик попапа
    const openAlert = ({ title, text, confirmText, onConfirm }) => {
        setAlert({
            isOpen: true,
            title,
            text,
            confirmText,
            onConfirm,
        });
    };

    // Активировать пользователя
    const handleActivate = async (userId) => {
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

    // Деактивировать пользователя
    const handleDeactivate = async (userId) => {
        openAlert({
            title: "Деактивировать пользователя?",
            text: "Вы уверены, что хотите деактивировать пользователя?",
            confirmText: "Деактивировать",
            onConfirm: async () => {
                try {
                    await postData(
                        "PATCH",
                        `${
                            import.meta.env.VITE_API_URL
                        }admin/users/${userId}/deactivate`
                    );

                    loadUsers();
                    setAlert((prev) => ({ ...prev, isOpen: false }));
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
            },
        });
    };

    // Повторная отправка приглашения
    const handleResendInvitation = async (invitationId) => {
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

    // Отзыв приглашения
    const handleCancelInvitation = async (invitationId) => {
        openAlert({
            title: "Отозвать приглашение?",
            text: "Вы уверены, что хотите отозвать приглашение?",
            confirmText: "Отозвать",
            onConfirm: async () => {
                try {
                    await postData(
                        "DELETE",
                        `${
                            import.meta.env.VITE_API_URL
                        }admin/users/invitations/${invitationId}`
                    );
                    loadUsers();
                    setAlert((prev) => ({ ...prev, isOpen: false }));
                } catch (err) {
                    toast.error(err.message || "Ошибка отзыва приглашения", {
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        autoClose: 3000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                    });
                }
            },
        });
    };

    // Удаление пользователя
    const handleDeleteUser = async (userId) => {
        openAlert({
            title: "Удалить пользователя?",
            text: "Данные будут безвозвратно утеряны.",
            confirmText: "Удалить",
            onConfirm: async () => {
                try {
                    await postData(
                        "DELETE",
                        `${import.meta.env.VITE_API_URL}admin/users/${userId}`
                    );
                    loadUsers();
                    setAlert((prev) => ({ ...prev, isOpen: false }));
                } catch (err) {
                    toast.error(err.message || "Ошибка удаления пользователя", {
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        autoClose: 3000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                    });
                }
            },
        });
    };

    // Удаление 2FA
    const handleRemove2FA = (userId) => {
        openAlert({
            title: "Удалить 2FA?",
            text: "Вы уверены, что хотите удалить 2FA у пользователя?",
            confirmText: "Удалить",
            onConfirm: async () => {
                try {
                    await postData(
                        "DELETE",
                        `${
                            import.meta.env.VITE_API_URL
                        }admin/users/${userId}/2fa`
                    );
                    loadUsers();
                    setAlert((prev) => ({ ...prev, isOpen: false }));
                } catch (err) {
                    toast.error(err.message || "Ошибка удаления 2FA", {
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        autoClose: 3000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                    });
                }
            },
        });
    };

    // Запросить 2FA
    const handleRequire2FA = async (userId) => {
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
                <table className="registry-table table-auto w-full border-collapse">
                    <thead className="registry-table__thead">
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Статус</th>
                            <th>Последний вход</th>
                            {(mode.edit === "full" ||
                                mode.delete === "full") && <th className="max-w-[100px]">Действия</th>}
                        </tr>
                    </thead>

                    <tbody className="registry-table__tbody">
                        {users.map((user) => (
                            <AdminUserItem
                                key={user.id}
                                user={user}
                                mode={mode}
                                handleResendInvitation={handleResendInvitation}
                                handleCancelInvitation={handleCancelInvitation}
                                handleDeactivate={handleDeactivate}
                                handleActivate={handleActivate}
                                handleRemove2FA={handleRemove2FA}
                                handleRequire2FA={handleRequire2FA}
                                handleDeleteUser={handleDeleteUser}
                            />
                        ))}
                    </tbody>
                </table>
            )}

            {alert.isOpen && (
                <Popup
                    onClick={() =>
                        setAlert({
                            isOpen: false,
                            title: "",
                            text: "",
                            confirmText: "",
                            onConfirm: null,
                        })
                    }
                    title={alert.title}
                >
                    <form>
                        <div className="action-form__body">{alert.text}</div>

                        <div className="action-form__footer">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    setAlert({
                                        isOpen: false,
                                        title: "",
                                        text: "",
                                        confirmText: "",
                                        onConfirm: null,
                                    })
                                }
                                title={"Закрыть окно"}
                            >
                                Отмена
                            </button>

                            <button
                                type="button"
                                className="action-button"
                                onClick={alert.onConfirm}
                                title={alert.confirmText}
                            >
                                {alert.confirmText}
                            </button>
                        </div>
                    </form>
                </Popup>
            )}
        </div>
    );
};

export default AdminUsers;
