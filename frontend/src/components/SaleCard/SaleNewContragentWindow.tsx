import { useState, useEffect } from "react";

import { createDebounce } from "../../utils/debounce.js";

import getData from "../../utils/getData";
import postData from "../../utils/postData";

import Search from "../Search/Search";
import SelectList from "../MultiSelect/SelectList";
import Loader from "../Loader.js";

const SaleNewContragentWindow = ({ setAddCustomer, updateCard }) => {
    const [programName, setProgramName] = useState("");
    const [selectedContragent, setSelectedContragent] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("create");
    const [activeSubTab, setActiveSubTab] = useState("leads");
    const [activeList, setActiveList] = useState([]);

    const [resultList, setResultList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [contragents, setContragents] = useState([]); // Заказчики
    const [leads, setLeads] = useState([]); // Лиды

    // Создание нового заказчика
    const createNewContragent = (name) => {
        postData("POST", `${import.meta.env.VITE_API_URL}leads`, {
            name,
        }).then((response) => {
            if (response?.ok) {
                updateCard(true, {
                    contragent: { id: response.id, is_lead: true },
                });
            }
        });
    };

    // Получение заказчика
    const fetchContragents = () => {
        return getData(`${import.meta.env.VITE_API_URL}contragents?all=true`, {
            Accept: "application/json",
        }).then((response) => {
            if (response?.status == 200) {
                if (response.data.length > 0) {
                    setContragents(
                        response.data.map((item) => ({
                            value: item.id,
                            label: item.program_name,
                        }))
                    );
                }
            }
        });
    };

    // Получение лидов
    const fetchLeads = () => {
        return getData(`${import.meta.env.VITE_API_URL}leads`).then(
            (response) => {
                if (response?.status == 200) {
                    if (response.data.data.length > 0) {
                        setLeads(
                            response.data.data.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))
                        );
                    }
                }
            }
        );
    };

    useEffect(() => {
        activeSubTab === "leads"
            ? setActiveList(leads)
            : setActiveList(contragents);
    }, [activeSubTab, contragents, leads]);

    useEffect(() => {
        let filteredUsers = activeList;

        // Фильтрация по поисковому запросу
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();

            filteredUsers = activeList.filter((item) =>
                item.label?.toLowerCase().includes(query)
            );
        }

        if (filteredUsers.length > 0) {
            setResultList(filteredUsers);
        } else {
            setResultList([]);
        }
    }, [activeList, searchQuery]);

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchContragents(), fetchLeads()]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

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
                ) : isLoading ? (
                    <div className="relative min-h-[300px]">
                        <Loader absolute={true} />
                    </div>
                ) : (
                    <>
                        <ul className="card__tabs executor-block__tabs mt-[-10px]">
                            <li className="card__tabs-item radio-field_tab">
                                <input
                                    id="leads"
                                    type="radio"
                                    checked={activeSubTab === "leads"}
                                    name="leads"
                                    onChange={() => setActiveSubTab("leads")}
                                />
                                <label htmlFor="leads">Лиды</label>
                            </li>

                            <li className="card__tabs-item radio-field_tab">
                                <input
                                    id="contragents"
                                    type="radio"
                                    name="contragents"
                                    checked={activeSubTab === "contragents"}
                                    onChange={() =>
                                        setActiveSubTab("contragents")
                                    }
                                />
                                <label htmlFor="contragents">Заказчики</label>
                            </li>
                        </ul>

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
                            const data =
                                activeSubTab === "leads"
                                    ? {
                                          id: selectedContragent,
                                          is_lead: true,
                                      }
                                    : {
                                          id: selectedContragent,
                                          is_lead: false,
                                      };

                            updateCard(true, {
                                contragent: data,
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
