import { useCallback, useEffect, useRef, useState } from "react";
import { DropdownInput, TextInput } from "../../../Inputs";
import { getCommonParams } from "../../../Utils/helper";
import { useGetCompanyQuery } from "../../../redux/services/CompanyMasterService";
import { useGetShiftCommonTemplateQuery } from "../../../redux/services/ShiftCommonTemplate.service";
import { useGetshiftMasterQuery } from "../../../redux/services/ShiftMasterService";
import {
  useAddShiftTemplateMasterMutation,
  useDeleteShiftTemplateMasterMutation,
  useGetShiftTemplateMasterByIdQuery,
  useGetShiftTemplateMasterQuery,
  useUpdateShiftTemplateMasterMutation,
} from "../../../redux/services/ShiftTemplateMaster";
import { common, commonNew, ShowShiftData } from "../../../Utils/DropdownData";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { DELETE, PLUS } from "../../../icons";
import { HiPlus, HiTrash } from "react-icons/hi";
import { FaFileAlt } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

const TemplateItems = ({
  saveData,
  setForm,
  ShitCommonData,
  shiftData,
  readOnly,
  ShiftTemplateItems,
  setShiftTemplateItems,
  id,
  setDate,
  date,
  companyCode,
  setCompanyCode,
  docId,
  setDocId,
  categoryId,
  setCategoryId,
  childRecord,
  onClose,
  onNew,
  setReadOnly,
  setId,
  refetch,
}) => {
  const [modal, setModal] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const handleRightClick = (event, rowIndex, type) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      rowId: rowIndex,
      type,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleInputChange = (value, index, field) => {
    const newBlend = structuredClone(ShiftTemplateItems);
    newBlend[index][field] = value;

    setShiftTemplateItems(newBlend);
  };

  const addNewRow = () => {
    const newRow = { templateId: "" };
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
  const handleDeleteAllRows = () => {
    setShiftTemplateItems((prevRows) => {
      if (prevRows.length <= 1) return prevRows;
      return [prevRows[0]];
    });
  };

  return (
    <>
      <div className="w-full bg-gray-100 mx-auto rounded-md shadow-md px-2 py-1">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-gray-800">Shift Template </h1>
          <div className="flex gap-2">
            {readOnly && (
              <button
                type="button"
                onClick={() => {
                  setReadOnly(false);
                }}
                className="px-3 py-1 text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-600 text-xs rounded"
              >
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setForm(false);
                setId("");
              }}
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
        <div className="space-y-3  h-[580px] ">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1">
              <h2 className="font-medium text-slate-700 mb-2">Basic Details</h2>
              <div className="grid grid-cols-6 gap-4">
                {/* <TextInput
                  name="Company Code"
                  type="text"
                  value={companyCode}
                  setValue={setCompanyCode}
                  required={true}
                  // readOnly={readOnly}
                  disabled={true}
                /> */}
                <div className="">
                  <TextInput
                    name="Doc Id"
                    type="text"
                    value={docId}
                    // setValue={setDocId}
                    required={true}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}
                  />
                </div>
                {console.log(docId, "docIdreceived")}

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
          <div
            className={`w-full   p-2 overflow-x-auto bg-white`}
            // tabIndex={0} // Make it focusable
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") {
            //     e.preventDefault(); // Prevent default Enter behavior
            //     addNewRow();
            //   }
            // }}
          >
            <table className="w-full border-collapse table-fixed ">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th
                    className={`w-[8px] px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    S.No
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Applied On
                  </th>
                  <th
                    className={`w-32 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Shift Common Template
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Shift
                  </th>

              
                  <th className={`w-12  item-center font-medium text-[13px] `}>
                    Other Data
                   
                  </th>
                  <th
                    className={`w-72  item-center font-medium text-[13px] `}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {ShiftTemplateItems?.map((item, index) => (
                  <tr className=" border border-gray-300 text-[11px] py-0.5 px-1 text-center">
                    <td className="  w-2 text-center px-1">{index + 1}</td>

                    <td className=" border border-gray-300 text-[11px] py-0.5 px-1 item-center">
                      <input
                        type="date"
                        value={
                          item?.date
                            ? new Date(item.date).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "date")
                        }
                      />
                    </td>
                    <td className=" border border-gray-300 text-[11px] py-0.5 item-center">
                      <select
                        // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                        disabled={readOnly}
                        className="text-left w-full focus:outline-none rounded py-1 "
                        value={item.templateId}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "templateId")
                        }

                       
                      >
                        <option>Select Shift Common Template</option>
                        {(id
                          ? ShitCommonData?.data || []
                          : ShitCommonData?.data.filter(
                              (item) => item.active
                            ) || []
                        ).map((blend) => (
                          <option value={blend.id} key={blend.id}>
                            {blend.employeeCategory?.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
                      <select
                        disabled={readOnly}
                        className="text-left focus:outline-none w-full rounded py-1 "
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addNewRow();
                          }
                        }}
                        value={item.shiftId}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "shiftId")
                        }
                      >
                        <option>Select Shift</option>
                        {(id
                          ? shiftData?.data || []
                          : shiftData?.data.filter((item) => item.active) || []
                        ).map((blend) => (
                          <option value={blend.id} key={blend.id}>
                            {blend?.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="text-blue-600   bg-blue-50 rounded"
                        onClick={() => setModal(true)}
                        title="Open"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                    <td
                      className="  border border-gray-300 text-[11px] py-0.5 item-center"
                      onContextMenu={(e) => {
                        if (!readOnly) {
                          handleRightClick(e, index, "notes");
                        }
                      }}
                    >
                      {" "}
                    </td>
                    {modal && (
                      <>
                        <div className="fixed overflow-x-auto h-auto p-4 inset-0 flex  items-center justify-center bg-black bg-opacity-20 z-[9999]">
                          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full p-4 relative">
                            {/* Close Button */}
                            <button
                              onClick={() => setModal(false)}
                              className="absolute top-2 right-2 text-white bg-red-600 "
                            >
                              <svg
                                className="h-6 w-6 fill-current"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <title>Close</title>
                                <path
                                  d="M14.348 5.652a.999.999 0 00-1.414 0L10 8.586l-2.93-2.93a.999.999 0 10-1.414 1.414L8.586 10l-2.93 2.93a.999.999 0 101.414 1.414L10 11.414l2.93 2.93a.999.999 0 101.414-1.414L11.414 10l2.93-2.93a.999.999 0 000-1.414z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </button>

                            <h2 className="text-lg text-left pb-2 font-semibold">
                              Row Details
                            </h2>
                            <div className=" bg-gray-100">
                              .
                              <div className="overflow-x-auto mx-4  pb-4 ">
                                <table className="w-full bg-white border-collapse table-fixed ">
                                  <tbody>
                                    <tr className="flex flex-wrap gap-x-3 ml-6 pb-4">
                                      {/* In Next Day */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          In Next Day
                                        </th>
                                        <select
                                          disabled={readOnly}
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          value={item.inNextDay}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "inNextDay"
                                            )
                                          }
                                        >
                                          <option>Select</option>
                                          {commonNew.map((blend) => (
                                            <option
                                              value={blend.value}
                                              key={blend.value}
                                            >
                                              {blend?.show}
                                            </option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* Tolerance Before Start */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Tolerance Before Start
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.toleranceInBeforeStart}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "toleranceInBeforeStart"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* Start Time */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Start Time
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.startTime}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "startTime"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* Tolerance After End */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Tolerance After End
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.toleranceInAfterEnd}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "toleranceInAfterEnd"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* FB OUT */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          FB OUT
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.fbOut}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "fbOut"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* FB IN */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          FB IN
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.fbIn}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "fbIn"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* Lunch B.ST */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Lunch B.ST
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.lunchBst}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "lunchBst"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* LB.SNDay */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          LB.SNDay
                                        </th>
                                        <select
                                          disabled={readOnly}
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          value={item.lBSNDay}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "lBSNDay"
                                            )
                                          }
                                        >
                                          <option></option>
                                          {commonNew.map((blend) => (
                                            <option
                                              value={blend.value}
                                              key={blend.value}
                                            >
                                              {blend?.show}
                                            </option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* Lunch B.ET */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Lunch B.ET
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.lunchBET}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "lunchBET"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* LB.ENDay */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          LB.ENDay
                                        </th>
                                        <select
                                          disabled={readOnly}
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          value={item.lBEnday}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "lBEnday"
                                            )
                                          }
                                        >
                                          <option>Select</option>
                                          {commonNew.map((blend) => (
                                            <option
                                              value={blend.value}
                                              key={blend.value}
                                            >
                                              {blend?.show}
                                            </option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* SBOut */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          SBOut
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.sbOut}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "sbOut"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* SBIn */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          SBIn
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.sbIn}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "sbIn"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* Tolerance Before Start (Out) */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Tolerance Before Start
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.toleranceOutBeforeStart}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "toleranceOutBeforeStart"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* End Time */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          End Time
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.endTime}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "endTime"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* Tolerance After End */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Tolerance After End
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.toleranceOutAfterEnd}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "toleranceOutAfterEnd"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* Out Next Day */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Out Next Day
                                        </th>
                                        <select
                                          disabled={readOnly}
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          value={item.outNxtDay}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "outNxtDay"
                                            )
                                          }
                                        >
                                          <option>Select</option>
                                          {commonNew.map((blend) => (
                                            <option
                                              value={blend.value}
                                              key={blend.value}
                                            >
                                              {blend?.show}
                                            </option>
                                          ))}
                                        </select>
                                      </td>

                                      {/* Shift Time Hrs */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          Shift Time Hrs
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.shiftTimeHrs}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "shiftTimeHrs"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>

                                      {/* OT Hrs */}
                                      <td className="flex flex-col w-40 text-[11px] py-0.5 ">
                                        <th className=" py-2 text-left block text-xs font-bold text-slate-700">
                                          OT Hrs
                                        </th>
                                        <input
                                          min={"0"}
                                          type="text"
                                          value={item?.otHrs}
                                          onFocus={(e) => e.target.select()}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e.target.value,
                                              index,
                                              "otHrs"
                                            )
                                          }
                                          className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded-lg
  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
  transition-all duration-150 shadow-sm"
                                          disabled={readOnly}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>{" "}
                        </div>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {contextMenu && (
          <div
            style={{
              position: "absolute",
              top: `${contextMenu.mouseY - 50}px`,
              left: `${contextMenu.mouseX + 20}px`,

              // background: "gray",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
              padding: "8px",
              borderRadius: "4px",
              zIndex: 1000,
            }}
            className="bg-gray-100"
            onMouseLeave={handleCloseContextMenu} // Close when the mouse leaves
          >
            <div className="flex flex-col gap-1">
              <button
                className=" text-black text-[12px] text-left rounded px-1"
                onClick={() => {
                  handleDeleteRow(contextMenu.rowId);
                  handleCloseContextMenu();
                }}
              >
                Delete{" "}
              </button>
              <button
                className=" text-black text-[12px] text-left rounded px-1"
                onClick={() => {
                  handleDeleteAllRows();
                  handleCloseContextMenu();
                }}
              >
                Delete All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TemplateItems;
