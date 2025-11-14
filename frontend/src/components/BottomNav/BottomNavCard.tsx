import "./BottomNav.scss";

const BottomNavCard = ({ children, className = "" }) => {
    return (
        <nav className={`bottom-nav ${className}`}>
            <div className="container bottom-nav__container">{children}</div>
        </nav>
    );
};

export default BottomNavCard;
