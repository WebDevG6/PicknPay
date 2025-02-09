import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { authContext } from "./AuthContext";

function RequireAdminRole() {
    const { userInfo } = useContext(authContext);
    return userInfo.role.name === "Admin" ? <Outlet /> : <Navigate to="/" />;
}
export default RequireAdminRole;
