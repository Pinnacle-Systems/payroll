// PrintFormat.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import tw from "../../../../Utils/tailwind-react-pdf";

import pinnacleogo from '../../../../assets/pinnacle-full.png'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 10,
        fontSize: 8,
        paddingBottom: 20, // 👈 Prevents clipping on last row

    },
    pageBorder: {
        flex: 1,
        border: '1 solid #000', // black border
        padding: 10,            // inner spacing inside border
        margin: 5,              // small gap between page edge and border
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
        fontSize: 10
    },

    table: {
        display: 'table',
        width: 'auto',
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        // flexWrap: 'wrap', 
        // alignContent:'center',
        // justifyContent:'center'
        marginTop: 2

    },
    tableRow: {
        flexDirection: 'row',
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: "#D1D5DB",
        breakInside: 'avoid',

    },
    tableColHeader: {

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

    },
    tableCell: {
        fontSize: 7,
        textAlign: 'center',
        paddingVertical: 6, // 🔥 increase height (default 1–2)


    },
    mainHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    subHeader: {
        fontSize: 7,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    verticalCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    // === Cell Align Variants ===
    tableCellLeft: {
        fontSize: 7,
        textAlign: 'left',
        paddingLeft: 2,
        paddingVertical: 6, // 🔥 increase height (default 1–2)

    },
    tableCellCenter: {
        fontSize: 7,
        textAlign: 'center',
        padding: 2,
        paddingVertical: 6, // 🔥 increase height (default 1–2)

    },
    tableCellRight: {
        fontSize: 7,
        textAlign: 'right',
        paddingRight: 2,
        paddingVertical: 6, // 🔥 increase height (default 1–2)

    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    headerLeft: {
        width: '35%',
    },

    headerCenter: {
        width: '30%',
        textAlign: 'center',
    },

    headerRight: {
        width: '25%',
        alignItems: 'flex-end',
    },

    companyAddress: {
        fontSize: 7,
        lineHeight: 1.3,
    },

    companyName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    logoContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end', // ✅ push image to right
        // alignItems: 'center',
        fontSize: 12,
        marginTop: "-25px",
        top: 15,

        position: 'absolute',

    },

    logo: {
        width: 150,
        height: 50,
        fontSize: 12,
        marginTop: "-5px"

        // objectFit: 'contain',
    },
    reportInfoBlock: {
        marginTop: 5,
        textAlign: 'center',
        marginBottom: 10,
    },
    horizontalLine: {
        borderBottomWidth: 1,    // thickness of the line
        borderBottomColor: '#000', // color of the line (black)
        marginVertical: 6,        // space above/below
        width: 'auto',     // let it expand based on margins instead of inner 100%
        marginLeft: -10,  // 👈 move line 10 units to the left
        marginRight: -10
    },
    reportHeaderInfo: {
        marginTop: "-25px",
        fontSize: 12,
        width: '20%'
        // marginBottom: 5,
    },
    statusBadge: {
        borderRadius: 8,
        // paddingVertical: 2,
        // paddingHorizontal: 2,
        color: '#fff',
        fontSize: 5,
        // textAlign: 'center',
        fontWeight: 'bold',
        // alignSelf: 'center',
    },

    statusGreen: { backgroundColor: '#16A34A' },  // Correct
    statusOrange: { backgroundColor: '#F59E0B' }, // Delayed
    statusBlue: { backgroundColor: '#3B82F6' },   // One Punch
    statusRed: { backgroundColor: '#EF4444' },    // No Punches
    statusGray: { backgroundColor: '#9CA3AF' },   // Default / '-'
    legendContainer: {
        position: 'absolute',
        bottom: 15,            // distance from bottom edge
        right: 15,             // distance from right edge
        flexDirection: 'row',  // boxes + text in a row
        gap: 6,                // spacing between items (React-PDF supports gap)
        alignItems: 'center',
        fontSize: 8,
    },

    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },

    legendColorBox: {
        width: 8,
        height: 8,
        marginRight: 3,
        borderRadius: 4,
    },

});

