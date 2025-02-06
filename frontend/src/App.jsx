import { Routes, BrowserRouter, Route } from "react-router";
import { UserContextProvider } from "./context/AuthContext";
import UserLayout from "./layout/userLayout";
import RequiredAuth from "./context/RequireAuth";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Home from "./pages/Home";

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
                    <Route element={<RequiredAuth />}></Route>
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    );
}

export default App;
