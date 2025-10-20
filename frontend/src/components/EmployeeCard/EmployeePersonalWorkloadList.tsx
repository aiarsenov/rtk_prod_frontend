import EmployeePersonalWorkloadItem from "./EmployeePersonalWorkloadItem";

const EmployeePersonalWorkloadList = ({
    personalWorkload,
    setPersonalWorkload,
    totalWorkload,
    setWorkloads,
    updateLoadPercentage,
    mode,
}: {}) => {
    return (
        <ul className="employee-card__personal-workload__list">
            {personalWorkload?.workload?.length > 0 &&
                personalWorkload?.workload?.every((item) => item !== null) && (
                    <>
                        {personalWorkload?.workload?.map((item) => (
                            <EmployeePersonalWorkloadItem
                                key={item?.id}
                                mode={mode}
                                props={item}
                                setWorkloads={setWorkloads}
                                updateLoadPercentage={updateLoadPercentage}
                            />
                        ))}

                        {personalWorkload.other_workload !== null && (
                            <li className="employee-card__personal-workload__list-item">
                                <div className="employee-card__personal-workload__list-item__name">
                                    <strong>Прочие задачи</strong>
                                </div>

                                <div className="employee-card__personal-workload__list-item__period"></div>

                                <div className="employee-card__personal-workload__list-item__percentage">
                                    <input
                                        className="min-w-0"
                                        type="number"
                                        placeholder="0"
                                        max="100"
                                        min="0"
                                        value={
                                            personalWorkload.other_workload ===
                                            0
                                                ? ""
                                                : personalWorkload.other_workload ??
                                                  ""
                                        }
                                        onChange={(e) => {
                                            const raw = e.target.value;

                                            if (raw === "") {
                                                setPersonalWorkload((prev) => ({
                                                    ...prev,
                                                    other_workload: "",
                                                }));
                                                return;
                                            }

                                            const value = parseInt(raw, 10);

                                            if (
                                                !isNaN(value) &&
                                                value >= 0 &&
                                                value <= 100
                                            ) {
                                                setPersonalWorkload((prev) => ({
                                                    ...prev,
                                                    other_workload: value,
                                                }));
                                            }
                                        }}
                                        onBlur={() => {
                                            updateLoadPercentage();
                                        }}
                                        disabled={mode == "read"}
                                    />
                                    <span className="symbol">%</span>
                                </div>
                            </li>
                        )}

                        <li className="employee-card__personal-workload__list-result">
                            <div>Итого</div>

                            <div>{totalWorkload}%</div>
                        </li>
                    </>
                )}
        </ul>
    );
};

export default EmployeePersonalWorkloadList;
