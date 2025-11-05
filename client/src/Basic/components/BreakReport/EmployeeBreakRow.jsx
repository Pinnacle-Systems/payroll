import BreakTimeCells from './BreakTimeCells'
import React from 'react';
import moment from 'moment';

const EmployeeBreakRow = ({ employee, index, date }) => {
    const totalBreakTime = (employee.breakDuration || 0) +
        (employee.lunchBreakDuration || 0) +
        (employee.eveningBreakDuration || 0);

    const simplifyStatus = (status) => {
        if (!status) return 'No Data';

        if (status.includes('No Punches Available')) return 'No Punch';
        if (status.includes('Only One Punch Available')) return 'One Punch';
        if (status.includes('Correct')) return 'On Time';
        if (status.includes('Delayed')) return 'Delayed';

        return status;
    };

    const getStatusColor = (status) => {
        const simplifiedStatus = simplifyStatus(status);

        switch (simplifiedStatus) {
            case 'On Time':
                return 'text-green-600 ';
            case 'Delayed':
                return 'text-orange-600 ';
            case 'One Punch':
                return 'text-blue-600 ';
            case 'No Punch':
                return 'text-red-600 ';
            default:
                return 'text-gray-600 ';
        }
    };

    const getCommonDate = () => {
        // Always use the selected date from DateInput
        return employee?.reportDate || date || "No Date";
    };

    return (
        <tr className="hover:bg-gray-50">
            {/* Basic Info */}
            <td className="border border-gray-300 py-1.5 text-[12px] text-center px-1">
                {index + 1}
            </td>

            <td className="border border-gray-300 text-[12px] py-0.5 text-center">
                <input
                    type="text"
                    value={employee?.mIdCard || 'N/A'}
                    className="w-full text-right pr-1 bg-transparent focus:outline-none"
                    readOnly
                />
            </td>

            <td className="border border-gray-300 text-[12px] py-0.5">
                <input
                    type="text"
                    value={employee?.firstName || 'Unknown'}
                    className="w-full text-left pl-2 bg-transparent focus:outline-none"
                    readOnly
                />
            </td>
            <td className="border border-gray-300 text-[12px] py-0.5">
                <input
                    type="text"
                    value={employee?.departmentName || 'Unknown'}
                    className="w-full text-left pl-2 bg-transparent focus:outline-none"
                    readOnly
                />
            </td>
            <td className="border border-gray-300 text-[12px] py-0.5">
                <input
                    type="text"
                    value={employee?.designationName || 'Unknown'}
                    className="w-full text-left pl-2 bg-transparent focus:outline-none"
                    readOnly
                />
            </td>

            {/* <td className="border border-gray-300 text-[12px] py-0.5 text-center">
        <input
          type="text"
          value={employee?.shiftName || 'N/A'}
          className="w-full text-center bg-transparent focus:outline-none"
          readOnly
        />
      </td> */}

            <td className="border border-gray-300 text-[12px] py-0.5 text-center">
                <input
                    type="text"
                    value={getCommonDate()}
                    className="w-full text-center bg-transparent focus:outline-none"
                    readOnly
                />
            </td>

            {/* Morning Tea Break */}
            <BreakTimeCells
                breakOut={employee.firstBreakOut}
                breakIn={employee.firstBreakIn}
                duration={employee.breakDuration}
                status={employee.morningBreakStatus}
                simplifyStatus={simplifyStatus}
                // className="bg-blue-50"
                getStatusColor={getStatusColor}
            />

            {/* Lunch Break */}
            <BreakTimeCells
                breakOut={employee.lunchBreakOut}
                breakIn={employee.lunchBreakIn}
                duration={employee.lunchBreakDuration}
                status={employee.lunchBreakStatus}
                simplifyStatus={simplifyStatus}
                // className="bg-green-50"
                getStatusColor={getStatusColor}
            />

            {/* Evening Tea Break */}
            <BreakTimeCells
                breakOut={employee.eveningBreakOut}
                breakIn={employee.eveningBreakIn}
                duration={employee.eveningBreakDuration}
                status={employee.eveningBreakStatus}
                simplifyStatus={simplifyStatus}
                // className="bg-orange-50"
                getStatusColor={getStatusColor}
            />

            {/* Total Break Time */}
            {/* <td className="border border-gray-300 text-[12px] py-0.5 text-center font-medium">
        <input
          type="number"
          value={totalBreakTime}
          className="w-full text-center bg-transparent focus:outline-none font-semibold"
          readOnly
        />
      </td> */}
        </tr>
    );
};

export default EmployeeBreakRow;