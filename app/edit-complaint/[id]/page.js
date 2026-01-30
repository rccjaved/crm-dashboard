"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/app/components/Layout";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "@/lib/store/hooks";
import { updateComplaint } from "@/lib/store/slices/complaintsSlice";

export default function EditComplaintPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const [complaintId, setComplaintId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    description: "",
    status: "",
    assigned_to: "",
    expected_completion_date: "",
    review_testing_date: "",
  });

  // Helper function to format date from API to DD/MM/YYYY
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // Helper function to convert DD/MM/YYYY to ISO string for API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;

    const parts = dateString.split("/");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return null;

    return date.toISOString();
  };

  // Client-side only initialization
  useEffect(() => {
    if (params.id) {
      setComplaintId(params.id);
    }
  }, [params.id]);

  // Fetch complaint data
  useEffect(() => {
    if (!complaintId) return;

    const fetchComplaint = async () => {
      try {
        const response = await axiosClient.get(`/complaints/${complaintId}`);
        const complaint = response.data.data;

        setFormData({
          address: complaint.address || "",
          description: complaint.description || "",
          status: complaint.status || "",
          assigned_to: complaint.assigned_to || "",
          expected_completion_date:
            formatDateForInput(complaint.expected_completion_date) || "",
          review_testing_date:
            formatDateForInput(complaint.review_testing_date) || "",
        });
      } catch (error) {
        console.error("Error fetching complaint:", error);
        toast.error("Failed to load complaint data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Date input validation for DD/MM/YYYY format
    if (name.includes("date")) {
      // Allow only numbers and slashes
      const cleanedValue = value.replace(/[^\d/]/g, "");

      // Auto-format as user types
      let formattedValue = cleanedValue;
      if (
        cleanedValue.length >= 2 &&
        cleanedValue.length <= 3 &&
        !cleanedValue.includes("/")
      ) {
        formattedValue = cleanedValue.slice(0, 2) + "/" + cleanedValue.slice(2);
      } else if (
        cleanedValue.length >= 5 &&
        cleanedValue.length <= 6 &&
        cleanedValue.split("/").length === 2
      ) {
        const parts = cleanedValue.split("/");
        formattedValue =
          parts[0] + "/" + parts[1].slice(0, 2) + "/" + parts[1].slice(2);
      }

      // Limit to 10 characters (DD/MM/YYYY)
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.slice(0, 10);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!complaintId) {
      toast.error("Invalid complaint ID");
      return;
    }

    // Validate date formats
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (
      formData.expected_completion_date &&
      !dateRegex.test(formData.expected_completion_date)
    ) {
      toast.error("Expected completion date must be in DD/MM/YYYY format");
      return;
    }
    if (
      formData.review_testing_date &&
      !dateRegex.test(formData.review_testing_date)
    ) {
      toast.error("Review testing date must be in DD/MM/YYYY format");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        address: formData.address,
        description: formData.description,
        status: formData.status,
        assigned_to: formData.assigned_to
          ? parseInt(formData.assigned_to)
          : null,
        expected_completion_date: formatDateForAPI(
          formData.expected_completion_date
        ),
        review_testing_date: formatDateForAPI(formData.review_testing_date),
      };

      const response = await axiosClient.put(
        `/complaints/${complaintId}`,
        payload
      );

      dispatch(updateComplaint(response.data.data));
      toast.success("Complaint updated successfully!");

      setTimeout(() => {
        router.push("/complaint");
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update complaint";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!complaintId || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading complaint data...</p>
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
                  Edit Complaint
                </h1>
                <p className="text-gray-500 mt-1">Update complaint details</p>
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

               {/* Expected Completion Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Completion Date
                </label>
                <input
                  type="text"
                  name="expected_completion_date"
                  value={formData.expected_completion_date}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
               
              </div>

              {/* Review Testing Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Testing Date
                </label>
                <input
                  type="text"
                  name="review_testing_date"
                  value={formData.review_testing_date}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

             

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push("/complaint")}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Complaint"}
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
