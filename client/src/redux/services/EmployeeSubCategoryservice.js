import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {EMPLOYEE_SUB_CATEGORY_API} from '../../Api'

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const employeesubCategoryApi = createApi({
  reducerPath: "employeeSubCategory",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Employee"],
  endpoints: (builder) => ({
    getEmployee: builder.query({
      query: ({params, searchParams}) => {
        if(searchParams){
          return {
            url: EMPLOYEE_SUB_CATEGORY_API +"/search/"+searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: EMPLOYEE_SUB_CATEGORY_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["Employee"],
    }),
    getEmployeeById: builder.query({
      query: (id) => {
        return {
          url: `${EMPLOYEE_SUB_CATEGORY_API}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["Employee"],
    }),
    addEmployee: builder.mutation({
      query: (payload) => ({
        url: EMPLOYEE_SUB_CATEGORY_API,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Employee"],
    }),
    updateEmployee: builder.mutation({
      query: ({id, body}) => {
        return {
          url: `${EMPLOYEE_SUB_CATEGORY_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Employee"],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `${EMPLOYEE_SUB_CATEGORY_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee"],
    }),
  }),
});

export const {
  useGetEmployeeQuery,
  useGetEmployeeByIdQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesubCategoryApi;

export default employeesubCategoryApi;
