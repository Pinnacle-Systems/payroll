import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PF_ESI_EDITOR } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const PFEsiEditorApi = createApi({
  reducerPath: "pFEsiEditor",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["pFEsiEditor"],
  endpoints: (builder) => ({
    getPFEsiEditor: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: PF_ESI_EDITOR + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params,
          };
        }
        return {
          url: PF_ESI_EDITOR,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["pFEsiEditor"],
    }),
    getPFEsiEditorById: builder.query({
      query: (id) => {
        return {
          url: `${PF_ESI_EDITOR}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["pFEsiEditor"],
    }),
    addPFEsiEditor: builder.mutation({
      query: (payload) => ({
        url: PF_ESI_EDITOR,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["pFEsiEditor"],
    }),
    updatePFEsiEditor: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${PF_ESI_EDITOR}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["pFEsiEditor"],
    }),
    deletePFEsiEditor: builder.mutation({
      query: (id) => ({
        url: `${PF_ESI_EDITOR}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pFEsiEditor"],
    }),
  }),
});

export const {
  useGetPFEsiEditorQuery,
  useGetPFEsiEditorByIdQuery,
  useAddPFEsiEditorMutation,
  useUpdatePFEsiEditorMutation,
  useDeletePFEsiEditorMutation,
} = PFEsiEditorApi;

export default PFEsiEditorApi;
