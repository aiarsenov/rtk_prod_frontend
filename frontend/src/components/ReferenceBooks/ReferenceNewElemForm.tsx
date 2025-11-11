import Popup from "../Popup/Popup";

import { IMaskInput } from "react-imask";

const PhoneMask = "+{7} (000) 000 00 00";

const ReferenceNewElemForm = ({
    bookId,
    popupFields,
    positions,
    resetElemPopupState,
    handlePopupFieldsChange,
    addNewElement,
    booksItems,
}) => {
    return (
        <Popup
            onClick={resetElemPopupState}
            title={
                bookId === "creditor" ||
                bookId === "contragent" ||
                bookId === "suppliers-with-reports"
                    ? "Создать контакт"
                    : "Создать запись"
            }
        >
            <form>
                <div className="action-form__body flex flex-col gap-[18px]">
                    {/* {bookId === "suppliers-with-reports" && (
                        <div className="flex flex-col">
                            <label
                                htmlFor="contragent_id"
                                className="form-label"
                            >
                                Наименование подрядчика
                            </label>
                            <select
                                id="contragent_id"
                                className="form-select"
                                value={+popupFields?.contragent_id?.value || ""}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    handlePopupFieldsChange(
                                        null,
                                        "contragent_id",
                                        newValue
                                    );
                                }}
                            >
                                <option value="">Выбрать</option>

                                {booksItems.map((item) => (
                                    <option value={item.id} key={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )} */}

                    {popupFields.length > 0 &&
                        popupFields.map(({ key, label, value }) => {
                            if (key === "phone") {
                                return (
                                    <div key={key} className="flex flex-col">
                                        <label
                                            htmlFor={key}
                                            className="form-label"
                                        >
                                            {label}
                                        </label>
                                        <IMaskInput
                                            mask={PhoneMask}
                                            className="form-field w-full"
                                            name="phone"
                                            type="tel"
                                            inputMode="tel"
                                            onAccept={(value) => {
                                                handlePopupFieldsChange(
                                                    null,
                                                    key,
                                                    value
                                                );
                                            }}
                                            value={value?.toString() || ""}
                                            placeholder={label}
                                        />
                                    </div>
                                );
                            } else if (key === "hours") {
                                return (
                                    <div key={key} className="flex flex-col">
                                        <label
                                            htmlFor={key}
                                            className="form-label"
                                        >
                                            {label}
                                        </label>
                                        <input
                                            id={key}
                                            type="number"
                                            className="form-field"
                                            value={value?.toString() || ""}
                                            placeholder={label}
                                            onChange={(e) => {
                                                const newValue = e.target.value;

                                                handlePopupFieldsChange(
                                                    null,
                                                    key,
                                                    newValue
                                                );
                                            }}
                                        />
                                    </div>
                                );
                            } else if (
                                key === "type" ||
                                key === "position_id" ||
                                (bookId === "suppliers-with-reports" &&
                                    key === "contragent_id")
                            ) {
                                return (
                                    <div key={key} className="flex flex-col">
                                        <label
                                            htmlFor={key}
                                            className="form-label"
                                        >
                                            {label}
                                        </label>
                                        <select
                                            id={key}
                                            className="form-select"
                                            value={value || ""}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                handlePopupFieldsChange(
                                                    null,
                                                    key,
                                                    newValue
                                                );
                                            }}
                                        >
                                            <option value="">Выбрать</option>
                                            {(() => {
                                                if (
                                                    bookId ===
                                                    "management-report-types"
                                                ) {
                                                    return positions.map(
                                                        (position) => (
                                                            <option
                                                                value={
                                                                    position.id
                                                                }
                                                                key={
                                                                    position.id
                                                                }
                                                            >
                                                                {position.name}
                                                            </option>
                                                        )
                                                    );
                                                }

                                                if (
                                                    bookId ===
                                                    "suppliers-with-reports"
                                                ) {
                                                    return booksItems.map(
                                                        (item) => (
                                                            <option
                                                                value={item.id}
                                                                key={item.id}
                                                            >
                                                                {item.name}
                                                            </option>
                                                        )
                                                    );
                                                }

                                                return (
                                                    <>
                                                        <option value="one_to_one">
                                                            Один к одному
                                                        </option>
                                                        <option value="one_to_many">
                                                            Один ко многим
                                                        </option>
                                                    </>
                                                );
                                            })()}
                                        </select>
                                    </div>
                                );
                            } else if (
                                key === "full_name" &&
                                bookId === "report-types"
                            ) {
                                return;
                            } else {
                                return (
                                    <div key={key} className="flex flex-col">
                                        <label
                                            htmlFor={key}
                                            className="form-label"
                                        >
                                            {label}
                                        </label>
                                        <input
                                            id={key}
                                            type="text"
                                            className="form-field"
                                            value={value?.toString() || ""}
                                            placeholder={label}
                                            onChange={(e) => {
                                                const newValue = e.target.value;

                                                handlePopupFieldsChange(
                                                    null,
                                                    key,
                                                    newValue
                                                );
                                            }}
                                        />
                                    </div>
                                );
                            }
                        })}
                </div>

                <div className="action-form__footer">
                    <button
                        type="button"
                        onClick={resetElemPopupState}
                        className="cancel-button flex-[0_0_fit-content]"
                        title="Отменить создание записи"
                    >
                        Отменить
                    </button>

                    <button
                        type="button"
                        className="action-button flex-[0_0_fit-content]"
                        onClick={addNewElement}
                        title="Создать запись"
                    >
                        Создать
                    </button>
                </div>
            </form>
        </Popup>
    );
};

export default ReferenceNewElemForm;
