import React, { useContext } from "react";
import { Navigate } from "react-router";
import Cookies from "js-cookie";
import { authContext } from "@context/AuthContext";

export default function Logout() {
    const { updateUserInfo } = useContext(authContext);
    updateUserInfo();
    Cookies.remove("token");
    return <Navigate to="/" />;
}
