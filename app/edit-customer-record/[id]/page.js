"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  updateCustomerRecord,
  setSubmitting,
} from "../../../lib/store/slices/customerRecordsSlice";
import Layout from "@/app/components/Layout";

export default function EditCustomerRecordPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const recordId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    reg_no: "",
    start_date: "",
    expiry_date: "",
    status: "",
    folder_address: "",
  });

  // Fetch company record data
  useEffect(() => {
    const fetchCustomerRecord = async () => {
      try {
        const response = await axiosClient.get(`/customer-record/${recordId}`);
        const record = response.data.data;

        setFormData({
          name: record.name || "",
          service: record.service || "",
          reg_no: record.reg_no || "",
          start_date: record.start_date ? record.start_date.split("T")[0] : "",
          expiry_date: record.expiry_date ? record.expiry_date.split("T")[0] : "",
          status: record.status || "",
          folder_address: record.folder_address || "",
        });
      } catch (error) {
        toast.error("Failed to load company record data");
        router.push("/customer-record");
      } finally {
        setIsLoading(false);
      }
    };

    if (recordId) {
      fetchCustomerRecord();
    }
  }, [recordId, router]);

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
      const requestData = {
        id: parseInt(recordId),
        ...formData,
      };

      const response = await axiosClient.post(
        `/update-customer-record`,
        requestData
      );

      // Update Redux
      dispatch(updateCustomerRecord(response.data.data));

      toast.success("Company record updated successfully!");

      setTimeout(() => {
        router.push("/customer-record");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update company record";
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
            <p className="text-gray-500">Loading company record data...</p>
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
                  Edit Company Record
                </h1>
                <p className="text-gray-600 mt-1">Update company record details</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reg_no"
                  value={formData.reg_no}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  
                />
              </div>

              {/* Folder Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Address
                </label>
                <input
                  type="text"
                  name="folder_address"
                  value={formData.folder_address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push("/customer-record")}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Update Company Record
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
