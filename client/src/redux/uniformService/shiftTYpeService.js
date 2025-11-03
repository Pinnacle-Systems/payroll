import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { SHIFT_TYPE } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const shiftTypeApi = createApi({
    reducerPath: "shiftType",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ["shiftType"],
    endpoints: (builder) => ({
        getshiftType: builder.query({
            query: ({ params, searchParams }) => {
                if (searchParams) {
                    return {
                        url: SHIFT_TYPE + "/search/" + searchParams,
                        method: "GET",
                        headers: {
                            "Content-type": "application/json; charset=UTF-8",
                        },
                        params
                    };
                }
                return {
                    url: SHIFT_TYPE,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    params
                };
            },
            providesTags: ["shiftType"],
        }),
        getshiftTypeById: builder.query({
            query: (id) => {
                return {
                    url: `${SHIFT_TYPE}/${id}`,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                };
            },
            providesTags: ["shiftType"],
        }),
        getshiftTypeItemsById: builder.query({
            query: ({ id, prevProcessId, packingCategory, packingType }) => {
                return {
                    url: `${SHIFT_TYPE}/getOrderItems/${id}`,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                };
            },
            providesTags: ["shiftType"],
        }),
        addshiftType: builder.mutation({
            query: (payload) => ({
                url: SHIFT_TYPE,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Order"],
        }),
        upload: builder.mutation({
            query: (payload) => {
                const { id, body } = payload;
                return {
                    url: `${SHIFT_TYPE}/upload/${id}`,
                    method: "PATCH",
                    body,
                };
            },
            invalidatesTags: ["shiftType"],
        }),
        updateshiftType: builder.mutation({
            query: (payload) => {
                const { id, ...body } = payload;
                return {
                    url: `${SHIFT_TYPE}/${id}`,
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ["shiftType"],
        }),
        deleteshiftType: builder.mutation({
            query: (id) => ({
                url: `${SHIFT_TYPE}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["shiftType"],
        }),
    }),
});

export const {
    useGetshiftTypeQuery,
    useGetshiftTypeByIdQuery,
    useGetshiftTypeItemsByIdQuery,
    useAddshiftTypeMutation,
    useUpdateshiftTypeMutation,
    useDeleteshiftTypeMutation,

} = shiftTypeApi;

export default shiftTypeApi;
