import { Card, Row, Space, Statistic, Typography, Col } from "antd";
import React from "react";
import { ShoppingOutlined, UserOutlined, DollarOutlined, ProductOutlined } from "@ant-design/icons";
import "../../../styles/dashboard.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    return (
        <div>
            <Row gutter={[16, 16]} style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "10px" }}>
                <Col xs={24} md={12} style={{ textAlign: "center", alignItems: "center", display: "flex" }}>
                    <Row gutter={[16, 16]} style={{ display: "flex", flexWrap: "wrap" }}>
                        <DashboardCard icon={<ShoppingOutlined className="dashboard-icon icon-green" />} title={"Orders"} value={12322} />
                        <DashboardCard icon={<ProductOutlined className="dashboard-icon icon-blue" />} title={"Products"} value={12322} />
                        <DashboardCard icon={<UserOutlined className="dashboard-icon icon-purple" />} title={"Customers"} value={12322} />
                        <DashboardCard icon={<DollarOutlined className="dashboard-icon icon-orange" />} title={"Revenue"} value={12322} />
                    </Row>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: "center" }}>
                    <div style={{ textAlign: "center" }}>
                        <PieChart />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

const DashboardCard = ({ title, value, icon }) => {
    return (
        <Col xs={24} sm={12}>
            <Card style={{ width: "100%" }}>
                <Space direction="horizontal">
                    {icon}
                    <Statistic title={title} value={value} />
                </Space>
            </Card>
        </Col>
    );
};

const PieChart = () => {
    const data = {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
            {
                label: "My First Dataset",
                data: [300, 50, 100],
                backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: "40vh", height: "40vh", margin: "auto" }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default Dashboard;
