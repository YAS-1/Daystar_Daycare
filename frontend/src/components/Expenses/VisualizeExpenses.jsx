import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaFilter, FaDownload, FaList, FaCalendar } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const VisualizeExpenses = ({ setIsLoggedIn, setUserRole }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterDate, setFilterDate] = useState({ start: "", end: "" });
    const navigate = useNavigate();

    const budgetThresholds = {
        "Babysitter Salaries": 5000000,
        Toys: 200000,
        Maintenance: 500000,
        Utilities: 500000,
    };

    // Fetch expenses
    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            try {
                const config = { withCredentials: true };
                const response = await axios.get(
                    "http://localhost:3337/api/expenses/getAllExpenses",
                    config
                );
                setExpenses(response.data || []);
                console.log("Expenses fetched for visualization:", response.data);
            } catch (error) {
                console.error("Error fetching expenses:", error);
                toast.error(error.response?.data?.message || "Failed to load expenses", {
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
        fetchExpenses();
    }, [setIsLoggedIn, setUserRole, navigate]);

    // Filter expenses by date
    const filterByDate = (data) => {
        return data.filter((item) => {
            const itemDate = new Date(item.expense_date);
            const start = filterDate.start ? new Date(filterDate.start) : null;
            const end = filterDate.end ? new Date(filterDate.end) : null;
            return (!start || itemDate >= start) && (!end || itemDate <= end);
        });
    };

    const filteredExpenses = filterByDate(expenses);
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Aggregate by category
    const expenseByCategory = filteredExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
        return acc;
    }, {});

    // Budget threshold alerts
    useEffect(() => {
        Object.entries(expenseByCategory).forEach(([category, amount]) => {
            if (budgetThresholds[category] && amount > budgetThresholds[category]) {
                toast.warn(
                    `Shs{category} exceeds budget of Shs${budgetThresholds[category]}! Current: Shs${(Number(amount) || 0).toFixed(2)}`,
                    { position: "top-right" }
                );
            }
        });
    }, [expenseByCategory]);

    // Export to CSV
    const exportToCSV = () => {
        const headers = ["Category,Amount,Expense Date,Description"];
        const rows = filteredExpenses.map((exp) =>
            `${exp.category || "N/A"},${(Number(exp.amount) || 0).toFixed(2)},${exp.expense_date ? new Date(exp.expense_date).toLocaleDateString() : "N/A"},${exp.description || "N/A"}`
        );
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "expenses.csv";
        link.click();
        window.URL.revokeObjectURL(url);
    };

    // Chart data
    const chartData = {
        labels: Object.keys(expenseByCategory),
        datasets: [
            {
                label: "Expenses by Category",
                data: Object.values(expenseByCategory),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
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
                    <FaMoneyBillWave className="mr-2 text-red-600" />
                    Expenses Visualization
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
            ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-12">
                    <FaMoneyBillWave className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No expenses found for the selected date range.</p>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Total Expenses: Shs{(Number(totalExpenses) || 0).toFixed(0)}
                        </h2>
                        <div className="mt-4 h-64">
                            <Pie
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: "top" },
                                        title: { display: true, text: "Expenses by Category" },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filteredExpenses.map((expense) => (
                            <div
                                key={expense.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1"
                            >
                                <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <FaMoneyBillWave className="text-black text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                Expense Details
                                            </h3>
                                            <div className="text-gray-600 space-y-1">
                                                <p className="flex items-center">
                                                    <FaList className="mr-2 text-gray-500" />
                                                    Category: {expense.category || "N/A"}
                                                </p>
                                                <p>Amount: ${(Number(expense.amount) || 0).toFixed(2)}</p>
                                                <p className="flex items-center">
                                                    <FaCalendar className="mr-2 text-gray-500" />
                                                    Date: {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }) : "N/A"}
                                                </p>
                                                <p>Description: {expense.description || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default VisualizeExpenses;