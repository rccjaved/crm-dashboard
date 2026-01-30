"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  updateInspection,
  setSubmitting,
} from "../../../lib/store/slices/insepectionSlice";
import Layout from "@/app/components/Layout";

export default function EditInspectionPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const inspectionId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    address: "",
    description: "",
    status: "",
    report_result: "",
    issue_field: "",
    assignment_status: "",
    expected_completion_date: "",
    resolved_at: null,
    assigned_to: "",
  });

  // Fetch inspection data
  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const response = await axiosClient.get(`/c3-reports/${inspectionId}`);
        const inspection = response.data.data;

        setFormData({
          address: inspection.address || "",
          description: inspection.description || "",
          status: inspection.status || "",
          report_result: inspection.report_result || "",
          issue_field: inspection.issue_field || "",
          assignment_status: inspection.assignment_status || "",
          expected_completion_date: inspection.expected_completion_date || "",
          resolved_at: inspection.resolved_at || null,
          assigned_to: inspection.assigned_to || "",
        });
      } catch (error) {
        toast.error("Failed to load inspection data");
        router.push("/inspection");
      } finally {
        setIsLoading(false);
      }
    };

    if (inspectionId) {
      fetchInspection();
    }
  }, [inspectionId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setSubmitting(true));

    try {
      const apiData = {
        ...formData,
        assigned_to: formData.assigned_to
          ? parseInt(formData.assigned_to)
          : null,
        resolved_at: formData.resolved_at || null,
      };

      const response = await axiosClient.post(
        `/c3-reports/${inspectionId}`,
        apiData
      );

      // Redux mein update karein
      dispatch(updateInspection(response.data.data));

      toast.success("Inspection updated successfully!");

      setTimeout(() => {
        router.push("/inspection");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update inspection";
      toast.error(errorMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading inspection data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Inspection
                </h1>
                <p className="text-gray-600 mt-1">Update inspection details</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Report Result */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Result
                </label>
                <select
                  name="report_result"
                  value={formData.report_result}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select Report Result</option>
                  <option value="pending_inspection">Pending Inspection</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>

              {/* Issue Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Field
                </label>
                <select
                  name="issue_field"
                  value={formData.issue_field}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select Issue Field</option>
                  <option value="structural">Structural</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="general">General</option>
                </select>
              </div>

              {/* Assignment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Status
                </label>
                <select
                  name="assignment_status"
                  value={formData.assignment_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Select Assignment Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>

              {/* Assigned To (User ID) */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To (User ID)
                </label>
                <input
                  type="number"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div> */}

              {/* Expected Completion Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Completion Date
                </label>
                <input
                  type="date"
                  name="expected_completion_date"
                  value={formData.expected_completion_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push("/inspection")}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Update Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </Layout>
  );
}
