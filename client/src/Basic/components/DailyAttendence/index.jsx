import React, { useEffect, useState, useRef } from "react";

import { ReusableTable, DateInput, customSelectStyles } from "../../../Inputs";
import Select from "react-select";
import { useGetEmployeeCategoryQuery } from "../../../redux/services/EmployeeCategoryMasterService";
import { useGetEmployeeQuery } from "../../../redux/services/EmployeeMasterService";
import { useLazyGetAttendenceGenerationQuery } from "../../../redux/services/AttenedenceGeneration";
import Modal from "../../../UiComponents/Modal";
import { GroupBy } from "../../../Utils/DropdownData";
import { getCommonParams } from "../../../Utils/helper";
import Swal from "sweetalert2";
import moment from "moment-timezone";
import {
  useGetshiftTypeQuery,
} from "../../../redux/uniformService/shiftTYpeService";
import Permissiontable from "./permissionTble";
import AbsentTable from "./AbsentTable";

const Form = () => {
  const [date, setDate] = useState("");
  const [employeeCategoryId, setEmployeeCategoryId] = useState("");
  const [reportView, setReportView] = useState("Seperate");
  const [form, setForm] = useState(true);
  const childRecord = useRef(0);
  const params = getCommonParams();
  const [groupBy, setGroupBy] = useState("");
  const designationRef = useRef(null);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedBreakSummary, setSelectedBreakSummary] = React.useState(null);
  const [tableShow, setTableShow] = useState("Final")
  const openModal = (breakSummary) => {
    setSelectedBreakSummary(breakSummary);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBreakSummary(null);
    setShowModal(false);
  };
  const [triggerReport, { data: allData, isFetching }] =
    useLazyGetAttendenceGenerationQuery();
  const { data: employeeCategory } = useGetEmployeeCategoryQuery({ params });
  const { data: shiftTypeData } = useGetshiftTypeQuery({ params })

  const { data: employeeData } = useGetEmployeeQuery({ params });

  useEffect(() => {
    if (form && designationRef.current) {
      designationRef.current.focus();
    }
  }, [form]);

  const handleKeyDown = (event) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === "s") {
      event.preventDefault();
    }
  };


  const EmployeeOptions = employeeCategory?.data?.map((val) => ({
    value: val?.id,
    label: val?.name,
  }));
  const OnNew = () => {
    setDate("");
    setEmployeeCategoryId("");
    setGroupBy("");
  };
  const absentData =
    allData?.data?.filter((item) => item.status === "Absent") || [];
  const regularData =
    allData?.data?.filter((item) => item.status === "Regular") || [];
  const irregularData =
    allData?.data?.filter((item) => item.status === "Irregular") || [];
  const selectedShiftType = shiftTypeData?.data?.find(val => val?.selectedShiftType)?.selectedShiftType;

  const permissionTableData =
    allData?.data?.filter((item) => {
      const bs = item.breakSummary;

      if (!bs) return false;

      // collect all status values
      const statuses = [
        bs.morningInOut?.status,
        bs.morning?.status,
        bs.lunch?.status,
        bs.evening?.status,
        bs.eveningInOut?.status
      ].filter(Boolean);

      // return true if ANY matches these
      return statuses.some((s) =>
        ["Late", "Delayed", "Delayed Out"].includes(s)
      );
    }) || [];
  const nonDelayedList =
    allData?.data?.filter((item) => {
      const bs = item.breakSummary;
      if (!bs) return false;

      const statuses = [
        bs.morningInOut?.status,
        bs.morning?.status,
        bs.lunch?.status,
        bs.evening?.status,
        bs.eveningInOut?.status
      ].filter(Boolean);

      return !statuses.some((s) =>
        ["Late", "Delayed", "Delayed Out"].includes(s)
      );
    }) || [];

  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 h-[70vh]">



        <div className="w-full flex bg-white p-1 justify-between   items-center">
          <h1 className="master-header cursor-pointer" onClick={() => setTableShow("Final")}
          >Attendence Generation</h1>

          <div className="flex items-center gap-x-4">

            <button
              onClick={() => {
                setTableShow("leave");
                // OnNew();
              }}
              className="bg-white w-[65px] text-center border ms-4 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center"
            >
              Leave
            </button>
            <button
              onClick={() => {
                setTableShow("Permission");
                // OnNew();
              }}
              className="bg-white w-[100px] text-center  border ms-4 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              Permission
            </button>
            <button
              onClick={() => {
                // setForm(true);
                // OnNew();
              }}
              className="bg-white w-[80px] text-center border ms-4 border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              On Duty
            </button>
            <button
              onClick={() => {
                setForm(true);
                OnNew();
              }}
              className="bg-white w-[130px]  border ms-3 border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              + Report Param
            </button>
            <div className="ml-2">
              <select
                value={reportView}
                onChange={(e) => {
                  setReportView(e.target.value);
                }}
                className="w-[110px]   px-1 py-0.5 text-xs text-[12px] border border-gray-300 rounded-lg
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-150 shadow-sm"
              >
                <option value="Seperate">Seperate</option>
                <option value="Single">Single</option>
              </select></div>

          </div>
        </div>

        {
          tableShow === "Permission" && (<Permissiontable permissionTableData={permissionTableData} selectedBreakSummary={selectedBreakSummary} setSelectedBreakSummary={setSelectedBreakSummary} closeModal={closeModal} openModal = {openModal} reportView={reportView} selectedShiftType={selectedShiftType} showModal={showModal} setShowModal={setShowModal}/>
          )
        }

        {
          tableShow === "leave" && (<AbsentTable absentData={absentData} reportView={reportView} selectedShiftType={selectedShiftType} />
          )
        }
        {tableShow === "Final" && (<div
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
                  Permission
                </th>) : ""}
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

            <p className=" z-10 w-[100px] text-sm px-1 py-0.5  ">REGULAR</p>

            <tbody>
              {regularData?.map((item, index) => (
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
          {showModal && selectedBreakSummary && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 overscroll-y-hidden">
              <div className={`relative bg-white rounded-lg p-7 w-[700px] h-[250px]`}>

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
                <h2 className="text-[15px] font-semibold mb-4">Permission Summary</h2>
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
                <table className="w-full border-collapse">
                  <thead className="bg-gray-200 text-gray-800 ">
                    <tr>
                      <th className="px-1 py-1 text-center font-medium text-[13px]"></th>
                      <th className="px-1 text-center font-medium text-[13px]">Status</th>
                      <th className="px-1 text-center font-medium text-[13px]">Punch</th>
                      {/* <th className="px-1 text-center font-medium text-[13px]">Break Duration</th> */}
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
                          {/* <td className="border border-gray-300 py-1 text-[12px]  text-center px-1">{breakItem?.breakDuration || "-"}</td> */}
                          <td className="border border-gray-300 py-1 text-[12px]  text-center px-1">{breakItem?.delay || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

              </div>
            </div>
          )}

        </div>)}

        {form === true && (
          <Modal
            isOpen={form}
            form={form}
            widthClass={"w-[30%]  h-[45%]"}
            onClose={() => {
              setForm(false);
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center gap-2">
                  <h2 className=" -ml-2   py-0.5 master-header-modal">
                    ATTENDENCE GENERATION
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <div className="grid grid-cols-1  gap-3  h-full">
                  <div className="lg:col-span- space-y-3">
                    <div className="bg-white p-3 rounded-md border border-gray-200 h-full">
                      <div className="space-y-4 ">
                        <div className="flex flex-wrap gap-x-7">
                          <div className="mb-3 ">
                            <DateInput
                              name="Date"
                              value={date}
                              setValue={setDate}
                              required={true}
                              disabled={childRecord.current > 0}
                              ref={designationRef}
                            />
                          </div>
                          {/* <div className="w-52">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Employee Category
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              options={EmployeeOptions}
                              value={
                                EmployeeOptions?.find(
                                  (opt) => opt.value === employeeCategoryId
                                ) || null
                              }
                              onChange={(selected) =>
                                setEmployeeCategoryId(selected?.value || "")
                              }
                              placeholder="Select Employee Category"
                              isClearable={false} // same as required
                              isSearchable
                              menuShouldScrollIntoView={false}
                              maxMenuHeight={150} // <-- Reduce height here
                              onInputChange={(value) => value.toUpperCase()}
                              className="w-full px-1 text-[12px] text-black -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                              styles={customSelectStyles}
                            />
                          </div> */}
                          {/* <div className="mb-3">
                            {" "}
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              {" "}
                              Group By{" "}
                            </label>{" "}
                            <select
                              value={groupBy}
                              className="w-full px-1 py-0.5 text-xs text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 shadow-sm"
                              onChange={(e) => setGroupBy(e.target.value)}
                            >
                              {" "}
                              <option value="">Select</option>{" "}
                              {GroupBy?.map((val, index) => (
                                <option key={index} value={val?.value}>
                                  {" "}
                                  {val?.show}{" "}
                                </option>
                              ))}{" "}
                            </select>{" "}
                          </div> */}
                          <div>
                            <button
                              onClick={() => {
                                if (!date) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Submission error",
                                    text: "Please fill all required fields...!",
                                  });
                                  return;
                                }

                                triggerReport({
                                  searchParams: {
                                    date,
                                  },
                                });

                                setForm(false);
                              }}
                              className="px-3 py-1.5 font-sans hover:bg-green-600 h-6 mt-5 hover:text-white rounded text-green-600 
                          border border-green-600 flex items-center gap-1 text-xs"
                              type="button"
                            >
                              Generate Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Form;
