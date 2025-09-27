import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ATTENDENCE_REPORT } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const attendenceReportApi = createApi({
  reducerPath: "attendenceReport",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["attendenceReport"],
  endpoints: (builder) => ({
    getAttendenceReport: builder.query({
      query: ({ searchParams, params }) => {
        if (!searchParams) {
          throw new Error("searchParams (inDate and groupBy) are required");
        }

        return {
          url: `${ATTENDENCE_REPORT}/search`, 
          method: "GET",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          params: { ...searchParams, ...params }, 
        };
      },
      providesTags: ["attendenceReport"],
    }),
  }),
});

export const { useGetAttendenceReportQuery ,useLazyGetAttendenceReportQuery} = attendenceReportApi;

export default attendenceReportApi;
