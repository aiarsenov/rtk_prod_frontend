import { useEffect } from "react";
import EmployeePersonalWorkloadItem from "./EmployeePersonalWorkloadItem";

interface PersonalWorkload {
    workload: [];
    other_workload: number | string;
}

const EmployeePersonalWorkloadList = ({
    isShowActions,
    setIsShowActions,
    personalWorkload,
    personalWorkloadRef,
    setPersonalWorkload,
    totalWorkload,
    setWorkloads,
    updateLoadPercentage,
    mode,
}: {
    isShowActions: boolean;
    setIsShowActions: React.Dispatch<React.SetStateAction<boolean>>;
    personalWorkload: PersonalWorkload;
    personalWorkloadRef: PersonalWorkload;
    setPersonalWorkload: React.Dispatch<React.SetStateAction<object>>;
    totalWorkload: number | string;
    setWorkloads: React.Dispatch<React.SetStateAction<[]>>;
    updateLoadPercentage: () => void;
    mode: string;
}) => {
    // Проверяем, изменились ли трудозатраты
    const isWorkloadChanged = (a: any[], b: any[]) => {
        if (a.length !== b.length) return true;

        return a.some((item, index) => {
            const refItem = b[index];
            return (
                item.id !== refItem.id ||
                item.load_percentage !== refItem.load_percentage
            );
        });
    };

    // Отображаем кнопки если есть изменения в трудозатратах
    useEffect(() => {
        const otherChanged =
            personalWorkload?.other_workload !==
            personalWorkloadRef?.other_workload;

        const workloadChanged = isWorkloadChanged(
            personalWorkload?.workload ?? [],
            personalWorkloadRef?.workload ?? []
        );

        setIsShowActions(otherChanged || workloadChanged);
    }, [personalWorkload, personalWorkloadRef]);

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
                                setPersonalWorkload={setPersonalWorkload}
                            />
                        ))}

                        {personalWorkload.other_workload !== null && (
                            <li
                                className="employee-card__personal-workload__list-item"
                                style={{ alignItems: "center" }}
                            >
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

                        {isShowActions && (
                            <div className="employee-card__personal-workload__list-actions">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    title="Отменить изменения"
                                    onClick={() => {
                                        setPersonalWorkload(
                                            personalWorkloadRef
                                        );
                                        setWorkloads(
                                            personalWorkloadRef.workload
                                        );
                                        setIsShowActions(false);
                                    }}
                                >
                                    Отменить
                                </button>

                                <button
                                    type="button"
                                    className="action-button"
                                    title="Сохранить изменения"
                                    onClick={updateLoadPercentage}
                                >
                                    Сохранить
                                </button>
                            </div>
                        )}
                    </>
                )}
        </ul>
    );
};

export default EmployeePersonalWorkloadList;
