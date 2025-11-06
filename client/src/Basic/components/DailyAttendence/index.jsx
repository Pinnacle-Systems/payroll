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
const Form = () => {
  const [date, setDate] = useState("");
  const [employeeCategoryId, setEmployeeCategoryId] = useState("");
  const [reportView, setReportView] = useState("Seperate");
  const [form, setForm] = useState(true);
  const childRecord = useRef(0);
  const params = getCommonParams();
  const [groupBy, setGroupBy] = useState("");
  const designationRef = useRef(null);

  const [triggerReport, { data: allData, isFetching }] =
    useLazyGetAttendenceGenerationQuery();
  const { data: employeeCategory } = useGetEmployeeCategoryQuery({ params });

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


  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">



        <div className="w-full flex bg-white p-1 justify-between   items-center">
          <h1 className="master-header">Attendence Generation</h1>
          <div className="flex items-center gap-x-4">
            <select
              value={reportView}
              onChange={(e) => {
                setReportView(e.target.value);
              }}
              className="w-[110px]  px-1 py-0.5 text-xs text-[12px] border border-gray-300 rounded-lg
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-150 shadow-sm"
            >
              <option value="Seperate">Seperate</option>
              <option value="Single">Single</option>
            </select>
            <button
              onClick={() => {
                setForm(true);
                OnNew();
              }}
              className="bg-white w-[110px]  border ms-4 border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              + Generate
            </button>
          </div>
        </div>



        <div
          className={` mt-3  p-2 overflow-scroll bg-white max-h-[600px]`}
        >
          <table className="w-full border-collapse table-fixed ">

            <thead className="bg-gray-200 text-gray-800 ">
              <tr>
                <th
                  className={`w-[15px] px-1 text-center font-medium text-[13px] `}
                >
                  S.No
                </th>

                <th
                  className={`w-8  py-2 text-center font-medium text-[13px] `}
                >
                  Emp MId
                </th>
                <th
                  className={`w-[45px]  py-2 text-center font-medium text-[13px] `}
                >
                  Emp Name
                </th>
                <th
                  className={`w-[35px]  py-2 text-center font-medium text-[13px] `}
                >
                  Shift
                </th>
                <th
                  className={`w-[45px]  py-2 text-center font-medium text-[13px] `}
                >
                  Department
                </th>
                <th
                  className={`w-[65px]  py-2 text-center font-medium text-[13px] `}
                >
                  Designation
                </th>
                <th
                  className={`w-8  py-2 item-center font-medium text-[13px] `}
                >
                  In Date
                </th>
                <th className={`w-8 py-2 item-center font-medium text-[13px] `}>
                  In
                </th>
                <th
                  className={`w-8 py-2 item-center font-medium text-[13px] `}
                >
                  Out Date
                </th>
                <th className={`w-8 py-2 item-center font-medium text-[13px] `}>
                  Out
                </th>

                <th
                  colSpan={reportView === "Seperate" ? 4 : 2}
                  className={`${reportView === "Single" ? "w-32" : "w-40"} py-2 text-center font-medium text-[13px]`}                >
                  Other Punches
                </th>


                <th className={`w-[45px] py-2 item-center font-medium text-[13px] `}>
                  worked Hours
                </th>
                <th className={`w-[40px] py-2 item-center font-medium text-[13px] `}>
                  OT Hours
                </th>
                <th className={`w-[40px] py-2 item-center font-medium text-[13px] `}>
                  Shift Count
                </th>

              </tr>
              {/*
               */}
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
                            ? moment.utc(item.inTime).format("YYYY-MM-DD")
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
                            ? moment.utc(item.outTime).format("YYYY-MM-DD")
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
                      <input
                        type="text"
                        value={
                          item.totalWorkedTime || ''


                        }
                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                      />
                    </td>
                    <td
                      rowSpan={2}
                      className="  border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={
                          item.otHours || ''


                        }
                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                      />
                    </td>
                    <td
                      rowSpan={2}
                      className="  border border-gray-300 text-[12px] py-0.5 item-center"
                    >

                      <input
                        type="number"

                        className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent  `}
                      />
                    </td>

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
            <p className=" z-10 w-[100px] text-sm px-1 py-0.5 ">IRREGULAR</p>
            <tbody>
              {irregularData?.map((item, index) => (
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
                        className={`w-full   text-right pr-1 bg-transparent   focus:outline-none focus:border-transparent `}
                      />
                    </td>
                    <td
                      rowSpan={2}
                      className="border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={item?.firstName}
                        className={`w-full text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                      />
                    </td>
                    <td
                      rowSpan={2}
                      className="border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={item?.shiftName}
                        className={`w-full text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                      />
                    </td>
                    <td
                      rowSpan={2}
                      className="border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={item?.departmentName}
                        className={`w-full text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                      />
                    </td>
                    <td
                      rowSpan={2}
                      className="border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={item?.designationName}
                        className={`w-full text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
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
                            ? moment.utc(item.inTime).format("YYYY-MM-DD")
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
                        className={`w-full bg-transparent  text-center focus:outline-none focus:border-transparent`}
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
                            ? moment.utc(item.outTime).format("YYYY-MM-DD")
                            : ""
                        }
                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent`}
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
                        <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                          <input
                            min="0"
                            type="text"
                            value={
                              item.lunchBreakOut
                                ? moment
                                  .utc(item.lunchBreakOut)
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
                      <input
                        type="text"
                        value={
                          item.totalWorkedTime || ''


                        }
                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                      />
                    </td>
                    <td
                      rowSpan={2}
                      className="  border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={
                          item.otHours || ''


                        }
                        className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent  `}
                      />
                    </td>
                    <td
                      rowSpan={2}
                      className="  border border-gray-300 text-[12px] py-0.5 item-center"
                    >

                      <input
                        type="number"

                        className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent  `}
                      />
                    </td>
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
                      <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                        <input
                          type="text"
                          value={
                            item.lunchBreakIn
                              ? moment.utc(item.lunchBreakIn).format("HH:mm:ss")
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
            <p className="z-10 w-[100px] text-sm px-1 py-0.5 ">ABSENT</p>
            <tbody>
              {absentData?.map((item, index) => (
                <>
                  {/* Row 1 - In + Morning */}
                  <tr>
                    {/* S.No rowspan */}
                    <td className="border border-gray-300 py-1.5 text-[12px]  text-center px-1">
                      {index + 1}
                    </td>

                    {/* Employee Id rowspan */}
                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.mIdCard}
                        className={`w-full   text-right pr-1 bg-transparent   focus:outline-none focus:border-transparent `}
                      />
                    </td>
                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.firstName}
                        className={`w-full  text-left pl-2 bg-transparent   focus:outline-none focus:border-transparent `}
                      />
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>

        </div>
        {form === true && (
          <Modal
            isOpen={form}
            form={form}
            widthClass={"w-[30%]  h-[55%]"}
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
                              name="DOC Date"
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
