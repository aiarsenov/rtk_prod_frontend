import "./Popup.scss";

const Popup = ({ title, children, onClick, className = "" }) => {
    return (
        <div className="popup" onClick={onClick}>
            <div
                className={`popup__wrapper ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="popup__header">{title}</div>

                {children}
            </div>
        </div>
    );
};

export default Popup;
