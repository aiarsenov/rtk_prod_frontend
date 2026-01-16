import { useState, useEffect } from "react";

import postData from "../../utils/postData";

import Popup from "../Popup/Popup";
import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";

import "../ExecutorBlock/ExecutorBlock.scss";

const TEMPLATE = {
    full_name: "",
    phone: "",
    position: "",
    email: "",
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const SaleAddLeadContactPopup = ({
    leadId,
    fetchLeadContacts,
    setAddLeadContact,
}: {
    leadId: number;
    fetchLeadContacts: () => void;
    setAddLeadContact: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const PhoneMask = "+{7}(000) 000 00 00";

    const [errors, setErrors] = useState({});

    const [newContact, setNewContact] = useState(TEMPLATE);

    const [isFilled, setIsFilled] = useState(false);

    const handleNewExecutor = (e, name) => {
        setNewContact({
            ...newContact,
            [name]: name === "phone" ? e : e.target.value,
        });
    };

    const handleSave = () => {
        const newErrors = {
            full_name: !newContact.full_name,
            phone: !newContact.phone,
            position: !newContact.position,
            email: !newContact.email || !validateEmail(newContact.email),
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some((err) => err)) return;

        addContact();
    };

    const addContact = () => {
        return postData(
            "POST",
            `${import.meta.env.VITE_API_URL}leads/${leadId}/contacts`,
            newContact
        )
            .then((response) => {
                if (response?.ok) {
                    fetchLeadContacts();
                    setAddLeadContact(false);
                }
            })
            .catch((error) => {
                toast.error(error.message || "Ошибка добавления контакта", {
                    containerId: "toastContainerAddContact",
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            });
    };

    useEffect(() => {
        setIsFilled(
            Object.values(newContact).every((value) => {
                if (typeof value === "string") {
                    return value.trim() !== "";
                }
                return value !== null && value !== undefined;
            })
        );
    }, [newContact]);

    return (
        <Popup
            onClick={() => setAddLeadContact(false)}
            title="Добавить ключевое лицо"
        >
            <ToastContainer containerId="toastContainerAddContact" />

            <div className="action-form__body executor-block">
                <div className="executor-block__header"></div>

                <div className="executor-block__form">
                    <div className="relative">
                        <input
                            type="text"
                            className={`form-field w-full ${
                                errors.full_name ? "form-field_error" : ""
                            }`}
                            placeholder="ФИО*"
                            value={newContact.full_name}
                            onChange={(evt) =>
                                setNewContact((prev) => ({
                                    ...prev,
                                    full_name: evt.target.value,
                                }))
                            }
                        />

                        {errors.full_name && (
                            <p className="message message-error">
                                Заполните ФИО
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            className={`form-field w-full ${
                                errors.position ? "form-field_error" : ""
                            }`}
                            type="text"
                            placeholder="Должность"
                            value={newContact.position}
                            onChange={(e) => handleNewExecutor(e, "position")}
                        />
                        {errors.position && (
                            <p className="message message-error">
                                Заполните должность
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <input
                            className={`form-field w-full ${
                                errors.email ? "form-field_error" : ""
                            }`}
                            type="email"
                            placeholder="E-mail"
                            value={newContact.email}
                            onChange={(e) => handleNewExecutor(e, "email")}
                        />
                        {errors.email && (
                            <p className="message message-error">
                                Некорректный email
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <IMaskInput
                            mask={PhoneMask}
                            className={`form-field w-full ${
                                errors.phone ? "form-field_error" : ""
                            }`}
                            name="phone"
                            type="tel"
                            inputMode="tel"
                            onAccept={(value) =>
                                handleNewExecutor(value || "", "phone")
                            }
                            value={newContact.phone || ""}
                            placeholder="Телефон"
                        />
                        {errors.phone && (
                            <p className="message message-error">
                                Заполните телефон
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="action-form__footer">
                <div className="max-w-[280px]">
                    <button
                        type="button"
                        onClick={() => setAddLeadContact(false)}
                        className="cancel-button flex-[1_0_auto]"
                    >
                        Отменить
                    </button>

                    <button
                        type="button"
                        className="action-button flex-[1_0_auto]"
                        onClick={() => {
                            if (isFilled) {
                                handleSave();
                            }
                        }}
                        disabled={!isFilled}
                        title="Добавить ключевое лицо"
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default SaleAddLeadContactPopup;
