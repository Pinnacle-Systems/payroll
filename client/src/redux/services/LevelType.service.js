import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LEVEL_TYPE_API } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;
console.log(BASE_URL, "BASE_URL")

const levelTypeApi = createApi({
  reducerPath: "levelType",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["levelType"],
  endpoints: (builder) => ({
    getLevelType: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: LEVEL_TYPE_API + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: LEVEL_TYPE_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["levelType"],
    }),
    getLevelTypeById: builder.query({
      query: (id) => {
        return {
          url: `${LEVEL_TYPE_API}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["levelType"],
    }),
    addLevelType: builder.mutation({
      query: (payload) => ({
        url: LEVEL_TYPE_API,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["levelType"],
    }),
    updateLevelType: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${LEVEL_TYPE_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["levelType"],
    }),
    deleteLevelType: builder.mutation({
      query: (id) => ({
        url: `${LEVEL_TYPE_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["levelType"],
    }),
  }),
});

export const {
  useGetLevelTypeQuery,
  useGetLevelTypeByIdQuery,
  useAddLevelTypeMutation,
  useUpdateLevelTypeMutation,
  useDeleteLevelTypeMutation,
} = levelTypeApi;

export default levelTypeApi;
