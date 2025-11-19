import { useSelector } from "react-redux";
import { canAccess } from "../../../utils/permissions";
import AccessDenied from "../../AccessDenied/AccessDenied";

const Sales = () => {
    const user = useSelector((state: any) => state.user.data);

    if (!canAccess(user, "sales")) {
        return <AccessDenied message="У вас нет прав для просмотра дашборда продаж" />;
    }

    return (
        <div className="container">
            <h1 className="title">В разработке</h1>
        </div>
    );
};

export default Sales;
