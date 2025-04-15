import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaFilter, FaDownload } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VisualizePayments = ({ setIsLoggedIn, setUserRole }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterDate, setFilterDate] = useState({ start: "", end: "" });
    const navigate = useNavigate();

    // Fetch payments
    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const config = { withCredentials: true };
                const response = await axios.get(
                    "http://localhost:3337/api/parentpayments/getAllParentPayments",
                    config
                );
                setPayments(response.data || []);
                console.log("Payments fetched for visualization:", response.data);
            } catch (error) {
                console.error("Error fetching payments:", error);
                toast.error(error.response?.data?.message || "Failed to load payments", {
                    position: "top-right",
                });
                if (error.response?.status === 401) {
                    toast.error("Session expired. Please log in again.", {
                        position: "top-right",
                    });
                    setIsLoggedIn(false);
                    setUserRole(null);
                    navigate("/manager/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [setIsLoggedIn, setUserRole, navigate]);

    // Filter payments by date
    const filterByDate = (data) => {
        return data.filter((item) => {
            const itemDate = new Date(item.payment_date);
            const start = filterDate.start ? new Date(filterDate.start) : null;
            const end = filterDate.end ? new Date(filterDate.end) : null;
            return (!start || itemDate >= start) && (!end || itemDate <= end);
        });
    };

    const filteredPayments = filterByDate(payments);
    const totalIncome = filteredPayments.reduce((sum, pay) => sum + Number(pay.amount), 0);

    // Aggregate by session type
    const paymentByType = filteredPayments.reduce((acc, pay) => {
        acc[pay.session_type] = (acc[pay.session_type] || 0) + Number(pay.amount);
        return acc;
    }, {});

    // Export to CSV
    const exportToCSV = () => {
        const headers = ["Child Name,Amount,Session Type,Payment Date,Status"];
        const rows = filteredPayments.map((pay) =>
            `${pay.child_name || "N/A"},${(Number(pay.amount) || 0).toFixed(2)},${pay.session_type || "N/A"},${pay.payment_date ? new Date(pay.payment_date).toLocaleDateString() : "N/A"},${pay.status || "N/A"}`
        );
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "payments.csv";
        link.click();
        window.URL.revokeObjectURL(url);
    };

    // Chart data
    const chartData = {
        labels: Object.keys(paymentByType),
        datasets: [
            {
                label: "Income by Session Type",
                data: Object.values(paymentByType),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterDate((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FaCreditCard className="mr-2 text-green-600" />
                    Payments Visualization
                </h1>
                <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center transition-all duration-200"
                >
                    <FaDownload className="mr-2" />
                    Export CSV
                </button>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
                    <FaFilter className="mr-2 text-indigo-500" />
                    Filter by Date
                </h2>
                <div className="flex space-x-4">
                    <input
                        type="date"
                        name="start"
                        value={filterDate.start}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <input
                        type="date"
                        name="end"
                        value={filterDate.end}
                        onChange={handleFilterChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                    <FaCreditCard className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No payments found for the selected date range.</p>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Total Income: ${(Number(totalIncome) || 0).toFixed(2)}
                        </h2>
                        <div className="mt-4 h-64">
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: "top" },
                                        title: { display: true, text: "Income by Session Type" },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default VisualizePayments;