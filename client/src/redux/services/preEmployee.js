
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EMP_API } from "../../Api";
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const EmpApi = createApi({
  reducerPath: "empApi", 
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["preEmployee"],
  endpoints: (builder) => ({
    getEmp: builder.query({
      query: () => ({
        url: EMP_API,
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }),
      providesTags: ["preEmployee"],
    }),
    createEmp: builder.mutation({
      query: (payload) => ({
        url: EMP_API,
        method: "POST",
        body: payload,
        // headers: {
        //   "Content-Type": "application/json; charset=UTF-8",
        // },
      }),
      invalidatesTags: ["preEmployee"],
    }),
  }),
});

export const { useGetEmpQuery, useCreateEmpMutation } = EmpApi;
export default EmpApi;
