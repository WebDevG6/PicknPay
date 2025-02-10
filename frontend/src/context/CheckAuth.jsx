import { Outlet, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import conf from "../conf/main";
import ax, { axData } from "../conf/ax";
import { authContext } from "./AuthContext";

export default function CheckAuth() {
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

    return <Outlet />;
}
