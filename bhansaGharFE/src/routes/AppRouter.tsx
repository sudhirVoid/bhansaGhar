import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
// Mock authentication function
const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return localStorage.getItem("authToken") !== null;
};

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;