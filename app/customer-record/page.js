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
  setCustomerRecords,
  setLoading,
  setError,
  deleteCustomerRecord,
} from "../../lib/store/slices/customerRecordsSlice";

export default function CustomerRecordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { customerRecords, isLoading, pagination } = useAppSelector(
    (state) => state.customerRecords
  );

  // Fetch company records
  const fetchCustomerRecords = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosClient.get(
        `/get/customer-record?page=${page}&per_page=30`
      );

      const data = response?.data?.data;
      dispatch(
        setCustomerRecords({
          customerRecords: data.data || [],
          pagination: {
            total: data.total || 0,
            per_page: data.per_page || 30,
            current_page: data.current_page || 1,
            last_page: data.last_page || 1,
          },
        })
      );
    } catch (error) {
      dispatch(setError("Failed to load company records"));
      toast.error("Failed to load company records");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchCustomerRecords();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchCustomerRecords(newPage);
    }
  };

  const handleEdit = (recordId) => {
    router.push(`/edit-customer-record/${recordId}`);
  };

  const handleDelete = async (recordId) => {
    if (confirm("Are you sure you want to delete this company record?")) {
      try {
        await axiosClient.delete(`/customer-record/${recordId}`);
        dispatch(deleteCustomerRecord(recordId));
        toast.success("Company record deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete company record");
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: "bg-green-100 text-green-800",
      expired: "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return "N/A";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return <span className="text-red-600 font-semibold">{daysLeft} days</span>;
    } else if (daysLeft === 0) {
      return <span className="text-orange-600 font-semibold">Expires Today</span>;
    } else if (daysLeft <= 30) {
      return <span className="text-orange-600 font-semibold">{daysLeft} days</span>;
    } else {
      return <span className="text-green-600 font-semibold">{daysLeft} days</span>;
    }
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
                  Company Records
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage company records and their details.
                </p>
              </div>
              <button
                onClick={() => router.push("/add-customer-record")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
              >
                <Plus className="w-5 h-5 text-white mr-2" />
                Add Company Record
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading company records...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {/* <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th> */}
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration No.
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expiry Date
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Days Left
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Folder Address
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          {/* <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.id}
                          </td> */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.name}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {record.service}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {record.reg_no}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(record.start_date)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(record.expiry_date)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {calculateDaysLeft(record.expiry_date)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(record.status)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {record.folder_address ? (
                              <a
                                href={record.folder_address}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                              >
                                Link
                              </a>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(record.id)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {/* <button
                                onClick={() => handleDelete(record.id)}
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
            {customerRecords.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-sm font-medium text-gray-900">
                  No company records found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new company record.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push("/add-customer-record")}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Company Record
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {customerRecords.length > 0 && (
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
