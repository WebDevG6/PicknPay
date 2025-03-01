import { Card, Row, Space, Statistic, Col, Table, Divider } from "antd";
import useDataAdmin from "@hooks/useDataAdmin";
import useProducts from "@hooks/useProducts";
import { ShoppingOutlined, UserOutlined, DollarOutlined, ProductOutlined } from "@ant-design/icons";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, BarElement);

const Dashboard = () => {
    const { totalProducts, totalCustomers } = useDataAdmin();
    return (
        <div className="w-full overflow-hidden ">
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12} className="flex items-center justify-center text-center">
                    <Row gutter={[16, 16]} className="flex flex-wrap h-full">
                        <DashboardCard
                            icon={
                                <ShoppingOutlined className="text-2xl !text-[green] rounded-xl p-2 bg-green-600/20 h-full" />
                            }
                            title={"Orders"}
                            value={0}
                        />
                        <DashboardCard
                            icon={
                                <ProductOutlined className="text-2xl !text-[blue] rounded-xl p-2  bg-blue-600/20 h-full" />
                            }
                            title={"Products"}
                            value={totalProducts}
                        />
                        <DashboardCard
                            icon={
                                <UserOutlined className="text-2xl !text-[purple] rounded-xl p-2  bg-cyan-600/20 h-full" />
                            }
                            title={"Customers"}
                            value={totalCustomers}
                        />
                        <DashboardCard
                            icon={
                                <DollarOutlined className="text-2xl !text-[orange] rounded-xl p-2  bg-yellow-400/20 h-full" />
                            }
                            title={"Revenue"}
                            value={0}
                        />
                    </Row>
                </Col>
                <Col xs={24} md={12} className="text-center rounded-lg ">
                    <Row gutter={[16, 16]} className="h-full">
                        <Col xs={24} sm={24} md={12}>
                            <div className="flex text-center bg-white rounded-lg p-[10px] shadow-md md:h-full lg:max-h-[243px]">
                                <PieChart />
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <div className="flex text-center bg-white rounded-lg p-[10px] shadow-md md:h-full lg:max-h-[243px]">
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
                        <Divider>Customer List</Divider>
                        <CustomerTable />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

const DashboardCard = ({ title, value, icon }) => {
    return (
        <Col xs={24} sm={12} className="flex justify-center">
            <Card className="flex flex-col items-center justify-center w-full max-w-md shadow-md rounded-lg p-4">
                <Space direction="horizontal" className="flex items-start justify-start flex-wrap gap-6">
                    {icon}
                    <Statistic
                        className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                        title={title}
                        value={value}
                    />
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
        <div className="w-full max-w-[400px] h-full justify-center mx-auto">
            <Doughnut data={data} options={options} />
        </div>
    );
};

const BarChart = () => {
    const { products, categories } = useProducts();
    const categoryCounts = categories.map((category) => {
        const count = products.filter((product) => product.category.id === category.id).length;
        return { name: category.name.trim(), count };
    });

    const data = {
        labels: categoryCounts.map((c) => c.name),
        datasets: [
            {
                label: "Count categories",
                data: categoryCounts.map((c) => c.count),
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
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <div className="w-full max-w-[400px] h-auto flex justify-center mx-auto ">
            <Bar data={data} options={options} />
        </div>
    );
};

const CustomerTable = () => {
    const { customers } = useDataAdmin();
    const { productsLoading, productsError } = useProducts();

    if (productsLoading) return <p>Loading...</p>;
    if (productsError) return <p>Error loading products</p>;

    const columns = [
        {
            title: "First Name",
            dataIndex: "firstname",
            key: "firstname",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Last Name",
            dataIndex: "lastname",
            key: "lastname",
            ellipsis: true,
            width: 150,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
            width: 400,
        },
    ];

    const dataSource = customers.map((customer) => ({
        key: customer.id,
        firstname: customer.firstname || "-",
        lastname: customer.lastname || "-",
        email: customer.email || "-",
        address: customer.address || "No Address Provided",
    }));

    return (
        <Table
            pagination={{ pageSize: 3 }}
            columns={columns}
            dataSource={dataSource}
            size="small"
            bordered
            scroll={{ x: true }}
        />
    );
};

export default Dashboard;
