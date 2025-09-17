import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {   LEAVE_OPENING_BALANCE_API } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const LeaveOpeningBalanceApi = createApi({
  reducerPath: "leaveopeningBalance",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["leaveopeningBalance"],
  endpoints: (builder) => ({
    getLeaveOpeningBalance: builder.query({
      query: ({params, searchParams}) => {
        if(searchParams){
          return {
            url: LEAVE_OPENING_BALANCE_API  +"/search/"+searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: LEAVE_OPENING_BALANCE_API ,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["leaveopeningBalance"],
    }),
    getLeaveOpeningBalanceById: builder.query({
      query: (id) => {
        return {
          url: `${LEAVE_OPENING_BALANCE_API }/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["leaveopeningBalance"],
    }),
    addLeaveOpeningBalance: builder.mutation({
      query: (payload) => ({
        url: LEAVE_OPENING_BALANCE_API ,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["leaveopeningBalance"],
    }),
    updateLeaveOpeningBalance: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${LEAVE_OPENING_BALANCE_API }/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["leaveopeningBalance"],
    }),
    deleteLeaveOpeningBalance: builder.mutation({
      query: (id) => ({
        url: `${LEAVE_OPENING_BALANCE_API }/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["leaveopeningBalance"],
    }),
  }),
});

export const {
  useGetLeaveOpeningBalanceQuery,
  useGetLeaveOpeningBalanceByIdQuery,
  useAddLeaveOpeningBalanceMutation,
  useUpdateLeaveOpeningBalanceMutation,
  useDeleteLeaveOpeningBalanceMutation,
} = LeaveOpeningBalanceApi;

export default LeaveOpeningBalanceApi;
