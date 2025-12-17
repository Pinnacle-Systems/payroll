// import { useState, useRef, useEffect } from "react";
// import dayjs from "dayjs";
// import {
//   DateInput, TextInput, customSelectStyles,
// } from "../../../Inputs";
// import Select from "react-select";
// import { ShiftTime } from "../../../Utils/DropdownData";
// import Swal from "sweetalert2";
// import { Check } from "lucide-react";

// export default function LeaveCalendar({ saveData, mobileNumber, setMobileNumber, department,
//   setForm,
//   generateLeaveRows,
//   readOnly,
//   leaveDetails,
//   setLeaveDetails,
//   id,
//   setDate,
//   date,
//   employeeId,
//   setEmployeeId,
//   employeeName,
//   setEmployeeName,
//   designation,
//   setDesignation,
//   fromDate, setFromDate, toDate, setToDate,
//   docId, leaveSummary,

//   totalDays,
//   childRecord,
//   form,
//   setReadOnly,
//   setId,
//   employee,
//   setDepartment,
//   LeaveType }) {
//   const [currentMonth, setCurrentMonth] = useState(dayjs());
//   const payref = useRef(null);
//   useEffect(() => {
//     if (form && !readOnly && payref.current) {
//       payref.current.focus();
//     }
//   }, [form, readOnly]);
//   const today = dayjs();
//   const startOfMonth = currentMonth.startOf("month");
//   const daysInMonth = currentMonth.daysInMonth();
//   const [popupOpen, setPopupOpen] = useState(false);


//   const [activeRange, setActiveRange] = useState([]);
//   const [highlighted, setHighlighted] = useState([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState(null);
//   const [popupLeave, setPopupLeave] = useState({
//     leaveId: "",
//     shiftTime: "",
//   });




//   const allDays = Array.from({ length: daysInMonth }, (_, i) =>
//     startOfMonth.add(i, "day").format("YYYY-MM-DD")
//   );

//   const getRange = (start, end) => {
//     const range = [];
//     const s = start < end ? start : end;
//     const e = start < end ? end : start;
//     for (let i = s; i <= e; i++) {
//       range.push(allDays[i]);
//     }
//     return range;
//   };
//   useEffect(() => {

//     if (!activeRange || activeRange.length === 0) return;
//     setLeaveDetails((prev) => {
//       // keep existing rows if same date
//       const map = new Map(prev?.map(r => [r.date, r]));

//       return activeRange.map(date => {
//         return (
//           map?.get(date) || {
//             date,
//             leaveId: "",
//             shiftTime: "",
//             count: "",
//             notes: "",
//             isApproved: ""
//           }
//         );
//       });
//     });
//   }, [activeRange]);

//   // Start drag / click
//   const handleMouseDown = (index) => {
//     setIsDragging(true);
//     setDragStart(index);
//     setHighlighted([allDays[index]]);
//   };

//   // Drag over cells
//   const handleMouseEnter = (index) => {
//     if (!isDragging || dragStart === null) return;
//     setHighlighted(getRange(dragStart, index));
//   };

//   // Finish drag / click
//   const handleMouseUp = (index) => {
//     if (!isDragging) return;

//     const finalRange =
//       highlighted.length > 1 ? highlighted : [allDays[index]];

//     // same date click → toggle popup
//     if (
//       finalRange.length === 1 &&
//       activeRange.length === 1 &&
//       activeRange[0] === finalRange[0]
//     ) {
//       setPopupOpen(false);
//       setPopupLeave({ leaveId: "", shiftTime: "" });

//     } else {
//       setActiveRange(finalRange);
//       setHighlighted(finalRange);
//       setPopupOpen(true);
//     }

//     setIsDragging(false);
//     setDragStart(null);
//   };



//   // Stop drag if mouse released outside
//   useEffect(() => {
//     const stopDrag = () => {
//       if (isDragging) {
//         setIsDragging(false);
//         setDragStart(null);
//       }
//     };
//     window.addEventListener("mouseup", stopDrag);
//     return () => window.removeEventListener("mouseup", stopDrag);
//   }, [isDragging]);
//   const EmployeeOptions =
//     employee?.data
//       ?.filter((item) => item?.active === true)
//       ?.map((val) => ({
//         value: val?.id,
//         label: val?.idNumber,
//         firstName: val?.firstName,
//         joiningDate: val?.joiningDate,
//         designation: val?.designation,
//         department: val?.department,
//         aadharNo: val?.aadharNo,
//         mobileNumber: val?.mobileNumber,
//       })) || [];
//   const handleInputChange = (value, index, field) => {
//     const newBlend = structuredClone(leaveDetails);
//     newBlend[index][field] = value;

//     if (field === "shiftTime") {
//       const shift = value;
//       if (shift === "Fully") newBlend[index].count = "1";
//       else if (shift === "FirstHalf" || shift === "secondHalf") newBlend[index].count = "0.5";
//       else newBlend[index].count = "";
//     }

//     // validate leaveId with new value
//     if (["count", "leaveId", "shiftTime"].includes(field)) {
//       const leaveId = field === "leaveId" ? value : newBlend[index].leaveId;
//       if (leaveId) {
//         const requestedTotalInt = newBlend.reduce((sum, row) => {
//           if (row.leaveId === leaveId) return sum + Math.round((parseFloat(row.count) || 0) * 100);
//           return sum;
//         }, 0);

//         const leave = (leaveSummary || []).find((l) => l.leaveId === leaveId);
//         const remainingInt = Math.round(((leave?.remainingDays || 0) * 100));

//         if (remainingInt <= 0) {
//           Swal.fire({
//             icon: "error",
//             title: "No Remaining Days",
//             text: `${leave ? leave.leaveName : "Selected leave"} has no remaining days`,
//           });
//           resetLeaveId(index);
//           return;
//         }

