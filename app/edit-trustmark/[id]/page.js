"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/app/components/Layout";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  updateTrustmark,
  setSubmitting,
} from "@/lib/store/slices/trustmarkSlice";

export default function EditTrustmarkPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const trustmarkId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    description: "",
    status: "",
    photos: "",
    case_open_date: "",
    expected_completion_date: "",
    review_testing_date: "",
    seven_days_deadline: false,
    days_left: "",
    review_status: "",
    assigned_to: "",
    notes: "",
  });
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  // Helper function to format date for input (yyyy-mm-dd)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  // Helper function to convert input date to ISO string for API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    // accept yyyy-mm-dd or dd/mm/yyyy
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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  // Fetch trustmark data
  useEffect(() => {
    const fetchTrustmark = async () => {
      try {
        const response = await axiosClient.get(
          `/trust-mark-audit/${trustmarkId}`
        );
        const trustmark = response.data.data;

        setFormData({
          address: trustmark.address || "",
          description: trustmark.description || "",
          status: trustmark.status || "",
          photos: trustmark.photos
            ? Array.isArray(trustmark.photos)
                ? trustmark.photos.map((p) => (p?.url ? p.url : p)).join(",")
                : trustmark.photos
            : "",
          case_open_date: formatDateForInput(trustmark.case_open_date) || "",
          expected_completion_date:
            formatDateForInput(trustmark.expected_completion_date) || "",
          review_testing_date:
            formatDateForInput(trustmark.review_testing_date) || "",
          seven_days_deadline: !!(trustmark['7_days_deadline'] ?? false),
          days_left: trustmark.days_left ?? "",
          review_status: trustmark.review_status || "",
          assigned_to: trustmark.assigned_to || "",
          notes: trustmark.notes || "",
        });

        // Agar existing photos hain to set karein
        if (trustmark.photos) {
          setExistingPhotos(trustmark.photos);
        }
      } catch (error) {
        toast.error("Failed to load trustmark data");
        // router.push("/trustmark");
      } finally {
        setIsLoading(false);
      }
    };

    if (trustmarkId) {
      fetchTrustmark();
    }
  }, [trustmarkId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const dateFields = ["case_open_date", "expected_completion_date", "review_testing_date"];
    if (dateFields.includes(name)) {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
        // auto-calc days_left when both dates present
        if (next.case_open_date && next.expected_completion_date) {
          const d1 = new Date(next.case_open_date);
          const d2 = new Date(next.expected_completion_date);
          if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
            const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
            next.days_left = String(diff);
          } else {
            next.days_left = "";
          }
        }
        return next;
      });
      return;
    }

    if (e.target.type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date formats only when user entered slash-separated dates (DD/MM/YYYY).
    const slashDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (
      formData.expected_completion_date &&
      formData.expected_completion_date.includes("/") &&
      !slashDateRegex.test(formData.expected_completion_date)
    ) {
      toast.error("Expected completion date must be in DD/MM/YYYY format");
      return;
    }
    if (
      formData.review_testing_date &&
      formData.review_testing_date.includes("/") &&
      !slashDateRegex.test(formData.review_testing_date)
    ) {
      toast.error("Review testing date must be in DD/MM/YYYY format");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Text fields
      formDataToSend.append("address", formData.address);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("status", formData.status);
      // Photos: expect a comma-separated list or single http(s) url(s)
      if (formData.photos) {
        formDataToSend.append("photos", formData.photos);
      }
      formDataToSend.append("assigned_to", formData.assigned_to);
      formDataToSend.append("notes", formData.notes);

      // Dates
      if (formData.case_open_date) {
        formDataToSend.append("case_open_date", formatDateForAPI(formData.case_open_date));
      }
      if (formData.expected_completion_date) {
        formDataToSend.append(
          "expected_completion_date",
          formatDateForAPI(formData.expected_completion_date)
        );
      }
      if (formData.review_testing_date) {
        formDataToSend.append(
          "review_testing_date",
          formatDateForAPI(formData.review_testing_date)
        );
      }

      // Flags and derived
      formDataToSend.append("7_days_deadline", formData.seven_days_deadline ? 1 : 0);
      formDataToSend.append("days_left", formData.days_left);

      // Photos
      photos.forEach((photo) => {
        formDataToSend.append("photos[]", photo);
      });

      const response = await axiosClient.post(
        `/trust-mark-audit/${trustmarkId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update in Redux
      dispatch(updateTrustmark(response.data.data));

      toast.success("Trustmark updated successfully!");

      setTimeout(() => {
        router.push("/trustmark");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update trustmark";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading trustmark data...</p>
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
                  Edit Trustmark Audit
                </h1>
                <p className="text-gray-600 mt-1">
                  Update trustmark audit details
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Case Open Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Open Date
                </label>
                <input
                  type="date"
                  name="case_open_date"
                  value={formData.case_open_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              {/* 7 Days Deadline */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="seven_days_deadline"
                  name="seven_days_deadline"
                  checked={formData.seven_days_deadline}
                  onChange={handleInputChange}
                />
                <label htmlFor="seven_days_deadline" className="text-sm text-gray-700">
                  7 days deadline
                </label>
              </div>

              {/* Expected Completion Date (Deadline) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  name="expected_completion_date"
                  value={formData.expected_completion_date}
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
                  required
                />
              </div>

              {/* Description/Issues */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description/Issues
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

              {/* Days Left */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days Left
                </label>
                <input
                  type="text"
                  name="days_left"
                  value={formData.days_left}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
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

              {/* Review Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Status
                </label>
                <select
                  name="review_status"
                  value={formData.review_status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (http(s) URL, comma separated)
                </label>
                <input
                  type="text"
                  name="photos"
                  value={formData.photos}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo1.jpg, https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Review Testing Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Testing Date
                </label>
                <input
                  type="date"
                  name="review_testing_date"
                  value={formData.review_testing_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned To
                </label>
                <input
                  type="text"
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

           

              {/* Photos */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Select multiple photos to upload
                </p>

                {photos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Photos:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {existingPhotos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Existing Photos:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo.url}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push("/trustmark")}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Trustmark"}
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
