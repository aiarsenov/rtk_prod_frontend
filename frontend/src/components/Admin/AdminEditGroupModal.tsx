import Popup from "../Popup/Popup";

const AdminEditGroupModal = ({
    setShowEditModal,
    handleUpdateGroup,
    setEditGroupName,
    editGroupName,
    editGroupDescription,
    setEditGroupDescription,
}) => {
    return (
        <Popup
            onClick={() => {
                setShowEditModal(false);
            }}
            title="Редактировать группу"
        >
            <form className="action-form__body" onSubmit={handleUpdateGroup}>
                <div className="admin-form__group">
                    <label className="form-label">Название</label>
                    <input
                        type="text"
                        className="form-field"
                        value={editGroupName}
                        onChange={(e) => setEditGroupName(e.target.value)}
                    />
                </div>

                <div className="admin-form__group">
                    <label className="form-label">Описание</label>
                    <textarea
                        className="border-2 border-gray-300 py-4 px-5 resize-none form-textarea h-[110px] max-h-[110px]"
                        value={editGroupDescription}
                        onChange={(e) =>
                            setEditGroupDescription(e.target.value)
                        }
                    />
                </div>
            </form>

            <div className="action-form__footer">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowEditModal(false)}
                    title="Отменить редактирование группы"
                >
                    Отмена
                </button>

                <button
                    type="button"
                    className="action-button"
                    title="Подтвердить изменение группы"
                    onClick={handleUpdateGroup}
                    disabled={editGroupName.length < 2}
                >
                    Подтвердить
                </button>
            </div>
        </Popup>
    );
};

export default AdminEditGroupModal;
