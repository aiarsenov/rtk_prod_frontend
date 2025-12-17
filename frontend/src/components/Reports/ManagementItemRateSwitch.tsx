import { useState, useEffect } from "react";

import "../RateSwitch/RateSwitch.scss";

interface RateSwitchProps {
    mode: object;
    name: string;
    rateHandler: (name: string, value: string | number) => void;
    reportRateData: Record<string, number | undefined>;
}

const getRateClass = (rateValue: number | undefined): string => {
    switch (rateValue) {
        case 0:
            return "red";

        case 1:
            return "orange";

        case 2:
            return "green";

        default:
            return "";
    }
};

const ManagementItemRateSwitch = ({
    mode,
    name,
    reportRateData,
    rateHandler,
}: RateSwitchProps) => {
    const [currentRateClass, setCurrentRateClass] = useState(() =>
        getRateClass(reportRateData[name])
    );

    useEffect(() => {
        setCurrentRateClass(getRateClass(reportRateData[name]));
    }, [reportRateData, name]);

    return (
        <nav className={`rate-switch rate-switch_${currentRateClass}`}>
            <button
                type="button"
                className="rate-switch__button"
                title="Поставить оценку Есть проблемы"
                onClick={(evt) => {
                    if (mode.edit !== "full") return;
                    evt.stopPropagation();
                    rateHandler(reportRateData, 0);
                }}
            ></button>
            <button
                type="button"
                className="rate-switch__button"
                title="Поставить оценку Есть сложности"
                onClick={(evt) => {
                    if (mode.edit !== "full") return;
                    evt.stopPropagation();
                    rateHandler(reportRateData, 1);
                }}
            ></button>
            <button
                type="button"
                className="rate-switch__button"
                title="Поставить оценку Проблем нет"
                onClick={(evt) => {
                    if (mode.edit !== "full") return;
                    evt.stopPropagation();
                    rateHandler(reportRateData, 2);
                }}
            ></button>
        </nav>
    );
};

export default ManagementItemRateSwitch;
