import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { authContext } from "./AuthContext";

function RequireCustomerRole() {
    const { userInfo } = useContext(authContext);
    return userInfo.role.name === "Customer" ? <Outlet /> : <Navigate to="/" />;
}
export default RequireCustomerRole;
