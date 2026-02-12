"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateComplaintPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    project_id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    case_open_date: new Date().toISOString().slice(0,10),
    status: "pending",
    expected_completion_date: "",
    review_testing_date: "",
    photo: "",
    review_status: "not_started",
    no_of_days: "",
    office_notes: "",
    assigned_to: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // When expected_completion_date changes, compute no_of_days from case_open_date
    if (name === "expected_completion_date") {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Required fields
        submitData.append("project_id", formData.project_id);
        submitData.append("name", formData.name);
      submitData.append("address", formData.address);
        submitData.append("phone", formData.phone);
        submitData.append("email", formData.email);
      submitData.append("description", formData.description);
      submitData.append("status", formData.status);
      submitData.append(
        "expected_completion_date",
        formData.expected_completion_date
      );
      submitData.append("review_testing_date", formData.review_testing_date);
        submitData.append("case_open_date", formData.case_open_date);
        submitData.append("photo", formData.photo);
        submitData.append("review_status", formData.review_status);
        submitData.append("no_of_days", formData.no_of_days);
        submitData.append("office_notes", formData.office_notes);
      submitData.append("review_status", formData.review_status);
      submitData.append("assigned_to", formData.assigned_to);

      // Optional image
      if (imageFile) {
        submitData.append("photo", imageFile);
      }

      const response = await axiosClient.post("/complaints/store", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Complaint created successfully!");
      setTimeout(() => {
        router.push("/complaint");
      }, 1500);
    } catch (error) {
      console.error("Error creating complaint:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create complaint";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Complaint
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new complaint to the system.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
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

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone"
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
                placeholder="Enter email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Complaint Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter complaint description"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

          {/* Case Open Date (auto) & No. of Days (auto-calculated) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Case Open Date</label>
              <input
                type="date"
                name="case_open_date"
                value={formData.case_open_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. of Days</label>
              <input
                type="text"
                name="no_of_days"
                value={formData.no_of_days}
                onChange={handleInputChange}
                placeholder="Auto-calculated"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
                readOnly
              />
            </div>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Completion Date *
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

            {/* Assigned To */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To (User ID) *
              </label>
              <input
                type="number"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleInputChange}
                placeholder="Enter user ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expected Completion Date */}

            {/* Review Testing Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Testing Date *
              </label>
              <input
                type="date"
                name="review_testing_date"
                value={formData.review_testing_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Status *
              </label>
              <select
                name="review_status"
                value={formData.review_status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="not_started">Not Started</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Image
            </label>
            <input
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleInputChange}
              placeholder="Enter photo url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Review Status */}

          {/* Image Upload */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div> */}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? "Creating..." : "Create Complaint"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" />
    </Layout>
  );
}
