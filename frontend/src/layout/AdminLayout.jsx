import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Layout, Menu, theme, Button, Drawer } from "antd";
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    UserOutlined,
    LogoutOutlined,
    ShoppingOutlined,
    PlusOutlined,
    SettingOutlined,
    MenuOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";

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

    const [collapsed, setCollapsed] = useState(false);
    const [mobileVisible, setMobileVisible] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState();
    const [isMobile, setIsMobile] = useState(false);

    const layoutTitle = {
        1: { label: "Dashboard", path: "/admin/dashboard" },
        2: { label: "Orders", path: "/admin/orders" },
        3: { label: "Manage Products", path: "/admin/products/manage" },
        4: { label: "Add a product", path: "/admin/products/add" },
        5: { label: "Coupon", path: "/admin/coupon" },
        6: { label: "Customers", path: "/admin/customers" },
        7: { label: "Logout", path: "/logout" },
    };

    useEffect(() => {
        const foundKey = Object.keys(layoutTitle).find((key) => location.pathname.startsWith(layoutTitle[key].path));
        setSelectedMenu(foundKey || "1");
    }, [location.pathname]);

    const handleMenuClick = (menu) => {
        if (layoutTitle[menu.key]) {
            navigate(layoutTitle[menu.key].path);
            setMobileVisible(false);
        }
    };

    const toggleMobileSidebar = () => {
        setMobileVisible(!mobileVisible);
    };

    const items = [
        getItem("Dashboard", "1", <DashboardOutlined />),
        getItem("Orders", "2", <ShoppingCartOutlined />),
        {
            key: "products",
            icon: <AppstoreOutlined />,
            label: "Products",
            children: [
                getItem("Manage Products", "3", <SettingOutlined />),
                getItem("Add Products", "4", <PlusOutlined />),
            ],
        },
        getItem("Coupon", "5", <CreditCardOutlined />),
        getItem("Customers", "6", <UserOutlined />),
        getItem("Logout", "7", <LogoutOutlined />),
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(isCollapsed) => {
                    if (!isCollapsed) {
                        setTimeout(() => setCollapsed(false), 50);
                    } else {
                        setCollapsed(true);
                    }
                }}
                breakpoint="md"
                onBreakpoint={(broken) => {
                    setIsMobile(broken);
                    setCollapsed(broken);
                }}
                collapsedWidth={isMobile ? 0 : 80}
                style={{
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    zIndex: 1000,
                    width: collapsed ? 80 : 200,
                    transition: "width 0.2s ease-in-out, max-width 0.6s ease-in-out",
                    background: "#001529",
                    overflow: "hidden",
                    display: isMobile ? "none" : "block",
                }}
            >
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
                    }}
                >
                    <h1>
                        <ShoppingOutlined style={{ fontSize: 25 }} />
                        <span
                            className="ant-menu-title-content"
                            style={{
                                marginLeft: 18,
                                opacity: collapsed ? 0 : 1,
                                position: "absolute",
                                transition: "opacity 0.65s ease-in-out 0.5s",
                            }}
                        >
                            {!collapsed && "Admin"}
                        </span>
                    </h1>
                </div>

                <Menu
                    theme="dark"
                    selectedKeys={[selectedMenu]}
                    mode="inline"
                    items={items}
                    onClick={handleMenuClick}
                    inlineIndent={18} />
            </Sider>
            <Drawer
                title={
                    <div style={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: "22px"
                    }}>
                        Admin Panel
                    </div>
                }
                placement="left"
                closable={true}
                onClose={() => setMobileVisible(false)}
                open={mobileVisible}
                width={230}
                destroyOnClose={true}
                style={{
                    background: "#001529",
                    color: "white",
                }}
                headerStyle={{
                    background: "#002140",
                    color: "white",

                }}
                closeIcon={
                    <span style={{
                        position: "absolute",
                        left: "16px",
                        color: "white",
                        fontSize: "20px"
                    }}>
                        ✖
                    </span>
                }
            >
                <Menu
                    theme="dark"
                    selectedKeys={[selectedMenu]}
                    mode="inline"
                    inlineIndent={10}
                    items={items}
                    onClick={(menu) => {
                        handleMenuClick(menu);
                        setMobileVisible(false);
                    }}
                    style={{
                        background: "#001529",
                        color: "white",
                    }}
                />
            </Drawer>

            <Layout
                style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 200, transition: "margin-left 0.3s ease-in-out" }}
            >
                <header
                    style={{
                        padding: 12,
                        background: colorBgContainer,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isMobile ? "flex-start" : "center",
                        width: "100%",
                        position: "relative",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    {isMobile && (
                        <Button
                            icon={<MenuOutlined />}
                            onClick={toggleMobileSidebar}
                            style={{
                                fontSize: 18,
                                marginRight: 16,
                                position: "relative",
                                zIndex: 999,
                            }}
                        />
                    )}

                    <h1
                        style={{
                            fontSize: 22,
                            color: "black",
                            fontWeight: "bold",
                            margin: 0,
                            paddingLeft: isMobile ? 10 : 40,
                            whiteSpace: "nowrap",
                            transition: "all 0.3s ease-in-out",
                        }}
                    >
                        {layoutTitle[selectedMenu]?.label}
                    </h1>
                </header>

                <Content
                    style={{
                        padding: 6,
                        minHeight: 280,
                        background: colorBgContainer,
                        backgroundColor: "#f5f5f5",
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;
