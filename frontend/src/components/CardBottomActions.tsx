const CardBottomActions = ({
    setReportWindowsState,
    setActiveWindow,
    className,
}) => {
    return (
        <div className={`card__bottom-actions ${className}`}>
            <button
                type="button"
                title="Открыть отчёты"
                onClick={() => {
                    setReportWindowsState(false);
                    setActiveWindow("reports");
                }}
            >
                <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8.83116 9.62235H21.1633M8.83116 14.6909H21.1633M8.83116 19.4801H17.4517M6.06055 26.2405H24.0007C24.553 26.2405 25.0007 25.7928 25.0007 25.2405V4.75928C25.0007 4.20699 24.553 3.75928 24.0007 3.75928H6.06055C5.50826 3.75928 5.06055 4.20699 5.06055 4.75928V25.2405C5.06055 25.7928 5.50826 26.2405 6.06055 26.2405Z"
                        stroke="#F38B00"
                        strokeWidth="2"
                    />
                </svg>
            </button>

            <button
                type="button"
                title="Открыть ОСВ"
                onClick={() => {
                    setReportWindowsState(false);
                    setActiveWindow("statistic");
                }}
            >
                <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 21.25H6.25V18.75H10V16.25H6.25V13.75H10V3.75H18.75C20.4076 3.75 21.9973 4.40848 23.1694 5.58058C24.3415 6.75269 25 8.3424 25 10C25 11.6576 24.3415 13.2473 23.1694 14.4194C21.9973 15.5915 20.4076 16.25 18.75 16.25H12.5V18.75H21.25V21.25H12.5V26.25H10V21.25ZM18.75 13.75C19.7446 13.75 20.6984 13.3549 21.4016 12.6517C22.1049 11.9484 22.5 10.9946 22.5 10C22.5 9.00544 22.1049 8.05161 21.4017 7.34835C20.6984 6.64509 19.7446 6.25 18.75 6.25L12.5 6.25V13.75H18.75Z"
                        fill="#F38B00"
                    />
                </svg>
            </button>
        </div>
    );
};

export default CardBottomActions;
