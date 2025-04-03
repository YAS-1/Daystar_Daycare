import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors({ ...errors, [name]: "" });
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			// This would be replaced with your actual API call
			// const response = await axios.post('/api/admin/login', formData);

			// Simulating API call for now
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// If login is successful
			localStorage.setItem("adminToken", "sample-admin-token");
			localStorage.setItem("userRole", "admin");

			toast.success("Admin login successful!");
			navigate("/admin/dashboard");
		} catch (error) {
			console.error("Login error:", error);
			toast.error(
				error.response?.data?.message || "Login failed. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-indigo-50 px-4'>
			<div className='w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden'>
				<div className='bg-purple-700 py-4 px-6 text-white text-center'>
					<h2 className='text-2xl font-bold'>Administrator Login</h2>
					<p className='text-purple-100'>Daystar Daycare</p>
				</div>

				<div className='p-6'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='space-y-2'>
							<label className='text-sm font-medium text-gray-700 block'>
								Email
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaUserShield className='h-5 w-5 text-gray-400' />
								</div>
								<input
									type='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
									className={`pl-10 w-full py-2 border ${
										errors.email ? "border-red-500" : "border-gray-300"
									} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
									placeholder='admin@daystar.com'
								/>
							</div>
							{errors.email && (
								<p className='text-red-500 text-xs mt-1'>{errors.email}</p>
							)}
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium text-gray-700 block'>
								Password
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<FaLock className='h-5 w-5 text-gray-400' />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									name='password'
									value={formData.password}
									onChange={handleChange}
									className={`pl-10 w-full py-2 border ${
										errors.password ? "border-red-500" : "border-gray-300"
									} rounded-lg focus:ring-purple-500 focus:border-purple-500`}
									placeholder='••••••••'
								/>
								<div
									className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
									onClick={togglePasswordVisibility}>
									{showPassword ? (
										<FaEyeSlash className='h-5 w-5 text-gray-400' />
									) : (
										<FaEye className='h-5 w-5 text-gray-400' />
									)}
								</div>
							</div>
							{errors.password && (
								<p className='text-red-500 text-xs mt-1'>{errors.password}</p>
							)}
						</div>

						<div>
							<button
								type='submit'
								disabled={isLoading}
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'>
								{isLoading ? (
									<span className='flex items-center'>
										<svg
											className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
										</svg>
										Signing in...
									</span>
								) : (
									"Sign in"
								)}
							</button>
						</div>
					</form>

					<div className='mt-6 text-center'>
						<p className='text-sm text-gray-600'>
							Not an administrator?{" "}
							<Link
								to='/babysitter-login'
								className='font-medium text-purple-600 hover:text-purple-500'>
								Babysitter Login
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLoginPage;
