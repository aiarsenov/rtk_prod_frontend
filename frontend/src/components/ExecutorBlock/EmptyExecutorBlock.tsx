import { useState, useEffect } from "react";

import getData from "../../utils/getData";

import { IMaskInput } from "react-imask";
import Popup from "../Popup/Popup";
import SelectList from "../MultiSelect/SelectList";
import CreatableSelect from "react-select/creatable";

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

const prepareContactsForSubmit = (contacts) => {
    return contacts.map(({ value, label, ...rest }) => ({
        full_name: value,
        ...rest,
    }));
};

const PhoneMask = "+{7}(000) 000 00 00";

const EmptyExecutorBlock = ({
    removeBlock,
    banks,
    type,
    sendExecutor,
    projectId,
    projectData,
}) => {
    const [errors, setErrors] = useState({});

    const [contactsList, setContactsList] = useState([]);
    const [contactsArray, setContactsArray] = useState([]);

    const [newContact, setNewContact] = useState(
        type === "creditor" ? CREDITOR_TEMPLATE : CUSTOMER_TEMPLATE
    );

    const isCreditorLocked = type === "creditor" && !newContact.creditor_id;

    const [activeTab, setActiveTab] = useState("create");
    const [isFilled, setIsFilled] = useState(false);

    const formattedBanks =
        banks?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || [];

    const addContragentId = (contacts, contragentId) => {
        return contacts.map((item) => ({
            ...item,
            contragent_id: contragentId,
        }));
    };

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
                creditor_id:
                    type === "creditor" ? !newContact.creditor_id : false,
            };

            setErrors(newErrors);
            if (Object.values(newErrors).some((err) => err)) return;

            sendExecutor(
                type,
                type === "creditor"
                    ? [newContact]
                    : addContragentId([newContact], projectData?.contragent_id)
            );
        } else {
            sendExecutor(
                type,
                type === "creditor"
                    ? prepareContactsForSubmit(contactsArray)
                    : addContragentId(
                          prepareContactsForSubmit(contactsArray),
                          projectData?.contragent_id
                      )
            );
        }
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
                if (response.data.data.length > 0) {
                    setContactsList(
                        response.data?.data?.map((person) => ({
                            value: person.full_name,
                            label: person.full_name,
                            email: person.email,
                            phone: person.phone,
                            position: person.position,
                            creditor_id: person.creditor.id,
                            creditor_name: person.creditor.name,
                        }))
                    );
                }
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

        if (type === "creditor") {
            setNewContact((prev) => ({
                ...CREDITOR_TEMPLATE,
                creditor_id: prev.creditor_id ?? null,
            }));
        } else {
            setNewContact(CUSTOMER_TEMPLATE);
        }
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
        if (type === "creditor") {
            getCreditorContacts();
        } else if (type === "customer") {
            getContragentsContacts();
        }
    }, [newContact.creditor_id]);

    return (
        <Popup
            className={`executor-block-wrapper_${type}`}
            onClick={removeBlock}
            title="Добавить ключевое лицо"
        >
            <form>
                <div className="action-form__body executor-block">
                    {type === "creditor" && activeTab === "create" && (
                        <div className="mt-[10px]">
                            <div className="form-label">Банк</div>

                            <CreatableSelect
                                options={formattedBanks}
                                placeholder={"Банк"}
                                className="form-select-extend"
                                noOptionsMessage={() => "Совпадений нет"}
                                isValidNewOption={() => false}
                                value={
                                    (formattedBanks.length > 0 &&
                                        formattedBanks.find(
                                            (option) =>
                                                option.value ===
                                                newContact.creditor_id
                                        )) ||
                                    null
                                }
                                onChange={(selectedOption) => {
                                    const newValue =
                                        +selectedOption?.value || null;

                                    setNewContact({
                                        ...newContact,
                                        creditor_id: newValue,
                                    });
                                }}
                                styles={{
                                    input: (base) => ({
                                        ...base,
                                        maxWidth: "100%",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }),
                                }}
                            />
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
                                    onChange={() =>
                                        !isCreditorLocked &&
                                        setActiveTab("create")
                                    }
                                    disabled={isCreditorLocked}
                                />
                                <label htmlFor="create_executor">Создать</label>
                            </li>
                            <li className="card__tabs-item radio-field_tab">
                                <input
                                    id="select_executor"
                                    type="radio"
                                    name="select_executor"
                                    checked={activeTab === "select"}
                                    onChange={() =>
                                        !isCreditorLocked &&
                                        setActiveTab("select")
                                    }
                                    disabled={isCreditorLocked}
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
                                        errors.full_name
                                            ? "form-field_error"
                                            : ""
                                    }`}
                                    placeholder="ФИО*"
                                    value={newContact.full_name}
                                    onChange={(evt) =>
                                        setNewContact((prev) => ({
                                            ...prev,
                                            full_name: evt.target.value,
                                        }))
                                    }
                                    disabled={isCreditorLocked}
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
                                        errors.position
                                            ? "form-field_error"
                                            : ""
                                    }`}
                                    type="text"
                                    placeholder="Должность"
                                    value={newContact.position}
                                    onChange={(e) =>
                                        handleNewExecutor(e, "position")
                                    }
                                    disabled={isCreditorLocked}
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
                                    onChange={(e) =>
                                        handleNewExecutor(e, "email")
                                    }
                                    disabled={isCreditorLocked}
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
                                    disabled={isCreditorLocked}
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
                            title="Добавить исполнителя"
                        >
                            Добавить
                        </button>
                    </div>
                </div>
            </form>
        </Popup>
    );
};

export default EmptyExecutorBlock;
