"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import Layout from "./Layout";
import { Clock, DollarSign, Projector, Users, AlertCircle, Shield, FileText } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setDashboardData,
  setLoading,
  setError,
} from "@/lib/store/slices/dashboardSlice";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { dashboardData, loading, error } = useAppSelector((state) => state.dashboard);

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

    fetchDashboardData();
  }, [dispatch]);

  // Helper function to transform chart data from API to recharts format
  const transformChartData = (labels, series) => {
    if (!labels || !series) return [];
    return labels.map((label, index) => ({
      name: label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, " "),
      value: series[index] || 0,
    }));
  };

  // Chart colors
  const COLORS = {
    projects: ["#FFD700", "#007BFF", "#DC3545", "#28A745"], // Pending, Active, On Hold, Completed
    complaints: ["#FFD700", "#007BFF", "#28A745", "#DC3545"], // Pending, In Progress, Completed, Cancelled
    trustmarks: ["#FFD700", "#007BFF", "#9C27B0", "#28A745", "#DC3545"], // Pending, Assigned, In Progress, Completed, Cancelled
    c3_reports: ["#FFD700", "#007BFF", "#9C27B0", "#28A745", "#DC3545"], // Pending, Assigned, In Progress, Completed, Cancelled
  };

  // Projects Chart Data
  const projectsChartData = dashboardData?.projects?.chart
    ? transformChartData(dashboardData.projects.chart.labels, dashboardData.projects.chart.series)
    : [];

  // Complaints Chart Data
  const complaintsChartData = dashboardData?.complaints?.chart
    ? transformChartData(dashboardData.complaints.chart.labels, dashboardData.complaints.chart.series)
    : [];

  // Trustmarks Chart Data
  const trustmarksChartData = dashboardData?.trustmarks?.chart
    ? transformChartData(dashboardData.trustmarks.chart.labels, dashboardData.trustmarks.chart.series)
    : [];

  // C3 Reports Chart Data
  const c3ReportsChartData = dashboardData?.c3_reports?.chart
    ? transformChartData(dashboardData.c3_reports.chart.labels, dashboardData.c3_reports.chart.series)
    : [];

  // Stats Cards Data
  const statsCards = [
    {
      title: "Total Projects",
      value: dashboardData?.totals?.projects || dashboardData?.projects?.total || "0",
      description: `Total: ${dashboardData?.projects?.total || 0} projects`,
      icon: <Projector />,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      title: "Total Complaints",
      value: dashboardData?.totals?.complaints || dashboardData?.complaints?.total || "0",
      description: `Total: ${dashboardData?.complaints?.total || 0} complaints`,
      icon: <AlertCircle />,
      color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      title: "Total Trustmarks",
      value: dashboardData?.totals?.trustmarks || dashboardData?.trustmarks?.total || "0",
      description: `Total: ${dashboardData?.trustmarks?.total || 0} trustmarks`,
      icon: <Shield />,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Total C3 Reports",
      value: dashboardData?.totals?.c3_reports || dashboardData?.c3_reports?.total || "0",
      description: `Total: ${dashboardData?.c3_reports?.total || 0} reports`,
      icon: <FileText />,
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Error loading dashboard</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsCards.map((card, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm border p-6 ${card.color}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium mb-2">{card.title}</p>
                    <h3 className="text-2xl font-bold mb-1">{card.value}</h3>
                    <p className="text-xs opacity-75">{card.description}</p>
                  </div>
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Projects Pie Chart Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Projects Status
              </h3>
              <div className="h-64">
                {projectsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectsChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {projectsChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.projects[index % COLORS.projects.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span style={{ color: "#333", fontSize: "14px" }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Complaints Pie Chart Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Complaints Status
              </h3>
              <div className="h-64">
                {complaintsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={complaintsChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {complaintsChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.complaints[index % COLORS.complaints.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span style={{ color: "#333", fontSize: "14px" }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trustmarks Pie Chart Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trustmarks Status
              </h3>
              <div className="h-64">
                {trustmarksChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trustmarksChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {trustmarksChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.trustmarks[index % COLORS.trustmarks.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span style={{ color: "#333", fontSize: "14px" }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* C3 Reports Pie Chart Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                C3 Reports Status
              </h3>
              <div className="h-64">
                {c3ReportsChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={c3ReportsChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {c3ReportsChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.c3_reports[index % COLORS.c3_reports.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => (
                          <span style={{ color: "#333", fontSize: "14px" }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </Layout>
  );
}
