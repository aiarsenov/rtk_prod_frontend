const SubmitButton = ({
    className = "",
    title,
    label,
    onClick,
    isDisabled,
    isLoading,
}: {
    className?: string;
    title?: string;
    label?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    onClick?: () => void;
}) => {
    return (
        <button
            type="button"
            className={`action-button ${className} ${
                isLoading ? "button_loading" : ""
            }`}
            title={isLoading ? "Загрузка" : title || label}
            onClick={() => {
                if (isDisabled || isLoading) return;

                onClick();
            }}
            disabled={isDisabled}
        >
            {label}

            <div className="load__icon"></div>
        </button>
    );
};

export default SubmitButton;
