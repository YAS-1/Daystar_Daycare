/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaExclamationTriangle } from "react-icons/fa";

const ReportedIncidents = ({ setIsLoggedIn, setUserRole, formatDate, navigate, refreshIncidents }) => {
    const [incidents, setIncidents] = useState([]);
    const [loadingIncidents, setLoadingIncidents] = useState(true);

    const fetchIncidents = async () => {
        try {
            setLoadingIncidents(true);
            const response = await axios.get(
                "http://localhost:3337/api/babysitter/incidentsReportedByMe",
                { withCredentials: true }
            );
            setIncidents(response.data.data || []);
            console.log("Incidents fetched:", response.data.data);
        } catch (error) {
            console.error("Error fetching incidents:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.", {
                    position: "top-right",
                });
                setIsLoggedIn(false);
                setUserRole(null);
                navigate("/babysitter/login");
            }
        } finally {
            setLoadingIncidents(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        fetchIncidents();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (refreshIncidents) {
            fetchIncidents();
        }
    }, [refreshIncidents]);

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FaExclamationTriangle className="mr-2 text-red-500" />
                My Incidents
            </h2>
            {loadingIncidents ? (
                <div className="flex justify-center items-center min-h-[20vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            ) : incidents.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <FaExclamationTriangle className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">No incidents reported.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {incidents.map((incident, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-x-1"
                        >
                            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <FaExclamationTriangle className="text-red-500 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {incident.child_name}
                                        </h3>
                                        <div className="text-gray-600 space-y-1">
                                            <p>Type: {incident.incident_type || "N/A"}</p>
                                            <p>Description: {incident.description || "N/A"}</p>
                                            <p>Date: {formatDate(incident.incident_date)}</p>
                                            <p>
                                                Status: {incident.status ? incident.status.charAt(0).toUpperCase() + incident.status.slice(1) : "N/A"}
                                            </p>
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

export default ReportedIncidents;