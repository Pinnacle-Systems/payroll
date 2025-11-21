import moment from "moment-timezone";
import React, { useEffect, useState, useRef } from "react";


const AbsentTable = ({ selectedShiftType, absentData, reportView, onClose, onUpdate, onSaveAll }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white w-[95vw]  h-[90vh] rounded-lg shadow-xl p-4 overflow-hidden border border-gray-300">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold">Leave</h2>
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={onSaveAll}
                                className="px-3 py-1.5 bg-green-600 text-white rounded text-xs"
                            >
                                Save All Absent
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="ext-gray-600 hover:text-gray-800 hover:bg-red-400 rounded focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6 fill-current"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <title>Close</title>
                                <path
                                    d="M14.348 5.652a.999.999 0 00-1.414 0L10 8.586l-2.93-2.93a.999.999 0 10-1.414 1.414L8.586 10l-2.93 2.93a.999.999 0 101.414 1.414L10 11.414l2.93 2.93a.999.999 0 101.414-1.414L11.414 10l2.93-2.93a.999.999 0 000-1.414z"
                                    fillRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        className={` mt-3  p-2  bg-white max-h-[600px]  overflow-x-auto overflow-y-auto`}
                    >
                        <table className={` w-[65vw]  border-collapse table-fixed`}>

                            <thead className="bg-gray-200 text-gray-800 border border-gray-400">
                                <tr>
                                    <th
                                        className={`w-[15px] px-1 text-center font-medium text-[13px]  border border-gray-300`}
                                    >
                                        S.No
                                    </th>

                                    <th
                                        className={`w-6  py-2 text-center font-medium text-[13px]  border border-gray-300`}
                                    >
                                        MId
                                    </th>
                                    <th
                                        className={`w-[50px]  py-2 text-center font-medium text-[13px]  border border-gray-300`}
                                    >
                                        Emp Name
                                    </th>
                                    <th
                                        className={`w-[30px]  py-2 text-center font-medium text-[13px]  border border-gray-300`}
                                    >
                                        Shift
                                    </th>
                                    <th
                                        className={`w-[45px]  py-2 text-center font-medium text-[13px]  border border-gray-300`}
                                    >
                                        Department
                                    </th>
                                    <th
                                        className={`w-[65px]  py-2 text-center font-medium text-[13px]  border border-gray-300`}
                                    >
                                        Designation
                                    </th>
                                    <th
                                        className={`w-12  py-2 item-center font-medium text-[13px]  border border-gray-300`}
                                    >
                                        Date
                                    </th>
                                    <th className={`w-12 py-2 item-center font-medium text-[13px]  border border-gray-300`}>
                                        In
                                    </th>

                                    <th className={`w-12 py-2 item-center font-medium text-[13px]  border border-gray-300`}>
                                        Out
                                    </th>


                                </tr>

                            </thead>
                            <tbody>
                                {absentData?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {/* Row 1 - In + Morning */}
                                        <tr>
                                            {/* S.No rowspan */}
                                            <td
                                                rowSpan={2}
                                                className="border border-gray-300 py-1.5 text-[12px]  text-center px-1"
                                            >
                                                {index + 1}
                                            </td>

                                            {/* Employee Id rowspan */}
                                            <td
                                                rowSpan={2}
                                                className="border border-gray-300 text-[12px] py-0.5 item-center"
                                            >
                                                <input
                                                    type="text"
                                                    value={item?.mIdCard}
                                                    className={`w-full  text-right pr-1 bg-transparent   focus:outline-none focus:border-transparent `}
                                                />
                                            </td>
                                            <td
                                                rowSpan={2}
                                                className="border border-gray-300 text-[12px] py-0.5 item-center"
                                            >
                                                <input
                                                    type="text"
                                                    value={item?.firstName}
                                                    className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                                                />
                                            </td>
                                            <td
                                                rowSpan={2}
                                                className="border border-gray-300 text-[12px] py-0.5 item-center"
                                            >
                                                <input
                                                    type="text"
                                                    value={item?.shiftName}
                                                    className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                                                />
                                            </td>
                                            <td
                                                rowSpan={2}
                                                className="border border-gray-300 text-[12px] py-0.5 item-center"
                                            >
                                                <input
                                                    type="text"
                                                    value={item?.departmentName
                                                    }
                                                    className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                                                />
                                            </td>
                                            <td
                                                rowSpan={2}
                                                className="border border-gray-300 text-[12px] py-0.5 item-center"
                                            >
                                                <input
                                                    type="text"
                                                    value={item?.designationName}
                                                    className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                                                />
                                            </td>

                                            {/* In Date */}
                                            <td
                                                rowSpan={2}
                                                className=" border border-gray-300 text-[12px] py-0.5 item-center"
                                            >
                                                <input
                                                    type="date"
                                                    value={item.inDate || (item.inTime ? moment.utc(item.inTime).format("DD-MM-YYYY") : "")}

                                                    onChange={(e) => onUpdate(index, "inDate", e.target.value)}

                                                    className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                />
                                            </td>

                                            <td
                                                rowSpan={2}
                                                className=" border border-gray-300 text-[12px] py-0.5 item-center"
                                            >
                                                <input
                                                    min="0"
                                                    type="time" // enforce proper format
                                                    step="1" // allows seconds, so HH:MM:SS instead of only HH:MM
                                                    value={
                                                        item.inTimeEdit
                                                            ? item.inTimeEdit
                                                            : item.inTime
                                                                ? moment.utc(item.inTime).format("HH:mm:ss")
                                                                : ""
                                                    }

                                                    onChange={(e) => onUpdate(index, "inTimeEdit", e.target.value)}

                                                    onFocus={(e) => e.target.select()}
                                                    className={`w-full bg-transparent  text-center focus:outline-none focus:border-transparent  `}
                                                />
                                            </td>


                                            <td
                                                rowSpan={2}
                                                className="  border border-gray-300 text-[12px] py-0.5 item-center"
                                            >
                                                <input
                                                    min="0"
                                                    type="time" // enforce proper format
                                                    step="1" // allows seconds, so HH:MM:SS instead of only HH:MM

                                                    value={
                                                        item.outTimeEdit
                                                            ? item.outTimeEdit
                                                            : item.outTime
                                                                ? moment.utc(item.outTime).format("HH:mm:ss")
                                                                : ""
                                                    }

                                                    onChange={(e) => onUpdate(index, "outTimeEdit", e.target.value)}

                                                    className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                />
                                            </td>


                                        </tr>
                                        <tr></tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AbsentTable