"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Plus, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setComplaints,
  setLoading,
  setError,
  setPagination,
  deleteComplaint,
} from "@/lib/store/slices/complaintsSlice";

export default function ComplaintPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { complaints, isLoading } = useAppSelector(
    (state) => state.complaints
  );
  const [pagination, setLocalPagination] = useState({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch Complaints
  const fetchComplaints = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosClient.get(`/complaints?page=${page}`);

      // Transform data - include photo from API response
      const formatted = res?.data?.data?.map((item, index) => ({
        id: item.id,
        number: (page - 1) * res.data.meta.per_page + index + 1,
        address: item.address,
        description: item.description,
        photo: item.photo, // Add photo from API
        registered_at: formatDate(item.registered_at),
        expected_completion_date: formatDate(item.expected_completion_date),
        review_testing_date: formatDate(item.review_testing_date),
        status: item.status,
        assigned_to: item.assigned_to_user?.full_name || "N/A",
        assigned_to_id: item.assigned_to,
        created_by_user: item.created_by_user,
      }));

      dispatch(setComplaints(formatted || []));
      const paginationData = res?.data?.meta || {
        total: 0,
        per_page: 15,
        current_page: 1,
        last_page: 1,
      };
      setLocalPagination(paginationData);
      dispatch(setPagination(paginationData));
    } catch (error) {
      dispatch(setError("Failed to load complaints"));
      toast.error("Failed to load complaints");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Handle photo preview in new tab
  const handlePhotoPreview = (photoUrl, complaintId) => {
    if (!photoUrl) {
      toast.info("No photo available for this complaint");
      return;
    }

    // Simple new tab open - direct image URL
    window.open(photoUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchComplaints(newPage);
    }
  };

  const handleEdit = (complaintId) => {
    router.push(`/edit-complaint/${complaintId}`);
  };

  const handleDelete = async (complaintId) => {
    if (confirm("Are you sure you want to delete this complaint?")) {
      try {
        await axiosClient.delete(`/complaints/${complaintId}`);
        dispatch(deleteComplaint(complaintId));
        toast.success("Complaint deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete complaint");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      in_progress: { color: "bg-blue-100 text-blue-800", label: "In Progress" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      not_started: { color: "bg-gray-100 text-gray-800", label: "Not Started" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Users Complaint
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage users Complaint and their permissions.
                </p>
              </div>

              <button
                onClick={() => router.push("/add-complaint")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center w-full sm:w-auto justify-center"
              >
                <Plus className="w-5 h-5 text-white mr-2" />
                Add Complaint
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading complaints...</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Complaint Information
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Photo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date of Complaint
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expected Completion
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Review Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {complaints.map((complaint) => (
                        <tr key={complaint.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {complaint.number}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                            <div className="line-clamp-2">{complaint.address}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                            <div className="line-clamp-2">{complaint.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {complaint.photo ? (
                              <button
                                onClick={() => handlePhotoPreview(complaint.photo, complaint.id)}
                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                title="View Photo"
                              >
                                <Eye className="w-4 h-4" />
                              Photo
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">No photo</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.registered_at}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.expected_completion_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {complaint.review_testing_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(complaint.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(complaint.id)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {/* <button
                                onClick={() => handleDelete(complaint.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Empty State */}
            {complaints.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-sm font-medium text-gray-900">
                  No complaints found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add a new complaint to get started.
                </p>
              </div>
            )}

            {/* Pagination */}
            {complaints.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
                    {Math.min(
                      pagination.current_page * pagination.per_page,
                      pagination.total
                    )}{" "}
                    of {pagination.total} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-700 min-w-[100px] text-center">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </Layout>
  );
}