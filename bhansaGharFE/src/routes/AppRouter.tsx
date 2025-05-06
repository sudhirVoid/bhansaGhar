import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Menu from "@/pages/Menu";
import NotFound from "@/pages/NotFound";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import ResturantTable from "@/pages/ResturantTable";

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/menu"
                element={
                    <PrivateRoute>
                        <Menu />
                    </PrivateRoute>
                }
            />
            <Route
                path="/table"
                element={
                    <PrivateRoute>
                        <ResturantTable />
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
