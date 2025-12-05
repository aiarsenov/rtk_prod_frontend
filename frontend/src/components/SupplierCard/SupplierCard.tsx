import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";
import { useWindowWidth } from "../../hooks/useWindowWidth.js";

import { ToastContainer, toast } from "react-toastify";

import CardProjects from "../CardProjects/CardProjects";
import ReportWindow from "../ReportWindow/ReportWindow";
import CardBottomActions from "../CardBottomActions.js";

import SupplierStatisticBlock from "./SupplierStatisticBlock";
import SupplierStatisticBlockMobile from "./SupplierStatisticBlockMobile";
import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";

import CardReportsList from "../CardReportsList/CardReportsList";
import CardManagementReportList from "../CardReportsList/CardManagementReportList";

import SupplierEmptyExecutorBlock from "./SupplierEmptyExecutorBlock";

import BottomSheet from "../BottomSheet/BottomSheet";
import AutoResizeTextarea from "../AutoResizeTextarea";

import Loader from "../Loader.jsx";

const SupplierCard = () => {
    const URL = `${import.meta.env.VITE_API_URL}suppliers`;
    const { supplierId } = useParams();
    const navigate = useNavigate();

    const [mode, setMode] = useState("edit");

    const [isReportsDataLoaded, setIsReportsDataLoaded] = useState(false);
    const [isManagementReportsDataLoaded, setIsManagementReportsDataLoaded] =
        useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [cardData, setCardData] = useState({});
    const [cardDataCustom, setCardDataCustom] = useState({});

    const [activeReportTab, setActiveReportTab] = useState("projectReports");
    const [activeWindow, setActiveWindow] = useState("");
    const [activeProject, setActiveProject] = useState(null); // Выбранный проект

    const [period, setPeriod] = useState("current_year");
    const [revenue, setRevenue] = useState({}); // ОСВ

    const [reports, setReports] = useState([]); // Отчёты проектов
    const [selectedReports, setSelectedReports] = useState([]); // Очёты выбранного проекта
    const [managerReports, setManagerReports] = useState([]); // Отчёты руководителя проектов
    const [selectedManagerReports, setSelectedManagerReports] = useState([]); // Отчёты руководителя выбранного проекта
    const [projects, setProjects] = useState([]); // Проекты

    const [reportWindowsState, setReportWindowsState] = useState(false); // Конструктор отчёта
    const [reportName, setReportName] = useState(""); // Название отчета
    const [reportId, setReportId] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [responsiblePersons, setResponsiblePersons] = useState([]);
    const [addRespPerson, setAddRespPerson] = useState(false);

    // let query;

    // Получаем отчеты по выбранному проекту
    const getProjectReports = (id) => {
        setReportWindowsState(false);

        const targetReports = reports.filter(
            (report) => report.project_id === id
        );

        const targetManagerReport = cardData.manager_reports?.filter(
            (report) => report.project_id === id
        );

        if (targetReports?.length > 0) {
            setSelectedReports(targetReports);
        } else {
            setSelectedReports([]);
        }

        if (targetManagerReport.length > 0) {
            setSelectedManagerReports(targetManagerReport);
        } else {
            setSelectedManagerReports([]);
        }
    };

    // Получение договоров
    const getContracts = () => {
        getData(
            `${import.meta.env.VITE_API_URL}contragents/${supplierId}/contracts`
        ).then((response) => {
            if (response?.status == 200) {
                setContracts(response.data);
            }
        });
    };

    // Получаем список отчетов
    const getProjectsReports = () => {
        setIsReportsDataLoaded(false);
        setReportName("");

        getData(`${URL}/${supplierId}/reports`, {
            Accept: "application/json",
        })
            .then((response) => {
                if (response.status == 200) {
                    setReports(response.data);
                    setSelectedReports(response.data);
                }
            })
            .finally(() => setIsReportsDataLoaded(true));
    };

    // Получаем список отчетов руководителя
    const getProjectsManagerReports = () => {
        setIsManagementReportsDataLoaded(false);

        getData(`${URL}/${supplierId}/manager-reports`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setManagerReports(response.data);
                setSelectedManagerReports(response.data);
                setIsManagementReportsDataLoaded(true);
            }
        });
    };

    // Получаем подрядчика и его проекты
    const fetchData = () => {
        getData(`${URL}/${supplierId}`, {
            Accept: "application/json",
        })
            .then((response) => {
                setCardData(response.data);
                setCardDataCustom(response.data);
                setProjects(response.data.projects);
                setResponsiblePersons(response.data.contacts);
                setIsDataLoaded(true);
            })
            .catch((error) => {
                if (error && error.status === 404) {
                    navigate("/not-found", {
                        state: {
                            message: "Подрядчик не найден",
                            errorCode: 404,
                            additionalInfo: "",
                        },
                    });
                }
            });
    };

    // Обновление данных карточки
    const updateData = (showMessage = true) => {
        // query = toast.loading("Обновление", {
        //     containerId: "toastContainer",
        //     draggable: true,
        //     position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        // });

        postData("PATCH", `${URL}/${supplierId}`, cardDataCustom)
            .then((response) => {
                if (response?.ok && showMessage) {
                    // toast.update(query, {
                    //     render: "Данные обновлены",
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

                    // toast.dismiss(query);
                    setCardData((prev) => ({
                        ...prev,
                        ...response,
                    }));
                    setCardDataCustom((prev) => ({
                        ...prev,
                        ...response,
                    }));
                } else {
                    // toast.dismiss(query);
                    toast.error("Ошибка обновления данных", {
                        containerId: "toastContainer",
                        isLoading: false,
                        autoClose: 1500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                    });
                }
            })
            .catch((error) => {
                // toast.dismiss(query);
                toast.error(error.message || "Ошибка обновления данных", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 1500,
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

    // Открытие редактора отчёта
    const openReportEditor = (id) => {
        setReportId(id);
        const targetReport = reports.find((item) => item.id === id);

        if (id) {
            setReportName(
                `${targetReport.project_name} / ${targetReport.report_period_code}`
            );
            setActiveWindow("");
            setReportWindowsState(true);
        }
    };

    // Добавление ключевого лица
    const sendExecutor = (data) => {
        // query = toast.loading("Выполняется отправка", {
        //     containerId: "toastContainer",
        //     draggable: true,
        //     position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        // });

        postData("POST", `${URL}/${supplierId}/contacts`, data)
            .then((response) => {
                if (response?.ok) {
                    setResponsiblePersons((prevPerson) => [
                        ...prevPerson,
                        response,
                    ]);

                    setAddRespPerson(false);

                    // toast.dismiss(query);

                    // toast.update(query, {
                    //     render: response.message || "Ключевое лицо добавлено",
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
                toast.error(error.message || "Ошибка добавления исполнителя", {
                    containerId: "toastContainer",
                    isLoading: false,
                    autoClose: 1500,
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

    // Удаление ключевого лица
    const deleteRespPerson = (id) => {
        postData(
            "DELETE",
            `${
                import.meta.env.VITE_API_URL
            }responsible-persons/supplier/contact/${id}`,
            {}
        ).then((response) => {
            if (response?.ok) {
                setResponsiblePersons(
                    responsiblePersons.filter((item) => item.id !== id)
                );

                // toast.success("Ключевое лицо удалено", {
                //     containerId: "toastContainer",
                //     isLoading: false,
                //     autoClose: 1500,
                //     pauseOnFocusLoss: false,
                //     pauseOnHover: false,
                //     position:
                //         window.innerWidth >= 1440
                //             ? "bottom-right"
                //             : "top-right",
                // });
            }
        });
    };

    // Получение ОСВ
    const getRevenue = (url) => {
        getData(url).then((response) => {
            if (response.status == 200) {
                setRevenue(response.data);
            }
        });
    };

    useEffect(() => {
        if (supplierId) {
            fetchData();
            getProjectsReports();
            getProjectsManagerReports();
            getContracts();
        }
    }, []);

    const block1Ref = useRef(null);
    const block2Ref = useRef(null);
    const block3Ref = useRef(null);
    const block4Ref = useRef(null);
    const block5Ref = useRef(null);
    const block6Ref = useRef(null);
    const block7Ref = useRef(null);

    useOutsideClick(
        [
            block1Ref,
            block2Ref,
            block3Ref,
            block4Ref,
            block5Ref,
            block6Ref,
            block7Ref,
        ],
        () => {
            setActiveProject(null);
            setSelectedReports(reports);
            setSelectedManagerReports(managerReports);
        }
    );

    useBodyScrollLock(activeWindow); // Блокируем экран при открытии попапа или редактора отчета

    const width = useWindowWidth(); // Снимаем блокировку на десктопе

    useEffect(() => {
        if (width >= 1440) {
            setActiveWindow("");
        }
    }, [width]);

    useEffect(() => {
        if (mode === "read") {
            setAddRespPerson(false);
        }
    }, [mode]);

    return !isDataLoaded ? (
        <Loader />
    ) : (
        <main className="page">
            <section
                className={`card supplier-card ${
                    mode === "read" ? "read-mode" : ""
                }`}
            >
                <div className="container card__container supplier-card__container">
                    <ToastContainer containerId="toastContainer" />

                    <div className="card__wrapper supplier-card__wrapper">
                        <section className="form card__main-content supplier-card__main-content">
                            <div className="card__main-name">
                                <input
                                    type="text"
                                    name="program_name"
                                    value={cardDataCustom?.program_name || ""}
                                    disabled
                                />

                                <span
                                    className={`status
                                    ${
                                        cardData?.status === "active"
                                            ? "active"
                                            : cardData?.status === "completed"
                                    }
                                `}
                                >
                                    {handleStatus(cardData?.status)}
                                </span>
                            </div>

                            <section className="card__general-info">
                                <div>
                                    <div className="form-label">
                                        Краткое описание компании
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode === "edit"
                                                ? "Заполните описание"
                                                : ""
                                        }
                                        type="text"
                                        name="description_short"
                                        value={
                                            cardDataCustom?.description_short ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            if (mode === "read") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                description_short:
                                                    e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode === "read") return;
                                            if (
                                                cardData?.description_short !=
                                                cardDataCustom?.description_short
                                            ) {
                                                updateData(true, {
                                                    description_short:
                                                        cardDataCustom.description_short,
                                                });
                                            }
                                        }}
                                        disabled={mode == "read"}
                                    />
                                </div>

                                <div>
                                    <div className="form-label">
                                        Адрес центрального офиса
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode === "edit"
                                                ? "Заполните адрес центрального офиса"
                                                : ""
                                        }
                                        type="text"
                                        name="head_office_address"
                                        value={
                                            cardDataCustom?.head_office_address ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            if (mode === "read") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                head_office_address:
                                                    e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode === "read") return;
                                            if (
                                                cardData?.head_office_address !=
                                                cardDataCustom?.head_office_address
                                            ) {
                                                updateData(true, {
                                                    head_office_address:
                                                        cardDataCustom.head_office_address,
                                                });
                                            }
                                        }}
                                        disabled={mode == "read"}
                                    />
                                </div>

                                <div>
                                    <div className="form-label">
                                        Сайт компании
                                    </div>

                                    <input
                                        type="text"
                                        className="form-field"
                                        placeholder={
                                            mode === "edit"
                                                ? "Введите адрес сайта компании"
                                                : ""
                                        }
                                        name="company_website"
                                        value={
                                            cardDataCustom?.company_website ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            if (mode === "read") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                company_website: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode === "read") return;
                                            if (
                                                cardData?.company_website !=
                                                cardDataCustom?.company_website
                                            ) {
                                                updateData(true, {
                                                    company_website:
                                                        cardDataCustom.company_website,
                                                });
                                            }
                                        }}
                                        disabled={mode == "read"}
                                    />
                                </div>
                            </section>

                            <section className="project-card__projects">
                                <h2 className="card__subtitle">
                                    Проекты
                                    <span>{projects.length}</span>
                                </h2>

                                <div ref={block1Ref}>
                                    <CardProjects
                                        projects={projects}
                                        setActiveProject={setActiveProject}
                                        activeProject={activeProject}
                                        getProjectReports={getProjectReports}
                                    />
                                </div>
                            </section>

                            <section className="project-card__project-executors">
                                <h2 className="card__subtitle">
                                    Ключевые лица
                                </h2>

                                <ul className="project-card__executors-list">
                                    {responsiblePersons.length > 0 ? (
                                        responsiblePersons.map((person) => (
                                            <ExecutorBlock
                                                key={person.id}
                                                contanct={person}
                                                mode={mode}
                                                type={"customer"}
                                                deleteBlock={deleteRespPerson}
                                            />
                                        ))
                                    ) : (
                                        <li className="project-card__executors-list-nodata">
                                            Нет данных
                                        </li>
                                    )}
                                </ul>

                                {mode == "edit" && (
                                    <button
                                        type="button"
                                        className="button-add"
                                        onClick={() => {
                                            if (!addRespPerson) {
                                                setAddRespPerson(true);
                                            }
                                        }}
                                        title="Добавить ключевое лицо"
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

                                {addRespPerson && (
                                    <SupplierEmptyExecutorBlock
                                        supplierId={supplierId}
                                        removeBlock={() =>
                                            setAddRespPerson(false)
                                        }
                                        sendExecutor={sendExecutor}
                                    />
                                )}
                            </section>
                        </section>

                        <section className="card__aside-content project-card__aside-content supplier-card__aside-content">
                            <div className="flex flex-col">
                                <div ref={block3Ref}>
                                    <SupplierStatisticBlock
                                        revenue={revenue}
                                        getRevenue={getRevenue}
                                        supplierId={supplierId}
                                        activeProject={activeProject}
                                        period={period}
                                        setPeriod={setPeriod}
                                    />
                                </div>
                            </div>

                            <div className="reports" ref={block2Ref}>
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
                                            </label>
                                        </div>
                                        <div
                                            className="card__tabs-item radio-field_tab"
                                            onClick={() =>
                                                setActiveReportTab(
                                                    "projectReports"
                                                )
                                            }
                                            aria-label="Открыть вкладку Отчёты руководителя проекта"
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
                                                Отчёты руководителя проекта
                                            </label>
                                        </div>
                                    </nav>

                                    {activeReportTab === "projectReports" && (
                                        <CardReportsList
                                            isDataLoaded={isReportsDataLoaded}
                                            reports={selectedReports}
                                            openReportEditor={openReportEditor}
                                            mode={"read"}
                                        />
                                    )}

                                    {activeReportTab ===
                                        "managementReports" && (
                                        <CardManagementReportList
                                            managerReports={
                                                selectedManagerReports
                                            }
                                            isDataLoaded={
                                                isManagementReportsDataLoaded
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Редактор отчёта */}
                <div ref={block4Ref}>
                    <ReportWindow
                        reportName={reportName}
                        reportWindowsState={reportWindowsState}
                        setReportWindowsState={setReportWindowsState}
                        contracts={contracts}
                        reportId={reportId}
                        setReportId={setReportId}
                        mode={"read"}
                    />
                </div>

                {/* Мобильный ОСВ */}
                <div ref={block5Ref}>
                    <BottomSheet
                        onClick={() => setActiveWindow("")}
                        className={`${
                            activeWindow === "statistic" ? "active" : ""
                        }`}
                    >
                        <SupplierStatisticBlockMobile
                            revenue={revenue}
                            getRevenue={getRevenue}
                            supplierId={supplierId}
                            activeProject={activeProject}
                            period={period}
                            setPeriod={setPeriod}
                        />
                    </BottomSheet>
                </div>

                {/* Мобильные отчёты */}
                <div ref={block6Ref}>
                    <BottomSheet
                        onClick={() => setActiveWindow("")}
                        className={`${
                            activeWindow === "reports" ? "active" : ""
                        }`}
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
                                                activeReportTab ==
                                                "projectReports"
                                            }
                                            name="active_reports"
                                            onChange={() =>
                                                setActiveReportTab(
                                                    "projectReports"
                                                )
                                            }
                                        />
                                        <label htmlFor="projectReports">
                                            Отчёты проекта
                                        </label>
                                    </div>
                                    <div
                                        className="card__tabs-item radio-field_tab"
                                        onClick={() =>
                                            setActiveReportTab("projectReports")
                                        }
                                        aria-label="Открыть вкладку Отчёты руководителя проекта"
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
                                            Отчёты руководителя проекта
                                        </label>
                                    </div>
                                </nav>

                                {activeReportTab === "projectReports" && (
                                    <CardReportsList
                                        isDataLoaded={isReportsDataLoaded}
                                        reports={selectedReports}
                                        openReportEditor={openReportEditor}
                                        mode={"read"}
                                    />
                                )}

                                {activeReportTab === "managementReports" && (
                                    <CardManagementReportList
                                        managerReports={selectedManagerReports}
                                        isDataLoaded={
                                            isManagementReportsDataLoaded
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </BottomSheet>
                </div>
            </section>

            <div ref={block7Ref}>
                <CardBottomActions
                    setReportWindowsState={setReportWindowsState}
                    setActiveWindow={setActiveWindow}
                />
            </div>
        </main>
    );
};

export default SupplierCard;
