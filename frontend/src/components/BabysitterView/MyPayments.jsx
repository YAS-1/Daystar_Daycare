import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaMoneyBillWave } from "react-icons/fa";

const MyPayments = ({ setIsLoggedIn, setUserRole, formatDate, navigate }) => {
	const [schedules, setSchedules] = useState([]);
	const [loadingSchedules, setLoadingSchedules] = useState(true);
	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		const fetchSchedules = async () => {
			try {
				setLoadingSchedules(true);
				const response = await axios.get(
					"http://localhost:3337/api/babysitter/mySchedule",
					{ withCredentials: true }
				);
				setSchedules(response.data.data || []);
				console.log("Schedules fetched:", response.data.data);
			} catch (error) {
				console.error("Error fetching schedules:", error);
				toast.error(
					error.response?.data?.message || "Failed to load schedules",
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
					navigate("/babysitter/login");
				}
			} finally {
				setLoadingSchedules(false);
			}
		};
		fetchSchedules();
	}, [setIsLoggedIn, setUserRole, navigate]);

	// Debug logging
	console.log("Today's date:", today);
	console.log("All schedules:", schedules);

	const todaySchedules = schedules.filter((schedule) => {
		const scheduleDate = new Date(schedule.date);
		const scheduleDateStr = scheduleDate.toISOString().split("T")[0];
		console.log("Comparing dates:", {
			scheduleDate: scheduleDateStr,
			today: today,
			match: scheduleDateStr === today,
		});
		return scheduleDateStr === today;
	});

	console.log("Today's schedules:", todaySchedules);

	const calculatePayment = (schedule) => {
		if (schedule.session_type === "half-day") {
			return 2000;
		} else if (schedule.session_type === "full-day") {
			return 5000;
		}
		return 0;
	};

	const totalPayment = todaySchedules.reduce((sum, schedule) => {
		return sum + calculatePayment(schedule);
	}, 0);

	return (
		<section className='mb-12'>
			<h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center'>
				<FaMoneyBillWave className='mr-2 text-green-500' />
				My Payments (Today: {formatDate(today)})
			</h2>
			{loadingSchedules ? (
				<div className='flex justify-center items-center min-h-[20vh]'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500'></div>
				</div>
			) : todaySchedules.length === 0 ? (
				<div className='bg-white rounded-lg shadow p-6 text-center'>
					<FaMoneyBillWave className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No schedules for today.</p>
				</div>
			) : (
				<div className='space-y-4'>
					<div className='bg-white rounded-xl shadow-md overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Child Name
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Session Type
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Amount
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{todaySchedules.map((schedule, index) => (
										<tr key={index} className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='flex-shrink-0 h-10 w-10'>
														<div className='bg-gray-100 p-2 rounded-full'>
															<FaMoneyBillWave className='text-green-500 text-xl' />
														</div>
													</div>
													<div className='ml-4'>
														<div className='text-sm font-medium text-gray-900'>
															{schedule.child_name}
														</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>
													{schedule.session_type || "N/A"}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm font-medium text-green-600'>
													Shs{calculatePayment(schedule).toFixed(2)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
								<tfoot className='bg-gray-50'>
									<tr>
										<td
											colSpan='2'
											className='px-6 py-4 text-right text-sm font-medium text-gray-900'>
											Total Payment:
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600'>
											Shs{totalPayment.toFixed(2)}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

export default MyPayments;
