import moment from "moment-timezone";
import React from "react";


const AbsentTable = ({ selectedShiftType, absentData, reportView, onClose, onUpdate, onSaveAll, date, shiftData, ShiftTime, shiftTemplateData, setAbsentData, halfDay, setHalfDay, fullDayLeave, setFullDayLeave, handleAddPunch, showPunchModal, setShowPunchModal, selectedRecord, setSelectedRecord, newPunchTime, setNewPunchTime, newPunchList, setNewPunchList, handleSaveAllPunches, singlePunchData, handleSinglePunch, handleSaveSinglePunch }) => {


    const calculateTimeDiff = (start, end) => {
        if (!start || !end) return "";

        const startMoment = moment(start, "HH:mm:ss");
        const endMoment = moment(end, "HH:mm:ss");

        // If end is before start, assume it's next day
        if (endMoment.isBefore(startMoment)) {
            endMoment.add(1, "day");
        }

        const diff = moment.utc(endMoment.diff(startMoment)).format("HH:mm:ss");
        return diff;
    };

    const clickevent = (item) => {
        setSelectedRecord(item);   // current row item
        setShowPunchModal(true);
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white  rounded-lg shadow-xl p-4 overflow-hidden border border-gray-300">
                    <div className="bg-gray-200 p-2 w-[95vw]  h-[85vh]">
                        <div className="bg-white flex justify-between align-items-center border-b p-2">
                            <h2 className="text-lg font-semibold">Leave</h2>
                            <div className="flex justify-end align-items-center   mx-2">




                                <button
                                    onClick={onClose}
                                    className="text-gray-800  ml-3 bg-red-400 rounded focus:outline-none"
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

                            <div className="flex relative mt-2">
                                <p className=" text-sm font-semibold">Miss Punch</p>
                                <button
                                    onClick={handleSaveSinglePunch}
                                    className="px-3 absolute right-[calc(100%-1040px)] py-1  bg-green-600 text-white rounded text-xs"
                                >
                                    Update
                                </button>
                            </div>


                            <table className={` w-[65vw] mt-2  border-collapse table-fixed`}>

                                <thead className="bg-gray-200 text-gray-800 border  border-gray-400">
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
                                            className={`w-[45px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Department
                                        </th>
                                        <th
                                            className={`w-[70px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Designation
                                        </th>
                                        <th
                                            className={`w-12  py-2 item-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            In Date
                                        </th>
                                        <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            In Time
                                        </th>
                                        <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Out Date
                                        </th>

                                        <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Out Time
                                        </th>
                                        <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Worked Hours
                                        </th>



                                    </tr>

                                </thead>



                                <tbody>

                                    {singlePunchData?.length === 0 || singlePunchData?.every(item => !item?.punches || item.punches.length === 0) ? (
                                        <tr>
                                            <td colSpan={reportView === "Seperate" ? 10 : 10}

                                                className="border border-gray-300 py-1.5 text-[11px]  text-center px-1"
                                            >
                                                No Data Available
                                            </td>
                                        </tr>
                                    ) : (

                                        singlePunchData?.map((item, index) => (
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
                                                            value={item?.departmentName
                                                            }
                                                            className={`w-full  text-left pl-2 text-[11px] bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={item?.designationName}
                                                            className={`w-full  text-left pl-2 text-[11px] bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    {/* In Date */}
                                                    <td
                                                        rowSpan={2}
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="date"
                                                            // value={item.inDate || (item.inTime ? moment.utc(item.inTime)?.format("DD-MM-YYYY") : "")}
                                                            value={date}

                                                            onChange={(e) => onUpdate(index, "inDate", e.target.value)}
                                                            readOnly
                                                            className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    <td
                                                        rowSpan={2}
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
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

                                                            onChange={(e) => handleSinglePunch(index, "inTimeEdit", e.target.value)}
                                                            disabled={item?.shiftName || item?.isLeave}
                                                            onFocus={(e) => e.target.select()}
                                                            className={`w-full bg-transparent  text-center focus:outline-none focus:border-transparent  `}
                                                        />
                                                    </td>
                                                    {/* out Date */}
                                                    <td
                                                        rowSpan={2}
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="date"
                                                            // value={item.outDate || date}
                                                            value={date}

                                                            onChange={(e) => handleSinglePunch(index, "outDate", e.target.value)}
                                                            readOnly

                                                            className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    <td
                                                        rowSpan={2}
                                                        className="  border border-gray-300 text-[11px] py-0.5 item-center"
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

                                                            onChange={(e) => handleSinglePunch(index, "outTimeEdit", e.target.value)}
                                                            disabled={item?.shiftName || item?.isLeave}

                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                        />


                                                    </td>
                                                    <td rowSpan={2} className="border border-gray-300 text-[11px] py-0.5 text-center">
                                                        {
                                                            calculateTimeDiff(
                                                                item.inTimeEdit || (item.inTime ? moment.utc(item.inTime).format("HH:mm:ss") : ""),
                                                                item.outTimeEdit || (item.outTime ? moment.utc(item.outTime).format("HH:mm:ss") : "")
                                                            )
                                                        }
                                                    </td>


                                                </tr>
                                                <tr></tr>
                                            </React.Fragment>
                                        ))
                                    )}


                                </tbody>
                            </table>

                            <div className="flex relative mt-4">
                                <p className=" text-sm font-semibold">Full Day Leave</p>
                                <button
                                    onClick={onSaveAll}
                                    className="px-3 absolute right-[calc(100%-1200px)] py-1  bg-green-600 text-white rounded text-xs"
                                >
                                    Update
                                </button>
                            </div>
                            <table className={` w-[75vw] mt-2  border-collapse table-fixed`}>

                                <thead className="bg-gray-200 text-gray-800 border  border-gray-400">
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
                                        <th className={`w-8 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Leave
                                        </th>
                                        <th
                                            className={`w-[40px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Shift
                                        </th>
                                        <th
                                            className={`w-[40px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Present
                                        </th>
                                        <th
                                            className={`w-[45px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Department
                                        </th>
                                        <th
                                            className={`w-[70px]  py-2 text-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            Designation
                                        </th>
                                        <th
                                            className={`w-12  py-2 item-center font-medium text-[12px]  border border-gray-300`}
                                        >
                                            In Date
                                        </th>
                                        <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            In Time
                                        </th>
                                        <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Out Date
                                        </th>

                                        <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Out Time
                                        </th>
                                        <th className={`w-12 py-2 item-center font-medium text-[12px]  border border-gray-300`}>
                                            Worked Hours
                                        </th>



                                    </tr>

                                </thead>
                                <tbody>
                                    {absentData?.length === 0 ? (
                                        <tr>
                                            <td colSpan={13}

                                                className="border border-gray-300 py-1.5 text-[11px]  text-center px-1"
                                            >
                                                No Data Available

                                            </td>
                                        </tr>
                                    ) : (
                                        absentData?.map((item, index) => (
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
                                                            type="checkbox"
                                                            checked={item?.isLeave}
                                                            onChange={(e) => {
                                                                const updated = structuredClone(absentData);
                                                                updated[index].isLeave = e.target.checked;

                                                                // Optional: clear in/out time when leave is checked
                                                                if (e.target.checked) {
                                                                    updated[index].inTimeEdit = "";
                                                                    updated[index].outTimeEdit = "";
                                                                    updated[index].shiftName = "";
                                                                    updated[index].shiftTime = "";
                                                                }

                                                                setAbsentData(updated);
                                                            }}
                                                            className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <select className="w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent"
                                                            value={item.shiftName || ""}
                                                            disabled={item?.isLeave}
                                                            onChange={(e) => onUpdate(index, "shiftName", e.target.value)}
                                                        >
                                                            <option value="">Select</option>

                                                            {shiftTemplateData?.data?.flatMap(t => t.ShiftTemplateItems || []).map((s) => (
                                                                <option key={s.id} value={s.shiftId}>
                                                                    {s.shift?.name}
                                                                </option>
                                                            ))}
                                                        </select>

                                                    </td>
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <select className="w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent"
                                                            value={item.shiftTime || ""}
                                                            disabled={!item?.shiftName}
                                                            onChange={(e) => onUpdate(index, "shiftTime", e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            {ShiftTime.map((st) => (
                                                                <option key={st.value} value={st.value}>
                                                                    {st.show}
                                                                </option>
                                                            ))}

                                                        </select>

                                                    </td>

                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={item?.departmentName
                                                            }
                                                            className={`w-full  text-left pl-2 text-[11px] bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={item?.designationName}
                                                            className={`w-full  text-left pl-2 text-[11px] bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    {/* In Date */}
                                                    <td
                                                        rowSpan={2}
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="date"
                                                            // value={item.inDate || (item.inTime ? moment.utc(item.inTime)?.format("DD-MM-YYYY") : "")}
                                                            value={date}

                                                            onChange={(e) => onUpdate(index, "inDate", e.target.value)}
                                                            readOnly
                                                            className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    <td
                                                        rowSpan={2}
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
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
                                                            disabled={item?.shiftName || item?.isLeave}
                                                            onFocus={(e) => e.target.select()}
                                                            className={`w-full bg-transparent  text-center focus:outline-none focus:border-transparent  `}
                                                        />
                                                    </td>
                                                    {/* out Date */}
                                                    <td
                                                        rowSpan={2}
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="date"
                                                            // value={item.outDate || date}
                                                            value={date}

                                                            onChange={(e) => onUpdate(index, "outDate", e.target.value)}
                                                            readOnly

                                                            className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    <td
                                                        rowSpan={2}
                                                        className="  border border-gray-300 text-[11px] py-0.5 item-center"
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
                                                            disabled={item?.shiftName || item?.isLeave}

                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                        />


                                                    </td>
                                                    <td rowSpan={2} className="border border-gray-300 text-[11px] py-0.5 text-center">
                                                        {
                                                            calculateTimeDiff(
                                                                item.inTimeEdit || (item.inTime ? moment.utc(item.inTime).format("HH:mm:ss") : ""),
                                                                item.outTimeEdit || (item.outTime ? moment.utc(item.outTime).format("HH:mm:ss") : "")
                                                            )
                                                        }
                                                    </td>


                                                </tr>
                                                <tr></tr>
                                            </React.Fragment>
                                        ))
                                    )}

                                </tbody>
                            </table>



                            <p className="mt-3 text-sm font-semibold">Half Day Leave</p>

                            <table className={` ${selectedShiftType === "Hourly" ? "w-[85vw]" : "w-[85vw]"} mt-3  border-collapse table-fixed`}>

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
                                    {halfDay?.length === 0 || halfDay?.every(item => !item?.punches || item.punches.length === 0) ? (
                                        <tr>
                                            <td colSpan={reportView === "Seperate" ? 14 : 12}


                                                className="border border-gray-300 py-1.5 text-[11px]  text-center px-1"
                                            >
                                                No Data Available
                                            </td>
                                        </tr>
                                    ) : (
                                        halfDay?.map((item, index) => (
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
                                                            className={`w-full  text-left pl-2 bg-transparent text-[11px]   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>
                                                    <td
                                                        rowSpan={2}
                                                        className="border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={item?.departmentName
                                                            }
                                                            className={`w-full  text-left pl-2 bg-transparent text-[11px]   focus:outline-none focus:border-transparent `}
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
                                                        rowSpan={2} onClick={() => clickevent(item)}
                                                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={
                                                                item.inTime
                                                                    ? moment.utc(item.inTime).format("DD-MM-YYYY")
                                                                    : ""
                                                            }
                                                            title="Open Modal"

                                                            className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                        />
                                                    </td>

                                                    {/* In Time */}
                                                    <td
                                                        rowSpan={2} onClick={() => clickevent(item)}
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
                                                            title="Open Modal"

                                                            onFocus={(e) => e.target.select()}
                                                            className={`w-full bg-transparent  text-center focus:outline-none focus:border-transparent  `}
                                                        />
                                                    </td>
                                                    {/* Out Date */}
                                                    <td
                                                        rowSpan={2} onClick={() => clickevent(item)}
                                                        className="  border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={
                                                                item.outTime
                                                                    ? moment.utc(item.outTime).format("DD-MM-YYYY")
                                                                    : ""
                                                            }
                                                            title="Open Modal"

                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                        />
                                                    </td>
                                                    {/* Out Time*/}

                                                    <td
                                                        rowSpan={2} onClick={() => clickevent(item)}
                                                        className="  border border-gray-300 text-[11px] py-0.5 item-center"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={
                                                                item.outTime
                                                                    ? moment.utc(item.outTime).format("HH:mm:ss")
                                                                    : ""
                                                            }
                                                            title="Open Modal"

                                                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                                                        />
                                                    </td>

                                                    {reportView === "Seperate" && (
                                                        <>

                                                            <td className=" border  border-gray-300 text-[11px] py-0.5 " onClick={() => clickevent(item)}>
                                                                <input
                                                                    type="text"
                                                                    value={"OUT"}
                                                                    className={`w-full text-center bg-transparent  focus:outline-none focus:border-transparent `}
                                                                    title="Open Modal"
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => clickevent(item)}>
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
                                                                    title="Open Modal"

                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 text-[11px] text-center px-1" onClick={() => clickevent(item)}>
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
                                                                    title="Open Modal"
                                                                />
                                                            </td>
                                                            <td className="border border-gray-300 text-[11px] text-center px-1" onClick={() => clickevent(item)}>
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
                                                                    title="Open Modal"
                                                                />
                                                            </td>
                                                        </>
                                                    )}
                                                    {reportView === "Single" && (
                                                        <>
                                                            <td colSpan={2} className="border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => clickevent(item)}>
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
                                                                    title="Open Modal"
                                                                />
                                                            </td>
                                                        </>
                                                    )}







                                                </tr>

                                                {/* Row 2 - Evening + Out */}
                                                {reportView === "Seperate" && (
                                                    <>    <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>

                                                        <td className=" border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => clickevent(item)}>
                                                            <input
                                                                type="text"
                                                                value={"IN"}
                                                                className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                                                                title="Open Modal"

                                                            />
                                                        </td>
                                                        {/* Morning Break In */}
                                                        <td className="border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => clickevent(item)}>
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

                                                        <td className="  border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => clickevent(item)}>
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
                                                                title="Open Modal"
                                                            />
                                                        </td>
                                                        <td className="  border border-gray-300 text-[11px] py-0.5 item-center" onClick={() => clickevent(item)}>
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
                                                                title="Open Modal"
                                                            />
                                                        </td>
                                                    </tr>
                                                    </>
                                                )}

                                                <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>{/* Evening Break In */}</tr>
                                            </React.Fragment>
                                        ))
                                    )}



                                </tbody>
                            </table>
                        </div>




                    </div>
                </div>
            </div>
            {showPunchModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[1000]">
                    <div className="bg-white rounded-lg shadow-xl p-4 overflow-hidden border border-gray-300">

                        <div className="bg-gray-200 p-2 rounded shadow-lg w-[600px] h-[405px] overflow-y-auto">

                            {/* Header */}
                            <div className="bg-white flex justify-between align-items-center pb-1 border-b p-2">
                                <h2 className="text-[15px]">
                                    {selectedRecord?.firstName}
                                </h2>

                                <button
                                    onClick={() => {
                                        setNewPunchTime('')
                                        setShowPunchModal(false)
                                    }}
                                    className="text-gray-800 h-6 ml-2 bg-red-400 rounded focus:outline-none"
                                >
                                    <svg
                                        className="h-6 w-6 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            d="M14.348 5.652a.999.999 0 00-1.414 0L10 8.586l-2.93-2.93a.999.999 0 10-1.414 1.414L8.586 10l-2.93 2.93a.999.999 0 101.414 1.414L10 11.414l2.93 2.93a.999.999 0 101.414-1.414L11.414 10l2.93-2.93a.999.999 0 000-1.414z"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="bg-white px-3 py-2 mt-2 h-[340px] relative">
                                <div className="flex gap-x-12">
                                    <div className="div w-[200px]">
                                        {/* Existing Punch List */}
                                        <h3 className="mt-1 mb-2 text-[14px]">Existing Punches</h3>

                                        <table className="w-full text-[12px] mt-4  border">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th className="border px-2 py-1 w-12">Type</th>
                                                    <th className="border px-2 py-1 w-12">Time</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {selectedRecord?.punches?.length > 0 ? (
                                                    selectedRecord.punches.map((p, idx) => (
                                                        <tr
                                                            key={idx}
                                                            className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center`}
                                                        >
                                                            <td className="border px-2 py-1">
                                                                {`${idx % 2 === 0 ? "IN" : "OUT"}`}
                                                            </td>
                                                            <td className="border px-2 py-1">
                                                                {moment(p.timestamp).format("HH:mm:ss")}
                                                            </td>


                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={2}
                                                            className="text-gray-500 border px-2 py-2 text-center"
                                                        >
                                                            No punches available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="div w-[300px]">

                                        <div className="flex gap-3 items-center mb-2">
                                            <h3 className="mb-2 mt-1 text-[14px]">Add New Punch</h3>

                                            <input
                                                type="time"
                                                step="1"
                                                className="border px-1 text-[12px]"
                                                value={newPunchTime}
                                                onChange={(e) => setNewPunchTime(e.target.value)}
                                            />

                                            <button
                                                className="px-3 bg-blue-600  py-1 text-white text-xs rounded"
                                                onClick={handleAddPunch}
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {/* Table of New Punches */}
                                        <table className="w-[200px] text-[12px] border">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th className="border px-2 py-1 w-12">Type</th>
                                                    <th className="border px-2 py-1 w-12">Time</th>                                                </tr>
                                            </thead>

                                            <tbody>
                                                {selectedRecord?.newPunchList?.length > 0 ? (
                                                    selectedRecord.newPunchList.map((p, i) => (
                                                        <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center`}
                                                        >
                                                            <td className="border px-2 py-1">
                                                                {`${i % 2 === 0 ? "IN" : "OUT"}`}
                                                            </td>
                                                            <td className="border px-2 py-1">
                                                                {moment(p.timestamp).format("HH:mm:ss")}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={2} className="text-gray-500 py-2 text-center">No new punches added</td>
                                                    </tr>
                                                )}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Save Buttons */}
                                <div className="flex justify-end mt-4 absolute right-2 bottom-2">


                                    <button
                                        className="px-4 bg-green-600 text-white rounded text-[15px]"
                                        onClick={handleSaveAllPunches}
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

export default AbsentTable