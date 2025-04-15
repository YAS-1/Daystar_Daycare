import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
	FaTrash,
	FaEdit,
	FaUser,
	FaPhone,
	FaEnvelope,
	FaIdCard,
	FaUserFriends,
} from "react-icons/fa";

const Babysitters = ({ setIsLoggedIn, setUserRole }) => {
	const [babysitters, setBabysitters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editBabysitter, setEditBabysitter] = useState(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(null);
	const [formData, setFormData] = useState({
		fullname: "",
		age: "",
		gender: "",
		NIN: "",
		email: "",
		phone: "",
		password: "",
		next_of_kin_name: "",
		next_of_kin_phone: "",
		next_of_kin_relationship: "",
	});
	const navigate = useNavigate();

	// Fetch all babysitters
	useEffect(() => {
		const fetchBabysitters = async () => {
			try {
				const config = { withCredentials: true };
				const response = await axios.get(
					"http://localhost:3337/api/operations/babysitters",
					config
				);
				setBabysitters(response.data.babysitters);
				setLoading(false);
				console.log("Babysitters fetched:", response.data.babysitters);
			} catch (error) {
				console.error("Error fetching babysitters:", error);
				toast.error(
					error.response?.data?.message || "Failed to load babysitters",
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
		fetchBabysitters();
	}, [setIsLoggedIn, setUserRole, navigate]);

	// Handle delete babysitter
	const handleDelete = async (id) => {
		try {
			const config = { withCredentials: true };
			await axios.delete(
				`http://localhost:3337/api/operations/babysitters/${id}`,
				config
			);
			setBabysitters(babysitters.filter((babysitter) => babysitter.id !== id));
			toast.success("Babysitter deleted successfully", {
				position: "top-right",
			});
			console.log("Babysitter deleted:", id);
			setShowDeleteDialog(null);
		} catch (error) {
			console.error("Error deleting babysitter:", error);
			toast.error(
				error.response?.data?.message || "Failed to delete babysitter",
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

	// Open edit dialog
	const handleEdit = (babysitter) => {
		setEditBabysitter(babysitter.id);
		setFormData({
			fullname: babysitter.fullname,
			age: babysitter.age || "",
			gender: babysitter.gender,
			NIN: babysitter.NIN,
			email: babysitter.email,
			phone: babysitter.phone,
			password: "",
			next_of_kin_name: babysitter.next_of_kin_name,
			next_of_kin_phone: babysitter.next_of_kin_phone,
			next_of_kin_relationship: babysitter.next_of_kin_relationship,
		});
	};

	// Open delete dialog
	const handleOpenDeleteDialog = (id) => {
		setShowDeleteDialog(id);
	};

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle update submission
	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			const config = { withCredentials: true };
			const response = await axios.put(
				`http://localhost:3337/api/operations/babysitters/${editBabysitter}`,
				formData,
				config
			);
			setBabysitters(
				babysitters.map((babysitter) =>
					babysitter.id === editBabysitter
						? { ...babysitter, ...formData }
						: babysitter
				)
			);
			setEditBabysitter(null);
			setFormData({
				fullname: "",
				age: "",
				gender: "",
				NIN: "",
				email: "",
				phone: "",
				password: "",
				next_of_kin_name: "",
				next_of_kin_phone: "",
				next_of_kin_relationship: "",
			});
			toast.success("Babysitter updated successfully", {
				position: "top-right",
			});
			console.log("Babysitter updated:", response.data);
		} catch (error) {
			console.error("Error updating babysitter:", error);
			toast.error(
				error.response?.data?.message || "Failed to update babysitter",
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

	// Close dialogs
	const handleCancel = () => {
		setEditBabysitter(null);
		setShowDeleteDialog(null);
		setFormData({
			fullname: "",
			age: "",
			gender: "",
			NIN: "",
			email: "",
			phone: "",
			password: "",
			next_of_kin_name: "",
			next_of_kin_phone: "",
			next_of_kin_relationship: "",
		});
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
				Babysitters Management
			</h2>

			{babysitters.length === 0 ? (
				<div className='text-center py-12 bg-white rounded-lg shadow-md'>
					<FaUser className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No babysitters found.</p>
				</div>
			) : (
				<div className='space-y-4'>
					{babysitters.map((babysitter) => (
						<div
							key={babysitter.id}
							className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1'>
							<div className='p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
								<div className='flex items-center space-x-4'>
									<div className='bg-gray-100 p-3 rounded-full'>
										<FaUser className='text-black text-xl' />
									</div>
									<div>
										<h3 className='text-xl font-semibold text-gray-800 mb-1'>
											{babysitter.fullname}
										</h3>
										<div className='flex items-center space-x-4 text-gray-600'>
											<span>Age: {babysitter.age || "N/A"}</span>
											<span>{babysitter.gender}</span>
										</div>
									</div>
								</div>

								<div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<div className='flex items-center space-x-2 text-gray-600'>
											<FaIdCard className='text-black' />
											<span>NIN: {babysitter.NIN}</span>
										</div>
										<div className='flex items-center space-x-2 text-gray-600'>
											<FaEnvelope className='text-black' />
											<span>{babysitter.email}</span>
										</div>
										<div className='flex items-center space-x-2 text-gray-600'>
											<FaPhone className='text-black' />
											<span>{babysitter.phone}</span>
										</div>
									</div>

									<div className='space-y-2'>
										<div className='flex items-center space-x-2 text-gray-700'>
											<FaUserFriends className='text-black' />
											<span className='font-medium'>Next of Kin</span>
										</div>
										<div className='pl-7 space-y-1 text-gray-600'>
											<p>{babysitter.next_of_kin_name}</p>
											<p>{babysitter.next_of_kin_phone}</p>
											<p className='italic'>
												{babysitter.next_of_kin_relationship}
											</p>
										</div>
									</div>
								</div>

								<div className='flex md:flex-col space-x-2 md:space-x-0 md:space-y-2'>
									<FaEdit
										onClick={() => handleEdit(babysitter)}
										className='p-2 text-gray-600 hover:text-yellow-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
										title='Edit Babysitter'
									/>
									<FaTrash
										onClick={() => handleOpenDeleteDialog(babysitter.id)}
										className='p-2 text-gray-600 hover:text-red-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
										title='Delete Babysitter'
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Edit Modal */}
			{editBabysitter && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto'>
						<h3 className='text-2xl font-bold mb-6 text-gray-800 border-b pb-4'>
							Edit Babysitter
						</h3>
						<form onSubmit={handleUpdate} className='space-y-6'>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Full Name
									</label>
									<input
										type='text'
										name='fullname'
										value={formData.fullname}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Age
									</label>
									<input
										type='number'
										name='age'
										value={formData.age}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
									/>
								</div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Gender
									</label>
									<select
										name='gender'
										value={formData.gender}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required>
										<option value=''>Select Gender</option>
										<option value='Male'>Male</option>
										<option value='Female'>Female</option>
										<option value='Other'>Other</option>
									</select>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										NIN
									</label>
									<input
										type='text'
										name='NIN'
										value={formData.NIN}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Email
									</label>
									<input
										type='email'
										name='email'
										value={formData.email}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Phone
									</label>
									<input
										type='text'
										name='phone'
										value={formData.phone}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Password (leave blank to keep unchanged)
								</label>
								<input
									type='password'
									name='password'
									value={formData.password}
									onChange={handleChange}
									className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
								/>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Next of Kin Name
									</label>
									<input
										type='text'
										name='next_of_kin_name'
										value={formData.next_of_kin_name}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Next of Kin Phone
									</label>
									<input
										type='text'
										name='next_of_kin_phone'
										value={formData.next_of_kin_phone}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Next of Kin Relationship
								</label>
								<input
									type='text'
									name='next_of_kin_relationship'
									value={formData.next_of_kin_relationship}
									onChange={handleChange}
									className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
									required
								/>
							</div>

							<div className='flex space-x-4 pt-4'>
								<button
									type='submit'
									className='flex-1 p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'>
									Save Changes
								</button>
								<button
									type='button'
									onClick={handleCancel}
									className='flex-1 p-3 text-white bg-gray-400 rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'>
									Cancel
								</button>
							</div>
						</form>
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
							Are you sure you want to delete this babysitter? This action
							cannot be undone.
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
		</div>
	);
};

export default Babysitters;
