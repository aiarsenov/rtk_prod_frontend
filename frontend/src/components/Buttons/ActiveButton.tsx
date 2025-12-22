const ActiveButton = ({
    label = "Добавить",
    title,
    className,
    onClick,
    isDisabled,
}: {
    label?: string;
    title?: string;
    className?: string;
    isDisabled?: boolean;
    onClick?: () => void;
}) => {
    return (
        <button
            className={`button-active ${className}`}
            type="button"
            onClick={() => {
                if (isDisabled) {
                    return;
                }
                onClick();
            }}
            title={title || label}
            disabled={isDisabled}
        >
            <span>{label}</span>

            <div className="button-active__icon">
                <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6.75 5.75h3.75v1.5H6.75V11h-1.5V7.25H1.5v-1.5h3.75V2h1.5v3.75z"
                        fill="currentColor"
                    ></path>
                </svg>
            </div>
        </button>
    );
};

export default ActiveButton;
