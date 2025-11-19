import { useSelector } from "react-redux";
import { canAccess } from "../../../utils/permissions";
import AccessDenied from "../../AccessDenied/AccessDenied";

const Finance = () => {
    const user = useSelector((state: any) => state.user.data);

    if (!canAccess(user, "main")) {
        return <AccessDenied message="У вас нет прав для просмотра дашборда финансов" />;
    }

    return (
        <div className="container">
            <h1 className="title">В разработке</h1>
        </div>
    );
};

export default Finance;
