import { useState, useEffect } from "react";

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
    const [selectedItems, setSelectedItems] = useState([]);
    const [initialValues, setInitialValues] = useState([]);

    useEffect(() => {
        if (options.length > 0) {
            setSelectedItems(
                options.filter((option) =>
                    selectedValues.includes(option.value)
                )
            );
        }
    }, [selectedValues, options]);

    return (
        <div className="flex flex-col gap-[10px] items-start">
            {selectedItems.length > 0 && (
                <ul className="flex items-center gap-[10px] flex-wrap">
                    {selectedItems.map((item) => (
                        <li className="form-field" key={item.value}>
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}

            {!disabled && (
                <AddButton
                    label={buttonLabel}
                    title={buttonTitle}
                    className={buttonClassName}
                    onClick={() => {
                        setInitialValues(selectedValues);
                        setShowWindow(true);
                    }}
                />
            )}

            {showWindow && !disabled && (
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
                                onChange({
                                    [filedName]: initialValues,
                                });

                                setShowWindow(false);
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
