

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
const BreakReportGrid = ({ employeeData }) => {
    const gridRef = useRef(null);

    // Toolbar (search only for now)
    const toolbarOptions = ["Search"];

    const formatTime = (value) => {
        if (!value) return "-";

        // If the value looks like: "2025-10-30T16:17:12.000Z"
        // or "2025-10-30T16:17:12"
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

    // 2️⃣ Separate function for color
    const getStatusColor = (status) => {
        const simplified = simplifyStatus(status); // call simplifyStatus
        switch (simplified) {
            case "On Time": return "text-green-600";
            case "Delayed": return "text-orange-600";
            case "One Punch": return "text-blue-600";
            case "No Punch": return "text-red-600";
            default: return "text-gray-600";
        }
    };

const employeeDataWithSno = employeeData?.map((emp, index) => ({
    ...emp,
    sno: index + 1
}));

    return (
        <GridComponent
            ref={gridRef}
            // dataSource={employeeData}
            dataSource={employeeDataWithSno} 

            rowHeight={30}   // <---- controls all body row heigh25
            pageSettings={{ pageSize: 20 }}
            allowSorting={true}
            // allowFiltering={true}

            allowGrouping={true}
            groupSettings={{ showDropArea: true }}
            // toolbar={toolbarOptions}

            gridLines="Both"
            height="auto"
            allowPaging={false}
        >
            <ColumnsDirective>
                {/* ==== EMPLOYEE INFO ==== */}
                <ColumnDirective
                    field="sno"
                    headerText="S.No"
                    width="40"
                    textAlign="Center"
                    headerTextAlign="Center" // header cell alignment
                    customAttributes={{ class: "col-sno" }}
                               allowSorting={false}    // Prevent sorting on serial number

                />

                <ColumnDirective
                    field="mIdCard"
                    headerText="MID"
                    width="65"
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
                    width="165"
                    headerTextAlign="Center" // header cell alignment
                    textAlign="left"

                    customAttributes={{ class: "col-desig" }}

                />
                <ColumnDirective
                    field="reportDate"
                    headerText="Date"
                    width="90"
                    format="yMd"
                    headerTextAlign="Center" // header cell alignment
                    textAlign="center"

                    customAttributes={{ class: "col-date" }}

                />

                {/* ==== MORNING BREAK ==== */}
                <ColumnDirective headerText="Morning Tea Break"  headerTextAlign="Center" customAttributes={{ class: "col-break-header" }} columns={[
                    {
                        headerTextAlign: "Center", field: "firstBreakOut",        // ✅ important
                        headerText: "Out", width: 80, textAlign: "Center",       // ✅ important
                        valueAccessor: (f, d) => formatTime(d.firstBreakOut), customAttributes: { class: "col-break" }
                    },
                    {
                        headerTextAlign: "Center", headerText: "In", field: "firstBreakIn",        // ✅ important
                        width: 80, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.firstBreakIn), field: "breakDuration",
                        customAttributes: { class: "col-break" }
                    },
                    { headerTextAlign: "Center", textAlign: "right", field: "breakDuration", headerText: "Duration", width: 75, customAttributes: { class: "col-break" } },
                    {
                        headerTextAlign: "Center", textAlign: "Left", headerText: "Status", width: 90, field: "morningBreakStatus",

                        // valueAccessor: (f, d) => simplifyStatus(d.morningBreakStatus), customAttributes: { class: "col-break" } 
                        template: (props) => {
                            let status = props.morningBreakStatus || "";
                            let text = "No Data";
                            let colorClass = "text-gray-600";

                            if (status.includes("No Punches Available")) {
                                text = "No Punch";
                                colorClass = "text-red-600";
                            } else if (status.includes("Only One Punch Available")) {
                                text = "One Punch";
                                colorClass = "text-blue-600";
                            } else if (status.includes("Correct")) {
                                text = "On Time";
                                colorClass = "text-green-600";
                            } else if (status.includes("Delayed")) {
                                text = "Delayed";
                                colorClass = "text-orange-600";
                            }

                            return <span className={colorClass}>{text}</span>;
                        }

                    },
                ]} />

                {/* ==== LUNCH BREAK ==== */}
                <ColumnDirective headerText="Lunch Break" customAttributes={{ class: "col-break-header" }} columns={[
                    { headerTextAlign: "Center", field: "lunchBreakOut", headerText: "Out", width: 80, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.lunchBreakOut), customAttributes: { class: "col-break" } },
                    { headerTextAlign: "Center", field: "lunchBreakIn", headerText: "In", width: 80, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.lunchBreakIn), customAttributes: { class: "col-break" } },
                    { headerTextAlign: "Center", field: "lunchBreakDuration", textAlign: "right", headerText: "Duration", width: 75, customAttributes: { class: "col-break" } },
                    {
                        headerTextAlign: "Center", textAlign: "Left", headerText: "Status", width: 90, field: "lunchBreakStatus",
                        // valueAccessor: (f, d) => simplifyStatus(d.lunchBreakStatus), 
                        template: (props) => {
                            let status = props.lunchBreakStatus || "";
                            let text = "No Data";
                            let colorClass = "text-gray-600";

                            if (status.includes("No Punches Available")) {
                                text = "No Punch";
                                colorClass = "text-red-600";
                            } else if (status.includes("Only One Punch Available")) {
                                text = "One Punch";
                                colorClass = "text-blue-600";
                            } else if (status.includes("Correct")) {
                                text = "On Time";
                                colorClass = "text-green-600";
                            } else if (status.includes("Delayed")) {
                                text = "Delayed";
                                colorClass = "text-orange-600";
                            }

                            return <span className={colorClass}>{text}</span>;
                        },


                        customAttributes: { class: "col-break" }
                    },
                ]} />

                {/* ==== EVENING BREAK ==== */}
                <ColumnDirective headerText="Evening Tea Break" customAttributes={{ class: "col-break-header" }} columns={[
                    { headerTextAlign: "Center", field: "eveningBreakOut", headerText: "Out", width: 80, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.eveningBreakOut), customAttributes: { class: "col-break" } },
                    { headerTextAlign: "Center", field: "eveningBreakIn", headerText: "In", width: 80, textAlign: "Center", valueAccessor: (f, d) => formatTime(d.eveningBreakIn), customAttributes: { class: "col-break" } },
                    { headerText: "Duration", headerTextAlign: "Center", textAlign: "right", field: "eveningBreakDuration", width: 75, textAlign: "right", customAttributes: { class: "col-break" } },
                    {
                        headerTextAlign: "Center", textAlign: "Left", headerText: "Status", width: 90, field: "eveningBreakStatus",
                        //  valueAccessor: (f, d) => simplifyStatus(d.eveningBreakStatus),
                        template: (props) => {
                            let status = props.eveningBreakStatus || "";
                            let text = "No Data";
                            let colorClass = "text-gray-600";

                            if (status.includes("No Punches Available")) {
                                text = "No Punch";
                                colorClass = "text-red-600";
                            } else if (status.includes("Only One Punch Available")) {
                                text = "One Punch";
                                colorClass = "text-blue-600";
                            } else if (status.includes("Correct")) {
                                text = "On Time";
                                colorClass = "text-green-600";
                            } else if (status.includes("Delayed")) {
                                text = "Delayed";
                                colorClass = "text-orange-600";
                            }

                            return <span className={colorClass}>{text}</span>;
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
    );
};

export default BreakReportGrid;
