import { useEffect, useRef } from "react";
import {
  DateInput, TextInput, customSelectStyles,
} from "../../../Inputs";

import Select from "react-select";
import { ShiftTime } from "../../../Utils/DropdownData";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const Table = ({
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
  LeaveType
}) => {


  const payref = useRef(null);
  useEffect(() => {
    if (form && !readOnly && payref.current) {
      payref.current.focus();
    }
  }, [form, readOnly]);
  const resetLeaveId = (rowIndex) => {
    setLeaveDetails((prev) => {
      const clone = structuredClone(prev);
      clone[rowIndex].leaveId = "";
      return clone;
    });
  };

  const handleInputChange = (value, index, field) => {

    const newBlend = structuredClone(leaveDetails);
    newBlend[index][field] = value;
    if (field === "shiftTime") {
      const shift = value;  // safer

      if (shift === "Fully") {
        newBlend[index].count = "1";
      }
      else if (shift === "FirstHalf" || shift === "secondHalf") {
        newBlend[index].count = "0.5";
      }
      else {
        newBlend[index].count = "";
      }
    }
    // helper to safely parse and scale to integer (cents)
    const toInt = (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return 0;
      return Math.round(n * 100); // scale by 100 to preserve two decimals
    };

    // sum requested (scaled) for a leaveId across newBlend
    const sumRequestedForLeaveInt = (lid) =>
      newBlend.reduce((sum, row) => {
        if (!row) return sum;
        if (row.leaveId === lid) return sum + toInt(row.count);
        return sum;
      }, 0);

    // validate when relevant fields change
    if (["count", "leaveId", "shiftTime"].includes(field)) {
      const leaveId = newBlend[index].leaveId;
      if (leaveId) {
        const requestedTotalInt = sumRequestedForLeaveInt(leaveId);

        const leave = (leaveSummary || []).find((l) => l.leaveId === leaveId);
        const remaining = Number((leave && leave.remainingDays) || 0);
        const remainingInt = Math.round(remaining * 100);

        if (remainingInt <= 0) {
          Swal.fire({
            icon: "error",
            title: "No Remaining Days",
            text: `${leave ? leave.leaveName : "Selected leave"} has no remaining days`,
          });
          resetLeaveId(index);
          return; // block update
        }

        if (requestedTotalInt > remainingInt) {
          const requested = (requestedTotalInt / 100).toString();
          const remainingStr = (remainingInt / 100).toString();
          Swal.fire({
            icon: "error",
            title: "Leave Limit Exceeded",
            html: `
      You requested <b>${requested}</b> days.<br>
      Only <b>${remainingStr}</b> day(s) available for <b>${leave.leaveName}</b>.
    `,
          });
          resetLeaveId(index);
          return; // block update
        }
      }
    }
    setLeaveDetails(newBlend);
  };

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


  return (
    <>
      <div className="flex bg-white     mx-auto px-2 py-1 justify-between items-center mb-1">
        <h1 className="master-header">Leave Request</h1>
        <div className="flex gap-2">
          {readOnly && (
            <button
              type="button"
              onClick={() => {
                setReadOnly(false);
              }}
              className="px-3 py-1 text-green-600 hover:bg-green-600 hover:text-white border border-green-600 text-xs rounded"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setForm(false);
              setId("");
            }}
            className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"
          >
            Back
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={saveData}
              className="px-3 py-1 hover:bg-green-600 hover:text-white rounded text-green-600 border border-green-600 flex items-center gap-1 text-xs"
            >
              {id ? "Update" : "Save"}
            </button>
          )}
        </div>
      </div>
      <div className="w-full mt-1 bg-gray-100 mx-auto rounded-md shadow-md px-2  py-1 ">

        <div className="space-y-3 ">
          <div className="grid grid-cols-4 md:grid-cols-4 gap-2">
            <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1">
              <h2 className="font-medium text-slate-700 mb-2">Basic Details</h2>
              <div className="flex gap-4 gap-x-6">

                <TextInput
                  name="Leave Request Id"
                  type="text"
                  value={docId}
                  // setValue={setDocId}
                  required={true}
                  readOnly={readOnly}
                  disabled={childRecord.current > 0}
                />

                <div className="w-[120px]">
                  <DateInput
                    name="Request Date"
                    value={date}
                    setValue={setDate}
                    required={true}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}

                  />
                </div>

              </div>

            </div>
            <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-2">
              <h2 className="font-medium text-slate-700 mb-2">Employee Details</h2>
              <div className="flex gap-4 gap-x-6">

                <div className="w-40 ">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ID Card No
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    ref={payref}

                    options={EmployeeOptions}
                    value={
                      EmployeeOptions?.find(
                        (opt) => opt?.value === employeeId
                      ) || null
                    }
                    onChange={(selected) => {
                      setEmployeeId(selected?.value || "");
                      setEmployeeName(selected?.firstName || "");

                      setDesignation(
                        selected?.designation?.name || ""
                      );
                      setDepartment(selected?.department?.name);

                      setMobileNumber(selected?.mobileNumber || "");
                    }}
                    placeholder="Select Id"
                    isClearable={false} // same as required
                    isDisabled={readOnly || childRecord.current > 0}
                    isSearchable
                    menuShouldScrollIntoView={false}
                    maxMenuHeight={150} // <-- Reduce height here
                    onInputChange={(value) => value.toUpperCase()}
                    className="w-full px-1 -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                    styles={customSelectStyles}
                  />
                </div>
                <TextInput
                  name="Employee Name"
                  type="text"
                  value={employeeName}
                  // setValue={setEmployeeName}
                  // required={true}
                  readOnly={readOnly}
                  disabled={childRecord.current > 0}
                />

                {/* <div className="w-32">
                  <TextInput
                    name="Mobile Number"
                    type="text"
                    value={mobileNumber}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}
                  /></div> */}
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

              </div>

            </div>
            <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1">
              <h2 className="font-medium text-slate-700 mb-2">Leave Details</h2>
              <div className="flex gap-4 gap-x-4">


                <div className="w-[120px]">
                  <DateInput
                    name="From Date"
                    value={fromDate}
                    setValue={(val) => {
                      setFromDate(val);
                      generateLeaveRows(val, toDate);   // call function here
                    }}
                    required={true}
                    readOnly={readOnly}
                    disabled={!employeeId || childRecord.current > 0}

                  />
                </div>
                <div className="w-[120px]">
                  <DateInput
                    name="To Date"
                    value={toDate}
                    setValue={(val) => {
                      setToDate(val);
                      generateLeaveRows(fromDate, val);  // call function here
                    }}
                    required={true}
                    readOnly={readOnly}
                    disabled={!fromDate || childRecord.current > 0}

                  />
                </div>
                <div className="w-[80px]">
                  <TextInput
                    name="Total Days"
                    value={totalDays}
                    type="text"

                    readOnly={readOnly}
                    disabled={childRecord.current > 0}

                  />
                </div>


              </div>

            </div>
          </div>



          <div className={` w-full flex p-2 gap-x-8 overflow-auto bg-white `}>
            <div className="  overflow-y-auto ">
              <h2>Leave Availabilty</h2>
              <table className="w-[500px] border-collapse table-fixed max-h-[130px]">
                <thead className="bg-gray-200 text-gray-800">
                  <tr>

                    <th className="w-12  py-2 text-center font-medium text-[13px]">
                      Leave Type
                    </th>
                    <th
                      className={`w-6 py-2 item-center font-medium text-[13px] `}
                    >
                      Days Available
                    </th>

                    <th
                      className={`w-8  py-2 text-center font-medium text-[13px] `}
                    >
                      Leave Taken (Days)
                    </th>




                  </tr>
                </thead>
                <tbody>

                  {
                    leaveSummary?.length === 0 ? (<tr>
                      <td colSpan={3} rowSpan={1}

                        className="border border-gray-300 py-1.5 text-[11px]  text-center px-1"
                      >
                        No Data Available

                      </td>
                    </tr>) : (leaveSummary?.map((type, index) => (
                      <tr key={index} className="w-full table-row">

                        {/* LEAVE TYPE NAME */}
                        <td className="border border-gray-300 py-1.5">

                          <input value={type?.leaveName} className={`w-full bg-transparent text-left pl-2 focus:outline-none ${readOnly ? "text-gray-600" : "text-black"
                            }`} />

                        </td>
                        {/* DAYS AVAILABLE */}
                        <td className="border border-gray-300 text-[11px] py-0.5 text-center">
                          <input
                            type="number"
                            value={type?.remainingDays}
                            className={` text-right w-full pr-2  bg-transparent text-[11px] focus:outline-none 
            ${readOnly ? "text-gray-600" : "text-black"}`}
                            readOnly
                          />
                        </td>
                        {/* LEAVE TAKEN */}
                        <td className="border border-gray-300">
                          <input
                            type="number"
                            value={type?.usedDays}
                            className={` text-right w-full pr-2  bg-transparent text-[11px] focus:outline-none 
            ${readOnly ? "text-gray-600" : "text-black"}`}
                            readOnly
                          />
                        </td>



                      </tr>
                    )))
                  }


                </tbody>

              </table>
            </div>

            <div className=" max-h-[300px] overflow-y-auto ">
              <h2>Leave Entry</h2>
              <table className="w-[780px] border-collapse table-fixed max-h-[300px]">
                <thead className="bg-gray-200 text-gray-800">
                  <tr>
                    <th
                      className={`w-[6px] px-1 text-center font-medium text-[13px] `}
                    >
                      S.No
                    </th>
                    <th className="w-8 px-2 py-2 text-center font-medium text-[13px]">
                      Date
                    </th>
                    <th
                      className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                    >
                      Leave Type
                    </th>




                    <th
                      className={`w-8 py-2 item-center font-medium text-[13px] `}
                    >
                      Duration
                    </th>

                    <th
                      className={`w-8 py-2 item-center font-medium text-[13px] `}
                    >
                      Count (Days)
                    </th>


                    <th
                      className={`w-12 py-2 item-center font-medium text-[13px] `}
                    >
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    leaveDetails?.length === 0 ? (<tr>
                      <td colSpan={6} rowSpan={1}

                        className="border border-gray-300 py-1.5 text-[11px]  text-center px-1"
                      >
                        Choose from and to date first

                      </td>
                    </tr>) : (

                      leaveDetails?.map((item, index) => (
                        <tr className=" w-full table-row">
                          <td className="border border-gray-300 py-1.5  text-center px-1">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300">
                            <input
                              type="date"
                              value={item?.startDate}

                              className={`pl-2 appearance-none pr-2 bg-transparent w-[110px] text-[11px] focus:outline-none focus:border-transparent ${readOnly || childRecord.current > 0
                                ? "text-gray-600"
                                : "text-black"
                                }`}
                              readOnly
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </td>

                          <td className=" border border-gray-300 text-[11px] py-0.5 px-1 item-center ">

                            <Select
                              options={LeaveType?.data?.map((val) => ({
                                label: val?.name,
                                value: val?.id,

                              }))}
                              value={
                                LeaveType?.data?.map((val) => ({
                                  label: val?.name,
                                  value: val?.id,

                                })).find(
                                  (opt) => opt.value === item?.leaveId
                                ) || null
                              }
                              onChange={(selected) =>
                                handleInputChange(
                                  selected?.value || "",
                                  index,
                                  "leaveId"
                                )
                              }
                              isDisabled={!employeeId || readOnly}
                              placeholder="Select"
                              menuPlacement="auto"
                              menuPosition="fixed"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: "none", // remove border
                                  boxShadow: "none", // remove focus ring
                                  backgroundColor: "transparent",
                                  minHeight: "unset",
                                  height: "20px", // match table row height
                                  color: "black",
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  color: "black", // gray placeholder like Tailwind `text-gray-400`
                                }),
                                singleValue: (base) => ({
                                  ...base,
                                  color: readOnly ? "gray" : "black",
                                  fontSize: "11px", // optional: adjust font size
                                  // textTransform: "uppercase",
                                }),

                                dropdownIndicator: (base) => ({
                                  ...base,
                                  padding: 2, // smaller padding
                                  svg: {
                                    width: 14, // icon width
                                    height: 14, // icon height
                                  },
                                  color: "black",
                                }),

                                indicatorSeparator: () => ({ display: "none" }), // remove line
                                valueContainer: (base) => ({
                                  ...base,
                                  padding: "0 2px", // tighten padding
                                  color: "black",
                                  // textTransform: "uppercase",
                                }),
                                input: (base) => ({
                                  ...base,
                                  margin: 0,
                                  padding: 0,
                                  color: "black",
                                  // textTransform: "uppercase",
                                }),
                                option: (base, state) => ({
                                  ...base,
                                }),
                                menu: (base) => ({
                                  ...base,
                                  zIndex: 9999, // keep menu on top
                                }),
                              }}
                              onInputChange={(value, { action }) => {
                                if (action === "input-change") {
                                  return value.toUpperCase(); //  force uppercase typing
                                }
                                return value;
                              }}
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null, // remove separator
                              }}
                            />
                          </td>




                          <td className="border border-gray-300 text-[11px] py-0.5 text-center">
                            <select className="w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent"
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




                          <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
                            <input
                              type="text"
                              value={item?.count || ""}
                              className={`w-full text-right pr-2 bg-transparent  focus:outline-none ${readOnly ? "text-gray-600" : "text-black"
                                }`}
                              onChange={(e) =>
                                handleInputChange(e.target.value, index, "count")
                              }

                              disabled={readOnly}
                            />
                          </td>
                          <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
                            <input
                              type="text"
                              value={item?.notes || ""}
                              className={`w-full bg-transparent pl-2 focus:outline-none ${readOnly ? "text-gray-600" : "text-black"
                                }`}
                              onChange={(e) =>
                                handleInputChange(e.target.value, index, "notes")
                              }
                              // onContextMenu={(e) => {
                              //   if (!readOnly) {
                              //     handleRightClick(e, index, "notes");
                              //   }
                              // }}
                              // onKeyDown={(e) => {
                              //   if (e.key === "Enter") {
                              //     e.preventDefault();
                              //     if (item?.leaveId) {
                              //       addNewRow();
                              //     }
                              //   }
                              // }}
                              disabled={readOnly}
                            />
                          </td>
                        </tr>
                      )))
                  }


                </tbody>
              </table>
            </div>
          </div>
        </div>



      </div>
    </>
  );
};

export default Table;
