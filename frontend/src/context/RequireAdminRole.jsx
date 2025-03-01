import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { authContext } from "@context/AuthContext";

function RequireAdminRole() {
    const { userInfo } = useContext(authContext);
    return userInfo.role.name === "Admin" ? <Outlet /> : <Navigate to="/" />;
}
export default RequireAdminRole;
