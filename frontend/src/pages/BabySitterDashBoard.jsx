import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import MySchedules from "../components/BabysitterView/MySchedules";
import ReportedIncidents from "../components/BabysitterView/ReportedIncidents";
import ReportIncident from "../components/BabysitterView/ReportIncident";
import MyPayments from "../components/BabysitterView/MyPayments";

const BabysitterDashboard = ({ setIsLoggedIn, setUserRole }) => {
	const [babysitterName, setBabysitterName] = useState("Babysitter");
	const [loadingName, setLoadingName] = useState(true);
	const [activeSection, setActiveSection] = useState("schedules");
	const [refreshIncidents, setRefreshIncidents] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchName = async () => {
			try {
				setLoadingName(true);
				const response = await axios.get(
					"http://localhost:3337/api/babysitter/me",
					{ withCredentials: true }
				);
				setBabysitterName(response.data.data.fullname || "Babysitter");
				console.log("Babysitter name fetched:", response.data.data);
			} catch (error) {
				console.error("Error fetching name:", error);
				toast.error(error.response?.data?.message || "Failed to load name", {
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
				setLoadingName(false);
			}
		};
		fetchName();
	}, [setIsLoggedIn, setUserRole, navigate]);

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

	const handleLogout = async () => {
		try {
			const config = { withCredentials: true };
			await axios.post("http://localhost:3337/api/auth/logout", {}, config);
			toast.success("Logged out successfully", { position: "top-right" });
			setIsLoggedIn(false);
			setUserRole(null);
			navigate("/babysitter/login");
		} catch (error) {
			console.error("Error logging out:", error);
			toast.error(error.response?.data?.message || "Failed to log out", {
				position: "top-right",
			});
		}
	};

	const handleIncidentCreated = () => {
		setRefreshIncidents((prev) => !prev);
	};

	const renderSection = () => {
		switch (activeSection) {
			case "schedules":
				return (
					<MySchedules
						setIsLoggedIn={setIsLoggedIn}
						setUserRole={setUserRole}
						formatDate={formatDate}
						navigate={navigate}
					/>
				);
			case "incidents":
				return (
					<ReportedIncidents
						setIsLoggedIn={setIsLoggedIn}
						setUserRole={setUserRole}
						formatDate={formatDate}
						navigate={navigate}
						refreshIncidents={refreshIncidents}
					/>
				);
			case "report-incident":
				return (
					<ReportIncident
						setIsLoggedIn={setIsLoggedIn}
						setUserRole={setUserRole}
						navigate={navigate}
						onIncidentCreated={handleIncidentCreated}
					/>
				);
			case "payments":
				return (
					<MyPayments
						setIsLoggedIn={setIsLoggedIn}
						setUserRole={setUserRole}
						formatDate={formatDate}
						navigate={navigate}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-20'>
			<nav className='bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10 p-4 border-b border-pink-100'>
				<div className='max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center'>
					<div className='flex items-center space-x-4 mb-4 sm:mb-0'>
						<div className='w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center'>
							<span className='text-xl font-bold text-pink-600'>
								{loadingName ? "..." : babysitterName.charAt(0)}
							</span>
						</div>
						<h2 className='text-lg font-semibold text-gray-800'>
							{loadingName ? "Loading..." : `Welcome, ${babysitterName}`}
						</h2>
					</div>
					<div className='flex flex-wrap items-center space-x-4'>
						<button
							onClick={() => setActiveSection("schedules")}
							className={`font-medium transition-all duration-200 relative pb-2 ${
								activeSection === "schedules"
									? "text-pink-500 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-pink-500 after:rounded-full"
									: "text-gray-600 hover:text-pink-500"
							}`}>
							My Schedule
						</button>
						<button
							onClick={() => setActiveSection("incidents")}
							className={`font-medium transition-all duration-200 relative pb-2 ${
								activeSection === "incidents"
									? "text-pink-500 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-pink-500 after:rounded-full"
									: "text-gray-600 hover:text-pink-500"
							}`}>
							My Incidents
						</button>
						<button
							onClick={() => setActiveSection("report-incident")}
							className={`font-medium transition-all duration-200 relative pb-2 ${
								activeSection === "report-incident"
									? "text-pink-500 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-pink-500 after:rounded-full"
									: "text-gray-600 hover:text-pink-500"
							}`}>
							Report Incident
						</button>
						<button
							onClick={() => setActiveSection("payments")}
							className={`font-medium transition-all duration-200 relative pb-2 ${
								activeSection === "payments"
									? "text-pink-500 font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-pink-500 after:rounded-full"
									: "text-gray-600 hover:text-pink-500"
							}`}>
							My Payments
						</button>
						<button
							onClick={handleLogout}
							className='flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg'>
							<FaSignOutAlt />
							<span>Logout</span>
						</button>
					</div>
				</div>
			</nav>

			<div className='p-6 max-w-[1400px] mx-auto'>
				<div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-8'>
					<h1 className='text-3xl font-bold text-gray-800 mb-2'>
						Babysitter Dashboard
					</h1>
					<p className='text-gray-600'>
						Manage your schedules, report incidents, and track your payments
					</p>
				</div>
				<div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8'>
					{renderSection()}
				</div>
			</div>
		</div>
	);
};

export default BabysitterDashboard;
