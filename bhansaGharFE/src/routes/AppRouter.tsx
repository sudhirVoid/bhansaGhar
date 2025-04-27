import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Menu from "@/pages/Menu";

// Mock authentication function
const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return localStorage.getItem("authToken") !== null;
};

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
                path="/menu"
                element={isAuthenticated() ? <Menu /> : <Navigate to="/login" />}
            />
            {/* Add a redirect from root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;