import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { UsersListPage } from "@/pages/users/UsersListPage";
import { UserCreatePage } from "@/pages/users/UserCreatePage";
import { UserEditPage } from "@/pages/users/UserEditPage";
import { UserViewPage } from "@/pages/users/UserViewPage";
import { DepartmentsListPage } from "@/pages/departments/DepartmentsListPage";
import { DepartmentCreatePage } from "@/pages/departments/DepartmentCreatePage";
import { DepartmentEditPage } from "@/pages/departments/DepartmentEditPage";
import { DepartmentViewPage } from "@/pages/departments/DepartmentViewPage";
import { ServiceRecordsListPage } from "@/pages/serviceRecords/ServiceRecordsListPage";
import { ServiceRecordCreatePage } from "@/pages/serviceRecords/ServiceRecordCreatePage";
import { UsersDemoPage } from "@/pages/usersDemo/UsersDemoPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/users" replace /> },

      { path: "users", element: <UsersListPage /> },
      { path: "users/new", element: <UserCreatePage /> },
      { path: "users/:id", element: <UserViewPage /> },
      { path: "users/:id/edit", element: <UserEditPage /> },

      { path: "departments", element: <DepartmentsListPage /> },
      { path: "departments/new", element: <DepartmentCreatePage /> },
      { path: "departments/:id", element: <DepartmentViewPage /> },
      { path: "departments/:id/edit", element: <DepartmentEditPage /> },

      { path: "service-records", element: <ServiceRecordsListPage /> },
      { path: "service-records/new", element: <ServiceRecordCreatePage /> },

      { path: "users-demo", element: <UsersDemoPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
