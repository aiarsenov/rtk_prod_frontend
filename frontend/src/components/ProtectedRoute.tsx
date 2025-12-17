import { useSelector } from "react-redux";
import { hasPermission, hasAccessToAnySection } from "../utils/permissions";
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
        const noAccessToAny = !hasAccessToAnySection(user);
        return (
            <AccessDenied
                message={`У вас нет прав для просмотра раздела "${section}"`}
                noAccessToAnySection={noAccessToAny}
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
