import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import { IMaskInput } from "react-imask";
import Popup from "../Popup/Popup";
import SelectList from "../MultiSelect/SelectList";

import "./ExecutorBlock.scss";

const CREDITOR_TEMPLATE = {
    full_name: "",
    phone: "",
    position: "",
    email: "",
    creditor_id: "",
};

const CUSTOMER_TEMPLATE = {
    full_name: "",
    phone: "",
    position: "",
    email: "",
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const EmptyExecutorBlock = ({
    removeBlock,
    banks,
    type,
    sendExecutor,
    projectId,
}) => {
    const PhoneMask = "+{7}(000) 000 00 00";

    const [errors, setErrors] = useState({});
    const [isReadonly, setIsReadonly] = useState(
        type === "creditor" ? true : false
    );
    const [contactsList, setContactsList] = useState([]);
    const [allContacts, setAllContacts] = useState([]);
    const [newContact, setNewContact] = useState(
        type === "creditor" ? CREDITOR_TEMPLATE : CUSTOMER_TEMPLATE
    );
    const [activeTab, setActiveTab] = useState("create");
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
            creditor_id: type === "creditor" ? !newContact.creditor_id : false,
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some((err) => err)) return;
        sendExecutor(type, newContact);
    };

    // Получение доступных для добавления контактных лиц кредитора
    const getCreditorContacts = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }responsible-persons/creditor?project_id=${projectId}&creditor_id=${
                newContact.creditor_id
            }`
        ).then((response) => {
            if (response.status == 200) {
                setContactsList(response.data.data);
            }
        });
    };

    // Получение доступных для добавления контактных лиц заказчика
    const getContragentsContacts = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }responsible-persons/contragent?project_id=${projectId}`
        ).then((response) => {
            if (response.status == 200) {
                setContactsList(response.data.data);
            }
        });
    };

    useEffect(() => {
        if (type === "creditor") {
            setAllContacts(
                contactsList?.map((person) => ({
                    value: person.full_name,
                    label: person.full_name,
                    email: person.email,
                    phone: person.phone,
                    position: person.position,
                    creditor_id: person.creditor.id,
                }))
            );
        } else {
            setAllContacts(
                contactsList?.map((person) => ({
                    value: person.full_name,
                    label: person.full_name,
                    email: person.email,
                    phone: person.phone,
                    position: person.position,
                }))
            );
        }
    }, [contactsList]);

    useEffect(() => {
        if (type === "creditor") {
            getCreditorContacts();
            if (newContact.creditor_id !== "") {
                setIsReadonly(false);
            }
        } else if (type === "customer") {
            getContragentsContacts();
        }
    }, [newContact.creditor_id]);

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
            className={`executor-block-wrapper_${type}`}
            onClick={removeBlock}
            title="Добавить ключевое лицо"
        >
            <div className="action-form__body executor-block">
                {type === "creditor" && activeTab === "create" && (
                    <div className="mt-[10px]">
                        <div className="form-label">Банк</div>
                        <select
                            className={`form-field w-full ${
                                errors.creditor_id ? "form-field_error" : ""
                            }`}
                            onChange={(e) =>
                                setNewContact({
                                    ...newContact,
                                    creditor_id: e.target.value,
                                })
                            }
                            value={newContact.creditor_id}
                            // disabled={isReadonly}
                        >
                            <option value="">Выберите банк</option>
                            {banks?.map((bank) => (
                                <option value={bank.id} key={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>

                        {errors.creditor_id && (
                            <p className="message message-error">
                                Выберите банк
                            </p>
                        )}
                    </div>
                )}

                <div className="executor-block__header">
                    {type === "creditor" && activeTab === "create" && (
                        <strong>Контактное лицо</strong>
                    )}

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
                                disabled={isReadonly}
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
                                disabled={isReadonly}
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
                                disabled={isReadonly}
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
                                disabled={isReadonly}
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
                        options={allContacts}
                        selectedContact={newContact}
                        onChange={(selected) => {
                            if (selected) {
                                {
                                    type === "creditor"
                                        ? setNewContact({
                                              ...newContact,
                                              full_name: selected.value,
                                              phone: selected.phone || "",
                                              email: selected.email || "",
                                              position: selected.position || "",
                                              creditor_id:
                                                  type === "creditor"
                                                      ? selected?.creditor_id
                                                      : "",
                                          })
                                        : setNewContact({
                                              ...newContact,
                                              full_name: selected.value,
                                              phone: selected.phone || "",
                                              email: selected.email || "",
                                              position: selected.position || "",
                                          });
                                }

                                setIsReadonly(true);
                                setActiveTab("create");
                            } else {
                                setNewContact({
                                    ...newContact,
                                    full_name: "",
                                    phone: "",
                                    email: "",
                                    position: "",
                                });
                                setIsReadonly(false);
                                setActiveTab("create");
                            }
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
                        onClick={handleSave}
                        disabled={!isFilled}
                        title="Добавить исполнителя"
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default EmptyExecutorBlock;
