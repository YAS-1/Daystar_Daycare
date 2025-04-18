import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
	FaExclamationTriangle,
	FaTrash,
	FaEdit,
	FaPaperPlane,
	FaUser,
	FaChild,
} from "react-icons/fa";

const ViewIncidents = ({ setIsLoggedIn, setUserRole }) => {
	const [incidents, setIncidents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showDeleteDialog, setShowDeleteDialog] = useState(null);
	const [editIncidentId, setEditIncidentId] = useState(null);
	const [showEmailDialog, setShowEmailDialog] = useState(null);
	const navigate = useNavigate();

	// Fetch incidents
	useEffect(() => {
		const fetchData = async () => {
			try {
				const config = { withCredentials: true };

				// Fetch incidents
				const incidentResponse = await axios.get(
					"http://localhost:3337/api/incidents/getAllIncidents",
					config
				);
				setIncidents(incidentResponse.data.incidents);
				console.log("Incidents fetched:", incidentResponse.data.incidents);

				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error(error.response?.data?.message || "Failed to load data", {
					position: "top-right",
				});
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
		fetchData();
	}, [setIsLoggedIn, setUserRole, navigate]);

	// Handle delete incident
	const handleDelete = async (id) => {
		try {
			const config = { withCredentials: true };
			await axios.delete(
				`http://localhost:3337/api/incidents/deleteIncident/${id}`,
				config
			);
			setIncidents(incidents.filter((incident) => incident.id !== id));
			toast.success("Incident deleted successfully", { position: "top-right" });
			console.log("Incident deleted:", id);
			setShowDeleteDialog(null);
		} catch (error) {
			console.error("Error deleting incident:", error);
			toast.error(
				error.response?.data?.message || "Failed to delete incident",
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

	// Handle update incident status
	const handleUpdateStatus = async (id, status) => {
		try {
			const config = { withCredentials: true };
			const response = await axios.put(
				`http://localhost:3337/api/incidents/updateIncident/${id}`,
				{ status },
				config
			);
			setIncidents(
				incidents.map((incident) =>
					incident.id === id ? { ...incident, status } : incident
				)
			);
			toast.success("Incident status updated successfully", {
				position: "top-right",
			});
			console.log("Status updated:", response.data);
			setEditIncidentId(null);
		} catch (error) {
			console.error("Error updating status:", error);
			toast.error(error.response?.data?.message || "Failed to update status", {
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

	// Handle send email
	const handleSendEmail = async (id) => {
		try {
			const config = { withCredentials: true };
			const response = await axios.post(
				`http://localhost:3337/api/incidents/sendIncidentEmail/${id}`,
				{},
				config
			);
			toast.success("Incident email sent successfully", {
				position: "top-right",
			});
			console.log("Email sent:", response.data);
			setShowEmailDialog(null);
		} catch (error) {
			console.error("Error sending email:", error);
			toast.error(error.response?.data?.message || "Failed to send email", {
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
	const handleOpenEdit = (id) => setEditIncidentId(id);
	const handleOpenEmailDialog = (id) => setShowEmailDialog(id);

	// Close dialogs
	const handleCancel = () => {
		setShowDeleteDialog(null);
		setEditIncidentId(null);
		setShowEmailDialog(null);
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
			return dateString;
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
		<div className='p-6 max-w-[1400px] mx-auto'>
			<h2 className='text-3xl font-bold mb-8 text-gray-800 border-b-2 border-gray-200 pb-4'>
				Incidents Management
			</h2>

			{/* Incidents List */}
			{incidents.length === 0 ? (
				<div className='text-center py-12 bg-white rounded-xl shadow-md'>
					<FaExclamationTriangle className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No incidents found.</p>
				</div>
			) : (
				<div className='bg-white rounded-xl shadow-md overflow-hidden w-full'>
					<div className='overflow-x-auto max-w-full'>
						<table className='w-full divide-y divide-gray-200 table-auto'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Date
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Babysitter
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Child
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Type
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Description
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Status
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{incidents.map((incident) => (
									<tr key={incident.id} className='hover:bg-gray-50'>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<div className='bg-red-100 p-2 rounded-full'>
														<FaExclamationTriangle className='text-red-500 text-xl' />
													</div>
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-gray-900'>
														{formatDate(incident.incident_date)}
													</div>
												</div>
											</div>
										</td>
										<td className='px-4 py-4'>
											<div className='text-sm text-gray-900'>
												<div className='flex items-center'>
													<FaUser className='mr-2 text-gray-500' />
													{incident.babysitter_name}
												</div>
											</div>
										</td>
										<td className='px-4 py-4'>
											<div className='text-sm text-gray-900'>
												<div className='flex items-center'>
													<FaChild className='mr-2 text-gray-500' />
													{incident.child_name}
												</div>
											</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{incident.incident_type}
											</div>
										</td>
										<td className='px-4 py-4'>
											<div className='text-sm text-gray-900'>
												{incident.description}
											</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												<span
													className={`px-3 py-1 rounded-full text-sm font-medium ${
														incident.status === "resolved"
															? "bg-green-100 text-green-800"
															: "bg-yellow-100 text-yellow-800"
													}`}>
													{incident.status}
												</span>
											</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-right text-sm font-medium'>
											<div className='flex space-x-2'>
												<button
													onClick={() => handleOpenEdit(incident.id)}
													className='text-blue-600 hover:text-blue-900'
													title='Update Status'>
													<FaEdit className='text-xl' />
												</button>
												<button
													onClick={() => handleOpenEmailDialog(incident.id)}
													className='text-green-600 hover:text-green-900'
													title='Send Email'>
													<FaPaperPlane className='text-xl' />
												</button>
												<button
													onClick={() => handleOpenDeleteDialog(incident.id)}
													className='text-red-600 hover:text-red-900'
													title='Delete Incident'>
													<FaTrash className='text-xl' />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
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
							Are you sure you want to delete this incident? This action cannot
							be undone.
						</p>
						<div className='flex space-x-4'>
							<button
								onClick={() => handleDelete(showDeleteDialog)}
								className='flex-1 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'>
								Delete
							</button>
							<button
								onClick={handleCancel}
								className='flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Update Status Modal */}
			{editIncidentId && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all'>
						<h3 className='text-2xl font-bold mb-4 text-gray-800'>
							Update Incident Status
						</h3>
						<p className='text-gray-600 mb-6'>
							Set the status for this incident.
						</p>
						<div className='space-y-4'>
							<button
								onClick={() => handleUpdateStatus(editIncidentId, "pending")}
								className='w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50'>
								Mark as Pending
							</button>
							<button
								onClick={() => handleUpdateStatus(editIncidentId, "resolved")}
								className='w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'>
								Mark as Resolved
							</button>
							<button
								onClick={handleCancel}
								className='w-full p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Email Confirmation Dialog */}
			{showEmailDialog && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all'>
						<h3 className='text-2xl font-bold mb-4 text-gray-800'>
							Send Incident Email
						</h3>
						<p className='text-gray-600 mb-8'>
							Are you sure you want to send the incident email to the
							parent/guardian?
						</p>
						<div className='flex space-x-4'>
							<button
								onClick={() => handleSendEmail(showEmailDialog)}
								className='flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
								Send Email
							</button>
							<button
								onClick={handleCancel}
								className='flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewIncidents;
