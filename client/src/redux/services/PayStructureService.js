import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {   PAY_STRUCTURE_API } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const PayStructureApi = createApi({
  reducerPath: "payStructure",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["payStructure"],
  endpoints: (builder) => ({
    getPayStructure: builder.query({
      query: ({params, searchParams}) => {
        if(searchParams){
          return {
            url: PAY_STRUCTURE_API  +"/search/"+searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: PAY_STRUCTURE_API ,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["payStructure"],
    }),
    getPayStructureById: builder.query({
      query: (id) => {
        return {
          url: `${PAY_STRUCTURE_API }/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["payStructure"],
    }),
    addPayStructure: builder.mutation({
      query: (payload) => ({
        url: PAY_STRUCTURE_API ,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["payStructure"],
    }),
    updatePayStructure: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${PAY_STRUCTURE_API }/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["payStructure"],
    }),
    deletePayStructure: builder.mutation({
      query: (id) => ({
        url: `${PAY_STRUCTURE_API }/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["payStructure"],
    }),
  }),
});

export const {
  useGetPayStructureQuery,
  useGetPayStructureByIdQuery,
  useAddPayStructureMutation,
  useUpdatePayStructureMutation,
  useDeletePayStructureMutation,
} = PayStructureApi;

export default PayStructureApi;
