import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Layout, Menu, theme, Badge,Drawer  } from "antd";
import { DashboardOutlined, ShoppingCartOutlined, AppstoreOutlined, UserOutlined, LogoutOutlined, ShoppingOutlined, BellOutlined } from "@ant-design/icons";
import { authContext } from "../context/AuthContext";

const { Sider, Content } = Layout;

function getItem(label, key, icon) {
    return { key, icon, label };
}

function AdminLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
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
        4: { label: "Customers", path: "/admin/customers" },
        5: { label: "Logout", path: "/logout" },
    };
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const foundKey = Object.keys(layoutTitle).find((key) => location.pathname.startsWith(layoutTitle[key].path));
        setSelectedMenu(foundKey || "1");
    }, [location.pathname]);

    const handleMenuClick = (menu) => {
        navigate(layoutTitle[menu.key].path);
    };

    const items = [getItem("Dashboard", "1", <DashboardOutlined />), getItem("Orders", "2", <ShoppingCartOutlined />), getItem("Products", "3", <AppstoreOutlined />), getItem("Customers", "4", <UserOutlined />), getItem("Logout", "5", <LogoutOutlined />)];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider style={{ siderStyle, backgroundColor: "#122c76" }} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div
                    className="admin-panel"
                    style={{
                        marginLeft: "18px",
                        color: "white",
                        padding: 11,
                        display: "flex",
                        alignItems: "center",
                        fontSize: 24,
                        fontWeight: "bold",
                        width: "100%",
                    }}>
                    <h1>
                        <ShoppingOutlined style={{ fontSize: 25 }} />
                        <span
                            className="ant-menu-title-content"
                            style={{
                                marginLeft: 18,
                                transition: "opacity 0.65s ease in-out 0.5s",
                                opacity: collapsed ? 0 : 1,
                                position: "absolute",
                            }}>
                            {!collapsed && "Admin"}
                        </span>
                    </h1>
                </div>

                <Menu style={{ backgroundColor: "#122c76", padding: 6 }} theme="dark" selectedKeys={[selectedMenu]} mode="inline" items={items} onClick={handleMenuClick} />
            </Sider>
            <Layout>
                <header
                    style={{
                        padding: 23,
                        paddingBlockEnd: 22,
                        backgroundColor: "#122c76",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        position: "relative",
                    }}>
                    <h1
                        style={{
                            fontSize: 22,
                            color: "white",
                            fontWeight: "bold",
                            margin: 0,
                            position: "absolute",
                            left: "47%",
                            transform: "translateX(-50%)",
                            whiteSpace: "nowrap",
                        }}>
                        {layoutTitle[selectedMenu]?.label}
                    </h1>
                    <div
                        style={{
                            position: "absolute",
                            top: "14px",
                            right: "18px",
                            display: "flex",
                            alignItems: "center", 
                        }}>
                        <Badge size="small" count={5} style={{ fontSize: 12 }}>
                            <BellOutlined
                                style={{ fontSize: 20, color: "white", cursor: "pointer" }}
                                onClick={showDrawer}
                            />
                        </Badge>
                        <Drawer title="Notifications" onClose={onClose} open={open} width={250}>
                            <p>🔔 Notification 1</p>
                            <p>🔔 Notification 2</p>
                            <p>🔔 Notification 3</p>
                        </Drawer>
                    </div>
                </header>

                <Content
                    style={{
                        padding: 6,
                        minHeight: 280,
                        background: colorBgContainer,
                        backgroundColor: "#f5f5f5",
                        borderRadius: borderRadiusLG,
                    }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
