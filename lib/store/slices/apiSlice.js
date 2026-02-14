import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://crmbackend.ecogenius.org.uk/api/',
  // baseUrl: 'https://crmrealbackend.ecogenius.org.uk/api/',
  // baseUrl: 'http://127.0.0.1:8000/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('content-type', 'application/json')
    return headers
  },
})

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ['User', 'Project', 'Inspection', 'Trustmark', 'Complaint', 'Notification'],
  endpoints: (builder) => ({}),
})