import DeleteButton from "../Buttons/DeleteButton";

const AdminUserItem = ({
    user,
    mode,
    handleResendInvitation,
    handleCancelInvitation,
    handleDeactivate,
    handleActivate,
    handleRemove2FA,
    handleRequire2FA,
    handleDeleteUser,
}) => {
    return (
        <tr className="registry-table__item transition text-base text-left">
            <td>{user.type === "invitation" ? "—" : user.id}</td>

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
                        ? new Date(user.invited_at).toLocaleString("ru-RU")
                        : "—"
                    : user.last_login_at
                    ? new Date(user.last_login_at).toLocaleString("ru-RU")
                    : "—"}
            </td>

            <td className="max-w-[100px]">
                <div className="admin-actions">
                    {user.status === "invited" ? (
                        mode.edit === "full" && (
                            <>
                                <button
                                    className="button-add button-hint button-hint--left"
                                    onClick={() =>
                                        handleResendInvitation(
                                            user.invitation_id
                                        )
                                    }
                                    title="Повторно отправить приглашение"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M19 21v-6m0 0l-2 2m2-2l2 2m0-6V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C19.48 5 18.92 5 17.8 5H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C3 6.52 3 7.08 3 8.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C4.52 19 5.08 19 6.2 19H13m7.607-10.738l-5.057 3.371c-1.283.856-1.925 1.284-2.618 1.45a4.001 4.001 0 01-1.864 0c-.694-.167-1.335-.594-2.618-1.45L3.147 8.1"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    <div className="button-hint__message">
                                        Повторно отправить <br /> приглашение
                                    </div>
                                </button>
                                <button
                                    className="delete-button extended button-hint button-hint--left"
                                    onClick={() =>
                                        handleCancelInvitation(
                                            user.invitation_id
                                        )
                                    }
                                    title="Отозвать приглашение"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M16 17h5m-10 2H6.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C3 17.48 3 16.92 3 15.8V8.2c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C4.52 5 5.08 5 6.2 5h11.6c1.12 0 1.68 0 2.108.218a2 2 0 01.874.874C21 6.52 21 7.08 21 8.2V11m-.393-2.738l-5.057 3.371c-1.283.856-1.925 1.284-2.618 1.45a4.001 4.001 0 01-1.864 0c-.694-.167-1.335-.594-2.618-1.45L3.147 8.1"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    <div className="button-hint__message">
                                        Отозвать
                                        <br /> приглашение
                                    </div>
                                </button>
                            </>
                        )
                    ) : (
                        <>
                            {mode.edit === "full" && (
                                <>
                                    {user.is_active ? (
                                        <button
                                            className="delete-button extended button-hint button-hint--left"
                                            onClick={() =>
                                                handleDeactivate(user.id)
                                            }
                                            title="Деактивировать пользователя"
                                        >
                                            <span>
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M15 16l5 5m0-5l-5 5M4 21a7 7 0 017-7m4-7a4 4 0 11-8 0 4 4 0 018 0z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>

                                            <div className="button-hint__message">
                                                Деактивировать <br />
                                                пользователя
                                            </div>
                                        </button>
                                    ) : (
                                        <button
                                            className="second-add-button button-hint button-hint--left"
                                            onClick={() =>
                                                handleActivate(user.id)
                                            }
                                            title="Активировать пользователя"
                                        >
                                            <span>
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M20 18h-6m3-3v6M4 21a7 7 0 019-6.71M15 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </span>

                                            <div className="button-hint__message">
                                                Активировать <br /> пользователя
                                            </div>
                                        </button>
                                    )}
                                    {user.keycloak_id && (
                                        <>
                                            {user.has_2fa ? (
                                                <button
                                                    className="delete-button extended button-hint button-hint--left"
                                                    onClick={() =>
                                                        handleRemove2FA(user.id)
                                                    }
                                                    title="Удалить 2FA"
                                                >
                                                    <span>
                                                        <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M3 3l18 18m-4-11V8a5 5 0 00-7.646-4.243m-2.27 3.326A5.029 5.029 0 007 8v2.029m12.561 9.533a3 3 0 01-1.199 1.111C17.72 21 16.88 21 15.2 21H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 01-1.311-1.311C4 18.72 4 17.88 4 16.2v-1.4c0-1.68 0-2.52.327-3.162a3 3 0 011.311-1.311c.356-.181.774-.262 1.362-.298m13 4.373c-.002-1.419-.027-2.175-.327-2.764a3 3 0 00-1.311-1.311c-.589-.3-1.345-.325-2.764-.327M10 10H8.8c-.747 0-1.329 0-1.8.029"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>

                                                    <div className="button-hint__message">
                                                        Удалить 2FA
                                                    </div>
                                                </button>
                                            ) : (
                                                <button
                                                    className="button-add button-hint button-hint--left"
                                                    onClick={() =>
                                                        handleRequire2FA(
                                                            user.id
                                                        )
                                                    }
                                                    title="Требовать 2FA"
                                                >
                                                    <span>
                                                        <svg
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M7 10.029C7.471 10 8.053 10 8.8 10h6.4c.747 0 1.329 0 1.8.029m-10 0c-.588.036-1.006.117-1.362.298a3 3 0 00-1.311 1.311C4 12.28 4 13.12 4 14.8v1.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C6.28 21 7.12 21 8.8 21h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C20 18.72 20 17.88 20 16.2v-1.4c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311c-.356-.181-.774-.262-1.362-.298m-10 0V8a5 5 0 0110 0v2.029"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </span>

                                                    <div className="button-hint__message">
                                                        Требовать 2FA
                                                    </div>
                                                </button>
                                            )}
                                        </>
                                    )}

                                    <DeleteButton
                                        onClick={() => {
                                            if (mode.delete !== "full") return;
                                            handleDeleteUser(user.id);
                                        }}
                                        className="button-hint--left"
                                        hint={true}
                                        title="Удалить пользователя из системы"
                                        isDisabled={mode.delete !== "full"}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default AdminUserItem;
