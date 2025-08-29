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

const TemplateItems = ({
    saveData, setForm, ShitCommonData, shiftData, readOnly, ShiftTemplateItems, setShiftTemplateItems, id,
    companyCode, setCompanyCode, docId, setDocId, categoryId, setCategoryId, childRecord


}) => {









    const handleInputChange = (value, index, field) => {
        const newBlend = structuredClone(ShiftTemplateItems);
        newBlend[index][field] = value;

        setShiftTemplateItems(newBlend);
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
                                    <div>
                                        <div className={`w-full  p-2 overflow-x-auto`}>
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
                                                        <th

                                                            className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            Quater(Y/N)
                                                        </th>
                                                        <th

                                                            className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                        >
                                                            SubFill
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ShiftTemplateItems?.map((item, index) => (

                                                        <tr className="w-full table-row">
                                                            <td className="table-data  w-2 text-left px-1">
                                                                {index + 1}
                                                            </td>

                                                            <td className=' border border-gray-500'>
                                                                <input
                                                                    type="date"
                                                                    value={item?.appliedOn}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "appliedOn")}

                                                                />
                                                            </td>
                                                            <td className=' border border-gray-500'>
                                                                <select
                                                                    // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                    disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
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


                                                            <td className=' border border-gray-500'>
                                                                <select
                                                                    // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                    disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                    value={item.shiftId}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "shiftId")}
                                                                // onBlur={(e) => {
                                                                //     handleInputChange(e.target.value, index, "accessoryGroupId")
                                                                // }
                                                                // }


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
                                                            <td className=' border border-gray-500'>
                                                                <select
                                                                    // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                    disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                    value={item.inNextDay}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "inNextDay")}
                                                                // onBlur={(e) => {
                                                                //     handleInputChange(e.target.value, index, "accessoryGroupId")
                                                                // }
                                                                // }


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




                                                            <td className='table-data'>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.toleranceBeforeStart}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "toleranceInBeforeStart")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>


                                                            <td className='table-data'>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.startTime}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "startTime")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>
                                                            <td className='table-data'>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.toleranceAfterEnd}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "toleranceInAfterEnd")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />

                                                            </td>
                                                            <td className='table-data'>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.fbOut}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "fbOut")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>
                                                            <td className='table-data '>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.fbIn}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "fbIn")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>


                                                            <td className='table-data '>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.lunchBst}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "lunchBst")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>
                                                            <td className='table-data '>
                                                                <select
                                                                    // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                    disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                    value={item.lBSnDay}
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



                                                            <td className='table-data '>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.lunchBET}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "lunchBET")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>



                                                            <td className='table-data '>
                                                                <select
                                                                    // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                    disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                    value={item.LBenday}
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

                                                            <td className='table-data '>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.SBOut}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "sbOut")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>
                                                            <td className='table-data '>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.SBIn}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "sbIn")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>

                                                            <td className='table-data '>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.toleranceBeforeStart}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "toleranceOutBeforeStart")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>
                                                            <td className='table-data '>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.endTime}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "endTime")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>
                                                            <td className='table-data '>
                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.toleranceAfterStart}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "toleranceOutAfterEnd")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />
                                                            </td>
                                                            <td className='table-data '>
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
                                                            <td className='table-data '>

                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.shiftTimeHrs}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "shiftTimeHrs")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />

                                                            </td>
                                                            <td className='table-data '>

                                                                <input
                                                                    min={"0"}
                                                                    type="number"
                                                                    value={item?.otHrs}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => handleInputChange(e.target.value, index, "otHrs")}
                                                                    className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                    disabled={readOnly}
                                                                />

                                                            </td>
                                                            <td className='table-data '>

                                                                <select
                                                                    // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                    disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
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

                                                            </td>
                                                            <td className='table-data flex item-center'>

                                                                <Eye />
                                                            </td>

                                                        </tr>
                                                    ))}

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