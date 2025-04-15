import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaUser, FaChild, FaExclamationTriangle } from "react-icons/fa";

const CreateIncident = ({ setIsLoggedIn, setUserRole, setView }) => {
    const [formData, setFormData] = useState({
        child_id: "",
        babysitter_id: "",
        incident_date: "",
        incident_type: "",
        description: "",
    });
    const [babysitters, setBabysitters] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch babysitters and children
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { withCredentials: true };

                // Fetch babysitters
                const babysitterResponse = await axios.get(
                    "http://localhost:3337/api/operations/babysitters",
                    config
                );
                setBabysitters(babysitterResponse.data.babysitters);
                console.log("Babysitters fetched:", babysitterResponse.data.babysitters);

                // Fetch children
                const childrenResponse = await axios.get(
                    "http://localhost:3337/api/operations/children",
                    config
                );
                setChildren(childrenResponse.data.children);
                console.log("Children fetched:", childrenResponse.data.children);

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
        if (!formData.babysitter_id) return "Babysitter is required";
        if (!formData.incident_date) return "Incident date is required";
        if (!formData.incident_type) return "Incident type is required";
        if (!formData.description) return "Description is required";
        return null;
    };

    // Handle create incident
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
                "http://localhost:3337/api/incidents/createIncident",
                formData,
                config
            );
            toast.success("Incident reported successfully", { position: "top-right" });
            console.log("Incident created:", response.data);
            setFormData({
                child_id: "",
                babysitter_id: "",
                incident_date: "",
                incident_type: "",
                description: "",
            });
            setView("view");
        } catch (error) {
            console.error("Error creating incident:", error);
            toast.error(error.response?.data?.message || "Failed to create incident", {
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
            babysitter_id: "",
            incident_date: "",
            incident_type: "",
            description: "",
        });
        setView("view");
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
                Report Incident
            </h3>
            <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Babysitter
                        </label>
                        <div className="flex items-center space-x-2">
                            <FaUser className="text-gray-400" />
                            <select
                                name="babysitter_id"
                                value={formData.babysitter_id}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            >
                                <option value="">Select Babysitter</option>
                                {babysitters.map((babysitter) => (
                                    <option key={babysitter.id} value={babysitter.id}>
                                        {babysitter.fullname}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Child
                        </label>
                        <div className="flex items-center space-x-2">
                            <FaChild className="text-gray-400" />
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Incident Date
                        </label>
                        <input
                            type="date"
                            name="incident_date"
                            value={formData.incident_date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Incident Type
                        </label>
                        <input
                            type="text"
                            name="incident_type"
                            value={formData.incident_type}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the incident..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[100px]"
                        required
                    />
                </div>
                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        Report Incident
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

export default CreateIncident;