import { Routes, BrowserRouter, Route, Navigate } from "react-router";
import { UserContextProvider } from "@context/AuthContext";
import RequiredAuth from "@context/RequireAuth";
import RequireCustomerRole from "@context/RequireCustomerRole";
import RequireAdminRole from "@context/RequireAdminRole";
import CheckAuth from "@context/CheckAuth";

// Layouts
import AuthLayout from "@layouts/AuthLayout";
import UserLayout from "@layouts/UserLayout";
import AdminLayout from "@layouts/AdminLayout";

// Public Pages
import Login from "@pages/public/Login";
import Register from "@pages/public/Register";
import Logout from "@pages/public/Logout";
import Product from "@pages/public/Product";
import Home from "@pages/public/Home";

// Admin Pages
import Dashboard from "@pages/admin/Dashboard";
import Customers from "@pages/admin/Customers";
import Orders from "@pages/admin/Orders";
import ManangeProducts from "@pages/admin/ManangeProducts";
import AddProduct from "@pages/admin/AddProducts";
import Coupon from "@pages/admin/Coupon";

// Customer Pages
import Profile from "@pages/customer/Profile";
import Cart from "@pages/customer/Cart";
import ProductList from "@pages/customer/ProductList";
import MyOrder from "@pages/customer/MyOrder";
import MyOrderDetail from "@pages/customer/MyOrderDetail";

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
