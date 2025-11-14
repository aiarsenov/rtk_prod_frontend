import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import Home from "./Home/Home";
import NotFound from "./NotFound";
import Header from "./Header/Header";
import Projects from "./Projects/Projects";
import ProjectCard from "./ProjectCard/ProjectCard";
import Employees from "./Employees/Employees";
import EmployeeCard from "./EmployeeCard/EmployeeCard";
import ReferenceBooks from "./ReferenceBooks/ReferenceBooks";
import SingleBook from "./ReferenceBooks/SingleBook";
import Contragents from "./Contragents/Contragents";
import ContragentCard from "./ContragentCard/ContragentCard";
import Suppliers from "./Suppliers/Suppliers";
import SupplierCard from "./SupplierCard/SupplierCard";
import Reports from "./Reports/Reports";
import Sales from "./Sales/Sales";
import SaleCard from "./SaleCard/SaleCard";
import Admin from "./Admin/Admin";
import InviteAccept from "./InviteAccept/InviteAccept";

function Router() {
    return (
        <BrowserRouter basename="/">
            <Routes>
                {/* Роут для принятия приглашения без Header */}
                <Route path="/invite/accept" element={<InviteAccept />} />

                {/* Остальные роуты с Header */}
                <Route
                    element={
                        <>
                            <Header />
                            <MainLayout />
                        </>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="*" element={<NotFound />} />

                    <Route path="projects" element={<Projects />} />
                    <Route
                        path="projects/:projectId"
                        element={<ProjectCard />}
                    />
                    <Route path="projects/new" element={<ProjectCard />} />

                    <Route path="contragents" element={<Contragents />} />
                    <Route
                        path="contragents/:contragentId"
                        element={<ContragentCard />}
                    />

                    <Route path="reports" element={<Reports />} />

                    <Route path="employees" element={<Employees />} />
                    <Route
                        path="employees/:employeeId"
                        element={<EmployeeCard />}
                    />

                    <Route path="suppliers" element={<Suppliers />} />
                    <Route
                        path="suppliers/:supplierId"
                        element={<SupplierCard />}
                    />

                    <Route
                        path="reference-books"
                        element={<ReferenceBooks />}
                    />
                    <Route
                        path="reference-books/:bookId"
                        element={<SingleBook />}
                    />

                    <Route path="sales" element={<Sales />} />
                    <Route path="sales/:saleId" element={<SaleCard />} />

                    <Route path="admin" element={<Admin />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
