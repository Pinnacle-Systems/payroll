import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HRCommonTemplate_API } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const HRCommonTemplateMasterApi = createApi({
  reducerPath: "HRCommonTemplateMaster",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["HRCommonTemplate"],
  endpoints: (builder) => ({
    getHRCommonTemplate: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: HRCommonTemplate_API  + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params,
          };
        }
        return {
          url: HRCommonTemplate_API ,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags:["HRCommonTemplate"],
    }),
    getHRCommonTemplateById: builder.query({
      query: (id) => {
        return {
          url: `${HRCommonTemplate_API }/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["HRCommonTemplate"],
    }),
    addHRCommonTemplate: builder.mutation({
      query: (payload) => ({
        url: HRCommonTemplate_API ,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["HRCommonTemplate"],
    }),
    updateHRCommonTemplate: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${HRCommonTemplate_API }/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["HRCommonTemplate"],
    }),
    deleteHRCommonTemplate: builder.mutation({
      query: (id) => ({
        url: `${HRCommonTemplate_API }/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HRCommonTemplate"],
    }),
  }),
});

export const {
  useGetHRCommonTemplateQuery,
  useGetHRCommonTemplateByIdQuery,
  useAddHRCommonTemplateMutation,
  useUpdateHRCommonTemplateMutation,
  useDeleteHRCommonTemplateMutation,
} = HRCommonTemplateMasterApi;

export default HRCommonTemplateMasterApi;
