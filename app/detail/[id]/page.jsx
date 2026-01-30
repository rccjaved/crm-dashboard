"use client";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import {
  AudioWaveform,
  AudioWaveformIcon,
  Download,
  ListChecks,
  Save,
  Eye,
  LoaderIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setProjectStages,
  setStageLoading,
  setStageError,
  setProjectNotes,
  setNotesLoading,
  setNotesError,
  addProjectNote,
  setRequestUpdateLoading,
  setRequestUpdateError,
  addStageEntry,
  updateStageEntry,
  setStageEntriesData,
  setStageEntriesLoading,
  setStageEntriesError,
  updateEntryStatus,
  clearStageEntries
} from "../../../lib/store/slices/projectSlice";
import axiosClient from "@/lib/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const projectId = params.id;

  // Redux state
  const {
    projectStages,
    stageLoading,
    stageError,
    projectNotes,
    notesLoading,
    notesError,
    requestUpdateLoading,
    requestUpdateError,
    stageEntriesData,
    stageEntriesLoading,
    stageEntriesError
  } = useSelector((state) => state.projects);


  // Local states
  const [textAreaValues, setTextAreaValues] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isViewNotesModalOpen, setIsViewNotesModalOpen] = useState(false);
  const [editTextValue, setEditTextValue] = useState("");
  const [editNoteValue, setEditNoteValue] = useState("");
  const [activeStage, setActiveStage] = useState(1);
  const [editingStageId, setEditingStageId] = useState(null);
  const [lastEntryIds, setLastEntryIds] = useState({});

  // Fetch project stages from API
  useEffect(() => {
    const fetchProjectStages = async () => {
      try {
        dispatch(setStageLoading(true));
        const response = await axiosClient.get(`/projects/${projectId}/stages`);

        if (response.data && response.data.stages) {
          dispatch(setProjectStages(response.data));

          // Initialize textarea values from stage entries
          const initialValues = {};
          const entryIds = {};

          response.data.stages.forEach(stage => {
            if (stage.stage_entries && stage.stage_entries.length > 0) {
              // Get the latest approved entry or admin entry for textarea
              // Admin entries are those that are approved (approved: 1) or created by admin
              const approvedOrAdminEntry = stage.stage_entries
                .filter(entry => {
                  // Get approved entries (approved: 1) or entries that might be admin entries
                  return entry.approved === 1 || entry.approved === true;
                })
                .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];
              
              if (approvedOrAdminEntry) {
                initialValues[stage.stage_id] = approvedOrAdminEntry.content || '';
                entryIds[stage.stage_id] = approvedOrAdminEntry.id;
              } else {
                initialValues[stage.stage_id] = '';
                entryIds[stage.stage_id] = null;
              }
            } else {
              initialValues[stage.stage_id] = '';
              entryIds[stage.stage_id] = null;
            }
          });

          setTextAreaValues(initialValues);
          setLastEntryIds(entryIds);

          toast.success("Project stages loaded successfully!");
        } else {
          toast.warn("No stages data found");
        }
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch project stages";
        dispatch(setStageError(errorMsg));
        toast.error(errorMsg);
      } finally {
        dispatch(setStageLoading(false));
      }
    };

    if (projectId) {
      fetchProjectStages();
    }
  }, [dispatch, projectId]);

  // Fetch project notes on page load
  useEffect(() => {
    const fetchNotesOnLoad = async () => {
      if (projectId) {
        try {
          dispatch(setNotesLoading(true));
          const response = await axiosClient.get(`/projects/${projectId}/notes`);

          if (response.data) {
            dispatch(setProjectNotes(response.data));
          }
        } catch (error) {
          // Silently fail - notes will be fetched when user clicks "View Notes"
          console.error("Failed to fetch notes on load:", error);
        } finally {
          dispatch(setNotesLoading(false));
        }
      }
    };

    fetchNotesOnLoad();
  }, [dispatch, projectId]);

  // Handle textarea change
  const handleTextareaChange = (stageId, value) => {
    setTextAreaValues(prev => ({
      ...prev,
      [stageId]: value
    }));
  };

  // Check if stage has entries
  const hasEntries = (stageId) => {
    const stage = projectStages.find(s => s.stage_id === stageId);
    return stage && stage.stage_entries && stage.stage_entries.length > 0;
  };

  // Get last entry ID for a stage
  const getLastEntryId = (stageId) => {
    return lastEntryIds[stageId] || null;
  };

  // API: Save or update stage content
  const saveOrUpdateStageContent = async (stageId, content) => {
    try {
      const stage = projectStages.find(s => s.stage_id === stageId);
      if (!stage) {
        toast.error("Stage not found");
        return;
      }

      const hasEntry = hasEntries(stageId);
      const entryId = getLastEntryId(stageId);

      if (hasEntry && entryId) {
        // UPDATE - PUT API
        const response = await axiosClient.put(
          `/projects/${projectId}/stages/${stageId}/entries/${entryId}`,
          { content: content }
        );

        if (response.data) {
          // Update Redux state
          dispatch(updateStageEntry({
            stageId,
            entryId,
            content
          }));

          toast.success("Stage content updated successfully!");
        }
      } else {
        // CREATE - POST API
        const response = await axiosClient.post(
          `/projects/${projectId}/stages/${stageId}/entries`,
          {
            content: content
          }
        );

        if (response.data) {
          // Add to Redux state
          dispatch(addStageEntry({
            stageId,
            entry: response.data
          }));

          // Store the new entry ID
          setLastEntryIds(prev => ({ ...prev, [stageId]: response.data.id }));

          toast.success("Stage content saved successfully!");
        }
      }

    } catch (error) {
      console.error("API Error Details:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to save/update content";
      toast.error(errorMsg);
    }
  };

  // API: Request Update
  const handleRequestUpdate = async (stageId) => {
    try {
      dispatch(setRequestUpdateLoading(true));

      const response = await axiosClient.post(
        `/project/${projectId}/stage/${stageId}/request-update`,
        {
          user_id: 2 // Replace with actual user ID from auth
        }
      );

      if (response.data) {
        toast.success("Update request sent successfully!");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to send update request";
      dispatch(setRequestUpdateError(errorMsg));
      toast.error(errorMsg);
    } finally {
      dispatch(setRequestUpdateLoading(false));
    }
  };

  // API: Add Note
  const handleAddNote = async () => {
    if (!editNoteValue.trim()) {
      toast.warning("Please enter a note before saving");
      return;
    }

    try {
      dispatch(setNotesLoading(true));

      const response = await axiosClient.post(
        `/projects/${projectId}/notes`,
        {
          meta: {
            notes: editNoteValue
          }
        }
      );

      if (response.data) {
        // Refetch all notes to ensure state is in sync with server
        const notesResponse = await axiosClient.get(`/projects/${projectId}/notes`);
        if (notesResponse.data) {
          dispatch(setProjectNotes(notesResponse.data));
        } else {
          // Fallback: Add to Redux state if refetch fails
          dispatch(addProjectNote(response.data));
        }

        toast.success("Note added successfully!");
        setEditNoteValue("");
        setIsNoteModalOpen(false);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to add note";
      dispatch(setNotesError(errorMsg));
      toast.error(errorMsg);
    } finally {
      dispatch(setNotesLoading(false));
    }
  };

  // API: Fetch Notes
  const fetchProjectNotes = async () => {
    try {
      dispatch(setNotesLoading(true));

      const response = await axiosClient.get(`/projects/${projectId}/notes`);

      if (response.data) {
        dispatch(setProjectNotes(response.data));
        setIsViewNotesModalOpen(true);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch notes";
      dispatch(setNotesError(errorMsg));
      toast.error(errorMsg);
    } finally {
      dispatch(setNotesLoading(false));
    }
  };

  // Handle save/update button click
  const handleSaveOrUpdate = (stageId) => {
    const content = textAreaValues[stageId] || '';
    if (content.trim()) {
      saveOrUpdateStageContent(stageId, content);
    } else {
      toast.warning("Please enter some content before saving");
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };


  // Fetch stage entries for approve modal
  const fetchStageEntries = async () => {
    try {
      dispatch(setStageEntriesLoading(true));
      dispatch(setStageEntriesError(null));
      const response = await axiosClient.get(`/projects/${projectId}/stage-entries`);

      if (response.data && response.data.stages) {
        dispatch(setStageEntriesData(response.data));
        
        // Set active stage to first stage with entries if available
        const firstStageWithEntries = response.data.stages.find(stage => 
          stage.entries && stage.entries.length > 0
        );
        if (firstStageWithEntries) {
          setActiveStage(firstStageWithEntries.stage_id);
        }
      } else {
        toast.warn("No stage entries data found");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch stage entries";
      dispatch(setStageEntriesError(errorMsg));
      toast.error(errorMsg);
    } finally {
      dispatch(setStageEntriesLoading(false));
    }
  };

  const handleApproved = () => {
    setIsApproveModalOpen(true);
    fetchStageEntries();
  };

  const handleNote = () => {
    setIsNoteModalOpen(true);
  };

  const handleViewNotes = () => {
    fetchProjectNotes();
  };

  const handleUpdate = () => {
    if (editingStageId) {
      setTextAreaValues(prev => ({
        ...prev,
        [editingStageId]: editTextValue
      }));
      saveOrUpdateStageContent(editingStageId, editTextValue);
    }
    setIsEditModalOpen(false);
    setEditingStageId(null);
  };

  const handleUpdateNote = () => {
    handleAddNote();
  };

  const handleCloseModalNote = () => {
    setIsEditModalOpen(false);
    setEditingStageId(null);
  };

  const handleCloseApproveModal = () => {
    setIsApproveModalOpen(false);
    dispatch(clearStageEntries());
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setEditNoteValue("");
  };

  const handleCloseViewNotesModal = () => {
    setIsViewNotesModalOpen(false);
  };

  // Handle approve item
  const handleApproveItem = async (entryId) => {
    try {
      // Find the entry to get stage_id from stageEntriesData
      let targetStage = null;
      let targetEntry = null;
      
      if (stageEntriesData && stageEntriesData.stages) {
        for (const stage of stageEntriesData.stages) {
          const entry = stage.entries?.find(e => e.id === entryId);
          if (entry) {
            targetStage = stage;
            targetEntry = entry;
            break;
          }
        }
      }

      if (!targetStage || !targetEntry) {
        toast.error("Entry not found");
        return;
      }

      // Call API to approve the entry
      // Endpoint: /projects/{projectId}/stages/{stageId}/entries/{entryId}/approve
      const response = await axiosClient.post(
        `/projects/${projectId}/stages/${targetStage.stage_id}/entries/${entryId}/approve`
      );

      if (response.data) {
        // Update entry status in Redux immediately (1 = approved)
        dispatch(updateEntryStatus({
          stageId: targetStage.stage_id,
          entryId: entryId,
          isApproved: 1
        }));

        // Get existing admin text for this stage
        const existingAdminText = textAreaValues[targetStage.stage_id] || '';
        const approvedText = targetEntry.content || '';
        
        // Concatenate approved text with existing admin text
        const newContent = existingAdminText 
          ? `${existingAdminText}\n\n${approvedText}`
          : approvedText;

        // Update the stage content with concatenated text
        await saveOrUpdateStageContent(targetStage.stage_id, newContent);

        // Update textAreaValues immediately
        setTextAreaValues(prev => ({
          ...prev,
          [targetStage.stage_id]: newContent
        }));

        toast.success("Entry approved and added to stage content!");
      }
    } catch (error) {
      console.error("Approve error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to approve entry";
      toast.error(errorMsg);
    }
  };

  // Handle reject item
  const handleRejectItem = async (entryId) => {
    try {
      // Find the entry to get stage_id from stageEntriesData
      let targetStage = null;
      
      if (stageEntriesData && stageEntriesData.stages) {
        for (const stage of stageEntriesData.stages) {
          const entry = stage.entries?.find(e => e.id === entryId);
          if (entry) {
            targetStage = stage;
            break;
          }
        }
      }

      if (!targetStage) {
        toast.error("Entry not found");
        return;
      }

      // Call API to reject the entry
      // Endpoint: /projects/{projectId}/stages/{stageId}/entries/{entryId}/reject
      const response = await axiosClient.post(
        `/projects/${projectId}/stages/${targetStage.stage_id}/entries/${entryId}/reject`
      );

      if (response.data) {
        // Update entry status in Redux immediately (2 = rejected)
        dispatch(updateEntryStatus({
          stageId: targetStage.stage_id,
          entryId: entryId,
          isApproved: 2
        }));

        toast.success("Entry rejected!");
      }
    } catch (error) {
      console.error("Reject error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to reject entry";
      toast.error(errorMsg);
    }
  };

  // Function to get stage entries for table - using new API structure
  const getStageEntriesForTable = (stage) => {
    if (!stage || !stage.entries || stage.entries.length === 0) return [];

    return stage.entries.map((entry, index) => ({
      id: entry.id || index,
      stage: stage.stage_id,
      name: entry.user_name || `User ${entry.user_id}`,
      text: entry.content,
      status: entry.is_approved === 1 ? "Approved" : entry.is_approved === 2 ? "Rejected" : "Pending",
      is_approved: entry.is_approved,
      user_id: entry.user_id,
      approved_by: entry.approved_by,
      created_at: entry.created_at
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (stageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading stages...</div>
        </div>
      </Layout>
    );
  }

  if (stageError) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {stageError}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Project Details - {projectId}
            </h1>
            <p className="text-gray-600">Home &gt; Projects &gt; Detail</p>
          </div>
          <button
            onClick={handleNote}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Add Note
          </button>
        </div>
      </div>

      <div className="my-3">
        <button
          onClick={handleViewNotes}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mx-3"
        >
          View Note
        </button>
      </div>

      {/* Dynamic Stages Grid */}
      <div className="grid grid-cols-12 gap-4">
        {projectStages.map((stage) => {
          const hasEntry = hasEntries(stage.stage_id);

          return (
            <div key={stage.project_stage_id} className="col-span-12 md:col-span-4">
              <div className="bg-white h-full rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {stage.stage_name}
                </h2>
                <p className="text-[13px] text-gray-600 mb-2 whitespace-pre-line">
                  {stage.stage_title}
                </p>

                {/* Editable textarea */}
                <textarea
                  value={textAreaValues[stage.stage_id] || ''}
                  onChange={(e) => handleTextareaChange(stage.stage_id, e.target.value)}
                  placeholder="Type your content here..."
                  className="w-full min-h-[280px] p-3 border text-[10px] border-gray-300 rounded-lg resize-none outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                {/* Status Badge */}
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                    stage.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {stage.status?.charAt(0).toUpperCase() + stage.status?.slice(1) || 'Pending'}
                  </span>
                
                </div>

                {/* Buttons Container */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setActiveStage(stage.stage_id);
                      handleApproved();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Activity"
                   
                  >
                    <ListChecks />
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    title="Approved"
                  >
                    <AudioWaveformIcon />
                  </button>
                  <button
                    onClick={() => handleRequestUpdate(stage.stage_id)}
                    disabled={requestUpdateLoading}
                    className={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors ${requestUpdateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Request Update"
                  >
                    {requestUpdateLoading ? (
                      <span className="text-xs"><LoaderIcon /> </span>
                    ) : (
                      <AudioWaveform />
                    )}
                  </button>

                  {/* Conditional Save/Update Button */}
                  {hasEntry ? (
                    <button
                      onClick={() => handleSaveOrUpdate(stage.stage_id)}
                      className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                      title="Update"
                    >
                      <Save />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveOrUpdate(stage.stage_id)}
                      className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                      title="Save"
                    >
                      <Download />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Add Note</h3>
            </div>
            <div className="p-6">
              <textarea
                value={editNoteValue}
                onChange={(e) => setEditNoteValue(e.target.value)}
                placeholder="Add your note here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none outline-none shadow-none"
                disabled={notesLoading}
              />
              {notesError && (
                <p className="text-red-500 text-sm mt-2">{notesError}</p>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCloseNoteModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                disabled={notesLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNote}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                disabled={notesLoading}
              >
                {notesLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Notes Modal */}
      {isViewNotesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Project Notes</h3>
                <button
                  onClick={handleCloseViewNotesModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {notesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-lg">Loading notes...</div>
                </div>
              ) : notesError ? (
                <div className="text-red-500 text-center py-8">{notesError}</div>
              ) : (
                <div className="space-y-4">
                  {/* Check if projectNotes is an array */}
                  {Array.isArray(projectNotes) && projectNotes.length > 0 ? (
                    projectNotes.map((note, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-gray-800">
                            {note.user_name || `User ${note.user_id}` || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(note.created_at || note.date || note.updated_at)}
                          </div>
                        </div>
                        <div className="text-gray-700 whitespace-pre-line">
                          {note.meta?.notes || note.content || note.note || 'No content'}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Check if projectNotes is an object with data property
                    projectNotes?.data && Array.isArray(projectNotes.data) ? (
                      projectNotes.data.map((note, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-800">
                              {note.user_name || `User ${note.user_id}` || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(note.created_at || note.date || note.updated_at)}
                            </div>
                          </div>
                          <div className="text-gray-700 whitespace-pre-line">
                            {note.meta?.notes || note.content || note.note || 'No content'}
                          </div>
                        </div>
                      ))
                    ) : (
                      // Check if projectNotes is an object with notes property
                      projectNotes?.notes && Array.isArray(projectNotes.notes) ? (
                        projectNotes.notes.map((note, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-gray-800">
                                {note.user_name || `User ${note.user_id}` || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(note.created_at || note.date || note.updated_at)}
                              </div>
                            </div>
                            <div className="text-gray-700 whitespace-pre-line">
                              {note.meta?.notes || note.content || note.note || 'No content'}
                            </div>
                          </div>
                        ))
                      ) : (
                        // Fallback if no notes found
                        <div className="text-gray-500 text-center py-8">
                          {projectNotes ? 'No notes found or invalid data format' : 'No notes available'}
                        </div>
                      )
                    )
                  )}
                </div>
              )}
            </div>

         
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleCloseApproveModal}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-5xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {stageEntriesData?.project_name || `Project ${projectId}`} - Stage Entries
                  </h3>
                  <button
                    onClick={handleCloseApproveModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Dynamic Tabs based on stages with entries from API */}
                {stageEntriesLoading ? (
                  <div className="flex justify-center items-center mt-4 py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : stageEntriesError ? (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {stageEntriesError}
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {stageEntriesData?.stages
                      ?.filter(stage => stage.entries && stage.entries.length > 0)
                      .map((stage) => (
                        <button
                          key={stage.stage_id}
                          onClick={() => setActiveStage(stage.stage_id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeStage === stage.stage_id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {stage.stage_name}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-auto p-6">
                {stageEntriesLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-lg">Loading stage entries...</div>
                  </div>
                ) : stageEntriesError ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-red-500">{stageEntriesError}</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Name
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Text
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getStageEntriesForTable(
                          stageEntriesData?.stages?.find(stage => stage.stage_id === activeStage) || {}
                        ).length > 0 ? (
                          getStageEntriesForTable(
                            stageEntriesData?.stages?.find(stage => stage.stage_id === activeStage) || {}
                          ).map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                                {item.name}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                                {item.text}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {item.status === "Approved" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Approved
                                  </span>
                                ) : item.status === "Rejected" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Rejected
                                  </span>
                                ) : (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleApproveItem(item.id)}
                                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectItem(item.id)}
                                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                              No entries found for this stage
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleCloseApproveModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" />
    </Layout>
  );
}