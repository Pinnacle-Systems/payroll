import React, { useEffect, useState, useRef } from "react";
import BreakTimeCells from './BreakTimeCells'

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
import EmployeeBreakRow from './EmployeeBreakRow'
const Form = () => {
  const [date, setDate] = useState("");
  const [employeeCategoryId, setEmployeeCategoryId] = useState("");

  const [form, setForm] = useState(true);
  const childRecord = useRef(0);
  const params = getCommonParams();
  const [groupBy, setGroupBy] = useState("");
  const designationRef = useRef(null);

  const [triggerReport, { data: allData, isFetching }] =
    useLazyGetbreakReportQuery();
  const { data: employeeCategory } = useGetEmployeeCategoryQuery({ params });

  // const { data: employeeData } = useGetEmployeeQuery({ params });

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
    allData?.data?.filter((item) => item.morningBreakStatus === "No Punches Available") || [];
  const regularData =
    allData?.data?.filter((item) => item.morningBreakStatus === "Correct Break") || [];
  const irregularData =
    allData?.data?.filter((item) => item.morningBreakStatus === "Delayed Break") || [];
  const SinglePunchData =
    allData?.data?.filter((item) => item.morningBreakStatus === "Only One Punch Available") || [];
  const lunchabsentData =
    allData?.data?.filter((item) => item.lunchBreakStatus === "Lunch No Punches Available") || [];
  const lunchregularData =
    allData?.data?.filter((item) => item.lunchBreakStatus === "Correct Lunch Break") || [];
  const lunchirregularData =
    allData?.data?.filter((item) => item.lunchBreakStatus === "Delayed Lunch Break") || [];
  const lunchSinglePunchData =
    allData?.data?.filter((item) => item.lunchBreakStatus === "Only One Punch Available Lunch") || [];
  const eveningabsentData =
    allData?.data?.filter((item) => item.eveningBreakStatus === "Evening No Punches Available") || [];
  const eveningregularData =
    allData?.data?.filter((item) => item.eveningBreakStatus === "Correct Evening Break") || [];
  const eveningirregularData =
    allData?.data?.filter((item) => item.eveningBreakStatus === "Delayed Evening Break") || [];
  const eveningSinglePunchData =
    allData?.data?.filter((item) => item.eveningBreakStatus === "Evening Only One Punch Available") || [];

  console.log("lunchregularData:", lunchregularData);
  const prepareEmployeeData = () => {
    // Get ALL unique employees from ALL data sources
    const allEmployeesMap = new Map();

    // Combine all data arrays
    const allDataArrays = [
      ...(regularData || []),
      ...(irregularData || []),
      ...(SinglePunchData || []),
      ...(absentData || []),
      ...(lunchregularData || []),
      ...(lunchirregularData || []),
      ...(lunchSinglePunchData || []),
      ...(lunchabsentData || []),
      ...(eveningregularData || []),
      ...(eveningirregularData || []),
      ...(eveningSinglePunchData || []),
      ...(eveningabsentData || [])
    ];

    // First pass: Create unique employees with all fields
    allDataArrays.forEach(employee => {
      if (employee?.mIdCard) {
        if (!allEmployeesMap.has(employee.mIdCard)) {
          // Initialize employee with all possible fields
          allEmployeesMap.set(employee.mIdCard, {
            mIdCard: employee.mIdCard,
            firstName: employee.firstName,
            departmentName: employee.departmentName,
            designationName: employee.designationName,
            reportDate : employee?.reportDate ,
            // Morning break fields
            firstBreakOut: null,
            firstBreakIn: null,
            breakDuration: 0,
            morningBreakStatus: employee.morningBreakStatus,
            // Lunch break fields
            lunchBreakOut: null,
            lunchBreakIn: null,
            lunchBreakDuration: 0,
            lunchBreakStatus: employee.lunchBreakStatus,
            // Evening break fields
            eveningBreakOut: null,
            eveningBreakIn: null,
            eveningBreakDuration: 0,
            eveningBreakStatus: employee.eveningBreakStatus
          });
        }
      }
    });

    // Second pass: Populate break data from specific arrays
    allEmployeesMap?.forEach((employee, mIdCard) => {
      // Morning Break Data
      const morningEmp = [...regularData, ...irregularData, ...SinglePunchData, ...absentData]
        .find(emp => emp.mIdCard === mIdCard);
      if (morningEmp) {
        employee.firstBreakOut = morningEmp.firstBreakOut || employee.firstBreakOut;
        employee.firstBreakIn = morningEmp.firstBreakIn || employee.firstBreakIn;
        employee.breakDuration = morningEmp.breakDuration || employee.breakDuration;
        employee.morningBreakStatus = morningEmp.morningBreakStatus || employee.morningBreakStatus;
      }

      // Lunch Break Data
      const lunchEmp = [...lunchregularData, ...lunchirregularData, ...lunchSinglePunchData, ...lunchabsentData]
        .find(emp => emp.mIdCard === mIdCard);
      if (lunchEmp) {
        employee.lunchBreakOut = lunchEmp.lunchBreakOut || employee.lunchBreakOut;
        employee.lunchBreakIn = lunchEmp.lunchBreakIn || employee.lunchBreakIn;
        employee.lunchBreakDuration = lunchEmp.lunchBreakDuration || employee.lunchBreakDuration;
        employee.lunchBreakStatus = lunchEmp.lunchBreakStatus || employee.lunchBreakStatus;
      }

      // Evening Break Data
      const eveningEmp = [...eveningregularData, ...eveningirregularData, ...eveningSinglePunchData, ...eveningabsentData]
        .find(emp => emp.mIdCard === mIdCard);
      if (eveningEmp) {
        employee.eveningBreakOut = eveningEmp.eveningBreakOut || employee.eveningBreakOut;
        employee.eveningBreakIn = eveningEmp.eveningBreakIn || employee.eveningBreakIn;
        employee.eveningBreakDuration = eveningEmp.eveningBreakDuration || employee.eveningBreakDuration;
        employee.eveningBreakStatus = eveningEmp.eveningBreakStatus || employee.eveningBreakStatus;
      }
    });

    return Array.from(allEmployeesMap.values());
  };
  const employeeData = React.useMemo(() => prepareEmployeeData(), [
    regularData, irregularData, SinglePunchData, absentData,
    lunchregularData, lunchirregularData, lunchSinglePunchData, lunchabsentData,
    eveningregularData, eveningirregularData, eveningSinglePunchData, eveningabsentData
  ]);
  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="master-header">DataWise Break Report</h1>
          <div className="flex items-center gap-x-4">

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



        <div className="mt-3 w-full p-2 overflow-x-auto bg-white max-h-[580px]">
          <table className="w-full min-w-[1200px] border-collapse table-fixed">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="w-[15px] px-1 text-center font-medium text-[13px]  ">S.No</th>
                <th className="w-6 py-2 text-center font-medium text-[13px]  ">Emp MId</th>
                <th className="w-[40px] py-2 text-center font-medium text-[13px]  ">Emp Name</th>
                <th className="w-[35px] py-2 text-center font-medium text-[13px]  ">Department</th>
                <th className="w-[55px] py-2 text-center font-medium text-[13px]  ">Designation</th>
                <th className="w-8 py-2 text-center font-medium text-[13px]  border-r border-gray-300">Date</th>

                {/* Morning Tea Break */}
                <th colSpan={4} className="w-28 py-2 text-center font-medium text-[13px] border border-gray-300">
                  Morning Tea Break
                </th>

                {/* Lunch Break */}
                <th colSpan={4} className="w-28 py-2 text-center font-medium text-[13px] border border-gray-300">
                  Lunch Break
                </th>

                {/* Evening Tea Break */}
                <th colSpan={4} className="w-28 py-2 text-center font-medium text-[13px] border border-gray-300">
                  Evening Tea Break
                </th>
              </tr>

              {/* Sub-headers for each break */}
              <tr>
                <th colSpan={6} className="border border-gray-300"></th>

                {/* Morning Tea Break sub-headers */}
                <th className="text-center font-medium text-[12px] border border-gray-300">Out</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">In</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">Duration</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">Status</th>

                {/* Lunch Break sub-headers */}
                <th className="text-center font-medium text-[12px] border border-gray-300">Out</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">In</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">Duration</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">Status</th>

                {/* Evening Tea Break sub-headers */}
                <th className="text-center font-medium text-[12px] border border-gray-300">Out</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">In</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">Duration</th>
                <th className="text-center font-medium text-[12px] border border-gray-300">Status</th>
              </tr>
            </thead>

            <tbody>
              {employeeData?.map((employee, index) => (
                <EmployeeBreakRow
                  key={employee.mIdCard || index}
                  employee={employee}
                  index={index}
                  date={date} // Pass the selected date as prop

                />
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
                    BREAK REPORT GENERATION
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
                              className="w-full px-1 py-0.5 text-xs text-[12px] border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 shadow-sm"
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
