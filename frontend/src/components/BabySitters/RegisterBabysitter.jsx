import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaUserFriends, FaLock } from "react-icons/fa";

const RegisterBabysitter = ({ setIsLoggedIn, setUserRole }) => {
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form data
    const validateForm = () => {
        if (!formData.fullname) return "Full name is required";
        if (!formData.age) return "Age is required";
        if (isNaN(formData.age) || formData.age < 18 || formData.age > 100) return "Age must be between 18 and 100";
        if (!formData.gender) return "Gender is required";
        if (formData.gender !== "Male" && formData.gender !== "Female") return "Gender must be Male or Female";
        if (!formData.NIN) return "NIN is required";
        // Basic NIN format (e.g., 14 alphanumeric characters, adjust per country rules)
        if (!/^[A-Z0-9]{14}$/.test(formData.NIN)) return "NIN must be 14 alphanumeric characters";
        if (!formData.email) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return "Invalid email format";
        if (!formData.phone) return "Phone number is required";
        // Phone: Starts with '07', 10 digits (like registerChild)
        if (!formData.phone.startsWith("07") || formData.phone.length !== 10) {
            return "Phone number must start with '07' and be 10 digits";
        }
        if (!formData.password) return "Password is required";
        if (formData.password.length < 6) return "Password must be at least 6 characters";
        if (!formData.next_of_kin_name) return "Next of kin name is required";
        if (!formData.next_of_kin_phone) return "Next of kin phone is required";
        if (!formData.next_of_kin_phone.startsWith("07") || formData.next_of_kin_phone.length !== 10) {
            return "Next of kin phone must start with '07' and be 10 digits";
        }
        if (!formData.next_of_kin_relationship) return "Next of kin relationship is required";
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
                "http://localhost:3337/api/operations/registerBabysitter",
                formData,
                config
            );
            toast.success("Babysitter registered successfully", { position: "top-right" });
            console.log("Babysitter registered:", response.data);
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
            navigate("/manager/dashboard/babysitters");
        } catch (error) {
            console.error("Error registering babysitter:", error);
            const message = error.response?.data?.message || "Failed to register babysitter";
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
                Register Babysitter
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
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., Jane Doe"
                                    required
                                    disabled={loading}
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
                                placeholder="e.g., 25"
                                min="18"
                                max="100"
                                required
                                disabled={loading}
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
                                disabled={loading}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                NIN
                            </label>
                            <input
                                type="text"
                                name="NIN"
                                value={formData.NIN}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="e.g., CM12345678901234"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaEnvelope className="text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., jane@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaPhone className="text-gray-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., 0712345678"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="flex items-center space-x-2">
                            <FaLock className="text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="At least 6 characters"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Next of Kin Name
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaUserFriends className="text-gray-400" />
                                <input
                                    type="text"
                                    name="next_of_kin_name"
                                    value={formData.next_of_kin_name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., John Smith"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Next of Kin Phone
                            </label>
                            <div className="flex items-center space-x-2">
                                <FaPhone className="text-gray-400" />
                                <input
                                    type="text"
                                    name="next_of_kin_phone"
                                    value={formData.next_of_kin_phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., 0712345678"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Next of Kin Relationship
                        </label>
                        <input
                            type="text"
                            name="next_of_kin_relationship"
                            value={formData.next_of_kin_relationship}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="e.g., Brother"
                            required
                            disabled={loading}
                        />
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
                            {loading ? "Registering..." : "Register Babysitter"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/manager/dashboard/babysitters")}
                            className="flex-1 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterBabysitter;