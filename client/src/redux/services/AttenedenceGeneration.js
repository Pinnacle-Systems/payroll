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
      query: ({ searchParams}) => {
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
    }),
    getAttendenceGenerationById: builder.query({
      query: (id) => {
        return {
          url: `${ATTENDENCE_GENERATION}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["attendenceGeneration"],
    }),
    addAttendenceGeneration: builder.mutation({
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
    updateAttendenceGeneration: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${ATTENDENCE_GENERATION}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["attendenceGeneration"],
    }),
    deleteAttendenceGeneration: builder.mutation({
      query: (id) => ({
        url: `${ATTENDENCE_GENERATION}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["attendenceGeneration"],
    }),
  }),
});

export const {
  useGetAttendenceGenerationQuery,
  useLazyGetAttendenceGenerationQuery,
  useGetAttendenceGenerationByIdQuery,
  useAddAttendenceGenerationMutation,
  useUpdateAttendenceGenerationMutation,
  useDeleteAttendenceGenerationMutation,
} = AttendenceGenerationApi;

export default AttendenceGenerationApi;
