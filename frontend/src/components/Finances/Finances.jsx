import React, { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaFilter, FaDownload, FaCalendar } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

//Handles rendering the finances of the Daycare
const Finances = ({ setIsLoggedIn, setUserRole }) => {
	const [payments, setPayments] = useState([]); //The useState for the payments which is an array
	const [expenses, setExpenses] = useState([]); //The useState for the expenses which is an array
	const [loading, setLoading] = useState(true);
	const [filterDate, setFilterDate] = useState({ start: "", end: "" });
	const navigate = useNavigate();

	// Fetch finances
	useEffect(() => {
		const fetchFinances = async () => {
			setLoading(true);
			try {
				const config = { withCredentials: true };
				const paymentResponse = await axios.get(
					"http://localhost:3337/api/parentpayments/getAllParentPayments",
					config
				);
				setPayments(paymentResponse.data || []);
				const expenseResponse = await axios.get(
					"http://localhost:3337/api/expenses/getAllExpenses",
					config
				);
				setExpenses(expenseResponse.data || []);
				console.log("Payments fetched:", paymentResponse.data);
				console.log("Expenses fetched:", expenseResponse.data);
			} catch (error) {
				console.error("Error fetching finances:", error);
				toast.error(
					error.response?.data?.message || "Failed to load finances",
					{
						position: "top-right",
					}
				);
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
		fetchFinances();
	}, [setIsLoggedIn, setUserRole, navigate]);

	// Filter by date
	const filterByDate = (data, dateField) => {
		return data.filter((item) => {
			const itemDate = new Date(item[dateField]);
			const start = filterDate.start ? new Date(filterDate.start) : null;
			const end = filterDate.end ? new Date(filterDate.end) : null;
			return (!start || itemDate >= start) && (!end || itemDate <= end);
		});
	};

	const filteredPayments = filterByDate(payments, "payment_date");
	const filteredExpenses = filterByDate(expenses, "expense_date");
	const totalIncome = filteredPayments.reduce(
		(sum, pay) => sum + Number(pay.amount),
		0
	);
	const totalExpenses = filteredExpenses.reduce(
		(sum, exp) => sum + Number(exp.amount),
		0
	);
	const netBalance = totalIncome - totalExpenses;

	// Daily summary
	const dailySummary = [...filteredPayments, ...filteredExpenses].reduce(
		(acc, item) => {
			const date = new Date(
				item.payment_date || item.expense_date
			).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
			if (!acc[date]) acc[date] = { income: 0, expenses: 0 };
			if (item.session_type) acc[date].income += Number(item.amount);
			else acc[date].expenses += Number(item.amount);
			return acc;
		},
		{}
	);

	// Chart data
	const chartData = {
		labels: Object.keys(dailySummary),
		datasets: [
			{
				label: "Income",
				data: Object.values(dailySummary).map((d) => d.income),
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				fill: false,
			},
			{
				label: "Expenses",
				data: Object.values(dailySummary).map((d) => d.expenses),
				borderColor: "rgba(255, 99, 132, 1)",
				backgroundColor: "rgba(255, 99, 132, 0.2)",
				fill: false,
			},
		],
	};

	// Export to CSV
	const exportToCSV = () => {
		const headers = [
			"Type,Child Name/Description,Amount,Session Type/Category,Date,Status",
		];
		const paymentRows = filteredPayments.map(
			(pay) =>
				`Income,${pay.child_name || "N/A"},${(Number(pay.amount) || 0).toFixed(
					2
				)},${pay.session_type || "N/A"},${
					pay.payment_date
						? new Date(pay.payment_date).toLocaleDateString()
						: "N/A"
				},${pay.status || "N/A"}`
		);
		const expenseRows = filteredExpenses.map(
			(exp) =>
				`Expense,${exp.description || "N/A"},${(
					Number(exp.amount) || 0
				).toFixed(2)},${exp.category || "N/A"},${
					exp.expense_date
						? new Date(exp.expense_date).toLocaleDateString()
						: "N/A"
				},N/A`
		);
		const csvContent = [headers, ...paymentRows, ...expenseRows].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "finances.csv";
		link.click();
		window.URL.revokeObjectURL(url);
	};

	// Handle filter change
	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilterDate((prev) => ({ ...prev, [name]: value }));
	};

	// Format date
	const formatDate = (dateString) => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch (error) {
			console.error("Error formatting date:", error);
			return dateString || "N/A";
		}
	};

	return (
		<div className='p-6 max-w-[1400px] mx-auto bg-white rounded-lg shadow'>
			<div className='flex items-center justify-between mb-6'>
				<h1 className='text-3xl font-bold text-gray-800 flex items-center border-b-2 border-gray-200 pb-4'>
					<FaChartLine className='mr-2 text-indigo-600' />
					Finances Overview
				</h1>
				<button
					onClick={exportToCSV}
					className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center transition-all duration-200'>
					<FaDownload className='mr-2' />
					Export CSV
				</button>
			</div>

			<div className='mb-6'>
				<h2 className='text-lg font-semibold text-gray-700 flex items-center mb-2'>
					<FaFilter className='mr-2 text-indigo-500' />
					Filter by Date
				</h2>
				<div className='flex space-x-4'>
					<input
						type='date'
						name='start'
						value={filterDate.start}
						onChange={handleFilterChange}
						className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
					/>
					<input
						type='date'
						name='end'
						value={filterDate.end}
						onChange={handleFilterChange}
						className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
					/>
				</div>
			</div>

			{loading ? (
				<div className='flex justify-center items-center min-h-[60vh]'>
					<div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
				</div>
			) : Object.keys(dailySummary).length === 0 &&
			  !filterDate.start &&
			  !filterDate.end ? (
				<div className='text-center py-12'>
					<FaChartLine className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No transactions found.</p>
				</div>
			) : (
				<>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
						<div className='bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-200'>
							<h2 className='text-lg font-semibold text-gray-700'>
								Total Income
							</h2>
							<p className='text-2xl font-bold text-green-600'>
								Shs{(Number(totalIncome) || 0).toFixed(2)}
							</p>
						</div>
						<div className='bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-200'>
							<h2 className='text-lg font-semibold text-gray-700'>
								Total Expenses
							</h2>
							<p className='text-2xl font-bold text-red-600'>
								Shs{(Number(totalExpenses) || 0).toFixed(2)}
							</p>
						</div>
						<div className='bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-200'>
							<h2 className='text-lg font-semibold text-gray-700'>Balance</h2>
							<p
								className={`text-2xl font-bold ${
									netBalance >= 0 ? "text-green-600" : "text-red-600"
								}`}>
								Shs{(Number(netBalance) || 0).toFixed(2)}
							</p>
						</div>
					</div>

					<div className='mb-6'>
						<h2 className='text-lg font-semibold text-gray-700'>
							Daily Trends
						</h2>
						<div className='mt-4 h-64'>
							<Line
								data={chartData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: { position: "top" },
										title: { display: true, text: "Income vs Expenses" },
									},
								}}
							/>
						</div>
					</div>

					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Date
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Income
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Expenses
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Net Balance
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{Object.entries(dailySummary).map(
										([date, { income, expenses }]) => (
											<tr key={date} className='hover:bg-gray-50'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='flex items-center'>
														<div className='flex-shrink-0 h-10 w-10'>
															<div className='bg-gray-100 p-2 rounded-full'>
																<FaCalendar className='text-black text-xl' />
															</div>
														</div>
														<div className='ml-4'>
															<div className='text-sm font-medium text-gray-900'>
																{formatDate(date)}
															</div>
														</div>
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-green-600 font-medium'>
														Shs{(Number(income) || 0).toFixed(2)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-red-600 font-medium'>
														Shs{(Number(expenses) || 0).toFixed(2)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div
														className={`text-sm font-medium ${
															income - expenses >= 0
																? "text-green-600"
																: "text-red-600"
														}`}>
														Shs{(Number(income - expenses) || 0).toFixed(2)}
													</div>
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Finances;