//         if (requestedTotalInt > remainingInt) {
//           Swal.fire({
//             icon: "error",
//             title: "Leave Limit Exceeded",
//             html: `You requested <b>${(requestedTotalInt / 100)}</b> days.<br>Only <b>${(remainingInt / 100)}</b> day(s) available for <b>${leave.leaveName}</b>.`,
//           });
//           resetLeaveId(index);
//           return;
//         }
//       }
//     }

//     setLeaveDetails(newBlend);
//   };

//   return (
//     <>
//       <div className="  flex flex-col bg-gray-100">
//         <div className="border-b py-2 px-4 mx-3 flex  justify-between items-center sticky top-0 z-10 bg-white">
//           <div className="flex items-center gap-2">
//             <h2 className=" -ml-2   py-0.5 master-header">
//               Leave Request
//             </h2>
//           </div>
//           <div className="flex gap-2">
//             <div>
//               {readOnly && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setReadOnly(false);
//                   }}
//                   className="px-3 py-1 font-sans text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>
//             <button
//               type="button"
//               onClick={() => {
//                 setForm(false);
//                 setId("");
//               }}
//               className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"
//             >
//               Back
//             </button>
//             <div className="flex gap-2">
//               {!readOnly && (
//                 <button
//                   type="button"
//                   onClick={saveData}
//                   className="px-3 py-1 font-sans hover:bg-green-600 hover:text-white rounded text-green-600 
//                           border border-green-600 flex items-center gap-1 text-xs"
//                 >
//                   <Check size={14} />
//                   {id ? "Update" : "Save"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>


//         <div className="space-y-3 mx-2 my-2">
//           <div className="grid grid-cols-4 md:grid-cols-4 gap-2">
//             <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1 h-[170px]">
//               <h2 className="font-medium text-slate-700 mb-2">Basic Details</h2>
//               <div className="flex gap-4 gap-x-6">

//                 <TextInput
//                   name="Leave Request Id"
//                   type="text"
//                   value={docId}
//                   // setValue={setDocId}
//                   required={true}
//                   readOnly={readOnly}
//                   disabled={childRecord.current > 0}
//                 />

//                 <div className="w-[120px]">
//                   <DateInput
//                     name="Request Date"
//                     value={date}
//                     setValue={setDate}
//                     required={true}
//                     readOnly={readOnly}
//                     disabled={childRecord.current > 0}

//                   />
//                 </div>

//               </div>

//             </div>
//             <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-2">
//               <h2 className="font-medium text-slate-700 mb-2">Employee Details</h2>
//               <div className="flex gap-4 gap-x-6">

//                 <div className="w-40 ">
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">
//                     ID Card No
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <Select
//                     ref={payref}

//                     options={EmployeeOptions}
//                     value={
//                       EmployeeOptions?.find(
//                         (opt) => opt?.value === employeeId
//                       ) || null
//                     }
//                     onChange={(selected) => {
//                       setEmployeeId(selected?.value || "");
//                       setEmployeeName(selected?.firstName || "");

//                       setDesignation(
//                         selected?.designation?.name || ""
//                       );
//                       setDepartment(selected?.department?.name);

//                       setMobileNumber(selected?.mobileNumber || "");
//                     }}
//                     placeholder="Select Id"
//                     isClearable={false} // same as required
//                     isDisabled={readOnly || childRecord.current > 0}
//                     isSearchable
//                     menuShouldScrollIntoView={false}
//                     maxMenuHeight={150} // <-- Reduce height here
//                     onInputChange={(value) => value.toUpperCase()}
//                     className="w-full px-1 -ml-1 text-xs rounded-lg
//               focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
//               transition-all duration-150 shadow-sm"
//                     styles={customSelectStyles}
//                   />
//                 </div>
//                 <TextInput
//                   name="Employee Name"
//                   type="text"
//                   value={employeeName}
//                   // setValue={setEmployeeName}
//                   // required={true}
//                   readOnly={readOnly}
//                   disabled={childRecord.current > 0}
//                 />

//                 <div className="w-52">
//                   <TextInput
//                     name="DepartMent"
//                     type="text"
//                     value={department}
//                     // setValue={setDepartment}
//                     // required={true}
//                     readOnly={readOnly}
//                     disabled={childRecord.current > 0}
//                   />
//                 </div>
//                 <div className="w-52">
//                   <TextInput
//                     name="Designation"
//                     type="text"
//                     value={designation}
//                     // setValue={setDesignation}
//                     // required={true}
//                     readOnly={readOnly}
//                     disabled={childRecord.current > 0}
//                   />
//                 </div>

//               </div>

//             </div>
//             <div className={`border col-span-1 border-slate-200  rounded-md shadow-sm flex p-2 gap-x-8 overflow-auto bg-white max-h-[170px] overflow-y-auto `}>
//               <div className="   ">
//                 <h2 className="font-medium text-slate-700 mb-2">leave Availability</h2>
//                 <table className="w-[300px] border-collapse table-fixed  ">
//                   <thead className="bg-gray-200 text-gray-800">
//                     <tr>

//                       <th className="w-12  py-2 text-center font-medium text-[12px]">
//                         Leave Type
//                       </th>
//                       <th
//                         className={`w-6 py-2 item-center font-medium text-[12px] `}
//                       >
//                         Days Available
//                       </th>

//                     </tr>
//                   </thead>
//                   <tbody>

//                     {
//                       leaveSummary?.length === 0 ? (<tr>
//                         <td colSpan={2} rowSpan={1}

//                           className="border border-gray-300 py-1.5 text-[10px]  text-center px-1"
//                         >
//                           No Data Available

//                         </td>
//                       </tr>) : (leaveSummary?.map((type, index) => (
//                         <tr key={index} className="w-full table-row">


//                           <td className="border border-gray-300 py-1.5">

