import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BREAK_REPORT } from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const BreakReportApi = createApi({
    reducerPath: "breakReport",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    tagTypes: ["breakReport"],
    endpoints: (builder) => ({
        getbreakReport: builder.query({
            query: ({ searchParams }) => {
                if (!searchParams) {
                    throw new Error("searchParams (inDate and groupBy) are required");
                }

                return {
                    url: `${BREAK_REPORT}/search`,
                    method: "GET",
                    headers: { "Content-Type": "application/json; charset=UTF-8" },
                    params: { ...searchParams },
                };
            },
            providesTags: ["breakReport"],
        }),
        getbreakReportById: builder.query({
            query: (id) => {
                return {
                    url: `${BREAK_REPORT}/${id}`,
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                };
            },
            providesTags: ["breakReport"],
        }),
        addbreakReport: builder.mutation({
            query: (payload) => ({
                url: BREAK_REPORT,
                method: "POST",
                body: payload,
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }),
            invalidatesTags: ["breakReport"],
        }),
        updatebreakReport: builder.mutation({
            query: (payload) => {
                const { id, ...body } = payload;
                return {
                    url: `${BREAK_REPORT}/${id}`,
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: ["breakReport"],
        }),
        deletebreakReport: builder.mutation({
            query: (id) => ({
                url: `${BREAK_REPORT}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["breakReport"],
        }),
    }),
});

export const {
    useGetbreakReportQuery,
    useLazyGetbreakReportQuery,
    useGetbreakReportByIdQuery,
    useAddbreakReportMutation,
    useUpdatebreakReportMutation,
    useDeletebreakReportMutation,
} = BreakReportApi;

export default BreakReportApi;
