import CreatableSelect from "react-select/creatable";

const TeammatesSection = ({
    index,
    handleTeammateChange,
    physicalPersons,
    roles,
    person,
    removeTeammate,
    mode,
}) => {
    let name;

    if (mode == "read") {
        name =
            physicalPersons.length > 0 &&
            physicalPersons.find(
                (item) => item.id === person?.physical_person_id
            ).name;
    }

    return (
        <li className="person-block">
            <div className="person-block__header">
                <div className="person-block__title">Участник {index + 1}</div>

                {mode === "edit" && (
                    <button
                        className="delete-button"
                        title="Удалить участника"
                        onClick={() => removeTeammate(index)}
                    >
                        <svg
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5.833 8v9.166h8.333V8h1.667v10c0 .46-.373.833-.833.833H5A.833.833 0 014.166 18V8h1.667zm3.333 0v7.5H7.5V8h1.666zM12.5 8v7.5h-1.667V8H12.5zm0-5.833c.358 0 .677.229.79.57l.643 1.929h2.733v1.667H3.333V4.666h2.733l.643-1.93a.833.833 0 01.79-.57h5zm-.601 1.666H8.1l-.278.833h4.354l-.277-.833z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </button>
                )}
            </div>

            <div className="person-block__body">
                {mode === "read" ? (
                    <div className="form-field" title={name}>
                        {name}
                    </div>
                ) : (
                    <CreatableSelect
                        options={
                            physicalPersons.length > 0 &&
                            physicalPersons.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))
                        }
                        className="form-select-extend"
                        placeholder="Выбрать исполнителя"
                        noOptionsMessage={() => "Совпадений нет"}
                        isValidNewOption={() => false}
                        defaultValue={
                            (physicalPersons.length > 0 &&
                                physicalPersons
                                    .map((item) => ({
                                        value: item.id,
                                        label: item.name,
                                    }))
                                    .find(
                                        (option) =>
                                            option.value ===
                                            person?.physical_person_id
                                    )) ||
                            null
                        }
                        onChange={(selectedOption) => {
                            handleTeammateChange(
                                index,
                                "physical_person_id",
                                selectedOption.value
                            );
                        }}
                        isDisabled={mode == "read"}
                    />
                )}

                <CreatableSelect
                    options={roles.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }))}
                    className="form-select-extend"
                    placeholder={mode === "edit" ? "Выберите роль" : ""}
                    noOptionsMessage={() => "Совпадений нет"}
                    isValidNewOption={() => false}
                    defaultValue={
                        (roles.length > 0 &&
                            roles
                                .map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))
                                .find(
                                    (item) => item.value === person?.role_id
                                )) ||
                        null
                    }
                    onChange={(selectedOption) => {
                        if (mode === "read") return;

                        const newValue = selectedOption?.value || null;

                        handleTeammateChange(
                            index,
                            "role_id",
                            Number(newValue)
                        );
                    }}
                    isDisabled={mode === "read"}
                    styles={{
                        input: (base) => ({
                            ...base,
                            maxWidth: "100%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }),
                    }}
                />
            </div>
        </li>
    );
};

export default TeammatesSection;