//                             <input value={type?.leaveName} className={`w-full text-[11px] bg-transparent text-left pl-2 focus:outline-none ${readOnly ? "text-gray-600" : "text-black"
//                               }`} />

//                           </td>

//                           <td className="border border-gray-300  py-0.5 text-center">
//                             <input
//                               type="number"
//                               value={type?.remainingDays}
//                               className={` text-right w-full pr-2  bg-transparent text-[11px] focus:outline-none 
//             ${readOnly ? "text-gray-600" : "text-black"}`}
//                               readOnly
//                             />
//                           </td>


//                         </tr>
//                       )))
//                     }


//                   </tbody>

//                 </table>
//               </div>
//             </div>

//           </div>
//         </div>

//         <div className="flex gap-x-3">
//           <div className="flex justify-start ml-2 mt-1">
//             <div
//               className={`bg-white p-2 rounded-md shadow-sm transition-all duration-300 ${activeRange.length > 0 ? "w-[600px]" : "w-[420px]"} `}

//             >
//               <div className="flex justify-between items-center mb-2">
//                 <button onClick={() => setCurrentMonth(m => m.subtract(1, "month"))}>
//                   ◀
//                 </button>

//                 <span className="font-medium">
//                   {currentMonth.format("MMMM YYYY")}
//                 </span>

//                 <button onClick={() => setCurrentMonth(m => m.add(1, "month"))}>
//                   ▶
//                 </button>
//               </div>

//               <h2 className="font-medium text-slate-700 mb-2">
//                 Choose Date
//               </h2>

//               <div className="grid grid-cols-7 gap-2 select-none">
//                 {/* Day headers - Add this section */}
//                 {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//                   <div key={day} className="text-center text-xs font-medium text-gray-500">
//                     {day}
//                   </div>
//                 ))}
//                 {Array.from({ length: startOfMonth.day() }).map((_, i) => (
//                   <div key={`empty-${i}`} className="h-9"></div>
//                 ))}
//                 {allDays.map((date, index) => {
//                   const day = currentMonth.startOf("month").add(index, "day");
//                   const isHighlighted = highlighted.includes(date);
//                   const showPopup =
//                     popupOpen &&
//                     activeRange.length > 0 &&
//                     index === allDays.indexOf(activeRange[0]);
//                   const isWeekend = day.day() === 0 || day.day() === 6; // Sunday or Saturday
//                   const isToday = date === today.format("YYYY-MM-DD");

//                   return (
//                     <div
//                       key={date}
//                       className="relative"
//                       onMouseDown={() => employeeId && handleMouseDown(index)}
//                       onMouseEnter={() => employeeId && handleMouseEnter(index)}
//                       onMouseUp={() => employeeId && handleMouseUp(index)}
//                     >
//                       <div
//                         className={`
//             h-9 text-sm flex flex-col items-center justify-center rounded-lg cursor-pointer
//             ${isHighlighted
//                             ? "bg-violet-600 text-white"
//                             : isToday
//                               ? "bg-blue-100 border border-blue-300"
//                               : isWeekend
//                                 ? "bg-gray-50 text-gray-500"
//                                 : "hover:bg-indigo-100"
//                           }
//           `}
//                       >
//                         <span className="text-xs font-medium">
//                           {day.date()}
//                         </span>
//                       </div>

//                       {showPopup && (
//                         <div
//                           className="absolute top-0 left-14 bg-white border shadow-lg rounded-lg p-3 w-64 z-20"
//                           onMouseDown={(e) => e.stopPropagation()}
//                         >
//                           <div className="flex justify-between items-center mb-2">
//                             <p className="text-sm font-semibold">
//                               {activeRange.length === 1
//                                 ? day.format("DD MMM YYYY")
//                                 : `${activeRange[0]} - ${activeRange[activeRange.length - 1]}`}
//                             </p>
//                             <button
//                               onClick={() => {
//                                 setPopupOpen(false);
//                                 setHighlighted([]);
//                                 setPopupLeave({ leaveId: "", shiftTime: "" });

//                               }}
//                               className="text-gray-500 hover:text-black"
//                             >
//                               ✕
//                             </button>
//                           </div>

//                           {/* Leave Type */}
//                           <select
//                             value={popupLeave.leaveId}
//                             onChange={(e) =>
//                               setPopupLeave((p) => ({ ...p, leaveId: e.target.value }))
//                             }
//                             className="w-full border rounded px-2 py-1 text-xs mb-2"
//                           >
//                             <option value="">Select Leave Type</option>
//                             {LeaveType?.data?.map((t) => (
//                               <option key={t.id} value={t.id}>
//                                 {t.name}
//                               </option>
//                             ))}
//                           </select>

//                           {/* Shift Time */}
//                           <select
//                             className="w-full border rounded px-2 py-1 text-xs mb-2"
//                             value={popupLeave.shiftTime}
//                             onChange={(e) =>
//                               setPopupLeave((p) => ({ ...p, shiftTime: e.target.value }))
//                             }
//                           >
//                             <option value="">Select Shift</option>
//                             {ShiftTime.map((st) => (
//                               <option key={st.value} value={st.value}>
//                                 {st.show}
//                               </option>
//                             ))}
//                           </select>

//                           {/* Apply button in popup */}
//                           <button className="px-3 py-1  text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-600 text-xs rounded"
//                             onClick={() => {
//                               if (!popupLeave.leaveId) {
//                                 Swal.fire("Select Leave Type first!");
//                                 return;
//                               }

//                               const selectedLeaveId = parseInt(popupLeave.leaveId); // convert to number
//                               const shift = popupLeave.shiftTime;

//                               // Calculate count based on shift
//                               let countValue = "";
//                               if (shift === "Fully") countValue = "1";
//                               else if (shift === "FirstHalf" || shift === "SecondHalf") countValue = "0.5";

