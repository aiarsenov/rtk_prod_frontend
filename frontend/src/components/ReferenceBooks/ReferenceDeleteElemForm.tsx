import Popup from "../Popup/Popup";

const ReferenceDeleteElemForm = ({
    bookId,
    elemToDelete,
    resetElemPopupState,
    deleteContact,
    deleteContactElem,
    deleteElement,
    deleteLeadContact,
}) => {
    return (
        <Popup
            onClick={resetElemPopupState}
            title={
                bookId === "creditor" ||
                bookId === "contragent" ||
                bookId === "lead-contacts" ||
                bookId === "suppliers-with-reports"
                    ? "Удаление контакта"
                    : "Удаление записи"
            }
        >
            <form>
                <div className="action-form__body">
                    <p>Данные будут безвозвратно утеряны.</p>
                </div>

                <div className="action-form__footer">
                    <button
                        type="button"
                        onClick={resetElemPopupState}
                        className="cancel-button flex-[0_0_fit-content]"
                        title="Отменить удаление"
                    >
                        Отменить
                    </button>

                    <button
                        type="button"
                        className="action-button flex-[0_0_fit-content]"
                        onClick={() => {
                            if (
                                bookId === "creditor" ||
                                bookId === "contragent"
                            ) {
                                deleteContact(elemToDelete);
                            } else if (bookId === "suppliers-with-reports") {
                                deleteContactElem(elemToDelete);
                            } else if (bookId === "lead-contacts") {
                                deleteLeadContact(elemToDelete);
                            } else {
                                deleteElement(elemToDelete);
                            }
                        }}
                        title="Удалить запись"
                    >
                        Удалить
                    </button>
                </div>
            </form>
        </Popup>
    );
};

export default ReferenceDeleteElemForm;
