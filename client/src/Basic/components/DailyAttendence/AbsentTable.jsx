import moment from "moment-timezone";
import React, { useEffect, useState, useRef } from "react";


const AbsentTable = ({ selectedShiftType, absentData, reportView }) => {
    return (
        <><div
            className={` mt-3  p-2  bg-white max-h-[600px]  overflow-x-auto overflow-y-auto`}
        >
            <table className={` ${selectedShiftType === "Hourly" ? "w-[105vw]" : "w-[100vw]"}  border-collapse table-fixed`}>

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
                            Actual Worked Hours
                        </th>) : ""}

                        {selectedShiftType === "Hourly" ? (<th className={`w-[45px] py-2 item-center font-medium text-[13px]  border border-gray-300`}>worked Hours (with Break)</th>) : (<th className={`w-[35px] py-2 item-center font-medium text-[13px]  border border-gray-300`}>worked Hours</th>)}


                        {/* <th className={`w-[45px] py-2 item-center font-medium text-[13px]  border border-gray-300`}>
                  {selectedShiftType === "Hourly" ? "worked Hours (with Break)" : "worked Hours"}

                </th> */}

                        {selectedShiftType === "Hourly" ? (<th className={`w-[40px] py-2 item-center font-medium text-[13px]  border border-gray-300`}>worked Hours (without Break and OT)</th>) : (<th className={`w-[35px] py-2 item-center font-medium text-[13px]  border border-gray-300`}>OT Hours</th>)}






                        {
                            selectedShiftType === "Hourly" ? (<th className={`w-[40px] py-2 item-center font-medium text-[13px]  border border-gray-300`}>
                                OT Hours
                            </th>) : (<th className={`w-[30px] py-2 item-center font-medium text-[13px] border border-gray-300`}>
                                Shift Count
                            </th>)
                        }



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

                            
                                <td
                                    rowSpan={2}
                                    className="  border border-gray-300 text-[12px] py-0.5 item-center"
                                >
                                    {selectedShiftType === "Hourly" ? (<input
                                        type="text"
                                        value={
                                            item.actualWorkedTime || ''


                                        }
                                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                    />) : ""}
                                </td>
                                <td
                                    rowSpan={2}
                                    className="  border border-gray-300 text-[12px] py-0.5 item-center"
                                >

                                    {selectedShiftType === "Hourly" ? (<input
                                        type="text"
                                        value={
                                            item.hourlyWorkedTime || ''


                                        }
                                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                    />) : (<input
                                        type="text"
                                        value={
                                            item.totalWorkedTime || ''


                                        }
                                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                    />)}

                                </td>


                                <td
                                    rowSpan={2}
                                    className="  border border-gray-300 text-[12px] py-0.5 item-center"
                                >
                                    {selectedShiftType === "Hourly" ? (<input
                                        type="text"
                                        value={
                                            item.rawWorkedTime || ''


                                        }
                                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                    />) : (<input
                                        type="text"
                                        value={
                                            item.otHours || ''

                                        }
                                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                    />)}
                                </td>





                                {selectedShiftType === "Hourly" ? (<td rowSpan={2}
                                    className="  border border-gray-300 text-[12px] py-0.5 item-center">
                                    <input
                                        type="text"
                                        value={
                                            item.otHours || ''

                                        }
                                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                    />
                                </td>) : (<td
                                    rowSpan={2}
                                    className="  border border-gray-300 text-[12px] py-0.5 item-center"
                                >

                                    <input
                                        type="number"
                                        value={item?.formulaResult}
                                        className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent  `}
                                    />
                                </td>)}



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
             </div> </>
    )
}

export default AbsentTable