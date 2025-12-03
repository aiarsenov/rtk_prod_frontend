import { useState, useEffect } from "react";
import getData from "../../utils/getData";
import postData from "../../utils/postData";

import { ToastContainer, toast } from "react-toastify";

import EmployeePersonalWorkloadList from "./EmployeePersonalWorkloadList";
import Select from "react-select";
import Hint from "../Hint/Hint";

const customStyles = {
    option: (base, { data, isFocused, isSelected }) => ({
        ...base,
        backgroundColor: isSelected ? "#0BA5EC" : isFocused ? "#eee" : "white",
        color: isSelected ? "white" : data.isFull ? "#002033" : "#F97066",
    }),
};

const PersonalWorkload = ({
    mode,
    employeeId,
    getWorkloadSummary,
}: {
    mode: string;
    employeeId: number;
    getWorkloadSummary: () => void;
}) => {
    let query;

    const [personalWorkload, setPersonalWorkload] = useState({
        other_workload: 0,
    });

    const [workloads, setWorkloads] = useState([]);
    const [totalWorkload, setTotalWorkload] = useState(0);
    const [datesData, setDatesData] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedPersonalMonth, setSelectedPersonalMonth] = useState({});
    const [selectedPersonalYear, setSelectedPersonalYear] = useState(2024);
    const [availablePersonalMonths, setAvailablePersonalMonths] = useState([]);

    const setSumToTotalWorkload = (workloads, otherWorkload) => {
        const workloadsSum = workloads.reduce(
            (sum, current) => sum + current,
            0
        );

        setTotalWorkload(workloadsSum + otherWorkload || 0);
    };

    // Получение трудозатрат
    const personalWorkloadFilter = () => {
        if ("value" in selectedPersonalMonth) {
            const payload = {
                year: selectedPersonalYear,
                month: selectedPersonalMonth.value,
            };

            getData(
                `${
                    import.meta.env.VITE_API_URL
                }physical-persons/${employeeId}/personal-workload`,
                { params: payload }
            ).then((response) => {
                if (response.status === 200) {
                    setPersonalWorkload(response.data);
                    setWorkloads(response.data.workload);
                }
            });
        }
    };

    // Изменение процентов в блоке Трудозатраты
    const updateLoadPercentage = () => {
        const totalPercentage =
            workloads.reduce((sum, item) => sum + item.load_percentage, 0) +
            personalWorkload.other_workload;

        if (totalPercentage === 100) {
            if ("value" in selectedPersonalMonth) {
                query = toast.loading("Обновление", {
                    containerId: "toastContainer_1",
                    draggable: true,
                    position:
                        window.innerWidth >= 1440
                            ? "bottom-right"
                            : "top-right",
                });

                const data = {
                    workloads: workloads,
                    year: +selectedPersonalYear,
                    month: +selectedPersonalMonth.value,
                    other_workload_percentage: personalWorkload.other_workload,
                };

                postData(
                    "PATCH",
                    `${
                        import.meta.env.VITE_API_URL
                    }physical-persons/${employeeId}/personal-workload`,
                    data
                )
                    .then((response) => {
                        if (response?.ok) {
                            toast.dismiss(query);

                            // toast.update(query, {
                            //     render: "Успешно обновлено!",
                            //     type: "success",
                            //     containerId: "toastContainer_1",
                            //     isLoading: false,
                            //     autoClose: 1200,
                            //     pauseOnFocusLoss: false,
                            //     pauseOnHover: false,
                            //     draggable: true,
                            //     position:
                            //         window.innerWidth >= 1440
                            //             ? "bottom-right"
                            //             : "top-right",
                            // });

                            personalWorkloadFilter();
                            getWorkloadSummary();
                        }
                    })
                    .catch((error) => {
                        toast.dismiss(query);
                        toast.error(error.message || "Ошибка при обновлении", {
                            containerId: "toastContainer_1",
                            isLoading: false,
                            autoClose: 4000,
                            pauseOnFocusLoss: false,
                            pauseOnHover: false,
                            draggable: true,
                            position:
                                window.innerWidth >= 1440
                                    ? "bottom-right"
                                    : "top-right",
                        });
                    });
            }
        } else {
            toast.error("Сумма всех трудозатрат должна равняться 100%", {
                containerId: "toastContainer_1",
                isLoading: false,
                autoClose: 4000,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
                draggable: true,
                position:
                    window.innerWidth >= 1440 ? "bottom-right" : "top-right",
            });
        }
    };

    // Получаем года для блока Трудозатраты
    const getYears = () => {
        getData(
            `${
                import.meta.env.VITE_API_URL
            }personal-available-years?physical_person_id=${employeeId}`
        ).then((response) => {
            if (response.status == 200) {
                setDatesData(response.data);
                setAvailableYears(response.data.map((item) => item.year));
                setSelectedPersonalYear(
                    response.data.map((item) => item.year)[
                        response.data.length - 1
                    ]
                );
            }
        });
    };

    useEffect(() => {
        if (datesData.length > 0) {
            setAvailablePersonalMonths(
                datesData
                    .find((item) => item.year === +selectedPersonalYear)
                    .months.map((month) => ({
                        value: month.number,
                        label: month.name,
                        isFull: month.is_full_workload,
                    }))
            );
            setSelectedPersonalMonth();
        }
    }, [selectedPersonalYear]);

    useEffect(() => {
        setSumToTotalWorkload(
            workloads.map((item) => parseInt(item.load_percentage ?? 0, 10)),
            parseInt(personalWorkload?.other_workload ?? 0, 10)
        );
    }, [workloads, personalWorkload.other_workload]);

    useEffect(() => {
        if (selectedPersonalYear && selectedPersonalMonth) {
            personalWorkloadFilter();
        }
    }, [selectedPersonalYear, selectedPersonalMonth]);

    useEffect(() => {
        if (availablePersonalMonths.length > 0) {
            setSelectedPersonalMonth(availablePersonalMonths[0]);
        }
    }, [availablePersonalMonths]);

    useEffect(() => {
        getYears();
    }, []);

    return (
        <div className="employee-card__personal-workload">
            <ToastContainer containerId="toastContainer_1" />

            <h2 className="card__subtitle">
                Трудозатраты
                <Hint message={"Трудозатраты"} />
            </h2>

            <div className="employee-card__personal-workload__header">
                <Select
                    className="form-select-extend"
                    options={availableYears.map((item) => ({
                        value: item,
                        label: item,
                    }))}
                    placeholder="Год"
                    value={
                        (availableYears.length > 0 &&
                            availableYears
                                .map((item) => ({
                                    value: item,
                                    label: item,
                                }))
                                .find(
                                    (item) =>
                                        item.value === selectedPersonalYear
                                )) ||
                        ""
                    }
                    onChange={(e) => setSelectedPersonalYear(e.value)}
                />

                <Select
                    className="form-select-extend"
                    options={availablePersonalMonths}
                    styles={customStyles}
                    placeholder="Месяц"
                    value={selectedPersonalMonth || ""}
                    onChange={(e) => setSelectedPersonalMonth(e)}
                />
            </div>

            <EmployeePersonalWorkloadList
                personalWorkload={personalWorkload}
                setPersonalWorkload={setPersonalWorkload}
                totalWorkload={totalWorkload}
                setWorkloads={setWorkloads}
                updateLoadPercentage={updateLoadPercentage}
                mode={mode}
            />
        </div>
    );
};

export default PersonalWorkload;
