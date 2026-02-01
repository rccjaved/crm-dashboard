import { apiSlice } from "@/lib/store/slices/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => "/projects",
      providesTags: ["Project"],
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...projectData }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: projectData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Project", id }],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const inspectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInspections: builder.query({
      query: () => "/inspections",
      providesTags: ["Inspection"],
    }),
    getInspectionById: builder.query({
      query: (id) => `/inspections/${id}`,
      providesTags: (result, error, id) => [{ type: "Inspection", id }],
    }),
    createInspection: builder.mutation({
      query: (inspectionData) => ({
        url: "/inspections",
        method: "POST",
        body: inspectionData,
      }),
      invalidatesTags: ["Inspection"],
    }),
    updateInspection: builder.mutation({
      query: ({ id, ...inspectionData }) => ({
        url: `/inspections/${id}`,
        method: "PUT",
        body: inspectionData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Inspection", id }],
    }),
  }),
});

export const trustmarksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrustmarks: builder.query({
      query: () => "/trustmarks",
      providesTags: ["Trustmark"],
    }),
    getTrustmarkById: builder.query({
      query: (id) => `/trustmarks/${id}`,
      providesTags: (result, error, id) => [{ type: "Trustmark", id }],
    }),
    createTrustmark: builder.mutation({
      query: (trustmarkData) => ({
        url: "/trustmarks",
        method: "POST",
        body: trustmarkData,
      }),
      invalidatesTags: ["Trustmark"],
    }),
  }),
});

export const complaintsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComplaints: builder.query({
      query: () => "/complaints",
      providesTags: ["Complaint"],
    }),
    getComplaintById: builder.query({
      query: (id) => `/complaints/${id}`,
      providesTags: (result, error, id) => [{ type: "Complaint", id }],
    }),
    createComplaint: builder.mutation({
      query: (complaintData) => ({
        url: "/complaints",
        method: "POST",
        body: complaintData,
      }),
      invalidatesTags: ["Complaint"],
    }),
  }),
});

export const customerRecordsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerRecords: builder.query({
      query: (params) => ({
        url: "/get/customer-record",
        params,
      }),
      providesTags: ["CustomerRecord"],
    }),
    getCustomerRecordById: builder.query({
      query: (id) => `/customer-record/${id}`,
      providesTags: (result, error, id) => [{ type: "CustomerRecord", id }],
    }),
    createCustomerRecord: builder.mutation({
      query: (recordData) => ({
        url: "/customer-record/store",
        method: "POST",
        body: recordData,
      }),
      invalidatesTags: ["CustomerRecord"],
    }),
    updateCustomerRecord: builder.mutation({
      query: (recordData) => ({
        url: `/update-customer-record`,
        method: "POST",
        body: recordData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "CustomerRecord", id: arg.id }],
    }),
    // deleteCustomerRecord: builder.mutation({
    //   query: (id) => ({
    //     url: `/customer-record/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["CustomerRecord"],
    // }),
  }),
});

export const leadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query({
      query: (params) => ({
        url: "/leads",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((lead) => ({ type: "Lead", id: lead.id })),
              { type: "Lead", id: "LIST" },
            ]
          : [{ type: "Lead", id: "LIST" }],
    }),
    getLeadById: builder.query({
      query: (id) => `/leads/${id}`,
      providesTags: (result, error, id) => [{ type: "Lead", id }],
    }),
    createLead: builder.mutation({
      query: (leadData) => ({
        url: "/leads/store",
        method: "POST",
        body: leadData,
      }),
      invalidatesTags: [{ type: "Lead", id: "LIST" }],
    }),
    updateLead: builder.mutation({
      query: ({ id, ...leadData }) => ({
        url: `/leads/${id}/update`,
        method: "POST",
        body: leadData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Lead", id }],
    }),
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Lead", id: "LIST" }],
    }),
  }),
});

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useRegisterMutation } = authApiSlice;

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApiSlice;

export const {
  useGetInspectionsQuery,
  useGetInspectionByIdQuery,
  useCreateInspectionMutation,
  useUpdateInspectionMutation,
} = inspectionsApiSlice;

export const {
  useGetTrustmarksQuery,
  useGetTrustmarkByIdQuery,
  useCreateTrustmarkMutation,
} = trustmarksApiSlice;

export const {
  useGetComplaintsQuery,
  useGetComplaintByIdQuery,
  useCreateComplaintMutation,
} = complaintsApiSlice;

export const { useGetNotificationsQuery, useMarkAsReadMutation } =
  notificationsApiSlice;

export const {
  useGetCustomerRecordsQuery,
  useGetCustomerRecordByIdQuery,
  useCreateCustomerRecordMutation,
  useUpdateCustomerRecordMutation,
  useDeleteCustomerRecordMutation,
} = customerRecordsApiSlice;

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = leadsApiSlice;
