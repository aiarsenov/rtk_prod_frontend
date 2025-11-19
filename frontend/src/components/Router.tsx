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
import ProtectedRoute from "./ProtectedRoute";

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

                    <Route
                        path="projects"
                        element={
                            <ProtectedRoute section="project_reports">
                                <Projects />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="projects/:projectId"
                        element={
                            <ProtectedRoute section="project_reports">
                                <ProjectCard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="projects/new"
                        element={
                            <ProtectedRoute section="project_reports">
                                <ProjectCard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="contragents"
                        element={
                            <ProtectedRoute section="customers">
                                <Contragents />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="contragents/:contragentId"
                        element={
                            <ProtectedRoute section="customers">
                                <ContragentCard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="reports"
                        element={
                            <ProtectedRoute section="project_reports">
                                <Reports />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="employees"
                        element={
                            <ProtectedRoute section="employees">
                                <Employees />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="employees/:employeeId"
                        element={
                            <ProtectedRoute section="employees">
                                <EmployeeCard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="suppliers"
                        element={
                            <ProtectedRoute section="contractors">
                                <Suppliers />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="suppliers/:supplierId"
                        element={
                            <ProtectedRoute section="contractors">
                                <SupplierCard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="reference-books"
                        element={
                            <ProtectedRoute section="dictionaries">
                                <ReferenceBooks />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="reference-books/:bookId"
                        element={
                            <ProtectedRoute section="dictionaries">
                                <SingleBook />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="sales"
                        element={
                            <ProtectedRoute section="sales">
                                <Sales />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="sales/:saleId"
                        element={
                            <ProtectedRoute section="sales">
                                <SaleCard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="admin"
                        element={
                            <ProtectedRoute section="main">
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
