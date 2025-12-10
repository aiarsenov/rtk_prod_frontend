import { useState } from "react";

import AddButton from "../Buttons/AddButton";
import Popup from "../Popup/Popup";
import MultiSelect from "../MultiSelect/MultiSelect";

const CardMultiSelector = ({
    popupTitle,
    buttonLabel,
    buttonTitle,
    buttonClassName,
    options,
    selectedValues,
    onChange,
    submit,
    filedName,
    disabled,
}: {
    popupTitle?: string;
    buttonLabel?: string;
    buttonTitle?: string;
    buttonClassName?: string;
    filedName: string;
}) => {
    const [showWindow, setShowWindow] = useState(false);

    return (
        <div>
            {!disabled && (
                <AddButton
                    label={buttonLabel}
                    title={buttonTitle}
                    className={buttonClassName}
                    onClick={() => setShowWindow(true)}
                />
            )}

            {showWindow && (
                <Popup onClick={() => setShowWindow(false)} title={popupTitle}>
                    <div className="action-form__body">
                        <MultiSelect
                            options={options ?? []}
                            selectedValues={selectedValues ?? []}
                            onChange={onChange}
                            fieldName={filedName}
                        />
                    </div>

                    <div className="action-form__footer">
                        <button
                            type="button"
                            onClick={() => {
                                setShowWindow(false);
                                // setNewServices((prev) => ({
                                //     ...prev,
                                //     report_type_id: services.map(
                                //         (item) => item.id
                                //     ),
                                // }));
                            }}
                            className="cancel-button flex-[0_0_fit-content]"
                            title="Отменить добавление"
                        >
                            Отменить
                        </button>

                        <button
                            type="button"
                            className="action-button flex-[0_0_fit-content]"
                            onClick={() => {
                                submit();
                                setShowWindow(false);
                            }}
                            title="Применить добавление"
                            // disabled={
                            //     newServices.report_type_id &&
                            //     Object.keys(newServices.report_type_id)
                            //         .length == 0
                            // }
                        >
                            Добавить
                        </button>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default CardMultiSelector;
