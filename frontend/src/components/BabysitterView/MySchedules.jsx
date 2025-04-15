import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCalendar } from "react-icons/fa";

const MySchedules = ({ setIsLoggedIn, setUserRole, formatDate, navigate }) => {
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoadingSchedules(true);
                const response = await axios.get(
                    "http://localhost:3337/api/babysitter/mySchedule",
                    { withCredentials: true }
                );
                setSchedules(response.data.data || []);
                console.log("Schedules fetched:", response.data.data);
            } catch (error) {
                console.error("Error fetching schedules:", error);
                toast.error(error.response?.data?.message || "Failed to load schedules", {
                    position: "top-right",
                });
                if (error.response?.status === 401) {
                    toast.error("Session expired. Please log in again.", {
                        position: "top-right",
                    });
                    setIsLoggedIn(false);
                    setUserRole(null);
                    navigate("/babysitter/login");
                }
            } finally {
                setLoadingSchedules(false);
            }
        };
        fetchSchedules();
    }, [setIsLoggedIn, setUserRole, navigate]);

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCalendar className="mr-2 text-blue-500" />
                My Schedule
            </h2>
            {loadingSchedules ? (
                <div className="flex justify-center items-center min-h-[20vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            ) : schedules.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <FaCalendar className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No schedules found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {schedules.map((schedule, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1"
                        >
                            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <FaCalendar className="text-blue-500 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {schedule.child_name}
                                        </h3>
                                        <div className="text-gray-600 space-y-1">
                                            <p>Date: {formatDate(schedule.date)}</p>
                                            <p>Session: {schedule.session_type || "N/A"}</p>
                                            <p>Attendance: {schedule.attendance_status || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MySchedules;