//                               const leave = leaveSummary.find(l => l.leaveId === selectedLeaveId);
//                               if (!leave || leave.remainingDays <= 0) {
//                                 Swal.fire("No Remaining Days", `${leave?.leaveName || "Selected leave"} has no remaining days`);
//                                 return;
//                               }

//                               // Validate total requested including this new selection
//                               const totalRequestedInt = leaveDetails.reduce((sum, row) => {
//                                 if (activeRange.includes(row.date)) {
//                                   return sum + Math.round(parseFloat(countValue) * 100);
//                                 } else if (row.leaveId === selectedLeaveId) {
//                                   return sum + Math.round((parseFloat(row.count) || 0) * 100);
//                                 }
//                                 return sum;
//                               }, 0);

//                               const remainingInt = Math.round((leave.remainingDays || 0) * 100);

//                               if (totalRequestedInt > remainingInt) {
//                                 Swal.fire({
//                                   icon: "error",
//                                   title: "Leave Limit Exceeded",
//                                   html: `You requested <b>${(totalRequestedInt / 100)}</b> days.<br>Only <b>${(remainingInt / 100)}</b> day(s) available for <b>${leave.leaveName}</b>.`,
//                                 });
//                                 return;
//                               }

//                               // Apply leaveId, shiftTime, and count
//                               setLeaveDetails(prev =>
//                                 prev.map(row =>
//                                   activeRange.includes(row.date)
//                                     ? { ...row, leaveId: selectedLeaveId, shiftTime: shift, count: countValue }
//                                     : row
//                                 )
//                               );

//                               setPopupOpen(false);
//                               setHighlighted([]);
//                             }}
//                           >
//                             Apply
//                           </button>




//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           <div className=" max-h-[315px] p-2 mt-1 rounded-md shadow-sm transition-all duration-300 w-full mr-3 bg-white overflow-y-auto ">
//             <h2>Leave Entry</h2>
//             <table className={`${id ? "w-[840px]" : "w-[800px]"} border-collapse table-fixed max-h-[300px]`}>
//               <thead className="bg-gray-200 text-gray-800">
//                 <tr>
//                   <th
//                     className={`w-[6px] px-1 text-center font-medium text-[12px] `}
//                   >
//                     S.No
//                   </th>
//                   <th className="w-6 px-2 py-2 text-center font-medium text-[12px]">
//                     Date
//                   </th>
//                   <th
//                     className={`w-12 px-4 py-2 text-center font-medium text-[12px] `}
//                   >
//                     Leave Type
//                   </th>




//                   <th
//                     className={`w-8 py-2 item-center font-medium text-[12px] `}
//                   >
//                     Duration
//                   </th>

//                   <th
//                     className={`w-8 py-2 item-center font-medium text-[12px] `}
//                   >
//                     Count (Days)
//                   </th>


//                   <th
//                     className={`w-16 py-2 item-center font-medium text-[12px] `}
//                   >
//                     Reason
//                   </th>
//                   {
//                     id ? (<th
//                       className={`w-8 py-2 item-center font-medium text-[12px] `}
//                     >
//                       Status
//                     </th>) : ''
//                   }
//                 </tr>
//               </thead>
//               <tbody>
//                 {
//                   leaveDetails?.length === 0 ? (<tr>
//                     <td colSpan={6} rowSpan={1}

//                       className="border border-gray-300 py-1.5 text-[11px]  text-center px-1"
//                     >
//                       Choose from and to date first

//                     </td>
//                   </tr>) : (

//                     leaveDetails?.map((item, index) => (
//                       <tr className=" w-full table-row">
//                         <td className="border border-gray-300 py-1.5  text-center px-1">
//                           {index + 1}
//                         </td>
//                         <td className="border border-gray-300">
//                           <input
//                             type="date"
//                             value={item?.date}


//                             className={`pl-2 appearance-none pr-2 bg-transparent w-[110px] text-[11px] focus:outline-none focus:border-transparent ${readOnly || childRecord.current > 0
//                               ? "text-gray-600"
//                               : "text-black"
//                               }`}
//                             readOnly
//                             disabled={readOnly || childRecord.current > 0}
//                           />
//                         </td>

//                         <td className=" border border-gray-300 text-[11px] py-0.5 px-1 item-center ">

//                           <Select
//                             options={LeaveType?.data?.map((val) => ({
//                               label: val?.name,
//                               value: val?.id,

//                             }))}
//                             value={
//                               LeaveType?.data?.map((val) => ({
//                                 label: val?.name,
//                                 value: val?.id,

//                               })).find(
//                                 (opt) => opt.value === item?.leaveId
//                               ) || null
//                             }
//                             onChange={(selected) =>
//                               handleInputChange(
//                                 selected?.value || "",
//                                 index,
//                                 "leaveId"
//                               )
//                             }
//                             isDisabled={!employeeId || readOnly}
//                             placeholder="Select"
//                             menuPlacement="auto"
//                             menuPosition="fixed"
//                             styles={{
//                               control: (base) => ({
//                                 ...base,
//                                 border: "none", // remove border
//                                 boxShadow: "none", // remove focus ring
//                                 backgroundColor: "transparent",
//                                 minHeight: "unset",
//                                 height: "20px", // match table row height
//                                 color: "black",
//                               }),
//                               placeholder: (base) => ({
//                                 ...base,
//                                 color: "black", // gray placeholder like Tailwind `text-gray-400`
//                               }),
//                               singleValue: (base) => ({
//                                 ...base,
//                                 color: readOnly ? "gray" : "black",
//                                 fontSize: "11px", // optional: adjust font size
//                                 // textTransform: "uppercase",
//                               }),

//                               dropdownIndicator: (base) => ({
//                                 ...base,
//                                 padding: 2, // smaller padding
//                                 svg: {
//                                   width: 14, // icon width
//                                   height: 14, // icon height
//                                 },
//                                 color: "black",
//                               }),

