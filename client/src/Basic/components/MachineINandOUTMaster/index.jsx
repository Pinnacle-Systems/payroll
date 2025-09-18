import { useEffect, useState, useRef, useCallback } from "react";

import { ReusableTable, TextInput } from "../../../Inputs";

import { getCommonParams } from "../../../Utils/helper";

import {
  useAddMachineInOutMutation,
  useDeleteMachineInOutMutation,
  useGetMachineInOutByIdQuery,
  useGetMachineInOutQuery,
  useUpdateMachineInOutMutation,
} from "../../../redux/services/MachineInOutService";

import Swal from "sweetalert2";

import moment from "moment";
import { useDispatch } from "react-redux";
import { common, machinetype } from "../../../Utils/DropdownData";

const Form = () => {
  const today = new Date();
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");

  const [contextMenu, setContextMenu] = useState(null);

  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const [machineInOutGrid, setMachineInOutGrid] = useState([]);

  const dispatch = useDispatch();

  const params = getCommonParams();

  const { branchId, companyId, branchCode } = params;

  const { data: allData, refetch } = useGetMachineInOutQuery({
    params,
    searchParams: searchValue,
  });

  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetMachineInOutByIdQuery(id, { skip: !id });

  const [addData] = useAddMachineInOutMutation();
  const [updateData] = useUpdateMachineInOutMutation();
  const [removeData] = useDeleteMachineInOutMutation();

  useEffect(() => {
    if (machineInOutGrid?.length >= 1) return;
    setMachineInOutGrid((prev) => {
      let newArray = Array?.from({ length: 1 - prev?.length }, () => {
        return {
         machineInOutGridId : "",
        };
      }) || []
      return [...prev, ...newArray];
    });
  }, [machineInOutGrid, setMachineInOutGrid]);

  const syncFormWithDb = useCallback(
    (data) => {
      setMachineInOutGrid(data?.machineInOutGrid || []);
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    id,
    branchId,
    machineInOutGrid,
    companyId,
    branchCode,
  };

  const validateData = (data) => {
    if (!data?.employeeCategoryId || !data?.category) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Employee Category and category are required",
      });
      return false;
    }

    if (
      machineInOutGrid?.some((i) => !i.machineInOutGridId || i.machineInOutGridId === "")
    ) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Pay Details is missing in one or more rows",
      });
      return false;
    }

    return true;
  };

  const handleSubmitCustom = async (callback, data, text) => {
    try {
      let returnData = await callback(data).unwrap();
      setId(returnData.data.id);

      // toast.success(text + "Successfully");
      Swal.fire({
        title: text + "  " + "Successfully",
        icon: "success",
        draggable: true,
        timer: 1000,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      setForm(false);
      dispatch({
        type: `payComponent/invalidateTags`,
        payload: ["payComponent"],
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: error.data?.message || "Something went wrong!",
      });
    }
  };

  const saveData = () => {
    if (!validateData(data)) {
      return;
    }

    if (id) {
      handleSubmitCustom(updateData, data, "Updated");
    } else {
      handleSubmitCustom(addData, data, "Added");
    }
  };

  const deleteData = async (id) => {
    if (id) {
      if (!window.confirm("Are you sure to delete...?")) {
        return;
      }
      try {
        const deldata = await removeData(id).unwrap();
        if (deldata?.statusCode == 1) {
          Swal.fire({
            icon: "error",
            title: "Submission error",
            text: deldata?.data?.message || "Something went wrong!",
          });
          setForm(false);
          return;
        }
        setId("");
        Swal.fire({
          title: "Deleted Successfully",
          icon: "success",
          timer: 1000,
        });
        setForm(false);
        dispatch({
          type: `payComponent/invalidateTags`,
          payload: ["payComponent"],
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Submission error",
          text: error.data?.message || "Something went wrong!",
        });
      }
    }
  };

  const handleKeyDown = (event) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === "s") {
      event.preventDefault();
      // saveData();
    }
  };

  console.log(allData, "alldata");
  const onNew = () => {
    setId("");

    setReadOnly(false);
    setSearchValue("");
   
    setMachineInOutGrid([]);

    refetch();
  };
  const handleView = (id) => {
    setId(id);
    setForm(true);
    setReadOnly(true);
   
  };
  const handleEdit = (id) => {
    setId(id);
    setForm(true);
    setReadOnly(false);
   
  };

  const columns = [
    {
      header: "S.No",
      accessor: (item, index) => index + 1,
      className: " text-gray-900 w-6  text-center",
    },

    {
      header: "Doc Id",
      accessor: (item) => item?.docId,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-32",
    },
    {
      header: "Date",
      accessor: (item) => new Date(item?.date).toISOString().split("T")[0],
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-center uppercase w-32",
    },
  ];
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
  console.log(machineInOutGrid, "machineInOutGrid");

  const handleInputChange = (value, index, field) => {
    const newBlend = structuredClone(machineInOutGrid);

    newBlend[index][field] = value;

    setMachineInOutGrid(newBlend);
  };
  const addNewRow = () => {
    const newRow = { machineInOutGridId: "" };
    setMachineInOutGrid([...machineInOutGrid, newRow]);
  };

  const handleDeleteRow = (id) => {
    setMachineInOutGrid((yarnBlend) => {
      if (yarnBlend.length <= 1) {
        return yarnBlend;
      }
      return yarnBlend.filter((_, index) => index !== parseInt(id));
    });
  };
  const handleDeleteAllRows = () => {
    setMachineInOutGrid((prevRows) => {
      if (prevRows.length <= 1) return prevRows;
      return [prevRows[0]];
    });
  };
  return (
    <>
      <div>
        <div onKeyDown={handleKeyDown} className="p-1 ">
          {form === true ? (
            <div className="w-full bg-gray-100 mx-auto rounded-md shadow-md px-2 overflow-auto py-1 ">
              <div className="flex justify-between items-center mb-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  Machine In/Out IP Entry
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
                    <h2 className="font-medium text-slate-700 mb-2">
                      Basic Details
                    </h2>
                    <div className="flex gap-4 gap-x-6">
                      <TextInput
                        name="Company Code"
                        type="text"
                        value={branchCode}
                        required={true}
                        readOnly={readOnly}
                        disabled={childRecord.current > 0}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`w-[80vw]   p-2 overflow-auto bg-white max-h-[370px]`}
                >
                  <table className="w-full border-collapse table-fixed ">
                    <thead className="bg-gray-200 text-gray-800">
                      <tr>
                        <th
                          className={`w-[6px] px-1 text-center font-medium text-[13px] `}
                        >
                          S.No
                        </th>

                        <th
                          className={`w-7  py-2 text-center font-medium text-[13px] `}
                        >
                          Date
                        </th>
                        <th
                          className={`w-8  py-2 item-center font-medium text-[13px] `}
                        >
                          Machine Type
                        </th>
                        <th
                          className={`w-12 py-2 item-center font-medium text-[13px] `}
                        >
                          Machine IP
                        </th>
                        <th
                          className={`w-8 px-4 py-2 text-center font-medium text-[13px] `}
                        >
                          Machine No
                        </th>
                        <th
                          className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                        >
                          Machine Type 2
                        </th>
                        <th
                          className={`w-8 py-2 item-center font-medium text-[13px] `}
                        >
                          Current Machine
                        </th>
                        <th
                          className={`w-6 py-2  item-center font-medium text-[13px] `}
                        >
                          Default
                        </th>

                        <th
                          className={`w-8 py-2 item-center font-medium text-[13px] `}
                        >
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {machineInOutGrid?.map((item, index) => {
                        let machineTypeTwo = "";

                        // Only set value if machineTypeOne exists
                        if (item?.machineTypeOne) {
                          if (
                            item.machineTypeOne === "IN" ||
                            item.machineTypeOne === "OUT"
                          ) {
                            machineTypeTwo = "SEPARATE MACHINE";
                          } else {
                            machineTypeTwo = "SINGLE MACHINE";
                          }
                        }

                        return (
                          <tr className=" w-full table-row">
                            <td className="border border-gray-300 py-1.5  text-center px-1">
                              {index + 1}
                            </td>

                            <td className=" border border-gray-300 text-[11px] ">
                              <input
                                type="date"
                                value={item?.date}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    index,
                                    "date"
                                  )
                                }
                                className="pl-1 bg-transparent  focus:outline-none focus:border-transparent"
                                disabled={readOnly}
                              />
                            </td>
                            <td className=" border border-gray-300 text-[11px] py-0.5 item-center">
                              <select
                                disabled={childRecord.current > 0}
                                readOnly={readOnly}
                                className="text-left w-full bg-transparent focus:outline-none rounded py-1 "
                                value={item?.machineTypeOne}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    index,
                                    "machineTypeOne"
                                  )
                                }
                              >
                                <option>Select</option>
                                {machinetype.map((blend) => (
                                  <option value={blend.value} key={blend.value}>
                                    {blend?.show}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
                              <input
                                min="0"
                                type="text"
                                value={item?.machineIP}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    index,
                                    "machineIP"
                                  )
                                }
                                className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent ${
                                  readOnly ? "text-gray-600" : "text-black"
                                } `}
                                disabled={childRecord.current > 0}
                                readOnly={readOnly}
                              />
                            </td>

                            <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                              <input
                                min="0"
                                type="text"
                                value={item?.machineNo}
                                onFocus={(e) => e.target.select()}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    index,
                                    "machineNo"
                                  )
                                }
                                className={`w-full bg-transparent text-right pr-2 focus:outline-none focus:border-transparent ${
                                  readOnly ? "text-gray-600" : "text-black"
                                } `}
                                disabled={childRecord.current > 0}
                                readOnly={readOnly}
                              />
                            </td>
                            <td className="border border-gray-300 text-[11px] py-0.5 item-center">
                              <input
                                type="text"
                                value={machineTypeTwo || ""}
                                // onChange={(e) =>
                                //   handleInputChange(
                                //     e.target.value,
                                //     index,
                                //     "machineTypeTwo"
                                //   )
                                // }
                                className={`w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent ${
                                  readOnly ? "text-gray-600" : "text-black"
                                } `}
                                disabled
                              />
                            </td>

                            <td className="border border-gray-300 text-[11px] text-center px-1">
                              <select
                                disabled={childRecord.current > 0}
                                readOnly={readOnly}
                                className="text-left w-full bg-transparent focus:outline-none rounded py-1 "
                                value={item?.currentMachine}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    index,
                                    "currentMachine"
                                  )
                                }
                              >
                                <option>Select</option>
                                {common.map((blend) => (
                                  <option value={blend.value} key={blend.value}>
                                    {blend?.show}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="  border border-gray-300 text-[11px] py-0.5 item-center">
                              <select
                                disabled={childRecord.current > 0}
                                readOnly={readOnly}
                                className="text-left w-full bg-transparent focus:outline-none rounded py-1 "
                                value={item?.default}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    index,
                                    "default"
                                  )
                                }
                              >
                                <option>Select</option>
                                {common.map((blend) => (
                                  <option value={blend.value} key={blend.value}>
                                    {blend?.show}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td
                              className="  border border-gray-300 text-[11px] py-0.5 item-center"
                              onContextMenu={(e) => {
                                if (!readOnly) {
                                  handleRightClick(e, index, "notes");
                                }
                              }}
                            >
                              <input
                                type="text"
                                value={item?.notes}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    index,
                                    "notes"
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addNewRow();
                                    // if (item?.date) {
                                    //   addNewRow();
                                    // }
                                  }
                                }}
                                className={`w-full bg-transparent text-left pl-2 focus:outline-none focus:border-transparent ${
                                  readOnly ? "text-gray-600" : "text-black"
                                } `}
                                disabled={readOnly}
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
          ) : (
            <>
              <div className="w-full flex bg-white p-1 justify-between  items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  Machine In/Out IP Entry
                </h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setForm(true);
                      onNew();
                    }}
                    className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                  >
                    + Add New Machine In/Out IP Entry
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-3">
                <ReusableTable
                  columns={columns}
                  data={allData?.data}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={deleteData}
                  itemsPerPage={10}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
