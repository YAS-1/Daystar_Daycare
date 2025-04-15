import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCalendar, FaTrash, FaEdit, FaUser, FaChild } from "react-icons/fa";

const ViewSchedules = ({ setIsLoggedIn, setUserRole }) => {
	const [schedules, setSchedules] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showDeleteDialog, setShowDeleteDialog] = useState(null);
	const [editScheduleId, setEditScheduleId] = useState(null);
	const navigate = useNavigate();

	// Fetch schedules
	useEffect(() => {
		const fetchSchedules = async () => {
			try {
				const config = { withCredentials: true };
				const response = await axios.get(
					"http://localhost:3337/api/schedules/getAllSchedules",
					config
				);
				setSchedules(response.data.schedules);
				console.log("Schedules fetched:", response.data.schedules);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching schedules:", error);
				toast.error(
					error.response?.data?.message || "Failed to load schedules",
					{
						position: "top-right",
					}
				);
				setLoading(false);
				if (error.response?.status === 401) {
					toast.error("Session expired. Please log in again.", {
						position: "top-right",
					});
					setIsLoggedIn(false);
					setUserRole(null);
					navigate("/manager/login");
				}
			}
		};
		fetchSchedules();
	}, [setIsLoggedIn, setUserRole, navigate]);

	// Handle delete schedule
	const handleDelete = async (id) => {
		try {
			const config = { withCredentials: true };
			await axios.delete(
				`http://localhost:3337/api/schedules/deleteSchedule/${id}`,
				config
			);
			setSchedules(schedules.filter((schedule) => schedule.id !== id));
			toast.success("Schedule deleted successfully", { position: "top-right" });
			console.log("Schedule deleted:", id);
			setShowDeleteDialog(null);
		} catch (error) {
			console.error("Error deleting schedule:", error);
			toast.error(
				error.response?.data?.message || "Failed to delete schedule",
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
		}
	};

	// Handle update attendance status
	const handleUpdateAttendance = async (id, status) => {
		try {
			const config = { withCredentials: true };
			const response = await axios.put(
				`http://localhost:3337/api/schedules/changeAttendanceStatus/${id}`,
				{ attendance_status: status },
				config
			);
			setSchedules(
				schedules.map((schedule) =>
					schedule.id === id
						? { ...schedule, attendance_status: status }
						: schedule
				)
			);
			toast.success("Attendance status updated successfully", {
				position: "top-right",
			});
			console.log("Attendance updated:", response.data);
			setEditScheduleId(null);
		} catch (error) {
			console.error("Error updating attendance:", error);
			toast.error(
				error.response?.data?.message || "Failed to update attendance",
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
		}
	};

	// Open delete dialog
	const handleOpenDeleteDialog = (id) => {
		setShowDeleteDialog(id);
	};

	// Open edit attendance modal
	const handleOpenEdit = (id) => {
		setEditScheduleId(id);
	};

	// Close dialogs
	const handleCancel = () => {
		setShowDeleteDialog(null);
		setEditScheduleId(null);
	};

	// Format date to a readable format (e.g., "April 5, 2025")
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
			return dateString; // Fallback to raw string if parsing fails
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-[60vh]'>
				<div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
			</div>
		);
	}

	return (
		<div>
			{schedules.length === 0 ? (
				<div className='text-center py-12 bg-white rounded-lg shadow-md'>
					<FaCalendar className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No schedules found.</p>
				</div>
			) : (
				<div className='space-y-4'>
					{schedules.map((schedule) => (
						<div
							key={schedule.id}
							className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1'>
							<div className='p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
								<div className='flex items-center space-x-4'>
									<div className='bg-gray-100 p-3 rounded-full'>
										<FaCalendar className='text-black text-xl' />
									</div>
									<div>
										<h3 className='text-xl font-semibold text-gray-800 mb-2'>
											Schedule Details
										</h3>
										<div className='text-gray-600 space-y-1'>
											<p className='flex items-center'>
												<FaUser className='mr-2 text-gray-500' />
												<strong>Babysitter</strong>: {schedule.babysitter_name}
											</p>
											<p className='flex items-center'>
												<FaChild className='mr-2 text-gray-500' />
												<strong>Child:</strong> {schedule.child_name}
											</p>
											<p>
												<strong>Date:</strong> {formatDate(schedule.date)}
											</p>
											<p>
												<strong>Session:</strong> {schedule.session_type}
											</p>
											<p>
												<strong>Attendance:</strong>{" "}
												<span
													className={
														schedule.attendance_status === "present"
															? "text-green-600"
															: schedule.attendance_status === "absent"
															? "text-red-600"
															: "text-gray-600"
													}>
													{schedule.attendance_status || "Not set"}
												</span>
											</p>
										</div>
									</div>
								</div>
								<div className='flex md:flex-col space-x-2 md:space-x-0 md:space-y-2'>
									<FaEdit
										onClick={() => handleOpenEdit(schedule.id)}
										className='p-2 text-gray-600 hover:text-yellow-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
										title='Edit Schedule'
									/>
									<FaTrash
										onClick={() => handleOpenDeleteDialog(schedule.id)}
										className='p-2 text-gray-600 hover:text-red-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
										title='Delete Schedule'
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			{showDeleteDialog && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all'>
						<h3 className='text-2xl font-bold mb-4 text-gray-800'>
							Confirm Delete
						</h3>
						<p className='text-gray-600 mb-8'>
							Are you sure you want to delete this schedule? This action cannot
							be undone.
						</p>
						<div className='flex space-x-4'>
							<button
								onClick={() => handleDelete(showDeleteDialog)}
								className='flex-1 p-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'>
								Delete
							</button>
							<button
								onClick={handleCancel}
								className='flex-1 p-3 text-white bg-gray-400 rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Attendance Modal */}
			{showDeleteDialog && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all'>
						<h3 className='text-2xl font-bold mb-4 text-gray-800'>
							Confirm Delete
						</h3>
						<p className='text-gray-600 mb-8'>
							Are you sure you want to delete this schedule? This action cannot
							be undone.
						</p>
						<div className='flex space-x-4'>
							<button
								onClick={() => handleDelete(showDeleteDialog)}
								className='flex-1 p-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'>
								Delete
							</button>
							<button
								onClick={handleCancel}
								className='flex-1 p-3 text-white bg-gray-400 rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Attendance Modal */}
			{editScheduleId && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all'>
						<h3 className='text-2xl font-bold mb-4 text-gray-800'>
							Update Attendance
						</h3>
						<p className='text-gray-600 mb-6'>
							Set the attendance status for this schedule.
						</p>
						<div className='space-y-4'>
							<button
								onClick={() =>
									handleUpdateAttendance(editScheduleId, "present")
								}
								className='w-full p-3 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'>
								Mark as Present
							</button>
							<button
								onClick={() => handleUpdateAttendance(editScheduleId, "absent")}
								className='w-full p-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'>
								Mark as Absent
							</button>
							<button
								onClick={handleCancel}
								className='w-full p-3 text-white bg-gray-400 rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewSchedules;
