import Popup from "../Popup/Popup";
import { IMaskInput } from "react-imask";
import CreatableSelect from "react-select/creatable";

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
                    : bookId === "management-report-types"
                    ? "Создать тип отчёта"
                    : "Создать запись"
            }
        >
            <form>
                <div className="action-form__body flex flex-col gap-[18px]">
                    {bookId === "management-report-types" && (
                        <p className="text-sm text-gray-600">
                            Созданный тип отчёта начнёт генерироваться начиная с
                            текущего месяца. Первая генерация будет произведена
                            в 00:00 первого числа следующего месяца.
                        </p>
                    )}
                    {popupFields.length > 0 &&
                        popupFields.map(({ key, label, value }) => {
                            if (key === "phone") {
                                return (
                                    <div key={key} className="flex flex-col">
                                        {bookId !==
                                            "suppliers-with-reports" && (
                                            <label
                                                htmlFor={key}
                                                className="form-label"
                                            >
                                                {label}
                                            </label>
                                        )}
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
                                                    : bookId ===
                                                      "suppliers-with-reports"
                                                    ? booksItems.map(
                                                          (item) => ({
                                                              value: item.id,
                                                              label: item.name,
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
                                                        : bookId ===
                                                          "suppliers-with-reports"
                                                        ? booksItems.map(
                                                              (i) => ({
                                                                  value: i.id,
                                                                  label: i.name,
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
                                                    null,
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
                                        {bookId !==
                                            "suppliers-with-reports" && (
                                            <label
                                                htmlFor={key}
                                                className="form-label"
                                            >
                                                {label}
                                            </label>
                                        )}
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
