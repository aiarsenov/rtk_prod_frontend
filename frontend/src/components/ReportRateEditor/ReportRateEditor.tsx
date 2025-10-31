import { useState, useEffect } from "react";

import RateSwitch from "../RateSwitch/RateSwitch";
import Popup from "../Popup/Popup";

import "./ReportRateEditor.scss";

type Props = {
    closeEditor: () => void;
    updateReportDetails?: (report: object, action: string) => void;
    rateEditorState: boolean;
    reportData: object;
    mode: string;
};

const RATE_LABELS = [
    { key: "bank_assessment", label: "Банк" },
    { key: "customer_assessment", label: "Заказчик" },
    { key: "team_assessment", label: "Команда" },
    { key: "contractor_assessment", label: "Подрядчики" },
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

    const rateHandler = (name: string, value: string | number) => {
        setReportRateData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (!isChanged) {
            setIsChanged(true);
        }
    };

    const resetState = () => {
        setSaveBeforeClose(false);
        setIsChanged(false);
        closeEditor();
    };

    useEffect(() => {
        if (reportData) {
            setReportRateData({ ...reportData });
        }
    }, [reportData]);

    return !saveBeforeClose ? (
        <div
            className={`bottom-sheet bottom-sheet_desk ${
                rateEditorState ? "active" : ""
            }`}
            onClick={() => resetState()}
        >
            <div
                className="bottom-sheet__wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet__icon"></div>

                <form className="bottom-sheet__body">
                    <div
                        className={`report-window report-rate-editor ${
                            mode === "read" && "report-rate-editor_read-mode"
                        }`}
                    >
                        <div className="report-window__wrapper">
                            <div className="report-window__header">
                                <div>
                                    <div className="report-window__name">
                                        {reportRateData.name}
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
                                    <label className="form-label">Статус</label>

                                    {reportRateData.status && (
                                        <div
                                            className={`form-field form-field__status ${
                                                reportRateData.status.toLowerCase() ===
                                                    "утверждён" ||
                                                reportRateData.status.toLowerCase() ===
                                                    "в процессе"
                                                    ? "form-field__status_completed"
                                                    : ""
                                            }`}
                                        >
                                            <span></span>
                                            {reportRateData.status}
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
                                            <div className="form-field form-field_static">
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
                                            mode === "edit" ? "Описание" : ""
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
                                        disabled={mode === "read"}
                                    ></textarea>
                                </div>
                            </div>

                            <div
                                className={`bottom-nav ${
                                    isChanged ? "" : "bottom-nav_disabled"
                                }`}
                            >
                                <div className="container">
                                    {mode === "edit" && (
                                        <>
                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={() => {
                                                    updateReportDetails(
                                                        reportRateData,
                                                        "save"
                                                    );
                                                    resetState();
                                                }}
                                                title="Сохранить без утверждения"
                                            >
                                                Сохранить без утверждения
                                            </button>

                                            <button
                                                type="button"
                                                className="action-button"
                                                onClick={() => {
                                                    updateReportDetails(
                                                        reportRateData,
                                                        "approve"
                                                    );
                                                    resetState();
                                                }}
                                                title="Сохранить и утвердить"
                                            >
                                                Сохранить и утвердить
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
                            updateReportDetails(reportRateData, "approve");
                            resetState();
                        }}
                        title="Сохранить изменения"
                    >
                        Сохранить изменения
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default ReportRateEditor;
