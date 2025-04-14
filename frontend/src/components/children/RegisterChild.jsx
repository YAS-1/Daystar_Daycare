import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaUserFriends } from "react-icons/fa";

const RegisterChild = ({ setIsLoggedIn, setUserRole }) => {
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form data
    const validateForm = () => {
        if (!formData.full_name) return "Full name is required";
        if (!formData.age) return "Age is required";
        if (isNaN(formData.age) || formData.age < 1 || formData.age > 10) return "Age must be between 1 and 10";
        if (!formData.gender) return "Gender is required";
        if (formData.gender !== "Male" && formData.gender !== "Female") return "Gender must be Male or Female";
        if (!formData.parent_guardian_name) return "Parent/Guardian name is required";
        if (!formData.parent_guardian_phone) return "Parent/Guardian phone is required";
        if (!formData.parent_guardian_phone.startsWith("07") || formData.parent_guardian_phone.length !== 10) {
            return "Phone number must start with '07' and be 10 digits";
        }
        if (!formData.parent_guardian_email) return "Parent/Guardian email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.parent_guardian_email)) return "Invalid email format";
        if (!formData.parent_guardian_relationship) return "Parent/Guardian relationship is required";
        if (!formData.Duration_of_stay) return "Duration of stay is required";
        if (formData.Duration_of_stay !== "Full-day" && formData.Duration_of_stay !== "Half-day") {
            return "Duration of stay must be Full-day or Half-day";
        }
        return null;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError, { position: "top-right" });
            return;
        }

        setLoading(true);
        try {
            const config = { withCredentials: true };
            const response = await axios.post(
                "http://localhost:3337/api/operations/registerChild",
                formData,
                config
            );
            toast.success("Child registered successfully", { position: "top-right" });
            console.log("Child registered:", response.data);
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
            navigate("/manager/dashboard/children");
        } catch (error) {
            console.error("Error registering child:", error);
            const message = error.response?.data?.message || "Failed to register child";
            toast.error(message, { position: "top-right" });
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.", {
                    position: "top-right",
                });
                setIsLoggedIn(false);
                setUserRole(null);
                navigate("/manager/login");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-2 border-gray-200 pb-4">
                Register Child
            </h2>
            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaUser className="text-gray-400" />
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., John Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="e.g., 5"
                                min="1"
                                max="10"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent/Guardian Name
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaUserFriends className="text-gray-400" />
                                <input
                                    type="text"
                                    name="parent_guardian_name"
                                    value={formData.parent_guardian_name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., Jane Doe"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent/Guardian Email
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaEnvelope className="text-gray-400" />
                                <input
                                    type="email"
                                    name="parent_guardian_email"
                                    value={formData.parent_guardian_email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., jane@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent/Guardian Phone
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaPhone className="text-gray-400" />
                                <input
                                    type="text"
                                    name="parent_guardian_phone"
                                    value={formData.parent_guardian_phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., 0712345678"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent/Guardian Relationship
                            </label>
                            <input
                                type="text"
                                name="parent_guardian_relationship"
                                value={formData.parent_guardian_relationship}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="e.g., Mother"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Needs
                            </label>
                            <input
                                type="text"
                                name="special_needs"
                                value={formData.special_needs}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="e.g., Allergies"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration of Stay
                        </label>
                        <select
                            name="Duration_of_stay"
                            value={formData.Duration_of_stay}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                        >
                            <option value="">Select Duration</option>
                            <option value="Full-day">Full-day</option>
                            <option value="Half-day">Half-day</option>
                        </select>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 p-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                                loading
                                    ? "bg-blue-300 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        >
                            {loading ? "Registering..." : "Register Child"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/manager/dashboard/children")}
                            className="flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterChild;