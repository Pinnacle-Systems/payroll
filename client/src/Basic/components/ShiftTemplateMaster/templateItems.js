import { useCallback, useEffect, useRef, useState } from "react";
import { DropdownInput, TextInput } from "../../../Inputs";
import { getCommonParams } from "../../../Utils/helper";
import { useGetCompanyQuery } from "../../../redux/services/CompanyMasterService";
import { useGetShiftCommonTemplateQuery } from "../../../redux/services/ShiftCommonTemplate.service";
import { useGetshiftMasterQuery } from "../../../redux/services/ShiftMasterService";
import { useAddShiftTemplateMasterMutation, useDeleteShiftTemplateMasterMutation, useGetShiftTemplateMasterByIdQuery, useGetShiftTemplateMasterQuery, useUpdateShiftTemplateMasterMutation } from "../../../redux/services/ShiftTemplateMaster";
import { common, commonNew, ShowShiftData } from "../../../Utils/DropdownData";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { DELETE, PLUS } from "../../../icons";
import { HiPlus, HiTrash } from "react-icons/hi";
import { FaFileAlt } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

const TemplateItems = ({
    saveData, setForm, ShitCommonData, shiftData, readOnly, ShiftTemplateItems, setShiftTemplateItems, id,
    companyCode, setCompanyCode, docId, setDocId, categoryId, setCategoryId, childRecord, onClose


}) => {









    const handleInputChange = (value, index, field) => {
        const newBlend = structuredClone(ShiftTemplateItems);
        newBlend[index][field] = value;

        setShiftTemplateItems(newBlend);
    };


    const addNewRow = () => {
        const newRow = { templateId: '' };
        setShiftTemplateItems([...ShiftTemplateItems, newRow]);
    };


    const handleDeleteRow = (id) => {
        setShiftTemplateItems((yarnBlend) => {
            if (yarnBlend.length <= 1) {
                return yarnBlend;
            }
            return yarnBlend.filter((_, index) => index !== parseInt(id));
        });
    };



    return (
        <>

            <div className="w-full bg-[#f1f1f0] mx-auto rounded-md shadow-md px-2 py-1">
                <div className="flex justify-between items-center mb-1">
                    <h1 className="text-2xl font-bold text-gray-800">Shift Template </h1>
                    <div className="gpa-4">
                        {/* <button
                            onClick={onClose}
                            className="text-indigo-600 hover:text-indigo-700"
                            title="Open Report"
                        >
                            <HiOutlineDocumentText className="w-7 h-6" />
                        </button> */}
                        <button
                            onClick={onClose}
                            className="text-indigo-600 hover:text-indigo-700"
                            title="Open Report"
                        >
                            <FaFileAlt className="w-5 h-5" />
                        </button>
                    </div>

                </div>
                <div className="space-y-3  h-[580px] ">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-2">


                        <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1">
                            <h2 className="font-medium text-slate-700 mb-2">
                                Basic Details
                            </h2>
                            <div className="grid grid-cols-6 gap-4">

                                <TextInput
                                    name="Company Code"
                                    type="text"
                                    value={companyCode}
                                    setValue={setCompanyCode}
                                    required={true}
                                    // readOnly={readOnly}
                                    disabled={true}
                                />
                                <div className="">
                                    <TextInput
                                        name="Doc Id"
                                        type="text"
                                        value={docId}
                                        setValue={setDocId}
                                        required={true}
                                        // readOnly={readOnly}
                                        disabled={true}
                                    />
                                </div>
                                <div className="">
                                    <DropdownInput
                                        name="Category"
                                        type="text"
                                        options={ShowShiftData}
                                        value={categoryId}
                                        setValue={setCategoryId}
                                        required={true}
                                        readOnly={readOnly}
                                        disabled={childRecord.current > 0}
                                    />
                                </div>
                            </div>
                        </div>



                    </div>
                    <div className={`w-full   p-2 overflow-x-auto`}>
                        <table className="w-full border-collapse table-fixed ">
                            <thead className="bg-gray-200 text-gray-800">
                                <tr>
                                    <th
                                        className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        S.No
                                    </th>
                                    <th
                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Applied On
                                    </th>
                                    <th

                                        className={`w-32 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Shift Common Template
                                    </th>
                                    <th

                                        className={`w-32 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Shift
                                    </th>
                                    <th

                                        className={`w-20 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        In Next day
                                    </th>
                                    <th

                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Tolerance Before Start
                                    </th>

                                    <th

                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Start Time
                                    </th>
                                    <th

                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Tolerance After End

                                    </th>
                                    <th

                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        FB OUT
                                    </th>
                                    <th

                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        FB IN
                                    </th>
                                    <th

                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Lunch B.ST
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        LB.SNDay
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Lunch B.ET
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        LB.ENDay
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        SBOut
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        SBIn
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Tolerance Before Start
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        End Time
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Tolerance After Start
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Out Next Day
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Shift Time Hrs
                                    </th>
                                    <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        OT Hrs
                                    </th>
                                    {/* <th

                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        Quater(Y/N)
                                    </th> */}
                                    {/* <th

                                        className={`w-14 px-3 py-2 text-center font-medium text-[13px] `}
                                    >
                                        SubFill
                                    </th> */}
                                    <th

                                        className={`w-20  item-center font-medium text-[13px] `}
                                    >
                                        <button
                                            onClick={() => {
                                                addNewRow()
                                            }}
                                            className="hover:bg-green-600 text-green-600 hover:text-white border border-green-600 px-2 py-1 ml-5 rounded-md flex items-center text-xs"
                                        >
                                            <HiPlus className="w-3 h-3" />

                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ShiftTemplateItems?.map((item, index) => (

                                    <tr className=" border border-gray-300 text-[11px] py-0.5 px-1 text-center">
                                        <td className="  w-2 text-left px-1">
                                            {index + 1}
                                        </td>

                                        <td className=' border border-gray-300 text-[11px] py-0.5 px-1 item-center'>
                                            <input
                                                type="date"
                                                value={item?.appliedOn}
                                                onChange={(e) => handleInputChange(e.target.value, index, "appliedOn")}

                                            />
                                        </td>
                                        <td className=' border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <select
                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                disabled={readOnly} className='text-left w-full rounded py-1 '
                                                value={item.templateId}
                                                onChange={(e) => handleInputChange(e.target.value, index, "templateId")}

                                            // onBlur={(e) => {
                                            //     handleInputChange(e.target.value, index, "accessoryGroupId")
                                            // }
                                            // }
                                            >
                                                <option>
                                                </option>
                                                {(id ? (ShitCommonData?.data || []) : ShitCommonData?.data.filter(item => item.active) || []).map((blend) =>
                                                    <option value={blend.id} key={blend.id}>
                                                        {blend.employeeCategory?.name}
                                                    </option>
                                                )}
                                            </select>
                                        </td>


                                        <td className='  border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <select
                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                disabled={readOnly} className='text-left w-full rounded py-1 '
                                                value={item.shiftId}
                                                onChange={(e) => handleInputChange(e.target.value, index, "shiftId")}

                                            >


                                                <option>
                                                </option>
                                                {(id ? (shiftData?.data || []) : shiftData?.data.filter(item => item.active) || []).map((blend) =>
                                                    <option value={blend.id} key={blend.id}>
                                                        {blend?.name}
                                                    </option>
                                                )}
                                            </select>
                                        </td>
                                        <td className='  border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <select
                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                disabled={readOnly} className='text-left w-full rounded py-1 '
                                                value={item.inNextDay}
                                                onChange={(e) => handleInputChange(e.target.value, index, "inNextDay")}
                                            >



                                                <option>
                                                </option>
                                                {(commonNew).map((blend) =>
                                                    <option value={blend.value} key={blend.value}>
                                                        {blend?.show}
                                                    </option>
                                                )}
                                            </select>
                                        </td>




                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.toleranceInBeforeStart}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "toleranceInBeforeStart")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>


                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text" value={item?.startTime}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "startTime")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text" value={item?.toleranceInAfterEnd}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "toleranceInAfterEnd")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />

                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text" value={item?.fbOut}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "fbOut")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.fbIn}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "fbIn")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>


                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.lunchBst}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "lunchBst")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center '>
                                            <select
                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                disabled={readOnly} className='text-left w-full rounded py-1 '
                                                value={item.lBSNDay}
                                                onChange={(e) => handleInputChange(e.target.value, index, "lBSNDay")}

                                            >
                                                <option>
                                                </option>
                                                {(commonNew).map((blend) =>
                                                    <option value={blend.value} key={blend.value}>
                                                        {blend?.show}
                                                    </option>
                                                )}
                                            </select>
                                        </td>



                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.lunchBET}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "lunchBET")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>



                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center '>
                                            <select
                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                disabled={readOnly} className='text-left w-full rounded py-1 '
                                                value={item.lBEnday}
                                                onChange={(e) => handleInputChange(e.target.value, index, "lBEnday")}

                                            >
                                                <option>
                                                </option>
                                                {(commonNew).map((blend) =>
                                                    <option value={blend.value} key={blend.value}>
                                                        {blend?.show}
                                                    </option>
                                                )}
                                            </select>
                                        </td>

                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center '>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.sbOut}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "sbOut")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.sbIn}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "sbIn")}
                                                className="text-right rounded py-1 px-1 w-full"
                                                disabled={readOnly}
                                            />
                                        </td>

                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.toleranceOutBeforeStart}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "toleranceOutBeforeStart")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.endTime}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "endTime")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />
                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>
                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.toleranceOutAfterEnd}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "toleranceOutAfterEnd")}
                                                className="text-right rounded py-1 px-1 w-full"
                                                disabled={readOnly}
                                            />
                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center '>
                                            <select
                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                value={item.outNxtDay}
                                                onChange={(e) => handleInputChange(e.target.value, index, "outNxtDay")}

                                            >
                                                <option>
                                                </option>
                                                {(commonNew).map((blend) =>
                                                    <option value={blend.value} key={blend.value}>
                                                        {blend?.show}
                                                    </option>
                                                )}
                                            </select>
                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center '>

                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.shiftTimeHrs}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "shiftTimeHrs")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />

                                        </td>
                                        <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center'>

                                            <input
                                                min={"0"}
                                                type="text"
                                                value={item?.otHrs}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleInputChange(e.target.value, index, "otHrs")}
                                                className="text-right rounded py-1 px-1 w-full "
                                                disabled={readOnly}
                                            />

                                        </td>
                                        {/* <td className='w-40 border border-gray-300 text-[11px] py-0.5 item-center '>

                                            <select
                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                disabled={readOnly} className='text-left w-full  py-1 '
                                                value={item.quater}
                                                onChange={(e) => handleInputChange(e.target.value, index, "quater")}

                                            >
                                                <option>
                                                </option>
                                                {(common).map((blend) =>
                                                    <option value={blend.value} key={blend.value}>
                                                        {blend?.show}
                                                    </option>
                                                )}
                                            </select>

                                        </td> */}
                                        {/* <td className="w-40 border border-gray-300 text-[11px] py-0.5 item-center">
                                            <button
                                                // onClick={() => handleView(index)}
                                                // onMouseEnter={() => setTooltipVisible(true)}
                                                // onMouseLeave={() => setTooltipVisible(false)}
                                                className="text-blue-800 py-1.5 flex items-center bg-blue-50 rounded"
                                            >
                                                👁 <span className="text-xs"></span>
                                            </button>
                                        </td> */}

                                        <td className=" border border-gray-300 text-[11px] py-0.5 flex items-center justify-center">
                                            <button
                                                onClick={() => handleDeleteRow(index)}
                                                className="text-red-600 hover:text-red-800 bg-red-50 py-1 rounded text-xs flex items-center"
                                            >
                                                <HiTrash className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 justify-between mt-4">
                    {/* Left Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => saveData()} className="bg-indigo-500 text-white px-4 py-1 rounded-md hover:bg-indigo-600 flex items-center text-sm">
                            <FiSave className="w-4 h-4 mr-2" />
                            {id
                                ? "Update"
                                : "Save"
                            }

                        </button>
                        {/* <button onClick={() => saveData("close")} className="bg-indigo-500 text-white px-4 py-1 rounded-md hover:bg-indigo-600 flex items-center text-sm">
                                <HiOutlineRefresh className="w-4 h-4 mr-2" />
                                Save & Close
                            </button>
                            <button onClick={() => saveData("draft")} className="bg-indigo-500 text-white px-4 py-1 rounded-md hover:bg-indigo-600 flex items-center text-sm">
                                <HiOutlineRefresh className="w-4 h-4 mr-2" />
                                Draft Save
                            </button> */}
                    </div>


                </div>




            </div>
        </>
    )
}

export default TemplateItems