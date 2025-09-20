import { useState } from "react";
import { DropdownInput, TextInput } from "../../../Inputs";
import Modal from "../../../UiComponents/Modal";
import NewModal from "../../../UiComponents/NewModal";
import {
  common,
  commonNew,
  Days,
  Quarter,
  ShowShiftData,
} from "../../../Utils/DropdownData";
import Select from "react-select";
import { Plus } from "lucide-react";

const TemplateItems = ({
  saveData,
  setForm,
  ShitCommonData,
  shiftData,
  readOnly,
  ShiftTemplateItems,
  setShiftTemplateItems,
  id,
  OTData,
  docId,
  categoryId,
  setCategoryId,
  childRecord,
  setReadOnly,
  setId,
}) => {
  const [modal, setModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [secondModal, setSecondModal] = useState(false);
  const [thirdModal, setThirdModal] = useState(false);
  const [formulaModal, setFormulaModal] = useState(false);
  const [modalFormulaValue, setModalFormulaValue] = useState("");
  const [activeFormulaRow, setActiveFormulaRow] = useState(null);

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

  // const handleInputChange = (value, index, field,subIndex) => {
  //   const newBlend = structuredClone(ShiftTemplateItems);
  //   newBlend[index][field] = value;

  //   setShiftTemplateItems(newBlend);
  //   if (index === selectedIndex) {
  //     setSelectedRow((prev) => ({ ...prev, [field]: value }));
  //   }
  // };
  const handleInputChange = (value, index, field, subIndex) => {
    const newBlend = structuredClone(ShiftTemplateItems);

    if (typeof subIndex === "number") {
      //  update only subgrid
      if (!Array.isArray(newBlend[index].quarterDetails)) {
        newBlend[index].quarterDetails = [];
      }
      if (!newBlend[index].quarterDetails[subIndex]) {
        newBlend[index].quarterDetails[subIndex] = {};
      }
      newBlend[index].quarterDetails[subIndex][field] = value;
    } else {
      //  update only main grid
      newBlend[index][field] = value;
    }

    setShiftTemplateItems(newBlend);

    if (index === selectedIndex) {
      setSelectedRow((prev) => {
        if (typeof subIndex === "number") {
          return {
            ...prev,
            quarterDetails: prev.quarterDetails.map((q, i) =>
              i === subIndex ? { ...q, [field]: value } : q
            ),
          };
        }
        return { ...prev, [field]: value };
      });
    }
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

  const OTOptions = OTData?.data?.flatMap?.((data) =>
    data?.OTDetails?.map((val) => ({
      value: val?.id,
      label: val?.payCode,
    }))
  );

  
  const selectedPayCodes = selectedRow?.quarterDetails
    ?.filter((item) => item.oTId) // only rows where a pay code is selected
    .map((item) => {
      const option = OTOptions.find((opt) => opt.value === item.oTId);
      return option?.label; // or option?.value if you prefer
    })
    .filter(Boolean); // remove undefined/null

  console.log(OTOptions, "OTOptions");

  return (
    <>
      <div className="w-full bg-gray-100 mx-auto rounded-md shadow-md  overflow-auto px-2 py-1">
        <div className="flex justify-between items-center mb-1">
          <h1 className="master-header">Shift Template </h1>
          <div className="flex gap-2">
            {readOnly && (
              <button
                type="button"
                onClick={() => {
                  setReadOnly(false);
                }}
                className="px-3 py-1 text-green-600 hover:bg-green-600 hover:text-white border border-green-600 text-xs rounded"
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
        <div className="space-y-3   overflow-auto ">
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
                                         disabled={readOnly || childRecord.current > 0 }

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
          <div className={`w-full   p-2 overflow-auto bg-white max-h-[370px]`}>
            <table className="w-full border-collapse table-fixed ">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th
                    className={`w-[6px] px-2 py-2 text-center font-medium text-[13px] `}
                  >
                    S.No
                  </th>
                  <th
                    className={`w-[55px] py-2 text-center font-medium text-[13px] `}
                  >
                    Applied On
                  </th>
                  <th
                    className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Shift Common Template
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Shift
                  </th>

                  <th
                    className={`w-8 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    From
                  </th>

                  <th className={`w-8  item-center font-medium text-[13px] `}>
                    To
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Next Day
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Tolerance
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Break
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Quarter
                  </th>
                  <th
                    className={`w-[60px] px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Out Next Day
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Shift Hrs
                  </th>
                  <th
                    className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    OT Hrs
                  </th>
                  {/* <th
                    className={`w-72  item-center font-medium text-[13px] `}
                  ></th> */}
                </tr>
              </thead>
              <tbody>
                {ShiftTemplateItems?.map((item, index) => (
                  <tr key={index} className=" w-full table-row ">
                    <td className="border border-gray-300  w-[6px] text-center px-1">
                      {index + 1}
                    </td>

                    <td className=" border border-gray-300 text-[10px] py-0.5 item-center">
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
                        className={`bg-transparent pl-1  w-[110px] text-[11.5px] focus:outline-none ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                        disabled={readOnly || childRecord.current > 0}
                      />
                    </td>
                    <td className=" border border-gray-300 text-[12px] py-0.5 item-center">
                      <select
                        // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                        disabled={readOnly || childRecord.current > 0}
                        className="text-left w-full focus:outline-none rounded py-1 bg-transparent"
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

                    <td className="  border border-gray-300 text-[12px] py-0.5 item-center">
                      <select
                        disabled={readOnly || childRecord.current > 0}
                        className="text-left focus:outline-none w-full rounded py-1 bg-transparent"
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
                    <td className="  border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={
                          shiftData?.data?.find((i) => i.id == item?.shiftId)
                            ?.from
                        }
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "shiftFrom")
                        }
                        className={`w-full bg-transparent text-center  focus:outline-none focus:border-transparent ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                        readOnly
                      />
                    </td>
                    <td className="  border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={
                          shiftData?.data?.find((i) => i.id == item?.shiftId)
                            ?.to
                        }
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "shiftTo")
                        }
                        className={`w-full bg-transparent text-center  focus:outline-none focus:border-transparent ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                        readOnly
                      />
                    </td>
                    {/* In Next Day */}
                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                      <select
                        disabled={readOnly || childRecord.current > 0}
                        className="text-left w-full bg-transparent focus:outline-none rounded py-1"
                        value={item.inNextDay}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "inNextDay")
                        }
                      >
                        <option>Select</option>
                        {commonNew.map((blend) => (
                          <option value={blend.value} key={blend.value}>
                            {blend?.show}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-300  text-center">
                      <button
                        className="text-blue-600 text-center   bg-blue-50 rounded"
                        onClick={() => {
                          setModal(true);
                          setSelectedRow(item);
                          setSelectedIndex(index);
                        }}
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
                    <td className="text-center border border-gray-300">
                      <button
                        className="text-blue-600 text-center   bg-blue-50 rounded"
                        onClick={() => {
                          setSecondModal(true);
                          setSelectedRow(item);
                          setSelectedIndex(index);
                        }}
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
                    <td className="text-center border border-gray-300">
                      <button
                        className="text-blue-600 text-center   bg-blue-50 rounded"
                        onClick={() => {
                          setThirdModal(true);
                          setSelectedRow(item);
                          setSelectedIndex(index);
                        }}
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

                    {/* Out Next Day */}
                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                      <select
                        disabled={readOnly || childRecord.current > 0}
                        className="text-left w-full bg-transparent text-[12px] focus:outline-none rounded py-1 "
                        value={item.outNxtDay}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "outNxtDay")
                        }
                      >
                        <option>Select</option>
                        {commonNew.map((blend) => (
                          <option value={blend.value} key={blend.value}>
                            {blend?.show}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Shift Time Hrs */}
                    <td className="border border-gray-300 text-[12px] py-0.5 item-center ">
                      <input
                        min={"0"}
                        type="number"
                        value={item?.shiftTimeHrs}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleInputChange(
                            e.target.value,
                            index,
                            "shiftTimeHrs"
                          )
                        }
                        className={`w-full bg-transparent   focus:outline-none focus:border-transparent text-right pr-2 ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                        disabled={readOnly || childRecord.current > 0}
                      />
                    </td>
                    {/* OT Hrs */}
                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        min={"0"}
                        type="number"
                        value={item?.otHrs}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "otHrs")
                        }
                        className={`w-full bg-transparent   focus:outline-none focus:border-transparent text-right pr-2 ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                        disabled={readOnly || childRecord.current > 0}
                        onContextMenu={(e) => {
                          if (!readOnly) {
                            handleRightClick(e, index, "shiftTimeHrs");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (item?.date) {
                              addNewRow();
                            }
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {modal && selectedRow && (
          <Modal
            isOpen={modal}
            widthClass="w-[53%] h-[45%]"
            onClose={() => {
              setModal(false);
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              <div className="border-b py-2 px-2 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center">
                  <h2 className="text-lg py-0.5 font-semibold text-gray-800">
                    Tolerance
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <div className="grid grid-cols-1 gap-3 h-full">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-md border border-gray-200 h-full">
                      <div className="space-y-4">
                        <div className="flex gap-y-6 gap-x-6">
                          {/* Tolerance Before Start */}
                          <div className="mb-3">
                            <label className="react-select-tag-label">
                              Tolerance Before Start
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.toleranceInBeforeStart || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "toleranceInBeforeStart"
                                )
                              }
                              className={`w-[120px] px-3 py-1 text-xs border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        } `}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>

                          {/* Tolerance After End */}
                          <div className="mb-3">
                            <label className="react-select-tag-label">
                              Tolerance After Start
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.toleranceInAfterEnd || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "toleranceInAfterEnd"
                                )
                              }
                              className={`w-[120px] px-3 py-1 text-xs border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        } `}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>

                          {/* Tolerance Before End */}
                          <div className="mb-3">
                            <label className="react-select-tag-label">
                              Tolerance Before End
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.toleranceOutBeforeStart || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "toleranceOutBeforeStart"
                                )
                              }
                              className={`w-[120px] px-3 py-1 text-xs border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>

                          {/* Tolerance After End */}
                          <div className="mb-3">
                            <label className="react-select-tag-label">
                              Tolerance After End
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.toleranceOutAfterEnd || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "toleranceOutAfterEnd"
                                )
                              }
                              className={`w-[120px] px-3 py-1 text-xs border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {secondModal && selectedRow && (
          <Modal
            isOpen={secondModal}
            widthClass="w-[50%] h-[55%]"
            onClose={() => {
              setSecondModal(false);
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              {/* Header */}
              <div className="border-b py-2 px-2 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center">
                  <h2 className="text-lg py-0.5 font-semibold text-gray-800">
                    Break
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-auto p-3">
                <div className="grid grid-cols-1 gap-3 h-full">
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-md border border-gray-200 h-full">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-y-6 gap-x-10">
                          {/* First Break Out */}
                          <div className="mb-3 w-24">
                            <label className="react-select-tag-label">
                              First Break Out
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.fbOut || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "fbOut"
                                )
                              }
                              className={`w-full px-3 py-1 text-[12px] border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>

                          {/* First Break In */}
                          <div className="mb-3 w-24">
                            <label className="react-select-tag-label">
                              First Break In
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.fbIn || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "fbIn"
                                )
                              }
                              className={`w-full px-3 py-1 text-[12px] border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        } `}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>

                          {/* Lunch Start */}
                          <div className="mb-3 w-24">
                            <label className="react-select-tag-label">
                              Lunch Start
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.lunchBst || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "lunchBst"
                                )
                              }
                              className={`w-full px-3 py-1 text-[12px] border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        } `}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>

                          {/* LB.SNDay */}
                          <div className="mb-3 w-24">
                            <label className="react-select-tag-label">
                              LB.SNDay
                            </label>
                            <select
                              disabled={readOnly || childRecord.current > 0}
                              className="w-full px-1 py-1 text-[12px] border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm"
                              value={selectedRow?.lBSNDay || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "lBSNDay"
                                )
                              }
                            >
                              <option value="">Select</option>
                              {commonNew.map((blend) => (
                                <option value={blend.value} key={blend.value}>
                                  {blend?.show}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Lunch End */}
                          <div className="mb-3 w-24">
                            <label className="react-select-tag-label">
                              Lunch End
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.lunchBET || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "lunchBET"
                                )
                              }
                              className={`w-full px-3 py-1 text-[12px] border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        } `}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>

                          {/* LB.ENDay */}
                          <div className="mb-3 w-24">
                            <label className="react-select-tag-label">
                              LB.ENDay
                            </label>
                            <select
                              disabled={readOnly || childRecord.current > 0}
                              className="w-full px-1 py-1 text-[12px] border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm"
                              value={selectedRow?.lBEnday || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "lBEnday"
                                )
                              }
                            >
                              <option value="">Select</option>
                              {commonNew.map((blend) => (
                                <option value={blend.value} key={blend.value}>
                                  {blend?.show}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Second Break Out */}
                          <div className="mb-3 w-[110px]">
                            <label className="react-select-tag-label">
                              Second Break Out
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.sbOut || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "sbOut"
                                )
                              }
                              className={`w-[95px] px-3 py-1 text-[12px] border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>

                          {/* Second Break In */}
                          <div className="mb-3 w-[110px] -ml-4">
                            <label className="react-select-tag-label">
                              Second Break In
                            </label>
                            <input
                              min="0"
                              type="text"
                              value={selectedRow?.sbIn || ""}
                              onFocus={(e) => e.target.select()}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  selectedIndex,
                                  "sbIn"
                                )
                              }
                              className={` w-[95px] px-3 py-1 text-[12px] border uppercase border-gray-300 rounded-lg
                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                        transition-all duration-150 shadow-sm ${
                          readOnly || childRecord.current > 0
                            ? "text-gray-600"
                            : "text-black"
                        }`}
                              disabled={readOnly || childRecord.current > 0}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {thirdModal && selectedRow && (
          <NewModal
            isOpen={thirdModal}
            widthClass="w-[98%] h-[85%]"
            onClose={() => {
              setThirdModal(false);
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              {/* Header */}
              <div className="border-b py-2 px-1 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center">
                  <h2 className="text-lg py-0.5 font-semibold text-gray-800">
                    Quarter Details
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-auto p-2">
                <div className="grid grid-cols-1 gap-1 h-full">
                  <div className="space-y-3">
                    <div className="bg-white p-2 rounded-md border border-gray-200 h-full">
                      <div className="space-y-4">
                        <div
                          className={`w-full  overflow-auto bg-white max-h-[370px]`}
                        >
                          <table className="w-full border-collapse table-fixed ">
                            <thead className="bg-gray-200 text-gray-800">
                              <tr>
                                <th
                                  className={`w-4  py-2 text-center font-medium text-[13px] `}
                                >
                                  S.No
                                </th>
                                <th
                                  className={`w-16 py-2 text-center font-medium text-[13px] `}
                                >
                                  Days
                                </th>
                                <th
                                  className={`w-16 py-2 text-center font-medium text-[13px] `}
                                >
                                  Quarters
                                </th>
                                <th
                                  className={`w-8 py-2 text-center font-medium text-[13px] `}
                                >
                                  FT (Min)
                                </th>

                                <th
                                  className={`w-12 py-2 text-center font-medium text-[13px] `}
                                >
                                  From
                                </th>

                                <th
                                  className={`w-12  item-center font-medium text-[13px] `}
                                >
                                  To
                                </th>
                                <th
                                  className={`w-8 py-2 text-center font-medium text-[13px] `}
                                >
                                  TT (Min)
                                </th>
                                <th
                                  className={`w-12 py-2 text-center font-medium text-[13px] `}
                                >
                                  End Time
                                </th>
                                <th
                                  className={`w-12 py-2 text-center font-medium text-[13px] `}
                                >
                                  Next Day
                                </th>
                                <th
                                  className={`w-12 py-2 text-center font-medium text-[13px] `}
                                >
                                  Check Hrs
                                </th>
                                <th
                                  className={`w-8 py-2 text-center font-medium text-[13px] `}
                                >
                                  Total
                                </th>
                                <th
                                  className={`w-12 py-2 text-center font-medium text-[13px] `}
                                >
                                  Pick From
                                </th>
                                <th
                                  className={`w-12 py-2 text-center font-medium text-[13px] `}
                                >
                                  Add Formula
                                </th>
                                <th
                                  className={`w-20 py-2 text-center font-medium text-[13px] `}
                                >
                                  Formula
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {console.log(selectedRow, "selectedRow")}

                              {selectedRow?.quarterDetails?.map(
                                (val, subIndex) => (
                                  <tr
                                    key={subIndex}
                                    className=" w-full table-row "
                                  >
                                    <td className="border  border-gray-300   text-center px-1">
                                      {subIndex + 1}
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                                      <select
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                        className="text-left w-full bg-transparent text-[12px] focus:outline-none rounded py-1 "
                                        value={val?.day}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex, // main row index
                                            "day",
                                            subIndex // subgrid index
                                          )
                                        }
                                      >
                                        <option>Select</option>
                                        {Days.map((blend) => (
                                          <option
                                            value={blend.value}
                                            key={blend.value}
                                          >
                                            {blend?.show}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="border border-gray-300  w-[6px] text-center px-1">
                                      <Select
                                        options={OTOptions}
                                        value={
                                          OTOptions?.find(
                                            (opt) => opt.value === val?.oTId
                                          ) || null
                                        } // ensure not undefined
                                        onChange={(selected) =>
                                          handleInputChange(
                                            selected?.value || "",
                                            selectedIndex,
                                            "oTId",
                                            subIndex
                                          )
                                        }
                                        isDisabled={readOnly}
                                        placeholder="Select "
                                        menuPlacement="auto"
                                        menuPosition="fixed"
                                        styles={{
                                          control: (base) => ({
                                            ...base,
                                            border: "none", // remove border
                                            boxShadow: "none", // remove focus ring
                                            backgroundColor: "transparent",
                                            minHeight: "unset",
                                            height: "20px", // match table row height
                                            color: "black",
                                          }),
                                          placeholder: (base) => ({
                                            ...base,
                                            color: "black", // gray placeholder like Tailwind `text-gray-400`
                                          }),
                                          singleValue: (base) => ({
                                            ...base,
                                            color: readOnly ? "gray" : "black",
                                            fontSize: "12px", // optional: adjust font size
                                            // textTransform: "uppercase",
                                          }),

                                          dropdownIndicator: (base) => ({
                                            ...base,
                                            padding: 2, // smaller padding
                                            svg: {
                                              width: 14, // icon width
                                              height: 14, // icon height
                                            },
                                            color: "black",
                                          }),

                                          indicatorSeparator: () => ({
                                            display: "none",
                                          }), // remove line
                                          valueContainer: (base) => ({
                                            ...base,
                                            padding: "0 2px", // tighten padding
                                            color: "black",
                                            // textTransform: "uppercase",
                                          }),
                                          input: (base) => ({
                                            ...base,
                                            margin: 0,
                                            padding: 0,
                                            color: "black",
                                            // textTransform: "uppercase",
                                          }),
                                          option: (base, state) => ({
                                            ...base,
                                          }),
                                          menu: (base) => ({
                                            ...base,
                                            zIndex: 9999, // keep menu on top
                                          }),
                                        }}
                                        onInputChange={(value, { action }) => {
                                          if (action === "input-change") {
                                            return value.toUpperCase(); //  force uppercase typing
                                          }
                                          return value;
                                        }}
                                        components={{
                                          // DropdownIndicator: () => null,
                                          IndicatorSeparator: () => null, // remove separator
                                        }}
                                      />
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center ">
                                      <input
                                        min={"0"}
                                        type="number"
                                        value={val?.ftMins}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "ftMins",
                                            subIndex
                                          )
                                        }
                                        className={`w-full bg-transparent uppercase  focus:outline-none focus:border-transparent text-right pr-2 ${
                                          readOnly || childRecord.current > 0
                                            ? "text-gray-600"
                                            : "text-black"
                                        }`}
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                      />
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center ">
                                      <input
                                        min={"0"}
                                        type="text"
                                        value={val?.from}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "from",
                                            subIndex
                                          )
                                        }
                                        className={`w-full bg-transparent uppercase   focus:outline-none focus:border-transparent text-center  ${
                                          readOnly || childRecord.current > 0
                                            ? "text-gray-600"
                                            : "text-black"
                                        }`}
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                      />
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center ">
                                      <input
                                        min={"0"}
                                        type="text"
                                        value={val?.to}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "to",
                                            subIndex
                                          )
                                        }
                                        className={`w-full bg-transparent uppercase   focus:outline-none focus:border-transparent text-center  ${
                                          readOnly || childRecord.current > 0
                                            ? "text-gray-600"
                                            : "text-black"
                                        }`}
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                      />
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center ">
                                      <input
                                        min={"0"}
                                        type="number"
                                        value={val?.ttMins}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "ttMins",
                                            subIndex
                                          )
                                        }
                                        className={`w-full bg-transparent   focus:outline-none focus:border-transparent text-right pr-2 ${
                                          readOnly || childRecord.current > 0
                                            ? "text-gray-600"
                                            : "text-black"
                                        }`}
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                      />
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center ">
                                      <input
                                        min={"0"}
                                        type="number"
                                        value={val?.endTime}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "endTime",
                                            subIndex
                                          )
                                        }
                                        className={`w-full bg-transparent   focus:outline-none focus:border-transparent text-right pr-2 ${
                                          readOnly || childRecord.current > 0
                                            ? "text-gray-600"
                                            : "text-black"
                                        }`}
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                      />
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                                      <select
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                        className="text-left w-full bg-transparent text-[12px] focus:outline-none rounded py-1 "
                                        value={val?.nextDay}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "nextDay",
                                            subIndex
                                          )
                                        }
                                      >
                                        <option>Select</option>
                                        {common.map((blend) => (
                                          <option
                                            value={blend.value}
                                            key={blend.value}
                                          >
                                            {blend?.show}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center ">
                                      <input
                                        min={"0"}
                                        type="number"
                                        value={val?.checkHrs}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "checkHrs",
                                            subIndex
                                          )
                                        }
                                        className={`w-full bg-transparent   focus:outline-none focus:border-transparent text-right pr-2 ${
                                          readOnly || childRecord.current > 0
                                            ? "text-gray-600"
                                            : "text-black"
                                        }`}
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                      />
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center ">
                                      <input
                                        min={"0"}
                                        type="number"
                                        value={val?.total}
                                        onFocus={(e) => e.target.select()}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "total",
                                            subIndex
                                          )
                                        }
                                        className={`w-full bg-transparent   focus:outline-none focus:border-transparent text-right pr-2 ${
                                          readOnly || childRecord.current > 0
                                            ? "text-gray-600"
                                            : "text-black"
                                        }`}
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                      />
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                                      <select
                                        disabled={
                                          readOnly || childRecord.current > 0
                                        }
                                        className="text-left w-full bg-transparent text-[12px] focus:outline-none rounded py-1 "
                                        value={val?.pickFrom}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e.target.value,
                                            selectedIndex,
                                            "pickFrom",
                                            subIndex
                                          )
                                        }
                                      >
                                        <option>Select</option>
                                        {Quarter.map((blend) => (
                                          <option
                                            value={blend.value}
                                            key={blend.value}
                                          >
                                            {blend?.show}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-0.5 text-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (
                                            val?.pickFrom?.toLowerCase() ===
                                            "formula"
                                          ) {
                                            setActiveFormulaRow(subIndex);
                                            setModalFormulaValue(
                                              val?.formula || ""
                                            );

                                            setFormulaModal(true);
                                            console.log(
                                              "Opening Formula Modal",
                                              subIndex,
                                              val?.pickFrom
                                            );
                                          }
                                        }}
                                        className={`flex items-center justify-center w-6 h-6 rounded mx-auto 
    ${
      val?.pickFrom?.toLowerCase() === "formula"
        ? "cursor-pointer"
        : "cursor-not-allowed opacity-50"
    }`}
                                        title={
                                          val?.pickFrom?.toLowerCase() ===
                                          "formula"
                                            ? "Add Formula"
                                            : "Not allowed"
                                        }
                                        disabled={
                                          val?.pickFrom?.toLowerCase() !==
                                          "formula"
                                        }
                                      >
                                        <Plus
                                          size={14}
                                          className="text-green-500"
                                        />
                                      </button>
                                    </td>
                                    <td className="border border-gray-300 text-[12px] py-1.5 text-center px-1">
                                      <textarea
                                        type="text"
                                        value={val?.formula || ""}
                                        className={`w-full bg-transparent pl-2 h-4 text-left focus:outline-none
                          ${readOnly ? "text-gray-600" : "text-black"}
                          
                          `}
                                        readOnly
                                        spellCheck={false}
                                      />
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </NewModal>
        )}
        {console.log(formulaModal, "formulaModal")}
        {formulaModal === true && (
          <Modal
            isOpen={formulaModal}
            form={formulaModal}
            widthClass={"w-[55%]  h-[60%]"}
            onClose={() => {
              setFormulaModal(false);
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              <div className="border-b py-2 px-2 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center">
                  <h2 className=" -ml-2   py-0.5 master-header-modal">
                    Formula
                  </h2>
                </div>
              </div>

              <div className="flex-1  p-3">
                <div className="grid grid-cols-1  gap-3  h-full">
                  <div className="lg:col-span- space-y-3">
                    <div className="bg-white p-3 rounded-md border border-gray-200 h-full">
                      <div className="space-y-12">
                        <div className="flex gap-x-8">
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            Pay Code
                            <Select
                              options={selectedPayCodes.map((code) => ({
                                value: code,
                                label: code,
                              }))}
                              value={null} // reset after selection
                              onChange={(selected) => {
                                if (!selected?.value) return;
                                setModalFormulaValue((prev) =>
                                  prev
                                    ? `${prev}${selected.value}`
                                    : selected.value
                                );
                              }}
                              isDisabled={readOnly}
                              placeholder="Select Pay Code"
                              isClearable
                              styles={{
                                control: (base) => ({
                                  ...base,

                                  boxShadow: "none", // remove focus ring
                                  backgroundColor: "transparent",
                                  minHeight: "unset",
                                  width: "200px",
                                  height: "30px", // match table row height
                                  color: "black",
                                  marginTop: 5,
                                }),
                                placeholder: (base) => ({
                                  ...base,
                                  // color: "black",
                                }),
                                singleValue: (base) => ({
                                  ...base,
                                  color: readOnly ? "gray" : "black",
                                  fontSize: "11px", // optional: adjust font size
                                }),

                                dropdownIndicator: (base) => ({
                                  ...base,
                                  padding: 2, // smaller padding
                                  svg: {
                                    width: 14, // icon width
                                    height: 14, // icon height
                                  },
                                  color: "black",
                                }),

                                indicatorSeparator: () => ({ display: "none" }), // remove line
                                valueContainer: (base) => ({
                                  ...base,
                                  padding: "0 2px", // tighten padding
                                  color: "black",
                                  fontSize: "11px",
                                  fontWeight: "lighter",
                                }),
                                input: (base) => ({
                                  ...base,
                                  margin: 0,
                                  padding: 0,
                                  color: "black",
                                  fontSize: "11px",
                                  fontWeight: "lighter",
                                }),
                                menu: (base) => ({
                                  ...base,
                                  zIndex: 9999, // keep menu on top
                                }),
                                menuList: (base) => ({
                                  ...base,
                                  maxHeight: 150, // limit menu height (px)
                                  overflowY: "auto", // enable vertical scroll
                                  padding: 0,
                                }),

                                option: (base, state) => ({
                                  ...base,
                                  // color: state.isSelected ? "white" : "black",
                                  color: "black",
                                  backgroundColor: state.isSelected
                                    ? "#3b82f6" // blue background for selected
                                    : state.isFocused
                                    ? "#e5e7eb" // light gray on hover
                                    : "white",
                                  fontSize: "11px",
                                  padding: "5px 10px",
                                  cursor: "pointer",
                                  fontWeight: "lighter",
                                }),
                              }}
                              components={{
                                // DropdownIndicator: () => null,
                                IndicatorSeparator: () => null, // remove separator
                              }}
                            />{" "}
                          </label>
                          <div className="w-full">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Formula
                            </label>
                            <textarea
                              type="text"
                              value={modalFormulaValue}
                              onChange={(e) =>
                                setModalFormulaValue(e.target.value)
                              }
                              className={`border border-gray-300 h-24 px-2 py-1 w-full text-[11px]  rounded focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                                readOnly ? "text-gray-600" : "text-black"
                              }`}
                              placeholder="Type or select Pay Code"
                              disabled={readOnly}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className={`px-3 py-1 text-red-600 border border-red-600 text-xs rounded 
    ${
      readOnly
        ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100 hover:text-gray-400"
        : "hover:bg-red-600 hover:text-white"
    }`}
                            onClick={() => {
                              setModalFormulaValue(""); // clear modal input
                            }}
                            disabled={readOnly}
                          >
                            Clear
                          </button>
                          <button
                            className={`px-4 py-1 text-green-600 border border-green-600 text-xs rounded 
    ${
      readOnly
        ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100 hover:text-gray-400"
        : "hover:bg-green-600 hover:text-white"
    }`}
                            onClick={() => {
                              if (activeFormulaRow !== null) {
                                handleInputChange(
                                  modalFormulaValue, // the formula text
                                  selectedIndex, // main row index (you need to pass this from the parent)
                                  "formula", // field to update
                                  activeFormulaRow // subgrid row index
                                );
                              }
                              setFormulaModal(false); // close the Formula modal
                              setModalFormulaValue(""); // optionally clear formula value
                              setActiveFormulaRow(null); // reset active row
                            }}
                            disabled={readOnly}
                          >
                            Fill
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {contextMenu && (
          <div
            style={{
              position: "absolute",
              top: `${contextMenu.mouseY - 50}px`,
              left: `${contextMenu.mouseX - 30}px`,

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
