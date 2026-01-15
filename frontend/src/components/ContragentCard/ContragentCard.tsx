import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";
import { useWindowWidth } from "../../hooks/useWindowWidth.js";

import { ToastContainer, toast } from "react-toastify";

import Hint from "../Hint/Hint";
import CardProjects from "../CardProjects/CardProjects";
import ReportWindow from "../ReportWindow/ReportWindow";
import CardBottomActions from "../CardBottomActions.js";

import CardReportsList from "../CardReportsList/CardReportsList.js";
import CardManagementReportList from "../CardReportsList/CardManagementReportList";

import ContragentStatisticBlock from "./ContragentStatisticBlock";
import ContragentStatisticBlockMobile from "./ContragentStatisticBlockMobile";

import BottomSheet from "../BottomSheet/BottomSheet";
import AutoResizeTextarea from "../AutoResizeTextarea";
import ContragentResponsiblePersons from "./ContragentResponsiblePersons";

import Loader from "../Loader.jsx";

import "./ContragentCard.scss";

const ContragentCard = () => {
    const userPermitions = useSelector(
        (state) => state.user?.data?.permissions
    );

    const mode = userPermitions?.customers || {
        delete: "read",
        edit: "read",
        view: "read",
    };

    const URL = `${import.meta.env.VITE_API_URL}contragents`;
    const { contragentId } = useParams();
    const navigate = useNavigate();

    const [cardData, setCardData] = useState({});
    const [cardDataCustom, setCardDataCustom] = useState({});

    const [isReportsDataLoaded, setIsReportsDataLoaded] = useState(false);
    const [isManagementReportsDataLoaded, setIsManagementReportsDataLoaded] =
        useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [activeReportTab, setActiveReportTab] = useState("projectReports");
    const [activeWindow, setActiveWindow] = useState(""); // Активное окно на мобилке (Отчеты или ОСВ)

    const [reports, setReports] = useState([]); // Отчёты проектов
    const [selectedReports, setSelectedReports] = useState([]); // Очёты выбранного проекта
    const [managerReports, setManagerReports] = useState([]); // Отчёты руководителя проектов
    const [selectedManagerReports, setSelectedManagerReports] = useState([]); // Отчёты руководителя выбранного проекта
    const [projects, setProjects] = useState([]); // Проекты

    const [activeProject, setActiveProject] = useState(null); // Выбранный проект

    const [period, setPeriod] = useState("current_year");
    const [revenue, setRevenue] = useState({}); // ОСВ

    const [responsiblePersons, setResponsiblePersons] = useState([]); // Ключевые лица Заказчика
    const [selectedResponsiblePersons, setSelectedResponsiblePersons] =
        useState([]); // Ключевые лица Заказчика выбранного проекта
    const [reportWindowsState, setReportWindowsState] = useState(false); // Редактор отчёта
    const [reportName, setReportName] = useState(""); // Название отчета
    const [reportId, setReportId] = useState(null);
    const [contracts, setContracts] = useState([]);

    // let query;

    // Получение данных заказчика и его проекты

    // Получение ОСВ
    const getRevenue = (url) => {
        getData(url).then((response) => {
            if (response.status == 200) {
                setRevenue(response.data);
            }
        });
    };

    // Получение ключевых лиц
    const getResponsiblePesons = () => {
        return getData(`${URL}/${contragentId}/contacts`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setResponsiblePersons(response.data.data);
                setSelectedResponsiblePersons(response.data.data);
            }
        });
    };

    // Получение списка отчетов
    const getContragentReports = () => {
        return getData(`${URL}/${contragentId}/reports`, {
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

    // Получение списка отчетов руководителя
    const getProjectsManagerReports = () => {
        setIsManagementReportsDataLoaded(false);

        return getData(`${URL}/${contragentId}/manager-reports`, {
            Accept: "application/json",
        }).then((response) => {
            if (response.status == 200) {
                setManagerReports(response.data);
                setSelectedManagerReports(response.data);
                setIsManagementReportsDataLoaded(true);
            }
        });
    };

    // Получение отчетов по выбранному проекту
    const getProjectReports = (id) => {
        setReportWindowsState(false);
        setReportName("");

        const targetReports = reports.filter(
            (report) => report.project_id === id
        );

        const targetManagerReport = managerReports?.filter(
            (report) => report.project_id === id
        );

        if (targetReports?.length > 0) {
            setSelectedReports(targetReports);
        } else {
            setSelectedReports([]);
        }

        if (targetManagerReport?.length > 0) {
            setSelectedManagerReports(targetManagerReport);
        } else {
            setSelectedManagerReports([]);
        }
    };

    // Получение ключевых лиц выбранного проекта
    const getProjectContact = (id) => {
        setSelectedResponsiblePersons(
            responsiblePersons.projects?.find((item) => item.id === id)
        );
    };

    // Получение договоров
    const getContracts = () => {
        return getData(
            `${
                import.meta.env.VITE_API_URL
            }contragents/${contragentId}/contracts`
        ).then((response) => {
            if (response?.status == 200) {
                setContracts(response.data);
            }
        });
    };

    // Обновление контрагента
    const updateData = (showMessage = true, data = cardDataCustom) => {
        // query = toast.loading("Обновление", {
        //     containerId: "toastContainer",
        //     draggable: true,
        //     position: window.innerWidth >= 1440 ? "bottom-right" : "top-right",
        // });

        postData("PATCH", `${URL}/${contragentId}`, data)
            .then((response) => {
                if (response?.ok && showMessage) {
                    // toast.dismiss(query);

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
            .catch(() => {
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

    const fetchData = async () => {
        setIsDataLoaded(false);

        try {
            const response = await getData(`${URL}/${contragentId}`, {
                Accept: "application/json",
            });

            if (response.status == 200) {
                setCardData(response.data);
                setCardDataCustom(response.data);
                setProjects(response.data.projects);

                await Promise.all([
                    getResponsiblePesons(),
                    getContracts(),
                    getContragentReports(),
                    getProjectsManagerReports(),
                ]);

                setIsDataLoaded(true);
            }
        } catch (error) {
            if (error && error.status === 404) {
                navigate("/not-found", {
                    state: {
                        message: "Заказчик не найден",
                        errorCode: 404,
                        additionalInfo: "",
                    },
                });
            }
        }
    };

    useEffect(() => {
        if (contragentId) {
            fetchData();
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
            setSelectedResponsiblePersons(responsiblePersons);
        }
    );

    useBodyScrollLock(activeWindow); // Блокируем экран при открытии попапа или редактора отчета

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
                className={`card contragent-card ${
                    mode.edit !== "full" ? "read-mode" : ""
                }`}
            >
                <div className="container card__container contragent-card__container">
                    <ToastContainer containerId="toastContainer" />

                    <div className="card__wrapper contragent-card__wrapper">
                        <section className="card__main-content contragent-card__main-content">
                            <div className="card__main-name">
                                <input
                                    type="text"
                                    name="program_name"
                                    value={cardDataCustom?.program_name || ""}
                                    onChange={(e) => {
                                        if (mode.edit !== "full") return;

                                        setCardDataCustom((prev) => ({
                                            ...prev,
                                            program_name: e.target.value,
                                        }));
                                    }}
                                    onBlur={() => {
                                        if (mode.edit !== "full") return;
                                        if (
                                            cardData?.program_name !=
                                            cardDataCustom?.program_name
                                        ) {
                                            updateData(true, {
                                                program_name:
                                                    cardDataCustom.program_name,
                                            });
                                        }
                                    }}
                                    disabled={mode.edit !== "full"}
                                />

                                <span
                                    className={`status status_new ${
                                        cardData?.status === "active"
                                            ? "active"
                                            : cardData?.status === "completed"
                                            ? "completed"
                                            : ""
                                    }`}
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
                                            mode.edit === "full"
                                                ? "Заполните описание"
                                                : ""
                                        }
                                        value={
                                            cardDataCustom?.description_short ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                description_short:
                                                    e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;
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
                                        disabled={mode.edit !== "full"}
                                    />
                                </div>

                                <div className="contragent-card__address">
                                    <div className="form-label">
                                        Адрес центрального офиса
                                    </div>

                                    <AutoResizeTextarea
                                        className="form-textarea"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Заполните адрес центрального офиса"
                                                : ""
                                        }
                                        minHeight={31}
                                        value={
                                            cardDataCustom?.head_office_address ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                head_office_address:
                                                    e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;
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
                                        disabled={mode.edit !== "full"}
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
                                            mode.edit === "full"
                                                ? "Введите адрес сайта компании"
                                                : ""
                                        }
                                        name="company_website"
                                        value={
                                            cardDataCustom?.company_website ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            if (mode.edit !== "full") return;
                                            setCardDataCustom((prev) => ({
                                                ...prev,
                                                company_website: e.target.value,
                                            }));
                                        }}
                                        onBlur={() => {
                                            if (mode.edit !== "full") return;
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
                                        disabled={mode.edit !== "full"}
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
                                        getProjectContact={getProjectContact}
                                    />
                                </div>
                            </section>

                            <section className="project-card__project-team">
                                <h2 className="card__subtitle">
                                    Ключевые лица
                                    <Hint message="Ключевые лица" />
                                </h2>

                                <div className="project-card__team">
                                    <ContragentResponsiblePersons
                                        teamData={
                                            selectedResponsiblePersons?.contacts
                                        }
                                    />
                                </div>
                            </section>
                        </section>

                        <section className="card__aside-content project-card__aside-content contragent-card__aside-content">
                            <div className="flex flex-col">
                                <div ref={block3Ref}>
                                    <ContragentStatisticBlock
                                        revenue={revenue}
                                        getRevenue={getRevenue}
                                        contragentId={contragentId}
                                        activeProject={activeProject}
                                        period={period}
                                        setPeriod={setPeriod}
                                    />
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
                                                    <span>
                                                        {selectedReports.length}
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
                                                            selectedManagerReports.length
                                                        }
                                                    </span>
                                                </label>
                                            </div>
                                        </nav>

                                        {activeReportTab ===
                                            "projectReports" && (
                                            <CardReportsList
                                                isDataLoaded={
                                                    isReportsDataLoaded
                                                }
                                                reports={selectedReports}
                                                openReportEditor={
                                                    openReportEditor
                                                }
                                            />
                                        )}

                                        {activeReportTab ===
                                            "managementReports" && (
                                            <CardManagementReportList
                                                showFullName={true}
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
                        mode={{
                            delete: "read",
                            edit: "read",
                            view: "read",
                        }}
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
                        <ContragentStatisticBlockMobile
                            revenue={revenue}
                            getRevenue={getRevenue}
                            contragentId={contragentId}
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
                                            <span>
                                                {selectedReports.length}
                                            </span>
                                        </label>
                                    </div>
                                    <div
                                        className="card__tabs-item radio-field_tab"
                                        onClick={() =>
                                            setActiveReportTab("projectReports")
                                        }
                                        aria-label="Открыть вкладку Отчёты ответственного"
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
                                            Отчёты ответственного
                                            <span>
                                                {selectedManagerReports.length}
                                            </span>
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

export default ContragentCard;
