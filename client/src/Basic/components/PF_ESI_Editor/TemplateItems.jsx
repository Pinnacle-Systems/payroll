import { useEffect, useRef, useState } from "react";
import { DateInput, DropdownInput, TextInput } from "../../../Inputs";

import { toast } from "react-toastify";

const TemplateItems = ({
  saveData,
  setForm,
  companyPayCode,
  readOnly,
  pfEsiGrid,
  setPfEsiGrid,
  id,
  setDate,
  date,
  setPickFrom,
  pickFrom,
  setPayDetailsId,
  payDetailsId,
  docId,
  setPayCodeType,
  payCodeType,
  childRecord,
  form,
  setReadOnly,
  setId,
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const countryNameRef = useRef(null);
  useEffect(() => {
    if (form && !readOnly && countryNameRef.current) {
      countryNameRef.current.focus();
    }
  }, [form, readOnly]);

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
  console.log(payDetailsId, "payDetailsId");

  const handleInputChange = (value, index, field) => {
    const newBlend = structuredClone(pfEsiGrid);

    newBlend[index][field] = value;

    setPfEsiGrid(newBlend);
  };

  const addNewRow = () => {
    const newRow = { payDetailsId: "" };
    setPfEsiGrid([...pfEsiGrid, newRow]);
  };

  const handleDeleteRow = (id) => {
    setPfEsiGrid((yarnBlend) => {
      if (yarnBlend.length <= 1) {
        return yarnBlend;
      }
      return yarnBlend.filter((_, index) => index !== parseInt(id));
    });
  };
  const handleDeleteAllRows = () => {
    setPfEsiGrid((prevRows) => {
      if (prevRows.length <= 1) return prevRows;
      return [prevRows[0]];
    });
  };
  // Get all pay codes that are selected in the table

  const pfEsiPayDetails = companyPayCode?.data
    ?.flatMap((cp) => cp?.PayDetails || [])
    .filter((pd) => {
      if (!pd?.payComponent) return false;
      const code = pd.payComponent.payCode?.toUpperCase() || "";

      return code.startsWith("PF") || code.startsWith("ESI");
    });

  // Step 2: map to dropdown options
  const dropdownOptions = pfEsiPayDetails?.map((pd) => ({
    value: pd.id,
    show: pd.payComponent?.payCode || "",
  }));
  const handlePayDetailsChange = (selectedId) => {
    setPayDetailsId(selectedId);

    const fullDetail = pfEsiPayDetails.find((pd) => pd.id === selectedId);
    setPickFrom(fullDetail?.pickFrom || "");
    setPayCodeType(fullDetail?.payComponent?.payCode?.toUpperCase() || "");
  };

  return (
    <>
      <div className="w-full bg-gray-100 mx-auto rounded-md shadow-md px-2 overflow-auto py-1 ">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-gray-800">
            PF and ESI Rate Editor
          </h1>
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
                    name="Effective Date"
                    value={date}
                    setValue={setDate}
                    required={true}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}
                  />
                </div>
                <div className="w-30">
                  <DropdownInput
                    name="PF or ESI"
                    value={payDetailsId}
                    setValue={handlePayDetailsChange}
                    options={dropdownOptions}
                    required={true}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}
                    ref={countryNameRef}
                  />
                </div>
                <div className="w-24">
                  <TextInput
                    name="Pick From"
                    type="text"
                    value={pickFrom}
                    //   onChange={(e) => setPickFrom(e.target.value)}
                    required={true}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`w-full   p-2 overflow-auto bg-white max-h-[370px]`}>
            <table className="w-[500px] border-collapse table-fixed ">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th
                    className={`w-[6px] px-1 text-center font-medium text-[13px] `}
                  >
                    S.No
                  </th>

                  <th
                    className={`w-4  py-2 text-center font-medium text-[13px] `}
                  >
                    From Value
                  </th>
                  <th
                    className={`w-4  py-2 item-center font-medium text-[13px] `}
                  >
                    To Value
                  </th>
                  <th
                    className={`w-4 py-2 item-center font-medium text-[13px] `}
                  >
                    PerCentage %
                  </th>
                  <th
                    className={`w-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {pfEsiGrid?.map((item, index) => {
                  const from = parseFloat(item?.fromValue) || 0;
                  const to = parseFloat(item?.toValue) || 0;
                  const perc = parseFloat(item?.percentage) || 0;
                  let calculatedAmount = 0;
                  if (to > from) {
                    if (payCodeType === "PF") {
                      if (to > 0) {
                        const tempAmount = (to * perc) / 100;
                        calculatedAmount = to >= 15001 ? 1800 : tempAmount;
                      }
                    } else if (payCodeType === "ESI") {
                      if (to > 0 && to <= 21000) {
                        calculatedAmount = (to * perc) / 100; 
                      } else if (to > 21000) {
                        calculatedAmount = 0;
                      }
                    }
                  }

                  return (
                    <tr className=" w-full table-row">
                      <td className="border border-gray-300 py-1.5  text-center px-1">
                        {index + 1}
                      </td>

                      <td className=" border border-gray-300 text-[11px] py-0.5 item-center">
                        <input
                          type="number"
                          placeHolder="0.00"
                          step="0.01"
                          value={item?.fromValue}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              index,
                              "fromValue"
                            )
                          }
                          onBlur={(e) => {
                            const formatted =
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value).toFixed(2);
                            e.target.value = formatted;
                            handleInputChange(formatted, index, "fromValue");
                          }}
                          className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent ${
                            readOnly ? "text-gray-600" : "text-black"
                          }`}
                          disabled={readOnly || !payDetailsId}
                        />
                      </td>
                      <td className=" border border-gray-300 text-[11px] py-0.5 item-center">
                        <input
                          type="number"
                          placeHolder="0.00"
                          step="0.01"
                          value={item?.toValue}
                          onChange={(e) => {
                            handleInputChange(e.target.value, index, "toValue");
                          }}
                          onBlur={(e) => {
                            const rawValue = e.target.value;
                            const formatted =
                              rawValue === ""
                                ? ""
                                : Number(rawValue).toFixed(2);

                            if (formatted !== "") {
                              const from = Number(item?.fromValue || 0);
                              const to = Number(formatted);

                              if (to < from) {
                                //  Show error toast
                                toast.error(
                                  "To Value cannot be smaller than From Value",
                                  {
                                    position: "top-right",
                                    autoClose: 3000,
                                  }
                                );

                                // Reset both toValue & percentage
                                handleInputChange("", index, "toValue");
                                handleInputChange("", index, "percentage");
                                e.target.value = "";
                                return;
                              }
                            }

                            // Valid case → update state
                            e.target.value = formatted;
                            handleInputChange(formatted, index, "toValue");
                          }}
                          className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent ${
                            readOnly ? "text-gray-600" : "text-black"
                          }`}
                          disabled={readOnly || !item?.fromValue}
                        />
                      </td>
                      <td className=" border border-gray-300 text-[11px] py-0.5 item-center">
                        <input
                          type="number"
                          placeHolder="0.00"
                          step="0.01"
                          value={item?.percentage}
                          onChange={(e) =>
                            handleInputChange(
                              e.target.value,
                              index,
                              "percentage"
                            )
                          }
                          onBlur={(e) => {
                            const formatted =
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value).toFixed(2);
                            e.target.value = formatted;
                            handleInputChange(formatted, index, "percentage");
                          }}
                          className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent ${
                            readOnly ? "text-gray-600" : "text-black"
                          }`}
                          disabled={readOnly || !item?.toValue}
                        />
                      </td>
                      <td
                        className=" border border-gray-300 text-[11px] py-0.5 item-center"
                        onContextMenu={(e) => {
                          if (!readOnly) {
                            handleRightClick(e, index, "amount");
                          }
                        }}
                      >
                        <input
                          type="number"
                          placeHolder="0.00"
                          step="0.01"
                          value={
                            calculatedAmount ? calculatedAmount.toFixed(2) : ""
                          }
                          className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent ${
                            readOnly ? "text-gray-600" : "text-black"
                          }`}
                          disabled={readOnly}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (
                                item?.fromValue &&
                                item.fromValue.toString().trim() !== ""
                              ) {
                                addNewRow();
                              }
                            }
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
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
