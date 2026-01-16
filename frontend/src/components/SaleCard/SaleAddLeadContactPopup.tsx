import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import SelectList from "../MultiSelect/SelectList";
import Popup from "../Popup/Popup";
import { IMaskInput } from "react-imask";

import "../ExecutorBlock/ExecutorBlock.scss";

const SUPPLIER_TEMPLATE = {
    full_name: "",
    phone: "",
    position: "",
    email: "",
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const prepareContactsForSubmit = (contacts) => {
    return contacts.map(({ value, label, ...rest }) => ({
        full_name: value,
        ...rest,
    }));
};

const SaleAddLeadContactPopup = ({
    removeBlock,
    sendExecutor,
    supplierId,
}: {
    removeBlock: () => void;
    sendExecutor: () => void;
    supplierId: number;
}) => {
    const PhoneMask = "+{7}(000) 000 00 00";

    const [errors, setErrors] = useState({});

    const [contactsList, setContactsList] = useState([]);
    const [contactsArray, setContactsArray] = useState([]);

    const [newContact, setNewContact] = useState(SUPPLIER_TEMPLATE);

    const [activeTab, setActiveTab] = useState("create");
    const [isFilled, setIsFilled] = useState(false);

    const handleNewExecutor = (e, name) => {
        setNewContact({
            ...newContact,
            [name]: name === "phone" ? e : e.target.value,
        });
    };

    const handleSave = () => {
        if (activeTab == "create") {
            const newErrors = {
                full_name: !newContact.full_name,
                phone: !newContact.phone,
                position: !newContact.position,
                email: !newContact.email || !validateEmail(newContact.email),
            };

            setErrors(newErrors);
            if (Object.values(newErrors).some((err) => err)) return;

            sendExecutor([newContact]);
        } else {
            sendExecutor(prepareContactsForSubmit(contactsArray));
        }
    };

    // Получение доступных для добавления контактных лиц заказчика
    const getSupplierContacts = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }responsible-persons/supplier?supplier_id=${supplierId}`
        ).then((response) => {
            if (response.status == 200) {
                setContactsList(
                    response.data?.data?.map((person) => ({
                        value: person.full_name,
                        label: person.full_name,
                        email: person.email,
                        phone: person.phone,
                        position: person.position,
                    }))
                );
            }
        });
    };

    useEffect(() => {
        setIsFilled(false);
        setContactsArray([]);

        setNewContact(SUPPLIER_TEMPLATE);
    }, [activeTab]);

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

    useEffect(() => {
        setIsFilled(contactsArray.length > 0);
    }, [contactsArray]);

    useEffect(() => {
        getSupplierContacts();
    }, []);

    return (
        <Popup onClick={removeBlock} title="Добавить ключевое лицо">
            <div className="action-form__body executor-block">
                <div className="executor-block__header">
                    <ul className="card__tabs executor-block__tabs">
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                id="create_executor"
                                type="radio"
                                name="create_executor"
                                checked={activeTab === "create"}
                                onChange={() => setActiveTab("create")}
                            />
                            <label htmlFor="create_executor">Создать</label>
                        </li>
                        <li className="card__tabs-item radio-field_tab">
                            <input
                                id="select_executor"
                                type="radio"
                                name="select_executor"
                                checked={activeTab === "select"}
                                onChange={() => setActiveTab("select")}
                            />
                            <label htmlFor="select_executor">
                                Выбрать из списка
                            </label>
                        </li>
                    </ul>
                </div>

                {activeTab === "create" ? (
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
                                onChange={(e) =>
                                    handleNewExecutor(e, "position")
                                }
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
                ) : (
                    <SelectList
                        options={contactsList}
                        selectedContact={newContact}
                        multi={true}
                        onChange={(items) => {
                            setContactsArray(items);
                        }}
                    />
                )}
            </div>

            <div className="action-form__footer">
                <div className="max-w-[280px]">
                    <button
                        type="button"
                        onClick={removeBlock}
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
