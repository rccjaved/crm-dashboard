"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAddPropertyEvidenceMutation, useGetLeadByIdQuery, useUpdateLeadMutation } from "@/services/api";
import { toast } from "react-toastify";

const LeadPropertyEvidenceForm = ({ leadId, isOpen, onClose }) => {
  const [addPropertyEvidence, { isLoading: isAddingEvidence }] = useAddPropertyEvidenceMutation();
  const [updateLead, { isLoading: isUpdatingLead }] = useUpdateLeadMutation();
  const { data: leadData, isLoading: isLoadingLead } = useGetLeadByIdQuery(leadId, { skip: !leadId || !isOpen });
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Lead fields
    name: "",
    email: "",
    mobile: "",
    address: "",
    lead_date: "",
    // Property evidence fields
    lead_id: leadId,
    lead_provider: "",
    property_ownership: "",
    requested_measures: [],
    make_model_serial: "",
    data_plate: "",
    epc_link: "",
    zoopla_link: "",
    rightmove_link: "",
    mouseprice_link: "",
    propertychecker_link: "",
    survey_folder_link: "",
    google_maps_checked: false,
    google_earth_checked: false,
    requires_c1: null,
    booking_date: "",
    ubil_hthe_name: "",
    ubil_3_months_old: "",
    ubil_video_available: "",
    pres_hhev_name: "",
    pres_3_months_old: "",
    pres_video_available: "",
    gcgp: "",
    front_elevation_photos: [],
    rear_elevation_photos: [],
    wall_thickness_main: [],
    wall_thickness_ext_1: [],
    wall_thickness_ext_2: [],
    pitched_roof_ext_1_sc_evidence_150mm: [],
    pitched_roof_main: [],
    pmhs_with_dataplate: [],
    secondary_heating_source_evidence: "",
    cavity_filled_evidence: "",
    gas_electric_meters: "",
    heater_type: "",
    shower_type: "",
    notes: "",
  });

  // Update form when lead data is fetched
  useEffect(() => {
    if (isOpen && leadData?.data) {
      const lead = leadData.data;
      setFormData((prev) => ({
        ...prev,
        name: lead.name || "",
        email: lead.email || "",
        mobile: lead.mobile || "",
        address: lead.address || "",
        lead_date: lead.created_at ? lead.created_at.split("T")[0] : "",
        lead_id: leadId,
      }));
    }
  }, [leadData, leadId, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayInput = (name, value) => {
    if (Array.isArray(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      const stringValue = value.trim();
      if (stringValue === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: [],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: stringValue.split(",").map((v) => v.trim()),
        }));
      }
    }
  };

  const handleNumericArrayInput = (name, value) => {
    const stringValue = value.trim();
    if (stringValue === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: stringValue.split(",").map((v) => parseFloat(v.trim())).filter((v) => !isNaN(v)),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that lead_id is set
    if (!formData.lead_id) {
      toast.error("Lead ID is missing");
      return;
    }

    // Validate that at least lead_provider is filled
    if (!formData.lead_provider) {
      toast.error("Lead Provider is required");
      return;
    }

    try {
      // First, update the lead with the new information
      const leadUpdateData = {
        id: formData.lead_id,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
      };

      await updateLead(leadUpdateData).unwrap();
      toast.success("Lead information updated");

      // Then, prepare and submit property evidence data
      const evidenceData = { ...formData };
      
      // Remove lead fields from evidence data
      delete evidenceData.name;
      delete evidenceData.email;
      delete evidenceData.mobile;
      delete evidenceData.address;
      delete evidenceData.lead_date;

      // Remove empty arrays
      Object.keys(evidenceData).forEach((key) => {
        if (Array.isArray(evidenceData[key]) && evidenceData[key].length === 0) {
          evidenceData[key] = null;
        }
      });

      // Ensure lead_id is a number
      evidenceData.lead_id = parseInt(evidenceData.lead_id);

      await addPropertyEvidence(evidenceData).unwrap();
      toast.success("Property evidence added successfully!");
      onClose();
      setCurrentStep(1);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        address: "",
        lead_date: "",
        lead_id: leadId,
        lead_provider: "",
        property_ownership: "",
        requested_measures: [],
        make_model_serial: "",
        data_plate: "",
        epc_link: "",
        zoopla_link: "",
        rightmove_link: "",
        mouseprice_link: "",
        propertychecker_link: "",
        survey_folder_link: "",
        google_maps_checked: false,
        google_earth_checked: false,
        requires_c1: null,
        booking_date: "",
        ubil_hthe_name: "",
        ubil_3_months_old: "",
        ubil_video_available: "",
        pres_hhev_name: "",
        pres_3_months_old: "",
        pres_video_available: "",
        gcgp: "",
        front_elevation_photos: [],
        rear_elevation_photos: [],
        wall_thickness_main: [],
        wall_thickness_ext_1: [],
        wall_thickness_ext_2: [],
        pitched_roof_ext_1_sc_evidence_150mm: [],
        pitched_roof_main: [],
        pmhs_with_dataplate: [],
        secondary_heating_source_evidence: "",
        cavity_filled_evidence: "",
        gas_electric_meters: "",
        heater_type: "",
        shower_type: "",
        notes: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold">Lead Property Evidence</h2>
            <p className="text-sm text-gray-600">Step {currentStep} of 3</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {isLoadingLead ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Loading lead information...</p>
            </div>
          ) : (
            <>
          {/* Step 1: Lead Provider Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Lead Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lead Date</label>
                  <input
                    type="date"
                    name="lead_date"
                    value={formData.lead_date}
                    onChange={handleInputChange}
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., William Hollins"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., williamhollis32@hotmail.com"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="e.g., 07895990665"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g., 15 Hart land Avenue, ST6 7NF"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="2"
                />
              </div>

              <hr className="my-6" />

              <h3 className="text-lg font-semibold mb-4">Lead Provider Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lead Provider *</label>
                  <input
                    type="text"
                    name="lead_provider"
                    value={formData.lead_provider}
                    onChange={handleInputChange}
                    placeholder="e.g., Sarfaraz"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Ownership</label>
                  <select
                    name="property_ownership"
                    value={formData.property_ownership}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select...</option>
                    <option value="Owner Occupied">Owner Occupied</option>
                    <option value="Rented">Rented</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Requested Measures</label>
                <textarea
                  name="requested_measures"
                  value={Array.isArray(formData.requested_measures) ? formData.requested_measures.join(", ") : ""}
                  onChange={(e) => handleArrayInput("requested_measures", e.target.value)}
                  placeholder="e.g., EWI, Loft, Boiler (comma-separated)"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Make/Model Serial Number</label>
                  <input
                    type="text"
                    name="make_model_serial"
                    value={formData.make_model_serial}
                    onChange={handleInputChange}
                    placeholder="e.g., Glow Worm FuelSaver MKII"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data Plate</label>
                  <input
                    type="text"
                    name="data_plate"
                    value={formData.data_plate}
                    onChange={handleInputChange}
                    placeholder="e.g., DP-456"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property & Link Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Property & Link Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">EPC Link</label>
                <input
                  type="url"
                  name="epc_link"
                  value={formData.epc_link}
                  onChange={handleInputChange}
                  placeholder="https://example.com/epc"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zoopla Link</label>
                  <input
                    type="url"
                    name="zoopla_link"
                    value={formData.zoopla_link}
                    onChange={handleInputChange}
                    placeholder="Link"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Right Move Link</label>
                  <input
                    type="url"
                    name="rightmove_link"
                    value={formData.rightmove_link}
                    onChange={handleInputChange}
                    placeholder="Link"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mouse Price Link</label>
                  <input
                    type="url"
                    name="mouseprice_link"
                    value={formData.mouseprice_link}
                    onChange={handleInputChange}
                    placeholder="Link"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Checker Link</label>
                  <input
                    type="url"
                    name="propertychecker_link"
                    value={formData.propertychecker_link}
                    onChange={handleInputChange}
                    placeholder="Link"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Survey Folder Link</label>
                <input
                  type="url"
                  name="survey_folder_link"
                  value={formData.survey_folder_link}
                  onChange={handleInputChange}
                  placeholder="Link"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="google_maps_checked"
                    checked={formData.google_maps_checked}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Google Maps Checked</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="google_earth_checked"
                    checked={formData.google_earth_checked}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Google Earth Checked</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Requires C1</label>
                  <select
                    name="requires_c1"
                    value={formData.requires_c1 === null ? "" : formData.requires_c1}
                    onChange={(e) => setFormData((prev) => ({ ...prev, requires_c1: e.target.value === "" ? null : e.target.value === "true" }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Booking Date</label>
                <input
                  type="date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {/* Step 3: Mandatory Evidence */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Mandatory Evidence</h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">UBIL HTHE Name</label>
                  <select
                    name="ubil_hthe_name"
                    value={formData.ubil_hthe_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Available">Available</option>
                    <option value="Not available">Not available</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">UBIL 3 Months OLD</label>
                  <select
                    name="ubil_3_months_old"
                    value={formData.ubil_3_months_old}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Available">Available</option>
                    <option value="Not available">Not available</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">UBIL Video</label>
                  <select
                    name="ubil_video_available"
                    value={formData.ubil_video_available}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Available">Available</option>
                    <option value="Not available">Not available</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">PRES HHEV Name</label>
                  <select
                    name="pres_hhev_name"
                    value={formData.pres_hhev_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Required">Required</option>
                    <option value="Not Required">Not Required</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PRES 3 Months OLD</label>
                  <select
                    name="pres_3_months_old"
                    value={formData.pres_3_months_old}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Required">Required</option>
                    <option value="Not Required">Not Required</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PRES Video</label>
                  <select
                    name="pres_video_available"
                    value={formData.pres_video_available}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Required">Required</option>
                    <option value="Not Required">Not Required</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">GCGP</label>
                  <select
                    name="gcgp"
                    value={formData.gcgp}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="EPC">EPC</option>
                    <option value="Photos">Photos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heater Type</label>
                  <select
                    name="heater_type"
                    value={formData.heater_type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Gas">Gas</option>
                    <option value="Electric">Electric</option>
                    <option value="Gas/Electric">Gas/Electric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shower Type</label>
                  <select
                    name="shower_type"
                    value={formData.shower_type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="Electric">Electric</option>
                    <option value="Non Electric">Non Electric</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Front Elevation Photos</label>
                <textarea
                  value={Array.isArray(formData.front_elevation_photos) ? formData.front_elevation_photos.join(", ") : ""}
                  onChange={(e) => handleArrayInput("front_elevation_photos", e.target.value)}
                  placeholder="Enter URLs separated by commas"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rear Elevation Photos</label>
                <textarea
                  value={Array.isArray(formData.rear_elevation_photos) ? formData.rear_elevation_photos.join(", ") : ""}
                  onChange={(e) => handleArrayInput("rear_elevation_photos", e.target.value)}
                  placeholder="Enter URLs separated by commas"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wall Thickness Main</label>
                  <textarea
                    value={formData.wall_thickness_main.join(", ")}
                    onChange={(e) => handleNumericArrayInput("wall_thickness_main", e.target.value)}
                    placeholder="Numeric values (comma-separated)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wall Thickness Ext 1</label>
                  <textarea
                    value={formData.wall_thickness_ext_1.join(", ")}
                    onChange={(e) => handleNumericArrayInput("wall_thickness_ext_1", e.target.value)}
                    placeholder="Numeric values (comma-separated)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wall Thickness Ext 2</label>
                  <textarea
                    value={formData.wall_thickness_ext_2.join(", ")}
                    onChange={(e) => handleNumericArrayInput("wall_thickness_ext_2", e.target.value)}
                    placeholder="Numeric values (comma-separated)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pitched Roof Main</label>
                  <textarea
                    value={formData.pitched_roof_main.join(", ")}
                    onChange={(e) => handleNumericArrayInput("pitched_roof_main", e.target.value)}
                    placeholder="Numeric values (comma-separated)"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PMHS with Dataplate</label>
                  <textarea
                    value={Array.isArray(formData.pmhs_with_dataplate) ? formData.pmhs_with_dataplate.join(", ") : ""}
                    onChange={(e) => handleArrayInput("pmhs_with_dataplate", e.target.value)}
                    placeholder="Values separated by commas"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes / Additional Information</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional information"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>
            </div>
          )}

          {/* Footer with Navigation */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={`w-8 h-8 rounded-full font-semibold text-sm ${
                    currentStep === step
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            {currentStep === 3 ? (
              <button
                type="submit"
                disabled={isAddingEvidence || isUpdatingLead || isLoadingLead}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                <span>{isUpdatingLead || isAddingEvidence ? "Submitting..." : "Submit"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LeadPropertyEvidenceForm;
