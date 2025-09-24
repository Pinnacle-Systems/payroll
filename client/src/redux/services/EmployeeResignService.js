import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EMP_RESIGN } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const EmployeeResignApi = createApi({
  reducerPath: "employeeResign",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["employeeResign"],
  endpoints: (builder) => ({
    getEmployeeResign: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: EMP_RESIGN + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params,
          };
        }
        return {
          url: EMP_RESIGN,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["employeeResign"],
    }),
    getEmployeeResignById: builder.query({
      query: (id) => {
        return {
          url: `${EMP_RESIGN}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["employeeResign"],
    }),
    addEmployeeResign: builder.mutation({
      query: (payload) => ({
        url: EMP_RESIGN,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["employeeResign"],
    }),
    updateEmployeeResign: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${EMP_RESIGN}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["employeeResign"],
    }),
    deleteEmployeeResign: builder.mutation({
      query: (id) => ({
        url: `${EMP_RESIGN}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employeeResign"],
    }),
  }),
});

export const {
  useGetEmployeeResignQuery,
  useGetEmployeeResignByIdQuery,
  useAddEmployeeResignMutation,
  useUpdateEmployeeResignMutation,
  useDeleteEmployeeResignMutation,
} = EmployeeResignApi;

export default EmployeeResignApi;
