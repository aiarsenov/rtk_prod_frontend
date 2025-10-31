import "./BottomNav.scss";

const BottomNav = ({ children }) => {
    return (
        <nav className="bottom-nav">
            <div className="container bottom-nav__container">{children}</div>
        </nav>
    );
};

export default BottomNav;
