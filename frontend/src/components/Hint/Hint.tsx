import "./Hint.scss";

const Hint = ({
    message,
    position = "top",
    type = "hint",
}: {
    message?: string;
    position?: "top" | "bottom" | "right";
    type?: "hint" | "alert";
}) => {
    return (
        <div className={`hint hint--${position}`}>
            <div className="hint__icon">
                {type === "hint" ? (
                    <svg
                        width="14"
                        height="13"
                        viewBox="0 0 14 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7 12.625A6.125 6.125 0 107 .375a6.125 6.125 0 000 12.25zM5.855 4.75h-1.48c0-1.575 1.123-2.625 2.8-2.625 1.562 0 2.625 1.002 2.625 2.362 0 .884-.367 1.524-1.138 2.013-.726.453-1.015.654-1.015 1.219l.044.531H6.247l-.06-.543c-.072-.942.322-1.43 1.075-1.907.705-.453.875-.677.875-1.225 0-.607-.444-1.037-1.137-1.037-.693 0-1.112.564-1.145 1.212zm2.115 5.291c0 .619-.377 1.001-.99 1.001-.611 0-.993-.382-.993-1 0-.625.382-1.008.994-1.008s.989.383.989 1.007z"
                            fill="currentColor"
                        />
                    </svg>
                ) : (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 18.333a8.333 8.333 0 110-16.666 8.333 8.333 0 010 16.666zm-.833-12.5v5h1.666v-5H9.167zM10 14.167a1.042 1.042 0 110-2.084 1.042 1.042 0 010 2.084z"
                            fill="currentColor"
                        />
                    </svg>
                )}
            </div>
            <div className="hint__message">{message}</div>
        </div>
    );
};

export default Hint;
