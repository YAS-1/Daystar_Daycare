import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	FaCalendar,
	FaExclamationTriangle,
	FaPlus,
	FaMoneyBillWave,
	FaSignOutAlt,
	FaUser,
} from "react-icons/fa";

const BabySitterDashboard = ({ setIsLoggedIn, setUserRole }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// Fetch current babysitter details
		const fetchCurrentUser = async () => {
			try {
				const response = await fetch(
					"http://localhost:3337/api/babysitters/current",
					{
						credentials: "include",
					}
				);
				if (response.ok) {
					const data = await response.json();
					setCurrentUser(data);
				}
			} catch (error) {
				console.error("Error fetching current user:", error);
			}
		};
		fetchCurrentUser();
	}, []);

	const handleLogout = () => {
		localStorage.clear();
		setIsLoggedIn(false);
		setUserRole(null);
		navigate("/login");
	};

	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<div className='min-h-screen bg-gray-100'>
			{/* Navbar */}
			<nav className='bg-white shadow-md'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex'>
							{/* Logo/Brand */}
							<div className='flex-shrink-0 flex items-center'>
								<span className='text-xl font-bold text-blue-600'>DayCare</span>
							</div>

							{/* Navigation Links */}
							<div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
								<Link
									to='/babysitter/schedules'
									className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
										isActive("/babysitter/schedules")
											? "border-blue-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}>
									<FaCalendar className='mr-2' />
									My Schedules
								</Link>
								<Link
									to='/babysitter/incidents'
									className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
										isActive("/babysitter/incidents")
											? "border-blue-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}>
									<FaExclamationTriangle className='mr-2' />
									Reported Incidents
								</Link>
								<Link
									to='/babysitter/report-incident'
									className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
										isActive("/babysitter/report-incident")
											? "border-blue-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}>
									<FaPlus className='mr-2' />
									Report Incident
								</Link>
								<Link
									to='/babysitter/payments'
									className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
										isActive("/babysitter/payments")
											? "border-blue-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}>
									<FaMoneyBillWave className='mr-2' />
									My Payments
								</Link>
							</div>
						</div>

						{/* Right side - Welcome message and Logout */}
						<div className='flex items-center space-x-4'>
							<div className='flex items-center text-gray-700'>
								<FaUser className='mr-2' />
								<span>Welcome, {currentUser?.name || "Babysitter"}</span>
							</div>
							<button
								onClick={handleLogout}
								className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
								<FaSignOutAlt className='mr-2' />
								Logout
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
				{/* Content will be rendered here based on the current route */}
			</main>
		</div>
	);
};

export default BabySitterDashboard;