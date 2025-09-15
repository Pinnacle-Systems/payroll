import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PROOF_MASTER_API } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;


const ProofMasterApi = createApi({
  reducerPath: "proofMaster",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["proofMaster"],
  endpoints: (builder) => ({
    getProofMaster: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: PROOF_MASTER_API + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: PROOF_MASTER_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["proofMaster"],
    }),
    getProofMasterById: builder.query({
      query: (id) => {
        return {
          url: `${PROOF_MASTER_API}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["proofMaster"],
    }),
    addProofMaster: builder.mutation({
      query: (payload) => ({
        url: PROOF_MASTER_API,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["proofMaster"],
    }),
    updateProofMaster: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${PROOF_MASTER_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["proofMaster"],
    }),
    deleteProofMaster: builder.mutation({
      query: (id) => ({
        url: `${PROOF_MASTER_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["proofMaster"],
    }),
  }),
});

export const {
  useGetProofMasterQuery,
  useGetProofMasterByIdQuery,
  useAddProofMasterMutation,
  useUpdateProofMasterMutation,
  useDeleteProofMasterMutation,
} = ProofMasterApi;

export default ProofMasterApi;
