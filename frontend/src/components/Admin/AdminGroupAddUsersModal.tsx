import { useState, useEffect } from "react";

import { createDebounce } from "../../utils/debounce.js";

import Popup from "../Popup/Popup";
import Search from "../Search/Search";

const arraysAreDifferent = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return true;
    }

    const ids1 = new Set(arr1.map((item) => item.id));
    const ids2 = new Set(arr2.map((item) => item.id));

    return [...ids1].some((id) => !ids2.has(id));
};

const AdminGroupAddUsersModal = ({
    closeModal,
    allUsers,
    selectedGroup,
    handleAddGroupUsers,
}) => {
    const [selectedUsers, setSelectedUsers] = useState([]); // Список добавленных в группу пользователей
    const [resultList, setResultList] = useState([]); // Список отображаемых пользователей
    const [isDifferent, setIsDifferent] = useState(false); // Изменился ли список добавленных пользователей

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (selectedGroup && selectedGroup?.users?.length > 0) {
            setSelectedUsers(selectedGroup.users);
        }
    }, [selectedGroup]);

    useEffect(() => {
        let filteredUsers = allUsers;

        // Фильтрация по поисковому запросу
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filteredUsers = allUsers.filter(
                (user) =>
                    user.name?.toLowerCase().includes(query) ||
                    user.email?.toLowerCase().includes(query)
            );
        }

        // Исключение уже выбранных пользователей
        if (filteredUsers.length > 0 && selectedUsers.length > 0) {
            const existingUserIds = selectedUsers
                .map((user) => user?.id)
                .filter((id) => id != null);

            const availableUsers = filteredUsers.filter(
                (user) => !existingUserIds.includes(user.id)
            );

            setResultList(availableUsers);
        } else if (filteredUsers.length > 0) {
            setResultList(filteredUsers);
        } else {
            setResultList([]);
        }
    }, [allUsers, selectedUsers, searchQuery]);

    useEffect(() => {
        if (arraysAreDifferent(selectedGroup.users, selectedUsers)) {
            setIsDifferent(true);
        } else {
            setIsDifferent(false);
        }
    }, [selectedUsers]);

    const debouncedSearch = createDebounce(
        (event) => {
            setSearchQuery(event.value || "");
        },
        150,
        false
    );

    return (
        <Popup title="Добавить пользователей в группу" onClick={closeModal}>
            <div className="px-[30px] pt-[15px]">
                <Search
                    placeholder="Найти пользователя"
                    onSearch={debouncedSearch}
                />
            </div>

            <form className="admin-form">
                <div className="admin-form__users" style={{ paddingBottom: 0 }}>
                    <div className="multi-select__actions">
                        <button
                            className="multi-select__selectall-button"
                            type="button"
                            title="Выбрать всех пользователей"
                            onClick={() => {
                                if (allUsers.length === selectedUsers.length)
                                    return;

                                setSelectedUsers(allUsers);
                            }}
                        >
                            Выбрать все
                        </button>

                        {isDifferent && (
                            <button
                                className="multi-select__reset-button"
                                type="button"
                                title="Сбросить выбор"
                                onClick={() => {
                                    setSelectedUsers(selectedGroup.users);
                                }}
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
                        {resultList.length > 0 &&
                            resultList.map((item) => (
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
                                        onChange={() => {
                                            setSelectedUsers([
                                                ...selectedUsers,
                                                item,
                                            ]);
                                        }}
                                    />
                                </label>
                            ))}
                    </div>
                </div>

                <div
                    className="flex flex-col gap-[10px] h-[110px] overflow-y-auto px-[30px] py-2"
                    style={{
                        borderBottom: "1px solid var(--color-gray-30)",
                    }}
                >
                    {selectedUsers.length > 0 &&
                        selectedUsers.map((user) => (
                            <div key={user.id} className="user-tag w-fit">
                                {user.name || user.email}

                                <button
                                    onClick={() =>
                                        setSelectedUsers(
                                            selectedUsers.filter(
                                                (item) => item.id !== user.id
                                            )
                                        )
                                    }
                                    type="button"
                                    title="Удалить пользователя из списка"
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9.712 3.349L7.06 6l2.65 2.651-1.06 1.06L6 7.062 3.349 9.71l-1.06-1.06L4.938 6l-2.65-2.65 1.06-1.06 2.65 2.65 2.652-2.652 1.06 1.062z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
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
                    onClick={() =>
                        handleAddGroupUsers(
                            selectedUsers.map((item) => item.id)
                        )
                    }
                    disabled={selectedUsers.length <= 0}
                >
                    Сохранить
                </button>
            </div>
        </Popup>
    );
};

export default AdminGroupAddUsersModal;
