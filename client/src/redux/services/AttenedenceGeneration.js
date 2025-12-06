import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ATTENDENCE_GENERATION } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const AttendenceGenerationApi = createApi({
  reducerPath: "attendenceGeneration",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["attendenceGeneration"],
  endpoints: (builder) => ({
    getAttendenceGeneration: builder.query({
      query: ({ searchParams }) => {
        if (!searchParams) {
          throw new Error("searchParams (inDate and groupBy) are required");
        }

        return {
          url: `${ATTENDENCE_GENERATION}/search`,
          method: "GET",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          params: { ...searchParams },
        };
      },
      providesTags: ["attendenceGeneration"],
      keepUnusedDataFor: 21600,

    }),
 

    addmanualPunch: builder.mutation({
      query: (payload) => ({
        url: ATTENDENCE_GENERATION,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["attendenceGeneration"],

    }),

    


    updatePermission: builder.mutation({
      query: (payload) => {
        return {
          url: `${ATTENDENCE_GENERATION}/update-permission`,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: ["attendenceGeneration"],
    }),

    updateAbsentPunches: builder.mutation({
      query: (payload) => {
        return {
          url: `${ATTENDENCE_GENERATION}/update-absent-punches`,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: ["attendenceGeneration"],
    }),
    updateSinglePunch: builder.mutation({
      query: (payload) => {
        return {
          url: `${ATTENDENCE_GENERATION}/update-single-punch`,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: ["attendenceGeneration"],
    }),




  }),
});

export const {
  useGetAttendenceGenerationQuery,
  useLazyGetAttendenceGenerationQuery,
  useAddmanualPunchMutation,
  useUpdatePermissionMutation,
  useUpdateAbsentPunchesMutation,
  useUpdateSinglePunchMutation
} = AttendenceGenerationApi;

export default AttendenceGenerationApi;
