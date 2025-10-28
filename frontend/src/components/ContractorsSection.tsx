import { useEffect, useState } from "react";
import getData from "../utils/getData";

import CreatableSelect from "react-select/creatable";

const ContractorsSection = ({
    index,
    handleContractorChange,
    suppliers,
    roles,
    person,
    removeContractor,
    mode,
}) => {
    const [localContracts, setLocalContracts] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    let name;

    if (mode == "read") {
        name =
            suppliers.length > 0 &&
            suppliers.find((item) => item.id === person?.contragent_id)
                .program_name;
    }

    const fetchContracts = (id) => {
        getData(
            `${import.meta.env.VITE_API_URL}contragents/${id}/contracts`
        ).then((response) => {
            setLocalContracts(response.data);
        });
    };

    const handleContragentChange = async (value) => {
        const contragentId = value;

        handleContractorChange(index, "contragent_id", contragentId);

        if (contragentId > 0) {
            try {
                fetchContracts(contragentId);
            } catch {
                setLocalContracts([]);
            }
        } else {
            setLocalContracts([]);
        }
    };

    useEffect(() => {
        if (!isMounted && person?.contragent_id) {
            fetchContracts(person.contragent_id);
            setIsMounted(true);
        }
    }, [person?.contragent_id, isMounted]);

    return (
        <li className="person-block">
            <div className="person-block__header">
                <div className="person-block__title">Подрядчик {index + 1}</div>

                {mode === "edit" && (
                    <button
                        className="delete-button"
                        title="Удалить подрядчика"
                        onClick={() => removeContractor(index)}
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
                            suppliers.length > 0 &&
                            suppliers.map((item) => ({
                                value: item.id,
                                label: item.program_name,
                            }))
                        }
                        className="form-select-extend"
                        placeholder="Выбрать исполнителя"
                        noOptionsMessage={() => "Совпадений нет"}
                        isValidNewOption={() => false}
                        defaultValue={
                            (suppliers.length > 0 &&
                                suppliers
                                    .map((item) => ({
                                        value: item.id,
                                        label: item.program_name,
                                    }))
                                    .find(
                                        (option) =>
                                            option.value ===
                                            person?.contragent_id
                                    )) ||
                            null
                        }
                        onChange={(selectedOption) => {
                            handleContragentChange(selectedOption.value);
                        }}
                        isDisabled={mode == "read"}
                    />
                )}

                <select
                    className="form-select"
                    value={person?.role_id}
                    onChange={(e) =>
                        handleContractorChange(
                            index,
                            "role_id",
                            Number(e.target.value)
                        )
                    }
                    disabled={mode === "read" ? true : false}
                >
                    <option value="0">Выберите роль</option>
                    {roles?.map((role) => (
                        <option value={role.id} key={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                {person?.contract_id ? (
                    <CreatableSelect
                        options={
                            localContracts.length > 0 &&
                            localContracts.map((item) => ({
                                value: item.id,
                                label: item.contract_name,
                            }))
                        }
                        className="form-select-extend"
                        placeholder="Выберите договор"
                        noOptionsMessage={() => "Совпадений нет"}
                        isValidNewOption={() => false}
                        value={
                            (localContracts.length > 0 &&
                                localContracts
                                    ?.map((item) => ({
                                        value: item.id,
                                        label: item.contract_name,
                                    }))
                                    .find(
                                        (option) =>
                                            option.value === person?.contract_id
                                    )) ||
                            null
                        }
                        onChange={(selectedOption) => {
                            const newValue = selectedOption?.value || "";

                            handleContractorChange(
                                index,
                                "contract_id",
                                Number(newValue)
                            );
                        }}
                        isDisabled={
                            mode === "read" || localContracts.length == 0
                        }
                    />
                ) : (
                    <CreatableSelect
                        options={
                            localContracts.length > 0 &&
                            localContracts.map((item) => ({
                                value: item.id,
                                label: item.contract_name,
                            }))
                        }
                        className="form-select-extend"
                        placeholder="Выберите договор"
                        noOptionsMessage={() => "Совпадений нет"}
                        isValidNewOption={() => false}
                        onChange={(selectedOption) => {
                            const newValue = selectedOption?.value || "";

                            handleContractorChange(
                                index,
                                "contract_id",
                                Number(newValue)
                            );
                        }}
                        isDisabled={
                            mode === "read" || localContracts.length == 0
                        }
                    />
                )}
            </div>
        </li>
    );
};

export default ContractorsSection;
