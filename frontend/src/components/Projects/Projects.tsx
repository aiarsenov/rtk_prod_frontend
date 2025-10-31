import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import getData from "../../utils/getData";
import postData from "../../utils/postData";
import handleStatus from "../../utils/handleStatus";
import { sortList } from "../../utils/sortList";

import ProjectItem from "./ProjectItem";
import Popup from "../Popup/Popup";

import TheadSortButton from "../TheadSortButton/TheadSortButton";
import MultiSelectWithSearch from "../MultiSelect/MultiSelectWithSearch";
import FilterButton from "../FilterButton";
import OverlayTransparent from "../Overlay/OverlayTransparent";

import Loader from "../Loader";

const Projects = () => {
    const URL = `${import.meta.env.VITE_API_URL}projects`;
    const navigate = useNavigate();

    const [mode, setMode] = useState("edit");
    const [sortBy, setSortBy] = useState({ key: "", action: "" });

    const [isLoading, setIsLoading] = useState(true);
    const [popupState, setPopupState] = useState(false);

    const [list, setList] = useState([]);
    const [sortedList, setSortedList] = useState([]);

    const [newProjectName, setNewProjectName] = useState("");
    const [openFilter, setOpenFilter] = useState("");

    // Заполняем параметры фильтров
    const nameOptions = useMemo(() => {
        const allNames = list
            .map((item) => item.name)
            .filter((name) => name !== null);

        return Array.from(new Set(allNames));
    }, [list]);

    // Заполняем селектор заказчиков
    const contragentOptions = useMemo(() => {
        const allNames = list
            .map((item) => item.contragent)
            .filter(
                (contragent) => contragent !== null && contragent !== undefined
            );

        return Array.from(new Set(allNames));
    }, [list]);

    // Заполняем селектор cтатусов
    const statusOptions = useMemo(() => {
        const allNames = list.map((item) => handleStatus(item.status));

        return Array.from(new Set(allNames));
    }, [list]);

    // Заполняем селектор отраслей
    const sectorOptions = useMemo(() => {
        const allSectors = list
            .map((item) => item.industries.main?.name)
            .filter((name) => name !== null && name !== undefined);

        return Array.from(new Set(allSectors));
    }, [list]);

    // Заполняем селектор банков
    const bankOptions = useMemo(() => {
        const allBanks = list.flatMap((item) =>
            item.creditors?.map((bank) => bank.name)
        );
        return Array.from(new Set(allBanks));
    }, [list]);

    // Заполняем селектор руководителей проекта
    const projectManagerOptions = useMemo(() => {
        const allPM = list
            .map((item) => item.project_manager)
            .filter((manager) => manager !== null && manager !== undefined);
        return Array.from(new Set(allPM));
    }, [list]);

    const COLUMNS = [
        {
            label: "Проект",
            key: "name",
            filter: "selectedNames",
            options: nameOptions,
        },
        {
            label: "Статус",
            key: "status",
            filter: "selectedStatuses",
            options: statusOptions,
        },
        {
            label: "Заказчик",
            key: "contragent",
            filter: "selectedContagents",
            options: contragentOptions,
        },
        {
            label: "Основная отрасль",
            key: "industries",
            filter: "selectedSectors",
            options: sectorOptions,
        },
        {
            label: "Банк",
            key: "creditors",
            filter: "selectedBanks",
            options: bankOptions,
        },
        { label: "Бюджет", key: "project_budget", is_sortable: true },
        { label: "Срок", key: "implementation_period" },
        {
            label: "Руководитель проекта",
            key: "project_manager",
            filter: "selectedManagers",
            options: projectManagerOptions,
        },
        { label: "Последние отчёты", key: "latest_reports" },
    ];

    const handleProjectsNameChange = (e) => {
        setNewProjectName(e.target.value);
    };

    const openPopup = () => {
        setPopupState(true);
    };

    const closePopup = (evt) => {
        if (evt.currentTarget.classList.contains("popup")) setPopupState(false);
    };

    // Получение проектов
    const getProjects = () => {
        setIsLoading(true);

        getData(URL, { Accept: "application/json" })
            .then((response) => {
                setList(response.data);
                setSortedList(response.data);
            })
            .finally(() => setIsLoading(false));
    };

    // Создание проекта
    const createProject = () => {
        postData("POST", URL, { name: newProjectName }).then((response) => {
            if (response.ok) {
                navigate(`/projects/${response.id}`, {
                    state: { mode: "edit" },
                });
            }
        });
    };

    // Удаление проекта
    const deleteProject = (projectId) => {
        postData("DELETE", `${URL}/${projectId}`, {}).then((response) => {
            if (response.ok) {
                getProjects();
            }
        });
    };

    useEffect(() => {
        setSortedList(sortList(list, sortBy));
    }, [sortBy]);

    useEffect(() => {
        getProjects();
    }, []);

    const [filters, setFilters] = useState({
        selectedNames: [],
        selectedStatuses: [],
        selectedContagents: [],
        selectedSectors: [],
        selectedBanks: [],
        selectedManagers: [],
    });

    const filteredProjects = useMemo(() => {
        return sortedList.filter((project) => {
            return (
                (filters.selectedSectors.length === 0 ||
                    filters.selectedSectors.includes(
                        project.industries?.main?.name
                    )) &&
                (filters.selectedBanks.length === 0 ||
                    project.creditors?.some((c) =>
                        filters.selectedBanks.includes(c.name)
                    )) &&
                (filters.selectedManagers.length === 0 ||
                    filters.selectedManagers.includes(project.project_manager)) &&
                (filters.selectedNames.length === 0 ||
                    filters.selectedNames.includes(project.name)) &&
                (filters.selectedStatuses.length === 0 ||
                    filters.selectedStatuses.includes(
                        handleStatus(project.status)
                    )) &&
                (filters.selectedContagents.length === 0 ||
                    filters.selectedContagents.includes(project.contragent))
            );
        });
    }, [sortedList, filters]);

    return (
        <main className="page projects">
            <div className="container registry__container">
                <section className="registry__header flex justify-between items-center">
                    <h1 className="title">
                        Реестр проектов
                        {filteredProjects.length > 0 && (
                            <span>{filteredProjects.length}</span>
                        )}
                    </h1>

                    <div className="flex items-center gap-6">
                        {mode === "edit" && (
                            <button
                                type="button"
                                className="button-active"
                                onClick={openPopup}
                            >
                                <span>Создать проект</span>
                                <div className="button-active__icon">
                                    <svg
                                        width="12"
                                        height="13"
                                        viewBox="0 0 12 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.75 5.75h3.75v1.5H6.75V11h-1.5V7.25H1.5v-1.5h3.75V2h1.5v3.75z"
                                            fill="#fff"
                                        />
                                    </svg>
                                </div>
                            </button>
                        )}
                    </div>
                </section>

                <section className="registry__table-section w-full">
                    {openFilter !== "" && (
                        <OverlayTransparent
                            state={true}
                            toggleMenu={() => setOpenFilter("")}
                        />
                    )}

                    <table className="registry-table table-auto w-full border-collapse">
                        <thead className="registry-table__thead">
                            <tr>
                                {COLUMNS.map(
                                    ({
                                        label,
                                        key,
                                        filter,
                                        options,
                                        is_sortable,
                                    }) => {
                                        return (
                                            <th
                                                className="min-w-[125px]"
                                                rowSpan="2"
                                                key={key}
                                            >
                                                <div className="registry-table__thead-item">
                                                    {filter ? (
                                                        <>
                                                            <div className="registry-table__thead-label">
                                                                {label}
                                                            </div>

                                                            {filters[filter]
                                                                .length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                [filter]:
                                                                                    [],
                                                                            })
                                                                        );
                                                                    }}
                                                                >
                                                                    <svg
                                                                        width="16"
                                                                        height="16"
                                                                        viewBox="0 0 16 16"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path
                                                                            d="M9.06 8l3.713 3.712-1.06 1.06L8 9.06l-3.712 3.713-1.061-1.06L6.939 8 3.227 4.287l1.06-1.06L8 6.939l3.712-3.712 1.061 1.06L9.061 8z"
                                                                            fill="#000"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            )}

                                                            {options.length >
                                                                0 &&
                                                                options.some(
                                                                    (val) =>
                                                                        val !==
                                                                        undefined
                                                                ) && (
                                                                    <FilterButton
                                                                        label={
                                                                            label
                                                                        }
                                                                        key={
                                                                            key
                                                                        }
                                                                        filterKey={
                                                                            key
                                                                        }
                                                                        openFilter={
                                                                            openFilter
                                                                        }
                                                                        setOpenFilter={
                                                                            setOpenFilter
                                                                        }
                                                                    />
                                                                )}

                                                            {openFilter ===
                                                                key && (
                                                                <MultiSelectWithSearch
                                                                    options={
                                                                        options.length >
                                                                        0
                                                                            ? options.map(
                                                                                  (
                                                                                      name
                                                                                  ) => ({
                                                                                      value: name,
                                                                                      label: name,
                                                                                  })
                                                                              )
                                                                            : []
                                                                    }
                                                                    selectedValues={
                                                                        filters[
                                                                            filter
                                                                        ]
                                                                    }
                                                                    onChange={(
                                                                        updated
                                                                    ) =>
                                                                        setFilters(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                ...updated,
                                                                            })
                                                                        )
                                                                    }
                                                                    fieldName={
                                                                        filter
                                                                    }
                                                                    close={
                                                                        setOpenFilter
                                                                    }
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="registry-table__thead-label">
                                                            {label}
                                                        </div>
                                                    )}

                                                    {is_sortable && (
                                                        <TheadSortButton
                                                            label={label}
                                                            value={key}
                                                            sortBy={sortBy}
                                                            setSortBy={
                                                                setSortBy
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    }
                                )}
                            </tr>
                        </thead>

                        <tbody className="registry-table__tbody">
                            {isLoading ? (
                                <tr>
                                    <td>
                                        <Loader />
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.length > 0 &&
                                filteredProjects.map((item) => (
                                    <ProjectItem
                                        key={item.id}
                                        props={item}
                                        columns={COLUMNS}
                                        mode={mode}
                                        deleteProject={deleteProject}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </section>

                {popupState && (
                    <Popup onClick={closePopup} title="Создание проекта">
                        <div className="action-form__body">
                            <label
                                htmlFor="project_name"
                                className="form-label"
                            >
                                Название проекта <span>*</span>
                            </label>
                            <input
                                type="text"
                                name="project_name"
                                id="project_name"
                                className="form-field w-full"
                                placeholder="Ваш текст"
                                value={newProjectName}
                                onChange={(e) => handleProjectsNameChange(e)}
                            />
                        </div>

                        <div className="action-form__footer">
                            <div className="max-w-[280px]">
                                <button
                                    type="button"
                                    onClick={() => setPopupState(false)}
                                    className="cancel-button flex-[1_0_auto]"
                                >
                                    Отменить
                                </button>

                                <button
                                    type="button"
                                    className="action-button flex-[1_0_auto]"
                                    onClick={createProject}
                                    disabled={newProjectName.length < 2}
                                >
                                    Создать проект
                                </button>
                            </div>
                        </div>
                    </Popup>
                )}
            </div>
        </main>
    );
};

export default Projects;
