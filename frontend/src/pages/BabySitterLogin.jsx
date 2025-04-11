import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaEnvelope, FaLock, FaBaby, FaSignInAlt, FaSpinner } from "react-icons/fa";
import backgroundImage from "../assets/babySitter1.jpg";

//The BabySitterLogin component is used to login a babysitter.
const BabySitterLogin = ({ setIsLoggedIn, setUserRole }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			toast.error("Please fill in all fields", { position: "top-right" });
			return;
		}

		setLoading(true);
		try {
			const response = await axios.post(
				"http://localhost:3337/api/auth/babysitter/login", // The babysitter login API
				formData,
				{ withCredentials: true }
			);

			if (response.data.success) {
				localStorage.setItem("token", response.data.token);
				localStorage.setItem("isAuthenticated", "true");
				localStorage.setItem("userRole", "babysitter");

				setIsLoggedIn(true);
				setUserRole("babysitter");

				toast.success("Welcome, Babysitter!", { position: "top-right" });
				navigate("/babysitter/dashboard");
			} else {
				throw new Error(response.data.message || "Login failed");
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Invalid credentials. Please try again.",
				{ position: "top-right" }
			);
			console.error("Babysitter login error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative'
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}>
			{/* Blur overlay */}
			<div className='absolute inset-0 bg-opacity-70 backdrop-blur-sm'></div>

			<div className='max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-lg p-8 space-y-8 relative z-10'>
				{/* Header */}
				<div className='text-center'>
					<div className='mx-auto w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center'>
						<FaBaby className='w-8 h-8 text-white' />
					</div>
					<h2 className='mt-6 text-3xl font-bold text-gray-900'>
						Babysitter Login
					</h2>
					<p className='mt-2 text-sm text-gray-600'>
						Sign in to your babysitter dashboard
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='space-y-4'>

						{/* Email */}
						<div>
							<label
								htmlFor='email'
								className='flex items-center text-sm font-medium text-gray-700 mb-1'>
								<FaEnvelope className='mr-2 text-pink-500' />
								Email
							</label>
							<input
								id='email'
								name='email'
								type='email'
								value={formData.email}
								onChange={handleChange}
								disabled={loading}
								required
								autoComplete='email'
								className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 outline-none text-gray-900 placeholder-gray-400 disabled:bg-gray-100 transition'
								placeholder='babysitter@example.com'
							/>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor='password'
								className='flex items-center text-sm font-medium text-gray-700 mb-1'>
								<FaLock className='mr-2 text-pink-500' />
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								value={formData.password}
								onChange={handleChange}
								disabled={loading}
								required
								autoComplete='current-password'
								className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 outline-none text-gray-900 placeholder-gray-400 disabled:bg-gray-100 transition'
								placeholder='••••••••'
							/>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						disabled={loading}
						className='w-full flex items-center justify-center py-2 px-4 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-pink-400 disabled:cursor-not-allowed transition'>
						{loading ? (
							<>
								<FaSpinner className='animate-spin mr-2 h-5 w-5' />
								Signing In...
							</>
						) : (
							<>
								<FaSignInAlt className='mr-2 h-5 w-5' />
								Sign In
							</>
						)}
					</button>
				</form>

				{/* Link to Manager Login */}
				<div className='text-center'>
					<Link
						to='/manager/login'
						className='text-sm text-pink-600 hover:text-pink-800 font-medium'>
						Login as Manager instead
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BabySitterLogin;
