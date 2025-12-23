import { useState } from "react";

import { toast } from "react-toastify";
import postData from "../../utils/postData";

import Popup from "../Popup/Popup";

const AdminCreateGroupModal = ({ setShowCreateModal, loadGroups }) => {
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDescription, setNewGroupDescription] = useState("");

    const handleCreateGroup = async (e) => {
        try {
            await postData(
                "POST",
                `${import.meta.env.VITE_API_URL}admin/permission-groups`,
                {
                    name: newGroupName,
                    description: newGroupDescription,
                }
            );

            setShowCreateModal(false);
            setNewGroupName("");
            setNewGroupDescription("");
            loadGroups();
        } catch (err) {
            toast.error(err.message || "Ошибка создания группы", {
                isLoading: false,
                autoClose: 3000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
        }
    };

    return (
        <Popup
            onClick={() => setShowCreateModal(false)}
            title="Добавить группу"
        >
            <form className="action-form__body">
                <div className="admin-form__group">
                    <label className="form-label">Название</label>
                    <input
                        type="text"
                        className="form-field"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                </div>

                <div className="admin-form__group">
                    <label className="form-label">Описание</label>
                    <textarea
                        className="border-2 border-gray-300 py-4 px-5 resize-none form-textarea h-[110px] max-h-[110px]"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                    />
                </div>
            </form>

            <div className="action-form__footer">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowCreateModal(false)}
                    title="Отменить добавление группы"
                >
                    Отмена
                </button>

                <button
                    type="button"
                    className="action-button"
                    title="Добавить группу"
                    onClick={handleCreateGroup}
                    disabled={newGroupName.length < 2}
                >
                    Добавить
                </button>
            </div>
        </Popup>
    );
};

export default AdminCreateGroupModal;
