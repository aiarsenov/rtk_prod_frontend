import { useNavigate } from "react-router-dom";

import "./BottomNav.scss";

const BottomNavCard = ({ children, update }) => {
    const navigate = useNavigate();

    return (
        <nav className="bottom-nav">
            <div className="container bottom-nav__container">
                <button
                    type="button"
                    className="cancel-button"
                    title="Вернуться на предыдущую страницу"
                    onClick={() => navigate(-1)}
                >
                    Назад
                </button>

                {update && (
                    <button
                        type="button"
                        className="action-button"
                        title="Сохранить изменения"
                        onClick={update}
                    >
                        Сохранить
                    </button>
                )}

                {children}
            </div>
        </nav>
    );
};

export default BottomNavCard;
