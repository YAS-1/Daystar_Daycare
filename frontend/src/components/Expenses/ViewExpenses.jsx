import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
	FaMoneyBillWave,
	FaTrash,
	FaEdit,
	FaList,
	FaCalendar,
} from "react-icons/fa";

const ViewExpenses = ({ setIsLoggedIn, setUserRole }) => {
	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showDeleteDialog, setShowDeleteDialog] = useState(null);
	const [editExpense, setEditExpense] = useState(null);
	const navigate = useNavigate();

	// Fetch expenses
	useEffect(() => {
		const fetchExpenses = async () => {
			try {
				const config = { withCredentials: true };
				const response = await axios.get(
					"http://localhost:3337/api/expenses/getAllExpenses",
					config
				);
				setExpenses(response.data);
				console.log("Expenses fetched:", response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching expenses:", error);
				toast.error(
					error.response?.data?.message || "Failed to load expenses",
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
		fetchExpenses();
	}, [setIsLoggedIn, setUserRole, navigate]);

	// Handle delete expense
	const handleDelete = async (id) => {
		try {
			const config = { withCredentials: true };
			await axios.delete(
				`http://localhost:3337/api/expenses/deleteExpense/${id}`,
				config
			);
			setExpenses(expenses.filter((expense) => expense.id !== id));
			toast.success("Expense deleted successfully", { position: "top-right" });
			console.log("Expense deleted:", id);
			setShowDeleteDialog(null);
		} catch (error) {
			console.error("Error deleting expense:", error);
			toast.error(error.response?.data?.message || "Failed to delete expense", {
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

	// Handle update expense
	const handleUpdate = async (id, updatedData) => {
		try {
			const config = { withCredentials: true };
			const response = await axios.put(
				`http://localhost:3337/api/expenses/updateExpense/${id}`,
				updatedData,
				config
			);
			setExpenses(
				expenses.map((expense) =>
					expense.id === id ? { ...expense, ...updatedData } : expense
				)
			);
			toast.success("Expense updated successfully", { position: "top-right" });
			console.log("Expense updated:", response.data);
			setEditExpense(null);
		} catch (error) {
			console.error("Error updating expense:", error);
			toast.error(error.response?.data?.message || "Failed to update expense", {
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
	const handleOpenEdit = (expense) => setEditExpense(expense);

	// Close dialogs
	const handleCancel = () => {
		setShowDeleteDialog(null);
		setEditExpense(null);
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

	// Handle edit form changes
	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditExpense((prev) => ({ ...prev, [name]: value }));
	};

	// Validate edit form
	const validateEditForm = () => {
		if (!editExpense.category) return "Category is required";
		if (
			!editExpense.amount ||
			isNaN(editExpense.amount) ||
			Number(editExpense.amount) <= 0
		)
			return "Valid amount is required";
		if (!editExpense.expense_date) return "Expense date is required";
		return null;
	};

	// Submit edit form
	const handleEditSubmit = () => {
		const validationError = validateEditForm();
		if (validationError) {
			toast.error(validationError, { position: "top-right" });
			return;
		}
		handleUpdate(editExpense.id, {
			category: editExpense.category,
			amount: Number(editExpense.amount),
			expense_date: editExpense.expense_date,
			description: editExpense.description || "",
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
		<div>
			{expenses.length === 0 ? (
				<div className='text-center py-12 bg-white rounded-lg shadow-md'>
					<FaMoneyBillWave className='mx-auto text-4xl text-gray-400 mb-4' />
					<p className='text-gray-600 text-lg'>No expenses found.</p>
				</div>
			) : (
				<div className='space-y-4'>
					{expenses.map((expense) => (
						<div
							key={expense.id}
							className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1'>
							<div className='p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
								<div className='flex items-center space-x-4'>
									<div className='bg-gray-100 p-3 rounded-full'>
										<FaMoneyBillWave className='text-black text-xl' />
									</div>
									<div>
										<h3 className='text-xl font-semibold text-gray-800 mb-2'>
											Expense Details
										</h3>
										<div className='text-gray-600 space-y-1'>
											<p className='flex items-center'>
												<FaList className='mr-2 text-gray-500' />
												<strong>Category</strong>: {expense.category || "N/A"}
											</p>
											<p>
												<strong>Amount</strong>: Shs
												{(Number(expense.amount) || 0).toFixed(0)}
											</p>
											<p className='flex items-center'>
												<FaCalendar className='mr-2 text-gray-500' />
												<strong>Date</strong>:{" "}
												{formatDate(expense.expense_date)}
											</p>
											<p>
												<strong>Description</strong>:{" "}
												{expense.description || "N/A"}
											</p>
											<p>
												<strong>Created</strong>:{" "}
												{formatDate(expense.created_at)}
											</p>
										</div>
									</div>
								</div>
								<div className='flex md:flex-col space-x-2 md:space-x-0 md:space-y-2'>
									<FaEdit
										onClick={() => handleOpenEdit(expense)}
										className='p-2 text-gray-600 hover:text-yellow-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
										title='Update Expense'
									/>
									<FaTrash
										onClick={() => handleOpenDeleteDialog(expense.id)}
										className='p-2 text-gray-600 hover:text-red-500 transition-all duration-200 hover:scale-110 focus:outline-none text-4xl'
										title='Delete Expense'
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
							Are you sure you want to delete this expense? This action cannot
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

			{/* Update Expense Modal */}
			{editExpense && (
				<div className='fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-8 w-full max-w-md shadow-xl transform transition-all'>
						<h3 className='text-2xl font-bold mb-4 text-gray-800'>
							Update Expense
						</h3>
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Category
								</label>
								<select
									name='category'
									value={editExpense.category}
									onChange={handleEditChange}
									className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'>
									<option value=''>Select Category</option>
									<option value='Babysitter Salaries'>
										Babysitter Salaries
									</option>
									<option value='Toys'>Toys</option>
									<option value='Maintenance'>Maintenance</option>
									<option value='Utilities'>Utilities</option>
								</select>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Amount ($)
								</label>
								<input
									type='number'
									name='amount'
									value={editExpense.amount}
									onChange={handleEditChange}
									placeholder='Enter amount'
									step='0.01'
									min='0'
									className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Expense Date
								</label>
								<input
									type='date'
									name='expense_date'
									value={editExpense.expense_date}
									onChange={handleEditChange}
									className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Description
								</label>
								<textarea
									name='description'
									value={editExpense.description || ""}
									onChange={handleEditChange}
									placeholder='Enter description'
									className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'
									rows='4'></textarea>
							</div>
							<div className='flex space-x-4'>
								<button
									onClick={handleEditSubmit}
									className='flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02]'>
									Update
								</button>
								<button
									onClick={handleCancel}
									className='flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02]'>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewExpenses;