import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaUserTie, FaSignInAlt } from "react-icons/fa";
import backgroundImage from "../assets/babySitter1.jpg"; // Update with your actual image path

const AdminLogin = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// In a real application, you would make an API call to authenticate
			// For now, we'll just simulate a successful login
			if (formData.email && formData.password) {
				// Store auth info
				localStorage.setItem("userRole", "admin");
				localStorage.setItem("isAuthenticated", "true");

				toast.success("Admin login successful!");
				navigate("/dashboard"); // Redirect to admin dashboard
			} else {
				toast.error("Please enter both email and password");
			}
		} catch (error) {
			toast.error("Login failed. Please check your credentials.");
			console.error("Login error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className='min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8'
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				position: "relative",
			}}>
			
			<div
				className='absolute inset-0 bg-white-900 bg-opacity-50 backdrop-filter backdrop-blur-sm'
				style={{ backdropFilter: "blur(3px)" }}></div>

			<div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative z-10'>
				<div className='text-center'>
					<div className='mx-auto h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center'>
						<FaUserTie className='h-8 w-8 text-white' />
					</div>
					<h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
						Admin Login
					</h2>
					<p className='mt-2 text-sm text-gray-600'>
						Enter your credentials to access the admin dashboard
					</p>
				</div>

				<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
					<div className='rounded-md -space-y-px'>
						<div className='mb-5'>
							<label
								htmlFor='email'
								className='flex items-center text-sm font-medium text-gray-700 mb-1'>
								<FaEnvelope className='mr-2 text-indigo-600' />
								Email Address
							</label>
							<input
								id='email'
								name='email'
								type='email'
								autoComplete='email'
								required
								className='appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
								placeholder='Enter your email'
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label
								htmlFor='password'
								className='flex items-center text-sm font-medium text-gray-700 mb-1'>
								<FaLock className='mr-2 text-indigo-600' />
								Password
							</label>
							<input
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								required
								className='appearance-none rounded relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
								placeholder='Enter your password'
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<button
							type='submit'
							disabled={loading}
							className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed'>
							{loading ? (
								<>
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
								</>
							) : (
								<>
									<span className='absolute left-0 inset-y-0 flex items-center pl-3'>
										<FaSignInAlt
											className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
											aria-hidden='true'
										/>
									</span>
									Sign in as Admin
								</>
							)}
						</button>
					</div>
				</form>

				<div className='text-center text-sm'>
					<Link
						to='/babysitter-login'
						className='font-medium text-indigo-600 hover:text-indigo-500'>
						Login as Babysitter instead
					</Link>
				</div>

				<div className='mt-6 text-center text-xs text-gray-500'>
					&copy; {new Date().getFullYear()} Daystar Daycare Center. All rights
					reserved.
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
