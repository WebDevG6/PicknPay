import { useContext, useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router";
import Cookies from "js-cookie";
import conf from "@conf/main";
import ax, { axData } from "@conf/ax";
import { authContext } from "@context/AuthContext";

export default function RequiredAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const { updateUserInfo } = useContext(authContext);

    useEffect(() => {
        async function checkAuth() {
            const token = Cookies.get("token");
            axData.jwt = token;
            if (!token) {
                setIsAuthenticated(false);
                return;
            }
            try {
                const response = await ax.get(conf.jwtUserEndpoint, { withCredentials: false });
                setIsAuthenticated(!!response.data?.username);
                updateUserInfo(response.data);
            } catch (err) {
                setIsAuthenticated(false);
            }
        }

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
