import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
	FaSignOutAlt,
	FaMoneyBillWave,
	FaCreditCard,
	FaChartLine,
	FaChild,
	FaUser,
} from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import { CgDanger } from "react-icons/cg";

const ManagerDashboard = ({ setIsLoggedIn, setUserRole }) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await axios.post(
				"http://localhost:3337/api/auth/logout",
				{},
				{ withCredentials: true }
			);
			setIsLoggedIn(false);
			setUserRole(null);
			toast.success("Logged out successfully", { position: "top-right" });
			navigate("/manager/login");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Logout failed. Clearing session locally.", {
				position: "top-right",
			});
			setIsLoggedIn(false);
			setUserRole(null);
			navigate("/manager/login");
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 flex'>
			<div className='w-64 bg-[#cfcfcf] text-slate-800 p-6 flex flex-col shadow-lg'>
				<h2 className='text-2xl font-bold mb-8 text-center border-b-2 border-gray-400 pb-4'>
					Manager Dashboard
				</h2>
				<nav className='space-y-2 flex-1'>
					<Link
						to='/manager/dashboard/babysitters'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<FaUser className='mr-3 text-lg group-hover:text-blue-600 transition-colors' />
						<span className='group-hover:font-medium'>Babysitters</span>
					</Link>
					<Link
						to='/manager/dashboard/register-babysitter'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<FaFilePen className='mr-3 text-lg group-hover:text-blue-600 transition-colors' />
						<span className='group-hover:font-medium'>Register Babysitter</span>
					</Link>
					<Link
						to='/manager/dashboard/children'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<FaChild className='mr-3 text-lg group-hover:text-blue-600 transition-colors' />
						<span className='group-hover:font-medium'>Children</span>
					</Link>
					<Link
						to='/manager/dashboard/register-child'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<FaFilePen className='mr-3 text-lg group-hover:text-blue-600 transition-colors' />
						<span className='group-hover:font-medium'>Register Child</span>
					</Link>
					<Link
						to='/manager/dashboard/schedule'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<FaCalendarAlt className='mr-3 text-lg group-hover:text-blue-600 transition-colors' />
						<span className='group-hover:font-medium'>Schedules</span>
					</Link>
					<Link
						to='/manager/dashboard/incidents'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<CgDanger className='mr-3 text-lg group-hover:text-red-600 transition-colors' />
						<span className='group-hover:font-medium'>Incidents</span>
					</Link>
					<Link
						to='/manager/dashboard/payments'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<FaCreditCard className='mr-3 text-lg group-hover:text-green-600 transition-colors' />
						<span className='group-hover:font-medium'>Payments</span>
					</Link>
					<Link
						to='/manager/dashboard/expenses'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<FaMoneyBillWave className='mr-3 text-lg group-hover:text-yellow-600 transition-colors' />
						<span className='group-hover:font-medium'>Expenses</span>
					</Link>
					<Link
						to='/manager/dashboard/finances'
						className='flex items-center p-3 hover:bg-gray-400 rounded-md transition-all duration-200 hover:translate-x-1 hover:shadow-md group'>
						<FaChartLine className='mr-3 text-lg group-hover:text-purple-600 transition-colors' />
						<span className='group-hover:font-medium'>Finances</span>
					</Link>
				</nav>
				<button
					onClick={handleLogout}
					className='mt-6 flex items-center justify-center p-3 bg-red-500 hover:bg-red-600 rounded-md transition-all duration-200 hover:shadow-lg hover:scale-105 text-white font-medium'>
					<FaSignOutAlt className='mr-2' />
					Logout
				</button>
			</div>
			<div className='flex-1 p-6'>
				<Outlet />
				{!Outlet && (
					<p className='text-gray-600'>Select an option from the sidebar.</p>
				)}
			</div>
		</div>
	);
};

export default ManagerDashboard;
