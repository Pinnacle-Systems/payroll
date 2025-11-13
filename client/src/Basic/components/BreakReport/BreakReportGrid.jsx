

import React, { useRef, useEffect } from "react";
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
import breakReoprt from './breakReoprt.css'
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const BreakReportGrid = ({ employeeData }) => {
    const gridRef = useRef(null);

    // Toolbar (search only for now)
    const toolbarOptions = ["ExcelExport", "PdfExport"];

    const formatTime = (value) => {
        if (!value) return "-";
        const timePart = value?.split("T")[1]?.split(".")[0]; // => "16:17:12"
        return timePart || "-";
    };

    useEffect(() => {
        if (gridRef.current) {
            // Get all tbody cells
            const tbodyCells = gridRef.current.element.querySelectorAll('.e-rowcell');
            console.log(tbodyCells);

            // Example: log class names for each cell
            tbodyCells.forEach(cell => {
                console.log(cell.className); // e.g., "e-rowcell col-emp"
            });
        }
    }, []);


    // 1️⃣ Simplify status text only
    const simplifyStatus = (status) => {
        if (!status) return "No Data";
        if (status.includes("No Punches Available")) return "No Punch";
        if (status.includes("Only One Punch Available")) return "One Punch";
        if (status.includes("Correct")) return "On Time";
        if (status.includes("Delayed")) return "Delayed";
        return status;
    };


    const employeeDataWithSno = employeeData?.map((emp, index) => {
        const date = emp.reportDate ? new Date(emp.reportDate) : null;
        if (date) date.setHours(0, 0, 0, 0); // Normalize time
        return {
            ...emp,
            sno: index + 1,
            reportDate: date,
        };
    });
    ;
    const statusFill = (status) => {
        if (!status) return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }; // white
        const val = status.toLowerCase();
        if (val.includes("correct")) return { type: "pattern", pattern: "solid", fgColor: { argb: "FF16A34A" } }; // green
        if (val.includes("delayed")) return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFA500" } }; // orange
        if (val.includes("no punches")) return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF0000" } }; // red
        if (val.includes("only one")) return { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } }; // blue
        return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } };
    };
    const greyBorder = {
        top: { color: "#EBEDF7", lineStyle: "Thin" },
        left: { color: "#EBEDF7", lineStyle: "Thin" },
        bottom: { color: "#EBEDF7", lineStyle: "Thin" },
        right: { color: "#EBEDF7", lineStyle: "Thin" },
    };

    const handleExcelQueryCellInfo = (args) => {
        const statusColumns = ["morningBreakStatus", "lunchBreakStatus", "eveningBreakStatus"];

        // Default style: apply borders to all cells
        // args.style = {
        //     // borders: greyBorder,
        //     hAlign: "Center",
        //     vAlign: "Center",
        //     fontSize: 8,



        // };
        if (statusColumns.includes(args.column.field)) {
            const status = (args.value || "").toLowerCase();

            // Map status to dot color
            let dotColor = "#000000"; // default black

            if (status.includes("correct")) dotColor = "#16A34A"; // green
            else if (status.includes("delayed")) dotColor = "#FF0000"; // red
            else if (status.includes("no punches")) dotColor = "#FFA500"; // orange
            else if (status.includes("only one")) dotColor = "#2563EB"; // blue

            // Excel export style
            args.style = {
                ...args.style, // keep borders

                fontColor: dotColor, // ✅ correct property for Excel export
                hAlign: "Center",
                vAlign: "Center",
                bold: true,
                fontSize: 16, // bigger for dot
                backColor: "#FFFFFF", // keep background white
            };

            // Put the dot
            args.value = "●";
        }
    
    };



    // Toolbar click triggers Excel export
    const handleToolbarClick = async (args) => {
        if (args.item.id.includes("excelexport")) {
            gridRef.current.excelExport({
                fileName: "Break_Report.xlsx",
                header: {
                    headerRows: 1,
                    rows: [
                        {
                            cells: [
                                {
                                    colSpan: 18,
                                    value: "Date Wise Break Report",
                                    style: {
                                        fontSize: 12,
                                        bold: true,
                                        hAlign: "Center",
                                        vAlign: "Center",
                                        fontColor: "#111827",
                                        backColor: "#E5E7EB",
                                        fontName: "Poppins", // ✅ Change here

                                    },
                                },
                            ],
                        },
                    ],
                },
                theme: {
                    header: {
                        fontColor: "#111827",
                        backColor: "#E5E7EB",
                        bold: true,
                        fontSize: 10,
                        fontName: "Poppins", // ✅ Change here
                        hAlign: "Center",
                        vAlign: "Center",
                    },
                    record: {
                        fontColor: "#111827",
                        backColor: "#ffffff",
                        fontName: "Poppins", // ✅ Change here
                        fontSize: 9,
                        // borders: greyBorder,
                        hAlign: "Center",
                        vAlign: "Center",

                    },
                    group: {
                        fontName: "Poppins",
                        fontSize: 9, // smaller font for grouped rows in Excel
                        bold: false,
                    },
                },
                rowHeight: 12, // <-- reduce this value to make rows smaller

                queryCellInfo: handleExcelQueryCellInfo, // colored dots + borders


            });
        }
    };


    

    return (
        <div>

            <GridComponent
                ref={gridRef}
                // dataSource={employeeData}
                dataSource={employeeDataWithSno}
                excelQueryCellInfo={handleExcelQueryCellInfo}

                rowHeight={30}   // <---- controls all body row heigh25
                pageSettings={{ pageSize: 40 }}
                allowSorting={true}

                allowGrouping={true}
                groupSettings={{
                    showDropArea: true,
                }}
                toolbar={['ExcelExport']}
                allowFiltering={true}
                filterSettings={{ type: "Excel" }}
                gridLines="Both"
                height="auto"
                allowPaging={true}
                allowExcelExport={true}
                allowPdfExport={true}
                toolbarClick={handleToolbarClick}

            >
                <ColumnsDirective>
                    {/* ==== EMPLOYEE INFO ==== */}
                    <ColumnDirective
                        field="sno"
                        headerText="S.No"
                        width="50"
                        textAlign="Center"
                        headerTextAlign="Center" // header cell alignment
                        customAttributes={{ class: "col-sno" }}
                        allowSorting={false}    // Prevent sorting on serial number

                    />

                    <ColumnDirective
                        field="mIdCard"
                        headerText="MID"
                        width="55"
                        headerTextAlign="Center" // header cell alignment
                        textAlign="Right"

                        customAttributes={{ class: "col-mid" }}   // 👈 add class here


                    />
                    <ColumnDirective
                        field="firstName"
                        headerText="Emp Name"
                        width="115"
                        headerTextAlign="Center" // header cell alignment
                        textAlign="left"

                        customAttributes={{ class: "col-emp" }}

                    />
                    <ColumnDirective
                        field="departmentName"
                        headerText="Department"
                        width="100"
                        headerTextAlign="Center" // header cell alignment
                        textAlign="left"

                        customAttributes={{ class: "col-dept" }}

                    />
                    <ColumnDirective
                        field="designationName"
                        headerText="Designation"
                        width="155"
                        headerTextAlign="Center" // header cell alignment
                        textAlign="left"

                        customAttributes={{ class: "col-desig" }}

                    />
                    <ColumnDirective
                        field="reportDate"
                        headerText="Date"
                        width="90"
                        format="dd/MM/yyyy"
                        headerTextAlign="Center" // header cell alignment
                        textAlign="center"
                        type="date"

                        customAttributes={{ class: "col-date" }}

                    />

                    {/* ==== MORNING BREAK ==== */}
                    <ColumnDirective headerText="Morning Tea Break" headerTextAlign="Center" customAttributes={{ class: "col-break-header" }} columns={[
                        {
                            headerTextAlign: "Center", field: "firstBreakOut",        // ✅ important
                            headerText: "Out", width: 65, textAlign: "Center",       // ✅ important
                            valueAccessor: (f, d) => formatTime(d.firstBreakOut), customAttributes: { class: "col-break" }
                        },
                        {
                            headerTextAlign: "Center", headerText: "In", field: "firstBreakIn",        // ✅ important
                            width: 65, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.firstBreakIn),
                            customAttributes: { class: "col-break" }
                        },
                        { headerTextAlign: "Center", textAlign: "right", field: "breakDuration", headerText: "Duration", width: 75, customAttributes: { class: "col-break" } },
                        {
                            headerTextAlign: "Center", textAlign: "Left", headerText: "Status", width: 70, field: "morningBreakStatus",

                            // valueAccessor: (f, d) => simplifyStatus(d.morningBreakStatus), customAttributes: { class: "col-break" } 
                            template: (props) => {
                                let status = props.morningBreakStatus || "";
                                let color = "#9CA3AF"; // default gray

                                if (status.includes("No Punches Available")) color = "#FB923C"; // orange
                                else if (status.includes("Only One Punch Available")) color = "#3649f5ff"; // amber
                                else if (status.includes("Correct")) color = "#22C55E"; // green
                                else if (status.includes("Delayed")) color = "#EF4444"; // red

                                return (
                                    <div
                                        style={{
                                            width: 13,
                                            height: 13,
                                            backgroundColor: color,
                                            borderRadius: "50%",
                                            margin: "auto",
                                        }}
                                    ></div>
                                )
                            },

                        },
                    ]} />

                    {/* ==== LUNCH BREAK ==== */}
                    <ColumnDirective headerText="Lunch Break" customAttributes={{ class: "col-break-header" }} columns={[
                        { headerTextAlign: "Center", field: "lunchBreakOut", headerText: "Out", width: 65, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.lunchBreakOut), customAttributes: { class: "col-break" } },
                        { headerTextAlign: "Center", field: "lunchBreakIn", headerText: "In", width: 65, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.lunchBreakIn), customAttributes: { class: "col-break" } },
                        { headerTextAlign: "Center", field: "lunchBreakDuration", textAlign: "right", headerText: "Duration", width: 75, customAttributes: { class: "col-break" } },
                        {
                            headerTextAlign: "Center", textAlign: "Left", headerText: "Status", width: 70, field: "lunchBreakStatus",
                            // valueAccessor: (f, d) => simplifyStatus(d.lunchBreakStatus), 
                            template: (props) => {
                                let status = props.lunchBreakStatus || "";
                                let color = "#9CA3AF"; // default gray

                                if (status.includes("No Punches Available")) color = "#FB923C"; // orange
                                else if (status.includes("Only One Punch Available")) color = "#3649f5ff"; // amber
                                else if (status.includes("Correct")) color = "#22C55E"; // green
                                else if (status.includes("Delayed")) color = "#EF4444"; // red

                                return (
                                    <div
                                        style={{
                                            width: 13,
                                            height: 13,
                                            backgroundColor: color,
                                            borderRadius: "50%",
                                            margin: "auto",
                                        }}
                                    ></div>
                                )
                            },


                            customAttributes: { class: "col-break" }
                        },
                    ]} />

                    {/* ==== EVENING BREAK ==== */}
                    <ColumnDirective headerText="Evening Tea Break" customAttributes={{ class: "col-break-header" }} columns={[
                        { headerTextAlign: "Center", field: "eveningBreakOut", headerText: "Out", width: 65, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.eveningBreakOut), customAttributes: { class: "col-break" } },
                        { headerTextAlign: "Center", field: "eveningBreakIn", headerText: "In", width: 65, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.eveningBreakIn), customAttributes: { class: "col-break" } },
                        { headerText: "Duration", headerTextAlign: "Center", textAlign: "right", field: "eveningBreakDuration", width: 75, textAlign: "right", customAttributes: { class: "col-break" } },
                        {
                            headerTextAlign: "Center", textAlign: "Left", headerText: "Status", width: 70, field: "eveningBreakStatus",
                            //  valueAccessor: (f, d) => simplifyStatus(d.eveningBreakStatus),
                            template: (props) => {
                                let status = props.eveningBreakStatus || "";
                                let text = "No Data";
                                let colorClass = "text-gray-600";

                                let color = "#9CA3AF"; // default gray

                                if (status.includes("No Punches Available")) color = "#FB923C"; // orange
                                else if (status.includes("Only One Punch Available")) color = "#3649f5ff"; // amber
                                else if (status.includes("Correct")) color = "#22C55E"; // green
                                else if (status.includes("Delayed")) color = "#EF4444"; // red

                                return (
                                    <div
                                        style={{
                                            width: 13,
                                            height: 13,
                                            backgroundColor: color,
                                            borderRadius: "50%",
                                            margin: "auto",
                                        }}
                                    ></div>
                                )
                            },
                            customAttributes: { class: "col-break" }
                        },
                    ]} />
                </ColumnsDirective>

                <Inject
                    services={[
                        Page,
                        Sort,
                        Filter,
                        Group,
                        Search,
                        Toolbar,
                        ExcelExport,
                        PdfExport,
                    ]}
                />
            </GridComponent>

        </div>

    );
};

export default BreakReportGrid;
