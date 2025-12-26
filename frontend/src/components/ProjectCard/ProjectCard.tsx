import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";
import parseFormattedMoney from "../../utils/parseFormattedMoney";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";
import { useWindowWidth } from "../../hooks/useWindowWidth.js";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import EmptyExecutorBlock from "../ExecutorBlock/EmptyExecutorBlock";
import ReportWindow from "../ReportWindow/ReportWindow.jsx";
import CardBottomActions from "../CardBottomActions.js";
import ProjectReportsList from "./ProjectReportsList.jsx";
import ProjectCardCreditors from "./ProjectCardCreditors";

import ProjectStatisticsBlock from "./ProjectStatisticsBlock";
import ProjectStatisticsBlockMobile from "./ProjectStatisticsBlockMobile";

import ProjectTeam from "./ProjectTeam";
import ReportServices from "./ReportServices";
import ProjectImplementationPeriod from "./ProjectImplementationPeriod";
import ProjectBudget from "./ProjectBudget";
import AutoResizeTextarea from "../AutoResizeTextarea";

import ManagementReportsTab from "../ManagementReportsTab/ManagementReportsTab";
import ManagementReportsTabMobile from "../ManagementReportsTab/ManagementReportsTabMobile";

import Hint from "../Hint/Hint";

import CreatableSelect from "react-select/creatable";
import CardMultiSelector from "../CardMultiSelector/CardMultiSelector";

import BottomSheet from "../BottomSheet/BottomSheet";
import BottomNavCard from "../BottomNav/BottomNavCard";
import Popup from "../Popup/Popup.jsx";
import Loader from "../Loader.jsx";

import "../../styles/card.scss";
import "./ProjectCard.scss";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";

