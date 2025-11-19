import { useSelector } from "react-redux";
import { canAccess } from "../../../utils/permissions";
import AccessDenied from "../../AccessDenied/AccessDenied";

const Staff = () => {
    const user = useSelector((state: any) => state.user.data);

    if (!canAccess(user, "employees")) {
        return <AccessDenied message="У вас нет прав для просмотра дашборда персонала" />;
    }

    return (
        <div className="container">
            <h1 className="title">В разработке</h1>
        </div>
    );
};

export default Staff;