//                               indicatorSeparator: () => ({ display: "none" }), // remove line
//                               valueContainer: (base) => ({
//                                 ...base,
//                                 padding: "0 2px", // tighten padding
//                                 color: "black",
//                                 // textTransform: "uppercase",
//                               }),
//                               input: (base) => ({
//                                 ...base,
//                                 margin: 0,
//                                 padding: 0,
//                                 color: "black",
//                                 // textTransform: "uppercase",
//                               }),
//                               option: (base, state) => ({
//                                 ...base,
//                               }),
//                               menu: (base) => ({
//                                 ...base,
//                                 zIndex: 9999, // keep menu on top
//                               }),
//                             }}
//                             onInputChange={(value, { action }) => {
//                               if (action === "input-change") {
//                                 return value.toUpperCase(); //  force uppercase typing
//                               }
//                               return value;
//                             }}
//                             components={{
//                               // DropdownIndicator: () => null,
//                               IndicatorSeparator: () => null, // remove separator
//                             }}
//                           />
//                         </td>




//                         <td className="border border-gray-300 text-[11px] py-0.5 text-center">
//                           <select className="w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent"
//                             value={item.shiftTime || ""}
//                             onChange={(e) => handleInputChange(e.target.value, index, "shiftTime")}
//                             disabled={readOnly}
//                           >
//                             <option value="">Select</option>
//                             {ShiftTime.map((st) => (
//                               <option key={st.value} value={st.value}>
//                                 {st.show}
//                               </option>
//                             ))}

//                           </select>
//                         </td>




//                         <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
//                           <input
//                             type="text"
//                             value={item?.count || ""}
//                             className={`w-full text-right pr-2 bg-transparent  focus:outline-none ${readOnly ? "text-gray-600" : "text-black"
//                               }`}
//                             onChange={(e) =>
//                               handleInputChange(e.target.value, index, "count")
//                             }

//                             disabled={readOnly}
//                           />
//                         </td>
//                         <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
//                           <input
//                             type="text"
//                             value={item?.notes || ""}
//                             className={`w-full bg-transparent pl-2 focus:outline-none ${readOnly ? "text-gray-600" : "text-black"
//                               }`}
//                             onChange={(e) =>
//                               handleInputChange(e.target.value, index, "notes")
//                             }
//                             // onContextMenu={(e) => {
//                             //   if (!readOnly) {
//                             //     handleRightClick(e, index, "notes");
//                             //   }
//                             // }}
//                             // onKeyDown={(e) => {
//                             //   if (e.key === "Enter") {
//                             //     e.preventDefault();
//                             //     if (item?.leaveId) {
//                             //       addNewRow();
//                             //     }
//                             //   }
//                             // }}
//                             disabled={readOnly}
//                           />
//                         </td>
//                         {
//                           id ? (<td className="  border border-gray-300 text-[11px] py-0.5 item-center">
//                             <input
//                               type="text"
//                               value={item?.isApproved}
//                               className={`w-full text-left pl-1 bg-transparent  focus:outline-none ${readOnly ? "text-gray-600" : ""
//                                 } ${item?.isApproved === "Approved"
//                                   ? "text-green-600"
//                                   : item?.isApproved === "Rejected"
//                                     ? "text-red-600"
//                                     : "text-orange-400"
//                                 }`}

//                               disabled={readOnly}
//                             />
//                           </td>) : ''
//                         }

//                       </tr>
//                     )))
//                 }


//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div >


//     </>
//   );
// }


import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import {
  DateInput, TextInput, customSelectStyles,
} from "../../../Inputs";
import Select from "react-select";
import { ShiftTime } from "../../../Utils/DropdownData";
import Swal from "sweetalert2";
import { Check, X, CalendarDays, User, Clock, FileText, Calendar, Hash } from "lucide-react";

