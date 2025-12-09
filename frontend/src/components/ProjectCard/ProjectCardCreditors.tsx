import { useState, useEffect } from "react";

import ExecutorBlock from "../ExecutorBlock/ExecutorBlock";
import EmptyExecutorBlock from "../ExecutorBlock/EmptyExecutorBlock";

const ProjectCardCreditors = ({
    mode,
    availableToChange,
    banks,
    creditors,
    filteredCreditors,
    setFilteredCreditors,
    openExecutorDeletePopup,
    addCreditor,
    setAddCreditor,
    projectId,
    sendExecutor,
}) => {
    const [matchedBanks, setMatchedBanks] = useState([]); // Закрепленные за карточкой банки для отображения вкладок
    const [activeBankId, setActiveBankId] = useState(null); // Выбранный банк

    useEffect(() => {
        setMatchedBanks(
            banks.filter((bank) =>
                creditors.some(
                    (item) => Number(item.creditor_id) === Number(bank.id)
                )
            )
        );
    }, [creditors, banks]);

    useEffect(() => {
        if (matchedBanks.length === 0) {
            setActiveBankId(null);
            setFilteredCreditors([]);
            return;
        }

        const exists = matchedBanks.some(
            (b) => Number(b.id) === Number(activeBankId)
        );
        if (!exists) {
            setActiveBankId(matchedBanks[0].id);
        }
    }, [matchedBanks]);

    useEffect(() => {
        if (!activeBankId) {
            setFilteredCreditors([]);
            return;
        }

        setFilteredCreditors(
            creditors.filter(
                (creditor) =>
                    Number(creditor.creditor_id) === Number(activeBankId)
            )
        );
    }, [activeBankId, creditors]);

    return (
        <section className="project-card__project-executors">
            <h2 className="card__subtitle">Кредиторы</h2>

            {matchedBanks.length > 0 && (
                <ul className="card__tabs project-card__banks-tabs">
                    {matchedBanks.map((bank) => (
                        <li
                            key={bank.id}
                            className="card__tabs-item radio-field_tab"
                        >
                            <input
                                id={`bank_${bank.id}`}
                                type="radio"
                                name="active_bank"
                                value={bank.id}
                                checked={activeBankId === bank.id}
                                onChange={() => setActiveBankId(bank.id)}
                            />

                            <label htmlFor={`bank_${bank.id}`}>
                                {bank.name}
                            </label>
                        </li>
                    ))}
                </ul>
            )}

            <ul className="project-card__executors-list">
                {filteredCreditors.length > 0 && banks.length > 0 ? (
                    filteredCreditors.map((lender) => (
                        <ExecutorBlock
                            key={lender.id}
                            contanct={lender}
                            mode={mode}
                            banks={banks}
                            type={"creditor"}
                            deleteBlock={openExecutorDeletePopup}
                        />
                    ))
                ) : (
                    <li>
                        <p>Нет данных</p>
                    </li>
                )}
            </ul>

            {mode == "edit" && availableToChange && (
                <button
                    type="button"
                    className="button-add"
                    onClick={() => {
                        if (!addCreditor) {
                            setAddCreditor(true);
                        }
                    }}
                    title="Добавить Кредитора"
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

            {addCreditor && (
                <EmptyExecutorBlock
                    projectId={projectId}
                    banks={banks}
                    type={"creditor"}
                    removeBlock={() => setAddCreditor(false)}
                    sendExecutor={sendExecutor}
                />
            )}
        </section>
    );
};

export default ProjectCardCreditors;
