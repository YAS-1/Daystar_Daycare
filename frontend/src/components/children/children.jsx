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
	FaUserFriends,
	FaChild,
} from "react-icons/fa";

const Children = ({ setIsLoggedIn, setUserRole }) => {
	const [children, setChildren] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editChild, setEditChild] = useState(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [formData, setFormData] = useState({
		full_name: "",
		age: "",
		gender: "",
		parent_guardian_name: "",
		parent_guardian_phone: "",
		parent_guardian_email: "",
		parent_guardian_relationship: "",
		special_needs: "",
		Duration_of_stay: "",
	});
	const navigate = useNavigate();

	// Fetch all children
	useEffect(() => {
		const fetchChildren = async () => {
			try {
				const config = { withCredentials: true };
				const response = await axios.get(
					"http://localhost:3337/api/operations/children",
					config
				);
				setChildren(response.data.children);
				setLoading(false);
				console.log("Children fetched:", response.data.children);
			} catch (error) {
				console.error("Error fetching children:", error);
				toast.error(
					error.response?.data?.message || "Failed to load children",
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
		fetchChildren();
	}, [setIsLoggedIn, setUserRole, navigate]);

	// Handle delete child
	const handleDelete = async (id) => {
		try {
			const config = { withCredentials: true };
			await axios.delete(
				`http://localhost:3337/api/operations/children/${id}`,
				config
			);
			setChildren(children.filter((child) => child.id !== id));
			toast.success("Child deleted successfully", {
				position: "top-right",
			});
			console.log("Child deleted:", id);
			setShowDeleteDialog(null);
		} catch (error) {
			console.error("Error deleting child:", error);
			toast.error(error.response?.data?.message || "Failed to delete child", {
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

	// Open edit dialog
	const handleEdit = (child) => {
		setEditChild(child.id);
		setFormData({
			full_name: child.full_name,
			age: child.age,
			gender: child.gender,
			parent_guardian_name: child.parent_guardian_name,
			parent_guardian_phone: child.parent_guardian_phone,
			parent_guardian_email: child.parent_guardian_email,
			parent_guardian_relationship: child.parent_guardian_relationship,
			special_needs: child.special_needs || "",
			Duration_of_stay: child.Duration_of_stay || "",
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
				`http://localhost:3337/api/operations/children/${editChild}`,
				formData,
				config
			);
			setChildren(
				children.map((child) =>
					child.id === editChild ? { ...child, ...formData } : child
				)
			);
			setEditChild(null);
			setFormData({
				full_name: "",
				age: "",
				gender: "",
				parent_guardian_name: "",
				parent_guardian_phone: "",
				parent_guardian_email: "",
				parent_guardian_relationship: "",
				special_needs: "",
				Duration_of_stay: "",
			});
			toast.success("Child updated successfully", {
				position: "top-right",
			});
			console.log("Child updated:", response.data);
		} catch (error) {
			console.error("Error updating child:", error);
			toast.error(error.response?.data?.message || "Failed to update child", {
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

	// Close dialogs
	const handleCancel = () => {
		setEditChild(null);
		setShowDeleteDialog(null);
		setFormData({
			full_name: "",
			age: "",
			gender: "",
			parent_guardian_name: "",
			parent_guardian_phone: "",
			parent_guardian_email: "",
			parent_guardian_relationship: "",
			special_needs: "",
			Duration_of_stay: "",
		});
	};

	// Filter children based on search query
	const filteredChildren = children.filter((child) =>
		child.full_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
				Children Management
			</h2>

			{/* Search Bar */}
			<div className='mb-8 bg-white p-6 rounded-xl shadow-md'>
				<div className='flex flex-col sm:flex-row gap-4'>
					<div className='flex-1'>
						<label
							htmlFor='searchQuery'
							className='block text-sm font-medium text-gray-700 mb-2'>
							Search Child by Name
						</label>
						<div className='flex gap-2'>
							<input
								type='text'
								id='searchQuery'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder='Enter child name'
								className='flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
							/>
							<button
								type='button'
								onClick={() => setSearchQuery("")}
								className='px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'>
								Clear
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Children List */}
			{filteredChildren.length === 0 ? (
				<div className='text-center py-12 bg-white rounded-xl shadow-md'>
					<FaChild className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>
						{searchQuery
							? "No children found matching your search"
							: "No children found."}
					</p>
				</div>
			) : (
				<div className='bg-white rounded-xl shadow-md overflow-hidden w-full'>
					<div className='overflow-x-auto max-w-full'>
						<table className='w-full divide-y divide-gray-200 table-auto'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Name
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24'>
										Age
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24'>
										Gender
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Parent/Guardian
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Contact
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Special Needs
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48'>
										Duration
									</th>
									<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredChildren.map((child) => (
									<tr key={child.id} className='hover:bg-gray-50'>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<div className='bg-gray-100 p-2 rounded-full'>
														<FaChild className='text-black text-xl' />
													</div>
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-gray-900'>
														{child.full_name}
													</div>
												</div>
											</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>{child.age}</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{child.gender}
											</div>
										</td>
										<td className='px-4 py-4'>
											<div className='text-sm text-gray-900'>
												<div>{child.parent_guardian_name}</div>
												<div className='text-sm text-gray-500'>
													{child.parent_guardian_relationship}
												</div>
											</div>
										</td>
										<td className='px-4 py-4'>
											<div className='text-sm text-gray-900'>
												<div>{child.parent_guardian_phone}</div>
												<div className='text-sm text-gray-500'>
													{child.parent_guardian_email}
												</div>
											</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{child.special_needs || "None"}
											</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{child.Duration_of_stay}
											</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-right text-sm font-medium'>
											<div className='flex space-x-2'>
												<button
													onClick={() => handleEdit(child)}
													className='text-blue-600 hover:text-blue-900'>
													<FaEdit className='text-xl' />
												</button>
												<button
													onClick={() => handleOpenDeleteDialog(child.id)}
													className='text-red-600 hover:text-red-900'>
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

			{/* Edit Modal */}
			{editChild && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto'>
						<h3 className='text-2xl font-bold mb-6 text-gray-800 border-b pb-4'>
							Edit Child
						</h3>
						<form onSubmit={handleUpdate} className='space-y-6'>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Full Name
									</label>
									<input
										type='text'
										name='full_name'
										value={formData.full_name}
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
										min='0'
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
									</select>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Parent/Guardian Name
									</label>
									<input
										type='text'
										name='parent_guardian_name'
										value={formData.parent_guardian_name}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Parent/Guardian Email
									</label>
									<input
										type='email'
										name='parent_guardian_email'
										value={formData.parent_guardian_email}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Parent/Guardian Phone
									</label>
									<input
										type='tel'
										name='parent_guardian_phone'
										value={formData.parent_guardian_phone}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Parent/Guardian Relationship
									</label>
									<input
										type='text'
										name='parent_guardian_relationship'
										value={formData.parent_guardian_relationship}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
										required
									/>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Special Needs
									</label>
									<input
										type='text'
										name='special_needs'
										value={formData.special_needs}
										onChange={handleChange}
										className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
									/>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Duration of Stay
								</label>
								<input
									type='text'
									name='Duration_of_stay'
									value={formData.Duration_of_stay}
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
							Are you sure you want to delete this child? This action cannot be
							undone.
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

export default Children;
