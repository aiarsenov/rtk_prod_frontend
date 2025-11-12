import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import Popup from "../Popup/Popup";
import ReferenceItem from "./ReferenceItem";
import ReferenceItemExtended from "./ReferenceItemExtended";
import ReferenceNewElemForm from "./ReferenceNewElemForm";
import ReferenceEditElemForm from "./ReferenceEditElemForm";
import ReferenceDeleteElemForm from "./ReferenceDeleteElemForm";
import Loader from "../Loader";
import CreatableSelect from "react-select/creatable";

import { ToastContainer, toast } from "react-toastify";

import COLUMNS from "../../data/reference_book_columns.json";
import REFERENCE_LABELS from "../../data/reference_labels.json";
import TITLES from "../../data/reference_book_titles.json";
import EDITABLE_KEYS from "../../data/editable_keys.json";

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

    let query;

    // Сбрасываем состояние попапа и полей
    const resetElemPopupState = () => {
        setIsNewElem(false);
        setIsEditElem(false);
        setIsDeleteElem(false);
        setPopupFields([]);
        setTempData({});
        setElemToDelete({});
    };

    // Валидация обязательных полей
    const validateReferenceData = (updatedData) => {
        if (bookId === "suppliers-with-reports") {
            if (!updatedData.contragent_id) {
                toast.error("Необходимо выбрать подрядчика", {
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
                return false;
            }

            if (!updatedData.full_name) {
                toast.error("ФИО должно быть заполнено", {
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
                return false;
            }

            return true;
        }

        if (
            (bookId === "report-types" || bookId === "banks") &&
            !updatedData.full_name
        ) {
            toast.error("Полное наименование должно быть заполнено", {
                isLoading: false,
                autoClose: 2500,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                containerId: "singleBook",
            });
            return false;
        }

        if (!updatedData.name) {
            toast.error("Наименование должно быть заполнено", {
                isLoading: false,
                autoClose: 2500,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                containerId: "singleBook",
            });
            return false;
        }

        return true;
    };

    // Изименение генерации отчетов
    const toggleRoleResponse = (action) => {
        if (mode === "read") {
            return;
        }

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
        if (mode === "read") {
            return;
        }

        let updatedData = popupFields.reduce((acc, field) => {
            acc[field.key] = field.value;
            return acc;
        }, {});

        if (!validateReferenceData(updatedData)) {
            return;
        }

        const newUrl =
            bookId === "suppliers-with-reports"
                ? `${URL}/${updatedData.contragent_id}`
                : URL;

        query = toast.loading("Обновление", {
            containerId: "singleBook",
            draggable: true,
            position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        });

        postData("POST", newUrl, updatedData)
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

                    resetElemPopupState();
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

    // Изменение рабочих часов
    const editWokrHours = (data) => {
        if (mode === "read") {
            return;
        }

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
                    resetElemPopupState();
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
        if (mode === "read") {
            return;
        }

        let data = updatedData;

        if (bookId === "management-report-types") {
            if (data.position_id) {
                data.position_id = +data?.position_id;
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
                        : "Наименование должно быть заполнено."
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
                    resetElemPopupState();

                    if (reloadList) {
                        getBooks();
                    }

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
        if (mode === "read") {
            return;
        }

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
                    resetElemPopupState();
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
        if (mode === "read") {
            return;
        }

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
                resetElemPopupState();
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
        if (mode === "read") {
            return;
        }

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
                resetElemPopupState();

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
        if (mode === "read") {
            return;
        }

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
                    resetElemPopupState();

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
        if (mode === "read") {
            return;
        }

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

                    resetElemPopupState();

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

    // Открытие попапа добавления зависи
    const handleOpenNewPopup = () => {
        const editableFields = (REFERENCE_LABELS[bookId] || [])
            .filter((field) => EDITABLE_KEYS.includes(field.key))
            .map((field) => ({
                key: field.key,
                label: field.label || field.key,
            }));

        setPopupFields(editableFields);
        setIsNewElem(true);
    };

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
        setPopupFields((prev) => {
            const exists = prev.some((field) =>
                id ? field.id === id && field.key === key : field.key === key
            );

            if (exists) {
                return prev.map((field) =>
                    id
                        ? field.id === id && field.key === key
                            ? { ...field, value: newValue }
                            : field
                        : field.key === key
                        ? { ...field, value: newValue }
                        : field
                );
            } else {
                const newField = id
                    ? { id, key, value: newValue }
                    : { key, value: newValue };

                return [...prev, newField];
            }
        });
    };

    // Обработка существующих полей справочника
    const handleSwitchChange = (evt, name, data) => {
        if (mode === "read") {
            return;
        }

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
                    <div className="flex items-center gap-[20px]">
                        <h1 className="title">
                            {TITLES[bookId]} <span>{listLength}</span>
                        </h1>

                        {bookId === "working-hours" && (
                            <CreatableSelect
                                className="form-select-extend max-w-[180px]"
                                styles={{
                                    container: (base) => ({
                                        ...base,
                                        minWidth: "100px",
                                    }),
                                }}
                                placeholder="Год"
                                isValidNewOption={() => false}
                                noOptionsMessage={() => "Нет доступных годов"}
                                options={
                                    availableYears.length > 0
                                        ? availableYears.map((item) => ({
                                              value: item,
                                              label: item.toString(),
                                          }))
                                        : []
                                }
                                value={
                                    availableYears
                                        .map((item) => ({
                                            value: item,
                                            label: item.toString(),
                                        }))
                                        .find(
                                            (opt) => opt.value === currentYear
                                        ) || null
                                }
                                onChange={(selectedOption) => {
                                    setCurrentYear(selectedOption?.value || "");
                                }}
                            />
                        )}
                    </div>

                    <div className="flex justify-end items-center gap-[20px] flex-grow">
                        {mode === "edit" &&
                            bookId != "creditor" &&
                            bookId != "contragent" &&
                            bookId != "working-hours" &&
                            bookId != "report-types" && (
                                <button
                                    type="button"
                                    className="button-active"
                                    onClick={handleOpenNewPopup}
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

            {isNewElem && mode === "edit" && (
                <ReferenceNewElemForm
                    bookId={bookId}
                    popupFields={popupFields}
                    positions={positions}
                    resetElemPopupState={resetElemPopupState}
                    handlePopupFieldsChange={handlePopupFieldsChange}
                    addNewElement={addNewElement}
                    booksItems={booksItems}
                />
            )}

            {isEditElem && mode === "edit" && (
                <ReferenceEditElemForm
                    bookId={bookId}
                    popupFields={popupFields}
                    positions={positions}
                    resetElemPopupState={resetElemPopupState}
                    handlePopupFieldsChange={handlePopupFieldsChange}
                    collectEditFieldsData={collectEditFieldsData}
                    editContragentAndCreditorContact={
                        editContragentAndCreditorContact
                    }
                    editContactElem={editContactElem}
                    editWokrHours={editWokrHours}
                    editElement={editElement}
                />
            )}

            {isDeleteElem && mode === "edit" && (
                <ReferenceDeleteElemForm
                    bookId={bookId}
                    elemToDelete={elemToDelete}
                    resetElemPopupState={resetElemPopupState}
                    deleteContact={deleteContact}
                    deleteContactElem={deleteContactElem}
                    deleteElement={deleteElement}
                    ƒ
                />
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
                                                toggleRoleResponse({
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
                                                toggleRoleResponse({
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
                                                toggleRoleResponse({
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
                                                toggleRoleResponse({
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
                                                toggleRoleResponse({
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
