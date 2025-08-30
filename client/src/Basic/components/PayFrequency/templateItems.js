import { useCallback, useEffect, useRef, useState } from "react";
import { DropdownInput, TextInput } from "../../../Inputs";
import { getCommonParams } from "../../../Utils/helper";
import { useGetCompanyQuery } from "../../../redux/services/CompanyMasterService";
import { useGetShiftCommonTemplateQuery } from "../../../redux/services/ShiftCommonTemplate.service";
import { useGetshiftMasterQuery } from "../../../redux/services/ShiftMasterService";
import { useAddShiftTemplateMasterMutation, useDeleteShiftTemplateMasterMutation, useGetShiftTemplateMasterByIdQuery, useGetShiftTemplateMasterQuery, useUpdateShiftTemplateMasterMutation } from "../../../redux/services/ShiftTemplateMaster";
import { common, commonNew, payCategory, ShowShiftData } from "../../../Utils/DropdownData";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { dropDownFinYear, dropDownListMergedObject } from "../../../Utils/contructObject";
import moment from 'moment';
import { HiPlus, HiTrash } from "react-icons/hi";
const TemplateItems = ({
    saveData, setForm, ShitCommonData, shiftData, readOnly, payFrequencyItems, setPayFrequencyItems, id,
    companyCode, setCompanyCode, docId, setDocId, finYearId, setFinYearId, childRecord,
    yearData, payFrequencyType, setPayFrequencyType
}) => {




    console.log(yearData, 'data');





    const handleInputChange = (value, index, field) => {
        const newBlend = structuredClone(payFrequencyItems);
        newBlend[index][field] = value;

        setPayFrequencyItems(newBlend);
    };




    console.log(yearData?.data?.find((item) => item.id == finYearId)?.from
        || "", 'data');


    const handleDeleteRow = (id) => {
        setPayFrequencyItems((yarnBlend) => {
            if (yarnBlend.length <= 1) {
                return yarnBlend;
            }
            return yarnBlend.filter((_, index) => index !== parseInt(id));
        });
    };

    const addNewRow = () => {
        const newRow = { templateId: '' };
        setPayFrequencyItems([...payFrequencyItems, newRow]);
    };
    const calculatePayPeriod = (startDate, endDate) => {
        if (!startDate || !endDate) return { totalDays: 0, sundays: 0 };

        const start = moment(startDate);
        const end = moment(endDate);

        // total days (inclusive of both start & end)
        const totalDays = end.diff(start, "days") + 1;

        // count Sundays
        let sundays = 0;
        let current = start.clone();
        while (current.isSameOrBefore(end)) {
            if (current.day() === 0) { // 0 = Sunday
                sundays++;
            }
            current.add(1, "day");
        }

        return { totalDays, sundays };
    };
    return (
        <>

            <div className="h-[90vh] flex flex-col bg-[f1f1f0] overflow-x-auto">
                <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10  bg-white ">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg px-2 py-0.5 font-semibold  text-gray-800">
                            {id
                                ? !readOnly
                                    ? "Edit Shift  Template Master"
                                    : "Shift  Template Master"
                                : "Add New  Shift Template"}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        {/* <div>
                            {readOnly && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        // setForm(false);
                                        // setSearchValue("");
                                        // setId(false);
                                    }}
                                    className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"
                                >
                                    Cancel
                                </button>
                            )}
                        </div> */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setForm(false);
                                    // setSearchValue("");
                                    // setId(false);
                                }}
                                className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"

                            >
                                {/* <Check size={14} /> */}
                                Back
                            </button>
                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={saveData}
                                    className="px-3 py-1 hover:bg-green-600 hover:text-white rounded text-green-600 
                     border border-green-600 flex items-center gap-1 text-xs"
                                >
                                    {/* <Check size={14} /> */}
                                    {id ? "Update" : "Save"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-3 ">
                    <div className="grid grid-cols-1  gap-3  h-full ">
                        <div className="lg:col-span- space-y-3">
                            <div className="bg-white p-3 rounded-md border border-gray-200 h-full w-full ">
                                <div className="space-y-4 w-full">
                                    <div className="flex  gap-x-8">


                                        <div className="">

                                            <DropdownInput
                                                name="Fin Year"
                                                options={dropDownFinYear(
                                                    id
                                                        ? yearData?.data
                                                        : yearData?.data?.filter((item) => item?.active),
                                                    "code",
                                                    "id"
                                                )}
                                                value={finYearId}
                                                setValue={setFinYearId}
                                                required={true}
                                                readOnly={readOnly}
                                                disabled={childRecord.current > 0}
                                                className="focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>

                                        <div className="">
                                            <TextInput
                                                name="Start Date"
                                                type="text"
                                                value={
                                                    finYearId
                                                        ? moment(
                                                            yearData?.data?.find((item) => item.id == finYearId)?.from
                                                        ).utc().format("DD-MM-YYYY")
                                                        : ""
                                                }
                                                setValue={() => { }}
                                                required={true}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="">
                                            <TextInput
                                                name="End Date"
                                                type="text"
                                                value={
                                                    finYearId
                                                        ? moment(
                                                            yearData?.data?.find((item) => item.id == finYearId)?.to
                                                        ).utc().format("DD-MM-YYYY")
                                                        : ""
                                                }
                                                setValue={() => { }}
                                                required={true}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="">
                                            <DropdownInput
                                                name="Pay Category"
                                                type="text"
                                                options={payCategory}
                                                value={payFrequencyType}
                                                setValue={setPayFrequencyType}
                                                required={true}
                                                readOnly={readOnly}
                                                disabled={childRecord.current > 0}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`w-full  p-2 overflow-x-auto`}>
                                            <table className="w-full border-collapse table-fixed ">
                                                <thead className="bg-gray-200 text-gray-800">
                                                    <tr>
                                                        <th
                                                            className={`w-4 px-1 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            S.No
                                                        </th>
                                                        <th
                                                            className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            Start Date
                                                        </th>
                                                        <th

                                                            className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            End Date
                                                        </th>
                                                        <th

                                                            className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            Salary Date
                                                        </th>
                                                        <th

                                                            className={`w-36 px-4 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            Pay Period days
                                                        </th>

                                                        <th

                                                            className={`w-8 px-4 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            Holoidays
                                                        </th>
                                                        <th

                                                            className={`w-8 px-4 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            Notes
                                                        </th>

                                                        <th

                                                            className={`w-8 px-3 py-2 item-center font-medium text-[13px] `}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    addNewRow()
                                                                }}
                                                                className="hover:bg-green-600 text-green-600 hover:text-white border border-green-600 px-2 py-1 rounded-md flex items-center text-xs"
                                                            >
                                                                <HiPlus className="w-3 h-3" />

                                                            </button>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payFrequencyItems?.map((item, index) => {
                                                        const { totalDays, sundays } = calculatePayPeriod(item.startDate, item.endDate);

                                                        return (
                                                            <tr key={index} className="w-full table-row">
                                                                <td className="table-data w-2 text-left px-1 border border-gray-300">
                                                                    {index + 1}
                                                                </td>

                                                                <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                                                                    <input
                                                                        type="date"
                                                                        value={item?.startDate}
                                                                        onChange={(e) => handleInputChange(e.target.value, index, "startDate")}
                                                                    />
                                                                </td>
                                                                <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                                                                    <input
                                                                        type="date"
                                                                        value={item?.endDate}
                                                                        onChange={(e) => handleInputChange(e.target.value, index, "endDate")}
                                                                    />
                                                                </td>

                                                                <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                                                                    <input
                                                                        type="date"
                                                                        value={item?.salaryDate}
                                                                        onChange={(e) => handleInputChange(e.target.value, index, "salaryDate")}
                                                                    />
                                                                </td>

                                                                {/* Total Days */}
                                                                <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                                                                    {totalDays}
                                                                </td>

                                                                {/* Total Sundays */}
                                                                <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                                                                    {sundays}
                                                                </td>

                                                                <td className="w-44 border border-gray-300 text-[11px] py-0.5 item-center">
                                                                    <input
                                                                        type="text"
                                                                        value={item?.notes}
                                                                        onChange={(e) => handleInputChange(e.target.value, index, "notes")}
                                                                    />
                                                                </td>

                                                                <td className="w-40 border border-gray-300 text-[11px] py-0.5">
                                                                    <button
                                                                        onClick={() => handleDeleteRow(index)}
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
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default TemplateItems