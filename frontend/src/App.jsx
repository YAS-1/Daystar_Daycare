import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import ManagerLogin from "./pages/ManagerLogin";
import BabySitterLogin from "./pages/BabySitterLogin";
import ManagerDashboard from "./pages/ManagerDashboard";
import BabySitterDashboard from "./pages/BabySitterDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isAuthenticated") === "true");
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
    const navigate = useNavigate();
    const location = useLocation(); // Added to check current path

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated") === "true";
        setIsLoggedIn(authStatus);
        setUserRole(localStorage.getItem("userRole"));
    }, []);

    useEffect(() => {
        
        if (!isLoggedIn && (location.pathname === "/manager/dashboard" || location.pathname === "/babysitter/dashboard")) {
            if (userRole === "manager") navigate("/manager/login");
            else if (userRole === "babysitter") navigate("/babysitter/login");
            else navigate("/manager/login");
        }
    }, [isLoggedIn, userRole, navigate, location.pathname]);

    return (
        <>
            <Routes>
                <Route
                    path="/manager/login"
                    element={
                        isLoggedIn && userRole === "manager" ? (
                            <Navigate to="/manager/dashboard" />
                        ) : (
                            <ManagerLogin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
                        )
                    }
                />
                <Route
                    path="/babysitter/login"
                    element={
                        isLoggedIn && userRole === "babysitter" ? (
                            <Navigate to="/babysitter/dashboard" />
                        ) : (
                            <BabySitterLogin setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
                        )
                    }
                />
                <Route
                    path="/manager/dashboard"
                    element={
                        isLoggedIn && userRole === "manager" ? (
                            <ManagerDashboard setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
                        ) : (
                            <Navigate to="/manager/login" />
                        )
                    }
                />
                <Route
                    path="/babysitter/dashboard"
                    element={
                        isLoggedIn && userRole === "babysitter" ? (
                            <BabySitterDashboard setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
                        ) : (
                            <Navigate to="/babysitter/login" />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/manager/login" />} />
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;