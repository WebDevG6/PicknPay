import { Routes, BrowserRouter, Route, Navigate } from "react-router";
import { UserContextProvider } from "./context/AuthContext";
import UserLayout from "./layout/userLayout";
import RequiredAuth from "./context/RequireAuth";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import AdminLayout from "./layout/AdminLayout";
import Orders from "./pages/admin/Orders";
import Products from "./pages/admin/Products";
import Dashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";

function App() {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route element={<UserLayout />}>
                        <Route index path="/" element={<Home />} />
                    </Route>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/*" element={<Navigate to={"/admin/dashboard"} />} />
                        <Route path="/admin/orders" element={<Orders />} />
                        <Route path="/admin/products" element={<Products />} />
                        <Route path="/admin/customers" element={<Customers />} />
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                    </Route>
                    <Route element={<RequiredAuth />}></Route>
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    );
}

export default App;
