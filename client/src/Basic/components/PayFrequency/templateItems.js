import { useState } from "react";
import { DropdownInput, TextInput } from "../../../Inputs";
import { dropDownFinYear } from "../../../Utils/contructObject";
import { payCategory } from "../../../Utils/DropdownData";
import moment from "moment";
import { HiPlus, HiTrash } from "react-icons/hi";

const TemplateItems = ({
    saveData,
    setForm,
    readOnly,
    id,
    childRecord,
    yearData,
    finYearId,
    setFinYearId,
    payFrequencyType,
    setPayFrequencyType,
}) => {
    // Track active tab (which pay category is visible)
    const [activeTab, setActiveTab] = useState(payFrequencyType?.[0]?.type || "");

    // Handle payFrequencyItem changes inside a specific type
    const handleInputChange = (type, index, field, value) => {
        const updatedTypes = structuredClone(payFrequencyType);
        const typeIndex = updatedTypes.findIndex((t) => t.type === type);

        if (typeIndex !== -1) {
            updatedTypes[typeIndex].payFrequencyItems[index][field] = value;
            setPayFrequencyType(updatedTypes);
        }
    };

    const handleDeleteRow = (type, index) => {
        const updatedTypes = structuredClone(payFrequencyType);
        const typeIndex = updatedTypes.findIndex((t) => t.type === type);

        if (typeIndex !== -1) {
            updatedTypes[typeIndex].payFrequencyItems.splice(index, 1);
            setPayFrequencyType(updatedTypes);
        }
    };

    const addNewRow = (type) => {
        const updatedTypes = structuredClone(payFrequencyType);
        const typeIndex = updatedTypes.findIndex((t) => t.type === type);

        if (typeIndex !== -1) {
            updatedTypes[typeIndex].payFrequencyItems.push({
                startDate: "",
                endDate: "",
                salaryDate: "",
                notes: "",
            });
            setPayFrequencyType(updatedTypes);
        }
    };

    const calculatePayPeriod = (startDate, endDate) => {
        if (!startDate || !endDate) return { totalDays: 0, sundays: 0 };

        const start = moment(startDate);
        const end = moment(endDate);

        const totalDays = end.diff(start, "days") + 1;

        let sundays = 0;
        let current = start.clone();
        while (current.isSameOrBefore(end)) {
            if (current.day() === 0) sundays++;
            current.add(1, "day");
        }

        return { totalDays, sundays };
    };

    const activeType = payFrequencyType?.find((t) => t.payFrequencyType === activeTab);

    return (
        <div className="h-[90vh] flex flex-col bg-[f1f1f0] overflow-x-auto">
            {/* Header */}
            <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white ">
                <h2 className="text-lg px-2 py-0.5 font-semibold text-gray-800">
                    {id
                        ? !readOnly
                            ? "Edit Shift Template Master"
                            : "Shift Template Master"
                        : "Add New Shift Template"}
                </h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setForm(false)}
                        className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"
                    >
                        Back
                    </button>
                    {!readOnly && (
                        <button
                            type="button"
                            onClick={saveData}
                            className="px-3 py-1 hover:bg-green-600 hover:text-white rounded text-green-600 border border-green-600 flex items-center gap-1 text-xs"
                        >
                            {id ? "Update" : "Save"}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-3 ">
                <div className="grid grid-cols-1 gap-3 h-full ">
                    <div className="bg-white p-3 rounded-md border border-gray-200 h-full w-full">
                        <div className="flex gap-x-8 mb-4">
                            <DropdownInput
                                name="Fin Year"
                                options={dropDownFinYear(
                                    id ? yearData?.data : yearData?.data?.filter((item) => item?.active),
                                    "code",
                                    "id"
                                )}
                                value={finYearId}
                                setValue={setFinYearId}
                                required={true}
                                readOnly={readOnly}
                                disabled={childRecord.current > 0}
                            />
                            <TextInput
                                name="Start Date"
                                type="text"
                                value={
                                    finYearId
                                        ? moment(yearData?.data?.find((i) => i.id == finYearId)?.from)
                                            .utc()
                                            .format("DD-MM-YYYY")
                                        : ""
                                }
                                setValue={() => { }}
                                required={true}
                                disabled={true}
                            />
                            <TextInput
                                name="End Date"
                                type="text"
                                value={
                                    finYearId
                                        ? moment(yearData?.data?.find((i) => i.id == finYearId)?.to)
                                            .utc()
                                            .format("DD-MM-YYYY")
                                        : ""
                                }
                                setValue={() => { }}
                                required={true}
                                disabled={true}
                            />
                        </div>

                        {/* Tabs for Pay Categories */}
                        <div className="flex border-b mb-3">
                            {payFrequencyType.map((t) => (
                                <button
                                    key={t.type}
                                    onClick={() => setActiveTab(t.type)}
                                    className={`px-4 py-2 text-sm font-medium ${activeTab === t.type
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "text-gray-600"
                                        }`}
                                >
                                    {t.type}
                                </button>
                            ))}
                        </div>

                        {/* Active Tab Table */}
                        {activeType && (
                            <div className="w-full p-2 overflow-x-auto">
                                <table className="w-full border-collapse table-fixed">
                                    <thead className="bg-gray-200 text-gray-800">
                                        <tr>
                                            <th className="w-4 px-1 py-2 text-center font-medium text-[13px]">S.No</th>
                                            <th className="w-12 px-4 py-2 text-center font-medium text-[13px]">Start Date</th>
                                            <th className="w-12 px-4 py-2 text-center font-medium text-[13px]">End Date</th>
                                            <th className="w-12 px-4 py-2 text-center font-medium text-[13px]">Salary Date</th>
                                            <th className="w-36 px-4 py-2 text-center font-medium text-[13px]">Pay Period days</th>
                                            <th className="w-8 px-4 py-2 text-center font-medium text-[13px]">Holidays</th>
                                            <th className="w-8 px-4 py-2 text-center font-medium text-[13px]">Notes</th>
                                            <th className="w-8 px-3 py-2 font-medium text-[13px]">
                                                <button
                                                    onClick={() => addNewRow(activeType.type)}
                                                    className="hover:bg-green-600 text-green-600 hover:text-white border border-green-600 px-2 py-1 rounded-md flex items-center text-xs"
                                                >
                                                    <HiPlus className="w-3 h-3" />
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeType.payFrequencyItems?.map((item, index) => {
                                            const { totalDays, sundays } = calculatePayPeriod(item.startDate, item.endDate);
                                            return (
                                                <tr key={index} className="w-full table-row">
                                                    <td className="w-2 text-left px-1 border border-gray-300">{index + 1}</td>
                                                    <td className="border border-gray-300 text-[11px]">
                                                        <input
                                                            type="date"
                                                            value={item.startDate}
                                                            onChange={(e) =>
                                                                handleInputChange(activeType.type, index, "startDate", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 text-[11px]">
                                                        <input
                                                            type="date"
                                                            value={item.endDate}
                                                            onChange={(e) =>
                                                                handleInputChange(activeType.type, index, "endDate", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 text-[11px]">
                                                        <input
                                                            type="date"
                                                            value={item.salaryDate}
                                                            onChange={(e) =>
                                                                handleInputChange(activeType.type, index, "salaryDate", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 text-[11px]">{totalDays}</td>
                                                    <td className="border border-gray-300 text-[11px]">{sundays}</td>
                                                    <td className="w-44 border border-gray-300 text-[11px]">
                                                        <input
                                                            type="text"
                                                            value={item.notes}
                                                            onChange={(e) =>
                                                                handleInputChange(activeType.type, index, "notes", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="w-40 border border-gray-300 text-[11px]">
                                                        <button
                                                            onClick={() => handleDeleteRow(activeType.type, index)}
                                                            className="text-red-600 hover:text-red-800 bg-red-50 py-1 rounded text-xs flex items-center"
                                                        >
                                                            <HiTrash className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateItems;
