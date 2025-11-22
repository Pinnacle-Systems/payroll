import moment from "moment-timezone";
import React, { useEffect, useState, useRef } from "react";
const Permissiontable = ({ reportView, permissionTableData, selectedShiftType, openModal, selectedBreakSummary, setSelectedBreakSummary, showModal, setShowModal, closeModal, onClose }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white  rounded-lg shadow-xl p-4 overflow-hidden border border-gray-300">
                    <div className="bg-gray-200 p-2 w-[95vw]  h-[85vh]">
                        <div className="bg-white flex justify-between align-items-center border-b p-2">
                            <h2 className="text-lg font-semibold">Permission</h2>
                            <div className="flex justify-end align-items-center   mx-2">
                                <button
                                    // onClick={onSaveAll}
                                    className="px-3 mr-4  ml-2 bg-green-600 text-white rounded text-xs"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-gray-800  ml-2 bg-red-400 rounded focus:outline-none"
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
                        </div>
                        <div
                            className={` mt-3  p-2  bg-white h-[450px]  overflow-x-auto overflow-y-auto`}
                        >
                            <table className={` ${selectedShiftType === "Hourly" ? "w-[110vw]" : "w-[100vw]"}  border-collapse table-fixed`}>

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
                                            className={`w-8  py-2 item-center font-medium text-[13px]  border border-gray-300`}
                                        >
                                            In Date
                                        </th>
                                        <th className={`w-8 py-2 item-center font-medium text-[13px]  border border-gray-300`}>
                                            In
                                        </th>
                                        <th
                                            className={`w-8 py-2 item-center font-medium text-[13px]  border border-gray-300`}
                                        >
                                            Out Date
                                        </th>
                                        <th className={`w-8 py-2 item-center font-medium text-[13px]  border border-gray-300`}>
                                            Out
                                        </th>

                                        <th
                                            colSpan={reportView === "Seperate" ? 4 : 2}
                                            className={`${reportView === "Single" ? "w-32" : "w-36"} py-2 text-center font-medium text-[13px]  border border-gray-300`}                >
                                            Other Punches
                                        </th>


                                        {selectedShiftType === "Hourly" ? (<th className={`w-[40px] py-2 item-center font-medium text-[13px]  border border-gray-300`}>
                                            Status
                                        </th>) : ""}
                                        {/* ================================
    HOURLY COLUMNS
================================== */}
                                        {selectedShiftType === "Hourly" && (
                                            <>
                                                {/* 1. worked Hours (with Break) */}

                                                <th className="w-[45px] py-2 item-center font-medium text-[13px] border border-gray-300">
                                                    worked Hours (with Break)
                                                </th>

                                                {/* 2. worked Hours (without Break and OT) */}
                                                <th className="w-[50px] py-2 item-center  px-1 font-medium text-[13px] border border-gray-300">
                                                    worked Hours (without Break)
                                                </th>

                                                {/* 3. OT Hours */}
                                                <th className="w-[40px] py-2 item-center font-medium text-[13px] border border-gray-300">
                                                    OT Hours
                                                </th>

                                                {/* 4. Actual Worked Hours (LAST) */}
                                                <th className="w-[45px] py-2 item-center font-medium text-[13px] border border-gray-300">
                                                    Actual Worked Hours
                                                </th>
                                            </>
                                        )}

                                        {/* ================================
    NON-HOURLY COLUMNS
================================== */}
                                        {selectedShiftType !== "Hourly" && (
                                            <>
                                                {/* 1. worked Hours */}
                                                <th className="w-[35px] py-2 item-center font-medium text-[13px] border border-gray-300">
                                                    worked Hours
                                                </th>

                                                {/* 2. OT Hours */}
                                                <th className="w-[35px] py-2 item-center font-medium text-[13px] border border-gray-300">
                                                    OT Hours
                                                </th>

                                                {/* 3. Shift Count */}
                                                <th className="w-[30px] py-2 item-center font-medium text-[13px] border border-gray-300">
                                                    Shift Count
                                                </th>
                                            </>
                                        )}



                                    </tr>

                                </thead>


                                <tbody>
                                    {permissionTableData?.map((item, index) => (
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
                                                        type="text"
                                                        value={
                                                            item.inTime
                                                                ? moment.utc(item.inTime).format("DD-MM-YYYY")
                                                                : ""
                                                        }
                                                        className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                    />
                                                </td>

                                                {/* In Time */}
                                                <td
                                                    rowSpan={2}
                                                    className=" border border-gray-300 text-[12px] py-0.5 item-center"
                                                >
                                                    <input
                                                        min="0"
                                                        type="text"
                                                        value={
                                                            item.inTime
                                                                ? moment.utc(item.inTime).format("HH:mm:ss")
                                                                : ""
                                                        }
                                                        onFocus={(e) => e.target.select()}
                                                        className={`w-full bg-transparent  text-center focus:outline-none focus:border-transparent  `}
                                                    />
                                                </td>
                                                {/* Out Date */}
                                                <td
                                                    rowSpan={2}
                                                    className="  border border-gray-300 text-[12px] py-0.5 item-center"
                                                >
                                                    <input
                                                        type="text"
                                                        value={
                                                            item.outTime
                                                                ? moment.utc(item.outTime).format("DD-MM-YYYY")
                                                                : ""
                                                        }
                                                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                    />
                                                </td>
                                                {/* Out Time*/}

                                                <td
                                                    rowSpan={2}
                                                    className="  border border-gray-300 text-[12px] py-0.5 item-center"
                                                >
                                                    <input
                                                        type="text"
                                                        value={
                                                            item.outTime
                                                                ? moment.utc(item.outTime).format("HH:mm:ss")
                                                                : ""
                                                        }
                                                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                    />
                                                </td>

                                                {reportView === "Seperate" && (
                                                    <>
                                                        <td className=" border border-gray-300 text-[12px] py-0.5 ">
                                                            <input
                                                                type="text"
                                                                value={"OUT"}
                                                                className={`w-full text-center bg-transparent  focus:outline-none focus:border-transparent `}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                min="0"
                                                                type="text"
                                                                value={
                                                                    item.firstBreakOut
                                                                        ? moment
                                                                            .utc(item.firstBreakOut)
                                                                            .format("HH:mm:ss")
                                                                        : ""
                                                                }
                                                                onFocus={(e) => e.target.select()}
                                                                className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 text-[12px] text-center px-1">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    item.lunchBreakOut
                                                                        ? moment
                                                                            .utc(item.lunchBreakOut)
                                                                            .format("HH:mm:ss")
                                                                        : ""
                                                                }
                                                                className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                                disabled
                                                            />
                                                        </td>
                                                        <td className="border border-gray-300 text-[12px] text-center px-1">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    item.eveningBreakOut
                                                                        ? moment
                                                                            .utc(item.eveningBreakOut)
                                                                            .format("HH:mm:ss")
                                                                        : ""
                                                                }
                                                                className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                                disabled
                                                            />
                                                        </td>
                                                    </>
                                                )}
                                                {reportView === "Single" && (
                                                    <>
                                                        <td colSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                type="text"

                                                                value={[
                                                                    item.firstBreakOut ? moment.utc(item.firstBreakOut).format("HH:mm:ss") : null,
                                                                    item.firstBreakIn ? moment.utc(item.firstBreakIn).format("HH:mm:ss") : null,
                                                                    item.lunchBreakOut ? moment.utc(item.lunchBreakOut).format("HH:mm:ss") : null,
                                                                    item.lunchBreakIn ? moment.utc(item.lunchBreakIn).format("HH:mm:ss") : null,
                                                                    item.eveningBreakOut ? moment.utc(item.eveningBreakOut).format("HH:mm:ss") : null,
                                                                    item.eveningBreakIn ? moment.utc(item.eveningBreakIn).format("HH:mm:ss") : null,
                                                                ]
                                                                    .filter(Boolean) // remove null or empty values
                                                                    .join(" , ")} // join only existing values
                                                                className={`w-full bg-transparent text-left pl-1 focus:outline-none focus:border-transparent `}
                                                                disabled
                                                            />
                                                        </td>
                                                    </>
                                                )}

                                                {
                                                    selectedShiftType === "Hourly" ? (<td
                                                        rowSpan={2}
                                                        className="  border border-gray-300 text-[12px] py-0.5 text-center item-center"
                                                    >
                                                        <button
                                                            className="text-blue-600 text-center text-blue  bg-blue-50 rounded"
                                                            onClick={() => openModal(item.breakSummary)}

                                                            title="Open"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </td>) : ""
                                                }


                                                {selectedShiftType === "Hourly" && (
                                                    <>


                                                        {/* 2. worked Hours (without Break and OT) → hourlyWorkedTime */}
                                                        <td rowSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                type="text"
                                                                value={item.hourlyWorkedTime || ""}
                                                                className="w-full bg-transparent text-center focus:outline-none"
                                                            />
                                                        </td>



                                                        {/* 4. Actual Worked Hours (LAST) → rawWorkedTime */}
                                                        <td rowSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                type="text"
                                                                value={item.rawWorkedTime || ""}
                                                                className="w-full bg-transparent text-center focus:outline-none"
                                                            />
                                                        </td>
                                                        {/* 3. OT Hours */}
                                                        <td rowSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                type="text"
                                                                value={item.otHours || ""}
                                                                className="w-full bg-transparent text-center focus:outline-none"
                                                            />
                                                        </td>
                                                        {/* 1. worked Hours (with Break) → actualWorkedTime */}
                                                        <td rowSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                type="text"
                                                                value={item.actualWorkedTime || ""}
                                                                className="w-full bg-transparent text-center focus:outline-none"
                                                            />
                                                        </td>
                                                    </>
                                                )}

                                                {/* ================================
    NON-HOURLY COLUMNS (3 columns)
================================== */}
                                                {selectedShiftType !== "Hourly" && (
                                                    <>
                                                        {/* 1. worked Hours */}
                                                        <td rowSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                type="text"
                                                                value={item.totalWorkedTime || ""}
                                                                className="w-full bg-transparent text-center focus:outline-none"
                                                            />
                                                        </td>

                                                        {/* 2. OT Hours */}
                                                        <td rowSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                type="text"
                                                                value={item.otHours || ""}
                                                                className="w-full bg-transparent text-center focus:outline-none"
                                                            />
                                                        </td>

                                                        {/* 3. Shift Count */}
                                                        <td rowSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                            <input
                                                                type="number"
                                                                value={item.formulaResult || ""}
                                                                className="w-full bg-transparent text-right pr-2 focus:outline-none"
                                                            />
                                                        </td>
                                                    </>
                                                )}




                                            </tr>

                                            {/* Row 2 - Evening + Out */}
                                            {reportView === "Seperate" && (
                                                <>
                                                    <td className=" border border-gray-300 text-[12px] py-0.5 item-center">
                                                        <input
                                                            type="text"
                                                            value={"IN"}
                                                            className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>
                                                    {/* Morning Break In */}
                                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                                                        <input
                                                            type="text"
                                                            value={
                                                                item.firstBreakIn
                                                                    ? moment.utc(item.firstBreakIn).format("HH:mm:ss")
                                                                    : ""
                                                            }
                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                            disabled
                                                        />
                                                    </td>

                                                    <td className="  border border-gray-300 text-[12px] py-0.5 item-center">
                                                        <input
                                                            type="text"
                                                            value={
                                                                item.lunchBreakIn
                                                                    ? moment
                                                                        .utc(item.lunchBreakIn)
                                                                        .format("HH:mm:ss")
                                                                    : ""
                                                            }
                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                            disabled
                                                        />
                                                    </td>
                                                    <td className="  border border-gray-300 text-[12px] py-0.5 item-center">
                                                        <input
                                                            type="text"
                                                            value={
                                                                item.eveningBreakIn
                                                                    ? moment
                                                                        .utc(item.eveningBreakIn)
                                                                        .format("HH:mm:ss")
                                                                    : ""
                                                            }
                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                            disabled
                                                        />
                                                    </td>
                                                </>
                                            )}

                                            <tr>{/* Evening Break In */}</tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

            </div>
            {showModal && selectedBreakSummary && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-800 bg-opacity-50 overscroll-y-hidden">
                    <div className={`relative bg-white rounded-lg p-7 w-[700px] h-[450px]`}>

                        <button
                            className="absolute top-0 right-0 m-1 text-gray-600 hover:text-gray-800 hover:bg-red-400 rounded focus:outline-none "
                            onClick={closeModal}
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
                        <h2 className="text-[15px] font-semibold mb-4">Morning / Evening Summary</h2>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-200 text-gray-800 ">
                                <tr>
                                    <th className="px-1 py-1 text-center font-medium text-[13px]">Break</th>
                                    <th className="px-1 text-center font-medium text-[13px]">Status</th>
                                    <th className="px-1 text-center font-medium text-[13px]">Punch</th>
                                    <th className="px-1 text-center font-medium text-[13px]">Delay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {["morningInOut", "eveningInOut"].map((key) => {
                                    const breakItem = selectedBreakSummary[key];
                                    return (
                                        <tr key={key}>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-left px-1 capitalize">{key}</td>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-left px-1">{breakItem?.status || "-"}</td>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-center px-1">
                                                {breakItem?.punch || "-"}
                                            </td>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-center px-1">{breakItem?.delay || "-"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <h2 className="text-[15px] mt-5 font-semibold mb-4">Break Summary</h2>

                        <table className="w-full border-collapse">
                            <thead className="bg-gray-200 text-gray-800 ">
                                <tr>
                                    <th className="px-1 py-1 text-center font-medium text-[13px]">Break</th>
                                    <th className="px-1 text-center font-medium text-[13px]">Status</th>
                                    <th className="px-1 text-center font-medium text-[13px]">Punch</th>
                                    <th className="px-1 text-center font-medium text-[13px]">Break Duration</th>
                                    <th className="px-1 text-center font-medium text-[13px]">Delay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {["morning", "lunch", "evening"].map((key) => {
                                    const breakItem = selectedBreakSummary[key];
                                    return (
                                        <tr key={key}>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-left px-1 capitalize">{key}</td>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-left px-1">{breakItem?.status || "-"}</td>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-center px-1">
                                                {breakItem?.punch || breakItem?.punches?.in
                                                    ? breakItem?.punch || `${breakItem.punches.out} - ${breakItem.punches.in} `
                                                    : "-"}
                                            </td>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-center px-1">{breakItem?.breakDuration || "-"}</td>
                                            <td className="border border-gray-300 py-1 text-[12px]  text-center px-1">{breakItem?.delay || "-"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                </div>
            )}
        </>
    )
}

export default Permissiontable