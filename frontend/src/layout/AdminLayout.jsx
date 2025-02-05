import React from "react";
import { Outlet } from "react-router";

function AdminLayout() {
    return (
        <div className="layout">
            <Outlet />
        </div>
    );
}

export default AdminLayout;
