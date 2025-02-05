import { Routes, BrowserRouter, Route } from "react-router";
import { UserContextProvider } from "./context/AuthContext";
import UserLayout from "./layout/userLayout";
import RequiredAuth from "./context/RequireAuth";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>
            <UserContextProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<UserLayout />}>
                        <Route index path="/" element={<Home />} />
                    </Route>
                    <Route element={<RequiredAuth />}></Route>
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </UserContextProvider>
        </BrowserRouter>
    );
}

export default App;
