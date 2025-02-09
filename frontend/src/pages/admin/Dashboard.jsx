import { Card, Row, Space, Statistic, Col, Table, Divider, theme } from "antd";
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
        <div className="w-full overflow-hidden ">
            <Row gutter={[16, 16]} className="p-[8px] ">
                <Col xs={24} md={12} className="flex items-center justify-center text-center">
                    <Row gutter={[16, 16]} className="flex flex-wrap h-full">
                        <DashboardCard icon={<ShoppingOutlined className="text-2xl !text-[green] rounded-xl p-2 bg-green-600/20 h-full" />} title={"Orders"} value={12322} />
                        <DashboardCard icon={<ProductOutlined className="text-2xl !text-[blue] rounded-xl p-2  bg-blue-600/20 h-full" />} title={"Products"} value={12322} />
                        <DashboardCard icon={<UserOutlined className="text-2xl !text-[purple] rounded-xl p-2  bg-cyan-600/20 h-full" />} title={"Customers"} value={12322} />
                        <DashboardCard icon={<DollarOutlined className="text-2xl !text-[orange] rounded-xl p-2  bg-yellow-400/20 h-full" />} title={"Revenue"} value={12322} />
                    </Row>
                </Col>
                <Col xs={24} md={12} className="text-center rounded-lg ">
                    <Row gutter={[16, 16]} className="h-full">
                        <Col xs={24} sm={24} md={12}>
                            <div className="flex text-center bg-white rounded-lg p-[10px] shadow-md h-full">
                                <PieChart />
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <div className="flex text-center bg-white rounded-lg p-[10px] shadow-md h-full" >
                                <BarChart />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="p-[8px]">
                <Col xs={24} sm={24} md={16}>
                    <div className="text-center bg-white rounded-lg p-2 shadow-md">
                        <LineChart />
                    </div>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <div className="text-center bg-white rounded-lg p-2 shadow-md min-h-[315px]">
                        <Divider>Middle size table</Divider>
                        <Table pagination={{ pageSize: 3 }} columns={columns} dataSource={data} size="small" />
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
                className="flex flex-col text-center items-center w-full shadow-md rounded-lg p-2">
                <Space
                    direction="horizontal"
                    className="flex items-center justify-center flex-wrap">
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
        <div className="w-full h-auto max-w-full min-h-[300px]">
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
        <div className="w-full max-w-[400px] h-full justify-center mx-auto min-h-[220px]">
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
        <div className="w-full max-w-[400px] h-auto flex justify-center mx-auto min-h-[220px]">
            <Bar data={data} options={options} />
        </div>
    );
};
export default Dashboard;
