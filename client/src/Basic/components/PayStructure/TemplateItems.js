import { useState } from "react";
import { DateInput, DropdownInput, TextInput } from "../../../Inputs";
import { Copy, Plus } from "lucide-react";
import Select from "react-select";
import { ShowShiftData } from "../../../Utils/DropdownData";
import { dropDownListObject } from "../../../Utils/contructObject";
import Modal from "../../../UiComponents/Modal";

const TemplateItems = ({
  saveData,
  setForm,
  companyPayCode,
  readOnly,
  payStructure,
  setPayStructure,
  id,
  setDate,
  date,
  setEmployeeCategoryId,
  employeeCategoryId,
  setCategory,
  category,
  docId,
  employeeCategoryList,
  childRecord,

  setReadOnly,
  setId,
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const [activeFormulaRow, setActiveFormulaRow] = useState(null);
  const [modal, setModal] = useState(false);
  // index of row
  const [modalFormulaValue, setModalFormulaValue] = useState(""); // value typed/selected in modal

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
  console.log(payStructure, "payStructure");

  const handleInputChange = (value, index, field) => {
    const newBlend = structuredClone(payStructure);

    if (field === "payDetailsId") {
      // When selecting PayDetails, auto-fill related fields
      const selected = companyPayCode?.data
        ?.flatMap((b) => b.PayDetails)
        .find((pd) => pd.id === Number(value));

      if (selected) {
        newBlend[index].payDetailsId = selected.id;
        // newBlend[index].payCode = selected.payComponent?.payCode || "";

        newBlend[index].payDescription =
          selected.payComponent?.payDescription || "";
        newBlend[index].pickFrom = selected.pickFrom || "";
      }
    } else {
      newBlend[index][field] = value;
    }

    setPayStructure(newBlend);
  };
  const insertPayCodeToFormula = (payDetailsId) => {
    if (activeFormulaRow === null) return; // no active formula row

    const newBlend = structuredClone(payStructure);

    const payCode = companyPayCode?.data
      ?.flatMap((b) => b.PayDetails)
      .find((pd) => pd.id === Number(payDetailsId))?.payComponent?.payCode;

    if (payCode) {
      const target = newBlend[activeFormulaRow];
      target.formula = target.formula
        ? `${target.formula} ${payCode}`
        : payCode;
      setPayStructure(newBlend);
    }
  };

  const addNewRow = () => {
    const newRow = { payDetailsId: "" };
    setPayStructure([...payStructure, newRow]);
  };

  const handleDeleteRow = (id) => {
    setPayStructure((yarnBlend) => {
      if (yarnBlend.length <= 1) {
        return yarnBlend;
      }
      return yarnBlend.filter((_, index) => index !== parseInt(id));
    });
  };
  const handleDeleteAllRows = () => {
    setPayStructure((prevRows) => {
      if (prevRows.length <= 1) return prevRows;
      return [prevRows[0]];
    });
  };
  // Get all pay codes that are selected in the table
  const selectedPayCodes = payStructure
    .filter((item) => item.payDetailsId) // only rows where a pay code is selected
    .map((item) => {
      const pd = companyPayCode?.data
        ?.flatMap((blend) => blend?.PayDetails || [])
        .find((p) => p.id === item.payDetailsId);
      return pd?.payComponent?.payCode;
    })
    .filter(Boolean); // remove undefined/null

  return (
    <>
      <div className="w-full bg-gray-100 mx-auto rounded-md shadow-md px-2 overflow-auto py-1 ">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-gray-800">Pay Structure</h1>
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
        <div className="space-y-3 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <div className="border border-slate-200 p-2 bg-white rounded-md shadow-sm col-span-1">
              <h2 className="font-medium text-slate-700 mb-2">Basic Details</h2>
              <div className="flex gap-4 gap-x-6">
                {/* <TextInput
                  name="Company Code"
                  type="text"
                  value={companyCode}
                  setValue={setCompanyCode}
                  required={true}
                  // readOnly={readOnly}
                  disabled={true}
                /> */}

                <TextInput
                  name="Doc Id"
                  type="text"
                  value={docId}
                  // setValue={setDocId}
                  required={true}
                  readOnly={readOnly}
                  disabled={childRecord.current > 0}
                />

                <div className="w-[120px]">
                  <DateInput
                    name="Date"
                    value={date}
                    setValue={setDate}
                    required={true}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}
                  />
                </div>
                <div className="w-44">
                  <DropdownInput
                    name="Employee Category"
                    value={employeeCategoryId}
                    setValue={setEmployeeCategoryId}
                    options={dropDownListObject(
                      employeeCategoryList?.data,
                      "name",
                      "id"
                    )}
                    required={true}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}
                  />
                </div>
                <div className="w-44">
                  <DropdownInput
                    name="Type"
                    type="text"
                    options={ShowShiftData}
                    value={category}
                    setValue={setCategory}
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
                    className={`w-[6px] px-1 text-center font-medium text-[13px] `}
                  >
                    S.No
                  </th>
                  {/* <th
                    className={`w-[6px] px-1.5 text-center font-medium text-[13px] `}
                  >
                    Mark
                  </th> */}
                  <th
                    className={`w-8 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Pay Code
                  </th>
                  <th
                    className={`w-4  py-2 item-center font-medium text-[13px] `}
                  >
                    Salary %
                  </th>
                  <th
                    className={`w-8 py-2 item-center font-medium text-[13px] `}
                  >
                    Earned PayCode
                  </th>
                  <th
                    className={`w-16 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Pay Description
                  </th>
                  <th
                    className={`w-8 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Pick From
                  </th>
                  <th
                    className={`w-8 py-2 item-center font-medium text-[13px] `}
                  >
                    Add Formula
                  </th>
                  <th
                    className={`w-16 py-2  item-center font-medium text-[13px] `}
                  >
                    Formula
                  </th>
                  {/* <th
                    className={`w-[10px] py-2  item-center font-medium text-[13px] `}
                  >
                    Select
                  </th> */}
                  <th
                    className={`w-8 py-2 item-center font-medium text-[13px] `}
                  >
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {payStructure?.map((item, index) => (
                  <tr className=" w-full table-row">
                    <td className="border border-gray-300 py-1.5  text-center px-1">
                      {index + 1}
                    </td>
                    {/* <td className="border border-gray-300 py-1.5  text-center px-1">
                      <input
                        type="checkBox"
                        checked={item?.mark || false}
                        onChange={(e) =>
                          handleInputChange(e.target.checked, index, "mark")
                        }
                        disabled={readOnly}
                      />
                    </td> */}

                    <td className=" border border-gray-300 text-[12px] py-0.5 px-1 item-center ">
                      {/* <select
                        disabled={readOnly}
                        className="text-left w-full focus:outline-none  bg-transparent rounded py-1 "
                        value={item?.payComponentId}
                        onChange={(e) =>
                          handleInputChange(
                            e.target.value,
                            index,
                            "payComponentId"
                          )
                        }
                      >
                        <option className=" ">Select Pay Code</option>
                        {(payComponent?.data || []).map((blend) => (
                          <option value={blend.id} key={blend.id}>
                            {blend?.payCode}
                          </option>
                        ))}
                      </select> */}
                      <Select
                        options={(companyPayCode?.data || []).flatMap((blend) =>
                          blend?.PayDetails?.map((pd) => ({
                            value: pd?.id,
                            label: pd?.payComponent?.payCode,
                          }))
                        )}
                        value={
                          (companyPayCode?.data || [])
                            .flatMap((blend) =>
                              blend?.PayDetails?.map((pd) => ({
                                value: pd?.id,
                                label: pd?.payComponent?.payCode,
                              }))
                            )
                            .find((opt) => opt.value === item?.payDetailsId) ||
                          null
                        } // ensure not undefined
                        onChange={(selected) =>
                          handleInputChange(
                            selected?.value || "", // safe read
                            index,
                            "payDetailsId"
                          )
                        }
                        isDisabled={readOnly}
                        placeholder="Select Pay Code"
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

                          indicatorSeparator: () => ({ display: "none" }), // remove line
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
                    <td className=" border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="number"
                        placeHolder="0.00"
                        step="0.01"
                        value={item?.salaryPercentage}
                        onChange={(e) =>
                          handleInputChange(
                            e.target.value,
                            index,
                            "salaryPercentage"
                          )
                        }
                        onBlur={(e) => {
                          const formatted =
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value).toFixed(2);
                          e.target.value = formatted;
                          handleInputChange(
                            formatted,
                            index,
                            "salaryPercentage"
                          );
                        }}
                        className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent ${
                          readOnly ? "text-gray-600" : "text-black"
                        }`}
                        disabled={readOnly}
                      />
                    </td>

                    <td className="  border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={
                          companyPayCode?.data?.find(
                            (i) => i.id == item?.payDetailsId
                          )?.pickFrom
                        }
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "pickFrom")
                        }
                        className="w-full bg-transparent  text-left pl-2  focus:outline-none focus:border-transparent"
                        disabled={true}
                      />
                    </td>

                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.payDescription || ""}
                        className={`w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent
                          ${readOnly ? "text-gray-600" : "text-black"}
                          `}
                        disabled
                      />
                    </td>
                    <td className="border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.pickFrom || ""}
                        className={`w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent ${
                          readOnly ? "text-gray-600" : "text-black"
                        } `}
                        disabled
                      />
                    </td>
                    <td className="border border-gray-300 text-[12px] py-0.5 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (item?.pickFrom?.toLowerCase() === "formula") {
                            setActiveFormulaRow(index);
                            setModalFormulaValue(item?.formula || ""); // prefill modal input
                            setModal(true);
                          }
                        }}
                        className={`flex items-center justify-center w-6 h-6 rounded mx-auto 
    ${
      item?.pickFrom?.toLowerCase() === "formula"
        ? "cursor-pointer"
        : "cursor-not-allowed opacity-50"
    }`}
                        title={
                          item?.pickFrom?.toLowerCase() === "formula"
                            ? "Add Formula"
                            : "Not allowed"
                        }
                        disabled={item?.pickFrom?.toLowerCase() !== "formula"}
                      >
                        <Plus size={14} className="text-green-500" />
                      </button>
                    </td>

                    <td className="border border-gray-300 text-[12px] py-1.5 text-center px-1">
                      <textarea
                        type="text"
                        value={item?.formula || ""}
                        className={`w-full bg-transparent pl-2 h-4 text-left focus:outline-none
                          ${readOnly ? "text-gray-600" : "text-black"}
                          
                          `}
                        readOnly
                        spellCheck={false}
                      />
                    </td>

                    {/* <td className="border border-gray-300 py-1.5 text-center px-1">
                      <button
                        type="button"
                        onClick={() => {
                          handleInputChange(true, index, "select"); // same as checkbox checked
                          insertPayCodeToFormula(item.payDetailsId);
                        }}
                        className="p-1 hover:text-blue-600"
                        title="Insert PayCode"
                      >
                        <Copy size={12} />
                      </button>
                    </td> */}
                    <td className="  border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.notes || ""}
                        className={`w-full bg-transparent pl-2 focus:outline-none ${
                          readOnly ? "text-gray-600" : "text-black"
                        }`}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "notes")
                        }
                        onContextMenu={(e) => {
                          if (!readOnly) {
                            handleRightClick(e, index, "notes");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addNewRow();
                          }
                        }}
                        disabled={readOnly}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {modal === true && (
          <Modal
            isOpen={modal}
            form={modal}
            widthClass={"w-[55%]  h-[60%]"}
            onClose={() => {
              setModal(false);
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              <div className="border-b py-2 px-2 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center">
                  <h2 className="text-lg  py-0.5 font-semibold  text-gray-800">
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
                              // Update the formula in the correct row
                              handleInputChange(
                                modalFormulaValue,
                                activeFormulaRow,
                                "formula"
                              );
                              setModal(false);
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
