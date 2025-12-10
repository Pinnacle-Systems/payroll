import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LEAVE_REQUEST } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const leaveRequestApi = createApi({
  reducerPath: "leaveRequest",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["leaveRequest"],
  endpoints: (builder) => ({
    getLeaveRequest: builder.query({
      query: ({params, searchParams}) => {
        if(searchParams){
          return {
            url: LEAVE_REQUEST +"/search/"+searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: LEAVE_REQUEST,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["leaveRequest"],
    }),
    getLeaveRequestById: builder.query({
      query: (id) => {
        return {
          url: `${LEAVE_REQUEST}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["leaveRequest"],
    }),
    addLeaveRequest: builder.mutation({
      query: (payload) => ({
        url: LEAVE_REQUEST,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["leaveRequest"],
    }),
    updateLeaveRequest: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${LEAVE_REQUEST}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["leaveRequest"],
    }),
    deleteLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `${LEAVE_REQUEST}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["leaveRequest"],
    }),
    getEmployeeLeaveCount:builder.query({
      query: (employeeId) => {
        return {
          url: `${LEAVE_REQUEST}/${employeeId}/leavecount`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["leaveRequest"],
    }),
  }),
});

export const {
  useGetLeaveRequestQuery,
  useGetLeaveRequestByIdQuery,
  useAddLeaveRequestMutation,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
  useGetEmployeeLeaveCountQuery
} = leaveRequestApi;

export default leaveRequestApi;
