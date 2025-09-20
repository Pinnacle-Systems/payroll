import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OT_MASTER} from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const OTMasterApi = createApi({
  reducerPath: "oTMAster",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["oTMAster",],
  endpoints: (builder) => ({
    getOTMaster: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: OT_MASTER + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params,
          };
        }
        return {
          url: OT_MASTER,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params,
        };
      },
      providesTags: ["oTMAster",],
    }),
    getOTMasterById: builder.query({
      query: (id) => {
        return {
          url: `${OT_MASTER}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["oTMAster",],
    }),
    addOTMaster: builder.mutation({
      query: (payload) => ({
        url: OT_MASTER,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["oTMAster",],
    }),
    updateOTMaster: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${OT_MASTER}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["oTMAster",],
    }),
    deleteOTMaster: builder.mutation({
      query: (id) => ({
        url: `${OT_MASTER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["oTMAster",],
    }),
  }),
});

export const {
  useGetOTMasterQuery,
  useGetOTMasterByIdQuery,
  useAddOTMasterMutation,
  useUpdateOTMasterMutation,
  useDeleteOTMasterMutation,
} = OTMasterApi;

export default OTMasterApi;
