import { createBrowserRouter } from "react-router";
import { AuthLayout, LoginPage, SignupPage } from "../pages/auth";
import { protectedLoader } from "./loader/authLoader";
import MainLayout from "../components/layout/MainLayout";
import ProfilePage from "../pages/user/MyProfile";
import AccountLayout from "../components/layout/AccountLayout";
import ReviewsPage from "../pages/user/MyReview";
import MyTransactions from "../pages/user/MyTransaction";
import AdminLayout from "../components/layout/AdminLayout";
import { adminLoader } from "./loader/adminLoader";
import NotFoundPage from "../pages/error/NotFoundError";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsersPage from "../pages/admin/AdminUserPage";
import AdminEditUserPage from "../pages/admin/AdminUserEditPage";
import AddUserPage from "../pages/admin/AddUserPage";
import AdminProductsIndex from "../pages/admin/AdminProducts";
import AdminAddProducts from "../pages/admin/AdminAddProducts";
import AdminUpdateProduct from "../pages/admin/AdminUpdateProducts";
import AdminDetailProducts from "../pages/admin/AdminDetailProduct";
import AdminReviewPage from "../pages/admin/AdminReviewPage";
import AdminCategoryPage from "../pages/admin/AdminCategoriesPage";
import OrdersPage from "../pages/admin/AdminOrderPages";
import AdminOrderDetails from "../pages/admin/AdminOrderDetails";
import UserDetailTransacion from "../pages/user/UserDetailTransaction";
import GenerateOrderPages from "../pages/order/GenerateOrderPage";
import HomePages from "../pages/home/HomePage";
import SearchPage from "../pages/home/SearchPage";
import CreateServiceRequestForm from "../pages/service_request/ServiceRequestFormPage";
import AdminServiceRequestPage from "../pages/admin/AdminServiceRequestPage";
import UserServiceRequestPage from "../pages/user/ServiceHistory";
import UserServiceDetails from "../pages/user/ServiceRequestDetail";
import AdminServiceDetails from "../pages/admin/AdminServiceDetails";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePages />
            },
            {
                path: "/create-order/:id",
                element: <GenerateOrderPages />
            },
            {
                path: "products/detail/:slug",
                element: <AdminDetailProducts />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: "/device-service",
                loader: protectedLoader,
                element: <CreateServiceRequestForm />
            }
        ]
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <LoginPage />

            },
            {
                path: "sign-up",
                element: <SignupPage />
            }
        ]
    },

    {
        path: "/account",
        element: <AccountLayout />,
        loader: protectedLoader,
        children: [
            {
                path: "profile",
                element: <ProfilePage />
            },
            {
                path: "reviews",
                element: <ReviewsPage />
            },
            {
                path: "transactions",
                element: <MyTransactions />
            },

            {
                path: "transactions/:id",
                element: <UserDetailTransacion />
            },
            {
                path: "services",
                element: <UserServiceRequestPage />
            },
            {
                path: "services/detail/:id",
                element: <UserServiceDetails />

            }

        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        loader: adminLoader,
        children: [{
            index: true,
            element: <AdminDashboard />
        },
        {
            path: "users",
            element: <AdminUsersPage />,
        },
        {
            path: "users/edit/:id",
            element: <AdminEditUserPage />
        },
        {
            path: "users/add",
            element: <AddUserPage />
        },

        {
            path: "products",
            element: <AdminProductsIndex />
        },
        {
            path: "products/add",
            element: <AdminAddProducts />
        },
        {
            path: "products/edit/:id",
            element: <AdminUpdateProduct />
        },
        {
            path: "products/detail/:slug",
            element: <AdminDetailProducts />
        },
        {
            path: "reviews",
            element: <AdminReviewPage />
        },

        {
            path: "categories",
            element: <AdminCategoryPage />
        },
        {
            path: "orders",
            element: <OrdersPage />
        },

        {
            path: "orders/:id",
            element: <AdminOrderDetails />
        },

        {
            path: "services",
            element: <AdminServiceRequestPage />
        },
        {
            path: "services/details/:id",
            element: <AdminServiceDetails />
        }

        ]
    },
    {
        path: "/404",
        element: <NotFoundPage />
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
])