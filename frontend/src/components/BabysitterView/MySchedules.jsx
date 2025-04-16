import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendar } from "react-icons/fa";

const MySchedules = ({ setIsLoggedIn, setUserRole, formatDate, navigate }) => {
	const [schedules, setSchedules] = useState([]);
	const [loadingSchedules, setLoadingSchedules] = useState(true);

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

	return (
		<section className='mb-12'>
			<h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center'>
				<FaCalendar className='mr-2 text-blue-500' />
				My Schedule
			</h2>
			{loadingSchedules ? (
				<div className='flex justify-center items-center min-h-[20vh]'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500'></div>
				</div>
			) : schedules.length === 0 ? (
				<div className='bg-white rounded-lg shadow p-6 text-center'>
					<FaCalendar className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No schedules found.</p>
				</div>
			) : (
				<div className='bg-white rounded-xl shadow-md overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Child Name
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Date
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Session Type
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Attendance Status
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{schedules.map((schedule, index) => (
									<tr key={index} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<div className='bg-gray-100 p-2 rounded-full'>
														<FaCalendar className='text-blue-500 text-xl' />
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
												{formatDate(schedule.date)}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{schedule.session_type || "N/A"}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{schedule.attendance_status || "N/A"}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</section>
	);
};

export default MySchedules;
