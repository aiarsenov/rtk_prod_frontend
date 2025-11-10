import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import Popup from "../Popup/Popup";
import ReferenceItem from "./ReferenceItem";
import ReferenceItemExtended from "./ReferenceItemExtended";
import ReferenceItemNew from "./ReferenceItemNew";
import Loader from "../Loader";

import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";

import COLUMNS from "../../data/reference_book_columns.json";
import REFERENCE_LABELS from "../../data/reference_labels.json";
import TITLES from "../../data/reference_book_titles.json";
import EDITABLE_KEYS from "../../data/editable_keys.json";

const PhoneMask = "+{7} (000) 000 00 00";

const SingleBook = () => {
    const { bookId } = useParams();

    const columns = bookId ? COLUMNS[bookId] : COLUMNS;
    const labels = bookId ? REFERENCE_LABELS[bookId] : REFERENCE_LABELS;

    const URL =
        bookId === "creditor" || bookId === "contragent"
            ? `${import.meta.env.VITE_API_URL}responsible-persons/${bookId}`
            : `${import.meta.env.VITE_API_URL}${bookId ? bookId : "books"}`;

    const [mode, setMode] = useState("edit");

    const [booksItems, setBooksItems] = useState([]);
    const [refBooksItems, setRefBooksItems] = useState([]);
    const [formFields, setFormFields] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [listLength, setListLength] = useState(0);

    const [rolesAction, setRolesAction] = useState({ action: "", roleId: "" }); // Состояние генерации отчетов в справочнике Роли в проектах
    const [isNewElem, setIsNewElem] = useState(false); // Попап добавления записи
    const [isEditElem, setIsEditElem] = useState(false); // Попап изменения записи
    const [isDeleteElem, setIsDeleteElem] = useState(false); // Попап удаления записи

    const [tempData, setTempData] = useState({}); // Временные данные, которые нужно прокинуть в обход popupFields
    const [popupFields, setPopupFields] = useState([]); // Доступные для изменения поля в записи
    const [elemToDelete, setElemToDelete] = useState({}); // ID записи для удаления

    const [positions, setPositions] = useState([]); // Должности
    const [availableYears, setAvailableYears] = useState([]); // Доступные года
    const [currentYear, setCurrentYear] = useState(""); // Текущий год

    const [newElem, setnewElem] = useState({
        contragent_id: "",
        full_name: "",
        position: "",
        email: "",
        phone: "",
    });

    let query;

    // Обработка существующих полей справочника
    const handleSwitchChange = (evt, name, data) => {
        if (name == "is_project_leader") {
            setBooksItems((prevBooksItems) =>
                prevBooksItems.map((item) => {
                    if (item.is_project_leader === true) {
                        return { ...item, is_project_leader: false };
                    }
                    return item;
                })
            );
            setBooksItems((prevBooksItems) =>
                prevBooksItems.map((item) =>
                    item.id === data.id
                        ? { ...item, [name]: evt === true }
                        : item
                )
            );
        } else {
            setBooksItems((prevBooksItems) =>
                prevBooksItems.map((item) =>
                    item.id === data.id
                        ? { ...item, [name]: evt === true }
                        : item
                )
            );
        }

        let updatedData = data;
        updatedData[name] = evt;

        editElement(updatedData, false);
    };

    // Обработка полей попапа нового контакта подрядчика
    const handleNewContactElemInputChange = (e, name) => {
        const value = name === "phone" ? e : e.target.value;

        setnewElem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Обработка полей новой записи в справочнике
    const handleNewElementInputChange = (e, name) => {
        let value;

        if (
            name === "is_regular" ||
            name === "show_cost" ||
            name === "is_project_report_responsible"
        ) {
            value = e.target.value === "true";
        } else {
            value = e.target.value;
        }

        setFormFields({ ...formFields, [name]: value });
    };

    // Изименение генерации отчетов
    const toggleRoleResponce = (action) => {
        query = toast.loading("Обновление", {
            containerId: "singleBook",
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        action.is_project_report_responsible = rolesAction.action === "true";

        postData(
            "POST",
            `${import.meta.env.VITE_API_URL}roles/${
                rolesAction.roleId
            }/project-reports/toggle`,
            action
        )
            .then((response) => {
                if (response?.ok) {
                    setRolesAction({ action: "", roleId: "" });
                    getBooks();

                    toast.update(query, {
                        render: response.message || "Успех",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error(response.message || "Ошибка операции", {
                        isLoading: false,
                        autoClose: 2500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка операции", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Добавление записи
    const addNewElement = () => {
        if (
            !formFields.name ||
            ((bookId === "report-types" || bookId === "banks") &&
                !formFields.full_name)
        ) {
            alert(
                bookId === "report-types" || bookId === "banks"
                    ? "'Полное наименование' должно быть заполнено."
                    : "'Наименование' должно быть заполнено."
            );
            return;
        }

        if (bookId === "departments") {
            if (formFields.include_in_payroll !== "") {
                formFields.include_in_payroll = JSON.parse(
                    formFields?.include_in_payroll
                );
            }
        }

        query = toast.loading("Обновление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("POST", URL, formFields)
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Запись добавлена",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });

                    setFormFields((prev) => ({
                        ...prev,
                        name: "",
                        counterparty_name: "",
                        full_name: "",
                    }));
                    getBooks();
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка добавления записи", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Добавление нового контакта подрядчику
    const addNewContact = (data) => {
        postData("POST", `${URL}/${data.contragent_id}`, data).then(
            (response) => {
                if (response?.ok) {
                    setBooksItems((booksItems) =>
                        booksItems.map((item) =>
                            item.id === data.contragent_id
                                ? {
                                      ...item,
                                      contacts: [
                                          ...(item.contacts || []),
                                          response,
                                      ],
                                  }
                                : item
                        )
                    );
                    setRefBooksItems((booksItems) =>
                        booksItems.map((item) =>
                            item.id === data.contragent_id
                                ? {
                                      ...item,
                                      contacts: [
                                          ...(item.contacts || []),
                                          response,
                                      ],
                                  }
                                : item
                        )
                    );

                    setIsNewElem(false);
                    setnewElem({
                        contragent_id: "",
                        full_name: "",
                        position: "",
                        email: "",
                        phone: "",
                    });

                    toast("Контакт добавлен", {
                        type: "success",
                        containerId: "singleBook",
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                }
            }
        );
    };

    // Изменение рабочих часов
    const editWokrHours = (data) => {
        let updatedData = tempData;
        updatedData.hours = +data.hours;

        query = toast.loading("Сохранение", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("PATCH", URL, { year: currentYear, hours: [updatedData] })
            .then((response) => {
                if (response?.ok) {
                    setIsEditElem(false);
                    setPopupFields([]);
                    setTempData({});
                    getBooks();

                    toast.update(query, {
                        render: response.message || "Успешно сохранено",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка сохранения", {
                        isLoading: false,
                        autoClose: 2500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка сохранения", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Изменение записи
    const editElement = (updatedData, reloadList = true) => {
        let data = updatedData;
        // delete data?.projects_count;
        // delete data?.updated_at;

        if (bookId === "management-report-types") {
            if (data.position_id) {
                data.position_id = +data?.position_id;
            }

            // delete data?.count;
            // delete data?.position;
        }

        if (bookId === "departments") {
            if (data.include_in_payroll !== "") {
                data.include_in_payroll = JSON.parse(data?.include_in_payroll);
            }
        }

        if (bookId !== "working-hours") {
            if (
                !data.name ||
                ((bookId === "report-types" || bookId === "banks") &&
                    !data.full_name)
            ) {
                alert(
                    bookId === "report-types" || bookId === "banks"
                        ? "Полное и сокращенное наименования должны быть заполнены."
                        : "'Наименование' должно быть заполнено."
                );
                return;
            }
        }

        query = toast.loading("Обновление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("PATCH", `${URL}/${data.id}`, data)
            .then((response) => {
                if (response?.ok) {
                    toast.update(query, {
                        render: "Запись обновлена",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                    setIsEditElem(false);
                    setPopupFields([]);
                    setTempData({});

                    if (reloadList) {
                        getBooks();
                    }
                } else {
                    if (!reloadList) {
                        getBooks();
                    }

                    toast.dismiss(query);
                    toast.error("Ошибка обновления записи", {
                        isLoading: false,
                        autoClose: 2500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                if (!reloadList) {
                    getBooks();
                }

                toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления записи", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Изменение контактов
    const editContragentAndCreditorContact = (data) => {
        query = toast.loading("Обновление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}responsible-persons/${bookId}/${
                data.id
            }`,
            data
        )
            .then((response) => {
                if (response?.ok) {
                    setIsEditElem(false);
                    setPopupFields([]);
                    setTempData({});
                    getBooks();

                    toast.update(query, {
                        render: "Контакт обновлен",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка обновления контакта", {
                        isLoading: false,
                        autoClose: 2500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления контакта", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Изменение контакта подрядчика
    const editContactElem = (data) => {
        query = toast.loading("Обновление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData(
            "PATCH",
            `${URL}/${tempData.contactId}/contacts/${data.id}`,
            data
        ).then((response) => {
            if (response?.ok) {
                setIsEditElem(false);
                setPopupFields([]);
                setTempData({});
                getBooks();

                toast.update(query, {
                    render: "Запись обновлена",
                    type: "success",
                    containerId: "singleBook",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
            } else {
                toast.dismiss(query);
                toast.error("Ошибка обновления записи", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            }
        });
    };

    // Удаление контакта подрядчика
    const deleteContactElem = (data) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData(
            "DELETE",
            `${URL}/${data.id}/contacts/${data.contact}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                toast.update(query, {
                    render: "Контакт удален",
                    type: "success",
                    containerId: "singleBook",
                    isLoading: false,
                    autoClose: 1200,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });

                setBooksItems((booksItems) =>
                    booksItems.map((item) => {
                        if (item.id === data.id) {
                            return {
                                ...item,
                                contacts: item.contacts?.filter(
                                    (contact) => contact.id !== data.contact
                                ),
                            };
                        }
                        return item;
                    })
                );
                setIsDeleteElem(false);
                setElemToDelete({});
            } else {
                toast.dismiss(query);
                toast.error("Ошибка удалении контакта", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            }
        });
    };

    // Удаление контакта
    const deleteContact = (data) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        let url;

        if (bookId == "creditor" || bookId == "contragent") {
            url = `${
                import.meta.env.VITE_API_URL
            }responsible-persons/${bookId}/contact/${data.id}`;
        } else {
            url = `${
                import.meta.env.VITE_API_URL
            }${bookId}-responsible-persons/${data.id}`;
        }

        postData("DELETE", url, {})
            .then((response) => {
                if (response?.ok) {
                    getBooks();
                    setIsDeleteElem(false);
                    setElemToDelete({});

                    toast.update(query, {
                        render: "Контакт удалена",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка удаления контакта", {
                        isLoading: false,
                        autoClose: 2500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка удаления контакта", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Удаление записи
    const deleteElement = (data) => {
        query = toast.loading("Удаление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("DELETE", `${URL}/${data.id}`, {})
            .then((response) => {
                if (response?.ok) {
                    setBooksItems((booksItems) =>
                        booksItems.filter((item) => item.id !== data.id)
                    );
                    setRefBooksItems((booksItems) =>
                        booksItems.filter((item) => item.id !== data.id)
                    );
                    toast.update(query, {
                        render: "Запись удалена",
                        type: "success",
                        containerId: "singleBook",
                        isLoading: false,
                        autoClose: 1200,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                    setIsDeleteElem(false);
                    setElemToDelete({});
                } else {
                    toast.dismiss(query);
                    toast.error("Ошибка удаления записи", {
                        isLoading: false,
                        autoClose: 2500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "singleBook",
                    });
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка удаления записи", {
                    isLoading: false,
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "singleBook",
                });
            });
    };

    // Открытие попапа удаления зависи
    const handleOpenDeletePopup = (data) => {
        setElemToDelete(data);
        setIsDeleteElem(true);
    };

    // Открытие попапа изменения зависи
    const handleOpenEditPopup = (data) => {
        setTempData(data);

        const editableFields = Object.entries(data)
            .filter(([key]) => EDITABLE_KEYS.includes(key))
            .map(([key, value]) => {
                const column = labels.find((col) => col.key === key);
                return {
                    id: data.id,
                    key,
                    label: column?.label || key,
                    value,
                };
            });

        setPopupFields(editableFields);
        setIsEditElem(true);
    };

    // Обработка полей при изменении записи
    const handlePopupFieldsChange = (id, key, newValue) => {
        setPopupFields((prev) =>
            prev.map((field) =>
                field.id === id && field.key === key
                    ? { ...field, value: newValue }
                    : field
            )
        );
    };

    // Cобираем все поля в единый объект
    const collectEditFieldsData = () => {
        const result = {};

        popupFields.forEach(({ id, key, value }) => {
            result[key] = value;
            result.id = id;
        });

        return result;
    };

    // Получение должностей
    const getPositions = () => {
        getData(`${import.meta.env.VITE_API_URL}positions`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                if (response.data.data?.length > 0) {
                    setPositions(
                        response.data.data.filter(
                            (item) => item.type === "one_to_one"
                        )
                    );
                }
            }
        });
    };

    // Получение должностей
    const getAvailableYears = () => {
        getData(`${import.meta.env.VITE_API_URL}${bookId}/available-years`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setAvailableYears(response.data.years);
                setCurrentYear(
                    response.data.years[response.data.years.length - 1] || ""
                );
            }
        });
    };

    // Получение списка записей
    const getBooks = () => {
        setIsLoading(true);

        const url =
            bookId == "working-hours" ? `${URL}?year=${currentYear}` : URL;

        getData(url, {
            Accept: "application/json",
        })
            .then((response) => {
                if (response.status == 200) {
                    setBooksItems(response.data.data);
                    setRefBooksItems(response.data.data);

                    setListLength(
                        bookId !== "creditor" && bookId !== "contragent"
                            ? response.data.data?.length
                            : response.data.data.reduce((sum, creditor) => {
                                  const projectsContacts =
                                      creditor.projects.reduce(
                                          (projectSum, project) => {
                                              return (
                                                  projectSum +
                                                  project.contacts?.length
                                              );
                                          },
                                          0
                                      );
                                  return sum + projectsContacts;
                              }, 0)
                    );
                }
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (bookId !== "working-hours") {
            getBooks();
        }

        if (bookId === "management-report-types") {
            getPositions();
        }

        if (bookId === "working-hours") {
            getAvailableYears();
        }
    }, []);

    useEffect(() => {
        if (bookId === "working-hours" && currentYear != "") {
            getBooks();
        }
    }, [currentYear]);

    useEffect(() => {
        if (mode == "read") {
            setBooksItems(refBooksItems);
        }
    }, [mode]);

    useEffect(() => {
        console.log(tempData);
        console.log(popupFields);
    }, [popupFields, tempData]);

    return (
        <main className="page reference-books">
            <ToastContainer containerId="singleBook" />

            <div className="container registry__container reference-books__container">
                <section className="registry__header flex justify-between items-center">
                    <h1 className="title">
                        {TITLES[bookId]} <span>{listLength}</span>
                    </h1>

                    <div className="flex justify-end items-center gap-[20px] flex-grow">
                        {bookId === "working-hours" && (
                            <select
                                className="form-select max-w-[150px]"
                                style={{ minWidth: "100px" }}
                                value={currentYear}
                                onChange={(evt) =>
                                    setCurrentYear(evt.target.value)
                                }
                            >
                                {availableYears.length > 0 &&
                                    availableYears.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                            </select>
                        )}

                        {mode === "edit" && (
                            <button
                                type="button"
                                className="button-active"
                                // onClick={}
                            >
                                <span>Создать</span>
                                <div className="button-active__icon">
                                    <svg
                                        width="12"
                                        height="13"
                                        viewBox="0 0 12 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.75 5.75h3.75v1.5H6.75V11h-1.5V7.25H1.5v-1.5h3.75V2h1.5v3.75z"
                                            fill="#fff"
                                        />
                                    </svg>
                                </div>
                            </button>
                        )}
                    </div>
                </section>

                {isLoading ? (
                    <Loader />
                ) : (
                    <section className="reference-books__table-wrapper registry__table-section w-full">
                        <table
                            className={`registry-table reference-books__table table-auto w-full ${
                                bookId === "creditor" ||
                                bookId === "contragent" ||
                                bookId === "suppliers-with-reports"
                                    ? "border-separate [border-spacing:0_20px]"
                                    : "border-collapse"
                            }`}
                        >
                            <thead className="registry-table__thead">
                                <tr>
                                    {COLUMNS[bookId].map(
                                        ({ label, key, index }) => (
                                            <th
                                                className="min-w-[125px]"
                                                rowSpan="2"
                                                key={key || index}
                                            >
                                                {label}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            <tbody className="registry-table__tbody">
                                {mode === "edit" &&
                                    bookId != "creditor" &&
                                    bookId != "contragent" &&
                                    bookId != "suppliers-with-reports" &&
                                    bookId != "working-hours" &&
                                    bookId !== "report-types" && (
                                        <ReferenceItemNew
                                            handleNewElementInputChange={
                                                handleNewElementInputChange
                                            }
                                            columns={columns}
                                            formFields={formFields}
                                            booksItems={booksItems}
                                            bookId={bookId}
                                            positions={positions}
                                            addNewElement={addNewElement}
                                        />
                                    )}

                                {booksItems?.length > 0 &&
                                    booksItems.map((item) => {
                                        if (
                                            bookId === "creditor" ||
                                            bookId === "contragent" ||
                                            bookId === "suppliers-with-reports"
                                        ) {
                                            return (
                                                <ReferenceItemExtended
                                                    key={item.id}
                                                    data={item}
                                                    mode={mode}
                                                    bookId={bookId}
                                                    handleOpenDeletePopup={
                                                        handleOpenDeletePopup
                                                    }
                                                    handleOpenEditPopup={
                                                        handleOpenEditPopup
                                                    }
                                                />
                                            );
                                        }

                                        return (
                                            <ReferenceItem
                                                key={item.id}
                                                data={item}
                                                columns={columns}
                                                mode={mode}
                                                bookId={bookId}
                                                setRolesAction={setRolesAction}
                                                positions={positions}
                                                handleOpenEditPopup={
                                                    handleOpenEditPopup
                                                }
                                                handleOpenDeletePopup={
                                                    handleOpenDeletePopup
                                                }
                                                handleSwitchChange={
                                                    handleSwitchChange
                                                }
                                            />
                                        );
                                    })}
                            </tbody>
                        </table>
                    </section>
                )}
            </div>

            {isNewElem &&
                mode === "edit" &&
                bookId === "suppliers-with-reports" && (
                    <Popup
                        onClick={() => {
                            setIsNewElem(false);
                            setnewElem({
                                contragent_id: "",
                                full_name: "",
                                position: "",
                                email: "",
                                phone: "",
                            });
                        }}
                        title={
                            bookId === "creditor" ||
                            bookId === "contragent" ||
                            bookId === "suppliers-with-reports"
                                ? "Создать контакт"
                                : "Создать запись"
                        }
                    >
                        <div className="action-form__body grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-1"
                                value={newElem.full_name}
                                placeholder="ФИО"
                                onChange={(e) =>
                                    handleNewContactElemInputChange(
                                        e,
                                        "full_name"
                                    )
                                }
                            />

                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-1"
                                value={newElem.position}
                                placeholder="Должность"
                                onChange={(e) =>
                                    handleNewContactElemInputChange(
                                        e,
                                        "position"
                                    )
                                }
                            />

                            <IMaskInput
                                mask={PhoneMask}
                                className="w-full text-base border border-gray-300 p-1"
                                name="phone"
                                type="tel"
                                inputMode="tel"
                                onAccept={(value) =>
                                    handleNewContactElemInputChange(
                                        value || "",
                                        "phone"
                                    )
                                }
                                value={newElem.phone}
                                placeholder="+7 999 999 99 99"
                            />

                            <input
                                type="text"
                                className="w-full text-base border border-gray-300 p-1"
                                value={newElem.email}
                                placeholder="Email"
                                onChange={(e) =>
                                    handleNewContactElemInputChange(e, "email")
                                }
                            />
                        </div>

                        <div className="action-form__footer">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsNewElem(false);
                                    setnewElem({
                                        contragent_id: "",
                                        full_name: "",
                                        position: "",
                                        email: "",
                                        phone: "",
                                    });
                                }}
                                className="cancel-button flex-[0_0_fit-content]"
                            >
                                Отменить
                            </button>

                            <button
                                type="button"
                                className="action-button flex-[0_0_fit-content]"
                                onClick={() => addNewContact(newElem)}
                            >
                                Добавить
                            </button>
                        </div>
                    </Popup>
                )}

            {isEditElem && (
                <Popup
                    onClick={() => {
                        setIsEditElem(false);
                        setPopupFields([]);
                        setTempData({});
                    }}
                    title={
                        bookId === "creditor" ||
                        bookId === "contragent" ||
                        bookId === "suppliers-with-reports"
                            ? "Редактирование контакта"
                            : "Редактирование записи"
                    }
                >
                    <form>
                        <div className="action-form__body flex flex-col gap-[18px]">
                            {popupFields.length > 0 &&
                                popupFields.map(({ id, key, label, value }) => {
                                    if (key === "phone") {
                                        return (
                                            <div
                                                key={key}
                                                className="flex flex-col"
                                            >
                                                <label
                                                    htmlFor={key}
                                                    className="form-label"
                                                >
                                                    {label}
                                                </label>
                                                <IMaskInput
                                                    mask={PhoneMask}
                                                    className="form-field w-full"
                                                    name="phone"
                                                    type="tel"
                                                    inputMode="tel"
                                                    onAccept={(value) => {
                                                        handlePopupFieldsChange(
                                                            id,
                                                            key,
                                                            value
                                                        );
                                                    }}
                                                    value={
                                                        value?.toString() || ""
                                                    }
                                                    placeholder="Телефон"
                                                />
                                            </div>
                                        );
                                    } else if (key === "hours") {
                                        return (
                                            <div
                                                key={key}
                                                className="flex flex-col"
                                            >
                                                <label
                                                    htmlFor={key}
                                                    className="form-label"
                                                >
                                                    {label}
                                                </label>
                                                <input
                                                    id={key}
                                                    type="number"
                                                    className="form-field"
                                                    value={
                                                        value?.toString() || ""
                                                    }
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.value;
                                                        handlePopupFieldsChange(
                                                            id,
                                                            key,
                                                            newValue
                                                        );
                                                    }}
                                                />
                                            </div>
                                        );
                                    } else if (
                                        key === "type" ||
                                        key === "position_id"
                                    ) {
                                        return (
                                            <div
                                                key={key}
                                                className="flex flex-col"
                                            >
                                                <label
                                                    htmlFor={key}
                                                    className="form-label"
                                                >
                                                    {label}
                                                </label>
                                                <select
                                                    id={key}
                                                    className="form-select"
                                                    value={value || ""}
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.value;
                                                        handlePopupFieldsChange(
                                                            id,
                                                            key,
                                                            newValue
                                                        );
                                                    }}
                                                >
                                                    {bookId ===
                                                    "management-report-types" ? (
                                                        <>
                                                            {positions.map(
                                                                (position) => (
                                                                    <option
                                                                        value={
                                                                            position.id
                                                                        }
                                                                        key={
                                                                            position.id
                                                                        }
                                                                    >
                                                                        {
                                                                            position.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <option value="one_to_one">
                                                                Один к одному
                                                            </option>
                                                            <option value="one_to_many">
                                                                Один ко многим
                                                            </option>
                                                        </>
                                                    )}{" "}
                                                </select>
                                            </div>
                                        );
                                    } else if (
                                        key === "full_name" &&
                                        bookId === "report-types"
                                    ) {
                                        return;
                                    } else {
                                        return (
                                            <div
                                                key={key}
                                                className="flex flex-col"
                                            >
                                                <label
                                                    htmlFor={key}
                                                    className="form-label"
                                                >
                                                    {label}
                                                </label>
                                                <input
                                                    id={key}
                                                    type="text"
                                                    className="form-field"
                                                    value={
                                                        value?.toString() || ""
                                                    }
                                                    onChange={(e) => {
                                                        const newValue =
                                                            e.target.value;
                                                        handlePopupFieldsChange(
                                                            id,
                                                            key,
                                                            newValue
                                                        );
                                                    }}
                                                />
                                            </div>
                                        );
                                    }
                                })}
                        </div>

                        <div className="action-form__footer">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditElem(false);
                                    setPopupFields([]);
                                    setTempData({});
                                }}
                                className="cancel-button flex-[0_0_fit-content]"
                                title="Отменить изменения"
                            >
                                Отменить
                            </button>

                            <button
                                type="button"
                                className="action-button flex-[0_0_fit-content]"
                                onClick={() => {
                                    // if (bookId == "positions") {
                                    //     hasNameMatch(data.name, data.id);
                                    // } else {
                                    // }
                                    const updatedData = collectEditFieldsData();

                                    if (
                                        bookId === "creditor" ||
                                        bookId === "contragent"
                                    ) {
                                        editContragentAndCreditorContact(
                                            updatedData
                                        );
                                    } else if (
                                        bookId === "suppliers-with-reports"
                                    ) {
                                        editContactElem(updatedData);
                                    } else if (bookId === "working-hours") {
                                        editWokrHours(updatedData);
                                    } else {
                                        editElement(updatedData);
                                    }
                                }}
                                title="Сохранить изменения"
                            >
                                Сохранить
                            </button>
                        </div>
                    </form>
                </Popup>
            )}

            {isDeleteElem && (
                <Popup
                    onClick={() => {
                        setIsDeleteElem(false);
                        setElemToDelete(null);
                    }}
                    title={
                        bookId === "creditor" ||
                        bookId === "contragent" ||
                        bookId === "suppliers-with-reports"
                            ? "Удаление контакта"
                            : "Удаление записи"
                    }
                >
                    <form>
                        <div className="action-form__body">
                            <p>Данные будут безвозвратно утеряны.</p>
                        </div>

                        <div className="action-form__footer">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteElem(false);
                                    setElemToDelete(null);
                                }}
                                className="cancel-button flex-[0_0_fit-content]"
                                title="Отменить удаление"
                            >
                                Отменить
                            </button>

                            <button
                                type="button"
                                className="action-button flex-[0_0_fit-content]"
                                onClick={() => {
                                    if (
                                        bookId === "creditor" ||
                                        bookId === "contragent"
                                    ) {
                                        deleteContact(elemToDelete);
                                    } else if (
                                        bookId === "suppliers-with-reports"
                                    ) {
                                        deleteContactElem(elemToDelete);
                                    } else {
                                        deleteElement(elemToDelete);
                                    }
                                }}
                                title="Удалить запись"
                            >
                                Удалить
                            </button>
                        </div>
                    </form>
                </Popup>
            )}

            {rolesAction.action != "" &&
                mode === "edit" &&
                bookId === "roles" && (
                    <Popup
                        onClick={() => {
                            setRolesAction({ action: "", roleId: "" });
                        }}
                        title={`${
                            rolesAction.action === "true"
                                ? "Включение генерации отчетов"
                                : "Отключение генерации отчетов"
                        }`}
                    >
                        <div className="action-form__body">
                            <p>
                                {rolesAction.action === "true"
                                    ? "Отчеты сотрудников с данной ролью начнут генерироваться, начиная с текущего месяца. Следует ли сгенерировать отчеты сотрудников для прошлого периода?"
                                    : "Отчеты сотрудников с данной ролью перестанут генерироваться начиная с текущего месяца. Что следует сделать с ранее созданными отчетами?"}
                            </p>

                            <div className="flex flex-col gap-[15px] mt-[15px]">
                                {rolesAction.action === "true" ? (
                                    <div className="grid item-center grid-cols-2 gap-[15px]">
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            title="Не генерировать отчеты сотрудников для прошлого периода"
                                            onClick={() =>
                                                toggleRoleResponce({
                                                    action: "enable",
                                                    backfill: false,
                                                })
                                            }
                                        >
                                            Нет
                                        </button>

                                        <button
                                            type="button"
                                            className="action-button"
                                            title="Сгенерировать отчеты сотрудников для прошлого периода"
                                            onClick={() =>
                                                toggleRoleResponce({
                                                    action: "enable",
                                                    backfill: true,
                                                })
                                            }
                                        >
                                            Да
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            title="Безвозвратно удалить"
                                            onClick={() =>
                                                toggleRoleResponce({
                                                    action: "disable",
                                                    policy: "delete",
                                                })
                                            }
                                        >
                                            Безвозвратно удалить
                                        </button>

                                        <button
                                            type="button"
                                            className="cancel-button"
                                            title="Скрыть из списка"
                                            onClick={() =>
                                                toggleRoleResponce({
                                                    action: "disable",
                                                    policy: "hide",
                                                })
                                            }
                                        >
                                            Скрыть из списка
                                        </button>

                                        <button
                                            type="button"
                                            className="action-button"
                                            title="Оставить в списке"
                                            onClick={() =>
                                                toggleRoleResponce({
                                                    action: "disable",
                                                    policy: "keep",
                                                })
                                            }
                                        >
                                            Оставить в списке
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Popup>
                )}
        </main>
    );
};

export default SingleBook;
