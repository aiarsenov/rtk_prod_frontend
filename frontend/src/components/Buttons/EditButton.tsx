const EditButton = ({
    title = "Изменить",
    hint,
    className,
    onClick,
    isDisabled,
}: {
    title?: string;
    hint?: boolean;
    className?: string;
    onClick?: () => void;
    isDisabled?: boolean;
}) => {
    return (
        <button
            type="button"
            className={`edit-button ${className} ${hint ? "button-hint " : ""}`}
            onClick={() => {
                if (isDisabled) return;
                onClick();
            }}
            title={title}
        >
            {hint && <div className="button-hint__message">{title}</div>}
        </button>
    );
};

export default EditButton;
