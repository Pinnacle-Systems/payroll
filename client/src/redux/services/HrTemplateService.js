import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HRTEMPLATE_API } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const hrTemplateMasterApi = createApi({
  reducerPath: "hrTemplateMaster",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["hrTemplate"],
  endpoints: (builder) => ({
    gethrTemplate: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: HRTEMPLATE_API  + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params,
          };
        }
        return {
          url: HRTEMPLATE_API ,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["hrTemplate"],
    }),
    gethrTemplateById: builder.query({
      query: (id) => {
        return {
          url: `${HRTEMPLATE_API }/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["hrTemplate"],
    }),
    addhrTemplate: builder.mutation({
      query: (payload) => ({
        url: HRTEMPLATE_API ,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["hrTemplate"],
    }),
    updatehrTemplate: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${HRTEMPLATE_API }/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["hrTemplate"],
    }),
    deletehrTemplate: builder.mutation({
      query: (id) => ({
        url: `${HRTEMPLATE_API }/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["hrTemplate"],
    }),
  }),
});

export const {
  useGethrTemplateQuery,
  useGethrTemplateByIdQuery,
  useAddhrTemplateMutation,
  useUpdatehrTemplateMutation,
  useDeletehrTemplateMutation,
} = hrTemplateMasterApi;

export default hrTemplateMasterApi;
