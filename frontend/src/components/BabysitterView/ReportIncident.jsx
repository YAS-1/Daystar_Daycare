import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
	FaChild,
	FaExclamationCircle,
	FaFileAlt,
	FaCalendar,
	FaExclamationTriangle,
} from "react-icons/fa";

const ReportIncident = ({
	setIsLoggedIn,
	setUserRole,
	navigate,
	onIncidentCreated,
}) => {
	const [incidentForm, setIncidentForm] = useState({
		child_name: "",
		incident_type: "",
		description: "",
		incident_date: new Date().toISOString().split("T")[0],
	});

	const handleIncidentChange = (e) => {
		const { name, value } = e.target;
		setIncidentForm((prev) => ({ ...prev, [name]: value }));
	};

	const validateIncidentForm = () => {
		if (!incidentForm.child_name.trim()) return "Child name is required";
		if (!incidentForm.incident_type) return "Incident type is required";
		if (!incidentForm.description.trim()) return "Description is required";
		if (!incidentForm.incident_date) return "Incident date is required";
		const today = new Date();
		const incidentDate = new Date(incidentForm.incident_date);
		if (incidentDate > today) return "Incident date cannot be in the future";
		return null;
	};

	const handleIncidentSubmit = async (e) => {
		e.preventDefault();
		const validationError = validateIncidentForm();
		if (validationError) {
			toast.error(validationError, { position: "top-right" });
			return;
		}

		try {
			// Get the child's ID based on the name
			const childResponse = await axios.get(
				`http://localhost:3337/api/babysitter/child/name/${incidentForm.child_name}`,
				{ withCredentials: true }
			);
			const child_id = childResponse.data.data.id;

			const config = { withCredentials: true };
			await axios.post(
				"http://localhost:3337/api/babysitter/createIncident",
				{
					child_id,
					incident_type: incidentForm.incident_type,
					description: incidentForm.description,
					incident_date: incidentForm.incident_date,
				},
				config
			);
			toast.success("Incident reported successfully", {
				position: "top-right",
			});
			onIncidentCreated();
			setIncidentForm({
				child_name: "",
				incident_type: "",
				description: "",
				incident_date: new Date().toISOString().split("T")[0],
			});
		} catch (error) {
			console.error("Error creating incident:", error);
			toast.error(
				error.response?.data?.message || "Failed to report incident",
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
		}
	};

	const handleIncidentClear = () => {
		setIncidentForm({
			child_name: "",
			incident_type: "",
			description: "",
			incident_date: new Date().toISOString().split("T")[0],
		});
	};

	return (
		<section className='mb-12'>
			<h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center'>
				<FaExclamationTriangle className='mr-2 text-orange-500' />
				Report Incident
			</h2>
			<div className='bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto'>
				<form onSubmit={handleIncidentSubmit} className='space-y-6'>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Child Name
							</label>
							<div className='flex items-center space-x-2'>
								<FaChild className='text-gray-400' />
								<input
									type='text'
									name='child_name'
									value={incidentForm.child_name}
									onChange={handleIncidentChange}
									placeholder="Enter child's name"
									className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
									required
								/>
							</div>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Incident Type
							</label>
							<div className='flex items-center space-x-2'>
								<FaExclamationCircle className='text-gray-400' />
								<select
									name='incident_type'
									value={incidentForm.incident_type}
									onChange={handleIncidentChange}
									className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
									required>
									<option value=''>Select Type</option>
									<option value='health'>Health</option>
									<option value='behavior'>Behavior</option>
									<option value='safety'>Safety</option>
									<option value='other'>Other</option>
								</select>
							</div>
						</div>
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Description
						</label>
						<div className='flex items-start space-x-2'>
							<FaFileAlt className='text-gray-400 mt-3' />
							<textarea
								name='description'
								value={incidentForm.description}
								onChange={handleIncidentChange}
								placeholder='Describe the incident'
								className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
								rows='4'
								required></textarea>
						</div>
					</div>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Incident Date
						</label>
						<div className='flex items-center space-x-2'>
							<FaCalendar className='text-gray-400' />
							<input
								type='date'
								name='incident_date'
								value={incidentForm.incident_date}
								onChange={handleIncidentChange}
								className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
								required
							/>
						</div>
					</div>
					<div className='flex space-x-4 pt-4'>
						<button
							type='submit'
							className='flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02]'>
							Submit
						</button>
						<button
							type='button'
							onClick={handleIncidentClear}
							className='flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02]'>
							Clear
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default ReportIncident;
