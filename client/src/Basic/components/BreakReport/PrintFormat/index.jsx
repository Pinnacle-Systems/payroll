// PrintFormat.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const BORDER_WIDTH = 0.6;
const BORDER_COLOR = '#222';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 10,
        fontSize: 8,
    },
    header: {
        marginBottom: 15,
        textAlign: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    reportInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#D1D5DB",

    },
    tableRow: {
        flexDirection: 'row',
            borderBottomStyle: "solid",
          borderBottomWidth: 1,
          borderBottomColor: "#D1D5DB",
    },
    tableColHeader: {
        //        borderStyle: "solid",
        //   borderWidth: 1,
        //   borderColor: "#D1D5DB",
        backgroundColor: '#f0f0f0',
        padding: 3,
          borderRightStyle: "solid",
          borderRightWidth: 1,
          borderRightColor: "#D1D5DB",
    },
    tableCol: {
       borderRightStyle: "solid",
          borderRightWidth: 1,
          borderRightColor: "#D1D5DB",
    },
    tableCellHeader: {
        fontSize: 7,
        fontWeight: 'bold',
        textAlign: 'center',
        //        borderStyle: "solid",
        //   borderWidth: 1,
        //   borderColor: "#D1D5DB",
    },
    tableCell: {
        fontSize: 7,
        textAlign: 'center',
        //        borderStyle: "solid",
        //   borderWidth: 1,
        //   borderColor: "#D1D5DB",

    },
    mainHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        //        borderStyle: "solid",
        //   borderWidth: 1,
        //   borderColor: "#D1D5DB",
    },
    subHeader: {
        fontSize: 7,
        fontWeight: 'bold',
        textAlign: 'center',
        //        borderStyle: "solid",
        //   borderWidth: 1,
        //   borderColor: "#D1D5DB",
    },
    verticalCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    // === Cell Align Variants ===
    tableCellLeft: {
        fontSize: 8,
        textAlign: 'left',
        paddingLeft: 2,
    },
    tableCellCenter: {
        fontSize: 8,
        textAlign: 'center',
        padding: 2,
    },
    tableCellRight: {
        fontSize: 8,
        textAlign: 'right',
        paddingRight: 2,
    },
});

