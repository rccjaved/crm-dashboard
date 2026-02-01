"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "../../components/Layout";
import { useGetLeadByIdQuery, useUpdateLeadMutation } from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { data, isLoading } = useGetLeadByIdQuery(id, { skip: !id });
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    benefits: [],
    services: [],
    document_type: "",
    document_date: "",
  });

  useEffect(() => {
    if (data?.data) {
      const d = data.data;
      setFormData({
        name: d.name || "",
        dob: d.dob ? d.dob.split("T")[0] : "",
        mobile: d.mobile || "",
        email: d.email || "",
        address: d.address || "",
        benefits: d.benefits || [],
        services: d.services || [],
        document_type: d.document_type || "",
        document_date: d.document_date ? d.document_date.split("T")[0] : "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    const arr = value.split(",").map((s) => s.trim()).filter(Boolean);
    setFormData((p) => ({ ...p, [field]: arr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLead({ id, ...formData }).unwrap();
      toast.success("Lead updated");
      setTimeout(() => router.push("/leads"), 800);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update lead");
    }
  };

  if (isLoading) return (
    <Layout>
      <div className="p-6">Loading...</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Edit Lead</h1>

          <div className="bg-white rounded-xl p-6 shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">DOB</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <input name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Benefits</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Income-based Job seeker's Allowance",
                    "Income-related Employment and Support Allowance",
                    "Income Support",
                    "Pension Credit Guranatee Credit",
                    "Working Tax Credit",
                    "Child Tax Credit",
                    "Universal Credit",
                    "Housing Benefit",
                    "Pension Credit Saving Credits",
                  ].map((b) => (
                    <label key={b} className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.benefits.includes(b)}
                        onChange={() => {
                          setFormData((p) => {
                            const exists = p.benefits.includes(b);
                            return { ...p, benefits: exists ? p.benefits.filter(x => x !== b) : [...p.benefits, b] };
                          });
                        }}
                      />
                      <span className="text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Services Required</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "EWI",
                    "Boiler",
                    "FTCH",
                    "Loft Insulation",
                    "Heating Control",
                    "Single Measure",
                    "Solar Panel Installation",
                  ].map((s) => (
                    <label key={s} className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(s)}
                        onChange={() => {
                          setFormData((p) => {
                            const exists = p.services.includes(s);
                            return { ...p, services: exists ? p.services.filter(x => x !== s) : [...p.services, s] };
                          });
                        }}
                      />
                      <span className="text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Document Type</label>
                <select name="document_type" value={formData.document_type} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                  <option value="">Select Document Type</option>
                  <option value="value1">value1</option>
                  <option value="value2">value2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Document Date</label>
                <input type="date" name="document_date" value={formData.document_date} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-blue-500 text-white rounded">
                  {isUpdating ? "Updating..." : "Update Lead"}
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
