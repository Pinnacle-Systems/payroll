import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BLOOD_GROUP_API} from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const bloodGroupApi = createApi({
  reducerPath: "bloodGroup",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["bloodGroup"],
  endpoints: (builder) => ({
    getBloodGroup: builder.query({
      query: ({params, searchParams}) => {
        if(searchParams){
          return {
            url: BLOOD_GROUP_API +"/search/"+searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: BLOOD_GROUP_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["bloodGroup"],
    }),
    getBloodGroupById: builder.query({
      query: (id) => {
        return {
          url: `${BLOOD_GROUP_API}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["bloodGroup"],
    }),
    addBloodGroup: builder.mutation({
      query: (payload) => ({
        url: BLOOD_GROUP_API,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["bloodGroup"],
    }),
    updateBloodGroup: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${BLOOD_GROUP_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["bloodGroup"],
    }),
    updateManyBloodGroup: builder.mutation({
      query: (payload) => {
        const { companyId, branches } = payload;
        return {
          url: `${BLOOD_GROUP_API}/updateMany/${companyId}`,
          method: "PUT",
          body: branches,
        };
      },
      invalidatesTags: ["bloodGroup"],
    }),
    deleteBloodGroup: builder.mutation({
      query: (id) => ({
        url: `${BLOOD_GROUP_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["bloodGroup"],
    }),
  }),
});

export const {
  useGetBloodGroupQuery,
  useGetBloodGroupByIdQuery,
  useAddBloodGroupMutation,
  useUpdateBloodGroupMutation,
  useDeleteBloodGroupMutation,
  useUpdateManyBloodGroupMutation
} = bloodGroupApi;

export default bloodGroupApi;
