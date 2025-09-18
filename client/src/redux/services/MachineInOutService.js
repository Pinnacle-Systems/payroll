import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {  MACHINE_IN_OUT_ENTRY_API } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const MachineInOutApi = createApi({
  reducerPath: "machineInOut",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["machineInOut"],
  endpoints: (builder) => ({
    getMachineInOut: builder.query({
      query: ({params, searchParams}) => {
        if(searchParams){
          return {
            url: MACHINE_IN_OUT_ENTRY_API  +"/search/"+searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: MACHINE_IN_OUT_ENTRY_API ,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["machineInOut"],
    }),
    getMachineInOutById: builder.query({
      query: (id) => {
        return {
          url: `${MACHINE_IN_OUT_ENTRY_API }/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["machineInOut"],
    }),
    addMachineInOut: builder.mutation({
      query: (payload) => ({
        url: MACHINE_IN_OUT_ENTRY_API ,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["machineInOut"],
    }),
    updateMachineInOut: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${MACHINE_IN_OUT_ENTRY_API }/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["machineInOut"],
    }),
    deleteMachineInOut: builder.mutation({
      query: (id) => ({
        url: `${MACHINE_IN_OUT_ENTRY_API }/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["machineInOut"],
    }),
  }),
});

export const {
  useGetMachineInOutQuery,
  useGetMachineInOutByIdQuery,
  useAddMachineInOutMutation,
  useUpdateMachineInOutMutation,
  useDeleteMachineInOutMutation,
} = MachineInOutApi;

export default MachineInOutApi;
