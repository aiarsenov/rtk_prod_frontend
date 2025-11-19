import { useSelector } from "react-redux";
import { hasPermission } from "../utils/permissions";
import AccessDenied from "./AccessDenied/AccessDenied";

interface ProtectedRouteProps {
    children: React.ReactNode;
    section: string;
    permissionType?: string;
}

const ProtectedRoute = ({
    children,
    section,
    permissionType = "view",
}: ProtectedRouteProps) => {
    const user = useSelector((state: any) => state.user.data);

    if (!hasPermission(user, section, permissionType)) {
        return (
            <AccessDenied
                message={`У вас нет прав для просмотра раздела "${section}"`}
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
