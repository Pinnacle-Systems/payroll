import { useEffect, useState, useRef, useCallback } from "react";

import {
  ReusableTable,
  customSelectStyles,
  TextInput,
  DateInput,
  TextArea,
} from "../../../Inputs";

import {
  useAddEmployeeResignMutation,
  useDeleteEmployeeResignMutation,
  useGetEmployeeResignByIdQuery,
  useGetEmployeeResignQuery,
  useUpdateEmployeeResignMutation,
} from "../../../redux/services/EmployeeResignService";

import Swal from "sweetalert2";
import { getCommonParams } from "../../../Utils/helper";

import { useGetEmployeeQuery } from "../../../redux/services/EmployeeMasterService";
import Select from "react-select";
import { useDispatch } from "react-redux";
import moment from "moment";
import { common } from "../../../Utils/DropdownData";
const Form = () => {
  const today = new Date();

  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [joinedDate, setJoinedDate] = useState(null);
  const [lastWorkingDate, setLastWorkingDate] = useState(null);
  const [aadharNo, setAdadharNo] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [joinAgain, setJoinAgain] = useState("");
  const [designation, setDesignation] = useState(""); 
  const [docId, setDocId] = useState("New");
  console.log(docId, "docId");

  const [date, setDate] = useState(moment.utc(today).format("YYYY-MM-DD"));

  const [department, setDepartment] = useState("");
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

  const { branchId, companyId,finYearId } = params;
  const designationRef = useRef(null);

  const { data: allData } = useGetEmployeeResignQuery({
    params,
    searchParams: searchValue,
  });
  console.log(allData, "allData");

  const { data: employee } = useGetEmployeeQuery({ params });
  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetEmployeeResignByIdQuery(id, { skip: !id });

  const [addData] = useAddEmployeeResignMutation();
  const [updateData] = useUpdateEmployeeResignMutation();
  const [removeData] = useDeleteEmployeeResignMutation();

  const syncFormWithDb = useCallback(
    (data) => {
      setEmployeeId(data?.employeeId);
      setEmployeeName(data?.Employee?.firstName);
      setDocId(data?.docId || 'New');
      setDate(
        data?.date ? new Date(data?.date).toISOString().split("T")[0] : null
      );

      setJoinedDate(
        data?.Employee?.joiningDate
          ? new Date(data?.Employee?.joiningDate).toISOString().split("T")[0]
          : null
      );
      setLastWorkingDate(
        data?.lastWorkingDate
          ? new Date(data?.lastWorkingDate).toISOString().split("T")[0]
          : null
      );
      setJoinAgain(data?.joinAgain || "");
      setLeaveReason(data?.leaveReason || "");
      setRemarks(data?.remarks || "");
      setDesignation(data?.Employee?.designation?.name);
      setDepartment(data?.Employee?.department?.name);
      setAdadharNo(data?.Employee?.aadharNo || "");
      setMobileNumber(data?.Employee?.mobileNumber || "");
      childRecord.current = data?.childRecord ? data?.childRecord : 0;
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    employeeId,
    finYearId,
    date,
    docId,
    lastWorkingDate,
    joinAgain,
    leaveReason,
    remarks,
    companyId,
    id,
    branchId,
  };

  const validateData = (data) => {
    if (
      data?.employeeId &&
      data?.lastWorkingDate &&
      data?.joinAgain &&
      data?.leaveReason
    ) {
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
    setDate(moment.utc(today).format("YYYY-MM-DD"));
    setEmployeeId("");
    setEmployeeName("");
    setAdadharNo("");
    setMobileNumber("");
    setDepartment("");
    setDesignation("");
    setJoinedDate("");
    setDepartment("");
    setDesignation("");
    setReadOnly(false);
    setLastWorkingDate("");
    setJoinAgain("");
    setLeaveReason("");
    setRemarks("");
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
      header: "LAST WORKING DATE",
      accessor: (item) =>
        item?.lastWorkingDate
          ? new Date(item?.lastWorkingDate).toISOString().split("T")[0]
          : null,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-48",
    },
  ];
  console.log(employee?.data, "employee?.data?");

  const EmployeeOptions = employee?.data?.map((val) => ({
    value: val?.id,
    label: val?.idNumber,
    firstName: val?.firstName,
    joiningDate: val?.joiningDate,
    designation: val?.designation,
    department: val?.department,
    aadharNo: val?.aadharNo,
    mobileNumber: val?.mobileNumber,
  }));

  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">
        {form === true ? (
          <div className="w-full bg-gray-100 mx-auto rounded-md shadow-md px-2 overflow-auto py-1 ">
            <div className="flex justify-between items-center mb-1">
              <h1 className="master-header">Employee Resignation Entry</h1>
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
                <div className="border border-slate-200 p-2 h-[50vh] overflow-y-auto bg-white rounded-md shadow-sm col-span-1">
                  <div className="space-y-4 ">
                    <h2 className="font-medium text-slate-700 mb-2">
                      Basic Details
                    </h2>
                    <div className="flex flex-wrap gap-x-8 mt-5 gap-y-4">
                      <div className="">
                        <TextInput
                          name="Doc Id"
                          type="text"
                          value={docId}
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
                          ref={payref}
                          inputClass={"pt-1"}
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
                            setDesignation(selected?.designation?.name || "");
                            setDepartment(selected?.department?.name);
                            setAdadharNo(selected?.aadharNo || "");
                            setMobileNumber(selected?.mobileNumber || "");
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
                          // setValue={setJoinedDate}
                          // required={true}
                          readOnly={readOnly}
                          disabled={childRecord.current > 0}
                          inputClass={"pt-1"}
                        />
                      </div>
                      <div className="w-30">
                        <TextInput
                          name="Aadhar No"
                          type="text"
                          value={aadharNo}
                          readOnly={readOnly}
                          disabled={childRecord.current > 0}
                        />
                      </div>
                      <TextInput
                        name="Mobile Number"
                        type="text"
                        value={mobileNumber}
                        readOnly={readOnly}
                        disabled={childRecord.current > 0}
                      />
                      <div className="w-52">
                        <TextInput
                          name="DepartMent"
                          type="text"
                          value={department}
                          // setValue={setDepartment}
                          // required={true}
                          readOnly={readOnly}
                          disabled={childRecord.current > 0}
                        />
                      </div>
                      <div className="w-52">
                      <TextInput
                        name="Designation"
                        type="text"
                        value={designation}
                        // setValue={setDesignation}
                        // required={true}
                        readOnly={readOnly}
                        disabled={childRecord.current > 0}
                      /></div>
                      <div className="w-28">
                        <DateInput
                          name="Last Working Day"
                          type="date"
                          value={lastWorkingDate}
                          setValue={setLastWorkingDate}
                          required={true}
                          readOnly={readOnly}
                          disabled={childRecord.current > 0}
                          inputClass={"pt-1"}
                        />
                      </div>
                      <div className="flex flex-col space-y-1 w-fit">
                        <label className="block text-xs font-semibold text-slate-700 ">
                          Can Join Again
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          disabled={readOnly || childRecord.current > 0}
                          className={`w-[100px] px-1 py-0.5 text-xs text-[12px] h-[30px] border border-gray-300 rounded-lg
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-150 shadow-sm
    ${
      readOnly || childRecord.current > 0
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "bg-white text-gray-900 hover:border-gray-400"
    }
   `}
                          value={joinAgain}
                          onChange={(e) => {
                            setJoinAgain(e.target.value);
                          }}
                        >
                          <option>Select</option>
                          {common.map((blend) => (
                            <option value={blend.value} key={blend.value}>
                              {blend?.show}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-72">
                        <TextArea
                          name="Reason for Leaving"
                          type="text"
                          readOnly={readOnly}
                          disabled={childRecord.current > 0}
                          value={leaveReason}
                          setValue={setLeaveReason}
                          required={true}
                        />
                      </div>
                      <div className="w-[210px]">
                        <TextArea
                          name="Remarks"
                          type="text"
                          readOnly={readOnly}
                          disabled={childRecord.current > 0}
                          value={remarks}
                          setValue={setRemarks}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex bg-white p-1 justify-between  items-center">
              <h1 className="master-header">Employee Resignation Master</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setForm(true);
                    onNew();
                  }}
                  className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                >
                  + Add New Employee Resignation
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
  );
};

export default Form;
