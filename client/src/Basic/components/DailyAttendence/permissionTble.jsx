import moment from "moment-timezone";
import React, { useEffect, useState, useRef } from "react";
import Modal from "../../../UiComponents/Modal";

const Permissiontable = ({ reportView, permissionTable, selectedShiftType, handleSavePermission, openModal, selectedBreakSummary, setSelectedBreakSummary, showModal, setShowModal, closeModal, onClose, handlePunchPermissionToggle, showPermissionModal,
    setShowPermissionModal, selectedEmployeePunches, setSelectedEmployeePunches,
    selectedEmployee, setSelectedEmployee, showOtherPunchesModal, setShowOtherPunchesModal
    , selectedEmployeeOtherPunches, setSelectedEmployeeOtherPunches, selectedEmployeeOther, handleSaveAll
    , setSelectedEmployeeOther, handleOtherPunchPermissionToggle, handleSaveOtherPunchPermission, showCombinedModal, setShowCombinedModal

}) => {



    console.log(permissionTable, "permissionTableinmodal");
    // const openPermissionModal = (employee) => {
    //     setSelectedEmployee(employee);
    //     const punchList = (employee.punches || []).map(p => ({
    //         timestamp: p.timestamp,
    //         // isPermission: false
    //     }));
    //     setSelectedEmployeePunches(punchList);
    //     setShowPermissionModal(true);
    // };
    const openOtherPunchesModal = (employee) => {
        setSelectedEmployeeOther(employee);

        const outsidePunches = employee.breakSummary?.outsideTolerance || [];
        const diffTime = (out, inn) => {
            if (!out || !inn || out === "-" || inn === "-") return "-";

            const start = new Date(out);
            const end = new Date(inn);

            if (isNaN(start) || isNaN(end)) return "-";

            let diffSec = Math.floor((end - start) / 1000);
            if (diffSec < 0) return "-";

            const h = String(Math.floor(diffSec / 3600)).padStart(2, '0');
            const m = String(Math.floor((diffSec % 3600) / 60)).padStart(2, '0');
            const s = String(diffSec % 60).padStart(2, '0');

            return `${h}:${m}:${s}`;
        };


        // Pair punches: even index → Out, odd index → In
        const punchList = [];
        for (let i = 0; i < outsidePunches.length; i += 2) {
            const outPunch = outsidePunches[i];
            const inPunch = outsidePunches[i + 1];

            // Clean timestamps (remove .000000 microseconds)
            const outTime = outPunch?.timestamp ? outPunch.timestamp.split('.')[0] : null;
            const inTime = inPunch?.timestamp ? inPunch.timestamp.split('.')[0] : null;
            const diff = diffTime(outTime, inTime);

            punchList.push({
                out: outTime || "-",
                in: inTime || "-",
                permissionTime: diff,           // ⬅️ Added here

                isPermission: outPunch?.isPermission === 1 || inPunch?.isPermission === 1 ? true : false,
            });
        }

        setSelectedEmployeeOtherPunches(punchList);
        setShowOtherPunchesModal(true);
    };


    console.log();

    const openPermissionModal = (employee) => {
        console.log("Employee passed:", employee);

        setSelectedEmployee(employee);

        const punchList = [];

        // Morning In-Out
        if (employee.breakSummary?.morningInOut?.punch &&
            employee.breakSummary.morningInOut.status === "Late Login") {
            punchList.push({
                timestamp: employee.breakSummary.morningInOut.punch,
                type: "Morning In-Out",
                permissionTime: employee.breakSummary.morningInOut.delay,
                status: employee.breakSummary.morningInOut.status || "-",
                isPermission: employee.breakSummary.morningInOut.isPermission === 1

            });
        }

        // Evening In-Out
        if (employee.breakSummary?.eveningInOut?.punch &&
            employee.breakSummary.eveningInOut.status === "Early Logout") {
            punchList.push({
                timestamp: employee.breakSummary.eveningInOut.punch,
                type: "Evening In-Out",
                permissionTime: employee.breakSummary.eveningInOut.delay,

                status: employee.breakSummary.eveningInOut.status || "-",
                isPermission: employee.breakSummary.eveningInOut.isPermission === 1

            });
        }

        console.log("Punch list:", punchList); // Should now contain morning and evening punches
        setSelectedEmployeePunches(punchList);
        setShowPermissionModal(true);
    };


    const openCombinedModal = (employee) => {
        // Sets both datasets
        openPermissionModal(employee);
        openOtherPunchesModal(employee);

        setShowCombinedModal(true);
    };



    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white  rounded-lg shadow-xl p-4 overflow-hidden border border-gray-300">
                    <div className="bg-gray-200 p-2 w-[95vw]  h-[85vh]">
                        <div className="bg-white flex justify-between align-items-center border-b p-2">
                            <h2 className="text-lg font-semibold">Permission</h2>
                            <div className="flex justify-end align-items-center   mx-2">
                                {/* <button
                                    onClick={handleSavePermission}
                                    className="px-3 mr-4  ml-2 bg-green-600 text-white rounded text-xs"
                                >
                                    Update
                                </button> */}
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
                        <div className={` mt-3  p-2  bg-white h-[523px]  overflow-x-auto overflow-y-auto`}>
                            <table className={` ${selectedShiftType === "Hourly" ? "w-[88vw]" : "w-[88vw]"}  border-collapse table-fixed`}>

                                <thead className="bg-gray-200 text-gray-800 border border-gray-400">
                                    <tr>
                                        <th
                                            className={`w-[15px] px-1 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            S.No
                                        </th>

                                        <th
                                            className={`w-6  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            MId
                                        </th>
                                        <th
                                            className={`w-[50px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Emp Name
                                        </th>
                                        <th
                                            className={`w-[30px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Shift
                                        </th>
                                        <th
                                            className={`w-[45px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Department
                                        </th>
                                        <th
                                            className={`w-[65px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Designation
                                        </th>
                                        <th
                                            className={`w-8  py-2 item-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            In Date
                                        </th>
                                        <th className={`w-8 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            In Time
                                        </th>
                                        <th
                                            className={`w-8 py-2 item-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Out Date
                                        </th>
                                        <th className={`w-8 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Out Time
                                        </th>
                                        <th className={`w-[75px] py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Status
                                        </th>

                                        <th
                                            colSpan={reportView === "Seperate" ? 4 : 2}
                                            className={`${reportView === "Single" ? "w-32" : "w-36"} py-2 text-center font-medium text-[12px]  border border-gray-300`}                >
                                            Other Punches
                                        </th>

                                        {/* 
                                        {selectedShiftType === "Hourly" ? (<th className={`w-[40px] py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Status
                                        </th>) : ""} */}
                                        {/* <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Permission
                                        </th> */}


                                    </tr>

                                </thead>


                                <tbody>
                                    {permissionTable?.map((item, index) => {
                                        let mStatus = item.breakSummary?.morningInOut?.status;          // Late
                                        let eStatus = item.breakSummary?.eveningInOut?.status;          // Out Early

                                        let mPerm = item.breakSummary?.morningInOut?.isPermission === 1;
                                        let ePerm = item.breakSummary?.eveningInOut?.isPermission === 1;

                                        let parts = [];

                                        // Morning (Late Login)
                                        if (mStatus === "Late Login") {
                                            if (mPerm) {
                                                parts.push("Permission");
                                            } else {
                                                parts.push("Late Login");
                                            }
                                        }

                                        // Evening (Early Logout)
                                        if (eStatus === "Early Logout") {
                                            if (ePerm) {
                                                parts.push("Permission");
                                            } else {
                                                parts.push("Early Logout");
                                            }
                                        }

                                        let showDelay = parts.join(" & ");


                                        return (
                                            <React.Fragment key={index}>
                                                {/* Row 1 - In + Morning */}
                                                <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                                    {/* S.No rowspan */}
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 py-1.5 text-[11px]  text-center px-1"
                                                    >
                                                        {index + 1}
                                                    </td>

                                                    {/* Employee Id rowspan */}
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={item?.mIdCard}
                                                            className={`w-full  text-right pr-1 bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={item?.firstName}
                                                            className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={item?.shiftType}
                                                            className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={item?.departmentName}
                                                            className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
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
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
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
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
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
                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent 
        ${item.breakSummary?.morningInOut?.status === "Late Login" ? "text-red-600 font-semibold" : ""}`} />
                                                    </td>
                                                    {/* Out Date */}
                                                    <td
                                                        rowSpan={2}
                                                        className="  border border-gray-300 text-[11px] py-0.5 item-center"
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
                                                        className="  border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={
                                                                item.outTime
                                                                    ? moment.utc(item.outTime).format("HH:mm:ss")
                                                                    : ""
                                                            }
                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent 
        ${item.breakSummary?.eveningInOut?.status === "Early Logout" ? "text-red-600 font-semibold" : ""}`} />
                                                    </td>

                                                    <td
                                                        rowSpan={2}
                                                        className="text-left  border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={
                                                                showDelay
                                                            }
                                                            className={`w-full text-left pl-1 bg-transparent  focus:outline-none focus:border-transparent `} />
                                                    </td>

                                                    {reportView === "Seperate" && (
                                                        <>
                                                            <td className=" border border-gray-300 text-[11px] py-0.5 " onClick={() => openCombinedModal(item)}>
                                                                <input
                                                                    type="text" title="Open Modal"

                                                                    value={"OUT"} onClick={() => openCombinedModal(item)}
                                                                    className={`w-full text-center bg-transparent  focus:outline-none focus:border-transparent `}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => openCombinedModal(item)}>
                                                                <input
                                                                    min="0"
                                                                    type="text"
                                                                    value={
                                                                        item.firstBreakOut
                                                                            ? moment
                                                                                .utc(item.firstBreakOut)
                                                                                .format("HH:mm:ss")
                                                                            : ""
                                                                    } title="Open Modal"

                                                                    onFocus={(e) => e.target.select()} onClick={() => openCombinedModal(item)}
                                                                    className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 text-[11px] text-center px-1" onClick={() => openCombinedModal(item)}>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        item.lunchBreakOut
                                                                            ? moment
                                                                                .utc(item.lunchBreakOut)
                                                                                .format("HH:mm:ss")
                                                                            : ""
                                                                    } title="Open Modal"

                                                                    className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                                    onClick={() => openCombinedModal(item)}
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 text-[11px] text-center px-1" onClick={() => openCombinedModal(item)}>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        item.eveningBreakOut
                                                                            ? moment
                                                                                .utc(item.eveningBreakOut)
                                                                                .format("HH:mm:ss")
                                                                            : ""
                                                                    } title="Open Modal"

                                                                    className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                                    onClick={() => openCombinedModal(item)}
                                                                />
                                                            </td>
                                                        </>
                                                    )}
                                                    {reportView === "Single" && (
                                                        <>
                                                            <td colSpan={2} className="border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => openCombinedModal(item)}>
                                                                <input
                                                                    type="text"
                                                                    title="Open Modal"

                                                                    onClick={() => openCombinedModal(item)}
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
                                                                />
                                                            </td>
                                                        </>
                                                    )}


                                                </tr>

                                                {/* Row 2 - Evening + Out */}
                                                {reportView === "Seperate" && (
                                                    <>
                                                        <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                                            <td className=" border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => openCombinedModal(item)}>
                                                                <input
                                                                    type="text"
                                                                    value={"IN"} onClick={() => openCombinedModal(item)}
                                                                    className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                                    title="Open Modal"

                                                                />
                                                            </td>
                                                            {/* Morning Break In */}
                                                            <td className="border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => openCombinedModal(item)}>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        item.firstBreakIn
                                                                            ? moment.utc(item.firstBreakIn).format("HH:mm:ss")
                                                                            : ""
                                                                    }
                                                                    className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                                    title="Open Modal"

                                                                />
                                                            </td>

                                                            <td className="  border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => openCombinedModal(item)}>
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
                                                                    onClick={() => openCombinedModal(item)}
                                                                    title="Open Modal"

                                                                />
                                                            </td>
                                                            <td className="  border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => openCombinedModal(item)}>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        item.eveningBreakIn
                                                                            ? moment
                                                                                .utc(item.eveningBreakIn)
                                                                                .format("HH:mm:ss")
                                                                            : ""
                                                                    }
                                                                    title="Open Modal"

                                                                    className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                                                                    onClick={() => openCombinedModal(item)}
                                                                />
                                                            </td></tr>
                                                    </>
                                                )}

                                                <tr>{/* Evening Break In */}</tr>
                                            </React.Fragment>
                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

            </div>

            {showCombinedModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000]">
                    <div className="bg-white  rounded-lg shadow-xl p-4 overflow-hidden border border-gray-300">

                        <div className="bg-gray-200 p-2 rounded shadow-lg w-[500px]  h-[445px] overflow-y-auto">

                            <div className="bg-white flex justify-between align-items-center pb-1 border-b p-2">
                                <h2 className=" text-[15px] ">
                                    {selectedEmployee?.firstName}
                                </h2>
                                <button
                                    onClick={() => setShowCombinedModal(false)}
                                    className="text-gray-800 h-6 ml-2 bg-red-400 rounded focus:outline-none"
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


                            <div className="bg-white px-3 py-2 mt-3 h-[380px] relative">
                                <h3 className=" mt-1 mb-2 text-[14px]">Employee In & Out</h3>

                                <table className="w-full  border">
                                    <thead className="bg-gray-200  text-[12px]">
                                        <tr>
                                            <th className="border  font-medium px-2 py-1 w-20">Time</th>
                                            <th className="border  font-medium  px-2 py-1 w-20">Status</th>
                                            <th className="border  font-medium px-2 py-1 w-24">Duration</th>

                                            <th className="border  font-medium px-2 py-1 w-20">Permission</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedEmployeePunches?.map((punch, idx) => (
                                            <tr key={idx} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center text-[11px]`}
                                            >                                                <td className="border px-2 py-1 ">
                                                    {moment(punch.timestamp).format("HH:mm:ss")}
                                                </td >
                                                {/* {punch.isPermission ? "Permission" : punch.status} */}
                                                <td className="text-left border px-2 py-1">

                                                    {punch.status} </td >
                                                <td className="border px-2 py-1">{punch.permissionTime}</td>

                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={punch.isPermission}
                                                        onChange={() => handlePunchPermissionToggle(idx)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>



                                <h3 className=" mb-2 mt-2 text-[14px]">Other Punches</h3>

                                <table className="w-full text-[12px]  border">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="border  font-medium px-2 py-1 w-20">Out Time</th>
                                            <th className="border  font-medium px-2 py-1 w-20">In Time</th>
                                            <th className="border  font-medium px-2 py-1 w-24">Duration</th>
                                            <th className="border  font-medium px-2 py-1 w-20">Permission</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {selectedEmployeeOtherPunches?.map((punch, idx) => (
                                            <tr key={idx} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center text-[11px]`}
                                            >
                                                <td className="border px-2 py-1">
                                                    {punch.out !== "-" ? moment(punch.out).format("HH:mm:ss") : "-"}
                                                </td>
                                                <td className="border px-2 py-1">
                                                    {punch.in !== "-" ? moment(punch.in).format("HH:mm:ss") : "-"}
                                                </td>
                                                <td className="border px-2 py-1">{punch.permissionTime}</td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={punch.isPermission}
                                                        onChange={() => handleOtherPunchPermissionToggle(idx)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex justify-end mt-4 absolute right-2  bottom-2">
                                    <button
                                        onClick={handleSaveAll}
                                        className="px-4  bg-green-600 text-white rounded text-[15px]"
                                    >
                                        Save
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Permissiontable