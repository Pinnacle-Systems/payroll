import React from 'react';
import moment from 'moment';

const BreakTimeCells = ({ breakOut, breakIn, duration, status, className = '', simplifyStatus, getStatusColor }) => {
    const isSinglePunch = status?.includes('Only One Punch Available') ||
        status?.includes('Only One Punch Available Lunch') ||
        status?.includes('Evening Only One Punch Available');

    if (isSinglePunch) {
        // Single punch - merge Out and In into one column
        const punchTime = breakOut || breakIn; // Use whichever time exists

        return (
            <>
                {/* Merged Punch Column (replaces both Out and In) */}
                <td colSpan={2} className={`border border-gray-300 text-[12px] py-0.5 text-center ${className}`}>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            value={punchTime ? moment.utc(punchTime).format("HH:mm:ss") : "-"}
                            className="w-full text-center bg-transparent focus:outline-none border-0"
                            readOnly
                        />
                    </div>
                </td>

                {/* Duration Column */}
                <td className={`border border-gray-300 text-[12px] py-0.5 text-right  ${className}`}>
                    <input
                        type="number"
                        value={duration || 0}
                        className="w-full text-right pr-1 bg-transparent focus:outline-none"
                        readOnly
                    />
                </td>

                {/* Status Column */}
                <td className={`border border-gray-300 text-[12px] py-0.5  ${className}`}>
                    <div className={`px-1 py-0.5  text-left pl-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                        {simplifyStatus(status)}
                    </div>
                </td>
            </>
        );
    }
    return (
        <>
            {/* Break Out Time */}
            <td className={`border border-gray-300 text-[12px] py-0.5 text-center ${className}`}>
                <input
                    type="text"
                    value={breakOut ? moment.utc(breakOut).format("HH:mm:ss") : "-"}
                    className={`w-full text-center bg-transparent focus:outline-none ${!breakOut ? 'text-gray-400 ' : ''
                        }`}
                    readOnly
                />
            </td>

            {/* Break In Time */}
            <td className={`border border-gray-300 text-[12px] py-0.5 text-center ${className}`}>
                <input
                    type="text"
                    value={breakIn ? moment.utc(breakIn).format("HH:mm:ss") : "-"}
                    className={`w-full text-center bg-transparent focus:outline-none ${!breakIn ? 'text-gray-400 ' : ''
                        }`}
                    readOnly
                />
            </td>

            {/* Break Duration */}
            <td className={`border border-gray-300 text-[12px] py-0.5 text-right ${className}`}>
                <input
                    type="number"
                    value={duration || 0}
                    className="w-full text-right pr-1 bg-transparent focus:outline-none"
                    readOnly
                />
            </td>

            {/* Break Status */}
            <td className={`border border-gray-300 text-[12px] py-0.5 ${className}`}>
                <div className={`px-1 py-0.5 text-left pl-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                    {simplifyStatus(status)}
                </div>
            </td>
        </>
    )
};

export default BreakTimeCells;