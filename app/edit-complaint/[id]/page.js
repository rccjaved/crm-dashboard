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
    project_id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    case_open_date: "",
    status: "",
    expected_completion_date: "",
    review_testing_date: "",
    photo: "",
    review_status: "",
    no_of_days: "",
    office_notes: "",
    assigned_to: "",
  });

  // Helper function to format date from API to DD/MM/YYYY
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    // Return yyyy-mm-dd for date inputs
    return date.toISOString().slice(0, 10);
  };

  // Helper function to convert DD/MM/YYYY to ISO string for API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    // support either DD/MM/YYYY or YYYY-MM-DD
    if (dateString.includes("/")) {
      const parts = dateString.split("/");
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) return null;
      return date.toISOString();
    }
    // assume yyyy-mm-dd or ISO
    const date = new Date(dateString);
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
          project_id: complaint.project_id ?? "",
          name: complaint.name || "",
          address: complaint.address || "",
          phone: complaint.phone || "",
          email: complaint.email || "",
          description: complaint.description || "",
          case_open_date: formatDateForInput(complaint.case_open_date) || "",
          status: complaint.status || "",
          assigned_to: complaint.assigned_to || "",
          expected_completion_date:
            formatDateForInput(complaint.expected_completion_date) || "",
          review_testing_date:
            formatDateForInput(complaint.review_testing_date) || "",
          photo: complaint.photo || "",
          review_status: complaint.review_status || "",
          no_of_days: complaint.no_of_days || "",
          office_notes: complaint.office_notes || "",
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
    // For date fields (using native date input), set directly and recalc no_of_days
    const dateFields = ["case_open_date", "expected_completion_date", "review_testing_date"];
    if (dateFields.includes(name)) {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
        // auto-calc no_of_days when both dates present
        if (next.case_open_date && next.expected_completion_date) {
          const d1 = new Date(next.case_open_date);
          const d2 = new Date(next.expected_completion_date);
          if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
            const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
            next.no_of_days = String(diff);
          } else {
            next.no_of_days = "";
          }
        }
        return next;
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!complaintId) {
      toast.error("Invalid complaint ID");
      return;
    }

    // Validate date formats
    // Validate date fields are valid dates if present
    const validateDate = (v) => (v ? !isNaN(new Date(v).getTime()) : true);
    if (!validateDate(formData.expected_completion_date)) {
      toast.error("Expected completion date is invalid");
      return;
    }
    if (!validateDate(formData.review_testing_date)) {
      toast.error("Closing Date is invalid");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        project_id: formData.project_id || null,
        name: formData.name || null,
        address: formData.address,
        phone: formData.phone || null,
        email: formData.email || null,
        description: formData.description,
        case_open_date: formatDateForAPI(formData.case_open_date),
        status: formData.status,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        expected_completion_date: formatDateForAPI(formData.expected_completion_date),
        review_testing_date: formatDateForAPI(formData.review_testing_date),
        review_status: formData.review_status || null,
        no_of_days: formData.no_of_days || null,
        office_notes: formData.office_notes || null,
        photo: formData.photo || null,
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
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

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

                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Open Date</label>
                  <input
                    type="date"
                    name="case_open_date"
                    value={formData.case_open_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    name="review_status"
                    value={formData.review_status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">No. of Days</label>
                  <input
                    type="text"
                    name="no_of_days"
                    value={formData.no_of_days}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complaint URL</label>
                  <input
                    type="text"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Office Notes</label>
                <textarea
                  name="office_notes"
                  value={formData.office_notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
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
                />
              </div>

              {/* Closing Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Date
                </label>
                <input
                  type="date"
                  name="review_testing_date"
                  value={formData.review_testing_date}
                  onChange={handleInputChange}
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

                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rework">Rework</option>
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
