import { useState } from "react";

const ResumableStages = ({
    resumableStages,
    resumeSaleFunnel,
    setPopupState,
}) => {
    const [selectedStage, setSelectedStage] = useState(null);

    return (
        <>
            <div className="action-form__body">
                <p className="mb-[15px]">
                    Выберите этап для возобновления воронки продаж
                </p>

                {resumableStages.length > 0 && (
                    <ul className="multi-select-active">
                        {resumableStages.map((item) => (
                            <li
                                className="multi-select__list-item"
                                key={item.id}
                            >
                                <label className="form-radio" htmlFor={item.id}>
                                    <input
                                        type="radio"
                                        name="resumable_stage"
                                        checked={selectedStage == item.id}
                                        onChange={() => {
                                            setSelectedStage(item.id);
                                        }}
                                        id={item.id}
                                    />
                                    <span className="radio"></span>

                                    <span>{item.name}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="action-form__footer">
                <button
                    type="button"
                    onClick={() => setPopupState(false)}
                    className="cancel-button flex-[0_0_fit-content]"
                    title="Отменить возобновление воронки"
                >
                    Отменить
                </button>

                <button
                    type="button"
                    className="action-button flex-[0_0_fit-content]"
                    onClick={() => resumeSaleFunnel(selectedStage)}
                    title="Применить возобновление воронки"
                    disabled={!selectedStage}
                >
                    Применить
                </button>
            </div>
        </>
    );
};

export default ResumableStages;
