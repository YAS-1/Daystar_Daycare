import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaMoneyBillWave } from "react-icons/fa";

const MyPayments = ({ setIsLoggedIn, setUserRole, formatDate, navigate }) => {
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const today = new Date().toISOString().split("T")[0];

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

    const todaySchedules = schedules.filter(
        (schedule) => schedule.date.split("T")[0] === today
    );
    const halfDayCount = todaySchedules.filter(
        (schedule) => schedule.session_type === "Half-day"
    ).length;
    const fullDayCount = todaySchedules.filter(
        (schedule) => schedule.session_type === "Full-day"
    ).length;
    const halfDayPayment = halfDayCount * 2000;
    const fullDayPayment = fullDayCount * 5000;
    const totalPayment = halfDayPayment + fullDayPayment;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FaMoneyBillWave className="mr-2 text-green-500" />
                My Payments (Today: {formatDate(today)})
            </h2>
            {loadingSchedules ? (
                <div className="flex justify-center items-center min-h-[20vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            ) : todaySchedules.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <FaMoneyBillWave className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No schedules for today.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {todaySchedules.map((schedule, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1"
                        >
                            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <FaMoneyBillWave className="text-green-500 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {schedule.child_name}
                                        </h3>
                                        <div className="text-gray-600 space-y-1">
                                            <p>Session: {schedule.session_type || "N/A"}</p>
                                            <p>
                                                Amount: $
                                                {(schedule.session_type === "Half-day"
                                                    ? 2000
                                                    : schedule.session_type === "Full-day"
                                                    ? 5000
                                                    : 0).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Payment Summary
                        </h3>
                        <div className="text-gray-600 space-y-2">
                            <p>
                                Half-day Sessions: {halfDayCount} × Shs2000 = Shs
                                {(halfDayPayment || 0).toFixed(2)}
                            </p>
                            <p>
                                Full-day Sessions: {fullDayCount} × Sh5000 = Shs
                                {(fullDayPayment || 0).toFixed(2)}
                            </p>
                            <p className="text-lg font-semibold text-green-600">
                                Total Payment: ${(totalPayment || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MyPayments;