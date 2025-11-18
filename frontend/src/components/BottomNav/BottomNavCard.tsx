import "./BottomNav.scss";

const BottomNavCard = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className: string;
}) => {
    return (
        <nav className={`bottom-nav ${className}`}>
            <div className="container bottom-nav__container">{children}</div>
        </nav>
    );
};

export default BottomNavCard;
