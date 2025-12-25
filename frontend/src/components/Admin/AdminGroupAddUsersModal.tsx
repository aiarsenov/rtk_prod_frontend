import { useState } from "react";

import Popup from "../Popup/Popup";

const AdminGroupAddUsersModal = ({
    closeModal,
    allUsers,
    selectedGroup,
    handleAddGroupUsers,
}) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    return (
        <Popup title="Добавить пользователей в группу" onClick={closeModal}>
            <form className="admin-form">
                <div className="admin-form__users">
                    <div className="multi-select__actions">
                        <button
                            className="multi-select__selectall-button"
                            type="button"
                            title="Выбрать всех пользователей"
                            onClick={() => {
                                if (allUsers.length === selectedUsers.length)
                                    return;

                                // setSelectedEmployees(
                                //     availableEmployees.map((item) => ({
                                //         physical_person_id: item.id,
                                //         email: item.email,
                                //         resend: false,
                                //     }))
                                // );
                            }}
                        >
                            Выбрать все
                        </button>

                        {selectedUsers.length > 0 && (
                            <button
                                className="multi-select__reset-button"
                                type="button"
                                title="Сбросить выбор"
                                onClick={() => setSelectedUsers([])}
                            >
                                <span>
                                    <svg
                                        width="12"
                                        height="13"
                                        viewBox="0 0 12 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M7.06 6.5l2.652 2.652-1.06 1.06L6 7.561l-2.652 2.651-1.06-1.06L4.939 6.5 2.288 3.848l1.06-1.06L6 5.439l2.652-2.651 1.06 1.06L7.061 6.5z"
                                            fill="#0078D2"
                                        ></path>
                                    </svg>
                                </span>
                                Сбросить
                            </button>
                        )}
                    </div>

                    <div className="admin-form__users-list">
                        {allUsers.length > 0 &&
                            allUsers.map((item) => (
                                <label
                                    className="form-checkbox"
                                    key={item.id}
                                    htmlFor={item.id}
                                >
                                    <div>
                                        {item.name}
                                        <span>{item.email}</span>
                                    </div>

                                    <input
                                        type="checkbox"
                                        name={item.name}
                                        id={item.id}
                                        // checked={selectedEmployees.some(
                                        //     (emp) =>
                                        //         emp.physical_person_id ===
                                        //         item.id
                                        // )}
                                        // onChange={(e) => {
                                        //     const checked = e.target.checked;

                                        //     setSelectedEmployees((prev) => {
                                        //         if (checked) {
                                        //             const exists = prev.some(
                                        //                 (emp) =>
                                        //                     emp.physical_person_id ===
                                        //                     item.id
                                        //             );

                                        //             if (exists) return prev;

                                        //             return [
                                        //                 ...prev,
                                        //                 {
                                        //                     physical_person_id:
                                        //                         item.id,
                                        //                     email: item.email,
                                        //                     resend: false,
                                        //                 },
                                        //             ];
                                        //         }

                                        //         return prev.filter(
                                        //             (emp) =>
                                        //                 emp.physical_person_id !==
                                        //                 item.id
                                        //         );
                                        //     });
                                        // }}
                                    />
                                    <div className="checkbox"></div>
                                </label>
                            ))}
                    </div>

                    <div className="admin-group-card__users">
                        {selectedUsers.length > 0 && (
                            <div className="user-list">
                                {selectedUsers.map((user) => (
                                    <div key={user.id} className="user-tag">
                                        {user.name || user.email}

                                        <button
                                        // onClick={() =>
                                        //     handleRemoveUser(
                                        //         item.id,
                                        //         user.id
                                        //     )
                                        // }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </form>

            <div className="action-form__footer">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={closeModal}
                    title="Отменить изменения"
                >
                    Отмена
                </button>

                <button
                    type="button"
                    className="action-button"
                    title="Сохранить изменения"
                    onClick={handleAddGroupUsers}
                    disabled={selectedUsers.length <= 0}
                >
                    Сохранить
                </button>
            </div>
        </Popup>
    );
};

export default AdminGroupAddUsersModal;
