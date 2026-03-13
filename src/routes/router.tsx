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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        index: true,
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