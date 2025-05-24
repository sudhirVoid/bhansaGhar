import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Menu from "@/pages/Menu";
import NotFound from "@/pages/NotFound";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import ResturantTable from "@/pages/ResturantTable";
import OpenMenu from "@/pages/OpenMenu";
import OpenRoute from "./OpenRoute";

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
                path="/openMenu/:tableId"
                element={
                    <OpenRoute>
                        <OpenMenu />
                    </OpenRoute>
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
