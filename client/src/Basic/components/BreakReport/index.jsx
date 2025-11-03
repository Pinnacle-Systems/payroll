import React, { useEffect, useState, useRef } from "react";

import { ReusableTable, DateInput, customSelectStyles } from "../../../Inputs";
import Select from "react-select";
import { useGetEmployeeCategoryQuery } from "../../../redux/services/EmployeeCategoryMasterService";
import { useGetEmployeeQuery } from "../../../redux/services/EmployeeMasterService";
import { useLazyGetbreakReportQuery } from "../../../redux/services/BreakReportGenerationService";
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
    useLazyGetbreakReportQuery();
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
    allData?.data?.filter((item) => item.breakStatus === "No Punches Available") || [];
  const regularData =
    allData?.data?.filter((item) => item.breakStatus === "Correct Break") || [];
  const irregularData =
    allData?.data?.filter((item) => item.breakStatus === "Delayed Break") || [];
  const SinglePunchData =
    allData?.data?.filter((item) => item.breakStatus === "Only One Punch Available") || [];


  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="master-header">Break Report</h1>
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
          className={` mt-3  p-2 overflow-auto bg-white max-h-[600px]`}
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
                  Employee Name
                </th>

                <th
                  className={`w-8  py-2 item-center font-medium text-[13px] `}
                >
                  Date
                </th>


                <th
                  colSpan={2}
                  className={`w-20 py-2 text-center font-medium text-[13px]`}                >
                   Punches
                </th>


                <th
                  className={`w-8  py-2 item-center font-medium text-[13px] `}
                >
                  Time taken
                </th>
                <th
                  className={`w-52  py-2 item-center font-medium text-[13px] `}
                >
                  
                </th>

              </tr>
              {/*
               */}
            </thead>


            <p className=" z-10 w-[200px] text-sm px-1 py-0.5  ">Reached at Correct Time</p>

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
                        className={`w-full  text-center bg-transparent   focus:outline-none focus:border-transparent `}
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



                    {/* In Date */}
                    <td
                      rowSpan={2}
                      className=" border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={
                          item.firstBreakOut
                            ? moment
                              .utc(item.firstBreakOut)
                              .format("YYYY-MM-DD")
                            : ""
                        }
                        className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
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

                            ]
                              .filter(Boolean) // remove null or empty values
                              .join(" , ")} // join only existing values
                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                            disabled
                          />
                        </td>
                      </>
                    )}
                    <td
                      rowSpan={2}
                      className=" border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="number"
                        value={
                          item.breakDuration || 0
                        }
                        className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
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


                    </>
                  )}

                  <tr>{/* Evening Break In */}</tr>
                </React.Fragment>
              ))}
            </tbody>
            <p className=" z-10 w-[100px] text-sm px-1 py-0.5 ">Delayed</p>
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
                        className={`w-full  text-center bg-transparent   focus:outline-none focus:border-transparent `}
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



                    {/* In Date */}
                    <td
                      rowSpan={2}
                      className=" border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={
                          item.firstBreakOut
                            ? moment
                              .utc(item.firstBreakOut)
                              .format("YYYY-MM-DD")
                            : ""
                        }
                        className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
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

                            ]
                              .filter(Boolean) // remove null or empty values
                              .join(" , ")} // join only existing values
                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                            disabled
                          />
                        </td>
                      </>
                    )}
                    <td
                      rowSpan={2}
                      className=" border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="number"
                        value={
                          item.breakDuration || 0
                        }
                        className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
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


                    </>
                  )}

                  <tr>{/* Evening Break In */}</tr>
                </React.Fragment>
              ))}
            </tbody>
            <p className="z-10 w-[100px] text-sm px-1 py-0.5 ">Single Punch</p>
            <tbody>
              {SinglePunchData?.map((item, index) => (
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
                        className={`w-full  text-center bg-transparent   focus:outline-none focus:border-transparent `}
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



                    {/* In Date */}
                    <td
                      rowSpan={2}
                      className=" border border-gray-300 text-[12px] py-0.5 item-center"
                    >
                      <input
                        type="text"
                        value={
                          item.firstBreakOut
                            ? moment
                              .utc(item.firstBreakOut)
                              .format("YYYY-MM-DD")
                            : ""
                        }
                        className={`w-full text-center bg-transparent   focus:outline-none focus:border-transparent `}
                      />
                    </td>



                    {reportView === "Seperate" && (
                      <>
                       
                        <td colSpan={2} className="border border-gray-300 text-[12px] py-0.5 item-center">
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

                            ]
                              .filter(Boolean) // remove null or empty values
                              .join(" , ")} // join only existing values
                            className={`w-full bg-transparent text-center focus:outline-none focus:border-transparent `}
                            disabled
                          />
                        </td>
                      </>
                    )}
                  

                  </tr>

                
                  <tr>{/* Evening Break In */}</tr>
                </React.Fragment>
              ))}
            </tbody>
            <p className="z-10 w-[100px] text-sm px-1 py-0.5 ">No Punches</p>
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
                        className={`w-full  text-center bg-transparent   focus:outline-none focus:border-transparent `}
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
