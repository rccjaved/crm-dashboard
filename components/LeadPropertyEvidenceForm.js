"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAddPropertyEvidenceMutation, useGetLeadByIdQuery, useUpdateLeadMutation } from "@/services/api";
import { toast } from "react-toastify";

const HARDCODED_DOCUMENTS = [
  {
    main_folder: "Common Folder",
    file_type: "GCGP",
    documents: [
      { name: "ASBAR", status: "Done", issue: "", issue_date: "2026-01-10" },
      { name: "Assessment Pack", status: "Pending", issue: "as per query 664 Assessment pack required", issue_date: "" },
      { name: "Bath Extractor_Electric minor Works", status: "Done", issue: "", issue_date: "2026-02-03" },
      { name: "BREG EXTRACTOR FAN", status: "Done", issue: "Will Confirm with post ventilation", issue_date: "" },
      { name: "BREG TRICKLE VENTS", status: "Done", issue: "Will Confirm with post ventilation", issue_date: "" },
      { name: "Cavity Filled Evidence Main", status: "Not Required", issue: "", issue_date: "" },
      { name: "Cavity Filled Evidence Ext 1", status: "Not Required", issue: "", issue_date: "" },
      { name: "Corelogic ABS Screenshot", status: "Not Required", issue: "", issue_date: "" },
      { name: "EPOP", status: "Done", issue: "Flue issue pointed", issue_date: "" },
      { name: "ESTC", status: "Done", issue: "", issue_date: "2026-01-10" },
      { name: "Flat Roof SC EXT 1 evidence 150mm", status: "Not Required", issue: "", issue_date: "" },
      { name: "Floor plan", status: "Done", issue: "", issue_date: "" },
      { name: "HHEV", status: "Done", issue: "", issue_date: "2026-01-20" },
      { name: "HTHE", status: "Done", issue: "", issue_date: "2026-01-12" },
      { name: "Ofgem Rental", status: "Not Required", issue: "", issue_date: "" },
      { name: "On-Gas Evidence", status: "Done", issue: "Unable to read the date provide clear picture", issue_date: "" },
      { name: "PICI", status: "Done", issue: "Editable, Confirm first install as loft is 30/01", issue_date: "2026-02-05" },
      { name: "PIPS", status: "Done", issue: "page 7 Title need to be miss as page 3, pagw 10 tick missing, Update Floor Plan", issue_date: "" },
      { name: "PMHS", status: "Done", issue: "", issue_date: "" },
      { name: "Post Code Finder", status: "Not Required", issue: "", issue_date: "" },
      { name: "PRIV", status: "Done", issue: "", issue_date: "" },
      { name: "Retrofit Risk Assessment", status: "Done", issue: "", issue_date: "" },
      { name: "Room Height Evidence", status: "Done", issue: "Videos missing to verify", issue_date: "" },
      { name: "Same Name Declaration", status: "Not Required", issue: "", issue_date: "" },
      { name: "Secondary Heating Source Evidence", status: "Pending", issue: "", issue_date: "" },
      { name: "SMEV", status: "Done", issue: "", issue_date: "" },
      { name: "UBIL 1.. UBIL Customer", status: "Done", issue: "", issue_date: "2025-07-11" },
      { name: "UBIL 2.. PRES Owner", status: "Not Required", issue: "", issue_date: "" },
      { name: "Wall Thickness Main Cavity 300mm", status: "Done", issue: "", issue_date: "" },
      { name: "Wall Thickness Ext 1 Cavity 300mm", status: "Not Required", issue: "", issue_date: "" },
    ],
  },
  {
    main_folder: "Submission Loft",
    file_type: "",
    documents: [
      { name: "BREG Loft", status: "Done", issue: "", issue_date: "" },
      { name: "Loft_Insurance Gurantee", status: "KSDL", issue: "", issue_date: "" },
      { name: "Loft_Materials and Workmanship", status: "KSDL", issue: "", issue_date: "" },
      { name: "Loft_ Notification Certificate", status: "KSDL", issue: "", issue_date: "" },
      { name: "Loft_Operative Competence", status: "Done", issue: "", issue_date: "" },
      { name: "LDEC", status: "Done", issue: "", issue_date: "" },
      { name: "PIBI Loft", status: "Done", issue: "", issue_date: "" },
      { name: "Loft_Post Install photos", status: "Done", issue: "Loft Ventilation", issue_date: "2026-01-30" },
      { name: "Loft_Mid Install photos", status: "Done", issue: "Flue issue pointed", issue_date: "" },
      { name: "Loft_Pre Install photos", status: "Done", issue: "", issue_date: "" },
    ],
  },
  {
    main_folder: "FTCH or HC or B",
    file_type: "Boiler/HC/FTCH",
    documents: [
      { name: "BOILER__Insurance Gurantee", status: "BLB", issue: "", issue_date: "" },
      { name: "BOILER_Materials and Workmanship", status: "BLB", issue: "", issue_date: "" },
      { name: "BOILER_ Notification Certificate", status: "BLB", issue: "", issue_date: "" },
      { name: "BCOM", status: "Done", issue: "", issue_date: "2026-02-03" },
      { name: "BOILER_Operative Competence", status: "Done", issue: "", issue_date: "" },
      { name: "BREG BOILER", status: "Done", issue: "", issue_date: "" },
      { name: "BREG HC", status: "Done", issue: "", issue_date: "" },
      { name: "BREG TRVS", status: "Not Required", issue: "", issue_date: "" },
      { name: "BREG TTZC", status: "Done", issue: "Flue issue pointed", issue_date: "" },
      { name: "BWOD", status: "Done", issue: "", issue_date: "" },
      { name: "HTSC", status: "Done", issue: "compress", issue_date: "" },
      { name: "PCDB A", status: "Done", issue: "", issue_date: "" },
      { name: "PCDB B", status: "Done", issue: "", issue_date: "" },
      { name: "PCDB TTZC", status: "Done", issue: "", issue_date: "" },
      { name: "PIBI Boiler", status: "Done", issue: "", issue_date: "" },
      { name: "Boiler_Post Install photos", status: "Done", issue: "Remove photo 2", issue_date: "2026-02-03" },
      { name: "Boiler_Mid Install photos", status: "Done", issue: "Need Pre Boiler flue photo", issue_date: "" },
      { name: "Boiler_Pre Install photos", status: "Done", issue: "Boiler Flue outside", issue_date: "" },
      { name: "PIHC", status: "Done", issue: "", issue_date: "" },
      { name: "PPES", status: "Done", issue: "Post code missing", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "BOILER",
    documents: [
      { name: "ADF1 EEM method statement", status: "Done", issue: "Wrong date", issue_date: "" },
      { name: "Airtightness Strategy", status: "BLB", issue: "", issue_date: "" },
      { name: "Assessment Data Entry", status: "Done", issue: "Pre ventilation pack required to verify", issue_date: "" },
      { name: "Boiler-Method Statement 2023", status: "Done", issue: "", issue_date: "" },
      { name: "Boiler Handover", status: "Done", issue: "", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "HC",
    documents: [
      { name: "Claim of Compliance PAS 2030", status: "Done", issue: "", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "LOFT",
    documents: [
      { name: "Claim of Compliance PAS 2030", status: "Done", issue: "Title need to change to MIss", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "BOILER",
    documents: [
      { name: "Claim of Compliance PAS 2035", status: "Done", issue: "", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "HC",
    documents: [
      { name: "Claim of Compliance PAS 2035", status: "Done", issue: "", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "LOFT",
    documents: [
      { name: "Claim of Compliance PAS 2035", status: "Done", issue: "", issue_date: "" },
      { name: "Conflict of interest statement", status: "Done", issue: "", issue_date: "" },
      { name: "Coordinator Handover Letter", status: "Errors", issue: "Title issue and Loft install date missing", issue_date: "" },
      { name: "ELEC_Operative Competence", status: "Done", issue: "", issue_date: "" },
      { name: "GD F16 - Claim of Compliance 2023 Boiler", status: "Done", issue: "", issue_date: "" },
      { name: "GD F16 - Claim of Compliance 2023 hc", status: "Done", issue: "", issue_date: "" },
      { name: "GD F16 - Claim of Compliance 2023 Loft", status: "Done", issue: "", issue_date: "" },
      { name: "HC Handover", status: "Done", issue: "", issue_date: "" },
      { name: "HC-Method Statement 2023", status: "Not Required", issue: "", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "Post Ventilation",
    documents: [
      { name: "Installed Ventilation Photos", status: "Pending", issue: "", issue_date: "" },
      { name: "Loft Handover", status: "Done", issue: "", issue_date: "" },
      { name: "LOFT-Method Statement 2023", status: "Errors", issue: "number wrong", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "Pre Ventilation",
    documents: [
      { name: "PRE Ventilation Pack", status: "Pending", issue: "", issue_date: "" },
      { name: "Heat Demand Calculator", status: "Done", issue: "", issue_date: "" },
      { name: "RA_Retrofit Assessor qualification", status: "Done", issue: "", issue_date: "" },
      { name: "RC_Retrofit Coordinator Qualification", status: "Done", issue: "", issue_date: "" },
      { name: "Retrofit design", status: "Done", issue: "", issue_date: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "Appendix D",
    documents: [
      { name: "Ventilation Assessment Check list Appendix D", status: "Done", issue: "", issue_date: "" },
      { name: "Ventilation assessment reference", status: "Done", issue: "", issue_date: "" },
      { name: "Ventilation Strategy", status: "Done", issue: "Pre ventilation pack required to verify", issue_date: "" },
    ],
  },
  {
    main_folder: "Additional Data",
    file_type: "",
    documents: [
      { name: "EPC matching Room Height Videos", status: "Done", issue: "", issue_date: "" },
      { name: "Boiler_Post Install Video", status: "Not Required", issue: "", issue_date: "" },
      { name: "PMHS Video", status: "Done", issue: "Video is not good. flue and any pipe work?", issue_date: "" },
    ],
  },
];

const LeadPropertyEvidenceForm = ({ leadId, isOpen, onClose, inline = false }) => {
  const FIXED_FLOOR_NAMES = [
    "First floor area",
    "Ground floor",
    "Ext 1 First Floor",
    "Ext 1 Ground Floor",
    "Ext 2 First Floor",
    "Ext 2 Ground Floor",
    "Ext 3 First Floor",
    "Ext 3 Ground Floor",
    "Alley way Extension",
  ];
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
    services: [],
    documents: JSON.parse(JSON.stringify(HARDCODED_DOCUMENTS)),
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
    // New sheet / trustmark / tecnica fields (step 4)
    epr_check_matching: false,
    installation_changes: false,
    pas10_changes_before_submit: false,

    updating_master_sheets: false,
    master_sheet_giant_source: "",

    update_tecnica_order_sheet: false,
    c3_issues_found_internal: false,

    c2_packs_all_key_parts_and_stages: false,
    c3_packs_all_key_parts: false,

    queries: "",
    queries_status: false,

    trustmark: "",
    lodgement: "",
    trustmark_project_certificate: "",
    project_stage1_trustmark_project_certificate: "",

    tecnica: "",
    scaffolding_removed_date: "",
    rubbish_collected_date: "",
    // EPC / numeric metrics new fields
    start_sap: null,
    end_sap: null,
    number_metrics: {
      number1: null,
      number2: null,
      number3: null,
    },
    epc_metrics: {
      epc_rating: { previous: null, current: null, difference: null },
      epc_area: { previous: null, current: null, difference: null },
      loft_insulation: { previous: null, current: null, difference: null },
      secondary_heating: { previous: null, current: null, difference: null },
      cavity_wall_insulation: { previous: null, current: null, difference: null },
      loft_ext_1: { previous: null, current: null, difference: null },
      property_age: { previous: "", current: "", difference: null },
    },
    high_value_notes: "",
    // initialize fixed floor rows
    floor_details: [
      ...FIXED_FLOOR_NAMES.map((n) => ({ name: n, area: null, height: null, hlp: null, pw: null, notes: "" })),
    ],
    // Loft details (new fields requested)
    loft_details: [
      { name: "Main", area: null, type: "" },
      { name: "Ext 1", area: null, type: "" },
      { name: "Ext 2", area: null, type: "" },
      { name: "Ext 3", area: null, type: "" },
      { name: "Alleyway", area: null, type: "" },
    ],
    total_loft: null,
    ba: null,

    // Wall extension details
    wall_ext_details: [
      { name: "Ext 1", area: null, construction_type: "" },
      { name: "Ext 2", area: null, construction_type: "" },
    ],
    solid_wall_area: null,
    glazed_area: null,
    wall_excluding_windows_pici: null,
    total_wall_pici: null,
    popt: null,
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
        // populate services from lead.services
        services: lead.services || [],
        // populate documents from lead.documents (keep hardcoded default if lead has none)
        documents: (Array.isArray(lead.documents) && lead.documents.length > 0) ? lead.documents : prev.documents,
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

  // Handle nested JSON inputs like epc_metrics and number_metrics
  const handleNestedInput = (parent, key, subkey, value, isNumeric = true) => {
    setFormData((prev) => {
      const parentObj = prev[parent] ? { ...prev[parent] } : {};
      // If subkey is null, we are setting a direct value (e.g., number_metrics.number1)
      if (subkey === null) {
        const parsed = isNumeric && value !== "" ? parseFloat(value) : value;
        parentObj[key] = parsed;
        return { ...prev, [parent]: parentObj };
      }

      const item = parentObj[key] ? { ...parentObj[key] } : {};
      const parsed = isNumeric && value !== "" ? parseFloat(value) : value;
      item[subkey] = parsed;
      // compute difference for numeric previous/current when both provided
      if (item.previous !== undefined && item.current !== undefined) {
        const a = parseFloat(item.previous);
        const b = parseFloat(item.current);
        if (!isNaN(a) && !isNaN(b)) item.difference = +(b - a).toFixed(2);
        else item.difference = null;
      }
      parentObj[key] = item;
      return { ...prev, [parent]: parentObj };
    });
  };

  // Floor details helpers
  const DEFAULT_HLP = 5.9;
  const DEFAULT_PW = 6.7;
  const defaultAddition = DEFAULT_HLP * DEFAULT_PW; // 39.53

  const addFloorRow = () => {
    setFormData((prev) => ({
      ...prev,
      floor_details: [
        ...(Array.isArray(prev.floor_details) ? prev.floor_details : []),
        { name: "", area: null, height: null, hlp: null, pw: null, notes: "" },
      ],
    }));
  };

  const removeFloorRow = (index) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.floor_details) ? [...prev.floor_details] : [];
      arr.splice(index, 1);
      return { ...prev, floor_details: arr };
    });
    setTimeout(recalcFloorTotals, 0);
  };

  const updateFloorRow = (index, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.floor_details) ? [...prev.floor_details] : [];
      const row = { ...(arr[index] || {}) };
      row[key] = value === "" ? null : value;
      arr[index] = row;
      return { ...prev, floor_details: arr };
    });
    // Recalculate totals after change
    setTimeout(recalcFloorTotals, 0);
  };

  const recalcFloorTotals = () => {
    const rows = Array.isArray(formData.floor_details) ? formData.floor_details : [];
    let totalEpc = 0;
    let totalGround = 0;
    let highest = null;
    let hlpSum = 0;

    rows.forEach((r) => {
      const area = parseFloat(r.area) || 0;
      const hlp = parseFloat(r.hlp);
      const pw = parseFloat(r.pw);
      const addition = (!isNaN(hlp) && !isNaN(pw)) ? hlp * pw : defaultAddition;
      const effective = +(area + addition).toFixed(2);
      totalEpc += effective;
      if (/ground/i.test(r.name || "")) {
        totalGround += effective;
      }
      if (highest === null || effective > highest) highest = effective;
      if (!isNaN(hlp)) hlpSum += hlp;
    });

    const totalEpcRounded = +totalEpc.toFixed(2);
    const totalGroundRounded = +totalGround.toFixed(2);
    const highestRounded = highest === null ? null : +highest.toFixed(2);
    const hlpRounded = +hlpSum.toFixed(2);
    // heat demand total wall area approximated as 0.762 * total EPC (to match sample)
    const heatDemand = +((totalEpcRounded * 0.762) || 0).toFixed(2);

    setFormData((prev) => ({
      ...prev,
      total_epc_area: totalEpcRounded,
      total_floor_area_excluding_rir: totalEpcRounded,
      heat_demand_total_wall_area: heatDemand,
      total_ground_floor_area: totalGroundRounded,
      highest_floor_area: highestRounded,
      total_hlp: hlpRounded,
    }));
  };

  // Recalculate totals when floor rows change
  useEffect(() => {
    recalcFloorTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.floor_details]);

  // Loft totals recalculation
  const recalcLoftTotals = () => {
    const rows = Array.isArray(formData.loft_details) ? formData.loft_details : [];
    const total = rows.reduce((s, r) => s + (parseFloat(r.area) || 0), 0);
    const totalRounded = +total.toFixed(2);
    // BA approximated as 0.594 * total_loft (matches example: 80.59 -> ~47.88)
    const ba = +(totalRounded * 0.594).toFixed(2);
    setFormData((prev) => ({ ...prev, total_loft: totalRounded, ba }));
  };

  // Wall totals recalculation
  const recalcWallTotals = () => {
    const extRows = Array.isArray(formData.wall_ext_details) ? formData.wall_ext_details : [];
    const extSum = extRows.reduce((s, r) => s + (parseFloat(r.area) || 0), 0);
    const solid = parseFloat(formData.solid_wall_area) || 0;
    const glazed = parseFloat(formData.glazed_area) || 0;
    const wallExcl = +(solid - glazed).toFixed(2);
    const totalPici = +(solid - extSum).toFixed(2);
    setFormData((prev) => ({ ...prev, wall_excluding_windows_pici: wallExcl, total_wall_pici: totalPici }));
  };

  // Recalculate loft and wall totals when related fields change
  useEffect(() => {
    recalcLoftTotals();
    recalcWallTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.loft_details, formData.wall_ext_details, formData.solid_wall_area, formData.glazed_area]);

  // Document groups helpers
  const addDocumentGroup = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...(Array.isArray(prev.documents) ? prev.documents : []), { main_folder: "", file_type: "", documents: [] }],
    }));
  };

  const removeDocumentGroup = (index) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.documents) ? [...prev.documents] : [];
      arr.splice(index, 1);
      return { ...prev, documents: arr };
    });
  };

  const updateDocumentGroup = (index, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.documents) ? [...prev.documents] : [];
      const g = { ...(arr[index] || {}) };
      g[key] = value;
      arr[index] = g;
      return { ...prev, documents: arr };
    });
  };

  const addDocumentRow = (groupIndex) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.documents) ? [...prev.documents] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      g.documents = [...(Array.isArray(g.documents) ? g.documents : []), { name: "", status: "", issue: "", issue_date: "" }];
      arr[groupIndex] = g;
      return { ...prev, documents: arr };
    });
  };

  const removeDocumentRow = (groupIndex, docIndex) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.documents) ? [...prev.documents] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      const docs = Array.isArray(g.documents) ? [...g.documents] : [];
      docs.splice(docIndex, 1);
      g.documents = docs;
      arr[groupIndex] = g;
      return { ...prev, documents: arr };
    });
  };

  const updateDocumentRow = (groupIndex, docIndex, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.documents) ? [...prev.documents] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      const docs = Array.isArray(g.documents) ? [...g.documents] : [];
      const d = { ...(docs[docIndex] || {}) };
      d[key] = value;
      docs[docIndex] = d;
      g.documents = docs;
      arr[groupIndex] = g;
      return { ...prev, documents: arr };
    });
  };

  const saveProposedMeasures = async () => {
    try {
      // ensure lead_id available
      if (!formData.lead_id) return;
      // call updateLead to update services on the lead
      await updateLead({ id: formData.lead_id, services: formData.services }).unwrap();
      toast.success("Services saved");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save services");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission unless user is on final step (step 7)
    if (currentStep !== 7) {
      setCurrentStep(7);
      return;
    }

    // Basic required validation for first field on step 3
    if (!formData.ubil_hthe_name) {
      toast.error("Please fill the required evidence: UBIL HTHE Name");
      setCurrentStep(3);
      return;
    }

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

      console.log("Updating lead:", leadUpdateData);
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
      // We do not send services to evidence since it's stored on leads.services
      delete evidenceData.services;
      // Ensure floor details and totals are included (they are in formData already)
      // Convert empty floor_details to null so backend handles it consistently
      if (Array.isArray(evidenceData.floor_details) && evidenceData.floor_details.length === 0) {
        evidenceData.floor_details = null;
      }

      // Remove empty arrays
      Object.keys(evidenceData).forEach((key) => {
        if (Array.isArray(evidenceData[key]) && evidenceData[key].length === 0) {
          evidenceData[key] = null;
        }
      });

      // Ensure lead_id is a number
      evidenceData.lead_id = parseInt(evidenceData.lead_id);

      // log payload so we can inspect in browser console / network
      console.log("Submitting property evidence:", evidenceData);
      try {
        await addPropertyEvidence(evidenceData).unwrap();
        toast.success("Property evidence added successfully!");
      } catch (err) {
        console.error("addPropertyEvidence error:", err);
        toast.error(err?.data?.message || "Failed to add property evidence");
        return; // stop further success flow
      }
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
        services: [],
        documents: JSON.parse(JSON.stringify(HARDCODED_DOCUMENTS)),
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
        front_elevation_photos: "",
        rear_elevation_photos: "",
        wall_thickness_main: "",
        wall_thickness_ext_1: "",
        wall_thickness_ext_2: "",
        pitched_roof_ext_1_sc_evidence_150mm: "",
        pitched_roof_main: "",
        pmhs_with_dataplate: "",
        secondary_heating_source_evidence: "",
        cavity_filled_evidence: "",
        gas_electric_meters: "",
        heater_type: "",
        shower_type: "",
        notes: "",
        // reset new fields
        epr_check_matching: false,
        installation_changes: false,
        pas10_changes_before_submit: false,

        updating_master_sheets: false,
        master_sheet_giant_source: "",

        update_tecnica_order_sheet: false,
        c3_issues_found_internal: false,

        c2_packs_all_key_parts_and_stages: false,
        c3_packs_all_key_parts: false,

        queries: "",
        queries_status: false,

        trustmark: "",
        lodgement: "",
        trustmark_project_certificate: "",
        project_stage1_trustmark_project_certificate: "",

        tecnica: "",
        scaffolding_removed_date: "",
        rubbish_collected_date: "",
        // EPC / numeric metrics new fields
        start_sap: null,
        end_sap: null,
        number_metrics: {
          number1: null,
          number2: null,
          number3: null,
        },
        epc_metrics: {
          epc_rating: { previous: null, current: null, difference: null },
          epc_area: { previous: null, current: null, difference: null },
          loft_insulation: { previous: null, current: null, difference: null },
          secondary_heating: { previous: null, current: null, difference: null },
          cavity_wall_insulation: { previous: null, current: null, difference: null },
          loft_ext_1: { previous: null, current: null, difference: null },
          property_age: { previous: "", current: "", difference: null },
        },
        high_value_notes: "",
        // Floor details and computed totals (Step 6)
        floor_details: [
          ...FIXED_FLOOR_NAMES.map((n) => ({ name: n, area: null, height: null, hlp: null, pw: null, notes: "" })),
        ],
        total_epc_area: null,
        total_floor_area_excluding_rir: null,
        heat_demand_total_wall_area: null,
        total_ground_floor_area: null,
        highest_floor_area: null,
        total_hlp: null,
        // loft and wall new fields reset
        loft_details: [
          { name: "Main", area: null, type: "" },
          { name: "Ext 1", area: null, type: "" },
          { name: "Ext 2", area: null, type: "" },
          { name: "Ext 3", area: null, type: "" },
          { name: "Alleyway", area: null, type: "" },
        ],
        total_loft: null,
        ba: null,
        wall_ext_details: [
          { name: "Ext 1", area: null, construction_type: "" },
          { name: "Ext 2", area: null, construction_type: "" },
        ],
        solid_wall_area: null,
        glazed_area: null,
        wall_excluding_windows_pici: null,
        total_wall_pici: null,
        popt: null,
        services: [],
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit");
    }
  };

  if (!inline && !isOpen) return null;

  const content = (
    <div className="bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky bg-white">
        <div>
          <h2 className="text-xl font-bold">Lead Property Evidence</h2>
          <p className="text-sm text-gray-600">Step {currentStep} of 7</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          // Prevent Enter from submitting the whole form on steps before final
          if (e.key === "Enter" && currentStep !== 7) {
            e.preventDefault();
          }
        }}
        className="p-6"
      >
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
                </div>

                <div className="grid grid-cols-2 gap-4">

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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address ?? ""}
                    onChange={handleInputChange}
                    placeholder="Lead address"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  <label className="block text-sm font-medium text-gray-700">Services Required</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
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
                          checked={Array.isArray(formData.services) && formData.services.includes(s)}
                          onChange={() => {
                            setFormData((p) => {
                              const exists = Array.isArray(p.services) && p.services.includes(s);
                              return { ...p, services: exists ? p.services.filter(x => x !== s) : [...(p.services || []), s] };
                            });
                          }}
                        />
                        <span className="text-sm">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Step 2: Property & Link Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Property & Link Details</h3>

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
                    <label className="block text-sm font-medium text-gray-700">UBIL is for HTHE Name</label>
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
                    <label className="block text-sm font-medium text-gray-700">UBIL Video Available</label>
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
                    <label className="block text-sm font-medium text-gray-700">PRES is for HHEV Name</label>
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
                    <label className="block text-sm font-medium text-gray-700">PRES Video Available</label>
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
                      <option value="gas_bill">Gas bill before Mar 2022</option>
                      <option value="gas_meter">Gas Meter date before March 2022</option>
                      <option value="epc">EPC</option>
                      <option value="gas_safe">Gas Safe</option>
                      <option value="not_available">Not Available</option>
                    </select>
                  </div>


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


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gas and Electric Meters</label>
                    <select
                      name="gas_electric_meters"
                      value={formData.gas_electric_meters}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="check and verified">Check and verified</option>
                      <option value="gas_meter">Photos</option>

                    </select>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gas and Electric Heater</label>
                    <select
                      name="heater_type"
                      value={formData.heater_type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Electric">Gas Heater</option>
                      <option value="Non Electric">Electric Heater</option>
                    </select>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Front Elevation all angle photos and issues EPOP</label>
                    <select
                      name="front_elevation_photos"
                      value={formData.front_elevation_photos}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rear Elevation all angle photos and issues EPOP</label>
                    <select
                      name="rear_elevation_photos"
                      value={Array.isArray(formData.rear_elevation_photos) ? formData.rear_elevation_photos.join(", ") : (formData.rear_elevation_photos || "")}
                      onChange={(e) => handleArrayInput("rear_elevation_photos", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                </div>



                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wall thickness Main</label>
                    <select
                      name="wall_thickness_main"
                      value={Array.isArray(formData.wall_thickness_main) ? formData.wall_thickness_main.join(", ") : (formData.wall_thickness_main || "")}
                      onChange={(e) => handleArrayInput("wall_thickness_main", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wall Thickness Ext 1</label>
                    <select
                      name="wall_thickness_ext_1"
                      value={Array.isArray(formData.wall_thickness_ext_1) ? formData.wall_thickness_ext_1.join(", ") : (formData.wall_thickness_ext_1 || "")}
                      onChange={(e) => handleArrayInput("wall_thickness_ext_1", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wall Thickness Ext 2</label>
                    <select
                      name="wall_thickness_ext_2"
                      value={Array.isArray(formData.wall_thickness_ext_2) ? formData.wall_thickness_ext_2.join(", ") : (formData.wall_thickness_ext_2 || "")}
                      onChange={(e) => handleArrayInput("wall_thickness_ext_2", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pitched Roof Main (evidence added in PICP)</label>
                    <select
                      name="pitched_roof_main"
                      value={Array.isArray(formData.pitched_roof_main) ? formData.pitched_roof_main.join(", ") : (formData.pitched_roof_main || "")}
                      onChange={(e) => handleArrayInput("pitched_roof_main", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PMHS with Dataplate, PRT, TRV and Gas Meter</label>
                    <select
                      name="pmhs_with_dataplate"
                      value={Array.isArray(formData.pmhs_with_dataplate) ? formData.pmhs_with_dataplate.join(", ") : (formData.pmhs_with_dataplate || "")}
                      onChange={(e) => handleArrayInput("pmhs_with_dataplate", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pitched roof EXT 1 SC evidence 150mm</label>
                    <select
                      name="pitched_roof_ext_1_sc_evidence_150mm"
                      value={Array.isArray(formData.pitched_roof_ext_1_sc_evidence_150mm) ? formData.pitched_roof_ext_1_sc_evidence_150mm.join(", ") : (formData.pitched_roof_ext_1_sc_evidence_150mm || "")}
                      onChange={(e) => handleArrayInput("pitched_roof_ext_1_sc_evidence_150mm", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pitched roof EXT 2 SC evidence 150mm</label>
                    <select
                      name="pitched_roof_ext_2_sc_evidence_150mm"
                      value={Array.isArray(formData.pitched_roof_ext_2_sc_evidence_150mm) ? formData.pitched_roof_ext_2_sc_evidence_150mm.join(", ") : (formData.pitched_roof_ext_2_sc_evidence_150mm || "")}
                      onChange={(e) => handleArrayInput("pitched_roof_ext_2_sc_evidence_150mm", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Secondary Heating Source Evidence</label>
                    <select
                      name="secondary_heating_source_evidence"
                      value={Array.isArray(formData.secondary_heating_source_evidence) ? formData.secondary_heating_source_evidence.join(", ") : (formData.secondary_heating_source_evidence || "")}
                      onChange={(e) => handleArrayInput("secondary_heating_source_evidence", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cavity FIlled Evidence 300mm Main</label>
                    <select
                      name="cavity_filled_evidence"
                      value={Array.isArray(formData.cavity_filled_evidence_300mm_main) ? formData.cavity_filled_evidence_300mm_main.join(", ") : (formData.cavity_filled_evidence_300mm_main || "")}
                      onChange={(e) => handleArrayInput("cavity_filled_evidence_300mm_main", e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="Checked and verified">Checked and verified</option>
                      <option value="Photos Missing">Photos Missing</option>
                    </select>
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

            {/* Step 4: Sheet / Trustmark / Tecnica */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Sheet / Trustmark & Tecnica</h3>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="epr_check_matching" checked={formData.epr_check_matching} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">EPR Check Matching</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="installation_changes" checked={formData.installation_changes} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">Installation Changes</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="pas10_changes_before_submit" checked={formData.pas10_changes_before_submit} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">PAS10 Changes Before Submit</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="updating_master_sheets" checked={formData.updating_master_sheets} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">Updating Master Sheets</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Master Sheet Giant Source</label>
                    <input type="url" name="master_sheet_giant_source" value={formData.master_sheet_giant_source} onChange={handleInputChange} placeholder="https://..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>

                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="update_tecnica_order_sheet" checked={formData.update_tecnica_order_sheet} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">Update Tecnica Order Sheet</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="c3_issues_found_internal" checked={formData.c3_issues_found_internal} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">C3 Issues Found (Internal)</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="c2_packs_all_key_parts_and_stages" checked={formData.c2_packs_all_key_parts_and_stages} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">C2 Packs All Key Parts & Stages</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="c3_packs_all_key_parts" checked={formData.c3_packs_all_key_parts} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">C3 Packs All Key Parts</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Queries</label>
                  <select name="queries" value={formData.queries ?? ""} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select...</option>
                    <option value="Required">Required</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" name="queries_status" checked={formData.queries_status} onChange={handleInputChange} className="w-4 h-4" />
                    <span className="text-sm">Queries Resolved</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trustmark</label>
                    <input type="text" name="trustmark" value={formData.trustmark} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lodgement</label>
                    <input type="text" name="lodgement" value={formData.lodgement} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trustmark Project Certificate</label>
                    <input type="text" name="trustmark_project_certificate" value={formData.trustmark_project_certificate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Stage1 Trustmark Project Certificate</label>
                    <input type="text" name="project_stage1_trustmark_project_certificate" value={formData.project_stage1_trustmark_project_certificate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tecnica</label>
                  <input type="text" name="tecnica" value={formData.tecnica} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scaffolding Removed Date</label>
                    <input type="date" name="scaffolding_removed_date" value={formData.scaffolding_removed_date} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rubbish Collected Date</label>
                    <input type="date" name="rubbish_collected_date" value={formData.rubbish_collected_date} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: EPC & Numeric Metrics */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">EPC & Numeric Metrics</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Services Required</label>
                  <div className="mt-2">
                    {Array.isArray(formData.services) && formData.services.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {formData.services.map((s, i) => {
                          const n = (s || "").toLowerCase();
                          let icon = "⚙️";
                          if (n.includes("ewi")) icon = "🏠";
                          else if (n.includes("boiler")) icon = "🔧";
                          else if (n.includes("heating") || n.includes("ftch") || n.includes("control")) icon = "🌡️";
                          else if (n.includes("loft")) icon = "🛖";
                          else if (n.includes("solar")) icon = "☀️";
                          else if (n.includes("single")) icon = "🔹";

                          return (
                            <span key={i} className="inline-flex items-center px-2 py-1 text-sm bg-gray-100 rounded">
                              <span className="mr-2 text-md" aria-hidden>{icon}</span>
                              <span>{s}</span>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No services selected on the lead.</div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">Proposed Measures (from Lead services)</label>
                    <select
                      name="services"
                      value={Array.isArray(formData.services) ? formData.services.join(", ") : (formData.services || "")}
                      onChange={(e) => handleArrayInput("services", e.target.value)}
                      onBlur={saveProposedMeasures}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select...</option>
                      <option value="Required">Required</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Edit and click outside the field to save services to the lead.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start SAP</label>
                    <input
                      type="number"
                      step="0.01"
                      name="start_sap"
                      value={formData.start_sap ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, start_sap: e.target.value === "" ? null : parseFloat(e.target.value) }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End SAP</label>
                    <input
                      type="number"
                      step="0.01"
                      name="end_sap"
                      value={formData.end_sap ?? ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, end_sap: e.target.value === "" ? null : parseFloat(e.target.value) }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Number Metrics (Number1/2/3)</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <input type="number" step="0.01" placeholder="Number1" value={formData.number_metrics?.number1 ?? ""} onChange={(e) => handleNestedInput('number_metrics', 'number1', null, e.target.value, true)} className="px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="number" step="0.01" placeholder="Number2" value={formData.number_metrics?.number2 ?? ""} onChange={(e) => handleNestedInput('number_metrics', 'number2', null, e.target.value, true)} className="px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="number" step="0.01" placeholder="Number3" value={formData.number_metrics?.number3 ?? ""} onChange={(e) => handleNestedInput('number_metrics', 'number3', null, e.target.value, true)} className="px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">EPC Metrics</label>
                  <div className="grid grid-cols-3 gap-4">
                    {/* epc_rating */}
                    <div>
                      <div className="text-sm font-medium">EPC Rating</div>
                      <input type="number" step="0.01" placeholder="Previous" value={formData.epc_metrics?.epc_rating?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'epc_rating', 'previous', e.target.value, true)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <input type="number" step="0.01" placeholder="Current" value={formData.epc_metrics?.epc_rating?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'epc_rating', 'current', e.target.value, true)} className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <div className="mt-1 text-sm text-gray-600">Difference: {formData.epc_metrics?.epc_rating?.difference ?? ""}</div>
                    </div>

                    {/* epc_area */}
                    <div>
                      <div className="text-sm font-medium">EPC Area</div>
                      <input type="number" step="0.01" placeholder="Previous" value={formData.epc_metrics?.epc_area?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'epc_area', 'previous', e.target.value, true)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <input type="number" step="0.01" placeholder="Current" value={formData.epc_metrics?.epc_area?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'epc_area', 'current', e.target.value, true)} className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <div className="mt-1 text-sm text-gray-600">Difference: {formData.epc_metrics?.epc_area?.difference ?? ""}</div>
                    </div>

                    {/* loft_insulation */}
                    <div>
                      <div className="text-sm font-medium">Loft Insulation (mm)</div>
                      <input type="number" step="0.01" placeholder="Previous" value={formData.epc_metrics?.loft_insulation?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'loft_insulation', 'previous', e.target.value, true)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <input type="number" step="0.01" placeholder="Current" value={formData.epc_metrics?.loft_insulation?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'loft_insulation', 'current', e.target.value, true)} className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <div className="mt-1 text-sm text-gray-600">Difference: {formData.epc_metrics?.loft_insulation?.difference ?? ""}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {/* secondary_heating */}
                    <div>
                      <div className="text-sm font-medium">Secondary Heating (prev/current)</div>
                      <input type="number" step="1" placeholder="Previous" value={formData.epc_metrics?.secondary_heating?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'secondary_heating', 'previous', e.target.value, true)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <input type="number" step="1" placeholder="Current" value={formData.epc_metrics?.secondary_heating?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'secondary_heating', 'current', e.target.value, true)} className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <div className="mt-1 text-sm text-gray-600">Difference: {formData.epc_metrics?.secondary_heating?.difference ?? ""}</div>
                    </div>

                    {/* cavity_wall_insulation */}
                    <div>
                      <div className="text-sm font-medium">Cavity Wall Insulation</div>
                      <input type="number" step="0.01" placeholder="Previous" value={formData.epc_metrics?.cavity_wall_insulation?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'cavity_wall_insulation', 'previous', e.target.value, true)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <input type="number" step="0.01" placeholder="Current" value={formData.epc_metrics?.cavity_wall_insulation?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'cavity_wall_insulation', 'current', e.target.value, true)} className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <div className="mt-1 text-sm text-gray-600">Difference: {formData.epc_metrics?.cavity_wall_insulation?.difference ?? ""}</div>
                    </div>

                    {/* loft_ext_1 */}
                    <div>
                      <div className="text-sm font-medium">Loft Ext 1</div>
                      <input type="number" step="0.01" placeholder="Previous" value={formData.epc_metrics?.loft_ext_1?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'loft_ext_1', 'previous', e.target.value, true)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <input type="number" step="0.01" placeholder="Current" value={formData.epc_metrics?.loft_ext_1?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'loft_ext_1', 'current', e.target.value, true)} className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                      <div className="mt-1 text-sm text-gray-600">Difference: {formData.epc_metrics?.loft_ext_1?.difference ?? ""}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium">Property Age (previous/current)</div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <input type="text" placeholder="Previous" value={formData.epc_metrics?.property_age?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'property_age', 'previous', e.target.value, false)} className="px-3 py-2 border border-gray-300 rounded-md" />
                      <input type="text" placeholder="Current" value={formData.epc_metrics?.property_age?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'property_age', 'current', e.target.value, false)} className="px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">High Value Notes</label>
                    {/* <select name="high_value_notes" value={formData.high_value_notes ?? ""} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="">Select...</option>
                      <option value="Required">Required</option>
                      <option value="Not Available">Not Available</option>
                    </select> */}

                    <textarea
                      name="high_value_notes"
                      value={formData.high_value_notes}
                      onChange={handleInputChange}
                      placeholder="Any additional information"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Floor Details & Totals */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Floor Details & Totals</h3>

                <div className="space-y-2">
                  {(Array.isArray(formData.floor_details) ? formData.floor_details : []).map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-3">
                        <label className="block text-sm font-medium">Name</label>
                        <input value={row.name || ""} onChange={(e) => updateFloorRow(idx, 'name', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" readOnly={idx < FIXED_FLOOR_NAMES.length} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium">Area</label>
                        <input type="number" step="0.01" value={row.area ?? ""} onChange={(e) => updateFloorRow(idx, 'area', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium">Height</label>
                        <input type="number" step="0.01" value={row.height ?? ""} onChange={(e) => updateFloorRow(idx, 'height', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium">HLP</label>
                        <input type="number" step="0.01" value={row.hlp ?? ""} onChange={(e) => updateFloorRow(idx, 'hlp', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium">PW</label>
                        <input type="number" step="0.01" value={row.pw ?? ""} onChange={(e) => updateFloorRow(idx, 'pw', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium">Notes</label>
                        <input value={row.notes || ""} onChange={(e) => updateFloorRow(idx, 'notes', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
                      </div>
                      <div className="col-span-12 text-right">
                        {idx >= FIXED_FLOOR_NAMES.length ? (
                          <button type="button" onClick={() => { setFormData(prev => { const arr = [...(prev.floor_details || [])]; arr.splice(idx, 1); return { ...prev, floor_details: arr }; }); setTimeout(recalcFloorTotals, 0); }} className="text-sm text-red-600">Remove</button>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div>
                    <button type="button" onClick={addFloorRow} className="px-3 py-1 bg-gray-200 rounded">Add Row</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium">Total EPC Area</label>
                    <input readOnly value={formData.total_epc_area ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Total Floor Area (Excl RIR)</label>
                    <input readOnly value={formData.total_floor_area_excluding_rir ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Total Ground Floor Area</label>
                    <input readOnly value={formData.total_ground_floor_area ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium">Highest Floor Area</label>
                    <input readOnly value={formData.highest_floor_area ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Total HLP</label>
                    <input readOnly value={formData.total_hlp ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Heat Demand Total Wall Area</label>
                    <input readOnly value={formData.heat_demand_total_wall_area ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                  </div>
                </div>

                {/* New: Loft Details & Totals (requested) */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-2">Loft Details</h4>
                  <div className="space-y-2">
                    {(Array.isArray(formData.loft_details) ? formData.loft_details : []).map((r, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-6">
                          <label className="block text-sm font-medium">Name</label>
                          <input value={r.name || ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.loft_details || [])]; arr[i] = { ...(arr[i] || {}), name: v }; return { ...prev, loft_details: arr }; }); }} className="mt-1 block w-full px-2 py-1 border rounded" />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-sm font-medium">Area</label>
                          <input type="number" step="0.01" value={r.area ?? ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.loft_details || [])]; arr[i] = { ...(arr[i] || {}), area: v === "" ? null : parseFloat(v) }; return { ...prev, loft_details: arr }; }); setTimeout(recalcLoftTotals, 0); }} className="mt-1 block w-full px-2 py-1 border rounded" />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-sm font-medium">Type</label>
                          <input value={r.type || ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.loft_details || [])]; arr[i] = { ...(arr[i] || {}), type: v }; return { ...prev, loft_details: arr }; }); }} className="mt-1 block w-full px-2 py-1 border rounded" />
                        </div>
                      </div>
                    ))}
                    <div>
                      <button type="button" onClick={() => { setFormData(prev => ({ ...prev, loft_details: [...(prev.loft_details || []), { name: "", area: null, type: "" }] })); setTimeout(recalcLoftTotals, 0); }} className="px-3 py-1 bg-gray-200 rounded">Add Loft Row</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium">Total Loft</label>
                      <input readOnly value={formData.total_loft ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">B/A</label>
                      <input readOnly value={formData.ba ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">POPT (editable)</label>
                      <input type="number" step="0.01" value={formData.popt ?? ""} onChange={(e) => setFormData(prev => ({ ...prev, popt: e.target.value === "" ? null : parseFloat(e.target.value) }))} className="mt-1 block w-full px-3 py-2 border rounded" />
                    </div>
                  </div>
                </div>

                {/* New: Wall extension details and totals */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-2">Wall Extension Details</h4>
                  <div className="space-y-2">
                    {(Array.isArray(formData.wall_ext_details) ? formData.wall_ext_details : []).map((r, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <label className="block text-sm font-medium">Name</label>
                          <input value={r.name || ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.wall_ext_details || [])]; arr[i] = { ...(arr[i] || {}), name: v }; return { ...prev, wall_ext_details: arr }; }); }} className="mt-1 block w-full px-2 py-1 border rounded" />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-sm font-medium">Area</label>
                          <input type="number" step="0.01" value={r.area ?? ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.wall_ext_details || [])]; arr[i] = { ...(arr[i] || {}), area: v === "" ? null : parseFloat(v) }; return { ...prev, wall_ext_details: arr }; }); setTimeout(recalcWallTotals, 0); }} className="mt-1 block w-full px-2 py-1 border rounded" />
                        </div>
                        <div className="col-span-4">
                          <label className="block text-sm font-medium">Construction Type</label>
                          <input value={r.construction_type || ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.wall_ext_details || [])]; arr[i] = { ...(arr[i] || {}), construction_type: v }; return { ...prev, wall_ext_details: arr }; }); }} className="mt-1 block w-full px-2 py-1 border rounded" />
                        </div>
                      </div>
                    ))}
                    <div>
                      <button type="button" onClick={() => { setFormData(prev => ({ ...prev, wall_ext_details: [...(prev.wall_ext_details || []), { name: "", area: null, construction_type: "" }] })); setTimeout(recalcWallTotals, 0); }} className="px-3 py-1 bg-gray-200 rounded">Add Wall Ext Row</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium">Solid Wall Area</label>
                      <input type="number" step="0.01" value={formData.solid_wall_area ?? ""} onChange={(e) => setFormData(prev => ({ ...prev, solid_wall_area: e.target.value === "" ? null : parseFloat(e.target.value) }))} onBlur={() => setTimeout(recalcWallTotals, 0)} className="mt-1 block w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Glazed Area</label>
                      <input type="number" step="0.01" value={formData.glazed_area ?? ""} onChange={(e) => setFormData(prev => ({ ...prev, glazed_area: e.target.value === "" ? null : parseFloat(e.target.value) }))} onBlur={() => setTimeout(recalcWallTotals, 0)} className="mt-1 block w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Wall Excluding Windows PICI</label>
                      <input readOnly value={formData.wall_excluding_windows_pici ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium">Total Wall PICI</label>
                      <input readOnly value={formData.total_wall_pici ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">(spare)</label>
                      <input readOnly value={""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">POPT (mirror)</label>
                      <input readOnly value={formData.popt ?? ""} className="mt-1 block w-full px-3 py-2 border rounded bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Documents */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Documents</h3>

                <div className="space-y-4">
                  {(Array.isArray(formData.documents) ? formData.documents : []).map((group, gi) => (
                    <div key={gi} className="p-4 border rounded">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium">Main Folder</label>
                          <input type="text" value={group.main_folder || ""} onChange={(e) => updateDocumentGroup(gi, 'main_folder', e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">File Type</label>
                          <input type="text" value={group.file_type || ""} onChange={(e) => updateDocumentGroup(gi, 'file_type', e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" />
                        </div>
                        <div className="flex items-end">
                          <button type="button" onClick={() => removeDocumentGroup(gi)} className="text-red-600">Remove Group</button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {(Array.isArray(group.documents) ? group.documents : []).map((doc, di) => (
                          <div key={di} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-4">
                              <label className="block text-sm">Name</label>
                              <input type="text" value={doc.name || ""} onChange={(e) => updateDocumentRow(gi, di, 'name', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm">Status</label>
                              <select value={doc.status || ""} onChange={(e) => updateDocumentRow(gi, di, 'status', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded">
                                <option value="">Select...</option>
                                <option value="Done">Done</option>
                                <option value="Pending">Pending</option>
                                <option value="Not Required">Not Required</option>
                                <option value="Pending Check">Pending Check</option>
                                <option value="Incomplete">Incomplete</option>
                                <option value="Errors">Errors</option>
                                <option value="Scan Remaining">Scan Remaining</option>
                                <option value="Signatures">Signatures</option>
                                <option value="KSDL">KSDL</option>
                                <option value="BLB">BLB</option>
                              </select>
                            </div>
                            <div className="col-span-4">
                              <label className="block text-sm">Issue</label>
                              <input type="text" value={doc.issue || ""} onChange={(e) => updateDocumentRow(gi, di, 'issue', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm">Issue Date</label>
                              <input type="date" value={doc.issue_date || ""} onChange={(e) => updateDocumentRow(gi, di, 'issue_date', e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
                            </div>
                            <div className="col-span-12 text-right">
                              <button type="button" onClick={() => removeDocumentRow(gi, di)} className="text-sm text-red-600">Remove</button>
                            </div>
                          </div>
                        ))}

                        <div>
                          <button type="button" onClick={() => addDocumentRow(gi)} className="px-3 py-1 bg-gray-200 rounded">Add Document</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div>
                    <button type="button" onClick={addDocumentGroup} className="px-3 py-1 bg-gray-200 rounded">Add Document Group</button>
                  </div>
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
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setCurrentStep(step)}
                    className={`w-8 h-8 rounded-full font-semibold text-sm ${currentStep === step
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {step}
                  </button>
                ))}
              </div>

              {currentStep === 7 ? (
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
                  onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
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
  );

  return inline ? (
    <div className="p-6">
      {content}
    </div>
  ) : (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {content}
    </div>
  );
};

export default LeadPropertyEvidenceForm;
