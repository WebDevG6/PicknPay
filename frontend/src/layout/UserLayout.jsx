import React from "react";
import { Outlet } from "react-router";

function UserLayout() {
    return (
        <div className="layout">
            <Outlet />
        </div>
    );
}

export default UserLayout;
