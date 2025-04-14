import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaList, FaDollarSign, FaCalendar, FaFileAlt } from "react-icons/fa";

const CreateExpense = ({ setIsLoggedIn, setUserRole, setView }) => {
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        expense_date: "",
        description: "",
    });
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form
    const validateForm = () => {
        if (!formData.category) return "Category is required";
        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0)
            return "Valid amount is required";
        if (!formData.expense_date) return "Expense date is required";
        if (!formData.description) return "Description is required";
        return null;
    };

    // Handle create expense
    const handleCreate = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError, { position: "top-right" });
            return;
        }

        try {
            const config = { withCredentials: true };
            const response = await axios.post(
                "http://localhost:3337/api/expenses/createExpense",
                {
                    ...formData,
                    amount: Number(formData.amount),
                },
                config
            );
            toast.success("Expense created successfully", { position: "top-right" });
            console.log("Expense created:", response.data);
            setFormData({
                category: "",
                amount: "",
                expense_date: "",
                description: "",
            });
            setView("view");
        } catch (error) {
            console.error("Error creating expense:", error);
            toast.error(error.response?.data?.message || "Failed to create expense", {
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

    // Handle cancel
    const handleCancel = () => {
        setFormData({
            category: "",
            amount: "",
            expense_date: "",
            description: "",
        });
        setView("view");
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                Create Expense
            </h3>
            <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <div className="flex items-center space-x-2">
                            <FaList className="text-gray-400" />
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Babysitter Salaries">Babysitter Salaries</option>
                                <option value="Toys">Toys</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Utilities">Utilities</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount (Shs)
                        </label>
                        <div className="flex items-center space-x-2">
                            <FaDollarSign className="text-gray-400" />
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                step="0.01"
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expense Date
                        </label>
                        <div className="flex items-center space-x-2">
                            <FaCalendar className="text-gray-400" />
                            <input
                                type="date"
                                name="expense_date"
                                value={formData.expense_date}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <div className="flex items-start space-x-2">
                        <FaFileAlt className="text-gray-400 mt-3" />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                </div>
                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        Create Expense
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateExpense;