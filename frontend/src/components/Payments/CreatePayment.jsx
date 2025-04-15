import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCalendar, FaDollarSign } from "react-icons/fa";

const CreatePayment = ({ setIsLoggedIn, setUserRole, setView }) => {
    const [formData, setFormData] = useState({
        child_id: "",
        schedule_id: "",
        amount: "",
        payment_date: "",
        session_type: "",
    });
    const [children, setChildren] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch children and schedules
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { withCredentials: true };

                // Fetch children
                const childrenResponse = await axios.get(
                    "http://localhost:3337/api/operations/children",
                    config
                );
                setChildren(childrenResponse.data.children);
                console.log("Children fetched:", childrenResponse.data.children);

                // Fetch schedules
                const schedulesResponse = await axios.get(
                    "http://localhost:3337/api/schedules/getAllSchedules",
                    config
                );
                setSchedules(schedulesResponse.data.schedules);
                console.log("Schedules fetched:", schedulesResponse.data.schedules);

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

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form
    const validateForm = () => {
        if (!formData.child_id) return "Child is required";
        if (!formData.schedule_id) return "Schedule is required";
        if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0)
            return "Valid amount is required";
        if (!formData.payment_date) return "Payment date is required";
        if (!formData.session_type) return "Session type is required";
        return null;
    };

    // Handle create payment
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
                "http://localhost:3337/api/parentpayments/createParentPayment",
                {
                    ...formData,
                    amount: Number(formData.amount),
                },
                config
            );
            toast.success("Payment created successfully", { position: "top-right" });
            console.log("Payment created:", response.data);
            setFormData({
                child_id: "",
                schedule_id: "",
                amount: "",
                payment_date: "",
                session_type: "",
            });
            setView("view");
        } catch (error) {
            console.error("Error creating payment:", error);
            toast.error(error.response?.data?.message || "Failed to create payment", {
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
            child_id: "",
            schedule_id: "",
            amount: "",
            payment_date: "",
            session_type: "",
        });
        setView("view");
    };

    // Format date for schedule display
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
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                Create Payment
            </h3>
            <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child
                        </label>
                        <div className="flex items-center space-x-2">
                            <FaUser className="text-gray-400" />
                            <select
                                name="child_id"
                                value={formData.child_id}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            >
                                <option value="">Select Child</option>
                                {children.map((child) => (
                                    <option key={child.id} value={child.id}>
                                        {child.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Schedule
                        </label>
                        <div className="flex items-center space-x-2">
                            <FaCalendar className="text-gray-400" />
                            <select
                                name="schedule_id"
                                value={formData.schedule_id}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            >
                                <option value="">Select Schedule</option>
                                {schedules.map((schedule) => (
                                    <option key={schedule.id} value={schedule.id}>
                                        {`${schedule.babysitter_name} - ${schedule.child_name} (${formatDate(schedule.date)})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Date
                        </label>
                        <input
                            type="date"
                            name="payment_date"
                            value={formData.payment_date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Type
                    </label>
                    <select
                        name="session_type"
                        value={formData.session_type}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                    >
                        <option value="">Select Session Type</option>
                        <option value="half-day">Half-day</option>
                        <option value="full-day">Full-day</option>
                    </select>
                </div>
                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        Create Payment
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

export default CreatePayment;