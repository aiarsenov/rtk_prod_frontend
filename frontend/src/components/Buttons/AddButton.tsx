const AddButton = ({
    label = "Добавить",
    title,
    className,
    onClick,
    hint,
    isDisabled,
}: {
    label?: string;
    title?: string;
    className?: string;
    isDisabled?: boolean;
    hint?: boolean;
    onClick?: () => void;
}) => {
    return (
        <button
            type="button"
            className={`button-add ${className} ${className} ${
                hint ? "button-hint " : ""
            }`}
            onClick={() => {
                if (isDisabled) {
                    return;
                }
                onClick();
            }}
            title={title || label}
            disabled={isDisabled}
        >
            {label}

            <span>
                <svg
                    width="10"
                    height="9"
                    viewBox="0 0 10 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.75 3.75H9.5v1.5H5.75V9h-1.5V5.25H.5v-1.5h3.75V0h1.5v3.75z"
                        fill="currentColor"
                    ></path>
                </svg>
            </span>

            {hint && (
                <div className="button-hint__message">{title || label}</div>
            )}
        </button>
    );
};

export default AddButton;
