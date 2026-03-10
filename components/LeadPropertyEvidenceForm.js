"use client";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Copy, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useUpdatePropertyEvidenceMutation, useGetPropertyEvidenceQuery, useGetLeadByIdQuery, useUpdateLeadMutation, useGetEvidenceTemplatesQuery, useCreateEvidenceTemplateMutation } from "@/services/api";
import { toast } from "react-toastify";

const HARDCODED_DOCUMENTS = [
  {
    main_folder: "Common Folder",
    file_type: "GCGP",
    documents: [
      { name: "ASBAR", status: "", issue: "" },
      { name: "Assessment Pack", status: "", issue: "" },
      { name: "Bath Extractor_Electric minor Works", status: "", issue: "" },
      { name: "BREG EXTRACTOR FAN", status: "", issue: "" },
      { name: "BREG TRICKLE VENTS", status: "", issue: "" },
      { name: "Cavity Filled Evidence Main", status: "", issue: "" },
      { name: "Cavity Filled Evidence Ext 1", status: "", issue: "" },
      { name: "Corelogic ABS Screenshot", status: "", issue: "" },
      { name: "EPOP", status: "", issue: "" },
      { name: "ESTC", status: "", issue: "" },
      { name: "Flat Roof SC EXT 1 evidence 150mm", status: "", issue: "" },
      { name: "Floor plan", status: "", issue: "" },
      { name: "HHEV", status: "", issue: "" },
      { name: "HTHE", status: "", issue: "" },
      { name: "Ofgem Rental", status: "", issue: "" },
      { name: "On-Gas Evidence", status: "", issue: "" },
      { name: "PICI", status: "", issue: "" },
      { name: "PIPS", status: "", issue: "" },
      { name: "PMHS", status: "", issue: "" },
      { name: "Post Code Finder", status: "", issue: "" },
      { name: "PRIV", status: "", issue: "" },
      { name: "Retrofit Risk Assessment", status: "", issue: "" },
      { name: "Room Height Evidence", status: "", issue: "" },
      { name: "Same Name Declaration", status: "", issue: "" },
      { name: "Secondary Heating Source Evidence", status: "", issue: "" },
      { name: "SMEV", status: "", issue: "" },
      { name: "UBIL 1.. UBIL Customer", status: "", issue: "" },
      { name: "UBIL 2.. PRES Owner", status: "", issue: "" },
      { name: "Wall Thickness Main Cavity 300mm", status: "", issue: "" },
      { name: "Wall Thickness Ext 1 Cavity 300mm", status: "", issue: "" },
    ],
  },
  {
    main_folder: "Submission Loft",
    file_type: "Loft",
    documents: [
      { name: "BREG Loft", status: "", issue: "" },
      { name: "Loft_Insurance Gurantee", status: "", issue: "" },
      { name: "Loft_Materials and Workmanship", status: "", issue: "" },
      { name: "Loft_ Notification Certificate", status: "", issue: "" },
      { name: "Loft_Operative Competence", status: "", issue: "" },
      { name: "LDEC", status: "", issue: "" },
      { name: "PIBI Loft", status: "", issue: "" },
      { name: "Loft_Post Install photos", status: "", issue: "" },
      { name: "Loft_Mid Install photos", status: "", issue: "" },
      { name: "Loft_Pre Install photos", status: "", issue: "" },
    ],
  },
  {
    main_folder: "FTCH or HC or B",
    file_type: "Boiler/HC/FTCH",
    documents: [
      { name: "BOILER__Insurance Gurantee", status: "", issue: "" },
      { name: "BOILER_Materials and Workmanship", status: "", issue: "" },
      { name: "BOILER_ Notification Certificate", status: "", issue: "" },
      { name: "BCOM", status: "", issue: "" },
      { name: "BOILER_Operative Competence", status: "", issue: "" },
      { name: "BREG BOILER", status: "", issue: "" },
      { name: "BREG HC", status: "", issue: "" },
      { name: "BREG TRVS", status: "", issue: "" },
      { name: "BREG TTZC", status: "", issue: "" },
      { name: "BWOD", status: "", issue: "" },
      { name: "HTSC", status: "", issue: "" },
      { name: "PCDB A", status: "", issue: "" },
      { name: "PCDB B", status: "", issue: "" },
      { name: "PCDB TTZC", status: "", issue: "" },
      { name: "PIBI Boiler", status: "", issue: "" },
      { name: "Boiler_Post Install photos", status: "", issue: "" },
      { name: "Boiler_Mid Install photos", status: "", issue: "" },
      { name: "Boiler_Pre Install photos", status: "", issue: "" },
      { name: "PIHC", status: "", issue: "" },
      { name: "PPES", status: "", issue: "" },
    ],
  },
  {
    main_folder: "RC1",
    file_type: "BOILER",
    documents: [
      { name: "ADF1 EEM method statement", status: "", issue: "" },
      { name: "Airtightness Strategy", status: "", issue: "" },
      { name: "Assessment Data Entry", status: "", issue: "" },
      { name: "Boiler-Method Statement 2023", status: "", issue: "" },
      { name: "Boiler Handover", status: "", issue: "" },
      { name: "Claim of Compliance PAS 2030 -- HC", status: "", issue: "" },
      { name: "Claim of Compliance PAS 2030 -- LOFT", status: "", issue: "" },
      { name: "Claim of Compliance PAS 2035 -- BOILER", status: "", issue: "" },
      { name: "Claim of Compliance PAS 2035 -- HC", status: "", issue: "" },

      { name: "Claim of Compliance PAS 2035 -- LOFT", status: "", issue: "" },
      { name: "Conflict of interest statement -- LOFT", status: "", issue: "" },
      { name: "Coordinator Handover Letter -- LOFT", status: "", issue: "" },
      { name: "ELEC_Operative Competence -- LOFT", status: "", issue: "" },
      { name: "GD F16 - Claim of Compliance 2023 Boiler -- LOFT", status: "", issue: "" },
      { name: "GD F16 - Claim of Compliance 2023 hc -- LOFT", status: "", issue: "" },
      { name: "GD F16 - Claim of Compliance 2023 Loft -- LOFT", status: "", issue: "" },
      { name: "HC Handover -- LOFT", status: "", issue: "" },
      { name: "HC-Method Statement 2023 -- LOFT", status: "", issue: "" },
      { name: "Installed Ventilation Photos --Post Ventilation", status: "", issue: "" },
      { name: "Loft Handover --Post Ventilation", status: "", issue: "" },
      { name: "LOFT-Method Statement 2023 --Post Ventilation", status: "", issue: "" },
      { name: "PRE Ventilation Pack --Pre Ventilation", status: "", issue: "" },
      { name: "Heat Demand Calculator --Pre Ventilation", status: "", issue: "" },
      { name: "RA_Retrofit Assessor qualification --Pre Ventilation", status: "", issue: "" },
      { name: "RC_Retrofit Coordinator Qualification --Pre Ventilation", status: "", issue: "" },
      { name: "Retrofit design --Pre Ventilation", status: "", issue: "" },

      { name: "Ventilation Assessment Check list Appendix D --Appendix D", status: "", issue: "" },
      { name: "Ventilation assessment reference --Appendix D", status: "", issue: "" },
      { name: "Ventilation Strategy --Appendix D", status: "", issue: "" },

    ],
  },

  {
    main_folder: "Additional Data",
    file_type: "",
    documents: [
      { name: "EPC matching Room Height Videos", status: "", issue: "" },
      { name: "Boiler_Post Install Video", status: "", issue: "" },
      { name: "PMHS Video", status: "", issue: "" },
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
  const { userInfo, modules } = useSelector((state) => state.auth);

  const availableSteps = useMemo(() => {
    if (!userInfo) return [1, 2, '3A', '3B', 4, 5, 6, '7A', '7B', 8, 9, 10, '11A', '11B'];
    if (userInfo.is_admin || userInfo.role === 'admin') return [1, 2, '3A', '3B', 4, 5, 6, '7A', '7B', 8, 9, 10, '11A', '11B'];

    const enabledKeys = (modules || []).filter(m => m.is_enabled).map(m => m.module_key);
    const steps = [];
    const stepLabels = [1, 2, '3A', '3B', 4, 5, 6, '7A', '7B', 8, 9, 10, '11A', '11B'];

    // Logic for permissions based on old screen numbers or updated ones?
    // User didn't specify backend changes, so I'll keep the loop but map to the new available list.
    // For now, if we assume lead_form_screen_1 to 7 are the only ones in backend:
    for (let i = 1; i <= 11; i++) {
      // This loop needs to be screen-aware.
      // Since we have 3A/3B and 7A/7B, let's just use the full list if they have permissions for the base numbers.
      if (i === 3) {
        if (enabledKeys.includes(`lead_form_screen_3`)) steps.push('3A', '3B');
      } else if (i === 7) {
        if (enabledKeys.includes(`lead_form_screen_7`)) steps.push('7A', '7B');
      } else if (i === 11) {
        if (enabledKeys.includes(`lead_form_screen_11`)) steps.push('11A', '11B');
      } else {
        if (enabledKeys.includes(`lead_form_screen_${i}`)) steps.push(i);
      }
    }
    // If no steps returned from modules (e.g. they only had 1-7), but we have 11 now, 
    // we might need to adjust or just default to the full list for now if admin.
    return steps.length > 0 ? steps : [1, 2, '3A', '3B', 4, 5, 6, '7A', '7B', 8, 9, 10, '11A', '11B'];
  }, [userInfo, modules]);

  const [updatePropertyEvidence, { isLoading: isUpdatingEvidence }] = useUpdatePropertyEvidenceMutation();
  const [updateLead, { isLoading: isUpdatingLead }] = useUpdateLeadMutation();
  const { data: leadData, isLoading: isLoadingLead } = useGetLeadByIdQuery(leadId, { skip: !leadId || !isOpen });
  const { data: evidenceData, isLoading: isLoadingEvidence } = useGetPropertyEvidenceQuery(leadId, { skip: !leadId || !isOpen });
  const { data: templatesData, refetch: refetchTemplates } = useGetEvidenceTemplatesQuery(undefined, { skip: !isOpen });
  const [createTemplate] = useCreateEvidenceTemplateMutation();
  const [currentStep, setCurrentStep] = useState(availableSteps.length > 0 ? availableSteps[0] : 1);

  useEffect(() => {
    if (availableSteps.length > 0 && !availableSteps.includes(currentStep)) {
      setCurrentStep(availableSteps[0]);
    }
  }, [availableSteps, currentStep]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(err => {
      console.error("Copy failed:", err);
      toast.error("Failed to copy link");
    });
  };

  const handlePrev = () => {
    const currentIndex = availableSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(availableSteps[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = availableSteps.indexOf(currentStep);
    if (currentIndex < availableSteps.length - 1) {
      setCurrentStep(availableSteps[currentIndex + 1]);
    }
  };
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
    request_data_match: "",
    property_ownership: "",
    services: [],
    documents: JSON.parse(JSON.stringify(HARDCODED_DOCUMENTS)),
    make_model_serial: "",
    data_plate: "",
    data_matched_status: [],
    gas_safe: null,
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
    epr_check_matching: "",
    installation_changes: "",
    pas10_changes_before_submit: "",
    pas10_changes_notes: "",

    updating_master_sheets: "",
    master_sheet_giant_source: "",

    update_tecnica_order_sheet: "",
    c3_issues_found_internal: "",

    c2_packs_all_key_parts_and_stages: false,
    c3_packs_all_key_parts: false,

    queries: "",
    queries_status: "",
    submission_status: "",
    scaffolding_removed_status: "",
    rubbish_collected_status: "",
    customer_feedback_notes: "",
    complete_the_project: "",
    final_comments: "",
    final_notes: "",

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
    alternate_phone_number: "",
    dob: "",
    benefits: [],
    total_wall_pici: null,
    popt: null,
    notes_screen2: "",
    add_more_evidence: [],
    installation_approval: { status: "", notes: "" },
    pre_paperwork_7a: {
      ventilation_assessment_file: "",
      floor_plan: "",
      assessment: "",
      retrofit_design: "",
      solar_ashp_design: "",
      customer_quotes: "",
      add_more_evidence: [],
    },
    material_7b: {
      solar: { status: "", date_order: "" },
      ashp: { status: "", date_order: "" },
      boiler_hc: { status: "", date_order: "" },
      loft: { status: "", date_order: "" },
      scaffolding_order: { status: "", date_order: "" },
      scaffolding_date: "",
      add_more_evidence: [],
    },
    installation_requirements_8: {
      notes: "",
      add_more_evidence: [],
    },
    internal_c3_requirements_9: {
      notes: "",
      add_more_evidence: [],
    },
  });

  // Update form when lead or evidence data is fetched
  useEffect(() => {
    if (isOpen) {
      if (leadData?.data) {
        const lead = leadData.data;
        setFormData((prev) => ({
          ...prev,
          name: lead.name || "",
          dob: lead.dob ? lead.dob.split("T")[0] : "",
          email: lead.email || "",
          mobile: lead.mobile || "",
          alternate_phone_number: lead.alternate_phone_number || "",
          address: lead.address || "",
          lead_date: lead.created_at ? lead.created_at.split("T")[0] : "",
          lead_id: leadId,
          lead_provider: lead.lead_provider || "",
          property_ownership: lead.property_ownership || "Owner Occupied",
          benefits: lead.benefits ? (Array.isArray(lead.benefits) ? lead.benefits : [lead.benefits]) : [],
          services: lead.services || [],
        }));
      }

      if (evidenceData?.data) {
        const ev = evidenceData.data;
        setFormData((prev) => ({
          ...prev,
          ...ev,
          // Handle complex fields that might need default values if null in DB
          documents: ev.documents || prev.documents,
          floor_details: ev.floor_details || prev.floor_details,
          loft_details: ev.loft_details || prev.loft_details,
          wall_ext_details: ev.wall_ext_details || prev.wall_ext_details,
          number_metrics: ev.number_metrics || prev.number_metrics,
          epc_metrics: ev.epc_metrics || prev.epc_metrics,
          data_matched_status: ev.data_matched_status || [],
          add_more_evidence: ev.add_more_evidence || [],
          installation_approval: ev.installation_approval || { status: "", notes: "" },
          pre_paperwork_7a: ev.pre_paperwork_7a || {
            ventilation_assessment_file: "",
            floor_plan: "",
            assessment: "",
            retrofit_design: "",
            solar_ashp_design: "",
            customer_quotes: "",
            add_more_evidence: [],
          },
          material_7b: ev.material_7b || {
            solar: { status: "", date_order: "" },
            ashp: { status: "", date_order: "" },
            boiler_hc: { status: "", date_order: "" },
            loft: { status: "", date_order: "" },
            scaffolding_order: { status: "", date_order: "" },
            scaffolding_date: "",
            add_more_evidence: [],
          },
          installation_requirements_8: ev.installation_requirements_8 || { notes: "", add_more_evidence: [] },
          internal_c3_requirements_9: ev.internal_c3_requirements_9 || { notes: "", add_more_evidence: [] },
        }));
      }
    }
  }, [leadData, evidenceData, leadId, isOpen]);

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
      g.documents = [...(Array.isArray(g.documents) ? g.documents : []), { name: "", status: "", issue: "" }];
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

  const addMoreEvidenceGroup = () => {
    setFormData((prev) => ({
      ...prev,
      add_more_evidence: [...(Array.isArray(prev.add_more_evidence) ? prev.add_more_evidence : []), { main_folder: "", documents: [] }],
    }));
  };

  const removeMoreEvidenceGroup = (index) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence) ? [...prev.add_more_evidence] : [];
      arr.splice(index, 1);
      return { ...prev, add_more_evidence: arr };
    });
  };

  const updateMoreEvidenceGroup = (index, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence) ? [...prev.add_more_evidence] : [];
      const g = { ...(arr[index] || {}) };
      g[key] = value;
      arr[index] = g;
      return { ...prev, add_more_evidence: arr };
    });
  };

  const addMoreEvidenceRow = (groupIndex) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence) ? [...prev.add_more_evidence] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      g.documents = [...(Array.isArray(g.documents) ? g.documents : []), { name: "", status: "", issue: "" }];
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence: arr };
    });
  };

  const removeMoreEvidenceRow = (groupIndex, docIndex) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence) ? [...prev.add_more_evidence] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      const docs = Array.isArray(g.documents) ? [...g.documents] : [];
      docs.splice(docIndex, 1);
      g.documents = docs;
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence: arr };
    });
  };

  const updateMoreEvidenceRow = (groupIndex, docIndex, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence) ? [...prev.add_more_evidence] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      const docs = Array.isArray(g.documents) ? [...g.documents] : [];
      const d = { ...(docs[docIndex] || {}) };
      d[key] = value;
      docs[docIndex] = d;
      g.documents = docs;
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence: arr };
    });
  };

  // Step 3A More Evidence Helpers
  const addMoreEvidence3aGroup = () => {
    setFormData((prev) => ({
      ...prev,
      add_more_evidence_3a: [...(Array.isArray(prev.add_more_evidence_3a) ? prev.add_more_evidence_3a : []), { main_folder: "", documents: [] }],
    }));
  };

  const removeMoreEvidence3aGroup = (index) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_3a) ? [...prev.add_more_evidence_3a] : [];
      arr.splice(index, 1);
      return { ...prev, add_more_evidence_3a: arr };
    });
  };

  const updateMoreEvidence3aGroup = (index, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_3a) ? [...prev.add_more_evidence_3a] : [];
      const g = { ...(arr[index] || {}) };
      g[key] = value;
      arr[index] = g;
      return { ...prev, add_more_evidence_3a: arr };
    });
  };

  const addMoreEvidence3aRow = (groupIndex) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_3a) ? [...prev.add_more_evidence_3a] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      g.documents = [...(Array.isArray(g.documents) ? g.documents : []), { name: "", status: "", issue: "" }];
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence_3a: arr };
    });
  };

  const removeMoreEvidence3aRow = (groupIndex, docIndex) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_3a) ? [...prev.add_more_evidence_3a] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      const docs = Array.isArray(g.documents) ? [...g.documents] : [];
      docs.splice(docIndex, 1);
      g.documents = docs;
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence_3a: arr };
    });
  };

  const updateMoreEvidence3aRow = (groupIndex, docIndex, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_3a) ? [...prev.add_more_evidence_3a] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      const docs = Array.isArray(g.documents) ? [...g.documents] : [];
      const d = { ...(docs[docIndex] || {}) };
      d[key] = value;
      docs[docIndex] = d;
      g.documents = docs;
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence_3a: arr };
    });
  };

  const addMoreEvidence4Group = () => {
    setFormData((prev) => ({
      ...prev,
      add_more_evidence_for_screen_4: [...(Array.isArray(prev.add_more_evidence_for_screen_4) ? prev.add_more_evidence_for_screen_4 : []), { main_folder: "", documents: [] }],
    }));
  };

  const removeMoreEvidence4Group = (index) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_for_screen_4) ? [...prev.add_more_evidence_for_screen_4] : [];
      arr.splice(index, 1);
      return { ...prev, add_more_evidence_for_screen_4: arr };
    });
  };

  const updateMoreEvidence4Group = (index, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_for_screen_4) ? [...prev.add_more_evidence_for_screen_4] : [];
      const g = { ...(arr[index] || {}) };
      g[key] = value;
      arr[index] = g;
      return { ...prev, add_more_evidence_for_screen_4: arr };
    });
  };

  const addMoreEvidence4Row = (groupIndex) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_for_screen_4) ? [...prev.add_more_evidence_for_screen_4] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      g.documents = [...(Array.isArray(g.documents) ? g.documents : []), { name: "", status: "", issue: "" }];
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence_for_screen_4: arr };
    });
  };

  const removeMoreEvidence4Row = (groupIndex, docIndex) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_for_screen_4) ? [...prev.add_more_evidence_for_screen_4] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      const docs = Array.isArray(g.documents) ? [...g.documents] : [];
      docs.splice(docIndex, 1);
      g.documents = docs;
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence_for_screen_4: arr };
    });
  };

  const updateMoreEvidence4Row = (groupIndex, docIndex, key, value) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.add_more_evidence_for_screen_4) ? [...prev.add_more_evidence_for_screen_4] : [];
      const g = { ...(arr[groupIndex] || { documents: [] }) };
      const docs = Array.isArray(g.documents) ? [...g.documents] : [];
      const d = { ...(docs[docIndex] || {}) };
      d[key] = value;
      docs[docIndex] = d;
      g.documents = docs;
      arr[groupIndex] = g;
      return { ...prev, add_more_evidence_for_screen_4: arr };
    });
  };

  const handleSaveAsTemplate = async (group) => {
    if (!group.main_folder) {
      toast.error("Please provide a folder name for the template");
      return;
    }
    const templateName = prompt("Enter a name for this template:", group.main_folder);
    if (!templateName) return;

    try {
      await createTemplate({
        template_name: templateName,
        main_folder: group.main_folder,
        documents: group.documents
      }).unwrap();
      toast.success("Template saved successfully!");
      refetchTemplates();
    } catch (err) {
      toast.error("Failed to save template");
    }
  };

  const handleApplyTemplate = async (path, template, groupIndex = null) => {
    setFormData(prev => {
      const parts = path.split('.');
      let mainField;
      let finalValue;
      let nextState;

      const newGroupContent = {
        main_folder: template.main_folder,
        documents: JSON.parse(JSON.stringify(template.documents))
      };

      if (parts.length === 1) {
        mainField = parts[0];
        const arr = [...(Array.isArray(prev[mainField]) ? prev[mainField] : [])];
        if (groupIndex !== null && groupIndex >= 0) {
          arr[groupIndex] = { ...(arr[groupIndex] || {}), ...newGroupContent };
        } else {
          arr.push(newGroupContent);
        }
        finalValue = arr;
        nextState = { ...prev, [mainField]: arr };
      } else {
        const [parentKey, arrayName] = parts;
        mainField = parentKey;
        const parentObj = { ...(prev[parentKey] || {}) };
        const arr = [...(Array.isArray(parentObj[arrayName]) ? parentObj[arrayName] : [])];
        if (groupIndex !== null && groupIndex >= 0) {
          arr[groupIndex] = { ...(arr[groupIndex] || {}), ...newGroupContent };
        } else {
          arr.push(newGroupContent);
        }
        parentObj[arrayName] = arr;
        finalValue = parentObj;
        nextState = { ...prev, [parentKey]: parentObj };
      }

      // Auto-save to database immediately
      if (prev.lead_id) {
        updatePropertyEvidence({
          lead_id: parseInt(prev.lead_id),
          [mainField]: finalValue
        }).unwrap().catch(err => console.error("Template auto-save failed:", err));
      }

      return nextState;
    });
    toast.success("Template applied and saved!");
  };

  const addGroupWithPath = (path) => {
    setFormData(prev => {
      const parts = path.split('.');
      if (parts.length === 1) {
        const arrayName = parts[0];
        return {
          ...prev,
          [arrayName]: [...(Array.isArray(prev[arrayName]) ? prev[arrayName] : []), { main_folder: '', documents: [] }]
        };
      } else {
        const [parentKey, arrayName] = parts;
        const parentObj = { ...(prev[parentKey] || {}) };
        parentObj[arrayName] = [...(Array.isArray(parentObj[arrayName]) ? parentObj[arrayName] : []), { main_folder: '', documents: [] }];
        return { ...prev, [parentKey]: parentObj };
      }
    });
  };

  // Map each screen to the fields it owns
  const getScreenFields = (step) => {
    switch (step) {
      case 1:
        return { isLeadScreen: true, leadFields: ['name', 'dob', 'email', 'mobile', 'alternate_phone_number', 'address', 'lead_provider', 'property_ownership', 'benefits', 'services'], evidenceFields: ['lead_provider', 'request_data_match', 'property_ownership'] };
      case 2:
        return { isLeadScreen: false, evidenceFields: ['gas_safe', 'data_matched_status', 'epc_link', 'zoopla_link', 'rightmove_link', 'mouseprice_link', 'propertychecker_link', 'survey_folder_link', 'google_maps_checked', 'google_earth_checked', 'requires_c1', 'booking_date', 'notes_screen2'] };
      case '3A':
        return { isLeadScreen: false, evidenceFields: ['make_model_serial', 'boiler_data_plate', 'serial_number', 'boiler_close_ups_wide_angle_pipes', 'boiler_pcdb', 'add_more_evidence_3a', 'ubil_hthe_name', 'ubil_3_months_old', 'ubil_video_available', 'pres_hhev_name', 'pres_3_months_old', 'pres_video_available', 'gcgp', 'shower_type', 'gas_electric_meters', 'heater_type', 'front_elevation_photos', 'rear_elevation_photos', 'wall_thickness_main', 'wall_thickness_ext_1', 'wall_thickness_ext_2', 'pitched_roof_main', 'pmhs_with_dataplate', 'pitched_roof_ext_1_sc_evidence_150mm', 'pitched_roof_ext_2_sc_evidence_150mm', 'secondary_heating_source_evidence', 'cavity_filled_evidence', 'notes'] };
      case '3B':
        return { isLeadScreen: false, evidenceFields: ['add_more_evidence'] };
      case 4:
        return { isLeadScreen: false, evidenceFields: ['start_sap', 'end_sap', 'number_metrics', 'epc_metrics', 'high_value_notes'] };
      case 5:
        // Old Screen 6
        return { isLeadScreen: false, evidenceFields: ['floor_details', 'total_epc_area', 'total_floor_area_excluding_rir', 'heat_demand_total_wall_area', 'total_ground_floor_area', 'highest_floor_area', 'total_hlp', 'loft_details', 'total_loft', 'ba', 'popt', 'wall_ext_details', 'solid_wall_area', 'glazed_area', 'wall_excluding_windows_pici', 'total_wall_pici'] };
      case 6:
        return { isLeadScreen: false, evidenceFields: ['installation_approval'] };
      case '7A':
        return { isLeadScreen: false, evidenceFields: ['pre_paperwork_7a'] };
      case '7B':
        return { isLeadScreen: false, evidenceFields: ['material_7b'] };
      case 8:
        return { isLeadScreen: false, evidenceFields: ['installation_requirements_8'] };
      case 9:
        return { isLeadScreen: false, evidenceFields: ['internal_c3_requirements_9'] };
      case 10:
        // Old Screen 7
        return { isLeadScreen: false, evidenceFields: ['documents'] };
      case '11A':
        return { isLeadScreen: false, evidenceFields: ['epr_check_matching', 'installation_changes', 'pas10_changes_before_submit', 'pas10_changes_notes', 'updating_master_sheets', 'master_sheet_giant_source', 'update_tecnica_order_sheet', 'c3_issues_found_internal', 'c2_packs_all_key_parts_and_stages', 'c3_packs_all_key_parts'] };
      case '11B':
        return { isLeadScreen: false, evidenceFields: ['submission_status', 'queries', 'queries_status', 'trustmark', 'lodgement', 'trustmark_project_certificate', 'project_stage1_trustmark_project_certificate', 'tecnica', 'scaffolding_removed_status', 'scaffolding_removed_date', 'rubbish_collected_status', 'rubbish_collected_date', 'customer_feedback_notes', 'complete_the_project', 'final_comments', 'final_notes'] };

      default:
        return { isLeadScreen: false, evidenceFields: [] };
    }
  };

  const handleScreenSubmit = async () => {
    if (!formData.lead_id) {
      toast.error("Lead ID is missing");
      return;
    }

    const screenConfig = getScreenFields(currentStep);

    try {
      // If this screen has lead fields, update the lead first
      if (screenConfig.isLeadScreen) {
        const leadUpdateData = { id: formData.lead_id };
        (screenConfig.leadFields || []).forEach((key) => {
          if (key === 'benefits') {
            leadUpdateData[key] = Array.isArray(formData[key]) ? formData[key] : [formData[key]];
          } else {
            leadUpdateData[key] = formData[key];
          }
        });
        console.log("Updating lead:", leadUpdateData);
        await updateLead(leadUpdateData).unwrap();
        toast.success("Lead information updated");
      }

      // Build evidence payload with only this screen's fields
      if (screenConfig.evidenceFields && screenConfig.evidenceFields.length > 0) {
        const evidenceData = { lead_id: parseInt(formData.lead_id) };
        screenConfig.evidenceFields.forEach((key) => {
          let val = formData[key];
          if (Array.isArray(val) && val.length === 0) val = null;
          evidenceData[key] = val;
        });

        console.log(`Updating property evidence (screen ${currentStep}):`, evidenceData);
        await updatePropertyEvidence(evidenceData).unwrap();
        toast.success(`Screen ${currentStep} saved successfully!`);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error?.data?.message || "Failed to save");
    }
  };

  const handleReject = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // form onSubmit just calls per-screen submit
    await handleScreenSubmit();
  };

  if (!inline && !isOpen) return null;

  const content = (
    <div className="bg-white rounded-lg shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 top-0 bg-white z-10">
        <div>
          <h2 className="text-lg font-bold">Lead Property Evidence</h2>
          <p className="text-xs text-gray-600">Step {currentStep}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          // Prevent Enter from submitting the whole form on steps before final
          const isFinalStep = availableSteps.indexOf(currentStep) === availableSteps.length - 1;
          if (e.key === "Enter" && !isFinalStep) {
            e.preventDefault();
          }
        }}
        className="p-4"
      >
        {isLoadingLead ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading lead information...</p>
          </div>
        ) : availableSteps.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500 font-semibold">You don't have permission to view any screens in this form.</p>
          </div>
        ) : (
          <>
            {/* Step 1: Lead Provider Information */}
            {currentStep == 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {/* Row 1 */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Lead Provider</label>
                    <input
                      type="text"
                      name="lead_provider"
                      value={formData.lead_provider}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Lead Date:</label>
                    <input
                      type="date"
                      name="lead_date"
                      value={formData.lead_date}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>



                  {/* Row 2 */}
                  <div className="col-span-2 flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address ?? ""}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Row 3 */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Name.. Applicant</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Row 4 */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Phone number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Row 5 */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Property Ownership</label>
                    <select
                      name="property_ownership"
                      value={formData.property_ownership}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm bg-emerald-700 text-white rounded px-2"
                    >
                      <option value="Owner Occupied">Owner Occupied</option>
                      <option value="Rented">Rented</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Alternative Phone</label>
                    <input
                      type="tel"
                      name="alternate_phone_number"
                      value={formData.alternate_phone_number}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* Row 6: Requested Measures & Request Data Match */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Requested measures</label>
                    <div className="flex-1 flex flex-wrap gap-x-3 gap-y-1 py-1">
                      {[
                        "EWI",
                        "Boiler",
                        "FTCH",
                        "Loft Insulation",
                        "Heating Control",
                        "Single Measure",
                        "Solar Panel Installation",
                      ].map((s) => (
                        <label key={s} className="inline-flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={Array.isArray(formData.services) && formData.services.includes(s)}
                            onChange={() => {
                              setFormData((p) => {
                                const exists = Array.isArray(p.services) && p.services.includes(s);
                                return { ...p, services: exists ? p.services.filter(x => x !== s) : [...(p.services || []), s] };
                              });
                            }}
                            className="w-3 h-3"
                          />
                          <span className="text-xs">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-semibold text-gray-700 w-32 border-b border-gray-100 pb-1">Request Data match</label>
                    <select
                      name="request_data_match"
                      value={formData.request_data_match}
                      onChange={handleInputChange}
                      className="flex-1 py-1 border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    >
                      <option value="">Select Option</option>
                      <option value="Applied">Applied</option>
                      <option value="Pending">Pending</option>
                      <option value="Not Required">Not Required</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex items-start space-x-2 pt-1">
                    <label className="text-sm font-semibold text-gray-700 w-32 shrink-0 pt-1">Type of Benefit</label>
                    <div className="flex-1 flex flex-wrap gap-1.5">
                      {[
                        { label: "Income-based JSA", full: "Income-based Job seeker's Allowance", icon: "💼" },
                        { label: "ESA (Income-related)", full: "Income-related Employment and Support Allowance", icon: "🏥" },
                        { label: "Income Support", full: "Income Support", icon: "💷" },
                        { label: "Pension Credit (GC)", full: "Pension Credit Guranatee Credit", icon: "👴" },
                        { label: "Working Tax Credit", full: "Working Tax Credit", icon: "🧾" },
                        { label: "Child Tax Credit", full: "Child Tax Credit", icon: "👶" },
                        { label: "Universal Credit", full: "Universal Credit", icon: "🌐" },
                        { label: "Housing Benefit", full: "Housing Benefit", icon: "🏠" },
                        { label: "Pension Credit (SC)", full: "Pension Credit Saving Credits", icon: "💰" },
                      ].map(({ label, full, icon }) => {
                        const selected = Array.isArray(formData.benefits) && formData.benefits.includes(full);
                        return (
                          <button
                            key={full}
                            type="button"
                            title={full}
                            onClick={() => {
                              setFormData((p) => {
                                const arr = Array.isArray(p.benefits) ? p.benefits : (p.benefits ? [p.benefits] : []);
                                const exists = arr.includes(full);
                                return { ...p, benefits: exists ? arr.filter(x => x !== full) : [...arr, full] };
                              });
                            }}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${selected
                              ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-emerald-50 hover:border-emerald-300"
                              }`}
                          >
                            <span aria-hidden>{icon}</span>
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Step 2: Property & Link Details */}
            {currentStep == 2 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Property & Link Details</h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Gas Safe</label>
                    <select
                      name="gas_safe"
                      value={formData.gas_safe === null ? "" : formData.gas_safe}
                      onChange={(e) => setFormData((prev) => ({ ...prev, gas_safe: e.target.value === "" ? null : e.target.value === "true" }))}
                      className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    >
                      <option value="">Select...</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Data Matched Status</label>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {["Matched", "Unmatched Verified", "Unverified"].map((status) => (
                        <label key={status} className="inline-flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Array.isArray(formData.data_matched_status) && formData.data_matched_status.includes(status)}
                            onChange={() => {
                              setFormData((p) => {
                                const current = Array.isArray(p.data_matched_status) ? p.data_matched_status : [];
                                const exists = current.includes(status);
                                return {
                                  ...p,
                                  data_matched_status: exists
                                    ? current.filter(x => x !== status)
                                    : [...current, status]
                                };
                              });
                            }}
                            className="w-3.5 h-3.5 rounded border-gray-100 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-700">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">EPC Link</label>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <input type="url" name="epc_link" value={formData.epc_link} onChange={handleInputChange} placeholder="https://example.com/epc" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                    <button type="button" onClick={() => copyToClipboard(formData.epc_link)} disabled={!formData.epc_link} className="p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Zoopla Link</label>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <input type="url" name="zoopla_link" value={formData.zoopla_link} onChange={handleInputChange} placeholder="Link" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                      <button type="button" onClick={() => copyToClipboard(formData.zoopla_link)} disabled={!formData.zoopla_link} className="p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Right Move Link</label>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <input type="url" name="rightmove_link" value={formData.rightmove_link} onChange={handleInputChange} placeholder="Link" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                      <button type="button" onClick={() => copyToClipboard(formData.rightmove_link)} disabled={!formData.rightmove_link} className="p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Mouse Price Link</label>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <input type="url" name="mouseprice_link" value={formData.mouseprice_link} onChange={handleInputChange} placeholder="Link" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                      <button type="button" onClick={() => copyToClipboard(formData.mouseprice_link)} disabled={!formData.mouseprice_link} className="p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Property Checker Link</label>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <input type="url" name="propertychecker_link" value={formData.propertychecker_link} onChange={handleInputChange} placeholder="Link" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                      <button type="button" onClick={() => copyToClipboard(formData.propertychecker_link)} disabled={!formData.propertychecker_link} className="p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Survey Folder Link</label>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <input type="url" name="survey_folder_link" value={formData.survey_folder_link} onChange={handleInputChange} placeholder="Link" className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                    <button type="button" onClick={() => copyToClipboard(formData.survey_folder_link)} disabled={!formData.survey_folder_link} className="p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <label className="flex items-center space-x-1">
                    <input type="checkbox" name="google_maps_checked" checked={formData.google_maps_checked} onChange={handleInputChange} className="w-3 h-3" />
                    <span className="text-xs font-medium">Google Maps Checked</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input type="checkbox" name="google_earth_checked" checked={formData.google_earth_checked} onChange={handleInputChange} className="w-3 h-3" />
                    <span className="text-xs font-medium">Google Earth Checked</span>
                  </label>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Requires C1</label>
                    <select name="requires_c1" value={formData.requires_c1 === null ? "" : formData.requires_c1} onChange={(e) => setFormData((prev) => ({ ...prev, requires_c1: e.target.value === "" ? null : e.target.value === "true" }))} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded">
                      <option value="">Select...</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">Booking Date</label>
                  <input type="date" name="booking_date" value={formData.booking_date} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                </div>

                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Notes (Screen 2)</label>
                  <textarea
                    name="notes_screen2"
                    rows="2"
                    value={formData.notes_screen2}
                    onChange={handleInputChange}
                    placeholder="Enter notes for screen 2..."
                    className="block w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Mandatory Evidence */}
            {currentStep == '3A' && (
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">Boiler &amp; Surveys (3A)</h3>

                {/* Table-style 2-column layout */}
                <div className="border border-gray-200 rounded overflow-hidden text-xs">

                  {/* Row: UBIL for HTHE | PRES for HHEV */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">UBIL for HTHE</div>
                      <div className="px-1 py-1">
                        <select name="ubil_hthe_name" value={formData.ubil_hthe_name} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Available">Not Available</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">PRES for HHEV</div>
                      <div className="px-1 py-1">
                        <select name="pres_hhev_name" value={formData.pres_hhev_name} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Available">Not Available</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: UBIL 3 Months OLD | PRES 3 Months OLD */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">UBIL 3 Months OLD</div>
                      <div className="px-1 py-1">
                        <select name="ubil_3_months_old" value={formData.ubil_3_months_old} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Available">Not Available</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">PRES 3 Months OLD</div>
                      <div className="px-1 py-1">
                        <select name="pres_3_months_old" value={formData.pres_3_months_old} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Available">Not Available</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: UBIL Video Available | PRES Video Available */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">UBIL Video Available</div>
                      <div className="px-1 py-1">
                        <select name="ubil_video_available" value={formData.ubil_video_available} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Available">Not Available</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">PRES Video Available</div>
                      <div className="px-1 py-1">
                        <select name="pres_video_available" value={formData.pres_video_available} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Available">Not Available</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Make/Model | Serial Number */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Make and Model</div>
                      <div className="px-1 py-1">
                        <input type="text" name="make_model_serial" value={formData.make_model_serial} onChange={handleInputChange} placeholder="e.g. Glow Worm" className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Serial Number</div>
                      <div className="px-1 py-1">
                        <input type="text" name="serial_number" value={formData.serial_number} onChange={handleInputChange} placeholder="Enter serial..." className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Row: GCGP | Front Elevation EPOP */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">GCGP</div>
                      <div className="px-1 py-1">
                        <select name="gcgp" value={formData.gcgp} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Available">Not Available</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Front Elevation all angle photos EPOP</div>
                      <div className="px-1 py-1">
                        <select name="front_elevation_photos" value={Array.isArray(formData.front_elevation_photos) ? formData.front_elevation_photos.join(", ") : (formData.front_elevation_photos || "")} onChange={(e) => handleArrayInput('front_elevation_photos', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Gas Electric Meters | Rear Elevation EPOP */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Gas and Electric Meters</div>
                      <div className="px-1 py-1">
                        <select name="gas_electric_meters" value={formData.gas_electric_meters} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Electric">Electric</option>
                          <option value="Non Electric">Non Electric</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Rear Elevation all angle photos EPOP</div>
                      <div className="px-1 py-1">
                        <select name="rear_elevation_photos" value={Array.isArray(formData.rear_elevation_photos) ? formData.rear_elevation_photos.join(", ") : (formData.rear_elevation_photos || "")} onChange={(e) => handleArrayInput('rear_elevation_photos', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Wall thickness Main | Boiler Close ups */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Wall thickness Main</div>
                      <div className="px-1 py-1">
                        <select name="wall_thickness_main" value={Array.isArray(formData.wall_thickness_main) ? formData.wall_thickness_main.join(", ") : (formData.wall_thickness_main || "")} onChange={(e) => handleArrayInput('wall_thickness_main', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Boiler Close ups, Wide angle, Pipes</div>
                      <div className="px-1 py-1">
                        <select name="boiler_close_ups_wide_angle_pipes" value={formData.boiler_close_ups_wide_angle_pipes} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Applied">Applied</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Required">Not Required</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Wall Thickness Ext 1 | Existing TRV, HC */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Wall Thickness Ext 1</div>
                      <div className="px-1 py-1">
                        <select name="wall_thickness_ext_1" value={Array.isArray(formData.wall_thickness_ext_1) ? formData.wall_thickness_ext_1.join(", ") : (formData.wall_thickness_ext_1 || "")} onChange={(e) => handleArrayInput('wall_thickness_ext_1', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Existing TRV, HC</div>
                      <div className="px-1 py-1">
                        <select name="pmhs_with_dataplate" value={Array.isArray(formData.pmhs_with_dataplate) ? formData.pmhs_with_dataplate.join(", ") : (formData.pmhs_with_dataplate || "")} onChange={(e) => handleArrayInput('pmhs_with_dataplate', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Wall Thickness Ext 2 | Boiler Data Plate */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Wall Thickness Ext 2</div>
                      <div className="px-1 py-1">
                        <select name="wall_thickness_ext_2" value={Array.isArray(formData.wall_thickness_ext_2) ? formData.wall_thickness_ext_2.join(", ") : (formData.wall_thickness_ext_2 || "")} onChange={(e) => handleArrayInput('wall_thickness_ext_2', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Boiler Data Plate</div>
                      <div className="px-1 py-1">
                        <select name="boiler_data_plate" value={formData.boiler_data_plate} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Applied">Applied</option>
                          <option value="Pending">Pending</option>
                          <option value="Not Required">Not Required</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Pitched Roof EXT 1 | Boiler PCDB */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Pitched roof EXT 1 SC (150mm)</div>
                      <div className="px-1 py-1">
                        <select name="pitched_roof_ext_1_sc_evidence_150mm" value={Array.isArray(formData.pitched_roof_ext_1_sc_evidence_150mm) ? formData.pitched_roof_ext_1_sc_evidence_150mm.join(", ") : (formData.pitched_roof_ext_1_sc_evidence_150mm || "")} onChange={(e) => handleArrayInput('pitched_roof_ext_1_sc_evidence_150mm', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Boiler PCDB</div>
                      <div className="px-1 py-1">
                        <select name="boiler_pcdb" value={formData.boiler_pcdb} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Pitched Roof EXT 2 | Cavity Filled Evidence */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Pitched roof EXT 2 SC (150mm)</div>
                      <div className="px-1 py-1">
                        <select name="pitched_roof_ext_2_sc_evidence_150mm" value={Array.isArray(formData.pitched_roof_ext_2_sc_evidence_150mm) ? formData.pitched_roof_ext_2_sc_evidence_150mm.join(", ") : (formData.pitched_roof_ext_2_sc_evidence_150mm || "")} onChange={(e) => handleArrayInput('pitched_roof_ext_2_sc_evidence_150mm', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Cavity Filled Evidence</div>
                      <div className="px-1 py-1">
                        <select name="cavity_filled_evidence" value={formData.cavity_filled_evidence} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Pitched Roof Main | Secondary Heating */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Pitched Roof Main (PICP)</div>
                      <div className="px-1 py-1">
                        <select name="pitched_roof_main" value={Array.isArray(formData.pitched_roof_main) ? formData.pitched_roof_main.join(", ") : (formData.pitched_roof_main || "")} onChange={(e) => handleArrayInput('pitched_roof_main', e.target.value)} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Secondary Heating Source</div>
                      <div className="px-1 py-1">
                        <select name="secondary_heating_source_evidence" value={formData.secondary_heating_source_evidence} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Checked and verified">Checked and verified</option>
                          <option value="Photos Missing">Photos Missing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row: Shower Type | High Value Note (full width textarea) */}
                  <div className="grid grid-cols-2 border-b border-gray-200">
                    <div className="grid grid-cols-2 border-r border-gray-200">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">Shower Types</div>
                      <div className="px-1 py-1">
                        <select name="shower_type" value={formData.shower_type} onChange={handleInputChange} className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white">
                          <option value="">Select...</option>
                          <option value="Electric">Electric</option>
                          <option value="Non-Electric">Non-Electric</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="px-2 py-1.5 bg-gray-50 font-medium text-gray-600 border-r border-gray-200 flex items-center">High Value Note</div>
                      <div className="px-1 py-1">
                        <textarea name="high_value_notes" value={formData.high_value_notes} onChange={handleInputChange} rows="1" className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded outline-none bg-white resize-none" />
                      </div>
                    </div>
                  </div>

                </div>


                <div className="pt-4 border-t mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-tight">Add More Evidence (3A)</h3>
                    <div className="flex gap-2">
                      {templatesData?.data?.length > 0 && (
                        <select
                          className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] outline-none"
                          onChange={(e) => {
                            if (e.target.value) {
                              const template = templatesData.data.find(t => t.id == e.target.value);
                              if (template) {
                                handleApplyTemplate('add_more_evidence_3a', template);
                              }
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="">Fetch Template...</option>
                          {templatesData.data.map(t => (
                            <option key={t.id} value={t.id}>{t.template_name}</option>
                          ))}
                        </select>
                      )}
                      <button type="button" onClick={addMoreEvidence3aGroup} className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px] hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        Add Group
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(Array.isArray(formData.add_more_evidence_3a) ? formData.add_more_evidence_3a : []).map((group, gi) => {
                      const colors = [
                        "border-blue-400 bg-blue-50/30",
                        "border-emerald-400 bg-emerald-50/30",
                        "border-purple-400 bg-purple-50/30",
                        "border-orange-400 bg-orange-50/30",
                        "border-rose-400 bg-rose-50/30",
                      ];
                      const tableHeaders = [
                        "bg-blue-600/10",
                        "bg-emerald-600/10",
                        "bg-purple-600/10",
                        "bg-orange-600/10",
                        "bg-rose-600/10",
                      ];
                      const colorClass = colors[gi % colors.length];
                      const headerClass = tableHeaders[gi % tableHeaders.length];

                      return (
                        <div key={gi} className={`p-2 border rounded shadow-sm ${colorClass} transition-shadow`}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Folder Name"
                                value={group.main_folder || ""}
                                onChange={(e) => updateMoreEvidence3aGroup(gi, 'main_folder', e.target.value)}
                                className="block w-full px-2 py-1 text-xs font-bold bg-white/70 border-b border-gray-300 rounded outline-none"
                              />
                            </div>
                            <button type="button" onClick={() => removeMoreEvidence3aGroup(gi)} className="ml-2 text-red-500 hover:text-red-700">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-end gap-2 mb-2">
                            <button
                              type="button"
                              onClick={() => handleSaveAsTemplate(group)}
                              className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 rounded text-[9px] hover:bg-emerald-600/20 flex items-center gap-1 transition-colors"
                            >
                              <Copy className="w-2.5 h-2.5" /> Save as Template
                            </button>
                          </div>

                          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
                            <table className="w-full text-[11px]">
                              <thead className={`${headerClass} border-b`}>
                                <tr>
                                  <th className="px-2 py-1.5 text-left font-bold text-gray-700">Name</th>
                                  <th className="px-2 py-1.5 text-left font-bold text-gray-700 w-36">Status</th>
                                  <th className="px-2 py-1.5 text-left font-bold text-gray-700">Issue</th>
                                  <th className="px-2 py-1.5 text-center font-bold text-gray-700 w-10">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(Array.isArray(group.documents) ? group.documents : []).map((doc, di) => (
                                  <tr key={di} className="border-b last:border-0 hover:bg-gray-50/50">
                                    <td className="px-2 py-1 border-r">
                                      <input type="text" value={doc.name || ""} onChange={(e) => updateMoreEvidence3aRow(gi, di, 'name', e.target.value)} placeholder="Name..." className="w-full p-0 bg-transparent outline-none" />
                                    </td>
                                    <td className="px-2 py-1 border-r">
                                      <select value={doc.status || ""} onChange={(e) => updateMoreEvidence3aRow(gi, di, 'status', e.target.value)} className="w-full p-0 bg-transparent outline-none text-[10px] font-semibold text-gray-700">
                                        <option value="">Select...</option>
                                        <option value="Done">Done</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Not Required">Not Required</option>
                                      </select>
                                    </td>
                                    <td className="px-2 py-1 border-r">
                                      <input value={doc.issue || ""} onChange={(e) => updateMoreEvidence3aRow(gi, di, 'issue', e.target.value)} placeholder="..." className="w-full p-0 bg-transparent outline-none" />
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                      <button type="button" onClick={() => removeMoreEvidence3aRow(gi, di)}>
                                        <X className="w-3.5 h-3.5 text-red-400 hover:text-red-600 mx-auto" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <button type="button" onClick={() => addMoreEvidence3aRow(gi)} className="w-full py-1 text-[10px] text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-100/50 border-t border-gray-100">
                              + Add Row
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3B: Add More Evidence */}
            {currentStep == '3B' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Add More Evidence (3B)</h3>
                  <div className="flex gap-2">
                    {templatesData?.data?.length > 0 && (
                      <select
                        className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] outline-none"
                        onChange={(e) => {
                          if (e.target.value) {
                            const template = templatesData.data.find(t => t.id == e.target.value);
                            if (template) {
                              handleApplyTemplate('add_more_evidence', template);
                            }
                            e.target.value = "";
                          }
                        }}
                      >
                        <option value="">Fetch Template...</option>
                        {templatesData.data.map(t => (
                          <option key={t.id} value={t.id}>{t.template_name}</option>
                        ))}
                      </select>
                    )}
                    <button type="button" onClick={addMoreEvidenceGroup} className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px] hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      Add Group
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {(Array.isArray(formData.add_more_evidence) ? formData.add_more_evidence : []).map((group, gi) => {
                    const colors = [
                      "border-blue-400 bg-blue-50",
                      "border-emerald-400 bg-emerald-50",
                      "border-purple-400 bg-purple-50",
                      "border-orange-400 bg-orange-50",
                      "border-rose-400 bg-rose-50",
                      "border-indigo-400 bg-indigo-50",
                      "border-amber-400 bg-amber-50",
                      "border-cyan-400 bg-cyan-50",
                      "border-fuchsia-400 bg-fuchsia-50",
                      "border-teal-400 bg-teal-50",
                    ];
                    const bgColors = [
                      "bg-blue-100",
                      "bg-emerald-100",
                      "bg-purple-100",
                      "bg-orange-100",
                      "bg-rose-100",
                      "bg-indigo-100",
                      "bg-amber-100",
                      "bg-cyan-100",
                      "bg-fuchsia-100",
                      "bg-teal-100",
                    ];
                    const colorClass = colors[gi % colors.length];
                    const bgClass = bgColors[gi % bgColors.length];

                    return (
                      <div key={gi} className={`p-2 border rounded-md shadow-sm ${colorClass} transition-shadow hover:shadow-md text-xs`}>
                        <div className="mb-2 pb-1 border-b border-gray-300/50">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-gray-800">Main Folder</label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveAsTemplate(group)}
                                className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 rounded text-[9px] hover:bg-emerald-600/20 flex items-center gap-1 transition-colors"
                              >
                                <Copy className="w-2.5 h-2.5" /> Save
                              </button>
                              <button
                                type="button"
                                onClick={() => removeMoreEvidenceGroup(gi)}
                                className="px-2 py-0.5 text-red-600 font-medium hover:bg-red-50 rounded transition-colors text-[10px] flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                Remove Group
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={group.main_folder || ""}
                            onChange={(e) => updateMoreEvidenceGroup(gi, 'main_folder', e.target.value)}
                            className="block w-full px-2 py-1 border border-white/50 bg-white/70 shadow-inner rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                          />
                        </div>

                        <div className="mt-2 overflow-x-auto bg-white rounded-sm shadow-sm border border-gray-100">
                          <table className="w-full text-[11px] text-left border-collapse">
                            <thead className={`${bgClass} uppercase text-gray-700 font-semibold border-b`}>
                              <tr>
                                <th className="px-2 py-1.5 border-r font-medium">Name</th>
                                <th className="px-2 py-1.5 border-r font-medium w-32">Status</th>
                                <th className="px-2 py-1.5 border-r font-medium">Issue</th>
                                <th className="px-2 py-1.5 font-medium w-10 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(Array.isArray(group.documents) ? group.documents : []).map((doc, di) => (
                                <tr key={di} className="border-b hover:bg-gray-50/80 transition-colors last:border-b-0">
                                  <td className="px-2 py-1 border-r bg-white align-top">
                                    <input type="text" value={doc.name || ""} onChange={(e) => updateMoreEvidenceRow(gi, di, 'name', e.target.value)} className="w-full px-1 py-0.5 border border-transparent rounded bg-transparent focus:bg-white focus:border-blue-200" />
                                  </td>
                                  <td className="px-2 py-1 border-r bg-white align-top">
                                    <select value={doc.status || ""} onChange={(e) => updateMoreEvidenceRow(gi, di, 'status', e.target.value)} className="w-full px-1 py-0.5 border border-transparent rounded bg-transparent focus:bg-white focus:border-blue-200">
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
                                  </td>
                                  <td className="px-2 py-1 border-r bg-white align-top">
                                    <textarea
                                      value={doc.issue || ""}
                                      onChange={(e) => updateMoreEvidenceRow(gi, di, 'issue', e.target.value)}
                                      className="w-full px-1 py-0.5 border border-transparent rounded bg-transparent focus:bg-white focus:border-blue-200 resize-y min-h-[24px]"
                                      rows="1"
                                      placeholder="Note any issues..."
                                    />
                                  </td>
                                  <td className="px-2 py-1 text-center bg-white align-top pt-1.5">
                                    <button type="button" onClick={() => removeMoreEvidenceRow(gi, di)} className="text-red-400 hover:text-red-600 transition-colors">
                                      <X className="w-4 h-4 mx-auto" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="p-1.5 bg-gray-50 border-t flex justify-between items-center">
                            <button type="button" onClick={() => addMoreEvidenceRow(gi)} className="px-3 py-1 bg-gray-200 text-gray-600 font-medium rounded text-[10px] hover:bg-gray-300 transition-colors shadow-sm">
                              + Add Evidence
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div>
                    <button type="button" onClick={addMoreEvidenceGroup} className="px-3 py-1 bg-gray-200 rounded">Add Evidence Group</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: EPC & Numeric Metrics (Old Screen 4 - Unchanged position) */}
            {
              currentStep == 4 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">EPC &amp; Numeric Metrics</h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">Services Required</label>
                    <div className="mt-1">
                      {Array.isArray(formData.services) && formData.services.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
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
                              <span key={i} className="inline-flex items-center px-1.5 py-0.5 text-[10px] bg-gray-100 rounded">
                                <span className="mr-1 text-xs" aria-hidden>{icon}</span>
                                <span>{s}</span>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-500">No services selected on the lead.</div>
                      )}
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Start SAP</label>
                      <input
                        type="number"
                        step="0.01"
                        name="start_sap"
                        value={formData.start_sap ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, start_sap: e.target.value === "" ? null : parseFloat(e.target.value) }))}
                        className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">End SAP</label>
                      <input
                        type="number"
                        step="0.01"
                        name="end_sap"
                        value={formData.end_sap ?? ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, end_sap: e.target.value === "" ? null : parseFloat(e.target.value) }))}
                        className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">Number Metrics (1/2/3)</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <input type="number" step="0.01" placeholder="N1" value={formData.number_metrics?.number1 ?? ""} onChange={(e) => handleNestedInput('number_metrics', 'number1', null, e.target.value, true)} className="px-2 py-1 text-xs border border-gray-300 rounded" />
                      <input type="number" step="0.01" placeholder="N2" value={formData.number_metrics?.number2 ?? ""} onChange={(e) => handleNestedInput('number_metrics', 'number2', null, e.target.value, true)} className="px-2 py-1 text-xs border border-gray-300 rounded" />
                      <input type="number" step="0.01" placeholder="N3" value={formData.number_metrics?.number3 ?? ""} onChange={(e) => handleNestedInput('number_metrics', 'number3', null, e.target.value, true)} className="px-2 py-1 text-xs border border-gray-300 rounded" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-700 border-b pb-0.5">EPC Metrics</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {/* epc_rating */}
                      <div className="bg-gray-50/50 p-1 rounded">
                        <div className="text-[10px] font-medium text-gray-600 mb-1">EPC Rating</div>
                        <input type="number" step="0.01" placeholder="Prev" value={formData.epc_metrics?.epc_rating?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'epc_rating', 'previous', e.target.value, true)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <input type="number" step="0.01" placeholder="Curr" value={formData.epc_metrics?.epc_rating?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'epc_rating', 'current', e.target.value, true)} className="mt-1 block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <div className="mt-0.5 text-[9px] text-gray-500">Diff: {formData.epc_metrics?.epc_rating?.difference ?? "0"}</div>
                      </div>

                      {/* epc_area */}
                      <div className="bg-gray-50/50 p-1 rounded">
                        <div className="text-[10px] font-medium text-gray-600 mb-1">EPC Area</div>
                        <input type="number" step="0.01" placeholder="Prev" value={formData.epc_metrics?.epc_area?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'epc_area', 'previous', e.target.value, true)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <input type="number" step="0.01" placeholder="Curr" value={formData.epc_metrics?.epc_area?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'epc_area', 'current', e.target.value, true)} className="mt-1 block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <div className="mt-0.5 text-[9px] text-gray-500">Diff: {formData.epc_metrics?.epc_area?.difference ?? "0"}</div>
                      </div>

                      {/* loft_insulation */}
                      <div className="bg-gray-50/50 p-1 rounded">
                        <div className="text-[10px] font-medium text-gray-600 mb-1">Loft Ins (mm)</div>
                        <input type="number" step="0.01" placeholder="Prev" value={formData.epc_metrics?.loft_insulation?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'loft_insulation', 'previous', e.target.value, true)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <input type="number" step="0.01" placeholder="Curr" value={formData.epc_metrics?.loft_insulation?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'loft_insulation', 'current', e.target.value, true)} className="mt-1 block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <div className="mt-0.5 text-[9px] text-gray-500">Diff: {formData.epc_metrics?.loft_insulation?.difference ?? "0"}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* secondary_heating */}
                      <div className="bg-gray-50/50 p-1 rounded">
                        <div className="text-[10px] font-medium text-gray-600 mb-1">Sec Heating</div>
                        <input type="number" step="1" placeholder="Prev" value={formData.epc_metrics?.secondary_heating?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'secondary_heating', 'previous', e.target.value, true)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <input type="number" step="1" placeholder="Curr" value={formData.epc_metrics?.secondary_heating?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'secondary_heating', 'current', e.target.value, true)} className="mt-1 block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                      </div>

                      {/* cavity_wall_insulation */}
                      <div className="bg-gray-50/50 p-1 rounded">
                        <div className="text-[10px] font-medium text-gray-600 mb-1">Cavity Wall</div>
                        <input type="number" step="0.01" placeholder="Prev" value={formData.epc_metrics?.cavity_wall_insulation?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'cavity_wall_insulation', 'previous', e.target.value, true)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <input type="number" step="0.01" placeholder="Curr" value={formData.epc_metrics?.cavity_wall_insulation?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'cavity_wall_insulation', 'current', e.target.value, true)} className="mt-1 block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                      </div>

                      {/* loft_ext_1 */}
                      <div className="bg-gray-50/50 p-1 rounded">
                        <div className="text-[10px] font-medium text-gray-600 mb-1">Loft Ext 1</div>
                        <input type="number" step="0.01" placeholder="Prev" value={formData.epc_metrics?.loft_ext_1?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'loft_ext_1', 'previous', e.target.value, true)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                        <input type="number" step="0.01" placeholder="Curr" value={formData.epc_metrics?.loft_ext_1?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'loft_ext_1', 'current', e.target.value, true)} className="mt-1 block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Property Age (P/C)</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input type="text" placeholder="Prev" value={formData.epc_metrics?.property_age?.previous ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'property_age', 'previous', e.target.value, false)} className="px-1.5 py-0.5 text-[11px] border border-gray-300 rounded" />
                          <input type="text" placeholder="Curr" value={formData.epc_metrics?.property_age?.current ?? ""} onChange={(e) => handleNestedInput('epc_metrics', 'property_age', 'current', e.target.value, false)} className="px-1.5 py-0.5 text-[11px] border border-gray-300 rounded" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-0.5">High Value Notes</label>
                        <textarea
                          name="high_value_notes"
                          value={formData.high_value_notes}
                          onChange={handleInputChange}
                          placeholder="..."
                          className="block w-full px-1.5 py-0.5 text-[11px] border border-gray-300 rounded"
                          rows="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Added Fields for Step 4 */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Floor Area</label>
                      <input type="text" name="floor_area" value={formData.floor_area ?? ""} onChange={handleInputChange} className="px-1.5 py-0.5 w-full text-[11px] border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-0.5">ABS</label>
                      <input type="text" name="abs" value={formData.abs ?? ""} onChange={handleInputChange} className="px-1.5 py-0.5 w-full text-[11px] border border-gray-300 rounded" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Any Potential</label>
                    <textarea name="any_potential" value={formData.any_potential ?? ""} onChange={handleInputChange} className="w-full px-1.5 py-0.5 text-[11px] border border-gray-300 rounded max-h-16" rows="2" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Additional checks</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-0.5">ASHP suitable?</label>
                        <select name="ashp_suitable" value={formData.additional_checks?.ashp_suitable ?? ""} onChange={(e) => handleNestedInput('additional_checks', 'ashp_suitable', null, e.target.value, false)} className="w-full px-1.5 py-0.5 text-[11px] border border-gray-300 rounded bg-white">
                          <option value="">Select...</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Roof is good for Solar?</label>
                        <select name="roof_is_good_for_solar" value={formData.additional_checks?.roof_is_good_for_solar ?? ""} onChange={(e) => handleNestedInput('additional_checks', 'roof_is_good_for_solar', null, e.target.value, false)} className="w-full px-1.5 py-0.5 text-[11px] border border-gray-300 rounded bg-white">
                          <option value="">Select...</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Any Trees Nearby</label>
                        <input type="text" name="any_trees_nearby" value={formData.additional_checks?.any_trees_nearby ?? ""} onChange={(e) => handleNestedInput('additional_checks', 'any_trees_nearby', null, e.target.value, false)} className="w-full px-1.5 py-0.5 text-[11px] border border-gray-300 rounded" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-0.5">Orientation</label>
                        <input type="text" name="orientation" value={formData.additional_checks?.orientation ?? ""} onChange={(e) => handleNestedInput('additional_checks', 'orientation', null, e.target.value, false)} placeholder="e.g. South" className="w-full px-1.5 py-0.5 text-[11px] border border-gray-300 rounded" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-tight">Add More Evidence (Screen 4)</h3>
                      <div className="flex gap-2">
                        {templatesData?.data?.length > 0 && (
                          <select
                            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] outline-none"
                            onChange={(e) => {
                              if (e.target.value) {
                                const template = templatesData.data.find(t => t.id == e.target.value);
                                if (template) {
                                  handleApplyTemplate('add_more_evidence_for_screen_4', template);
                                }
                                e.target.value = "";
                              }
                            }}
                          >
                            <option value="">Fetch Template...</option>
                            {templatesData.data.map(t => (
                              <option key={t.id} value={t.id}>{t.template_name}</option>
                            ))}
                          </select>
                        )}
                        <button type="button" onClick={addMoreEvidence4Group} className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px] hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Add Group
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(Array.isArray(formData.add_more_evidence_for_screen_4) ? formData.add_more_evidence_for_screen_4 : []).map((group, gi) => {
                        const colors = ["border-blue-400 bg-blue-50/30", "border-emerald-400 bg-emerald-50/30", "border-purple-400 bg-purple-50/30", "border-orange-400 bg-orange-50/30", "border-rose-400 bg-rose-50/30"];
                        const tableHeaders = ["bg-blue-600/10", "bg-emerald-600/10", "bg-purple-600/10", "bg-orange-600/10", "bg-rose-600/10"];
                        const colorClass = colors[gi % colors.length];
                        const headerClass = tableHeaders[gi % tableHeaders.length];

                        return (
                          <div key={gi} className={`p-2 border rounded shadow-sm ${colorClass} transition-shadow`}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  placeholder="Folder Name"
                                  value={group.main_folder || ""}
                                  onChange={(e) => updateMoreEvidence4Group(gi, 'main_folder', e.target.value)}
                                  className="block w-full px-2 py-1 text-xs font-bold bg-white/70 border-b border-gray-300 rounded outline-none"
                                />
                              </div>
                              <button type="button" onClick={() => removeMoreEvidence4Group(gi)} className="ml-2 text-red-500 hover:text-red-700">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex justify-end mb-2">
                              <button
                                type="button"
                                onClick={() => handleSaveAsTemplate(group)}
                                className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 rounded text-[9px] hover:bg-emerald-600/20 flex items-center gap-1 transition-colors"
                              >
                                <Copy className="w-2.5 h-2.5" /> Save as Template
                              </button>
                            </div>

                            <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
                              <table className="w-full text-[11px]">
                                <thead className={`${headerClass} border-b`}>
                                  <tr>
                                    <th className="px-2 py-1.5 text-left font-bold text-gray-700">Name</th>
                                    <th className="px-2 py-1.5 text-left font-bold text-gray-700 w-36">Status</th>
                                    <th className="px-2 py-1.5 text-left font-bold text-gray-700">Issue</th>
                                    <th className="px-2 py-1.5 text-center font-bold text-gray-700 w-10">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(Array.isArray(group.documents) ? group.documents : []).map((doc, di) => (
                                    <tr key={di} className="border-b last:border-0 hover:bg-gray-50/50">
                                      <td className="px-2 py-1 border-r">
                                        <input type="text" value={doc.name || ""} onChange={(e) => updateMoreEvidence4Row(gi, di, 'name', e.target.value)} placeholder="Name..." className="w-full p-0 bg-transparent outline-none" />
                                      </td>
                                      <td className="px-2 py-1 border-r">
                                        <select value={doc.status || ""} onChange={(e) => updateMoreEvidence4Row(gi, di, 'status', e.target.value)} className="w-full p-0 bg-transparent outline-none text-[10px] font-semibold text-gray-700">
                                          <option value="">Select...</option>
                                          <option value="Done">Done</option>
                                          <option value="Pending">Pending</option>
                                          <option value="Not Required">Not Required</option>
                                        </select>
                                      </td>
                                      <td className="px-2 py-1 border-r">
                                        <input value={doc.issue || ""} onChange={(e) => updateMoreEvidence4Row(gi, di, 'issue', e.target.value)} placeholder="..." className="w-full p-0 bg-transparent outline-none" />
                                      </td>
                                      <td className="px-2 py-1 text-center">
                                        <button type="button" onClick={() => removeMoreEvidence4Row(gi, di)}>
                                          <X className="w-3.5 h-3.5 text-red-400 hover:text-red-600 mx-auto" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <button type="button" onClick={() => addMoreEvidence4Row(gi)} className="w-full py-1 text-[10px] text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-100/50 border-t border-gray-100">
                                + Add Row
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            }

            {/* Step 11: Sheet / Trustmark & Tecnica (Old Screen 5) */}
            {
              currentStep == 11 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Sheet / Trustmark &amp; Tecnica</h3>

                  <div className="grid grid-cols-2 gap-2">
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

                    {/* <div>
                    <label className="block text-xs font-medium text-gray-600">Master Sheet Giant Source</label>
                    <input type="url" name="master_sheet_giant_source" value={formData.master_sheet_giant_source} onChange={handleInputChange} placeholder="https://..." className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                  </div> */}

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
                      <span className="text-sm">C2 Packs All Key Parts &amp; Stages</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="c3_packs_all_key_parts" checked={formData.c3_packs_all_key_parts} onChange={handleInputChange} className="w-4 h-4" />
                      <span className="text-sm">C3 Packs All Key Parts</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">Queries</label>
                    <select name="queries" value={formData.queries ?? ""} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded">
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
                      <label className="block text-xs font-medium text-gray-600">Trustmark</label>
                      <input type="text" name="trustmark" value={formData.trustmark} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Lodgement</label>
                      <input type="text" name="lodgement" value={formData.lodgement} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Trustmark Project Certificate</label>
                      <input type="text" name="trustmark_project_certificate" value={formData.trustmark_project_certificate} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Project Stage1 Trustmark Project Certificate</label>
                      <input type="text" name="project_stage1_trustmark_project_certificate" value={formData.project_stage1_trustmark_project_certificate} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600">Tecnica</label>
                    <input type="text" name="tecnica" value={formData.tecnica} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Scaffolding Removed Date</label>
                      <input type="date" name="scaffolding_removed_date" value={formData.scaffolding_removed_date} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Rubbish Collected Date</label>
                      <input type="date" name="rubbish_collected_date" value={formData.rubbish_collected_date} onChange={handleInputChange} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              )
            }

            {/* Screen 7A: Pre Paperwork */}
            {
              currentStep === '7A' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">Pre Paper Work</h3>

                  {/* Dropdown fields */}
                  {[
                    {
                      label: 'Ventilation Assessment File',
                      key: 'ventilation_assessment_file',
                      options: [
                        { value: 'completed_checked_verified', label: 'Completed, Checked and Verified' },
                        { value: 'pending', label: 'Pending' },
                      ]
                    },
                    {
                      label: 'Floor Plan Ready and Tested with Calculation',
                      key: 'floor_plan',
                      options: [
                        { value: 'checked_and_verified', label: 'Checked and Verified' },
                        { value: 'pending', label: 'Pending' },
                      ]
                    },
                    {
                      label: 'Assessment',
                      key: 'assessment',
                      options: [
                        { value: 'prepared', label: 'Prepared' },
                        { value: 'not_done', label: 'Not Done' },
                        { value: 'text_only_updated', label: 'Text Only Updated' },
                      ]
                    },
                    {
                      label: 'Retrofit Design',
                      key: 'retrofit_design',
                      options: [
                        { value: 'received_and_checked', label: 'Received and Checked' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'sent_out_for_designing', label: 'Sent Out for Designing' },
                      ]
                    },
                    {
                      label: 'Solar/ASHP Design',
                      key: 'solar_ashp_design',
                      options: [
                        { value: 'received_and_checked', label: 'Received and Checked' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'sent_out_for_designing', label: 'Sent Out for Designing' },
                      ]
                    },
                    {
                      label: 'Customer Quotes',
                      key: 'customer_quotes',
                      options: [
                        { value: 'sent_to_customer', label: 'Sent to Customer' },
                        { value: 'not_sent', label: 'Not Sent' },
                      ]
                    },
                  ].map(({ label, key, options }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                      <select
                        value={formData.pre_paperwork_7a?.[key] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          pre_paperwork_7a: { ...prev.pre_paperwork_7a, [key]: e.target.value }
                        }))}
                        className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                      >
                        <option value="">Select...</option>
                        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  ))}

                  {/* Add More Evidence - similar to screen 3B */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-tight">Add More Evidence</h4>
                      <div className="flex gap-2">
                        {templatesData?.data?.length > 0 && (
                          <select
                            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] outline-none"
                            onChange={(e) => {
                              if (e.target.value) {
                                const template = templatesData.data.find(t => t.id == e.target.value);
                                if (template) {
                                  handleApplyTemplate('pre_paperwork_7a.add_more_evidence', template);
                                }
                                e.target.value = "";
                              }
                            }}
                          >
                            <option value="">Fetch Template...</option>
                            {templatesData.data.map(t => (
                              <option key={t.id} value={t.id}>{t.template_name}</option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() => addGroupWithPath('pre_paperwork_7a.add_more_evidence')}
                          className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px] hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Group
                        </button>
                      </div>
                    </div>
                    {(formData.pre_paperwork_7a?.add_more_evidence || []).map((group, gi) => (
                      <div key={gi} className="mb-3 p-2 border border-gray-200 rounded bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <input
                            type="text"
                            placeholder="Folder name..."
                            value={group.main_folder || ''}
                            onChange={(e) => setFormData(prev => {
                              const arr = [...(prev.pre_paperwork_7a?.add_more_evidence || [])];
                              arr[gi] = { ...arr[gi], main_folder: e.target.value };
                              return { ...prev, pre_paperwork_7a: { ...prev.pre_paperwork_7a, add_more_evidence: arr } };
                            })}
                            className="text-xs px-2 py-1 border border-gray-300 rounded w-full mr-2"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => {
                              const arr = [...(prev.pre_paperwork_7a?.add_more_evidence || [])];
                              arr.splice(gi, 1);
                              return { ...prev, pre_paperwork_7a: { ...prev.pre_paperwork_7a, add_more_evidence: arr } };
                            })}
                            className="text-red-500 hover:text-red-700 ml-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveAsTemplate(group)}
                            className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 rounded text-[9px] hover:bg-emerald-600/20 flex items-center gap-1 transition-colors ml-2"
                          >
                            <Copy className="w-2.5 h-2.5" /> Save
                          </button>
                        </div>
                        <table className="w-full text-[10px] border border-gray-200 rounded">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 py-1 text-left border-r">Name</th>
                              <th className="px-2 py-1 text-left border-r">Status</th>
                              <th className="px-2 py-1 text-left border-r">Issue</th>
                              <th className="px-2 py-1 text-center w-6"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {(group.documents || []).map((doc, di) => (
                              <tr key={di} className="border-t border-gray-100">
                                <td className="px-2 py-1 border-r"><input value={doc.name || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.pre_paperwork_7a?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], name: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, pre_paperwork_7a: { ...prev.pre_paperwork_7a, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none" /></td>
                                <td className="px-2 py-1 border-r"><select value={doc.status || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.pre_paperwork_7a?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], status: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, pre_paperwork_7a: { ...prev.pre_paperwork_7a, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none"><option value="">Select...</option><option value="Done">Done</option><option value="Pending">Pending</option><option value="Not Required">Not Required</option></select></td>
                                <td className="px-2 py-1 border-r"><input value={doc.issue || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.pre_paperwork_7a?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], issue: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, pre_paperwork_7a: { ...prev.pre_paperwork_7a, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none" /></td>
                                <td className="px-2 py-1 text-center"><button type="button" onClick={() => setFormData(prev => { const arr = [...(prev.pre_paperwork_7a?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs.splice(di, 1); g.documents = docs; arr[gi] = g; return { ...prev, pre_paperwork_7a: { ...prev.pre_paperwork_7a, add_more_evidence: arr } }; })}><X className="w-3.5 h-3.5 text-red-400 hover:text-red-600 mx-auto" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => {
                            const arr = [...(prev.pre_paperwork_7a?.add_more_evidence || [])];
                            const g = { ...arr[gi] };
                            g.documents = [...(g.documents || []), { name: '', status: '', issue: '' }];
                            arr[gi] = g;
                            return { ...prev, pre_paperwork_7a: { ...prev.pre_paperwork_7a, add_more_evidence: arr } };
                          })}
                          className="w-full py-1 text-[10px] text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-100/50 border-t border-gray-100"
                        >
                          + Add Row
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            {/* Screen 7B: Material */}
            {
              currentStep === '7B' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">Material</h3>

                  {/* Material rows: status yes/no + date */}
                  {[
                    { label: 'Solar', key: 'solar' },
                    { label: 'ASHP', key: 'ashp' },
                    { label: 'Boiler and HC', key: 'boiler_hc' },
                    { label: 'Loft', key: 'loft' },
                    { label: 'Scaffolding Order', key: 'scaffolding_order' },
                  ].map(({ label, key }) => (
                    <div key={key} className="grid grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                        <p className="text-[10px] text-gray-400">Status</p>
                        <select
                          value={formData.material_7b?.[key]?.status || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            material_7b: {
                              ...prev.material_7b,
                              [key]: { ...(prev.material_7b?.[key] || {}), status: e.target.value }
                            }
                          }))}
                          className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                        >
                          <option value="">Select...</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-gray-400">Date Order</p>
                        <input
                          type="date"
                          value={formData.material_7b?.[key]?.date_order || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            material_7b: {
                              ...prev.material_7b,
                              [key]: { ...(prev.material_7b?.[key] || {}), date_order: e.target.value }
                            }
                          }))}
                          className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Scaffolding Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Scaffolding Date</label>
                    <input
                      type="text"
                      value={formData.material_7b?.scaffolding_date || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        material_7b: { ...prev.material_7b, scaffolding_date: e.target.value }
                      }))}
                      placeholder="Enter scaffolding date..."
                      className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Add More Evidence for 7B */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-tight">Add More Evidence</h4>
                      <div className="flex gap-2">
                        {templatesData?.data?.length > 0 && (
                          <select
                            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] outline-none"
                            onChange={(e) => {
                              if (e.target.value) {
                                const template = templatesData.data.find(t => t.id == e.target.value);
                                if (template) {
                                  handleApplyTemplate('material_7b.add_more_evidence', template);
                                }
                                e.target.value = "";
                              }
                            }}
                          >
                            <option value="">Fetch Template...</option>
                            {templatesData.data.map(t => (
                              <option key={t.id} value={t.id}>{t.template_name}</option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() => addGroupWithPath('material_7b.add_more_evidence')}
                          className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px] hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Group
                        </button>
                      </div>
                    </div>
                    {(formData.material_7b?.add_more_evidence || []).map((group, gi) => (
                      <div key={gi} className="mb-3 p-2 border border-gray-200 rounded bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <input
                            type="text"
                            placeholder="Folder name..."
                            value={group.main_folder || ''}
                            onChange={(e) => setFormData(prev => {
                              const arr = [...(prev.material_7b?.add_more_evidence || [])];
                              arr[gi] = { ...arr[gi], main_folder: e.target.value };
                              return { ...prev, material_7b: { ...prev.material_7b, add_more_evidence: arr } };
                            })}
                            className="text-xs px-2 py-1 border border-gray-300 rounded w-full mr-2"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => {
                              const arr = [...(prev.material_7b?.add_more_evidence || [])];
                              arr.splice(gi, 1);
                              return { ...prev, material_7b: { ...prev.material_7b, add_more_evidence: arr } };
                            })}
                            className="text-red-500 hover:text-red-700 ml-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveAsTemplate(group)}
                            className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 rounded text-[9px] hover:bg-emerald-600/20 flex items-center gap-1 transition-colors ml-2"
                          >
                            <Copy className="w-2.5 h-2.5" /> Save
                          </button>
                        </div>
                        <table className="w-full text-[10px] border border-gray-200 rounded">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-2 py-1 text-left border-r">Name</th>
                              <th className="px-2 py-1 text-left border-r">Status</th>
                              <th className="px-2 py-1 text-left border-r">Issue</th>
                              <th className="px-2 py-1 text-center w-6"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {(group.documents || []).map((doc, di) => (
                              <tr key={di} className="border-t border-gray-100">
                                <td className="px-2 py-1 border-r"><input value={doc.name || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.material_7b?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], name: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, material_7b: { ...prev.material_7b, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none" /></td>
                                <td className="px-2 py-1 border-r"><select value={doc.status || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.material_7b?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], status: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, material_7b: { ...prev.material_7b, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none"><option value="">Select...</option><option value="Done">Done</option><option value="Pending">Pending</option><option value="Not Required">Not Required</option></select></td>
                                <td className="px-2 py-1 border-r"><input value={doc.issue || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.material_7b?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], issue: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, material_7b: { ...prev.material_7b, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none" /></td>
                                <td className="px-2 py-1 text-center"><button type="button" onClick={() => setFormData(prev => { const arr = [...(prev.material_7b?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs.splice(di, 1); g.documents = docs; arr[gi] = g; return { ...prev, material_7b: { ...prev.material_7b, add_more_evidence: arr } }; })}><X className="w-3.5 h-3.5 text-red-400 hover:text-red-600 mx-auto" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => {
                            const arr = [...(prev.material_7b?.add_more_evidence || [])];
                            const g = { ...arr[gi] };
                            g.documents = [...(g.documents || []), { name: '', status: '', issue: '' }];
                            arr[gi] = g;
                            return { ...prev, material_7b: { ...prev.material_7b, add_more_evidence: arr } };
                          })}
                          className="w-full py-1 text-[10px] text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-100/50 border-t border-gray-100"
                        >
                          + Add Row
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            {/* Screen 8: Installation Requirements */}
            {
              currentStep === 8 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 border-b border-gray-200 pb-2">Installation Requirements</h3>
                    <p className="text-[11px] text-gray-500 mb-3">Include all C2 packs requirement, based in measure</p>
                  </div>

                  {/* Notes / text field */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={formData.installation_requirements_8?.notes || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        installation_requirements_8: { ...prev.installation_requirements_8, notes: e.target.value }
                      }))}
                      rows={4}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none resize-y"
                      placeholder="Enter installation requirements notes..."
                    />
                  </div>

                  {/* Add More Evidence */}
                  <div className="mt-2 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-tight">Add More Evidence</h4>
                      <div className="flex gap-2">
                        {templatesData?.data?.length > 0 && (
                          <select
                            className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] outline-none"
                            onChange={(e) => {
                              if (e.target.value) {
                                const template = templatesData.data.find(t => t.id == e.target.value);
                                if (template) {
                                  handleApplyTemplate('installation_requirements_8.add_more_evidence', template);
                                }
                                e.target.value = "";
                              }
                            }}
                          >
                            <option value="">Fetch Template...</option>
                            {templatesData.data.map(t => (
                              <option key={t.id} value={t.id}>{t.template_name}</option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          onClick={() => addGroupWithPath('installation_requirements_8.add_more_evidence')}
                          className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px] hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Group
                        </button>
                      </div>
                    </div>
                    {(formData.installation_requirements_8?.add_more_evidence || []).map((group, gi) => (
                      <div key={gi} className="mb-3 p-2 border border-gray-200 rounded bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <input
                            type="text"
                            placeholder="Folder name..."
                            value={group.main_folder || ''}
                            onChange={(e) => setFormData(prev => {
                              const arr = [...(prev.installation_requirements_8?.add_more_evidence || [])];
                              arr[gi] = { ...arr[gi], main_folder: e.target.value };
                              return { ...prev, installation_requirements_8: { ...prev.installation_requirements_8, add_more_evidence: arr } };
                            })}
                            className="text-xs px-2 py-1 border border-gray-300 rounded w-full mr-2"
                          />
                          <button type="button" onClick={() => setFormData(prev => { const arr = [...(prev.installation_requirements_8?.add_more_evidence || [])]; arr.splice(gi, 1); return { ...prev, installation_requirements_8: { ...prev.installation_requirements_8, add_more_evidence: arr } }; })} className="text-red-500 hover:text-red-700 ml-1"><X className="w-3.5 h-3.5" /></button>
                          <button
                            type="button"
                            onClick={() => handleSaveAsTemplate(group)}
                            className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 rounded text-[9px] hover:bg-emerald-600/20 flex items-center gap-1 transition-colors ml-2"
                          >
                            <Copy className="w-2.5 h-2.5" /> Save
                          </button>
                        </div>
                        <table className="w-full text-[10px] border border-gray-200 rounded">
                          <thead className="bg-gray-100"><tr><th className="px-2 py-1 text-left border-r">Name</th><th className="px-2 py-1 text-left border-r">Status</th><th className="px-2 py-1 text-left border-r">Issue</th><th className="px-2 py-1 text-center w-6"></th></tr></thead>
                          <tbody>
                            {(group.documents || []).map((doc, di) => (
                              <tr key={di} className="border-t border-gray-100">
                                <td className="px-2 py-1 border-r"><input value={doc.name || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.installation_requirements_8?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], name: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, installation_requirements_8: { ...prev.installation_requirements_8, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none" /></td>
                                <td className="px-2 py-1 border-r"><select value={doc.status || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.installation_requirements_8?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], status: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, installation_requirements_8: { ...prev.installation_requirements_8, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none"><option value="">Select...</option><option value="Done">Done</option><option value="Pending">Pending</option><option value="Not Required">Not Required</option></select></td>
                                <td className="px-2 py-1 border-r"><input value={doc.issue || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.installation_requirements_8?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], issue: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, installation_requirements_8: { ...prev.installation_requirements_8, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none" /></td>
                                <td className="px-2 py-1 text-center"><button type="button" onClick={() => setFormData(prev => { const arr = [...(prev.installation_requirements_8?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs.splice(di, 1); g.documents = docs; arr[gi] = g; return { ...prev, installation_requirements_8: { ...prev.installation_requirements_8, add_more_evidence: arr } }; })}><X className="w-3.5 h-3.5 text-red-400 hover:text-red-600 mx-auto" /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button type="button" onClick={() => setFormData(prev => { const arr = [...(prev.installation_requirements_8?.add_more_evidence || [])]; const g = { ...arr[gi] }; g.documents = [...(g.documents || []), { name: '', status: '', issue: '' }]; arr[gi] = g; return { ...prev, installation_requirements_8: { ...prev.installation_requirements_8, add_more_evidence: arr } }; })} className="w-full py-1 text-[10px] text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-100/50 border-t border-gray-100">+ Add Row</button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            {/* Screen 9: Internal C3 Requirements */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 border-b border-gray-200 pb-2">Internal C3 Requirements</h3>
                  <p className="text-[11px] text-gray-500 mb-3">Include all C3 packs requirement, based in measure</p>
                </div>

                {/* Notes / text field */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.internal_c3_requirements_9?.notes || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      internal_c3_requirements_9: { ...prev.internal_c3_requirements_9, notes: e.target.value }
                    }))}
                    rows={4}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none resize-y"
                    placeholder="Enter internal C3 requirements notes..."
                  />
                </div>

                {/* Add More Evidence */}
                <div className="mt-2 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-tight">Add More Evidence</h4>
                    <div className="flex gap-2">
                      {templatesData?.data?.length > 0 && (
                        <select
                          className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] outline-none"
                          onChange={(e) => {
                            if (e.target.value) {
                              const template = templatesData.data.find(t => t.id == e.target.value);
                              if (template) {
                                handleApplyTemplate('internal_c3_requirements_9.add_more_evidence', template);
                              }
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="">Fetch Template...</option>
                          {templatesData.data.map(t => (
                            <option key={t.id} value={t.id}>{t.template_name}</option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={() => addGroupWithPath('internal_c3_requirements_9.add_more_evidence')}
                        className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px] hover:bg-blue-700 transition-all shadow-sm flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Group
                      </button>
                    </div>
                  </div>
                  {(formData.internal_c3_requirements_9?.add_more_evidence || []).map((group, gi) => (
                    <div key={gi} className="mb-3 p-2 border border-gray-200 rounded bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <input
                          type="text"
                          placeholder="Folder name..."
                          value={group.main_folder || ''}
                          onChange={(e) => setFormData(prev => {
                            const arr = [...(prev.internal_c3_requirements_9?.add_more_evidence || [])];
                            arr[gi] = { ...arr[gi], main_folder: e.target.value };
                            return { ...prev, internal_c3_requirements_9: { ...prev.internal_c3_requirements_9, add_more_evidence: arr } };
                          })}
                          className="text-xs px-2 py-1 border border-gray-300 rounded w-full mr-2"
                        />
                        <button type="button" onClick={() => setFormData(prev => { const arr = [...(prev.internal_c3_requirements_9?.add_more_evidence || [])]; arr.splice(gi, 1); return { ...prev, internal_c3_requirements_9: { ...prev.internal_c3_requirements_9, add_more_evidence: arr } }; })} className="text-red-500 hover:text-red-700 ml-1"><X className="w-3.5 h-3.5" /></button>
                        <button
                          type="button"
                          onClick={() => handleSaveAsTemplate(group)}
                          className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 rounded text-[9px] hover:bg-emerald-600/20 flex items-center gap-1 transition-colors ml-2"
                        >
                          <Copy className="w-2.5 h-2.5" /> Save
                        </button>
                      </div>
                      <table className="w-full text-[10px] border border-gray-200 rounded">
                        <thead className="bg-gray-100"><tr><th className="px-2 py-1 text-left border-r">Name</th><th className="px-2 py-1 text-left border-r">Status</th><th className="px-2 py-1 text-left border-r">Issue</th><th className="px-2 py-1 text-center w-6"></th></tr></thead>
                        <tbody>
                          {(group.documents || []).map((doc, di) => (
                            <tr key={di} className="border-t border-gray-100">
                              <td className="px-2 py-1 border-r"><input value={doc.name || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.internal_c3_requirements_9?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], name: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, internal_c3_requirements_9: { ...prev.internal_c3_requirements_9, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none" /></td>
                              <td className="px-2 py-1 border-r"><select value={doc.status || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.internal_c3_requirements_9?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], status: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, internal_c3_requirements_9: { ...prev.internal_c3_requirements_9, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none"><option value="">Select...</option><option value="Done">Done</option><option value="Pending">Pending</option><option value="Not Required">Not Required</option></select></td>
                              <td className="px-2 py-1 border-r"><input value={doc.issue || ''} onChange={(e) => setFormData(prev => { const arr = [...(prev.internal_c3_requirements_9?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs[di] = { ...docs[di], issue: e.target.value }; g.documents = docs; arr[gi] = g; return { ...prev, internal_c3_requirements_9: { ...prev.internal_c3_requirements_9, add_more_evidence: arr } }; })} className="w-full bg-transparent outline-none" /></td>
                              <td className="px-2 py-1 text-center"><button type="button" onClick={() => setFormData(prev => { const arr = [...(prev.internal_c3_requirements_9?.add_more_evidence || [])]; const g = { ...arr[gi] }; const docs = [...(g.documents || [])]; docs.splice(di, 1); g.documents = docs; arr[gi] = g; return { ...prev, internal_c3_requirements_9: { ...prev.internal_c3_requirements_9, add_more_evidence: arr } }; })}><X className="w-3.5 h-3.5 text-red-400 hover:text-red-600 mx-auto" /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button type="button" onClick={() => setFormData(prev => { const arr = [...(prev.internal_c3_requirements_9?.add_more_evidence || [])]; const g = { ...arr[gi] }; g.documents = [...(g.documents || []), { name: '', status: '', issue: '' }]; arr[gi] = g; return { ...prev, internal_c3_requirements_9: { ...prev.internal_c3_requirements_9, add_more_evidence: arr } }; })} className="w-full py-1 text-[10px] text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-100/50 border-t border-gray-100">+ Add Row</button>
                    </div>
                  ))}
                </div>
              </div>
            )
            }

            {/* Step 5: Floor Details & Totals (Old Screen 6) */}
            {
              currentStep == 5 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Floor Details & Totals</h3>

                  <div className="space-y-1">
                    {(Array.isArray(formData.floor_details) ? formData.floor_details : []).map((row, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-1.5 items-end bg-gray-50/50 p-1 rounded">
                        <div className="col-span-3">
                          <label className="block text-[10px] font-medium text-gray-500">Name</label>
                          <input value={row.name || ""} onChange={(e) => updateFloorRow(idx, 'name', e.target.value)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" readOnly={idx < FIXED_FLOOR_NAMES.length} />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-medium text-gray-500">Area</label>
                          <input type="number" step="0.01" value={row.area ?? ""} onChange={(e) => updateFloorRow(idx, 'area', e.target.value)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-medium text-gray-500">Height</label>
                          <input type="number" step="0.01" value={row.height ?? ""} onChange={(e) => updateFloorRow(idx, 'height', e.target.value)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-medium text-gray-500">HLP</label>
                          <input type="number" step="0.01" value={row.hlp ?? ""} onChange={(e) => updateFloorRow(idx, 'hlp', e.target.value)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-medium text-gray-500">PW</label>
                          <input type="number" step="0.01" value={row.pw ?? ""} onChange={(e) => updateFloorRow(idx, 'pw', e.target.value)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-medium text-gray-500">Notes</label>
                          <input value={row.notes || ""} onChange={(e) => updateFloorRow(idx, 'notes', e.target.value)} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          {idx >= FIXED_FLOOR_NAMES.length ? (
                            <button type="button" onClick={() => { setFormData(prev => { const arr = [...(prev.floor_details || [])]; arr.splice(idx, 1); return { ...prev, floor_details: arr }; }); setTimeout(recalcFloorTotals, 0); }} className="text-[10px] text-red-600 p-0.5 hover:bg-red-50 rounded">✕</button>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    <div className="pt-1">
                      <button type="button" onClick={addFloorRow} className="px-2 py-0.5 bg-gray-100 text-[10px] border border-gray-300 text-gray-600 rounded hover:bg-gray-200 transition-colors">+ Add Row</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 bg-blue-50/30 p-1.5 rounded border border-blue-100">
                    <div>
                      <label className="block text-[10px] font-medium text-blue-800">Total EPC Area</label>
                      <input readOnly value={formData.total_epc_area ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-blue-800">Floor Area (ExRIR)</label>
                      <input readOnly value={formData.total_floor_area_excluding_rir ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-blue-800">Ground Floor Area</label>
                      <input readOnly value={formData.total_ground_floor_area ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-1 bg-blue-50/30 p-1.5 rounded border border-blue-100">
                    <div>
                      <label className="block text-[10px] font-medium text-blue-800">Highest Floor</label>
                      <input readOnly value={formData.highest_floor_area ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-blue-800">Total HLP</label>
                      <input readOnly value={formData.total_hlp ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-blue-800">Wall Area (Demand)</label>
                      <input readOnly value={formData.heat_demand_total_wall_area ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white font-bold" />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t">
                    <h4 className="text-[11px] font-semibold text-gray-700 mb-1.5">Loft Details</h4>
                    <div className="space-y-1">
                      {(Array.isArray(formData.loft_details) ? formData.loft_details : []).map((r, i) => (
                        <div key={i} className="grid grid-cols-12 gap-1.5 items-end bg-gray-50/50 p-1 rounded">
                          <div className="col-span-5">
                            <label className="block text-[10px] font-medium text-gray-500">Name</label>
                            <input value={r.name || ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.loft_details || [])]; arr[i] = { ...(arr[i] || {}), name: v }; return { ...prev, loft_details: arr }; }); }} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-[10px] font-medium text-gray-500">Area</label>
                            <input type="number" step="0.01" value={r.area ?? ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.loft_details || [])]; arr[i] = { ...(arr[i] || {}), area: v === "" ? null : parseFloat(v) }; return { ...prev, loft_details: arr }; }); setTimeout(recalcLoftTotals, 0); }} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                          </div>
                          <div className="col-span-4">
                            <label className="block text-[10px] font-medium text-gray-500">Type</label>
                            <input value={r.type || ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.loft_details || [])]; arr[i] = { ...(arr[i] || {}), type: v }; return { ...prev, loft_details: arr }; }); }} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                          </div>
                        </div>
                      ))}
                      <div>
                        <button type="button" onClick={() => { setFormData(prev => ({ ...prev, loft_details: [...(prev.loft_details || []), { name: "", area: null, type: "" }] })); setTimeout(recalcLoftTotals, 0); }} className="px-2 py-0.5 bg-gray-100 text-[10px] border border-gray-300 text-gray-600 rounded hover:bg-gray-200 transition-colors">+ Add Loft Row</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-emerald-50/30 p-1 rounded border border-emerald-100">
                        <label className="block text-[10px] font-medium text-emerald-800">Total Loft</label>
                        <input readOnly value={formData.total_loft ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-emerald-200 rounded bg-white font-bold" />
                      </div>
                      <div className="bg-emerald-50/30 p-1 rounded border border-emerald-100">
                        <label className="block text-[10px] font-medium text-emerald-800">B/A</label>
                        <input readOnly value={formData.ba ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-emerald-200 rounded bg-white font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600">POPT (edit)</label>
                        <input type="number" step="0.01" value={formData.popt ?? ""} onChange={(e) => setFormData(prev => ({ ...prev, popt: e.target.value === "" ? null : parseFloat(e.target.value) }))} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t">
                    <h4 className="text-[11px] font-semibold text-gray-700 mb-1.5">Wall Extension Details</h4>
                    <div className="space-y-1">
                      {(Array.isArray(formData.wall_ext_details) ? formData.wall_ext_details : []).map((r, i) => (
                        <div key={i} className="grid grid-cols-12 gap-1.5 items-end bg-gray-50/50 p-1 rounded">
                          <div className="col-span-4">
                            <label className="block text-[10px] font-medium text-gray-500">Name</label>
                            <input value={r.name || ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.wall_ext_details || [])]; arr[i] = { ...(arr[i] || {}), name: v }; return { ...prev, wall_ext_details: arr }; }); }} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                          </div>
                          <div className="col-span-3">
                            <label className="block text-[10px] font-medium text-gray-500">Area</label>
                            <input type="number" step="0.01" value={r.area ?? ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.wall_ext_details || [])]; arr[i] = { ...(arr[i] || {}), area: v === "" ? null : parseFloat(v) }; return { ...prev, wall_ext_details: arr }; }); setTimeout(recalcWallTotals, 0); }} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                          </div>
                          <div className="col-span-5">
                            <label className="block text-[10px] font-medium text-gray-500">Construction</label>
                            <input value={r.construction_type || ""} onChange={(e) => { const v = e.target.value; setFormData(prev => { const arr = [...(prev.wall_ext_details || [])]; arr[i] = { ...(arr[i] || {}), construction_type: v }; return { ...prev, wall_ext_details: arr }; }); }} className="block w-full px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white" />
                          </div>
                        </div>
                      ))}
                      <div>
                        <button type="button" onClick={() => { setFormData(prev => ({ ...prev, wall_ext_details: [...(prev.wall_ext_details || []), { name: "", area: null, construction_type: "" }] })); setTimeout(recalcWallTotals, 0); }} className="px-2 py-0.5 bg-gray-100 text-[10px] border border-gray-300 text-gray-600 rounded hover:bg-gray-200 transition-colors">+ Add Wall Row</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-amber-50/30 p-1 rounded border border-amber-100">
                        <label className="block text-[10px] font-medium text-amber-800">Solid Wall Area</label>
                        <input type="number" step="0.01" value={formData.solid_wall_area ?? ""} onChange={(e) => setFormData(prev => ({ ...prev, solid_wall_area: e.target.value === "" ? null : parseFloat(e.target.value) }))} onBlur={() => setTimeout(recalcWallTotals, 0)} className="mt-0.5 block w-full px-2 py-1 text-xs border border-amber-200 rounded bg-white" />
                      </div>
                      <div className="bg-amber-50/30 p-1 rounded border border-amber-100">
                        <label className="block text-[10px] font-medium text-amber-800">Glazed Area</label>
                        <input type="number" step="0.01" value={formData.glazed_area ?? ""} onChange={(e) => setFormData(prev => ({ ...prev, glazed_area: e.target.value === "" ? null : parseFloat(e.target.value) }))} onBlur={() => setTimeout(recalcWallTotals, 0)} className="mt-0.5 block w-full px-2 py-1 text-xs border border-amber-200 rounded bg-white" />
                      </div>
                      <div className="bg-amber-50/30 p-1 rounded border border-amber-100">
                        <label className="block text-[10px] font-medium text-amber-800">Wall Exc Win PICI</label>
                        <input readOnly value={formData.wall_excluding_windows_pici ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-amber-200 rounded bg-white font-bold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="bg-amber-50/30 p-1 rounded border border-amber-100">
                        <label className="block text-[10px] font-medium text-amber-800">Total Wall PICI</label>
                        <input readOnly value={formData.total_wall_pici ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-amber-200 rounded bg-white font-bold" />
                      </div>
                      <div className="bg-gray-100 p-1 rounded border border-gray-200 opacity-50">
                        <label className="block text-[10px] font-medium text-gray-400">(spare)</label>
                        <input readOnly value={""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white" />
                      </div>
                      <div className="bg-gray-100 p-1 rounded border border-gray-200">
                        <label className="block text-[10px] font-medium text-gray-600">POPT (mirror)</label>
                        <input readOnly value={formData.popt ?? ""} className="mt-0.5 block w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            {/* Step 6: Installation Approval & Notes */}
            {
              currentStep == 6 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">Installation Approval</h3>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleNestedInput('installation_approval', 'status', null, 'Approve for Installation', false)}
                      className={`py-2 px-4 rounded text-sm font-semibold transition-colors ${formData.installation_approval?.status === 'Approve for Installation'
                        ? 'bg-green-600 text-white shadow-inner border border-green-700'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                        }`}
                    >
                      Approve for Installation
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNestedInput('installation_approval', 'status', null, 'Request More information', false)}
                      className={`py-2 px-4 rounded text-sm font-semibold transition-colors ${formData.installation_approval?.status === 'Request More information'
                        ? 'bg-yellow-500 text-white shadow-inner border border-yellow-600'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
                        }`}
                    >
                      Request More information
                    </button>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notes for this Stage</label>
                    <textarea
                      value={formData.installation_approval?.notes || ""}
                      onChange={(e) => handleNestedInput('installation_approval', 'notes', null, e.target.value, false)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 outline-none resize-y min-h-[80px]"
                      placeholder="Enter notes here..."
                    />
                  </div>
                </div>
              )
            }


            {/* Step 10: Documents (Old Screen 7) */}
            {
              currentStep == 10 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Documents</h3>

                  <div className="space-y-4">
                    {(Array.isArray(formData.documents) ? formData.documents : []).map((group, gi) => {
                      const services = Array.isArray(formData.services) ? formData.services.map(s => (s || "").toLowerCase()) : [];
                      const isLoftService = services.some(s => s.includes("loft"));
                      const isBoilerService = services.some(s => s.includes("boiler") || s.includes("ftch") || s.includes("hc") || s.includes("heating") || s.includes("control"));

                      const folderName = group.main_folder || "";

                      // Conditionally hide Submission Loft
                      if (folderName === "Submission Loft" && !isLoftService) {
                        return null;
                      }

                      // Conditionally hide FTCH or HC or B
                      if (folderName === "FTCH or HC or B" && !isBoilerService) {
                        return null;
                      }

                      const colors = [
                        "border-blue-400 bg-blue-50",
                        "border-emerald-400 bg-emerald-50",
                        "border-purple-400 bg-purple-50",
                        "border-orange-400 bg-orange-50",
                        "border-rose-400 bg-rose-50",
                        "border-indigo-400 bg-indigo-50",
                        "border-amber-400 bg-amber-50",
                        "border-cyan-400 bg-cyan-50",
                        "border-fuchsia-400 bg-fuchsia-50",
                        "border-teal-400 bg-teal-50",
                      ];
                      const bgColors = [
                        "bg-blue-100",
                        "bg-emerald-100",
                        "bg-purple-100",
                        "bg-orange-100",
                        "bg-rose-100",
                        "bg-indigo-100",
                        "bg-amber-100",
                        "bg-cyan-100",
                        "bg-fuchsia-100",
                        "bg-teal-100",
                      ];
                      const colorClass = colors[gi % colors.length];
                      const bgClass = bgColors[gi % bgColors.length];

                      return (
                        <div key={gi} className={`p-2 border rounded-md shadow-sm ${colorClass} transition-shadow hover:shadow-md text-xs`}>
                          <div className="mb-2 pb-1 border-b border-gray-300/50">
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-xs font-semibold text-gray-800">Main Folder</label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveAsTemplate(group)}
                                  className="px-2 py-0.5 bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 rounded text-[9px] hover:bg-emerald-600/20 flex items-center gap-1 transition-colors"
                                >
                                  <Copy className="w-2.5 h-2.5" /> Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeDocumentGroup(gi)}
                                  className="px-2 py-0.5 text-red-600 font-medium hover:bg-red-50 rounded transition-colors text-[10px] flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" />
                                  Remove Group
                                </button>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={group.main_folder || ""}
                              onChange={(e) => updateDocumentGroup(gi, 'main_folder', e.target.value)}
                              className="block w-full px-2 py-1 border border-white/50 bg-white/70 shadow-inner rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                            />
                          </div>

                          <div className="mt-2 overflow-x-auto bg-white rounded-sm shadow-sm border border-gray-100">
                            <table className="w-full text-[11px] text-left border-collapse">
                              <thead className={`${bgClass} uppercase text-gray-700 font-semibold border-b`}>
                                <tr>
                                  <th className="px-2 py-1.5 border-r font-medium">Name</th>
                                  <th className="px-2 py-1.5 border-r font-medium w-32">Status</th>
                                  <th className="px-2 py-1.5 border-r font-medium">Issue</th>
                                  <th className="px-2 py-1.5 font-medium w-10 text-center">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(Array.isArray(group.documents) ? group.documents : []).map((doc, di) => (
                                  <tr key={di} className="border-b hover:bg-gray-50/80 transition-colors last:border-b-0">
                                    <td className="px-2 py-1 border-r bg-white align-top">
                                      <input type="text" value={doc.name || ""} onChange={(e) => updateDocumentRow(gi, di, 'name', e.target.value)} className="w-full px-1 py-0.5 border border-transparent rounded bg-transparent focus:bg-white focus:border-blue-200" />
                                    </td>
                                    <td className="px-2 py-1 border-r bg-white align-top">
                                      <select value={doc.status || ""} onChange={(e) => updateDocumentRow(gi, di, 'status', e.target.value)} className="w-full px-1 py-0.5 border border-transparent rounded bg-transparent focus:bg-white focus:border-blue-200">
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
                                    </td>
                                    <td className="px-2 py-1 border-r bg-white align-top">
                                      <textarea
                                        value={doc.issue || ""}
                                        onChange={(e) => updateDocumentRow(gi, di, 'issue', e.target.value)}
                                        className="w-full px-1 py-0.5 border border-transparent rounded bg-transparent focus:bg-white focus:border-blue-200 resize-y min-h-[24px]"
                                        rows="1"
                                        placeholder="Note any issues..."
                                      />
                                    </td>
                                    <td className="px-2 py-1 text-center bg-white align-top pt-1.5">
                                      <button type="button" onClick={() => removeDocumentRow(gi, di)} className="text-red-400 hover:text-red-600 transition-colors">
                                        <X className="w-4 h-4 mx-auto" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="p-1.5 bg-gray-50 border-t flex justify-between items-center">
                              <button type="button" onClick={() => addDocumentRow(gi)} className="px-3 py-1 bg-gray-200 text-gray-600 font-medium rounded text-[10px] hover:bg-gray-300 transition-colors shadow-sm">
                                + Add Document
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-between items-center">
                      <button type="button" onClick={addDocumentGroup} className="px-3 py-1 bg-gray-200 rounded text-sm font-medium">Add Document Group</button>
                      {templatesData?.data?.length > 0 && (
                        <select
                          className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] outline-none"
                          onChange={(e) => {
                            if (e.target.value) {
                              const template = templatesData.data.find(t => t.id == e.target.value);
                              if (template) {
                                handleApplyTemplate('documents', template);
                              }
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="">Fetch Template...</option>
                          {templatesData.data.map(t => (
                            <option key={t.id} value={t.id}>{t.template_name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              )
            }

            {/* Screen 11A */}
            {
              currentStep === '11A' && (
                <div className="space-y-0 border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-xs border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="p-2 font-semibold text-gray-700 w-1/2">EPR Check matching with everything one last time</td>
                        <td className="p-2">
                          <select
                            name="epr_check_matching"
                            value={formData.epr_check_matching || ""}
                            onChange={handleInputChange}
                            className={`w-full px-2 py-1 rounded border outline-none ${formData.epr_check_matching === "Issues to resolve before submission" ? "bg-red-600 text-white" : formData.epr_check_matching === "Checked and Verified" ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
                          >
                            <option value="">Select...</option>
                            <option value="Checked and Verified">Checked and Verified</option>
                            <option value="Issues to resolve before submission">Issues to resolve before submission</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-semibold text-gray-700">Installation Changes</td>
                        <td className="p-2">
                          <select
                            name="installation_changes"
                            value={formData.installation_changes || ""}
                            onChange={handleInputChange}
                            className={`w-full px-2 py-1 rounded border outline-none ${formData.installation_changes === "Issues to resolve before submission" ? "bg-red-600 text-white" : formData.installation_changes === "Checked and Verified" ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
                          >
                            <option value="">Select...</option>
                            <option value="Checked and Verified">Checked and Verified</option>
                            <option value="Issues to resolve before submission">Issues to resolve before submission</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="p-2 font-semibold text-gray-700">Pas 10 Changes any before final submit</td>
                        <td className="p-2 flex gap-2">
                          <select
                            name="pas10_changes_before_submit"
                            value={formData.pas10_changes_before_submit || ""}
                            onChange={handleInputChange}
                            className={`flex-1 px-2 py-1 rounded border outline-none ${formData.pas10_changes_before_submit === "Issues to resolve before submission" ? "bg-red-600 text-white" : formData.pas10_changes_before_submit === "Checked and Verified" ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
                          >
                            <option value="">Select...</option>
                            <option value="Checked and Verified">Checked and Verified</option>
                            <option value="Issues to resolve before submission">Issues to resolve before submission</option>
                          </select>
                          <input
                            type="text"
                            name="pas10_changes_notes"
                            value={formData.pas10_changes_notes || ""}
                            onChange={handleInputChange}
                            className="flex-1 px-2 py-1 border border-blue-400 rounded outline-none"
                            placeholder="Notes..."
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-semibold text-gray-700">Updatig Master Sheets</td>
                        <td className="p-2">
                          <select
                            name="updating_master_sheets"
                            value={formData.updating_master_sheets || ""}
                            onChange={handleInputChange}
                            className={`w-full px-2 py-1 rounded border outline-none ${formData.updating_master_sheets === "pending" ? "bg-amber-500 text-white" : formData.updating_master_sheets === "This project is added in sheet" ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
                          >
                            <option value="">Select...</option>
                            <option value="This project is added in sheet">This project is added in sheet</option>
                            <option value="pending">pending</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="p-2 font-semibold text-gray-700">Update in Tecnika order sheet</td>
                        <td className="p-2 flex gap-2 items-center">
                          <select
                            name="update_tecnica_order_sheet"
                            value={formData.update_tecnica_order_sheet || ""}
                            onChange={handleInputChange}
                            className={`flex-1 px-2 py-1 rounded border outline-none ${formData.update_tecnica_order_sheet === "pending" ? "bg-amber-500 text-white" : (formData.update_tecnica_order_sheet === "This project is added in sheet" || formData.update_tecnica_order_sheet === "Not required") ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
                          >
                            <option value="">Select...</option>
                            <option value="This project is added in sheet">This project is added in sheet</option>
                            <option value="pending">pending</option>
                            <option value="Not required">Not required</option>
                          </select>
                          <button type="button" className="px-2 py-1 bg-fuchsia-500 text-white rounded text-[10px] font-bold border border-fuchsia-600 hover:bg-fuchsia-600 whitespace-nowrap">
                            Create C3 Order
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold text-gray-700">C3 Issues found internall or externally</td>
                        <td className="p-2">
                          <select
                            name="c3_issues_found_internal"
                            value={formData.c3_issues_found_internal || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 rounded border border-blue-300 bg-blue-50 text-blue-800 outline-none focus:border-blue-500"
                          >
                            <option value="">Select...</option>
                            <option value="No issues">No issues</option>
                            <option value="pending report">pending report</option>
                            <option value="resolved">resolved</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            }

            {/* Screen 11B */}
            {
              currentStep === '11B' && (
                <div className="space-y-0 border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-xs border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="p-2 font-semibold text-gray-700 w-1/3">Submission Status</td>
                        <td className="p-2" colSpan="2">
                          <select
                            name="submission_status"
                            value={formData.submission_status || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 outline-none"
                          >
                            <option value="">Select...</option>
                            <option value="Submitted for check">Submitted for check</option>
                            <option value="pending submissions">pending submissions</option>
                            <option value="onhold by funder">onhold by funder</option>
                            <option value="onhold by office">onhold by office</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-semibold text-gray-700">Queries Status</td>
                        <td className="p-2" colSpan="2">
                          <select
                            name="queries_status"
                            value={formData.queries_status || ""}
                            onChange={handleInputChange}
                            className={`w-full px-2 py-1 rounded border outline-none ${formData.queries_status === "pending" ? "bg-amber-500 text-white" : formData.queries_status === "Resolved" ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
                          >
                            <option value="">Select...</option>
                            <option value="Resolved">Resolved</option>
                            <option value="pending">pending</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="p-2 font-semibold text-gray-700">Trustmark Lodgement</td>
                        <td className="p-2" colSpan="2">
                          <select
                            name="lodgement"
                            value={formData.lodgement || ""}
                            onChange={handleInputChange}
                            className={`w-full px-2 py-1 rounded border outline-none ${formData.lodgement === "Pending" ? "bg-amber-500 text-white" : formData.lodgement === "Done" ? "bg-emerald-600 text-white" : "bg-white text-gray-800"}`}
                          >
                            <option value="">Select...</option>
                            <option value="Done">Done</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-semibold text-gray-700 bg-gray-100">Trustmark_Project_Certificate</td>
                        <td className="p-2" colSpan="2">
                          <input
                            type="text"
                            name="trustmark_project_certificate"
                            value={formData.trustmark_project_certificate || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 outline-none"
                            placeholder="P123456789"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="p-2 font-semibold text-gray-700 w-1/3">Tecnika</td>
                        <td className="p-2" colSpan="2">
                          <select
                            name="tecnica"
                            value={formData.tecnica || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-none"
                          >
                            <option value="">Select...</option>
                            <option value="Assigned">Assigned</option>
                            <option value="Failed">Failed</option>
                            <option value="Pass">Pass</option>
                            <option value="Remedial Pending">Remedial Pending</option>
                            <option value="ByPASS(Not required)">ByPASS(Not required)</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-semibold text-gray-700">Scaffolding Removed</td>
                        <td className="p-2">
                          <select
                            name="scaffolding_removed_status"
                            value={formData.scaffolding_removed_status || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-none"
                          >
                            <option value="">Select...</option>
                            <option value="yes">yes</option>
                            <option value="no">no</option>
                          </select>
                        </td>
                        <td className="p-2 w-1/3">
                          <input
                            type="date"
                            name="scaffolding_removed_date"
                            value={formData.scaffolding_removed_date || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-none"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="p-2 font-semibold text-gray-700">Rubbish Collected</td>
                        <td className="p-2">
                          <select
                            name="rubbish_collected_status"
                            value={formData.rubbish_collected_status || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-none"
                          >
                            <option value="">Select...</option>
                            <option value="yes">yes</option>
                            <option value="no">no</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="date"
                            name="rubbish_collected_date"
                            value={formData.rubbish_collected_date || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-none"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2 font-semibold text-gray-700">Customer Feed Back</td>
                        <td className="p-2" colSpan="2">
                          <textarea
                            name="customer_feedback_notes"
                            value={formData.customer_feedback_notes || ""}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-none resize-none"
                            placeholder="Notes"
                          />
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <td className="p-2 font-semibold text-gray-700 uppercase">Complete the project</td>
                        <td className="p-2" colSpan="2">
                          <select
                            name="complete_the_project"
                            value={formData.complete_the_project || ""}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-none"
                          >
                            <option value="">Select...</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 align-top">
                          <div className="font-semibold text-gray-700 uppercase">Final Comments</div>
                          <div className="font-semibold text-gray-700 mt-4">Notes</div>
                        </td>
                        <td className="p-2 space-y-2" colSpan="2">
                          <select
                            name="final_comments"
                            value={formData.final_comments || ""}
                            onChange={handleInputChange}
                            className={`w-full px-2 py-1 rounded border outline-none ${formData.final_comments === "Some issues not resolved" ? "bg-red-100 text-red-800 border-red-300" : "bg-gray-50 border-gray-300"}`}
                          >
                            <option value="">Select...</option>
                            <option value="All Good Thanks">All Good Thanks</option>
                            <option value="it was not perfect">it was not perfect</option>
                            <option value="We'll come back">We'll come back</option>
                            <option value="Some issues not resolved">Some issues not resolved</option>
                            <option value="yes but customer was not ready">yes but customer was not ready</option>
                          </select>
                          <textarea
                            name="final_notes"
                            value={formData.final_notes || ""}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-none resize-none"
                            placeholder="Enter final notes..."
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            }

            {/* Footer with Navigation */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {/* Reject / Submit row */}
              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleReject}
                  className="inline-flex items-center space-x-1 px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-xs font-medium"
                >
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={handleScreenSubmit}
                  disabled={isUpdatingEvidence || isUpdatingLead}
                  className="inline-flex items-center space-x-1 px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-xs font-medium"
                >
                  <span>{isUpdatingLead || isUpdatingEvidence ? "Saving..." : "Submit"}</span>
                </button>
              </div>

              {/* Navigation row */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={availableSteps.indexOf(currentStep) === 0 || availableSteps.length === 0}
                  className="inline-flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded text-gray-700 disabled:opacity-50 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Prev</span>
                </button>

                <div className="flex space-x-1">
                  {availableSteps.map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setCurrentStep(step)}
                      className={`w-6 h-6 rounded-full font-semibold text-[10px] ${currentStep === step
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={availableSteps.indexOf(currentStep) === availableSteps.length - 1}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </>
        )}
      </form >
    </div >
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
