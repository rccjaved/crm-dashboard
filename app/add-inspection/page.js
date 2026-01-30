"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addInspection,
  setSubmitting,
  setError,
} from "../../lib/store/slices/insepectionSlice";

export default function AddInspectionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((state) => state.inspection);

  const [formData, setFormData] = useState({
    project_id: "",
    address: "",
    description: "",
    status: "",
    report_result: "",
    issue_field: "",
    assignment_status: "",
    photo_url: null,
    expected_completion_date: "",
    resolved_at: null,
    assigned_to: "",
  });

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
        project_id: formData.project_id ? parseInt(formData.project_id) : null,
        assigned_to: formData.assigned_to
          ? parseInt(formData.assigned_to)
          : null,
        resolved_at: formData.resolved_at || null,
      };

      const response = await axiosClient.post("/c3-reports/store", apiData);

      // Redux mein add karein
      dispatch(addInspection(response.data.data));

      toast.success("Inspection created successfully!");

      setTimeout(() => {
        router.push("/inspection");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create inspection";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Inspection
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project ID */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project ID
            </label>
            <input
              type="number"
              name="project_id"
              value={formData.project_id}
              onChange={handleInputChange}
              placeholder="Enter project ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div> */}

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
              placeholder="Enter address"
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
              placeholder="Enter description"
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
              placeholder="Enter user ID"
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

          {/* Create Inspection Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Inspection"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </Layout>
  );
}
