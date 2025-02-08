import { Card, Row, Space, Statistic, Col, Table, Divider } from "antd";
import React from "react";
import { ShoppingOutlined, UserOutlined, DollarOutlined, ProductOutlined } from "@ant-design/icons";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement);
const columns = [
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Age",
        dataIndex: "age",
    },
    {
        title: "Address",
        dataIndex: "address",
    },
];
const data = [
    {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
    },
    {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
    },
    {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
    },
];


const Dashboard = () => {
    return (
        <div className="w-full overflow-hidden">
            <Row gutter={[18, 18]} style={{ padding: "18px", borderRadius: "18px" }}>
                <Col xs={24} md={12} style={{ textAlign: "center", alignItems: "center", display: "flex" }}>
                    <Row gutter={[16, 16]} style={{ display: "flex", flexWrap: "wrap" }}>
                        <DashboardCard icon={<ShoppingOutlined className="text-[22px] !text-[green] rounded-[12px] p-[8px] bg-green-600/20" />} title={"Orders"} value={12322} />
                        <DashboardCard icon={<ProductOutlined className="text-[22px] !text-[blue] rounded-[12px] p-[8px]  bg-blue-600/20" />} title={"Products"} value={12322} />
                        <DashboardCard icon={<UserOutlined className="text-[22px] !text-[purple] rounded-[12px] p-[8px]  bg-cyan-600/20" />} title={"Customers"} value={12322} />
                        <DashboardCard icon={<DollarOutlined className="text-[22px] !text-[orange] rounded-[12px] p-[8px]  bg-yellow-400/20" />} title={"Revenue"} value={12322} />
                    </Row>
                </Col>
                <Col xs={24} md={12} style={{ textAlign: "center", borderRadius: "20px" }}>
                    <Row>
                        <Col xs={24} sm={24} md={12}>
                            <div style={{ textAlign: "center", backgroundColor: "white", borderRadius: "20px", gap: "20px", marginRight: "10px", padding: "12px" ,boxShadow:"0 0 10px rgba(0,0,0,0.05)"}}>
                                <PieChart />
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <div style={{ textAlign: "center", backgroundColor: "white", borderRadius: "20px", gap: "20px", marginLeft: "10px", padding: "12px", boxShadow:"0 0 10px rgba(0,0,0,0.05)" }}>
                                <BarChart />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ padding: "6px", borderRadius: "18px" }}>
                <Col xs={24} sm={24} md={16}>
                    <div style={{ textAlign: "center", backgroundColor: "white", borderRadius: "20px", padding: "12px", marginLeft: "7px",marginBottom:"20px",boxShadow:"0 0 10px rgba(0,0,0,0.05)"  }}>
                        <LineChart />
                    </div>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <div style={{ textAlign: "center", backgroundColor: "white", borderRadius: "20px", padding: "8px",boxShadow:"0 0 10px rgba(0,0,0,0.05)",marginBottom:"20px" }}>
                        <Divider>Middle size table</Divider>
                        <Table  pagination={{ pageSize: 3 }} columns={columns} dataSource={data} size="small" />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

const DashboardCard = ({ title, value, icon }) => {
    return (
        <Col xs={24} sm={12}>
        <Card
            style={{
                width: "100%",
                boxShadow: "0 0 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", 
                textAlign: "center",
            }}>
            <Space
                direction="horizontal"
                style={{
                    display: "flex",
                    alignItems: "center", 
                    justifyContent: "center", 
                    flexWrap: "wrap", 
                }}>
                {icon}
                <Statistic title={title} value={value} />
            </Space>
        </Card>
    </Col>
    
    );
};
const LineChart = () => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Sales for 2020 (M)",
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgb(75, 192, 192)",
                tension: 0.05,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: "100%", height: "auto", maxWidth: "100%", minHeight: "300px"}}>
            <Line data={data} options={options} />
        </div>
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
        <div style={{ width: "100%", maxWidth: "400px", height: "auto", display: "flex", justifyContent: "center", margin: "0 auto", minHeight: "220px" }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

const BarChart = () => {
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                label: "Sales",
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgb(275, 592, 392)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: "100%", maxWidth: "400px", height: "auto", display: "flex", justifyContent: "center", margin: "0 auto", minHeight: "220px" }}>
            <Bar data={data} options={options} />
        </div>
    );
};
export default Dashboard;
