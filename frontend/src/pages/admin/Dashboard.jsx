import { Card, Row, Col, Table, Divider } from "antd";
import useDataAdmin from "@hooks/useDataAdmin";
import useProducts from "@hooks/useProducts";
import { useMemo } from "react";
import { ShoppingOutlined, UserOutlined, DollarOutlined, ProductOutlined } from "@ant-design/icons";
import { Line, Pie, Bar } from "react-chartjs-2";
import dayjs from "dayjs";
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
    const { products, categories } = useProducts();
    const { totalProducts, totalCustomers, orderSummary } = useDataAdmin();
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
                            value={orderSummary.summary.lenOrder}
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
                            value={<p>฿{orderSummary.summary.totalValue.toLocaleString("en-US")}</p>}
                        />
                    </Row>
                </Col>
                <Col xs={24} md={12} className="text-center rounded-lg ">
                    <Row gutter={[16, 16]} className="h-full">
                        <Col xs={24} sm={24} md={12}>
                            <div className="flex text-center bg-white rounded-lg p-[10px] shadow-md md:h-full lg:max-h-[243px]">
                                <PieChart
                                    products={products}
                                    categories={categories}
                                    orders={orderSummary.raw_orders}
                                />
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <div className="flex text-center bg-white rounded-lg p-[10px] shadow-md md:h-full lg:max-h-[243px]">
                                <BarChart products={products} categories={categories} />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className="p-[8px]">
                <Col xs={24} sm={24} md={16}>
                    <div className="text-center bg-white rounded-lg p-2 shadow-md">
                        <LineChart orders={orderSummary.orders} />
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
        <Col xs={24} sm={12}>
            <Card className="items-center justify-center w-full max-w-md shadow-md rounded-lg p-4">
                <div className="w-full flex flex-row items-center justify-between flex-wrap gap-6">
                    {icon}
                    <div>
                        <p className="text-lg font-semibold">{title}</p>
                        <p className="text-lg">{value}</p>
                    </div>
                </div>
            </Card>
        </Col>
    );
};

const LineChart = ({ orders }) => {
    const aggregatedData = useMemo(() => {
        const summary = {};
        orders.forEach(({ date, value }) => {
            const formattedDate = dayjs(date).format("YYYY-MM-DD");
            summary[formattedDate] = (summary[formattedDate] || 0) + value;
        });

        const sortedDates = Object.keys(summary).sort();
        return {
            labels: sortedDates,
            values: sortedDates.map((date) => summary[date]),
        };
    }, [orders]);

    const data = {
        labels: aggregatedData.labels,
        datasets: [
            {
                label: "Daily Sales",
                data: aggregatedData.values,
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
        <div className="w-full h-auto max-w-full min-h-[300px] overflow-hidden">
            <Line data={data} options={options} />
        </div>
    );
};

const PieChart = ({ products, categories, orders }) => {
    const categorySales = {};

    orders.forEach((order) => {
        order.order_items.forEach((item) => {
            const product = products.find((p) => p.documentId === item.product_id);
            if (product) {
                const categoryName = product.category.name;
                if (categoryName) {
                    categorySales[categoryName] = (categorySales[categoryName] || 0) + item.price * item.quantity;
                }
            }
        });
    });

    const labels = Object.keys(categorySales);
    const salesData = Object.values(categorySales);

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Sales by Category",
                data: salesData,
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(153, 102, 255)",
                    "rgb(255, 159, 64)",
                ],
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "right",
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        let value = salesData[tooltipItem.dataIndex];
                        return `${labels[tooltipItem.dataIndex]}: ฿${value.toFixed(2)}`;
                    },
                },
            },
        },
    };

    return (
        <div className="w-full max-w-[400px] justify-center mx-auto overflow-hidden">
            <p className="font-bold">Sales by Category (THB)</p>
            <Pie data={data} options={options} />
        </div>
    );
};

const BarChart = ({ products, categories }) => {
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
