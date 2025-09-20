import { useEffect, useRef, useState } from "react";
import { DateInput } from "../../../Inputs";

const TemplateItems = ({
  saveData,
  setForm,

  readOnly,
  oTDetails,
  setOTDetails,
  id,
  setDate,
  date,

  childRecord,

  setReadOnly,
  setId,

  form,
}) => {
  const [contextMenu, setContextMenu] = useState(null);

  const payref = useRef(null);
  useEffect(() => {
    if (form && !readOnly && payref.current) {
      payref.current.focus();
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
console.log(oTDetails,"oTDetails");

  const handleInputChange = (value, index, field) => {
    const newBlend = structuredClone(oTDetails);
    newBlend[index][field] = value;

    setOTDetails(newBlend);
  };

  const addNewRow = () => {
    const newRow = { templateId: "" };
    setOTDetails([...oTDetails, newRow]);
  };

  const handleDeleteRow = (id) => {
    setOTDetails((prevRows) => {
      const row = prevRows[id];
      // Prevent deletion if row has childRecord
      if (row?.childRecord > 0) return prevRows;

      // Otherwise delete the row
      return prevRows.filter((_, index) => index !== parseInt(id));
    });
  };

  const handleDeleteAllRows = () => {
    setOTDetails((prevRows) => {
      // Keep first row and all rows with childRecord > 0
      return prevRows.filter(
        (row, index) => index === 0 || row.childRecord > 0
      );
    });
  };
  console.log(oTDetails, "oTDetails");

  return (
    <>
      <div className="w-full bg-gray-100 mx-auto rounded-md shadow-md px-2 overflow-auto py-1 ">
        <div className="flex justify-between items-center mb-1">
          <h1 className="master-header">OT Master</h1>
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
              <div className="grid grid-cols-6 gap-4">
                <div className="w-[120px]">
                  <DateInput
                    name="Date"
                    value={date}
                    setValue={setDate}
                    required={true}
                    readOnly={readOnly}
                    disabled={childRecord.current > 0}
                    ref={payref}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`w-[410px]   p-2 overflow-auto bg-white max-h-[370px]`}
          >
            <table className="w-full border-collapse table-fixed ">
              <thead className="bg-gray-200 text-gray-800 ">
                <tr>
                  <th
                    className={`w-[8px] px-2 text-center font-medium text-[13px] `}
                  >
                    S.No
                  </th>
                  <th
                    className={`w-16 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Pay Code
                  </th>
                  <th
                    className={`w-24 px-4 py-2 text-center font-medium text-[13px] `}
                  >
                    Pay Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {oTDetails?.map((item, index) => (
                  <tr className=" w-full table-row">
                    <td className="border border-gray-300  text-center px-1">
                      {index + 1}
                    </td>
                    <td className="  border border-gray-300 text-[12px] py-1.5 item-center">
                      <input
                        type="text"
                        value={item?.payCode || ""}
                        className={`w-full bg-transparent pl-2 uppercase focus:outline-none ${
                          readOnly ? "text-gray-600" : "text-black"
                        }`}
                        onChange={(e) =>
                          handleInputChange(e.target.value.toUpperCase(), index, "payCode")
                        }
                        disabled={readOnly}
                      />
                    </td>

                    <td className="  border border-gray-300 text-[12px] py-0.5 item-center">
                      <input
                        type="text"
                        value={item?.payDescription || ""}
                        className={`w-full bg-transparent  uppercase pl-2 focus:outline-none ${
                          readOnly ? "text-gray-600" : "text-black"
                        }`}
                        onChange={(e) =>
                          handleInputChange(
                            e.target.value.toUpperCase(),
                            index,
                            "payDescription"
                          )
                        }
                        onContextMenu={(e) => {
                          if (!readOnly) {
                            handleRightClick(e, index, "payDescription");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (item?.payCode) {
                              addNewRow();
                            }
                          }
                        }}
                        disabled={readOnly || !item?.payCode}
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
