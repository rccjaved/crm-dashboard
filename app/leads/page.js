"use client";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetLeadsQuery, useDeleteLeadMutation } from "@/services/api";
import { useState } from "react";
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import LeadPropertyEvidenceForm from "@/components/LeadPropertyEvidenceForm";

export default function LeadsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading, isFetching, error } = useGetLeadsQuery({ per_page: 20, page });
  const [deleteLead] = useDeleteLeadMutation();

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteLead(id).unwrap();
      toast.success("Lead deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete lead");
    }
  };

  const handleEyeClick = (leadId) => {
    setSelectedLeadId(leadId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedLeadId(null);
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Leads</h1>
              <p className="text-sm text-gray-600">Manage leads</p>
            </div>
            <div>
              <button
                onClick={() => router.push("/add-lead")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Add Lead
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading || isFetching ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading leads...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load leads</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data?.data?.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.name}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.mobile}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">{lead.email}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">{lead.address}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">{(lead.services || []).join(", ")}</td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button onClick={() => handleEyeClick(lead.id)} className="text-gray-600 hover:text-gray-900 p-1 rounded" title="Add Property Evidence">
                                <Eye className="w-4 h-4" />
                              </button>
                              {/* <button onClick={() => router.push(`/leads/${lead.id}`)} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="View">
                                <Edit className="w-4 h-4" />
                              </button> */}
                              <button onClick={() => router.push(`/edit-lead/${lead.id}`)} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              {/* <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-900 p-1 rounded" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {data?.data?.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-sm font-medium text-gray-900">No leads found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new lead.</p>
                  </div>
                )}

                {/* Pagination */}
                {data?.data?.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm text-gray-700">Page {data?.current_page} of {data?.last_page}</div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data?.prev_page_url} className="p-2 border border-gray-300 rounded-md disabled:opacity-50">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setPage((p) => p + 1)} disabled={!data?.next_page_url} className="p-2 border border-gray-300 rounded-md disabled:opacity-50">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
      <LeadPropertyEvidenceForm leadId={selectedLeadId} isOpen={isFormOpen} onClose={handleCloseForm} />
    </Layout>
  );
}
