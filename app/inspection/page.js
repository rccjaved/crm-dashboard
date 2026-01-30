"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { Plus, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setInspections,
  setLoading,
  setError,
  deleteInspection,
} from "../../lib/store/slices/insepectionSlice";

export default function InspectionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { inspections, isLoading, pagination } = useAppSelector(
    (state) => state.inspection
  );

  // Fetch inspections
  const fetchInspections = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosClient.get(`/c3-reports?page=${page}`);

      dispatch(
        setInspections({
          data: response?.data?.data,
          meta: response?.data?.meta,
        })
      );
    } catch (error) {
      dispatch(setError("Failed to load C3 inspections"));
      toast.error("Failed to load C3 inspections");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchInspections(newPage);
    }
  };

  const handleEdit = (inspectionId) => {
    router.push(`/edit-inspection/${inspectionId}`);
  };

  // const handleDelete = async (inspectionId) => {
  //   if (confirm("Are you sure you want to delete this inspection?")) {
  //     try {
  //       await axiosClient.delete(`/c3-reports/${inspectionId}`);
  //       dispatch(deleteInspection(inspectionId));
  //       toast.success("Inspection deleted successfully!");
  //     } catch (error) {
  //       toast.error("Failed to delete inspection");
  //     }
  //   }
  // };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800",
      in_progress: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusConfig[status] || statusConfig.pending
        }`}
      >
        {status}
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
                  C3 Inspection
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage system inspection and their permissions.
                </p>
              </div>
              <button
                onClick={() => router.push("/add-inspection")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Plus className="w-5 h-5 text-white mr-2" />
                Add Inspection
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading C3 inspections...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                       
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expected Date
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inspections.map((inspection) => (
                        <tr key={inspection.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {inspection.id}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                            <div className="max-w-xs truncate">
                              {inspection.address}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                            <div className="max-w-xs truncate">
                              {inspection.description}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(inspection.status)}
                          </td>
                        
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {inspection.expected_completion_date || "N/A"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(inspection.id)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {/* <button
                                // onClick={() => handleDelete(inspection.id)}
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
            {inspections.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-sm font-medium text-gray-900">
                  No inspections found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new inspection.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push("/add-inspection")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Inspection
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {inspections.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200">
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
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
                      disabled={pagination.current_page === 1}
                      className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-700 min-w-[100px] text-center">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
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
