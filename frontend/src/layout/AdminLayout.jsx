import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Layout, Menu, theme, Badge, Drawer } from "antd";
import { DashboardOutlined, ShoppingCartOutlined, AppstoreOutlined, UserOutlined, LogoutOutlined, ShoppingOutlined, BellOutlined, UnorderedListOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
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
        3: { label: "Product List", path: "/admin/products/list" },
        4: { label: "Add Products", path: "/admin/products/add" },
        5: { label: "Manage Products", path: "/admin/products/manage" },
        6: { label: "Customers", path: "/admin/customers" },
        7: { label: "Logout", path: "/logout" },
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
        if (layoutTitle[menu.key]) {
            navigate(layoutTitle[menu.key].path);
        }
    };


    const items = [
        getItem("Dashboard", "1", <DashboardOutlined />),
        getItem("Orders", "2", <ShoppingCartOutlined />),
        {
            key: "products",
            icon: <AppstoreOutlined />,
            label: "Products",
            children: [
                getItem("Product List", "3", <UnorderedListOutlined />),
                getItem("Add Products", "4", <PlusOutlined />),
                getItem("Manage Products", "5", <SettingOutlined />),
            ],
        },
        getItem("Customers", "6", <UserOutlined />),
        getItem("Logout", "7", <LogoutOutlined />),
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider style={{ siderStyle }} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
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

                <Menu style={{ padding: 6 }} theme="dark" selectedKeys={[selectedMenu]} mode="inline" items={items} onClick={handleMenuClick} />
            </Sider>
            <Layout>
                <header
                    style={{
                        padding: 23,
                        paddingBlockEnd: 22,
                        background: colorBgContainer,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        position: "relative",
                    }}>
                    <h1
                        style={{
                            fontSize: 22,
                            color: "black",
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
                                style={{ fontSize: 20, color: "black", cursor: "pointer" }}
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
