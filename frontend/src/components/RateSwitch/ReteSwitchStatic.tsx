import { useState, useEffect } from "react";

import "./RateSwitch.scss";

interface RateSwitchProps {
    name: string;
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

const RateSwitchStatic = ({ name, reportRateData }: RateSwitchProps) => {
    const [currentRateClass, setCurrentRateClass] = useState(() =>
        getRateClass(reportRateData[name])
    );

    useEffect(() => {
        setCurrentRateClass(getRateClass(reportRateData[name]));
    }, [reportRateData, name]);

    return (
        <div className={`rate-switch rate-switch_${currentRateClass}`}>
            <div className="rate-switch__button"></div>
            <div className="rate-switch__button"></div>
            <div className="rate-switch__button"></div>
        </div>
    );
};

export default RateSwitchStatic;
