"use client";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProjects,
  setLoading,
  setError,
} from "../../lib/store/slices/projectSlice";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectDetail() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get data from Redux store
  const { projects, loading, meta } = useSelector((state) => state.projects);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch projects on component mount and page change
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axiosClient.get(
          `/all-projects?page=${currentPage}`
        );

        if (response.data && response.data.data) {
          dispatch(setProjects(response.data));
          toast.success(
            `Loaded ${response.data.data.length} projects successfully!`
          );
        } else {
          toast.warn("No projects data found");
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch projects";
        dispatch(setError(errorMsg));
        toast.error(errorMsg);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProjects();
  }, [dispatch, currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= meta?.last_page) {
      setCurrentPage(page);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < meta?.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    if (!meta?.last_page) return [];

    const pages = [];
    const totalPages = meta.last_page;
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handleCardClick = (projectId) => {
    router.push(`/detail/${projectId}`);
  };

  const handleClick = () => {
    router.push("/create-project");
  };

  const [formData, setFormData] = useState({
    active: "",
    pending: "",
    hold: "",
    completed: "",
  });

  const modules = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "hold", label: "Hold" },
    { value: "completed", label: "Completed" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper function to get color based on label
  const getColorByLabel = (label) => {
    switch (label) {
      case "active":
        return "#007BFF";
      case "completed":
        return "#28A745";
      case "on_hold":
        return "#DC3545";
      case "pending":
        return "#FFD700";
      default:
        return "#6B7280";
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Function to render pie chart for a project
  const renderPieChart = (project) => {
    // Create pie chart data from totals object
    const totals = project?.totals || {};
    const pieData = [
      {
        name: "Completed",
        value: totals.completed || 0,
        color: getColorByLabel("completed"),
      },
      {
        name: "Active",
        value: totals.active || 0,
        color: getColorByLabel("active"),
      },
      {
        name: "Pending",
        value: totals.pending || 0,
        color: getColorByLabel("pending"),
      },
      {
        name: "On Hold",
        value: totals.on_hold || 0,
        color: getColorByLabel("on_hold"),
      },
    ].filter((item) => item.value > 0); // Only show segments with values > 0

    const COLORS = pieData.map((item) => item.color);

    // If no data to display, show a message
    if (pieData.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No data available
        </div>
      );
    }

    return (
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  All Projects ({meta?.total || 0})
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {projects.length} projects on page {currentPage} of{" "}
                  {meta?.last_page || 1}
                </p>
              </div>
              <button
                onClick={handleClick}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Create Projects
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <p>Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project?.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-6">
                      {/* Card Header */}
                      <div className="mb-4">
                        <div className="grid grid-cols-[1fr_80px] gap-3 items-start">
                          <div>
                            <h3 className="text-md font-bold text-gray-900 break-words">
                              {project?.project_name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 break-words">
                              {project?.project_type}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCardClick(project?.id)}
                            type="button"
                            className="w-[80px] px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            View
                          </button>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Lead:</span>{" "}
                          {project?.lead}
                        </p>
                      </div>

                      {/* Project Stats Grid */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <p className="text-xs text-blue-700">Total</p>
                          <p className="text-lg font-bold">
                            {project?.totals?.total_stages || 0}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <p className="text-xs text-green-700">Done</p>
                          <p className="text-lg font-bold">
                            {project?.totals?.completed || 0}
                          </p>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded text-center">
                          <p className="text-xs text-yellow-700">Active</p>
                          <p className="text-lg font-bold">
                            {project?.totals?.active || 0}
                          </p>
                        </div>
                        <div className="bg-red-50 p-2 rounded text-center">
                          <p className="text-xs text-red-700">Hold</p>
                          <p className="text-lg font-bold">
                            {project?.totals?.on_hold || 0}
                          </p>
                        </div>
                      </div>

                      {/* Pie Chart */}
                      <div className="mb-4">{renderPieChart(project)}</div>

                      {/* Incomplete Stages */}
                      {/* <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-800">
                            Pending Updates (
                            {project?.incomplete_stages?.length || 0})
                          </h4>
                          {project?.incomplete_stages &&
                            project?.incomplete_stages.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{project?.incomplete_stages.length - 3} more
                              </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {project?.incomplete_stages &&
                          project?.incomplete_stages.length > 0 ? (
                            project?.incomplete_stages
                              .slice(0, 3)
                              .map((stage, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 bg-yellow-50 border border-yellow-100 text-yellow-700 text-xs rounded font-medium"
                                >
                                  {stage.label || `S${stage.stage_id}`}
                                </span>
                              ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              No pending updates
                            </span>
                          )}
                        </div>
                      </div> */}

                      {/* Requested Updates */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-800">
                            Requests ({project?.requested_updates?.length || 0})
                          </h4>
                          {project?.requested_updates &&
                            project?.requested_updates.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{project?.requested_updates.length - 2} more
                              </span>
                            )}
                        </div>
                        <div className="space-y-1">
                          {project?.requested_updates &&
                          project?.requested_updates.length > 0 ? (
                            project?.requested_updates
                              .slice(0, 2)
                              .map((update, index) => (
                                <div
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 border border-blue-100 rounded text-xs text-blue-700 truncate"
                                  title={update.note}
                                >
                                  {update.note
                                    ? update.note.substring(0, 40) + "..."
                                    : `Stage ${index + 1}`}
                                </div>
                              ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              No requests
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500">
                              By: {project?.created_by}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              {project?.last_activity_at
                                ? new Date(
                                    project?.last_activity_at
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * meta.per_page + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * meta.per_page, meta.total)}
                    </span>{" "}
                    of <span className="font-medium">{meta.total}</span> results
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {generatePageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      {/* Ellipsis for more pages */}
                      {meta.last_page >
                        generatePageNumbers()[
                          generatePageNumbers().length - 1
                        ] && (
                        <>
                          <span className="px-2 text-gray-500">...</span>
                          <button
                            onClick={() => handlePageChange(meta.last_page)}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                              currentPage === meta.last_page
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                          >
                            {meta.last_page}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === meta.last_page}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === meta.last_page
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <p>No projects found. Create your first project!</p>
              <button
                onClick={handleClick}
                className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Project
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" />
    </Layout>
  );
}
