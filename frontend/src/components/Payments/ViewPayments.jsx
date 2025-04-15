import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
	FaCreditCard,
	FaTrash,
	FaEdit,
	FaEnvelope,
	FaUser,
	FaCalendar,
} from "react-icons/fa";

const ViewPayments = ({ setIsLoggedIn, setUserRole }) => {
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showDeleteDialog, setShowDeleteDialog] = useState(null);
	const [editPaymentId, setEditPaymentId] = useState(null);
	const [showReminderDialog, setShowReminderDialog] = useState(null);
	const navigate = useNavigate();

	// Fetch payments
	useEffect(() => {
		const fetchPayments = async () => {
			try {
				const config = { withCredentials: true };
				const response = await axios.get(
					"http://localhost:3337/api/parentpayments/getAllParentPayments",
					config
				);
				setPayments(response.data);
				console.log("Payments fetched:", response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching payments:", error);
				toast.error(
					error.response?.data?.message || "Failed to load payments",
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
		fetchPayments();
	}, [setIsLoggedIn, setUserRole, navigate]);

	// Handle delete payment
	const handleDelete = async (id) => {
		try {
			const config = { withCredentials: true };
			await axios.delete(
				`http://localhost:3337/api/parentpayments/deleteParentPayment/${id}`,
				config
			);
			setPayments(payments.filter((payment) => payment.id !== id));
			toast.success("Payment deleted successfully", { position: "top-right" });
			console.log("Payment deleted:", id);
			setShowDeleteDialog(null);
		} catch (error) {
			console.error("Error deleting payment:", error);
			toast.error(error.response?.data?.message || "Failed to delete payment", {
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
		}
	};

	// Handle update payment
	const handleUpdate = async (id, status) => {
		try {
			const config = { withCredentials: true };
			const response = await axios.put(
				`http://localhost:3337/api/parentpayments/updateParentPayment/${id}`,
				{ status },
				config
			);
			setPayments(
				payments.map((payment) =>
					payment.id === id ? { ...payment, status } : payment
				)
			);
			toast.success("Payment status updated successfully", {
				position: "top-right",
			});
			console.log("Status updated:", response.data);
			setEditPaymentId(null);
		} catch (error) {
			console.error("Error updating payment:", error);
			toast.error(error.response?.data?.message || "Failed to update payment", {
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
		}
	};

	// Handle send reminder
	const handleSendReminder = async (id) => {
		try {
			const config = { withCredentials: true };
			const response = await axios.post(
				`http://localhost:3337/api/parentpayments/sendPaymentReminder/${id}`,
				{},
				config
			);
			toast.success("Payment reminder sent successfully", {
				position: "top-right",
			});
			console.log("Reminder sent:", response.data);
			setShowReminderDialog(null);
		} catch (error) {
			console.error("Error sending reminder:", error);
			toast.error(error.response?.data?.message || "Failed to send reminder", {
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
		}
	};

	// Open dialogs
	const handleOpenDeleteDialog = (id) => setShowDeleteDialog(id);
	const handleOpenEdit = (id) => setEditPaymentId(id);
	const handleOpenReminderDialog = (id) => setShowReminderDialog(id);

	// Close dialogs
	const handleCancel = () => {
		setShowDeleteDialog(null);
		setEditPaymentId(null);
		setShowReminderDialog(null);
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

	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-[60vh]'>
				<div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500'></div>
			</div>
		);
	}

	return (
		<div>
			{payments.length === 0 ? (
				<div className='text-center py-12 bg-white rounded-lg shadow-md'>
					<FaCreditCard className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No payments found.</p>
				</div>
			) : (
				<div className='space-y-4'>
					{payments.map((payment) => (
						<div
							key={payment.id}
							className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1'>
							<div className='p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
								<div className='flex items-center space-x-4'>
									<div className='bg-gray-100 p-3 rounded-full'>
										<FaCreditCard className='text-black text-xl' />
									</div>
									<div>
										<h3 className='text-xl font-semibold text-gray-800 mb-2'>
											Payment Details
										</h3>
										<div className='text-gray-600 space-y-1'>
											<p className='flex items-center'>
												<FaUser className='mr-2 text-gray-500' />
												<strong>Child:</strong> {payment.child_name || "N/A"}
											</p>
											<p className='flex items-center'>
												<FaCalendar className='mr-2 text-gray-500' />
												<strong>Ssession Date:</strong>{" "}
												{formatDate(payment.schedule_date)}
											</p>
											<p>
												<strong>Amount:</strong> Shs{" "}
												{(Number(payment.amount) || 0).toFixed(0)}
											</p>
											<p>
												<strong>Payment Date:</strong>{" "}
												{formatDate(payment.payment_date)}
											</p>
											<p>
												<strong>Session Type:</strong>{" "}
												{payment.session_type || "N/A"}
											</p>
											<p>
												<strong>Status:</strong>{" "}
												<span
													className={
														payment.status === "paid"
															? "text-green-600"
															: payment.status === "pending"
															? "text-yellow-600"
															: "text-red-600"
													}>
													{payment.status || "N/A"}
												</span>
											</p>
										</div>
									</div>
								</div>
								<div className='flex md:flex-col space-x-2 md:space-x-0 md:space-y-2'>
									<FaEdit
										onClick={() => handleOpenEdit(payment.id)}
										className='p-2 text-gray-600 hover:text-yellow-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
										title='Update Status'
									/>
									{(payment.status === "pending" ||
										payment.status === "overdue") && (
										<FaEnvelope
											onClick={() => handleOpenReminderDialog(payment.id)}
											className='p-2 text-gray-600 hover:text-blue-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
											title='Send Reminder'
										/>
									)}
									<FaTrash
										onClick={() => handleOpenDeleteDialog(payment.id)}
										className='p-2 text-gray-600 hover:text-red-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
										title='Delete Payment'
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
							Are you sure you want to delete this payment? This action cannot
							be undone.
						</p>
						<div className='flex space-x-4'>
							<button
								onClick={() => handleDelete(showDeleteDialog)}
								className='flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-[1.02]'>
								Delete
							</button>
							<button
								onClick={handleCancel}
								className='flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02]'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Update Status Modal */}
			{editPaymentId && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all'>
						<h3 className='text-2xl font-bold mb-4 text-gray-800'>
							Update Payment Status
						</h3>
						<p className='text-gray-600 mb-6'>
							Set the status for this payment.
						</p>
						<div className='space-y-4'>
							<button
								onClick={() => handleUpdate(editPaymentId, "paid")}
								className='w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-[1.02]'>
								Mark as Paid
							</button>
							<button
								onClick={() => handleUpdate(editPaymentId, "pending")}
								className='w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-[1.02]'>
								Mark as Pending
							</button>
							<button
								onClick={() => handleUpdate(editPaymentId, "overdue")}
								className='w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-[1.02]'>
								Mark as Overdue
							</button>
							<button
								onClick={handleCancel}
								className='w-full p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02]'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Reminder Confirmation Dialog */}
			{showReminderDialog && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all'>
						<h3 className='text-2xl font-bold mb-4 text-gray-800'>
							Send Payment Reminder
						</h3>
						<p className='text-gray-600 mb-8'>
							Are you sure you want to send a payment reminder to the
							parent/guardian?
						</p>
						<div className='flex space-x-4'>
							<button
								onClick={() => handleSendReminder(showReminderDialog)}
								className='flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02]'>
								Send Reminder
							</button>
							<button
								onClick={handleCancel}
								className='flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02]'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewPayments;
