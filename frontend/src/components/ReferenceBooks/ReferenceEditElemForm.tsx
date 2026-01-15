import Popup from "../Popup/Popup";
import { IMaskInput } from "react-imask";
import CreatableSelect from "react-select/creatable";

const PhoneMask = "+{7} (000) 000 00 00";

const ReferenceEditElemForm = ({
    bookId,
    popupFields,
    positions,
    resetElemPopupState,
    handlePopupFieldsChange,
    collectEditFieldsData,
    editLeadContact,
    editContragentAndCreditorContact,
    editContactElem,
    editWokrHours,
    editElement,
}) => {
    return (
        <Popup
            onClick={resetElemPopupState}
            title={
                bookId === "creditor" ||
                bookId === "contragent" ||
                bookId === "lead-contacts" ||
                bookId === "suppliers-with-reports"
                    ? "Редактирование контакта"
                    : "Редактирование записи"
            }
        >
            <form>
                <div className="action-form__body flex flex-col gap-[18px]">
                    {popupFields.length > 0 &&
                        popupFields.map(({ id, key, label, value }) => {
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
                                                    id,
                                                    key,
                                                    value
                                                );
                                            }}
                                            value={value?.toString() || ""}
                                            placeholder="Телефон"
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
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                handlePopupFieldsChange(
                                                    id,
                                                    key,
                                                    newValue
                                                );
                                            }}
                                        />
                                    </div>
                                );
                            } else if (
                                key === "type" ||
                                key === "position_id"
                            ) {
                                return (
                                    <div key={key} className="flex flex-col">
                                        <label
                                            htmlFor={key}
                                            className="form-label"
                                        >
                                            {label}
                                        </label>
                                        <CreatableSelect
                                            className="form-select-extend"
                                            placeholder="Выбрать"
                                            isValidNewOption={() => false}
                                            noOptionsMessage={() =>
                                                "Совпадений нет"
                                            }
                                            options={
                                                bookId ===
                                                "management-report-types"
                                                    ? positions.map(
                                                          (position) => ({
                                                              value: position.id,
                                                              label: position.name,
                                                          })
                                                      )
                                                    : [
                                                          {
                                                              value: "one_to_one",
                                                              label: "Один к одному",
                                                          },
                                                          {
                                                              value: "one_to_many",
                                                              label: "Один ко многим",
                                                          },
                                                      ]
                                            }
                                            value={(() => {
                                                const opts =
                                                    bookId ===
                                                    "management-report-types"
                                                        ? positions.map(
                                                              (p) => ({
                                                                  value: p.id,
                                                                  label: p.name,
                                                              })
                                                          )
                                                        : [
                                                              {
                                                                  value: "one_to_one",
                                                                  label: "Один к одному",
                                                              },
                                                              {
                                                                  value: "one_to_many",
                                                                  label: "Один ко многим",
                                                              },
                                                          ];
                                                return (
                                                    opts.find(
                                                        (opt) =>
                                                            opt.value === value
                                                    ) || null
                                                );
                                            })()}
                                            onChange={(selectedOption) => {
                                                const newValue =
                                                    selectedOption?.value || "";
                                                handlePopupFieldsChange(
                                                    id,
                                                    key,
                                                    newValue
                                                );
                                            }}
                                        />
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
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                handlePopupFieldsChange(
                                                    id,
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
                        title="Отменить изменения"
                    >
                        Отменить
                    </button>

                    <button
                        type="button"
                        className="action-button flex-[0_0_fit-content]"
                        onClick={() => {
                            const updatedData = collectEditFieldsData();

                            if (bookId === "lead-contacts") {
                                editLeadContact(updatedData);
                            } else if (
                                bookId === "creditor" ||
                                bookId === "contragent"
                            ) {
                                editContragentAndCreditorContact(updatedData);
                            } else if (bookId === "suppliers-with-reports") {
                                editContactElem(updatedData);
                            } else if (bookId === "working-hours") {
                                editWokrHours(updatedData);
                            } else {
                                editElement(updatedData);
                            }
                        }}
                        title="Сохранить изменения"
                    >
                        Сохранить
                    </button>
                </div>
            </form>
        </Popup>
    );
};

export default ReferenceEditElemForm;
