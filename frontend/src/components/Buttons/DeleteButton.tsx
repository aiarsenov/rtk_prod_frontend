const DeleteButton = ({
    label = "",
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
            className={`delete-button extended ${className}`}
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

            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5.834 7.5v9.167h8.333V7.5h1.667v10c0 .46-.373.833-.833.833H5a.833.833 0 01-.834-.833v-10h1.667zm3.333 0V15H7.501V7.5h1.666zm3.334 0V15h-1.667V7.5h1.667zm0-5.833c.358 0 .677.23.79.57l.643 1.929h2.733v1.667H3.334V4.167l2.732-.001.644-1.93a.833.833 0 01.79-.57h5zM11.9 3.333H8.101l-.278.833h4.354l-.277-.833z"
                    fill="currentColor"
                ></path>
            </svg>

            <div className="button-hint__message">{title || label}</div>
        </button>
    );
};

export default DeleteButton;
