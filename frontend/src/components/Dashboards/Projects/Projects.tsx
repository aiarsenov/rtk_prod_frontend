import { useSelector } from "react-redux";
import { canAccess } from "../../../utils/permissions";
import AccessDenied from "../../AccessDenied/AccessDenied";

const Projects = () => {
    const user = useSelector((state: any) => state.user.data);

    if (!canAccess(user, "project_reports")) {
        return <AccessDenied message="У вас нет прав для просмотра дашборда проектов" />;
    }

    return (
        <div className="container">
            <h1 className="title">В разработке</h1>
        </div>
    );
};

export default Projects;