export default function LeaveCalendarModal({
  saveData, mobileNumber, setMobileNumber, department,
  setForm,
  generateLeaveRows,
  readOnly,
  leaveDetails,
  setLeaveDetails,
  id,
  setDate,
  date,
  employeeId,
  setEmployeeId,
  employeeName,
  setEmployeeName,
  designation,
  setDesignation,
  fromDate, setFromDate, toDate, setToDate,
  docId, leaveSummary,
  totalDays,
  childRecord,
  form,
  setReadOnly,
  setId,
  employee,
  setDepartment,
  LeaveType,
  onClose
}) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const payref = useRef(null);

  useEffect(() => {
    if (form && !readOnly && payref.current) {
      payref.current.focus();
    }
  }, [form, readOnly]);

  const today = dayjs();
  const startOfMonth = currentMonth.startOf("month");
  const daysInMonth = currentMonth.daysInMonth();
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeRange, setActiveRange] = useState([]);
  const [highlighted, setHighlighted] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [popupLeave, setPopupLeave] = useState({
    leaveId: "",
    shiftTime: "",
  });

  const allDays = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, "day").format("YYYY-MM-DD")
  );

  const getRange = (start, end) => {
    const range = [];
    const s = start < end ? start : end;
    const e = start < end ? end : start;
    for (let i = s; i <= e; i++) {
      range.push(allDays[i]);
    }
    return range;
  };

  useEffect(() => {
    if (!activeRange || activeRange.length === 0) return;
    setLeaveDetails((prev) => {
      const map = new Map(prev?.map(r => [r.date, r]));
      return activeRange.map(date => {
        return (
          map?.get(date) || {
            date,
            leaveId: "",
            shiftTime: "",
            count: "",
            notes: "",
            isApproved: ""
          }
        );
      });
    });
  }, [activeRange]);

  const handleMouseDown = (index) => {
    if (!employeeId) return;
    setIsDragging(true);
    setDragStart(index);
    setHighlighted([allDays[index]]);
  };

  const handleMouseEnter = (index) => {
    if (!isDragging || dragStart === null || !employeeId) return;
    setHighlighted(getRange(dragStart, index));
  };

  const handleMouseUp = (index) => {
    if (!isDragging || !employeeId) return;

    const finalRange =
      highlighted.length > 1 ? highlighted : [allDays[index]];

    if (
      finalRange.length === 1 &&
      activeRange.length === 1 &&
      activeRange[0] === finalRange[0]
    ) {
      setPopupOpen(false);
      setPopupLeave({ leaveId: "", shiftTime: "" });
    } else {
      setActiveRange(finalRange);
      setHighlighted(finalRange);
      setPopupOpen(true);
    }

    setIsDragging(false);
    setDragStart(null);
  };

  useEffect(() => {
    const stopDrag = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
      }
    };
    window.addEventListener("mouseup", stopDrag);
    return () => window.removeEventListener("mouseup", stopDrag);
  }, [isDragging]);

  const EmployeeOptions =
    employee?.data
      ?.filter((item) => item?.active === true)
      ?.map((val) => ({
        value: val?.id,
        label: val?.idNumber,
        firstName: val?.firstName,
        joiningDate: val?.joiningDate,
        designation: val?.designation,
        department: val?.department,
        aadharNo: val?.aadharNo,
        mobileNumber: val?.mobileNumber,
      })) || [];

  const handleInputChange = (value, index, field) => {
    const newBlend = structuredClone(leaveDetails);
    newBlend[index][field] = value;

    if (field === "shiftTime") {
      const shift = value;
      if (shift === "Fully") newBlend[index].count = "1";
      else if (shift === "FirstHalf" || shift === "secondHalf") newBlend[index].count = "0.5";
      else newBlend[index].count = "";
    }

    if (["count", "leaveId", "shiftTime"].includes(field)) {
      const leaveId = field === "leaveId" ? value : newBlend[index].leaveId;
      if (leaveId) {
        const requestedTotalInt = newBlend.reduce((sum, row) => {
          if (row.leaveId === leaveId) return sum + Math.round((parseFloat(row.count) || 0) * 100);
          return sum;
        }, 0);

        const leave = (leaveSummary || []).find((l) => l.leaveId === leaveId);
        const remainingInt = Math.round(((leave?.remainingDays || 0) * 100));

        if (remainingInt <= 0) {
          Swal.fire({
            icon: "error",
            title: "No Remaining Days",
            text: `${leave ? leave.leaveName : "Selected leave"} has no remaining days`,
          });
          resetLeaveId(index);
          return;
        }

        if (requestedTotalInt > remainingInt) {
          Swal.fire({
            icon: "error",
            title: "Leave Limit Exceeded",
            html: `You requested <b>${(requestedTotalInt / 100)}</b> days.<br>Only <b>${(remainingInt / 100)}</b> day(s) available for <b>${leave.leaveName}</b>.`,
          });
          resetLeaveId(index);
          return;
        }
      }
    }

    setLeaveDetails(newBlend);
  };

  const resetLeaveId = (index) => {
    const newBlend = structuredClone(leaveDetails);
    newBlend[index].leaveId = "";
    newBlend[index].count = "";
    setLeaveDetails(newBlend);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Leave Request</h2>
              <p className="text-sm text-gray-600">Manage employee leave applications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {readOnly && (
              <button
                type="button"
                onClick={() => setReadOnly(false)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={saveData}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Check size={16} />
              {id ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column - Calendar Section (7 columns) */}
            <div className="col-span-5 space-y-4">
              {/* Request Information - Top of Calendar */}
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Hash size={18} />
                  Request Information
                </h3>

                <div className="flex gap-4">
                  <div className="w-[160px]">
                    <TextInput
                      name="Leave Request Id"
                      type="text"
                      value={docId}
                      // setValue={setDocId}
                      required={true}
                      readOnly={readOnly}
                      disabled={childRecord.current > 0}
                    /></div>

                  <div className="w-[140px]">
                    <DateInput
                      name="Request Date"
                      value={date}
                      setValue={setDate}
                      required={true}
                      readOnly={readOnly}
                      disabled={childRecord.current > 0}

                    /></div>


                  <div className="w-[140px] -ml-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Emp ID Card No <span className="text-red-500">*</span>
                    </label>
                    <Select
                      ref={payref}
                      options={EmployeeOptions}
                      value={EmployeeOptions?.find((opt) => opt?.value === employeeId) || null}
                      onChange={(selected) => {
                        setEmployeeId(selected?.value || "");
                        setEmployeeName(selected?.firstName || "");
                        setDesignation(selected?.designation?.name || "");
                        setDepartment(selected?.department?.name);
                        setMobileNumber(selected?.mobileNumber || "");
                      }}
                      placeholder="Select ID"
                      isClearable={false}
                      isDisabled={readOnly || childRecord.current > 0}
                      isSearchable
                      menuShouldScrollIntoView={false}
                      maxMenuHeight={120}
                      className="text-sm"
                      styles={customSelectStyles}
                    />
                  </div>
                </div>
              </div>

              {/* Calendar - Increased Height */}
              <div className="bg-white rounded-lg border shadow-sm p-4 h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar size={18} />
                    Select Dates
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentMonth(m => m.subtract(1, "month"))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ◀
                    </button>
                    <span className="font-medium text-gray-800 min-w-[140px] text-center">
                      {currentMonth.format("MMMM YYYY")}
                    </span>
                    <button
                      onClick={() => setCurrentMonth(m => m.add(1, "month"))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 grid grid-cols-7 gap-1 select-none">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: startOfMonth.day() }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-12"></div>
                  ))}
                  {allDays.map((date, index) => {
                    const day = currentMonth.startOf("month").add(index, "day");
                    const isHighlighted = highlighted.includes(date);
                    const showPopup = popupOpen && activeRange.length > 0 && index === allDays.indexOf(activeRange[0]);
                    const isWeekend = day.day() === 0 || day.day() === 6;
                    const isToday = date === today.format("YYYY-MM-DD");

                    return (
                      <div
                        key={date}
                        className="relative"
                        onMouseDown={() => handleMouseDown(index)}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseUp={() => handleMouseUp(index)}
                      >
                        <div
                          className={`
                            h-12 flex items-center justify-center rounded-lg cursor-pointer transition-all
                            ${isHighlighted
                              ? "bg-blue-600 text-white shadow-md"
                              : isToday
                                ? "bg-blue-100 border border-blue-300 text-blue-700"
                                : isWeekend
                                  ? "bg-gray-50 text-gray-500"
                                  : "hover:bg-blue-50 text-gray-700"
                            }
                            ${!employeeId ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                        >
                          <span className="text-sm font-medium">
                            {day.date()}
                          </span>
                        </div>

                        {showPopup && (
                          <div
                            className="absolute top-14 left-0 bg-white border shadow-xl rounded-lg p-4 w-64 z-20"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <p className="text-sm font-semibold text-gray-800">
                                {activeRange.length === 1
                                  ? day.format("DD MMM YYYY")
                                  : `${dayjs(activeRange[0]).format("DD MMM")} - ${dayjs(activeRange[activeRange.length - 1]).format("DD MMM")}`
                                }
                              </p>
                              <button
                                onClick={() => {
                                  setPopupOpen(false);
                                  setHighlighted([]);
                                  setPopupLeave({ leaveId: "", shiftTime: "" });
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Leave Type
                                </label>
                                <select
                                  value={popupLeave.leaveId}
                                  onChange={(e) =>
                                    setPopupLeave((p) => ({ ...p, leaveId: e.target.value }))
                                  }
                                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Leave Type</option>
                                  {LeaveType?.data?.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      {t.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Shift Time
                                </label>
                                <select
                                  value={popupLeave.shiftTime}
                                  onChange={(e) =>
                                    setPopupLeave((p) => ({ ...p, shiftTime: e.target.value }))
                                  }
                                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Shift</option>
                                  {ShiftTime.map((st) => (
                                    <option key={st.value} value={st.value}>
                                      {st.show}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <button
                                onClick={() => {
                                  if (!popupLeave.leaveId) {
                                    Swal.fire({
                                      icon: "warning",
                                      title: "Select Leave Type",
                                      text: "Please select a leave type first!",
                                    });
                                    return;
                                  }

                                  const selectedLeaveId = parseInt(popupLeave.leaveId);
                                  const shift = popupLeave.shiftTime;
                                  let countValue = "";
                                  if (shift === "Fully") countValue = "1";
                                  else if (shift === "FirstHalf" || shift === "SecondHalf") countValue = "0.5";

                                  const leave = leaveSummary.find(l => l.leaveId === selectedLeaveId);
                                  if (!leave || leave.remainingDays <= 0) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "No Remaining Days",
                                      text: `${leave?.leaveName || "Selected leave"} has no remaining days`,
                                    });
                                    return;
                                  }

                                  const totalRequestedInt = leaveDetails.reduce((sum, row) => {
                                    if (activeRange.includes(row.date)) {
                                      return sum + Math.round(parseFloat(countValue) * 100);
                                    } else if (row.leaveId === selectedLeaveId) {
                                      return sum + Math.round((parseFloat(row.count) || 0) * 100);
                                    }
                                    return sum;
                                  }, 0);

                                  const remainingInt = Math.round((leave.remainingDays || 0) * 100);

                                  if (totalRequestedInt > remainingInt) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "Leave Limit Exceeded",
                                      html: `You requested <b>${(totalRequestedInt / 100)}</b> days.<br>Only <b>${(remainingInt / 100)}</b> day(s) available for <b>${leave.leaveName}</b>.`,
                                    });
                                    return;
                                  }

                                  setLeaveDetails(prev =>
                                    prev.map(row =>
                                      activeRange.includes(row.date)
                                        ? { ...row, leaveId: selectedLeaveId, shiftTime: shift, count: countValue }
                                        : row
                                    )
                                  );

                                  setPopupOpen(false);
                                  setHighlighted([]);
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                              >
                                Apply Leave
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!employeeId && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700 text-center">
                      Please select an employee first to choose dates
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Employee Details + Leave Entry (5 columns) */}
            <div className="col-span-7 space-y-4">
              {/* Employee Details */}
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <User size={18} />
                  Employee Details
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <TextInput
                      name="Employee Name"
                      type="text"
                      value={employeeName}
                      // setValue={setEmployeeName}
                      // required={true}
                      readOnly={readOnly}
                      disabled={childRecord.current > 0}
                    />

                    <div className="w-52">
                      <TextInput
                        name="DepartMent"
                        type="text"
                        value={department}
                        // setValue={setDepartment}
                        // required={true}
                        readOnly={readOnly}
                        disabled={childRecord.current > 0}
                      />
                    </div>
                    <div className="w-52">
                      <TextInput
                        name="Designation"
                        type="text"
                        value={designation}
                        // setValue={setDesignation}
                        // required={true}
                        readOnly={readOnly}
                        disabled={childRecord.current > 0}
                      />
                    </div>
                    {/* Modal Button for Leave Availability */}
                    <button
                      type="button"
                      onClick={() => document.getElementById('leave-availability-modal').showModal()}
                      className="px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
                      title="View Leave Availability"
                    >
                      <Clock size={12} />
                      <span>View Leaves</span>
                    </button>

                  </div>

                  {/* Leave Availability inside Employee Details */}
                  <dialog id="leave-availability-modal" className="modal">
                    <div className="modal-box max-w-2xl">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                      </form>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Clock size={20} />
                        Leave Availability
                      </h3>
                      <div className="overflow-auto max-h-[400px]">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-100 sticky top-0">
                            <tr>
                              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                                Leave Type
                              </th>
                              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 border-b">
                                Total Days
                              </th>
                              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 border-b">
                                Used Days
                              </th>
                              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 border-b">
                                Available Days
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaveSummary?.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                                  No leave data available
                                </td>
                              </tr>
                            ) : (
                              leaveSummary?.map((type, index) => (
                                <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                                  <td className="py-3 px-4 text-sm border-b">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${type?.remainingDays > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <span>{type?.leaveName}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center text-sm border-b">
                                    <span className="font-medium">{type?.totalDays || 0}</span>
                                  </td>
                                  <td className="py-3 px-4 text-center text-sm border-b">
                                    <span className="font-medium text-amber-600">
                                      {type?.usedDays || 0}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center text-sm border-b">
                                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${type?.remainingDays > 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                      }`}>
                                      {type?.remainingDays || 0}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn">Close</button>
                        </form>
                      </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>




                </div>
              </div>

















              {/* Leave Entry Details */}
              <div className="bg-white rounded-lg border shadow-sm p-4 flex-1">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FileText size={18} />
                  Leave Entry
                </h3>

                <div className="max-h-[280px] overflow-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="py-2 px-2 text-center text-xs font-medium text-gray-700 w-8">
                          S.No
                        </th>
                        <th className="py-2 px-2 text-center text-xs font-medium text-gray-700">
                          Date
                        </th>
                        <th className="py-2 px-2 text-center text-xs font-medium text-gray-700">
                          Leave Type
                        </th>
                        <th className="py-2 px-2 text-center text-xs font-medium text-gray-700">
                          Duration
                        </th>
                        <th className="py-2 px-2 text-center text-xs font-medium text-gray-700">
                          Count
                        </th>
                        <th className="py-2 px-2 text-center text-xs font-medium text-gray-700">
                          Reason
                        </th>
                        {id && (
                          <th className="py-2 px-2 text-center text-xs font-medium text-gray-700">
                            Status
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {leaveDetails?.length === 0 ? (
                        <tr>
                          <td colSpan={id ? 7 : 6} className="py-8 text-center text-sm text-gray-500">
                            Select dates from calendar to add leave entries
                          </td>
                        </tr>
                      ) : (
                        leaveDetails?.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-200 py-1.5 px-2 text-center text-xs text-gray-700">
                              {index + 1}
                            </td>
                            <td className="border border-gray-200 py-1.5 px-2">
                              <input
                                type="date"
                                value={item.date}
                                className="w-full bg-transparent text-xs text-gray-700 focus:outline-none focus:border-transparent"
                                readOnly
                                disabled={readOnly || childRecord.current > 0}
                              />
                            </td>
                            <td className="border border-gray-200 py-1 px-1">
                              <Select
                                options={LeaveType?.data?.map((val) => ({
                                  label: val?.name,
                                  value: val?.id,
                                }))}
                                value={LeaveType?.data?.map((val) => ({
                                  label: val?.name,
                                  value: val?.id,
                                })).find((opt) => opt.value === item?.leaveId) || null}
                                onChange={(selected) =>
                                  handleInputChange(selected?.value || "", index, "leaveId")
                                }
                                isDisabled={!employeeId || readOnly}
                                placeholder="Select"
                                menuPlacement="auto"
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    border: "none",
                                    boxShadow: "none",
                                    backgroundColor: "transparent",
                                    minHeight: "28px",
                                    fontSize: "12px",
                                  }),
                                  dropdownIndicator: (base) => ({
                                    ...base,
                                    padding: 2,
                                    svg: {
                                      width: 12,
                                      height: 12,
                                    },
                                  }),
                                  indicatorSeparator: () => ({ display: "none" }),
                                  valueContainer: (base) => ({
                                    ...base,
                                    padding: "0 2px",
                                  }),
                                  input: (base) => ({
                                    ...base,
                                    margin: 0,
                                    padding: 0,
                                    fontSize: "12px",
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    fontSize: "12px",
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                            </td>
                            <td className="border border-gray-200 py-1.5 px-2">
                              <select
                                className="w-full bg-transparent text-xs focus:outline-none"
                                value={item.shiftTime || ""}
                                onChange={(e) => handleInputChange(e.target.value, index, "shiftTime")}
                                disabled={readOnly}
                              >
                                <option value="">Select</option>
                                {ShiftTime.map((st) => (
                                  <option key={st.value} value={st.value}>
                                    {st.show}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="border border-gray-200 py-1.5 px-2">
                              <input
                                type="text"
                                value={item?.count || ""}
                                className={`w-full bg-transparent text-xs text-right focus:outline-none ${readOnly ? "text-gray-600" : "text-black"}`}
                                onChange={(e) =>
                                  handleInputChange(e.target.value, index, "count")
                                }
                                disabled={readOnly}
                              />
                            </td>
                            <td className="border border-gray-200 py-1.5 px-2">
                              <input
                                type="text"
                                value={item?.notes || ""}
                                className={`w-full bg-transparent text-xs focus:outline-none ${readOnly ? "text-gray-600" : "text-black"}`}
                                onChange={(e) =>
                                  handleInputChange(e.target.value, index, "notes")
                                }
                                disabled={readOnly}
                              />
                            </td>
                            {id && (
                              <td className="border border-gray-200 py-1.5 px-2">
                                <input
                                  type="text"
                                  value={item?.isApproved}
                                  className={`w-full bg-transparent text-xs focus:outline-none ${readOnly ? "text-gray-600" : ""} ${item?.isApproved === "Approved"
                                    ? "text-green-600"
                                    : item?.isApproved === "Rejected"
                                      ? "text-red-600"
                                      : "text-orange-400"
                                    }`}
                                  disabled={readOnly}
                                />
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Total Selected Days: <span className="font-semibold">{leaveDetails?.length || 0}</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setId("");
                setForm(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveData}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Check size={16} />
              {id ? "Update Request" : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}