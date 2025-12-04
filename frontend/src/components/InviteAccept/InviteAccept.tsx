import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getData from "../../utils/getData";
import postData from "../../utils/postData";
import Loader from "../Loader";
import "./InviteAccept.scss";

const InviteAccept = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [invitationStatus, setInvitationStatus] = useState<string | null>(null); // Статус приглашения

    // @ts-ignore - Vite env variable
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!token) {
            toast.error("Токен приглашения не найден", {
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
            navigate("/");
            return;
        }

        loadInvitation();
    }, [token]);

    const loadInvitation = async () => {
        try {
            setLoading(true);
            const response = await getData(
                `${API_URL}invite/accept?token=${encodeURIComponent(token || "")}`
            );

            if (response.status === 200) {
                setEmail(response.data.email);
                setInvitationStatus("valid");
            }
        } catch (err: any) {
            console.log("Invitation load error:", err);
            console.log("Error data:", err.data);

            const errorData = err.data || {};
            const errorType = errorData.error_type;
            const errorMessage =
                errorData.message ||
                err.message ||
                "Ошибка загрузки приглашения";

            console.log("Error type:", errorType);
            console.log("Error message:", errorMessage);

            if (errorType === "invitation_cancelled") {
                setInvitationStatus("cancelled");
            } else if (errorType === "expired") {
                setInvitationStatus("expired");
            } else if (errorType === "already_accepted") {
                setInvitationStatus("already_accepted");
            } else {
                // Для других ошибок показываем тост и редиректим
                toast.error(errorMessage, {
                    position:
                        window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                });

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!password) {
            newErrors.password = "Пароль обязателен";
        } else if (password.length < 8) {
            newErrors.password = "Пароль должен содержать минимум 8 символов";
        }

        if (!passwordConfirmation) {
            newErrors.passwordConfirmation = "Подтверждение пароля обязательно";
        } else if (password !== passwordConfirmation) {
            newErrors.passwordConfirmation = "Пароли не совпадают";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setErrors({});

        // const toastId = toast.loading("Установка пароля...", {
        //     position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        // });

        try {
            await postData("POST", `${API_URL}invite/accept`, {
                token,
                password,
                password_confirmation: passwordConfirmation,
            });

            // toast.dismiss(query);

            // toast.update(toastId, {
            //     render: "Пароль успешно установлен! Вы будете перенаправлены на страницу входа.",
            //     type: "success",
            //     isLoading: false,
            //     autoClose: 3000,
            //     pauseOnFocusLoss: false,
            //     pauseOnHover: false,
            //     draggable: true,
            // });

            setTimeout(() => {
                window.location.href = `${API_URL}auth/login`;
            }, 2000);
        } catch (err: any) {
            const errorData = err.data || {};
            const errorMessage =
                errorData.message || err.message || "Ошибка установки пароля";

            // Обработка ошибок валидации с бекенда
            if (errorData.errors) {
                const validationErrors: Record<string, string> = {};
                Object.keys(errorData.errors).forEach((key) => {
                    validationErrors[key] = Array.isArray(errorData.errors[key])
                        ? errorData.errors[key][0]
                        : errorData.errors[key];
                });
                setErrors(validationErrors);
            }

            toast.error(errorMessage, {
                isLoading: false,
                autoClose: 4000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });

            // toast.update(toastId, {
            //     render: errorMessage,
            //     type: "error",
            //     isLoading: false,
            //     autoClose: 4000,
            //     pauseOnFocusLoss: false,
            //     pauseOnHover: false,
            //     draggable: true,
            // });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    // Показываем сообщение об отозванном приглашении
    if (invitationStatus === "cancelled") {
        return (
            <div className="invite-accept">
                <div className="invite-accept__container">
                    <div className="invite-accept__card invite-accept__card--error">
                        <div className="invite-accept__icon invite-accept__icon--error">
                            ⚠️
                        </div>
                        <h1 className="invite-accept__title">Приглашение отозвано</h1>
                        <p className="invite-accept__message">
                            Это приглашение было отозвано администратором и больше не действительно.
                        </p>
                        <p className="invite-accept__message">
                            Если вы считаете, что это ошибка, пожалуйста, обратитесь к администратору системы.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Показываем сообщение об истекшем приглашении
    if (invitationStatus === "expired") {
        return (
            <div className="invite-accept">
                <div className="invite-accept__container">
                    <div className="invite-accept__card invite-accept__card--error">
                        <div className="invite-accept__icon invite-accept__icon--error">
                            ⏰
                        </div>
                        <h1 className="invite-accept__title">Приглашение истекло</h1>
                        <p className="invite-accept__message">
                            Срок действия этого приглашения истек.
                        </p>
                        <p className="invite-accept__message">
                            Пожалуйста, обратитесь к администратору для получения нового приглашения.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Показываем сообщение об уже принятом приглашении
    if (invitationStatus === "already_accepted") {
        return (
            <div className="invite-accept">
                <div className="invite-accept__container">
                    <div className="invite-accept__card invite-accept__card--info">
                        <div className="invite-accept__icon invite-accept__icon--info">
                            ℹ️
                        </div>
                        <h1 className="invite-accept__title">Приглашение уже принято</h1>
                        <p className="invite-accept__message">
                            Это приглашение уже было использовано.
                        </p>
                        <p className="invite-accept__message">
                            Вы можете войти в систему, используя ваши учетные данные.
                        </p>
                        <button
                            className="action-button invite-accept__submit"
                            onClick={() => window.location.href = `${API_URL}auth/login`}
                        >
                            Войти в систему
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="invite-accept">
            <div className="invite-accept__container">
                <div className="invite-accept__card">
                    <h1 className="invite-accept__title">Установка пароля</h1>
                    <p className="invite-accept__subtitle">
                        Для завершения регистрации установите пароль для вашей
                        учетной записи
                    </p>

                    <div className="invite-accept__email">
                        <span className="invite-accept__email-label">
                            Email:
                        </span>
                        <span className="invite-accept__email-value">
                            {email}
                        </span>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="invite-accept__form"
                    >
                        <div className="invite-accept__field">
                            <label className="form-label" htmlFor="password">
                                Пароль
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={`form-field ${
                                    errors.password ? "form-field_error" : ""
                                }`}
                                placeholder="Введите пароль (минимум 8 символов)"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            password: "",
                                        }));
                                    }
                                }}
                                disabled={submitting}
                            />
                            {errors.password && (
                                <p className="message message-error">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="invite-accept__field">
                            <label
                                className="form-label"
                                htmlFor="password_confirmation"
                            >
                                Подтверждение пароля
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                className={`form-field ${
                                    errors.password_confirmation ||
                                    errors.passwordConfirmation
                                        ? "form-field_error"
                                        : ""
                                }`}
                                placeholder="Повторите пароль"
                                value={passwordConfirmation}
                                onChange={(e) => {
                                    setPasswordConfirmation(e.target.value);
                                    if (
                                        errors.password_confirmation ||
                                        errors.passwordConfirmation
                                    ) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            password_confirmation: "",
                                            passwordConfirmation: "",
                                        }));
                                    }
                                }}
                                disabled={submitting}
                            />
                            {(errors.password_confirmation ||
                                errors.passwordConfirmation) && (
                                <p className="message message-error">
                                    {errors.password_confirmation ||
                                        errors.passwordConfirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="action-button invite-accept__submit"
                            disabled={submitting}
                        >
                            {submitting ? "Установка..." : "Установить пароль"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InviteAccept;
