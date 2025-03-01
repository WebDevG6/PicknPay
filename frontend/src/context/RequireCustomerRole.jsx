import { useContext } from "react";
import { Outlet, Navigate } from "react-router";
import { authContext } from "@context/AuthContext";

function RequireCustomerRole() {
    const { userInfo } = useContext(authContext);
    return userInfo.role.name === "Customer" ? <Outlet /> : <Navigate to="/" />;
}
export default RequireCustomerRole;