// PrintFormat Component
const PrintFormat = ({ employeeData, date, reportTitle, generatedDate }) => {

    const simplifyStatus = (status) => {
        if (!status) return '-';
        if (status.includes('Correct')) return 'Correct';
        if (status.includes('Delayed')) return 'Delayed';
        if (status.includes('Only One')) return 'One Punch';
        if (status.includes('No Punches')) return 'No Punches';
        return status;
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        try {
            return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch {
            return '-';
        }
    };

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{reportTitle || 'Break Time Report'}</Text>
                    <View style={styles.reportInfo}>
                        <Text>Report Date: {date || 'All Dates'}</Text>
                        <Text>Generated: {generatedDate}</Text>
                    </View>
                    <Text>Total Employees: {employeeData?.length || 0}</Text>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    {/* First Header Row */}
                    <View style={styles.tableRow}>
                        {/* Basic Info - These will span 2 rows */}
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <View style={styles.verticalCenter}>
                                <Text style={styles.mainHeader}>S.No</Text>
                            </View>
                        </View>
                        <View style={[styles.tableColHeader, { width: '6%' }]}>
                            <View style={styles.verticalCenter}>
                                <Text style={styles.mainHeader}>Emp ID</Text>
                            </View>
                        </View>
                        <View style={[styles.tableColHeader, { width: '12%' }]}>
                            <View style={styles.verticalCenter}>
                                <Text style={styles.mainHeader}>Employee Name</Text>
                            </View>
                        </View>
                        <View style={[styles.tableColHeader, { width: '10%' }]}>
                            <View style={styles.verticalCenter}>
                                <Text style={styles.mainHeader}>Department</Text>
                            </View>
                        </View>
                        <View style={[styles.tableColHeader, { width: '12%' }]}>
                            <View style={styles.verticalCenter}>
                                <Text style={styles.mainHeader}>Designation</Text>
                            </View>
                        </View>
                        <View style={[styles.tableColHeader, { width: '8%' }]}>
                            <View style={styles.verticalCenter}>
                                <Text style={styles.mainHeader}>Date</Text>
                            </View>
                        </View>

                        {/* Morning Tea Break Main Header */}
                        <View style={[styles.tableColHeader, { width: '16%' }]}>
                            <Text style={styles.mainHeader}>Morning Tea Break</Text>
                        </View>

                        {/* Lunch Break Main Header */}
                        <View style={[styles.tableColHeader, { width: '16%' }]}>
                            <Text style={styles.mainHeader}>Lunch Break</Text>
                        </View>

                        {/* Evening Tea Break Main Header */}
                        <View style={[styles.tableColHeader, { width: '16%' }]}>
                            <Text style={styles.mainHeader}>Evening Tea Break</Text>
                        </View>
                    </View>

                    {/* Second Header Row - Only for break sub-headers */}
                    <View style={styles.tableRow}>
                        {/* Empty cells for basic info (they're already covered by rowspan) */}
                        <View style={[styles.tableColHeader, { width: '4%', backgroundColor: '#f0f0f0' }]}>
                            <Text style={styles.subHeader}></Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '6%', backgroundColor: '#f0f0f0' }]}>
                            <Text style={styles.subHeader}></Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '12%', backgroundColor: '#f0f0f0' }]}>
                            <Text style={styles.subHeader}></Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '10%', backgroundColor: '#f0f0f0' }]}>
                            <Text style={styles.subHeader}></Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '12%', backgroundColor: '#f0f0f0' }]}>
                            <Text style={styles.subHeader}></Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '8%', backgroundColor: '#f0f0f0' }]}>
                            <Text style={styles.subHeader}></Text>
                        </View>

                        {/* Morning Break Sub Headers */}
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Out</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>In</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Duration</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Status</Text>
                        </View>

                        {/* Lunch Break Sub Headers */}
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Out</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>In</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Duration</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Status</Text>
                        </View>

                        {/* Evening Break Sub Headers */}
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Out</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>In</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Duration</Text>
                        </View>
                        <View style={[styles.tableColHeader, { width: '4%' }]}>
                            <Text style={styles.subHeader}>Status</Text>
                        </View>
                    </View>

                    {/* Data Rows */}
                    {employeeData?.map((employee, index) => (
                        <View key={employee.mIdCard || index} style={styles.tableRow}>
                            {/* Basic Info */}
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '6%' }]}>
                                <Text style={styles.tableCellRight}>{employee.mIdCard || '-'}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '12%' }]}>
                                <Text style={styles.tableCellLeft}>{employee.firstName || '-'}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '10%' }]}>
                                <Text style={styles.tableCellLeft}>{employee.departmentName || '-'}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '12%' }]}>
                                <Text style={styles.tableCellLeft}>{employee.designationName || '-'}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '8%' }]}>
                                <Text style={styles.tableCell}>
                                    {employee.reportDate
                                        ? new Date(employee.reportDate).toLocaleDateString()
                                        : date || '-'}
                                </Text>
                            </View>

                            {/* Morning Break Data */}
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCell}>{formatTime(employee.firstBreakOut)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCell}>{formatTime(employee.firstBreakIn)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCellRight}>{employee.breakDuration || 0}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCellLeft}>
                                    {simplifyStatus(employee.morningBreakStatus)}
                                </Text>
                            </View>

                            {/* Lunch Break Data */}
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCell}>{formatTime(employee.lunchBreakOut)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCell}>{formatTime(employee.lunchBreakIn)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCellRight}>{employee.lunchBreakDuration || 0}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCellLeft}>
                                    {simplifyStatus(employee.lunchBreakStatus)}
                                </Text>
                            </View>

                            {/* Evening Break Data */}
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCell}>{formatTime(employee.eveningBreakOut)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCell}>{formatTime(employee.eveningBreakIn)}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCellRight}>{employee.eveningBreakDuration || 0}</Text>
                            </View>
                            <View style={[styles.tableCol, { width: '4%' }]}>
                                <Text style={styles.tableCellLeft}>
                                    {simplifyStatus(employee.eveningBreakStatus)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PrintFormat;