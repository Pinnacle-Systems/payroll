import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LEAVE_CODE_API} from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;


const LeaveCodeMasterApi = createApi({
  reducerPath: "leaveCode",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["leaveCode"],
  endpoints: (builder) => ({
    getLeaveCode: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: LEAVE_CODE_API + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: LEAVE_CODE_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["leaveCode"],
    }),
    getLeaveCodeById: builder.query({
      query: (id) => {
        return {
          url: `${LEAVE_CODE_API}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["leaveCode"],
    }),
    addLeaveCode: builder.mutation({
      query: (payload) => ({
        url: LEAVE_CODE_API,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["leaveCode"],
    }),
    updateLeaveCode: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${LEAVE_CODE_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["leaveCode"],
    }),
    deleteLeaveCode: builder.mutation({
      query: (id) => ({
        url: `${LEAVE_CODE_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["leaveCode"],
    }),
  }),
});

export const {
  useGetLeaveCodeQuery,
  useGetLeaveCodeByIdQuery,
  useAddLeaveCodeMutation,
  useUpdateLeaveCodeMutation,
  useDeleteLeaveCodeMutation,
} = LeaveCodeMasterApi;

export default LeaveCodeMasterApi;
