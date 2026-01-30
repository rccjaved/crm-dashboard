"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import ProtectedRoute from "../components/ProtectedRoute";
import axiosClient from "@/lib/axiosClient";
import {
  setDashboardData,
  setLoading,
  setError,
} from "@/lib/store/slices/dashboardSlice";
import { logout } from "@/lib/store/slices/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.auth);
    const { dashboardData, loading, error } = useAppSelector((state) => state.dashboard);

    useEffect(() => {
        if (!userInfo) {
            router.push("/auth/login");
        }
    }, [userInfo, router]);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axiosClient.get("/admin/dashboard");

                if (response.data) {
                    dispatch(setDashboardData(response.data));
                    toast.success("Dashboard data loaded successfully!");
                } else {
                    toast.warn("No dashboard data found");
                }
            } catch (error) {
                const errorMsg =
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch dashboard data";
                dispatch(setError(errorMsg));
                toast.error(errorMsg);
            } finally {
                dispatch(setLoading(false));
            }
        };

        if (userInfo) {
            fetchDashboardData();
        }
    }, [dispatch, userInfo]);

    if (!userInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error) {
        return (
            <ProtectedRoute>
                <div className="p-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-bold">Error loading dashboard</p>
                        <p>{error}</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span>Welcome, {userInfo?.name || userInfo?.email}</span>
                        <button
                            onClick={() => {
                                // Handle logout through Redux
                                dispatch(logout());
                                router.push("/auth/login");
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Dashboard content from API */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Total Users</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.total_users || dashboardData?.users || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Projects</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.total_projects || dashboardData?.projects || 0}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">Inspections</h3>
                        <p className="text-2xl font-bold">
                            {dashboardData?.total_inspections || dashboardData?.inspections || 0}
                        </p>
                    </div>
                </div>
                <ToastContainer position="top-right" />
            </div>
        </ProtectedRoute>
    );
}