import Hint from "../Hint/Hint";

interface Props {
    project_name: string;
    industry_names: [];
    report_period_code: string;
    execution_perƒiod_code: string;
    load_percentage: number;
    note: string;
}

const EmployeePersonalWorkloadItem = ({
    props,
    mode,
    setWorkloads,
    setPersonalWorkload,
}: {
    props: Props;
    mode: object;
    setWorkloads: React.Dispatch<React.SetStateAction<[]>>;
    setPersonalWorkload: React.Dispatch<React.SetStateAction<[]>>;
}) => {
    return (
        <li className="employee-card__personal-workload__list-item">
            <div className="employee-card__personal-workload__list-item__name">
                <div className="flex items-start gap-1">
                    <strong>{props?.project_name}</strong>

                    <Hint
                        type="alert"
                        position="right"
                        message={props.note || "Заметок нет"}
                    />
                </div>

                <span>
                    {props?.industry_names[0].length > 0 &&
                        props?.industry_names[0]}
                </span>
            </div>

            <div className="employee-card__personal-workload__list-item__period">
                <strong>{props?.report_period_code}</strong>
                <span>{props?.execution_period_code}</span>
            </div>

            <div className="employee-card__personal-workload__list-item__percentage">
                <input
                    className="min-w-0"
                    type="number"
                    placeholder="0"
                    max="100"
                    min="0"
                    value={props.load_percentage ?? ""}
                    onChange={(evt) => {
                        if (mode.edit !== "full") return;

                        const raw = evt.target.value;

                        // Если после пустое, то сохраняем пустую строку
                        if (raw === "") {
                            setPersonalWorkload((prev: any) => ({
                                ...prev,
                                workload: prev.workload.map((w: any) =>
                                    w.id === props.id
                                        ? { ...w, load_percentage: "" }
                                        : w
                                ),
                            }));

                            setWorkloads((prev: any) => {
                                const updated = [...prev];
                                const index = updated.findIndex(
                                    (item) => item.report_id === props.report_id
                                );

                                if (index !== -1) {
                                    updated[index] = {
                                        ...updated[index],
                                        load_percentage: "",
                                    };
                                } else {
                                    updated.push({
                                        report_id: props.id,
                                        load_percentage: "",
                                    });
                                }

                                return updated;
                            });

                            return;
                        }

                        const value = parseInt(raw, 10);

                        if (!isNaN(value) && value >= 0 && value <= 100) {
                            setPersonalWorkload((prev: any) => ({
                                ...prev,
                                workload: prev.workload.map((w: any) =>
                                    w.id === props.id
                                        ? { ...w, load_percentage: value }
                                        : w
                                ),
                            }));

                            setWorkloads((prev: any) => {
                                const updated = [...prev];
                                const index = updated.findIndex(
                                    (item) => item.report_id === props.report_id
                                );

                                if (index !== -1) {
                                    updated[index] = {
                                        ...updated[index],
                                        load_percentage: value,
                                    };
                                } else {
                                    updated.push({
                                        report_id: props.id,
                                        load_percentage: value,
                                    });
                                }

                                return updated;
                            });
                        }
                    }}
                    disabled={mode.edit !== "full"}
                />
                <span className="symbol">%</span>
            </div>
        </li>
    );
};

export default EmployeePersonalWorkloadItem;