// PrintFormat Component
const PrintFormat = ({ employeeData, date, reportTitle, generatedDate }) => {

    const simplifyStatus = (status) => {
        if (!status) return '⬜';           // Gray for missing
        if (status.includes('Correct')) return '🟩';   // Green
        if (status.includes('Delayed')) return '🟧';   // Orange
        if (status.includes('Only One')) return '🟦';  // Blue
        if (status.includes('No Punches')) return '🟥'; // Red
        return '⬜'; // Default gray if nothing matches
    };
    // ✅ Simplify status to colored box (no text)
    const StatusBox = ({ status }) => {
        let color = '#9CA3AF'; // default gray
        if (status?.includes('Correct')) color = '#16A34A'; // Green
        else if (status?.includes('Delayed')) color = '#F59E0B'; // Orange
        else if (status?.includes('Only One')) color = '#3B82F6'; // Blue
        else if (status?.includes('No Punches')) color = '#EF4444'; // Red

        return (
            <View
                style={{
                    width: 10,
                    height: 10,
                    backgroundColor: color,
                    borderRadius: 6,
                    alignSelf: 'center',
                    // marginVertical: 2,
                }}
            />
        );
    };


    const formatTime = (timeStr) => {
        if (!timeStr) return "-";
        try {
            const date = new Date(timeStr);
            const hours = String(date.getUTCHours()).padStart(2, "0");
            const minutes = String(date.getUTCMinutes()).padStart(2, "0");
            const seconds = String(date.getUTCSeconds()).padStart(2, "0");
            return `${hours}:${minutes}:${seconds}`;
        } catch {
            return "-";
        }
    };

    const chunkArray = (arr, size) =>
        arr.reduce((chunks, item, i) => {
            const chunkIndex = Math.floor(i / size);
            if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
            chunks[chunkIndex].push(item);
            return chunks;
        }, []);
    const chunks = chunkArray(employeeData || [], 16);

    return (
        <Document>
            {chunks?.map((chunk, pageIndex) => (
                <Page key={pageIndex} size="A4" orientation="landscape" style={styles.page} >
                    <View
                        style={[
                            styles.pageBorder,
                            pageIndex > 0 ? { marginTop: 30 } : null, // ✅ add top margin on 2nd+ pages
                        ]}
                    >
                        {/* Show main header only on first page */}
                        {pageIndex === 0 && (<View style={styles.header}>

                            <Text style={[styles.title]}>{'PINNACLE SYSTEMS'}</Text>

                            <View style={[tw("-mt-8"), styles.logoContainer]}>
                                <Image src={pinnacleogo} style={[tw("-mt-8"), styles.logo]} />
                            </View>
                            <View style={styles.horizontalLine} />

                        </View>

                        )}

                        {pageIndex === 0 && (<View style={styles.header}>

                            <Text style={[tw("-mt-4"), styles.title]}>{reportTitle || 'DataWise Break Report'}</Text>
                            <View style={[tw("-mt-7"), styles.reportInfo]}>
                                <Text>Report Date: {date || ''}</Text>

                            </View>

                        </View>

                        )}



                        {/* Table */}
                        <View style={styles.table}>
                            {/* First Header Row */}
                            <View style={styles.tableRow}>
                                {/* Basic Info - These will span 2 rows */}
                                <View style={[styles.tableColHeader, { width: '3%' }]}>
                                    <View style={styles.verticalCenter}>
                                        <Text style={styles.mainHeader}>SNo</Text>
                                    </View>
                                </View>
                                <View style={[styles.tableColHeader, { width: '4%' }]}>
                                    <View style={styles.verticalCenter}>
                                        <Text style={styles.mainHeader}>MID</Text>
                                    </View>
                                </View>
                                <View style={[styles.tableColHeader, { width: '11%' }]}>
                                    <View style={styles.verticalCenter}>
                                        <Text style={styles.mainHeader}>Employee Name</Text>
                                    </View>
                                </View>
                                <View style={[styles.tableColHeader, { width: '9%' }]}>
                                    <View style={styles.verticalCenter}>
                                        <Text style={styles.mainHeader}>Department</Text>
                                    </View>
                                </View>
                                <View style={[styles.tableColHeader, { width: '15%' }]}>
                                    <View style={styles.verticalCenter}>
                                        <Text style={styles.mainHeader}>Designation</Text>
                                    </View>
                                </View>
                                <View style={[styles.tableColHeader, { width: '6%' }]}>
                                    <View style={styles.verticalCenter}>
                                        <Text style={styles.mainHeader}>Date</Text>
                                    </View>
                                </View>

                                {/* Morning Tea Break Main Header */}
                                <View style={[styles.tableColHeader, { width: '20%' }]}>
                                    <Text style={styles.mainHeader}>Morning Tea Break</Text>
                                </View>

                                {/* Lunch Break Main Header */}
                                <View style={[styles.tableColHeader, { width: '20%' }]}>
                                    <Text style={styles.mainHeader}>Lunch Break</Text>
                                </View>

                                {/* Evening Tea Break Main Header */}
                                <View style={[styles.tableColHeader, { width: '20%' }]}>
                                    <Text style={styles.mainHeader}>Evening Tea Break</Text>
                                </View>
                            </View>

                            {/* Second Header Row - Only for break sub-headers */}
                            <View style={styles.tableRow}>
                                {/* Empty cells for basic info (they're already covered by rowspan) */}
                                <View style={[styles.tableColHeader, { width: '3%', backgroundColor: '#f0f0f0' }]}>
                                    <Text style={styles.subHeader}></Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '4%', backgroundColor: '#f0f0f0' }]}>
                                    <Text style={styles.subHeader}></Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '11%', backgroundColor: '#f0f0f0' }]}>
                                    <Text style={styles.subHeader}></Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '9%', backgroundColor: '#f0f0f0' }]}>
                                    <Text style={styles.subHeader}></Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '15%', backgroundColor: '#f0f0f0' }]}>
                                    <Text style={styles.subHeader}></Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '6%', backgroundColor: '#f0f0f0' }]}>
                                    <Text style={styles.subHeader}></Text>
                                </View>

                                {/* Morning Break Sub Headers */}
                                <View style={[styles.tableColHeader, { width: '5.5%' }]}>
                                    <Text style={styles.subHeader}>Out</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '5.5%' }]}>
                                    <Text style={styles.subHeader}>In</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '5%' }]}>
                                    <Text style={styles.subHeader}>Duration</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '4%' }]}>
                                    <Text style={styles.subHeader}>Status</Text>
                                </View>

                                {/* Lunch Break Sub Headers */}
                                <View style={[styles.tableColHeader, { width: '5.5%' }]}>
                                    <Text style={styles.subHeader}>Out</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '5.5%' }]}>
                                    <Text style={styles.subHeader}>In</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '5%' }]}>
                                    <Text style={styles.subHeader}>Duration</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '4%' }]}>
                                    <Text style={styles.subHeader}>Status</Text>
                                </View>

                                {/* Evening Break Sub Headers */}
                                <View style={[styles.tableColHeader, { width: '5.5%' }]}>
                                    <Text style={styles.subHeader}>Out</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '5.5%' }]}>
                                    <Text style={styles.subHeader}>In</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '5%' }]}>
                                    <Text style={styles.subHeader}>Duration</Text>
                                </View>
                                <View style={[styles.tableColHeader, { width: '4%' }]}>
                                    <Text style={styles.subHeader}>Status</Text>
                                </View>
                            </View>

                            {/* Data Rows */}
                            {chunk?.map((employee, index) => (
                                <View key={employee.mIdCard || index} style={styles.tableRow} wrap={false}>
                                    {/* Basic Info */}
                                    <View style={[styles.tableCol, { width: '3%' }]}>
                                        <Text style={styles.tableCell}>{index + 1}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '4%' }]}>
                                        <Text style={styles.tableCellRight}>{employee.mIdCard || '-'}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '11%' }]}>
                                        <Text style={styles.tableCellLeft}>{employee.firstName || '-'}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '9%' }]}>
                                        <Text style={styles.tableCellLeft}>{employee.departmentName || '-'}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '15%' }]}>
                                        <Text style={styles.tableCellLeft}>{employee.designationName || '-'}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '6%' }]}>
                                        <Text style={styles.tableCell}>
                                            {/* {employee.reportDate
                                            ? new Date(employee.reportDate).toLocaleDateString()
                                            : date || '-'} */}
                                            {date}
                                        </Text>
                                    </View>

                                    {/* Morning Break Data */}
                                    <View style={[styles.tableCol, { width: '5.5%' }]}>
                                        <Text style={styles.tableCell}>{formatTime(employee.firstBreakOut)}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '5.5%' }]}>
                                        <Text style={styles.tableCell}>{formatTime(employee.firstBreakIn)}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '5%' }]}>
                                        <Text style={styles.tableCellRight}>{employee.breakDuration || 0}</Text>
                                    </View>
                                    {/* <View style={[styles.tableCol, { width: '6%' }]}>
                                    <Text style={styles.tableCellLeft}>
                                        {simplifyStatus(employee.morningBreakStatus)}
                                    </Text>
                                </View> */}
                                    <View style={[styles.tableCol, { width: '4%' }]}>
                                        <View style={[styles.tableCellLeft, { alignItems: 'center' }]}>
                                            <StatusBox status={employee.morningBreakStatus} />
                                        </View>
                                    </View>
                                    {/* Lunch Break Data */}
                                    <View style={[styles.tableCol, { width: '5.5%' }]}>
                                        <Text style={styles.tableCell}>{formatTime(employee.lunchBreakOut)}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '5.5%' }]}>
                                        <Text style={styles.tableCell}>{formatTime(employee.lunchBreakIn)}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '5%' }]}>
                                        <Text style={styles.tableCellRight}>{employee.lunchBreakDuration || 0}</Text>
                                    </View>
                                    {/* <View style={[styles.tableCol, { width: '6%' }]}>
                                    <Text style={styles.tableCellLeft}>
                                        {simplifyStatus(employee.lunchBreakStatus)}
                                    </Text>
                                </View> */}
                                    <View style={[styles.tableCol, { width: '4%' }]}>
                                        <View style={[styles.tableCellLeft, { alignItems: 'center' }]}>
                                            <StatusBox status={employee.lunchBreakStatus} />
                                        </View>
                                    </View>
                                    {/* Evening Break Data */}
                                    <View style={[styles.tableCol, { width: '5.5%' }]}>
                                        <Text style={styles.tableCell}>{formatTime(employee.eveningBreakOut)}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '5.5%' }]}>
                                        <Text style={styles.tableCell}>{formatTime(employee.eveningBreakIn)}</Text>
                                    </View>
                                    <View style={[styles.tableCol, { width: '5%' }]}>
                                        <Text style={styles.tableCellRight}>{employee.eveningBreakDuration || 0}</Text>
                                    </View>
                                    {/* <View style={[styles.tableCol, { width: '6%' }]}>
                                    <Text style={styles.tableCellLeft}>
                                        {simplifyStatus(employee.eveningBreakStatus)}
                                    </Text>
                                </View> */}
                                    <View style={[styles.tableCol, { width: '4%' }]}>
                                        <View style={[styles.tableCellLeft, { alignItems: 'center' }]}>
                                            <StatusBox status={employee.eveningBreakStatus} />
                                        </View>
                                    </View>
                                </View>
                            ))}
                            {/* ✅ Extra summary/footer row — only on the last page */}
                            {pageIndex === chunks.length - 1 && (
                                <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
                                    <View style={[styles.tableCol, { width: '100%', borderRightWidth: 0 }]}>
                                        <Text style={[styles.tableCell, { textAlign: 'center', fontWeight: 'bold' }]}>
                                            --- End of Report ---
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* <View
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 20,
                                flexDirection: 'column',
                                alignItems: 'flex-start', // left-align text for a neat column
                                gap: 3, // small vertical space between rows
                            }}
                        >
                            {[
                                { color: '#00FF00', label: 'On Time' },
                                { color: '#FFA500', label: 'Delayed' },
                                { color: '#0000FF', label: 'One Punch' },
                                { color: '#FF0000', label: 'No Punches' },
                            ].map((item, index) => (
                                <View
                                    key={index}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 2,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            backgroundColor: item.color,
                                            marginRight: 5,
                                            borderRadius: 6
                                        }}
                                    />
                                    <Text style={{ fontSize: 10 }}>{item.label}</Text>
                                </View>
                            ))}
                        </View> */}
                        {/* === Legend Section === */}
                        <View style={styles.legendContainer}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColorBox, { backgroundColor: '#16A34A' }]} />
                                <Text>On Time</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColorBox, { backgroundColor: '#3B82F6' }]} />
                                <Text>One Punch</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColorBox, { backgroundColor: '#EF4444' }]} />
                                <Text>No Punches</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColorBox, { backgroundColor: '#F59E0B' }]} />
                                <Text>Delayed</Text>
                            </View>
                        </View>

                        <Text
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                left: 0,
                                right: 0,
                                textAlign: 'center',
                                fontSize: 9,
                            }}
                            render={({ pageNumber, totalPages }) =>
                                `Page ${pageNumber} of ${totalPages}`
                            }
                        />

                    </View>
                </Page>
            ))}
        </Document>
    );
};

export default PrintFormat;