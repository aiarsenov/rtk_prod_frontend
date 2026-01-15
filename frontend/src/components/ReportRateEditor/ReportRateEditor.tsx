import { useState, useEffect, useRef, useCallback } from "react";

import { useBodyScrollLock } from "../../hooks/useBodyScrollLock.js";
import { toast, ToastContainer } from "react-toastify";

import RateSwitch from "../RateSwitch/RateSwitch";
import Popup from "../Popup/Popup";

import "./ReportRateEditor.scss";

type Props = {
    closeEditor: () => void;
    updateReportDetails?: (report: object, action: string) => void;
    rateEditorState: boolean;
    reportData: object;
    mode: object;
};

const RATE_LABELS = [
    { key: "bank_assessment", label: "Банк" },
    { key: "customer_assessment", label: "Заказчик" },
    { key: "team_assessment", label: "Команда" },
    { key: "contractor_assessment", label: "Подрядчики" },
];

const ACTIVE_FILEDS = [
    "general_summary",
    "bank_assessment",
    "customer_assessment",
    "team_assessment",
    "contractor_assessment",
    "general_assessment",
];

const ReportRateEditor = ({
    closeEditor,
    updateReportDetails,
    rateEditorState,
    reportData,
    mode,
}: Props) => {
    const [reportRateData, setReportRateData] = useState<object>(reportData);
    const [saveBeforeClose, setSaveBeforeClose] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [canApprove, setCanApprove] = useState(false);

    const rateHandler = (name: string, value: string | number) => {
        setReportRateData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (!isChanged) {
            setShowApprove(false);
            setIsChanged(true);
        }
    };

    const resetState = useCallback(() => {
        setReportRateData({});
        setSaveBeforeClose(false);
        setIsChanged(false);
        setShowApprove(false);
        closeEditor();
    }, [closeEditor]);

    // Если общая оценка красная или желтая - выводим ошибку вылидации
    const handleSave = (type, isPopup = false) => {
        if (
            reportRateData.general_assessment != null &&
            (reportRateData.general_assessment === 0 ||
                reportRateData.general_assessment === 1) &&
            !reportRateData.general_summary
        ) {
            if (isPopup) {
                setSaveBeforeClose(false);

                setTimeout(() => {
                    toast.error("Добавьте заключение", {
                        position:
                            window.innerWidth >= 1440
                                ? "bottom-right"
                                : "top-right",
                        autoClose: 2500,
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                        draggable: true,
                        containerId: "toastContainerRate",
                    });
                }, 250);
            } else {
                toast.error("Добавьте заключение", {
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                    autoClose: 2500,
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                    draggable: true,
                    containerId: "toastContainerRate",
                });
            }
        } else {
            updateReportDetails(reportRateData, type).then(() => {
                resetState();
            });
        }
    };

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (reportData) {
            setReportRateData({ ...reportData });
        }

        if (reportData.show_save_bar) {
            setIsChanged(true);
        }

        // Если отчет не утвержден, но в нем есть изменения - отображаем только кнопку Утвердить
        if (
            !reportData.show_save_bar &&
            reportData.status &&
            reportData?.status?.toLowerCase() !== "утверждён" &&
            !isChanged
        ) {
            ACTIVE_FILEDS.forEach((item) => {
                if (reportData[item] != null) {
                    setShowApprove(true);
                    return;
                }
            });
        }
    }, [reportData]);

    // Если Общая оценка не выбрана - утвердить отчет нельзя
    useEffect(() => {
        if (reportRateData.general_assessment != null) {
            setCanApprove(true);
        } else {
            setCanApprove(false);
        }
    }, [reportRateData]);

    useBodyScrollLock(rateEditorState);

    // Обработчик ESC для закрытия панели детализации отчета
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (
                (event.key === "Escape" || event.keyCode === 27) &&
                rateEditorState &&
                !saveBeforeClose
            ) {
                event.preventDefault();
                event.stopPropagation();
                resetState();
            }
        };

        if (rateEditorState) {
            window.addEventListener("keydown", handleEscKey, true);
            // Устанавливаем фокус на форму для обработки событий клавиатуры
            setTimeout(() => {
                formRef.current?.focus();
            }, 100);
        }

        return () => {
            window.removeEventListener("keydown", handleEscKey, true);
        };
    }, [rateEditorState, saveBeforeClose, resetState]);

    return !saveBeforeClose ? (
        <div
            className={`bottom-sheet bottom-sheet_desk ${
                rateEditorState ? "active" : ""
            }`}
            onClick={() => {
                if (isChanged) {
                    setSaveBeforeClose(true);
                } else {
                    resetState();
                }
            }}
        >
            <ToastContainer containerId="toastContainerRate" />

            <div
                className="bottom-sheet__wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet__icon"></div>

                <form
                    ref={formRef}
                    className="bottom-sheet__body"
                    tabIndex={-1}
                    onKeyDown={(e) => {
                        if (
                            (e.key === "Escape" || e.key === 27) &&
                            rateEditorState &&
                            !saveBeforeClose
                        ) {
                            e.preventDefault();
                            e.stopPropagation();
                            resetState();
                        }
                    }}
                >
                    <div
                        className={`report-window report-rate-editor ${
                            mode.edit !== "full" &&
                            "report-rate-editor_read-mode"
                        }`}
                    >
                        <div className="report-window__wrapper">
                            <div className="report-window__header">
                                <div>
                                    <div className="report-window__name">
                                        {reportRateData.name} /{" "}
                                        {reportRateData.report_month}
                                    </div>

                                    {reportRateData.misc?.length > 0 && (
                                        <ul className="misc-list">
                                            {reportRateData.misc?.map(
                                                (item, index) => (
                                                    <li
                                                        className="misc-list__item"
                                                        key={index}
                                                    >
                                                        {item}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isChanged) {
                                            setSaveBeforeClose(true);
                                        } else {
                                            resetState();
                                        }
                                    }}
                                    className="report-window__close-btn"
                                    title="Закрыть отчёт"
                                ></button>
                            </div>

                            <div className="report-window__body">
                                <div className="report-window__field">
                                    <label className="form-label">
                                        Ответственный
                                    </label>

                                    <div className="form-field form-field__text">
                                        {reportRateData.physical_person?.name}
                                    </div>
                                </div>

                                <div className="report-window__field">
                                    <label className="form-label">
                                        Роль ответственного
                                    </label>

                                    {reportRateData.physical_person?.roles &&
                                        reportRateData.physical_person?.roles
                                            .length > 0 &&
                                        reportRateData.physical_person?.roles.map(
                                            (item) => (
                                                <div
                                                    className="form-field form-field__text mt-[10px]"
                                                    key={item.id}
                                                >
                                                    {item.name}
                                                </div>
                                            )
                                        )}
                                </div>

                                <div className="report-window__field">
                                    <label className="form-label">Статус</label>

                                    {reportRateData.status && (
                                        <div
                                            className={`form-field form-field__status ${
                                                reportRateData.status.toLowerCase() ===
                                                "утверждён"
                                                    ? "form-field__status_completed"
                                                    : reportRateData.status.toLowerCase() ===
                                                          "в работе" ||
                                                      isChanged
                                                    ? "form-field__status_progress"
                                                    : ""
                                            }`}
                                        >
                                            <span></span>
                                            {isChanged
                                                ? "В работе"
                                                : reportRateData.status}
                                        </div>
                                    )}
                                </div>

                                <div className="report-window__block">
                                    <b className="report-window__subtitle">
                                        Оценка
                                    </b>

                                    <div className="report-rate-editor__rate-block">
                                        <div className="report-window__field border-b border-[#E4E7EC] pb-[10px]">
                                            <div className="form-field form-field_static">
                                                Общая
                                                <RateSwitch
                                                    name={"general_assessment"}
                                                    rateHandler={rateHandler}
                                                    reportRateData={
                                                        reportRateData
                                                    }
                                                    mode={mode}
                                                />
                                            </div>
                                        </div>

                                        {RATE_LABELS.map((item) => (
                                            <div
                                                className="form-field form-field_static"
                                                key={item.key}
                                            >
                                                {item.label}

                                                <RateSwitch
                                                    name={item.key}
                                                    rateHandler={rateHandler}
                                                    reportRateData={
                                                        reportRateData
                                                    }
                                                    mode={mode}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="report-window__block">
                                    <b className="report-window__subtitle">
                                        Заключение
                                    </b>

                                    <textarea
                                        className="form-textarea h-[150px]"
                                        placeholder={
                                            mode.edit === "full"
                                                ? "Описание"
                                                : ""
                                        }
                                        style={{ resize: "none" }}
                                        value={
                                            reportRateData.general_summary || ""
                                        }
                                        onChange={(evt) =>
                                            rateHandler(
                                                "general_summary",
                                                evt.target.value
                                            )
                                        }
                                        disabled={mode.edit !== "full"}
                                    ></textarea>
                                </div>
                            </div>

                            <div
                                className={`bottom-nav ${
                                    isChanged || showApprove
                                        ? ""
                                        : "bottom-nav_disabled"
                                }`}
                            >
                                <div className="container">
                                    {mode.edit === "full" && (
                                        <>
                                            {!showApprove && isChanged && (
                                                <button
                                                    type="button"
                                                    className="cancel-button"
                                                    onClick={() => {
                                                        handleSave("save");
                                                    }}
                                                    title="Сохранить без утверждения"
                                                >
                                                    Сохранить без утверждения
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="action-button"
                                                onClick={() => {
                                                    handleSave("approve");
                                                }}
                                                title={
                                                    showApprove
                                                        ? "Утвердить"
                                                        : "Сохранить и утвердить"
                                                }
                                                disabled={!canApprove}
                                            >
                                                {showApprove
                                                    ? "Утвердить"
                                                    : "Сохранить и утвердить"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <Popup
            className="report-window-popup"
            onClick={() => resetState()}
            title={"Вы покидаете страницу"}
        >
            <div className="action-form__body">
                <p>
                    Если не сохранить изменения, новые данные будут безвозвратно
                    утеряны.
                </p>
            </div>

            <div className="action-form__footer">
                <div
                    className="report-window-alert__actions"
                    style={{ maxWidth: "100%" }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            resetState();
                        }}
                        className="cancel-button"
                        title="Не сохранять"
                    >
                        Не сохранять
                    </button>

                    <button
                        type="button"
                        className="action-button"
                        onClick={() => {
                            handleSave("approve", true);
                        }}
                        title="Сохранить изменения"
                        disabled={!canApprove}
                    >
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default ReportRateEditor;
