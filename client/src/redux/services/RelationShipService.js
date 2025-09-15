import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RELATIONSHIP_MASTER_API } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;


const RelationShipApi = createApi({
  reducerPath: "relationShip",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["relationShip"],
  endpoints: (builder) => ({
    getRelationShip: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: RELATIONSHIP_MASTER_API + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: RELATIONSHIP_MASTER_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["relationShip"],
    }),
    getRelationShipById: builder.query({
      query: (id) => {
        return {
          url: `${RELATIONSHIP_MASTER_API}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["relationShip"],
    }),
    addRelationShip: builder.mutation({
      query: (payload) => ({
        url: RELATIONSHIP_MASTER_API,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["relationShip"],
    }),
    updateRelationShip: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${RELATIONSHIP_MASTER_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["relationShip"],
    }),
    deleteRelationShip: builder.mutation({
      query: (id) => ({
        url: `${RELATIONSHIP_MASTER_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["relationShip"],
    }),
  }),
});

export const {
  useGetRelationShipQuery,
  useGetRelationShipByIdQuery,
  useAddRelationShipMutation,
  useUpdateRelationShipMutation,
  useDeleteRelationShipMutation,
} = RelationShipApi;

export default RelationShipApi;
