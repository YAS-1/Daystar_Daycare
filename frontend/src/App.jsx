import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import ManagerLogin from "./pages/ManagerLogin";
import BabySitterLogin from "./pages/BabySitterLogin";
import ManagerDashboard from "./pages/ManagerDashBoard";
import Babysitters from "./components/BabySitters/Babysitters";
import RegisterBabysitter from "./components/BabySitters/RegisterBabysitter";
import Children from "./components/children/children";
import RegisterChild from "./components/children/RegisterChild";
import Schedules from "./components/Schedules/Schedules";
import Incidents from "./components/Incidents/Incidents";
import Payments from "./components/Payments/Payments";
import Expenses from "./components/Expenses/Expenses";
import Finances from "./components/Finances/Finances";
import BabySitterDashboard from "./pages/BabySitterDashboard";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("App mounted. Initial state - LoggedIn:", isLoggedIn, "Role:", userRole);
    }, []);

    useEffect(() => {
        console.log("Path update:", location.pathname, "LoggedIn:", isLoggedIn, "Role:", userRole);
        if (!isLoggedIn && location.pathname.startsWith("/manager/dashboard")) {
            navigate("/manager/login");
        } else if (!isLoggedIn && location.pathname.startsWith("/babysitter/dashboard")) {
            navigate("/babysitter/login");
        }
    }, [isLoggedIn, location.pathname, navigate, userRole]);

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
                >
                    <Route index element={<Navigate to="/manager/dashboard/babysitters" />} />
                    <Route path="babysitters" element={<Babysitters setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                    <Route
                        path="register-babysitter"
                        element={<RegisterBabysitter setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
                    />
                    <Route path="children" element={<Children setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                    <Route
                        path="register-child"
                        element={<RegisterChild setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
                    />
                    <Route path="incidents" element={<Incidents setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                    <Route path="payments" element={<Payments setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                    <Route path="expenses" element={<Expenses setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                    <Route path="finances" element={<Finances setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                    <Route path="schedule" element={<Schedules setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                </Route>
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
        </>
    );
}

export default App;