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
import { PDFViewer } from "@react-pdf/renderer";
import PrintFormat from "./PrintFormat";
import tw from "../../../Utils/tailwind-react-pdf";
import { FiChevronDown, FiChevronRight, FiPrinter, FiDownload } from "react-icons/fi";
import ExcelJS from "exceljs";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Group,
  Search,
  Toolbar,
  ExcelExport,
  PdfExport,
  Inject,
} from "@syncfusion/ej2-react-grids";
import BreakReportGrid from "./BreakReportGrid";
import { Header, Icon, HeaderContent } from 'semantic-ui-react'

const Form = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeCategoryId, setEmployeeCategoryId] = useState("");
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const [form, setForm] = useState(true);
  const childRecord = useRef(0);
  const params = getCommonParams();
  const [groupBy, setGroupBy] = useState("");
  const designationRef = useRef(null);

  const [triggerReport, { data: allData, isLoading, isSuccess }] =
    useLazyGetbreakReportQuery();
  const { data: employeeCategory } = useGetEmployeeCategoryQuery({ params });
  const gridRef = useRef(null);
  const pageSettings = { pageSize: 20 };

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
    setFromDate("");
    setToDate("")
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
        const reportDate = employee?.reportDate ? employee.reportDate?.split("T")[0] : "";
        const uniqueKey = `${employee.mIdCard}_${reportDate}`;

        if (!allEmployeesMap.has(uniqueKey)) {
          allEmployeesMap.set(uniqueKey, {
            mIdCard: employee.mIdCard,
            firstName: employee.firstName,
            departmentName: employee.departmentName,
            designationName: employee.designationName,
            reportDate,
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
    allEmployeesMap?.forEach((employee, key) => {
      const [mIdCard, reportDate] = key.split("_");

      // Morning Break Data
      const morningEmp = [...regularData, ...irregularData, ...SinglePunchData, ...absentData]
        .find(emp => `${emp.mIdCard}_${emp.reportDate?.split("T")[0]}` === key);
      if (morningEmp) {
        employee.firstBreakOut = morningEmp.firstBreakOut || employee.firstBreakOut;
        employee.firstBreakIn = morningEmp.firstBreakIn || employee.firstBreakIn;
        employee.breakDuration = morningEmp.breakDuration || employee.breakDuration;
        employee.morningBreakStatus = morningEmp.morningBreakStatus || employee.morningBreakStatus;
      }

      // Lunch Break Data
      const lunchEmp = [...lunchregularData, ...lunchirregularData, ...lunchSinglePunchData, ...lunchabsentData]
        .find(emp => `${emp.mIdCard}_${emp.reportDate?.split("T")[0]}` === key);
      if (lunchEmp) {
        employee.lunchBreakOut = lunchEmp.lunchBreakOut || employee.lunchBreakOut;
        employee.lunchBreakIn = lunchEmp.lunchBreakIn || employee.lunchBreakIn;
        employee.lunchBreakDuration = lunchEmp.lunchBreakDuration || employee.lunchBreakDuration;
        employee.lunchBreakStatus = lunchEmp.lunchBreakStatus || employee.lunchBreakStatus;
      }

      // Evening Break Data
      const eveningEmp = [...eveningregularData, ...eveningirregularData, ...eveningSinglePunchData, ...eveningabsentData]
        .find(emp => `${emp.mIdCard}_${emp.reportDate?.split("T")[0]}` === key);
      if (eveningEmp) {
        employee.eveningBreakOut = eveningEmp.eveningBreakOut || employee.eveningBreakOut;
        employee.eveningBreakIn = eveningEmp.eveningBreakIn || employee.eveningBreakIn;
        employee.eveningBreakDuration = eveningEmp.eveningBreakDuration || employee.eveningBreakDuration;
        employee.eveningBreakStatus = eveningEmp.eveningBreakStatus || employee.eveningBreakStatus;
      }
    });

    return Array.from(allEmployeesMap.values()).sort((a, b) => {
      const dateA = new Date(a.reportDate);
      const dateB = new Date(b.reportDate);
      return dateA - dateB; // ascending order: fromDate → toDate
    });
  };
  const employeeData = React.useMemo(() => prepareEmployeeData(), [
    regularData, irregularData, SinglePunchData, absentData,
    lunchregularData, lunchirregularData, lunchSinglePunchData, lunchabsentData,
    eveningregularData, eveningirregularData, eveningSinglePunchData, eveningabsentData
  ]);




  const handleDownloadExcel = async () => {
    if (!employeeData || employeeData.length === 0) {
      Swal.fire("No Data", "There is no data to export!", "info");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Break Report");

    // === Helper Functions ===
    const formatDateISO = (isoStr) => (isoStr ? isoStr.split("T")[0] : "");
    const formatTimeISO = (isoStr) => {
      if (!isoStr) return "";
      const t = isoStr.split("T")[1];
      return t ? t.split(".")[0] : "";
    };
    const formatStatus = (status) => {
      if (!status) return "";
      const val = status.toLowerCase();
      if (val.includes("correct")) return "On Time";
      if (val.includes("no punches")) return "No Punch";
      if (val.includes("delayed")) return "Delayed";
      if (val.includes("only one")) return "One Punch";
      return status;
    };
    const statusFill = (status) => {
      if (!status) return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // white
      const val = status.toLowerCase();
      if (val.includes("correct")) return { type: "pattern", pattern: "solid", fgColor: { argb: "FF16A34A" } }; // green
      if (val.includes("delayed")) return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFA500" } }; // orange
      if (val.includes("no punches")) return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF0000" } }; // red
      if (val.includes("only one")) return { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } }; // blue
      return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
    };
    // === Title Row ===
    worksheet.mergeCells("A1:R1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Date Wise Break Report";
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 14 };
    worksheet.getRow(1).height = 25;

    // === Header Rows ===
    worksheet.addRow([
      "S.No", "Emp MID", "Emp Name", "Department", "Designation", "Date",
      "Morning Tea Break", "", "", "", "Lunch Break", "", "", "",
      "Evening Tea Break", "", "", ""
    ]);
    worksheet.addRow([
      "", "", "", "", "", "",
      "Out", "In", "Duration", "Status",
      "Out", "In", "Duration", "Status",
      "Out", "In", "Duration", "Status"
    ]);

    // === Merge parent headers ===
    worksheet.mergeCells("A2:A3");
    worksheet.mergeCells("B2:B3");
    worksheet.mergeCells("C2:C3");
    worksheet.mergeCells("D2:D3");
    worksheet.mergeCells("E2:E3");
    worksheet.mergeCells("F2:F3");
    worksheet.mergeCells("G2:J2"); // Morning
    worksheet.mergeCells("K2:N2"); // Lunch
    worksheet.mergeCells("O2:R2"); // Evening

    // === Style Header Rows (always centered) ===
    [2, 3].forEach((r) => {
      const row = worksheet.getRow(r);
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD9D9D9" },
        };
        cell.font = { bold: true, color: { argb: "FF000000" } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    worksheet.getRow(2).height = 22;
    worksheet.getRow(3).height = 22;

    // === Column Widths ===
    worksheet.columns = [
      { width: 10 },
      { width: 14 },
      { width: 24 },
      { width: 20 },
      { width: 28 },
      { width: 14 },
      { width: 12 }, { width: 12 }, { width: 14 }, { width: 14 },
      { width: 12 }, { width: 12 }, { width: 14 }, { width: 14 },
      { width: 12 }, { width: 12 }, { width: 14 }, { width: 14 },
    ];

    // === Data Rows ===
    employeeData.forEach((emp, index) => {
      const row = worksheet.addRow([
        index + 1,
        emp.mIdCard || "",
        emp.firstName || "",
        emp.departmentName || "",
        emp.designationName || "",
        formatDateISO(emp.reportDate),
        formatTimeISO(emp.firstBreakOut),
        formatTimeISO(emp.firstBreakIn),
        emp.breakDuration || "",
        // formatStatus(emp.morningBreakStatus),
        "",
        formatTimeISO(emp.lunchBreakOut),
        formatTimeISO(emp.lunchBreakIn),
        emp.lunchBreakDuration || "",
        // formatStatus(emp.lunchBreakStatus),
        "",
        formatTimeISO(emp.eveningBreakOut),
        formatTimeISO(emp.eveningBreakIn),
        emp.eveningBreakDuration || "",
        // formatStatus(emp.eveningBreakStatus),
        ""
      ]);

      // ✅ Add padding for data cells only
      row.eachCell((cell) => {
        cell.alignment = {
          ...cell.alignment,
          indent: 1, // adds left/right padding
          vertical: "middle",
        };
      });

      // ✅ Apply status color
      const statusCells = [row.getCell(10), row.getCell(14), row.getCell(18)];
      // statusCells.forEach((cell) => {
      //   const text = (cell.value || "").toLowerCase();
      //   let color = null;

      //   if (text.includes("on time")) color = "FF166534"; // Green
      //   else if (text.includes("delayed")) color = "FFF97316"; // Orange
      //   else if (text.includes("no punch")) color = "FFEF4444"; // Red
      //   else if (text.includes("one punch")) color = "FF2563EB"; // Blue

      //   if (color) {
      //     cell.font = { color: { argb: color }, bold: true };
      //   }
      //   cell.alignment = { ...cell.alignment, horizontal: "center" };
      // });
      const statuses = [emp.morningBreakStatus, emp.lunchBreakStatus, emp.eveningBreakStatus];

      statusCells.forEach((cell, i) => {
        cell.value = "●"; // round dot
        cell.font = { color: { argb: statusFill(statuses[i]).fgColor.argb }, bold: true, size: 20 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin", color: { argb: "FFDDDDDD" } },
          left: { style: "thin", color: { argb: "FFDDDDDD" } },
          bottom: { style: "thin", color: { argb: "FFDDDDDD" } },
          right: { style: "thin", color: { argb: "FFDDDDDD" } },
        };
      });
      // ✅ Borders
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFDDDDDD" } },
          left: { style: "thin", color: { argb: "FFDDDDDD" } },
          bottom: { style: "thin", color: { argb: "FFDDDDDD" } },
          right: { style: "thin", color: { argb: "FFDDDDDD" } },
        };
      });

      // ✅ Alignment per column
      row.getCell(1).alignment = { horizontal: "center", indent: 1 };
      row.getCell(2).alignment = { horizontal: "right", indent: 1 };
      row.getCell(3).alignment = { horizontal: "left", indent: 1 };
      row.getCell(4).alignment = { horizontal: "left", indent: 1 };
      row.getCell(5).alignment = { horizontal: "left", indent: 1 };
      row.getCell(6).alignment = { horizontal: "center", indent: 1 };
      row.getCell(10).alignment = { horizontal: "center",  };
      row.getCell(14).alignment = { horizontal: "center",  };
      row.getCell(18).alignment = { horizontal: "center",  };

    });
    // === Add Empty Row at the End (same style as header) ===
    const emptyRow = worksheet.addRow(new Array(18).fill("")); // 18 columns total

    emptyRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" }, // same as header background
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFDDDDDD" } },
        left: { style: "thin", color: { argb: "FFDDDDDD" } },
        bottom: { style: "thin", color: { argb: "FFDDDDDD" } },
        right: { style: "thin", color: { argb: "FFDDDDDD" } },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Optional: set row height for spacing
    emptyRow.height = 20;

    // === Download ===
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Date Wise Break Report_${moment().format("YYYYMMDD_HHmmss")}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Modal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        widthClass={"w-[90%] h-[90%]"}
      >
        <PDFViewer style={tw("w-full h-full")} >
          <PrintFormat
            employeeData={employeeData}
            reportTitle="Date Wise Break Report"
          />

        </PDFViewer>
      </Modal>

      <div onKeyDown={handleKeyDown} className="p-1 ">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="master-header">Date Wise Break Report</h1>
          <div className="flex items-center gap-x-4">

            {/* <div className="flex gap-2 flex-wrap"> */}

            {/* <button
              className="bg-white   border  border-red text-red-600 hover:bg-red-600 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
              onClick={() => setShowGrid((prev) => !prev)}
            >
              {showGrid ? "Show Table View" : "Show Filter View"}
            </button> */}
            <button
              className="bg-white   border  border-black text-black-600 hover:bg-black hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
              onClick={() => setPrintModalOpen(true)}
            >
              <FiPrinter className="w-4 h-4" />
              Print PDF
            </button>
            <button
              className="bg-white   border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
              onClick={handleDownloadExcel}
            >
              <FiDownload className="w-4 h-4" />
              Download Excel
            </button>
            {/* </div> */}

            <button
              onClick={() => {
                setForm(true);
                OnNew();
              }}
              className="bg-white w-[140px]  border  border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white text-sm px-1  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              + Report Param
            </button>
          </div>
        </div>

        {/* ==== Syncfusion Grid View ==== */}
        {showGrid && (
          <div className="mt-2 ">

            <div
              className="w-[100vw] max-w-[1570px] bg-white p-2 rounded-lg shadow-md border border-gray-200"
              style={{
                height: "75vh",          // ✅ fixed height area (viewport-relative)
                overflow: "auto",        // ✅ both X and Y scrolls inside
              }}
            >
              <BreakReportGrid employeeData={employeeData} />
            </div>
            <div className="mt-3 flex items-center gap-4 justify-end text-sm mr-3">
              {/* On Time */}
              <div className="flex items-center gap-1">
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "#22C55E",
                    borderRadius: 6,
                    alignSelf: "center",
                  }}
                />
                <span>On Time</span>
              </div>
              {/* Delayed */}
              <div className="flex items-center gap-1">
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "red",
                    borderRadius: 6,
                    alignSelf: "center",
                  }}
                />
                <span>Delayed</span>
              </div>
              {/* Miss Punch */}
              <div className="flex items-center gap-1">
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "blue",
                    borderRadius: 6,
                    alignSelf: "center",
                  }}
                />
                <span>Miss Punch</span>
              </div>

              {/* No Punches */}
              <div className="flex items-center gap-1">
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "orange",
                    borderRadius: 6,
                    alignSelf: "center",
                  }}
                />
                <span>No Punches</span>
              </div>


            </div>

          </div>
        )}


        {!showGrid && (
          <div className="mt-3 w-full p-2 overflow-x-auto bg-white max-h-[580px]">
            <table className="w-full  border-collapse table-fixed">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th className="w-[15px] px-1 text-center font-medium text-[13px]  ">S.No</th>
                  <th className="w-6 py-2 text-center font-medium text-[13px]  ">Emp MId</th>
                  <th className="w-[40px] py-2 text-center font-medium text-[13px]  ">Emp Name</th>
                  <th className="w-[35px] py-2 text-center font-medium text-[13px]  ">Department</th>
                  <th className="w-[55px] py-2 text-center font-medium text-[13px]  ">Designation</th>
                  <th className="w-8 py-2 text-center font-medium text-[13px]  border-r border-gray-300">Date</th>

                  <th colSpan={4} className="w-28 py-2 text-center font-medium text-[13px] border border-gray-300">
                    Morning Tea Break
                  </th>

                  <th colSpan={4} className="w-28 py-2 text-center font-medium text-[13px] border border-gray-300">
                    Lunch Break
                  </th>

                  <th colSpan={4} className="w-28 py-2 text-center font-medium text-[13px] border border-gray-300">
                    Evening Tea Break
                  </th>
                </tr>

                <tr>
                  <th colSpan={6} className="border border-gray-300"></th>

                  <th className="text-center font-medium text-[12px] border border-gray-300">Out</th>
                  <th className="text-center font-medium text-[12px] border border-gray-300">In</th>
                  <th className="text-center font-medium text-[12px] border border-gray-300">Duration</th>
                  <th className="text-center font-medium text-[12px] border border-gray-300">Status</th>

                  <th className="text-center font-medium text-[12px] border border-gray-300">Out</th>
                  <th className="text-center font-medium text-[12px] border border-gray-300">In</th>
                  <th className="text-center font-medium text-[12px] border border-gray-300">Duration</th>
                  <th className="text-center font-medium text-[12px] border border-gray-300">Status</th>

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
                  // date={date}

                  />
                ))}
              </tbody>
            </table>
          </div>)}
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
                    Date Wise Break Report
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
                              name="From Date"
                              value={fromDate}
                              setValue={setFromDate}
                              required={true}
                              disabled={childRecord.current > 0}
                              ref={designationRef}
                            />
                          </div>
                          <div>
                            <DateInput
                              name="To Date"
                              value={toDate}
                              setValue={setToDate}
                              required={true}
                              disabled={childRecord.current > 0}
                            // ref={toDateRef}
                            />
                          </div>

                          <div>
                            <button
                              onClick={() => {
                                if (!toDate && !fromDate) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Submission error",
                                    text: "Please fill all required fields...!",
                                  });
                                  return;
                                }
                                if (new Date(fromDate) > new Date(toDate)) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Invalid Range",
                                    text: "From Date cannot be later than To Date.",
                                  });
                                  return;
                                }

                                triggerReport({
                                  searchParams: {
                                    fromDate,
                                    toDate,
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
