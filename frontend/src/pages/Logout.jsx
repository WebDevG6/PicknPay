import React from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router";

export default function Logout() {
    Cookies.remove("token");
    return <Navigate to="/" />;
}
