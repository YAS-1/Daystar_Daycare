import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BabySitterLoginPage from "./pages/BabySitterLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import BabysitterDashboard from "./components/DashBoards/BabySitterDashboard";

function App() {
	return (
		<Routes>
			{/* Set BabysitterDashboard as the landing page */}
			<Route path='/' element={<BabysitterDashboard />} />

			{/* Authentication routes */}
			<Route path='/babysitter-login' element={<BabySitterLoginPage />} />
			<Route path='/admin-login' element={<AdminLoginPage />} />

			{/* Dashboard routes */}
			<Route path='/babysitter/dashboard' element={<BabysitterDashboard />} />

			{/* Redirect any unknown routes to the main dashboard */}
			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	);
}

export default App;
