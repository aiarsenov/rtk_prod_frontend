import { useState, useEffect } from "react";

import { createDebounce } from "../../utils/debounce.js";

import Search from "../Search/Search";
import SelectList from "../MultiSelect/SelectList";

const SaleNewContragentWindow = ({
    setAddCustomer,
    contragents,
    updateCard,
    createNewContragent,
}) => {
    const [programName, setProgramName] = useState("");
    const [selectedContragent, setSelectedContragent] = useState(null);
    const [activeTab, setActiveTab] = useState("create");

    const [resultList, setResultList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        let filteredUsers = contragents;

        // Фильтрация по поисковому запросу
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();

            filteredUsers = contragents.filter((item) =>
                item.label?.toLowerCase().includes(query)
            );
        }

        if (filteredUsers.length > 0) {
            setResultList(filteredUsers);
        } else {
            setResultList([]);
        }
    }, [contragents, searchQuery]);

    const debouncedSearch = createDebounce(
        (event) => {
            setSearchQuery(event.value || "");
        },
        150,
        false
    );

    return (
        <div className="sale-new-contragent-window">
            <div className="action-form__body">
                <ul className="card__tabs executor-block__tabs">
                    <li className="card__tabs-item radio-field_tab">
                        <input
                            id="create"
                            type="radio"
                            checked={activeTab === "create"}
                            name="create"
                            onChange={() => setActiveTab("create")}
                        />
                        <label htmlFor="create">Создать</label>
                    </li>

                    <li className="card__tabs-item radio-field_tab">
                        <input
                            id="select"
                            type="radio"
                            name="select"
                            checked={activeTab === "select"}
                            onChange={() => setActiveTab("select")}
                        />
                        <label htmlFor="select">Выбрать из списка</label>
                    </li>
                </ul>

                {activeTab === "create" ? (
                    <input
                        className="form-field"
                        placeholder="Наименование заказчика"
                        value={programName}
                        type="text"
                        onChange={(e) => setProgramName(e.target.value)}
                    />
                ) : (
                    <>
                        <Search
                            placeholder="Поиск"
                            onSearch={debouncedSearch}
                        />

                        <SelectList
                            options={resultList}
                            onChange={(selected) => {
                                if (selected) {
                                    setSelectedContragent(selected.value);
                                } else {
                                    setSelectedContragent(null);
                                }
                            }}
                        />
                    </>
                )}
            </div>

            <div className="action-form__footer">
                <button
                    type="button"
                    className="cancel-button flex-[0_0_fit-content]"
                    onClick={() => setAddCustomer(false)}
                    title="Отменить добавление заказчика"
                >
                    Отменить
                </button>

                <button
                    type="button"
                    className="action-button flex-[0_0_fit-content]"
                    onClick={() => {
                        if (activeTab === "create") {
                            createNewContragent(programName);
                        } else {
                            updateCard(true, {
                                contragent_id: selectedContragent,
                            });
                        }

                        setAddCustomer(false);
                    }}
                    title="Добавить заказчика"
                    disabled={
                        (activeTab === "create" && programName.trim() === "") ||
                        (activeTab === "select" && selectedContragent === null)
                    }
                >
                    Добавить заказчика
                </button>
            </div>
        </div>
    );
};

export default SaleNewContragentWindow;
