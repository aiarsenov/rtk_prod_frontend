import PropTypes from "prop-types";

const AccessDenied = ({ message, noAccessToAnySection = false }) => {
    const displayMessage = noAccessToAnySection
        ? "У вас нет прав для доступа ни в один раздел сервиса."
        : message || "У вас нет прав для доступа в данный раздел.";

    const displayHint = "Обратитесь к администратору для получения доступа.";
    return (
        <div className="access-denied">
            <div className="access-denied__icon">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
                        fill="currentColor"
                    />
                </svg>
            </div>
            <h2 className="access-denied__title">Доступ запрещен</h2>
            <p className="access-denied__message">{displayMessage}</p>
            <p className="access-denied__hint">{displayHint}</p>
        </div>
    );
};

AccessDenied.propTypes = {
    message: PropTypes.string,
    noAccessToAnySection: PropTypes.bool,
};

export default AccessDenied;