const ProjectCard = () => {
    const userPermitions = useSelector(
        (state) => state.user?.data?.permissions
    );

    const mode = userPermitions?.projects || {
        delete: "read",
        edit: "read",
        view: "read",
    };

    const URL = `${import.meta.env.VITE_API_URL}projects`;

    const { projectId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [projectData, setProjectData] = useState({});
    const [projectDataCustom, setProjectDataCustom] = useState();

    const [activeReportTab, setActiveReportTab] = useState("projectReports"); // Активная вкладка отчетов
    const [activeWindow, setActiveWindow] = useState(""); // Активное окно на мобилке (Отчеты или ОСВ)
    const [availableToChange, setAvailableToChange] = useState(false); // Можем ли мы вносить изменения в проект (до закрепления заказчика)

    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [firstInit, setFirstInit] = useState(true);

    const [reportWindowsState, setReportWindowsState] = useState(false); // Редактор отчёта

    const [canChangeContragent, setCanChangeContragent] = useState(true); // Возможность изменить заказчика
    const contragentRef = useRef(null);
    const [contragentMenuOpen, setContragentMenuOpen] = useState(false);

    const [industries, setIndustries] = useState([]); // Отрасль
    const [otherIndustries, setOtherIndustries] = useState([]); // Дополнительная отрасль
    const [contragents, setContragents] = useState([]); // Заказчик
    const [banks, setBanks] = useState([]); // Банки
    const [contracts, setContracts] = useState([]); // Договора

    const [creditors, setCreditors] = useState([]); // Кредиторы
    const [filteredCreditors, setFilteredCreditors] = useState([]); // Кредиторы активной вкладки
    const [addedBank, setAddedBank] = useState(null); // Банк добавленного кредитора в последний раз

    const [customers, setCustomers] = useState([]); // Заказчики

    const [addCreditor, setAddCreditor] = useState(false); // Добавить кредитора
    const [addCustomer, setAddCustomer] = useState(false); // Добавить заказчика
    const [deleteExecutor, setDeleteExecutor] = useState({});

    const [reports, setReports] = useState([]); // Отчеты
    const [managementReports, setManagementReports] = useState([]); // Отчеты руководителя
    const [reportId, setReportId] = useState(null);

    const [teamData, setTeamData] = useState([]); // Команда проекта
    const [services, setServices] = useState([]); // Услуги

    const [revenue, setRevenue] = useState({}); // ОСВ
    const [period, setPeriod] = useState("current_year"); // Период ОСВ

    // Получение отраслей
    const fetchIndustries = () => {
        return getData(`${import.meta.env.VITE_API_URL}industries`, {
            Accept: "application/json",
        }).then((response) => {
            if (response?.status == 200) {
                setIndustries(response.data.data);
            }
        });
    };

    // Получение заказчика
    const fetchContragents = () => {
        return getData(`${import.meta.env.VITE_API_URL}contragents?all=true`, {
            Accept: "application/json",
        }).then((response) => {
            if (response?.status == 200) {
                if (response.data.length > 0) {
                    setContragents(
                        response.data.map((item) => ({
                            value: item.id,
                            label: item.program_name,
                        }))
                    );
                }
            }
        });
    };

    // Получение банков
    const fetchBanks = () => {
        return getData(`${import.meta.env.VITE_API_URL}banks`).then(
            (response) => {
                if (response?.status == 200) {
                    setBanks(response.data.data);
                }
            }
        );
    };

    // Получение договоров
    const fetchContracts = () => {
        if (projectData.contragent_id) {
            getData(
                `${import.meta.env.VITE_API_URL}contragents/${
                    projectData.contragent_id
                }/contracts`
            ).then((response) => {
                if (response?.status == 200) {
                    setContracts(response.data);
                }
            });
        } else {
            toast.error("Необходимо назначить заказчика", {
                className: "toast-multiline",
                isLoading: false,
                autoClose: 2000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
                containerId: "toastContainer",
            });
        }
    };

    // Получение отчётов
    const getReports = () => {
        return getData(
            `${import.meta.env.VITE_API_URL}projects/${projectId}/reports`
        ).then((response) => {
            if (response?.status == 200) {
                setReports(response.data);
            }
        });
    };

    // Получение отчетов ответственных
    const getManagementReports = () => {
        return getData(`${URL}/${projectId}/manager-reports`).then(
            (response) => {
                if (response.status == 200) {
                    setManagementReports(response.data);
                    setIsDataLoaded(true);
                }
            }
        );
    };

    // Получение команды проекта
    const getTeam = () => {
        return getData(
            `${import.meta.env.VITE_API_URL}projects/${projectId}/team`
        ).then((response) => {
            if (response.status == 200) {
                setTeamData(response.data.team);
            }
        });
    };

    // Получение услуг проекта
    const getServices = () => {
        return getData(
            `${import.meta.env.VITE_API_URL}reports/${projectId}/services`
        ).then((response) => {
            if (response?.status == 200) {
                setServices(response.data);
            }
        });
    };

    // Получение проекта
    const getCard = async () => {
        setIsDataLoaded(false);

        try {
            const response = await getData(`${URL}/${projectId}`, {
                Accept: "application/json",
            });

            setProjectData(response.data);
            setProjectDataCustom(response.data);
            setOtherIndustries(response.data.industries.others);

            // Получаем кредиторов
            setCreditors(
                response.data?.creditor_responsible_persons?.flatMap(
                    (item) => item
                ) || []
            );

            setFilteredCreditors(
                response.data?.creditor_responsible_persons?.flatMap(
                    (item) => item
                ) || []
            );

            // Получаем ответственные лица заказчика
            setCustomers(response.data?.contragent_responsible_persons || []);

            const tasks = [
                fetchIndustries(),
                fetchContragents(),
                fetchBanks(),
                getReports(),
                getManagementReports(),
                getTeam(),
                getServices(),
            ];

            if (!firstInit) {
                getRevenue("");
            }

            await Promise.all(tasks);

            setIsDataLoaded(true);
            setFirstInit(false);
        } catch (error) {
            if (error && error.status === 404) {
                navigate("/not-found", {
                    state: {
                        message: "Проект не найден",
                        errorCode: 404,
                        additionalInfo: "",
                    },
                });
            }
        }
    };

    // Обновление проекта
    const updateCard = async (showMessage = true, data = projectDataCustom) => {
        if (projectDataCustom?.contragent_id || data?.contragent_id) {
            // query = toast.loading("Обновление", {
            //     containerId: "toastContainer",
            //     draggable: true,
            //     position:
            //         window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            // });

            postData("PATCH", `${URL}/${projectId}`, data)
                .then((response) => {
                    if (response?.ok) {
                        setProjectData((prev) => ({
                            ...prev,
                            ...response,
                        }));
                        setProjectDataCustom((prev) => ({
                            ...prev,
                            ...response,
                        }));

                        // if (showMessage) {
                        //     toast.update(query, {
                        //         render: "Проект успешно обновлен",
                        //         type: "success",
                        //         containerId: "toastContainer",
                        //         isLoading: false,
                        //         autoClose: 1000,
                        //         pauseOnFocusLoss: false,
                        //         pauseOnHover: false,
                        //         draggable: true,
                        //         position:
                        //             window.innerWidth >= 1440
                        //                 ? "bottom-right"
                        //                 : "top-right",
                        //     });
                        // }
                        // toast.dismiss(query);
                    }
                })
                .catch((error) => {
                    // toast.dismiss(query);
                    toast.error(error.message || "Ошибка обновления проекта", {
                        containerId: "toastContainer",
                        isLoading: false,
                        autoClose: 3500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                });
        } else {
            toast.error("Необходимо назначить заказчика", {
                containerId: "toastContainer",
                isLoading: false,
                autoClose: 1500,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
        }
    };

    // Отправляем контакт кредитора или заказчика
    const sendExecutor = (type, data) => {
        // query = toast.loading("Выполняется отправка", {
        //     containerId: "toastContainer",
        //     draggable: true,
        //     position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        // });

        if (type === "creditor") {
            postData(
                "POST",
                `${import.meta.env.VITE_API_URL}responsible-persons/creditor`,
                {
                    project_id: +projectId,
                    contacts: data,
                }
            )
                .then((response) => {
                    if (response?.ok) {
                        setAddCreditor(false);

                        setAddedBank(data[0].creditor_id);

                        setCreditors((prevCreditor) => [
                            ...prevCreditor,
                            ...response.created.map((item) => ({
                                ...item.creditor_contact,
                                id: item.id,
                            })),
                        ]);

                        // setFilteredCreditors((prevCreditor) => [
                        //     ...prevCreditor,
                        //     ...response.created.map((item) => ({
                        //         ...item.creditor_contact,
                        //         id: item.id,
                        //     })),
                        // ]);

                        // toast.dismiss(query);

                        // toast.update(query, {
                        //     render:
                        //         response.message ||
                        //         "Контакты успешно добавлены к проекту!",
                        //     type: "success",
                        //     containerId: "toastContainer",
                        //     isLoading: false,
                        //     autoClose: 1200,
                        //     pauseOnFocusLoss: false,
                        //     pauseOnHover: false,
                        //     draggable: true,
                        //     position:
                        //         window.innerWidth >= 1440
                        //             ? "bottom-right"
                        //             : "top-right",
                        // });
                    }
                })
                .catch((error) => {
                    // toast.dismiss(query);
                    toast.error(
                        error.message || "Ошибка прикрепления исполнителя",
                        {
                            containerId: "toastContainer",
                            isLoading: false,
                            autoClose: 3500,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            draggable: true,
                            position:
                                window.innerWidth >= 1440
                                    ? "bottom-right"
                                    : "top-right",
                        }
                    );
                });
        } else if (type === "customer") {
            if (projectData?.contragent_id) {
                postData(
                    "POST",
                    `${
                        import.meta.env.VITE_API_URL
                    }responsible-persons/contragent`,
                    {
                        project_id: +projectId,
                        contacts: data,
                    }
                )
                    .then((response) => {
                        if (response?.ok) {
                            setAddCustomer(false);

                            setCustomers((prevCustomer) => [
                                ...prevCustomer,
                                ...response.created.map((item) => ({
                                    ...item.contragent_contact,
                                    id: item.id,
                                })),
                            ]);

                            // toast.dismiss(query);

                            // toast.update(query, {
                            //     render:
                            //         response.message ||
                            //         "Контакты успешно добавлены к проекту!",
                            //     type: "success",
                            //     containerId: "toastContainer",
                            //     isLoading: false,
                            //     autoClose: 1200,
                            //     pauseOnFocusLoss: false,
                            //     pauseOnHover: false,
                            //     draggable: true,
                            //     position:
                            //         window.innerWidth >= 1440
                            //             ? "bottom-right"
                            //             : "top-right",
                            // });
                        }
                    })
                    .catch((error) => {
                        // toast.dismiss(query);
                        toast.error(
                            error.message || "Ошибка прикрепления исполнителя",
                            {
                                containerId: "toastContainer",
                                isLoading: false,
                                autoClose: 3500,
                                pauseOnFocusLoss: false,
                                pauseOnHover: false,
                                draggable: true,
                                position:
                                    window.innerWidth >= 1440
                                        ? "bottom-right"
                                        : "top-right",
                            }
                        );
                    });
            } else {
                toast.error("Необходимо назначить заказчика", {
                    className: "toast-multiline",
                    isLoading: false,
                    autoClose: 2000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    containerId: "toastContainer",
                });
            }
        }
    };

    // Удаление контакта кредитора и заказчика
    const deleteContact = () => {
        // query = toast.loading("Удаление", {
        //     containerId: "toastContainer",
        //     draggable: true,
        //     position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        // });

        postData(
            "DELETE",
            `${import.meta.env.VITE_API_URL}responsible-persons/${
                deleteExecutor.type == "creditor" ? "creditor" : "contragent"
            }/${deleteExecutor.id}`,
            {}
        )
            .then((response) => {
                if (response?.ok) {
                    // toast.dismiss(query);

                    // toast.update(query, {
                    //     render: response.message,
                    //     type: "success",
                    //     containerId: "toastContainer",
                    //     isLoading: false,
                    //     autoClose: 1200,
                    //     pauseOnFocusLoss: false,
                    //     pauseOnHover: false,
                    //     draggable: true,
                    //     position:
                    //         window.innerWidth >= 1440
                    //             ? "bottom-right"
                    //             : "top-right",
                    // });

                    if (deleteExecutor.type == "creditor") {
                        setCreditors(
                            creditors.filter(
                                (item) => item.id !== deleteExecutor.id
                            )
                        );
                        setFilteredCreditors(
                            creditors.filter(
                                (item) => item.id !== deleteExecutor.id
                            )
                        );

                        setDeleteExecutor({});
                    } else {
                        setCustomers(
                            customers.filter(
                                (item) => item.id !== deleteExecutor.id
                            )
                        );

                        setDeleteExecutor({});
                    }
                }
            })
            .catch((error) => {
                // toast.dismiss(query);
                toast.error(error.message || "Ошибка удаления контакта", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 3500,
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

    // Удаление контакта кредитора и заказчика - открываем попап
    const openExecutorDeletePopup = (id, type) => {
        setDeleteExecutor({
            id: id,
            title:
                type == "creditor"
                    ? "контактное лицо кредитора"
                    : "ключевое лицо заказчика",
            message:
                type == "creditor"
                    ? 'После удаления данного контактного лица вы сможете снова добавить его из Справочника "Контакты кредиторов".'
                    : "После удаления данного ключевого лица вы сможете снова добавить его из Справочника ключевых лиц заказчиков.",
            type: type,
        });
    };

    // Открытие редактора отчёта
    const openReportEditor = (id) => {
        setReportId(id);
        if (id) {
            setActiveWindow("");
            setReportWindowsState(true);
        }
    };

    // Отправка отчёта
    const sendReport = (data) => {
        if (data.budget_in_billions) {
            data.budget_in_billions = data.budget_in_billions.replace(",", ".");
        }

        if (data.service_cost_in_rubles) {
            data.service_cost_in_rubles = parseFormattedMoney(
                data.service_cost_in_rubles
            );
        }

        data.project_id = projectId;

        // query = toast.loading("Выполняется отправка", {
        //     containerId: "toastContainer",
        //     position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        // });

        return postData("POST", `${import.meta.env.VITE_API_URL}reports`, data)
            .then((response) => {
                if (response?.ok) {
                    // toast.dismiss(query);

                    // toast.update(query, {
                    //     render: response.message,
                    //     type: "success",
                    //     containerId: "toastContainer",
                    //     isLoading: false,
                    //     autoClose: 1200,
                    //     pauseOnFocusLoss: false,
                    //     pauseOnHover: false,
                    //     draggable: true,
                    //     position:
                    //         window.innerWidth >= 1440
                    //             ? "bottom-right"
                    //             : "top-right",
                    // });

                    setReports((prevReports) => [
                        ...prevReports,
                        response.data,
                    ]);

                    getCard();
                    // Закрываем окно только при успешном сохранении
                    setReportWindowsState(false);
                    setReportId(null);
                } else {
                    // toast.dismiss(query);
                    toast.error("Ошибка при отправке отчёта", {
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        containerId: "toastContainer",
                    });
                    // Не закрываем окно при ошибке
                }
            })
            .catch((error) => {
                // toast.dismiss(query);
                toast.error(error.message || "Ошибка при отправке отчёта", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
                // Не закрываем окно при ошибке - пробрасываем ошибку дальше
                throw error;
            });
    };

    // Обновление отчёта
    const updateReport = (data, reportId) => {
        if (data.budget_in_billions) {
            data.budget_in_billions = data.budget_in_billions.replace(",", ".");
        }

        if (data.service_cost_in_rubles) {
            data.service_cost_in_rubles = parseFormattedMoney(
                data.service_cost_in_rubles
            );
        }

        data.action = "presave";
        data.project_id = projectId;

        // query = toast.loading("Обновление", {
        //     containerId: "toastContainer",
        //     draggable: true,
        //     position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        // });

        return postData(
            "PATCH",
            `${import.meta.env.VITE_API_URL}reports/${reportId}`,
            data
        )
            .then((response) => {
                if (response?.ok) {
                    // toast.dismiss(query);

                    // toast.update(query, {
                    //     render: response.message,
                    //     type: "success",
                    //     containerId: "toastContainer",
                    //     isLoading: false,
                    //     autoClose: 1200,
                    //     pauseOnFocusLoss: false,
                    //     pauseOnHover: false,
                    //     draggable: true,
                    //     position:
                    //         window.innerWidth >= 1440
                    //             ? "bottom-right"
                    //             : "top-right",
                    // });

                    getCard();
                    // Закрываем окно только при успешном сохранении
                    setReportId(null);
                    setReportWindowsState(false);
                } else {
                    // toast.dismiss(query);
                    toast.error("Ошибка обновления отчета", {
                        containerId: "toastContainer",
                        isLoading: false,
                        autoClose: 5000,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                    // Не закрываем окно при ошибке
                }
            })
            .catch((error) => {
                // toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления отчета", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 5000,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });
                // Не закрываем окно при ошибке - пробрасываем ошибку дальше
                throw error;
            });
    };

    // Удаление отчёта
    const deleteReport = (id) => {
        postData("DELETE", `${import.meta.env.VITE_API_URL}reports/${id}`, {})
            .then((response) => {
                if (response?.ok) {
                    getCard();
                }
            })
            .catch((error) => {
                toast.dismiss(query);
                toast.error(error.message || "Ошибка удаления отчёта", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 3500,
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

    // Получение ОСВ
    const getRevenue = (period) => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }projects/${projectId}/revenue/?period=${period}`
        ).then((response) => {
            if (response.status == 200) {
                setRevenue(response.data);
            }
        });
    };

    useEffect(() => {
        if (projectData.creditors) {
            setProjectDataCustom((prev) => ({
                ...prev,
                creditors: projectData.creditors.map((bank) => bank.id),
            }));
        }
    }, [projectData?.creditors]);

    useEffect(() => {
        const report = searchParams.get("report");

        if (report !== null && report !== "undefined") {
            openReportEditor(report);
        }
    }, [searchParams]);

    useEffect(() => {
        if (customers.length > 0 || reports.length > 0) {
            setCanChangeContragent(false);
        } else {
            setCanChangeContragent(true);
        }
    }, [customers, reports]);

    useEffect(() => {
        setProjectDataCustom((prev) => ({
            ...prev,
            industries: {
                ...projectData.industries,
                others: otherIndustries,
            },
        }));
    }, [otherIndustries]);

    useEffect(() => {
        if (projectData?.contragent_id) {
            setAvailableToChange(true);
            fetchContracts();
        } else {
            setReportWindowsState(false);
            setAvailableToChange(false);
        }
    }, [projectData?.contragent_id]);

    useEffect(() => {
        if (projectId) {
            getCard();
        }
    }, []);

    useBodyScrollLock(activeWindow || addCustomer || addCreditor); // Блокируем экран при открытии попапа или редактора отчета

    const width = useWindowWidth(); // Снимаем блокировку на десктопе

    useEffect(() => {
        if (width >= 1440) {
            setActiveWindow("");
        }
    }, [width]);

    return !isDataLoaded ? (
        <Loader />
    ) : (
        <main className="page">
            <section
                className={`card project-card ${
                    mode.edit === "full" ? "" : "read-mode"
                }`}
            >
                <div className="container card__container project-card__container">
                    <ToastContainer containerId="toastContainer" />

                    <div className="card__wrapper project-card__wrapper">
                        <section className="card__main-content project-card__main-content">
                            <div className="card__main-name">
                                <input
                                    type="text"
                                    name="name"
                                    value={projectDataCustom?.name}
                                    onChange={(e) => {
                                        if (mode.edit !== "full") return;
                                        setProjectDataCustom((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }));
                                    }}
                                    onBlur={() => {
                                        if (mode.edit !== "full") return;
                                        if (
                                            projectData?.name !=
                                            projectDataCustom?.name
                                        ) {
                                            updateCard(true, {
                                                name: projectDataCustom.name,
                                            });
                                        }
                                    }}
                                    disabled={mode.edit !== "full"}
                                />

                                <span
                                    className={`status status_new ${
                                        projectData?.status === "active"
                                            ? "active"
                                            : projectData?.status ===
                                              "completed"
                                            ? "completed"
                                            : ""
                                    }`}
                                >
                                    {handleStatus(projectData?.status)}
                                </span>
                            </div>

                            <div className="card__row project-card__budget-row">
                                <ProjectBudget projectData={projectData} />

                                <ProjectImplementationPeriod
                                    projectData={projectData}
                                />
                            </div>

                            <div className="project-card__services">
                                <div className="form-label">
                                    Услуги <Hint message={"Услуги"} />
                                </div>

                                <ReportServices services={services} />
                            </div>

                            <section className="project-card__general-info">
                                <h2 className="card__subtitle">
                                    Общая информация
                                </h2>

                                <div className="project-card__contragent">
                                    <div className="form-label">
                                        Заказчик <Hint message={"Заказчик"} />
                                    </div>

                                    <CreatableSelect
                                        ref={contragentRef}
                                        options={contragents}
                                        className="form-select-extend"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Выбрать из списка"
                                                : ""
                                        }
                                        noOptionsMessage={() =>
                                            "Совпадений нет"
                                        }
                                        isValidNewOption={() => false}
                                        value={
                                            (contragents.length > 0 &&
                                                contragents.find(
                                                    (option) =>
                                                        option.value ===
                                                        projectDataCustom?.contragent_id
                                                )) ||
                                            null
                                        }
                                        onChange={(selectedOption) => {
                                            if (mode.edit !== "full") return;

                                            const newValue =
                                                selectedOption?.value || null;

                                            setProjectDataCustom((prev) => ({
                                                ...prev,
                                                contragent_id: newValue,
                                            }));
                                            updateCard(true, {
                                                contragent_id: newValue,
                                            });
                                        }}
                                        isDisabled={mode.edit !== "full"}
                                        menuIsOpen={contragentMenuOpen}
                                        onMenuOpen={() => {
                                            if (!canChangeContragent) {
                                                toast.error(
                                                    "Перед тем, как изменить заказчика, вы должны удалить всех ключевых лиц заказчика и все созданные отчеты проекта.",
                                                    {
                                                        containerId:
                                                            "toastContainer",
                                                        isLoading: false,
                                                        autoClose: 2000,
                                                        pauseOnFocusLoss: false,
                                                        pauseOnHover: false,
                                                        draggable: true,
                                                        position:
                                                            window.innerWidth >=
                                                            1440
                                                                ? "bottom-right"
                                                                : "top-right",
                                                    }
                                                );
                                                contragentRef.current?.blur();
                                                setContragentMenuOpen(false);
                                            } else {
                                                setContragentMenuOpen(true);
                                            }
                                        }}
                                        onMenuClose={() =>
                                            setContragentMenuOpen(false)
                                        }
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

                                <div className="project-card__industries">
                                    <div className="form-label">
                                        Основная отрасль
                                        <Hint message={"Основная отрасль"} />
                                    </div>

                                    <CreatableSelect
                                        options={industries.map((item) => ({
                                            value: item.id,
                                            label: item.name,
                                        }))}
                                        className="form-select-extend"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Выбрать из списка"
                                                : ""
                                        }
                                        noOptionsMessage={() =>
                                            "Совпадений нет"
                                        }
                                        isValidNewOption={() => false}
                                        value={
                                            (industries.length > 0 &&
                                                industries
                                                    .map((item) => ({
                                                        value: item.id,
                                                        label: item.name,
                                                    }))
                                                    .find(
                                                        (item) =>
                                                            item.value ===
                                                            projectDataCustom
                                                                ?.industries
                                                                ?.main
                                                    )) ||
                                            null
                                        }
                                        onChange={(selectedOption) => {
                                            if (mode.edit !== "full") return;

                                            const newValue =
                                                +selectedOption?.value || null;

                                            setProjectDataCustom({
                                                ...projectDataCustom,
                                                industries: {
                                                    ...projectDataCustom.industries,
                                                    main: newValue,
                                                },
                                            });

                                            updateCard(true, {
                                                industries: {
                                                    ...projectDataCustom.industries,
                                                    main: newValue,
                                                },
                                            });
                                        }}
                                        isDisabled={
                                            mode.edit !== "full" ||
                                            !availableToChange
                                        }
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

                                <div className="project-card__industries">
                                    <div className="form-label">
                                        Дополнительная отрасль
                                        <Hint
                                            message={"Дополнительная отрасль"}
                                        />
                                    </div>

                                    <CardMultiSelector
                                        options={industries
                                            .filter(
                                                (industry) =>
                                                    industry.id !==
                                                    projectDataCustom
                                                        ?.industries?.main
                                            )
                                            .map((industry) => ({
                                                value: industry.id,
                                                label: industry.name,
                                            }))}
                                        onChange={(updated) => {
                                            if (mode.edit !== "full") return;

                                            setOtherIndustries(updated.others);
                                        }}
                                        submit={() =>
                                            updateCard(true, {
                                                industries: {
                                                    ...projectDataCustom.industries,
                                                    others: otherIndustries,
                                                },
                                            })
                                        }
                                        filedName="others"
                                        selectedValues={otherIndustries}
                                        popupTitle="Добавить дополнительные отрасли"
                                        buttonTitle="Добавить дополнительную отрасль"
                                        disabled={mode.edit !== "full"}
                                    />
                                </div>

                                <div className="project-card__description">
                                    <div className="form-label">
                                        Краткое описание проекта
                                        <Hint
                                            message={"Краткое описание проекта"}
                                        />
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Например: создание производства заготовки с микрокристаллической структурой..."
                                                : ""
                                        }
                                        value={
                                            projectDataCustom?.description || ""
                                        }
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;
                                            setProjectDataCustom((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;
                                            if (
                                                projectData?.description !=
                                                projectDataCustom?.description
                                            ) {
                                                updateCard(true, {
                                                    description:
                                                        projectDataCustom.description,
                                                });
                                            }
                                        }}
                                        disabled={
                                            mode.edit !== "full" ||
                                            !availableToChange
                                        }
                                    />
                                </div>

                                <div className="project-card__location">
                                    <div className="form-label">
                                        Местоположение
                                        <Hint message={"Местоположение"} />
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Страна, город, область..."
                                                : ""
                                        }
                                        minHeight={31}
                                        value={
                                            projectDataCustom?.location || ""
                                        }
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;
                                            setProjectDataCustom((prev) => ({
                                                ...prev,
                                                location: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;
                                            if (
                                                projectData?.location !=
                                                projectDataCustom?.location
                                            ) {
                                                updateCard(true, {
                                                    location:
                                                        projectDataCustom.location,
                                                });
                                            }
                                        }}
                                        disabled={
                                            mode.edit !== "full" ||
                                            !availableToChange
                                        }
                                    />
                                </div>

                                <div className="project-card__tep">
                                    <div className="form-label">
                                        ТЭП
                                        <Hint message={"ТЭП"} />
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Заполните ТЭП"
                                                : ""
                                        }
                                        minHeight={31}
                                        value={projectDataCustom?.tep || ""}
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;

                                            setProjectDataCustom((prev) => ({
                                                ...prev,
                                                tep: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;

                                            if (
                                                projectData?.tep !=
                                                projectDataCustom?.tep
                                            ) {
                                                updateCard(true, {
                                                    tep: projectDataCustom.tep,
                                                });
                                            }
                                        }}
                                        disabled={
                                            mode.edit !== "full" ||
                                            !availableToChange
                                        }
                                    />
                                </div>
                            </section>

                            <section className="project-card__project-team">
                                <h2 className="card__subtitle">
                                    Команда проекта
                                </h2>

                                <div className="project-card__team">
                                    <ProjectTeam teamData={teamData} />
                                </div>
                            </section>

                            <section className="project-card__project-executors">
                                <h2 className="card__subtitle">
                                    Ключевые лица заказчика
                                </h2>

                                <ul className="project-card__executors-list">
                                    {customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <ExecutorBlock
                                                key={customer.id}
                                                contanct={customer}
                                                mode={mode}
                                                type={"customer"}
                                                deleteBlock={
                                                    openExecutorDeletePopup
                                                }
                                            />
                                        ))
                                    ) : (
                                        <li className="project-card__executors-list-nodata">
                                            Нет данных
                                        </li>
                                    )}
                                </ul>

                                {mode.edit === "full" && availableToChange && (
                                    <button
                                        type="button"
                                        className="button-add"
                                        onClick={() => {
                                            if (projectData?.contragent_id) {
                                                if (!addCustomer) {
                                                    setAddCustomer(true);
                                                }
                                            } else {
                                                toast.error(
                                                    "Необходимо назначить заказчика",
                                                    {
                                                        className:
                                                            "toast-multiline",
                                                        isLoading: false,
                                                        autoClose: 2000,
                                                        pauseOnFocusLoss: false,
                                                        pauseOnHover: false,
                                                        draggable: true,
                                                        position:
                                                            window.innerWidth >=
                                                            1440
                                                                ? "bottom-right"
                                                                : "top-right",
                                                        containerId:
                                                            "toastContainer",
                                                    }
                                                );
                                            }
                                        }}
                                        title="Добавить ключевое лицо Заказчика"
                                    >
                                        Добавить
                                        <span>
                                            <svg
                                                width="10"
                                                height="9"
                                                viewBox="0 0 10 9"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M5.75 3.75H9.5v1.5H5.75V9h-1.5V5.25H.5v-1.5h3.75V0h1.5v3.75z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                    </button>
                                )}

                                {addCustomer && (
                                    <EmptyExecutorBlock
                                        type={"customer"}
                                        projectData={projectData}
                                        projectId={projectId}
                                        removeBlock={() =>
                                            setAddCustomer(false)
                                        }
                                        sendExecutor={sendExecutor}
                                    />
                                )}
                            </section>

                            <ProjectCardCreditors
                                mode={mode}
                                availableToChange={availableToChange}
                                banks={banks}
                                creditors={creditors}
                                filteredCreditors={filteredCreditors}
                                setFilteredCreditors={setFilteredCreditors}
                                openExecutorDeletePopup={
                                    openExecutorDeletePopup
                                }
                                addCreditor={addCreditor}
                                setAddCreditor={setAddCreditor}
                                projectId={projectId}
                                sendExecutor={sendExecutor}
                                addedBank={addedBank}
                                setAddedBank={setAddedBank}
                            />
                        </section>

                        <section className="card__aside-content project-card__aside-content">
                            <ProjectStatisticsBlock
                                revenue={revenue}
                                getRevenue={getRevenue}
                                period={period}
                                setPeriod={setPeriod}
                            />

                            {reports.length > 0 ? (
                                <div className="reports">
                                    <div className="reports__body">
                                        <nav className="card__tabs reports__tabs">
                                            <div
                                                className="card__tabs-item radio-field_tab"
                                                onClick={() =>
                                                    setActiveReportTab(
                                                        "projectReports"
                                                    )
                                                }
                                                aria-label="Открыть вкладку Отчёты проекта"
                                            >
                                                <input
                                                    id="projectReports"
                                                    type="radio"
                                                    checked={
                                                        activeReportTab ==
                                                        "projectReports"
                                                    }
                                                    name="active_reports_1"
                                                    onChange={() =>
                                                        setActiveReportTab(
                                                            "projectReports"
                                                        )
                                                    }
                                                />
                                                <label htmlFor="projectReports">
                                                    Отчёты проекта
                                                    <span>
                                                        {reports.length}
                                                    </span>
                                                </label>
                                            </div>
                                            <div
                                                className="card__tabs-item radio-field_tab"
                                                onClick={() =>
                                                    setActiveReportTab(
                                                        "projectReports"
                                                    )
                                                }
                                                aria-label="Открыть вкладку Отчёты ответственных"
                                            >
                                                <input
                                                    id="managementReports"
                                                    type="radio"
                                                    checked={
                                                        activeReportTab ==
                                                        "managementReports"
                                                    }
                                                    name="active_reports_1"
                                                    onChange={() =>
                                                        setActiveReportTab(
                                                            "managementReports"
                                                        )
                                                    }
                                                />
                                                <label htmlFor="managementReports">
                                                    Отчёты ответственных
                                                    <span>
                                                        {
                                                            managementReports.length
                                                        }
                                                    </span>
                                                </label>
                                            </div>
                                        </nav>

                                        {activeReportTab ===
                                            "projectReports" && (
                                            <ProjectReportsList
                                                reports={reports}
                                                isDataLoaded={isDataLoaded}
                                                deleteReport={deleteReport}
                                                openReportEditor={
                                                    openReportEditor
                                                }
                                                mode={mode}
                                            />
                                        )}

                                        {activeReportTab ===
                                            "managementReports" && (
                                            <ManagementReportsTab
                                                showFullName={true}
                                                managementReports={
                                                    managementReports
                                                }
                                                activeWindow={activeWindow}
                                                setActiveWindow={
                                                    setActiveWindow
                                                }
                                                mode={"read"}
                                            />
                                        )}
                                    </div>

                                    {mode.edit === "full" &&
                                        availableToChange && (
                                            <div className="reports__footer">
                                                {activeReportTab ==
                                                    "projectReports" && (
                                                    <button
                                                        type="button"
                                                        className="reports__add-btn"
                                                        onClick={() =>
                                                            setReportWindowsState(
                                                                true
                                                            )
                                                        }
                                                        title="Создать отчёт"
                                                    >
                                                        Создать отчёт
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                </div>
                            ) : (
                                mode.edit === "full" &&
                                availableToChange &&
                                activeReportTab == "projectReports" && (
                                    <button
                                        type="button"
                                        className="reports__add-btn"
                                        onClick={() =>
                                            setReportWindowsState(true)
                                        }
                                        title="Создать отчёт"
                                    >
                                        Создать отчёт
                                    </button>
                                )
                            )}
                        </section>
                    </div>
                </div>

                {/* Редактор отчёта */}
                <ReportWindow
                    reportWindowsState={reportWindowsState}
                    setReportWindowsState={setReportWindowsState}
                    sendReport={sendReport}
                    contracts={contracts}
                    updateReport={updateReport}
                    reportId={reportId}
                    projectId={projectId}
                    setReportId={setReportId}
                    mode={mode}
                />

                {/* Мобильный ОСВ */}
                <BottomSheet
                    onClick={() => setActiveWindow("")}
                    className={`${
                        activeWindow === "statistic" ? "active" : ""
                    }`}
                >
                    <ProjectStatisticsBlockMobile
                        revenue={revenue}
                        getRevenue={getRevenue}
                        period={period}
                        setPeriod={setPeriod}
                    />
                </BottomSheet>

                {/* Мобильные отчёты */}
                <BottomSheet
                    onClick={() => setActiveWindow("")}
                    className={`${activeWindow === "reports" ? "active" : ""}`}
                >
                    <div className="reports">
                        <div className="reports__body">
                            <nav className="card__tabs reports__tabs">
                                <div
                                    className="card__tabs-item radio-field_tab"
                                    onClick={() =>
                                        setActiveReportTab("projectReports")
                                    }
                                    aria-label="Открыть вкладку Отчёты проекта"
                                >
                                    <input
                                        id="projectReports"
                                        type="radio"
                                        checked={
                                            activeReportTab == "projectReports"
                                        }
                                        name="active_reports"
                                        onChange={() =>
                                            setActiveReportTab("projectReports")
                                        }
                                    />
                                    <label htmlFor="projectReports">
                                        Отчёты проекта
                                        <span>{reports.length}</span>
                                    </label>
                                </div>
                                <div
                                    className="card__tabs-item radio-field_tab"
                                    onClick={() =>
                                        setActiveReportTab("projectReports")
                                    }
                                    aria-label="Открыть вкладку ответственных ответственного"
                                >
                                    <input
                                        id="managementReports"
                                        type="radio"
                                        checked={
                                            activeReportTab ==
                                            "managementReports"
                                        }
                                        name="active_reports"
                                        onChange={() =>
                                            setActiveReportTab(
                                                "managementReports"
                                            )
                                        }
                                    />
                                    <label htmlFor="managementReports">
                                        Отчёты ответственных
                                        <span>{managementReports.length}</span>
                                    </label>
                                </div>
                            </nav>

                            {activeReportTab === "projectReports" && (
                                <ProjectReportsList
                                    reports={reports}
                                    isDataLoaded={isDataLoaded}
                                    deleteReport={deleteReport}
                                    openReportEditor={openReportEditor}
                                    mode={mode}
                                />
                            )}

                            {activeReportTab === "managementReports" && (
                                <ManagementReportsTabMobile
                                    showFullName={true}
                                    activeWindow={activeWindow}
                                    setActiveWindow={setActiveWindow}
                                    managementReports={managementReports}
                                    mode={"read"}
                                />
                            )}
                        </div>
                    </div>
                </BottomSheet>
            </section>

            {/* Удаление контакта */}
            {Object.keys(deleteExecutor).length > 0 && (
                <Popup
                    onClick={() => setDeleteExecutor({})}
                    title={`Удалить ${deleteExecutor.title}`}
                >
                    <div className="action-form__body">
                        <p>{deleteExecutor.message}</p>
                    </div>

                    <div className="action-form__footer">
                        <div className="max-w-[280px]">
                            <button
                                type="button"
                                onClick={() => setDeleteExecutor({})}
                                className="cancel-button flex-[1_0_auto]"
                            >
                                Отмена
                            </button>

                            <button
                                type="button"
                                className="action-button flex-[1_0_auto]"
                                onClick={() => deleteContact()}
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </Popup>
            )}

            <CardBottomActions
                setReportWindowsState={setReportWindowsState}
                setActiveWindow={setActiveWindow}
                className={"project-card__bottom-actions"}
            />

            <BottomNavCard className="project-card__bottom-nav">
                {mode.edit === "full" && availableToChange && (
                    <button
                        type="button"
                        className="button-add"
                        onClick={() => {
                            setActiveWindow("");
                            setReportWindowsState(true);
                        }}
                        title="Создать отчёт"
                    >
                        Отчёт
                        <span>
                            <svg
                                width="13"
                                height="12"
                                viewBox="0 0 13 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M7.5 5H12.5V7H7.5V12H5.5V7H0.5V5H5.5V0H7.5V5Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </span>
                    </button>
                )}
            </BottomNavCard>
        </main>
    );
};
export default ProjectCard;
