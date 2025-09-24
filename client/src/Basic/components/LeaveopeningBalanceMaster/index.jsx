import { useEffect, useState, useRef, useCallback } from "react";

import {
  ReusableTable,
  DropdownInput,
  customSelectStyles,
  TextInput,
  DateInput,
} from "../../../Inputs";

import {
  useAddLeaveOpeningBalanceMutation,
  useDeleteLeaveOpeningBalanceMutation,
  useGetLeaveOpeningBalanceByIdQuery,
  useGetLeaveOpeningBalanceQuery,
  useUpdateLeaveOpeningBalanceMutation,
} from "../../../redux/services/LeaveopeningBalanceService";

import Modal from "../../../UiComponents/Modal";
import { Check, Power } from "lucide-react";
import Swal from "sweetalert2";
import { getCommonParams } from "../../../Utils/helper";
import { dropDownFinYear } from "../../../Utils/contructObject";
import { useGetFinYearQuery } from "../../../redux/services/FinYearMasterService";
import { useGetBranchQuery } from "../../../redux/services/BranchMasterService";
import { useGetEmployeeQuery } from "../../../redux/services/EmployeeMasterService";
import Select from "react-select";
import { useGetLeaveCodeQuery } from "../../../redux/services/LeaveCode.servive";
import { useDispatch } from "react-redux";
const Designation = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [finYearId, setFinYearId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [joinedDate, setJoinedDate] = useState(null);
  const [payCategory, setPayCategory] = useState("");
  const [leaveId, setLeaveId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [active, setActive] = useState(true);
  const dispatch = useDispatch();

  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);

  const params = getCommonParams();
  const payref = useRef(null);
  useEffect(() => {
    if (form && !readOnly && payref.current) {
      payref.current.focus();
    }
  }, [form, readOnly]);

  const { branchId, companyId } = params;
  const designationRef = useRef(null);

  const { data: allData } = useGetLeaveOpeningBalanceQuery({
    params,
    searchParams: searchValue,
  });
  const { data: yearData } = useGetFinYearQuery({
    params,
    searchParams: searchValue,
  });

  // const { data : branchData} = useGetBranchQuery({ params,
  //   searchParams: searchValue,})

  const { data: employee } = useGetEmployeeQuery({ params });
  const { data: LeaveType } = useGetLeaveCodeQuery({ params });
  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetLeaveOpeningBalanceByIdQuery(id, { skip: !id });

  const [addData] = useAddLeaveOpeningBalanceMutation();
  const [updateData] = useUpdateLeaveOpeningBalanceMutation();
  const [removeData] = useDeleteLeaveOpeningBalanceMutation();

  const syncFormWithDb = useCallback(
    (data) => {
      setFinYearId(data?.finYearId);
      setEmployeeId(data?.employeeId);
      setLeaveId(data?.leaveId);
      setEmployeeName(data?.Employee?.firstName);
      setJoinedDate(data?.Employee?.joiningDate);

      setJoinedDate(
        data?.Employee?.joiningDate
          ? new Date(data?.Employee?.joiningDate).toISOString().split("T")[0]
          : null
      );
      setPayCategory(data?.Employee?.payCategory);
      setOpeningBalance(data?.openingBalance);
      childRecord.current = data?.childRecord ? data?.childRecord : 0;
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    finYearId,
    leaveId,
    employeeId,
    openingBalance,

    companyId,
    id,
    branchId,
  };

  const validateData = (data) => {
    if (data?.employeeId && data?.finYearId && data?.leaveId) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (form && !readOnly && designationRef.current) {
      designationRef.current.focus();
    }
  }, [form, readOnly]);
  const handleSubmitCustom = async (callback, data, text) => {
    try {
      let returnData = await callback(data).unwrap();
      setId(returnData.data.id);
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
      dispatch({
        type: `leaveCode/invalidateTags`,
        payload: ["leaveCode"],
      });
      dispatch({
        type: `employeeMaster/invalidateTags`,
        payload: ["Employee"],
      });
      setForm(false);
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
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Please fill all required fields...!",
      });
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
        let deldata = await removeData(id).unwrap();
        if (deldata?.statusCode == 1) {
          Swal.fire({
            icon: "error",
            title: "Child record Exists",
            text: deldata.data?.message || "Data cannot be deleted!",
          });
          return;
        }
        setId("");
        Swal.fire({
          title: "Deleted Successfully",
          icon: "success",
          timer: 1000,
        });
        dispatch({
          type: `leaveCode/invalidateTags`,
          payload: ["leaveCode"],
        });
        dispatch({
          type: `employeeMaster/invalidateTags`,
          payload: ["Employee"],
        });
        setForm(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Submission error",
          text: error.data?.message || "Something went wrong!",
        });
        setForm(false);
      }
    }
  };
  const handleKeyDown = (event) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === "s") {
      event.preventDefault();
      saveData();
    }
  };

  const onNew = () => {
    setId("");
    setName("");
    setCode("");
    setActive(true);
    setEmployeeName("");
    setJoinedDate(null);
    setFinYearId("");
    setOpeningBalance("");
    setPayCategory("");
    setEmployeeId("");
    setLeaveId("");
    setReadOnly(false);
    setForm(true);
    setSearchValue("");
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
      className: " text-gray-900 w-12  text-center",
    },

    {
      header: "Employee Name",
      accessor: (item) => item?.Employee?.firstName,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-44",
    },
    {
      header: "ID CARD NUMBER",
      accessor: (item) => item?.Employee?.idNumber,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-44",
    },
    {
      header: "LEAVE TYPE",
      accessor: (item) => item?.leave?.name,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-44",
    },
  ];
  const EmployeeOptions = employee?.data?.map((val) => ({
    value: val?.id,
    label: val?.idNumber,
    firstName: val?.firstName,
    joiningDate: val?.joiningDate,
    payCategory: val?.payCategory,
  }));

  const LeaveOptions = LeaveType?.data?.map((val) => ({
    label: val?.name,
    value: val?.id,
  }));

  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="master-header">Leave Opening Balance Master</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setForm(true);
                onNew();
              }}
              className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              + Add New Leave Opening Balance
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
        {form === true && (
          <Modal
            isOpen={form}
            form={form}
            widthClass={"w-[60%]  h-[50%]"}
            onClose={() => {
              setForm(false);

              setId("");
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center gap-2">
                  <h2 className=" -ml-2   py-0.5 master-header-modal">
                    Leave Opening Balance Master
                  </h2>
                </div>
                <div className="flex gap-2">
                  <div>
                    {readOnly && (
                      <button
                        type="button"
                        onClick={() => {
                          setReadOnly(false);
                        }}
                        className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={saveData}
                        className="px-3 py-1 hover:bg-green-600 hover:text-white rounded text-green-600 
                  border border-green-600 flex items-center gap-1 text-xs"
                      >
                        <Check size={14} />
                        {id ? "Update" : "Save"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <div className="grid grid-cols-1  gap-3  h-full">
                  <div className="lg:col-span- space-y-3">
                    <div className="bg-white p-3 rounded-md border border-gray-200 h-full">
                      <div className="space-y-4 ">
                        <div className="flex flex-wrap gap-x-8">
                          <div className="mb-3 w-26">
                            <DropdownInput
                              name="Fin Year"
                              options={dropDownFinYear(
                                id
                                  ? yearData?.data
                                  : yearData?.data?.filter(
                                      (item) => item?.active
                                    ),
                                "code",
                                "id"
                              )}
                              value={finYearId}
                              setValue={setFinYearId}
                              required={true}
                              readOnly={readOnly}
                              disabled={childRecord.current > 0}
                              ref={payref}
                            />
                          </div>
                          <div className="mb-3 w-40 ">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              ID Number
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              options={EmployeeOptions}
                              value={
                                EmployeeOptions?.find(
                                  (opt) => opt?.value === employeeId
                                ) || null
                              }
                              onChange={(selected) => {
                                setEmployeeId(selected?.value || "");
                                setEmployeeName(selected?.firstName || "");
                                setJoinedDate(
                                  selected?.joiningDate?.slice(0, 10) || ""
                                );
                                setPayCategory(selected?.payCategory || "");
                              }}
                              placeholder="Select Id Number"
                              isClearable={false} // same as required
                              isDisabled={readOnly || childRecord.current > 0}
                              isSearchable
                              menuShouldScrollIntoView={false}
                              maxMenuHeight={150} // <-- Reduce height here
                              onInputChange={(value) => value.toUpperCase()}
                              className="w-full px-1 -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                              styles={customSelectStyles}
                            />
                          </div>
                          <TextInput
                            name="Employee Name"
                            type="text"
                            value={employeeName}
                            setValue={setEmployeeName}
                            // required={true}
                            readOnly={readOnly}
                            disabled={childRecord.current > 0}
                          />
                          <div className="w-28">
                            <DateInput
                              name="Joined Date"
                              type="date"
                              value={joinedDate}
                              setValue={setJoinedDate}
                              // required={true}
                              readOnly={readOnly}
                              disabled={childRecord.current > 0}
                            />
                          </div>

                          <div className="mb-3 w-40 ">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Leave Type
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              options={LeaveOptions}
                              value={
                                LeaveOptions.find(
                                  (opt) => opt.value === leaveId
                                ) || null
                              }
                              onChange={(selected) =>
                                setLeaveId(selected?.value || "")
                              }
                              placeholder="Select Leave Type"
                              isClearable={false} // same as required
                              isDisabled={readOnly || childRecord.current > 0}
                              isSearchable
                              menuShouldScrollIntoView={false}
                              maxMenuHeight={150} // <-- Reduce height here
                              onInputChange={(value) => value.toUpperCase()}
                              className="w-full px-1 -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                              styles={customSelectStyles}
                            />
                          </div>

                          <TextInput
                            name="Pay Category"
                            type="text"
                            value={payCategory}
                            setValue={setPayCategory}
                            // required={true}
                            readOnly={readOnly}
                            disabled={childRecord.current > 0}
                          />
                          <div className="w-28">
                            <TextInput
                              name="Opening Balance"
                              type="number"
                              value={openingBalance}
                              setValue={setOpeningBalance}
                              // required={true}
                              readOnly={readOnly}
                              disabled={childRecord.current > 0}
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
      </div>
    </div>
  );
};

export default Designation;
