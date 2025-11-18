interface Props {
    project_name: string;
    industry_names: [];
    report_period_code: string;
    execution_perƒiod_code: string;
    load_percentage: number;
}

const EmployeePersonalWorkloadItem = ({
    props,
    mode,
    setWorkloads,
    updateLoadPercentage,
}: {
    props: Props;
    mode: string;
    setWorkloads: React.Dispatch<React.SetStateAction<[]>>;
    updateLoadPercentage: () => void;
}) => {
    console.log(props);

    return (
        <li className="employee-card__personal-workload__list-item">
            <div className="employee-card__personal-workload__list-item__name">
                <strong>{props?.project_name}</strong>

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
                    defaultValue={props?.load_percentage}
                    onChange={(evt) => {
                        const raw = evt.target.value;
                        if (raw === "") return;

                        let value = parseInt(raw, 10);

                        if (value > 100) {
                            value = 100;
                            evt.target.value = 100;
                        }

                        if (value < 0) {
                            value = 0;
                            evt.target.value = 0;
                        }

                        setWorkloads((prev) => {
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
                                    report_id: props.report_id,
                                    load_percentage: value,
                                });
                            }

                            return updated;
                        });
                    }}
                    onBlur={() => {
                        updateLoadPercentage();
                    }}
                    disabled={mode == "read"}
                />
                <span className="symbol">%</span>
            </div>
        </li>
    );
};

export default EmployeePersonalWorkloadItem;
