import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { authContext } from "../context/AuthContext";

const { Sider, Content } = Layout;

function getItem(label, key, icon) {
    return { key, icon, label };
}

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo } = useContext(authContext);
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState();
    const siderStyle = {
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
        bottom: 0,
    };
    const layoutTitle = {
        1: { label: "Dashboard", path: "/admin/dashboard" },
        2: { label: "Orders", path: "/admin/orders" },
        3: { label: "Products", path: "/admin/products" },
        4: { label: "Users", path: "/admin/users" },
        5: { label: "Logout", path: "/logout" },
    };

    useEffect(() => {
        const foundKey = Object.keys(layoutTitle).find((key) => location.pathname.startsWith(layoutTitle[key].path));
        setSelectedMenu(foundKey || "1");
    }, [location.pathname]);

    const handleMenuClick = (menu) => {
        navigate(layoutTitle[menu.key].path);
    };

    const items = [
        getItem("Dashboard", "1", <DashboardOutlined />),
        getItem("Orders", "2", <ShoppingCartOutlined />),
        getItem("Products", "3", <AppstoreOutlined />),
        getItem("Users", "4", <UserOutlined />),
        getItem("Logout", "5", <LogoutOutlined />),
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                style={{ siderStyle, backgroundColor: "#122c76" }}
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
            >
                <div
                    style={{ backgroundColor: "while", padding: 16, color: "white", textAlign: "center", fontSize: 20 }}
                >
                    {!collapsed && "Admin Panel"}
                </div>
                <Menu
                    style={{ backgroundColor: "#122c76", padding: 6 }}
                    theme="dark"
                    selectedKeys={[selectedMenu]}
                    mode="inline"
                    items={items}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <header
                    style={{
                        paddingLeft: 36,
                        paddingRight: 36,
                        padding: 18,
                        background: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h1 style={{ fontSize: 24, marginLeft: 10 }}>{layoutTitle[selectedMenu]?.label}</h1>
                </header>
                <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
