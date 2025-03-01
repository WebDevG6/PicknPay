import { Routes, BrowserRouter, Route, Navigate } from "react-router";
import { UserContextProvider } from "./context/AuthContext";
import UserLayout from "./layout/UserLayout";
import RequiredAuth from "./context/RequireAuth";
import RequireCustomerRole from "./context/RequireCustomerRole";
import RequireAdminRole from "./context/RequireAdminRole";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import AdminLayout from "./layout/AdminLayout";
import Orders from "./pages/admin/Orders";
import Dashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";
import CheckAuth from "./context/CheckAuth";
import Cart from "./pages/user/Cart";
import Product from "./pages/Product";
import ProductList from "./pages/user/ProductList";
import Profile from "./pages/user/Profile";
import AddProduct from "./pages/admin/AddProducts";
import ManangeProducts from "./pages/admin/ManangeProducts";
import Coupon from "./pages/admin/Coupon";
import MyOrder from "./pages/user/MyOrder";
import MyOrderDetail from "./pages/user/MyOrderDetail";
import Promotion from "./pages/admin/Promotion";

function App() {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route path="/logout" element={<Logout />} />
                    <Route element={<CheckAuth />}>
                        <Route element={<UserLayout />}>
                            <Route index path="/" element={<Home />} />
                            <Route path="/products/:productId" element={<Product />} />
                            <Route path="/products" element={<ProductList />} />
                        </Route>
                    </Route>
                    <Route element={<RequiredAuth />}>
                        <Route element={<RequireCustomerRole />}>
                            <Route element={<UserLayout />}>
                                <Route path="/customer/*" element={<Navigate to={"/customer/profile"} />} />
                                <Route path="/customer/cart" element={<Cart />} />
                                <Route path="/customer/order" element={<MyOrder />} />
                                <Route path="/customer/order/:orderId" element={<MyOrderDetail />} />
                                <Route path="/customer/profile" element={<Profile />} />
                            </Route>
                        </Route>
                        <Route element={<RequireAdminRole />}>
                            <Route path="admin" element={<AdminLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="orders" element={<Orders />} />
                                <Route path="customers" element={<Customers />} />
                                <Route path="coupon" element={<Coupon />} />
                                <Route path="coupon/:couponId" element={<Promotion />} />
                                <Route path="products">
                                    <Route index element={<ManangeProducts />} />
                                    <Route path="manage" element={<ManangeProducts />} />
                                    <Route path="add" element={<AddProduct />} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    );
}

export default App;
