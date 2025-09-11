import { useRef, useState } from "react";
import { DateInput, TextInput } from "../../../Inputs";

import { common, pickFrom } from "../../../Utils/DropdownData";
import Select from "react-dropdown-select";

const TemplateItems = ({
  saveData,
  setForm,
  companyPayCode,
  readOnly,
  payDetails,
  setPayDetails,
  id,
  setDate,
  date,
  setcompanyPayCodeId,
  companyPayCodeId,
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
    const newBlend = structuredClone(payDetails);

    if (field === "companyPayCodeId") {
      // When selecting PayDetails, auto-fill related fields
      const selected = companyPayCode?.data
        ?.flatMap((b) => b.PayDetails)
        .find((pd) => pd.id === Number(value));

      if (selected) {
        newBlend[index].companyPayCodeId = selected.id;
        // newBlend[index].payCode = selected.payComponent?.payCode || "";

        newBlend[index].payDescription =
          selected.payComponent?.payDescription || "";
        newBlend[index].pickFrom = selected.pickFrom || "";
      }
    } else {
      newBlend[index][field] = value;
    }

    setPayDetails(newBlend);
  };

  const addNewRow = () => {
    const newRow = { templateId: "" };
    setPayDetails([...payDetails, newRow]);
  };

  const handleDeleteRow = (id) => {
    setPayDetails((yarnBlend) => {
      if (yarnBlend.length <= 1) {
        return yarnBlend;
      }
      return yarnBlend.filter((_, index) => index !== parseInt(id));
    });
  };
  const handleDeleteAllRows = () => {
    setPayDetails((prevRows) => {
      if (prevRows.length <= 1) return prevRows;
      return [prevRows[0]];
    });
  };
  console.log(companyPayCode, "companyPayCode");

  return (
    <>
      <div className="w-full bg-gray-100 mx-auto rounded-md overflow-auto shadow-md px-2 py-1">
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
        <div className="space-y-3 overflow-auto ">
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
              </div>
            </div>
          </div>
          <div className={`w-full   p-2 overflow-auto bg-white max-h-[370px]`}>
            <table className="w-full border-collapse table-fixed">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th
                    className={`w-[8px] px-2 text-center font-medium text-[13px] `}
                  >
                    S.No
                  </th>
                  <th
                    className={`w-8 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Pay Code
                  </th>
                  <th className={`w-8 item-center font-medium text-[13px] `}>
                    Salary Percenteage
                  </th>
                  <th className={`w-8 item-center font-medium text-[13px] `}>
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

                  <th className={`w-12  item-center font-medium text-[13px] `}>
                    Formula
                  </th>
                  <th className={`w-8 item-center font-medium text-[13px] `}>
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {payDetails?.map((item, index) => (
                  <tr className=" w-full table-row">
                    <td className="border border-gray-300  text-center px-1">
                      {index + 1}
                    </td>

                    <td className="  border border-gray-300 text-[11px] py-0.5 px-1 item-center">
                      <select
                        disabled={readOnly}
                        className="text-left w-full focus:outline-none rounded py-1 bg-transparent "
                        value={item?.companyPayCodeId}
                        onChange={(e) =>
                          handleInputChange(
                            e.target.value,
                            index,
                            "companyPayCodeId"
                          )
                        }
                      >
                        <option>Select Pay Code</option>
                        {(companyPayCode?.data || []).flatMap((blend) =>
                          blend?.PayDetails?.map((pd) => (
                            <option value={pd?.id} key={pd?.id}>
                              {pd?.payComponent?.payCode}
                            </option>
                          ))
                        )}
                      </select>

                   
                    </td>

                    <td className=" border border-gray-300 text-[11px] py-0.5 item-center">
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
                        className="w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent"
                        disabled={readOnly}
                      />
                    </td>

                    <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
                      <input
                        type="text"
                        value={
                          companyPayCode?.data?.find(
                            (i) => i.id == item?.companyPayCodeId
                          )?.pickFrom
                        }
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "pickFrom")
                        }
                        className="w-full bg-transparent  text-left pl-2  focus:outline-none focus:border-transparent"
                        disabled={true}
                      />
                    </td>

                    <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.payDescription || ""}
                        className="w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent"
                        disabled
                      />
                    </td>
                    <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.pickFrom || ""}
                        className="w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent"
                        disabled
                      />
                    </td>
                    <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.formula || ""}
                        className="w-full bg-transparent pl-2 focus:outline-none"
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "formula")
                        }
                      />
                    </td>
                    <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.notes || ""}
                        className="w-full bg-transparent pl-2 focus:outline-none"
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
                      />
                    </td>
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
