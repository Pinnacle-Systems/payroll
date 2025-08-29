import React, { useEffect, useState, useRef, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import { useGetDepartmentQuery } from "../../../redux/services/DepartmentMasterService";

import { toast } from "react-toastify";
import { TextInput, ToggleButton, ReusableTable } from "../../../Inputs";

import Mastertable from "../MasterTable/Mastertable";
import MastersForm from "../MastersForm/MastersForm";
import { statusDropdown } from "../../../Utils/DropdownData";
import Modal from "../../../UiComponents/Modal";
import {
  useAdddesignationMutation,
  useDeletedesignationMutation,
  useGetdesignationByIdQuery,
  useGetdesignationQuery,
  useUpdatedesignationMutation,
} from "../../../redux/services/DesignationMasterService";
import { useGetFinYearQuery } from "../../../redux/services/FinYearMasterService";
import { Check, Power } from "lucide-react";

const PayFrequency = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [payfrequency, setPayfrequency] = useState("");
  const [finYearId, setFinYearId] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const MODEL = "PAY FREQUENCY";
  console.log(form, "form");
  const params = {
    companyId: secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "userCompanyId"
    ),
  };
  const { data: department } = useGetDepartmentQuery({
    params,
    searchParams: searchValue,
  });

  const {
    data: allData,
    isLoading,
    isFetching,
  } = useGetdesignationQuery({ params, searchParams: searchValue });
  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetdesignationByIdQuery(id, { skip: !id });

  const { data: finYear } = useGetFinYearQuery({
    params,
    searchParams: searchValue,
  });

  const [addData] = useAdddesignationMutation();
  const [updateData] = useUpdatedesignationMutation();
  const [removeData] = useDeletedesignationMutation();

  const syncFormWithDb = useCallback(
    (data) => {
      setActive(id ? data?.active ?? false : true);
      setPayfrequency(data?.payId);
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    active,

    id,
    payfrequency,
  };
  const handleFinYearChange = (e) => {
    const selectedId = Number(e.target.value);
    setFinYearId(selectedId);

    const selectedYear = finYear?.data?.find((fin) => fin?.id === selectedId);
    console.log(selectedYear, "selectedYear");
    if (selectedYear) {
      setStartDate(selectedYear?.from?.split("T")[0] ?? "");
      setEndDate(selectedYear?.to?.split("T")[0] ?? "");
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const validateData = (data) => {
    if (data.name && data.code) {
      return true;
    }
    return false;
  };

  const handleSubmitCustom = async (callback, data, text) => {
    try {
      let returnData = await callback(data).unwrap();
      setId(returnData.data.id);
      toast.success(text + "Successfully");
    } catch (error) {
      console.log("handle");
    }
  };

  const saveData = () => {
    if (!validateData(data)) {
      toast.error("Please fill all required fields...!", {
        position: "top-center",
      });
      return;
    }
    if (!window.confirm("Are you sure save the details ...?")) {
      return;
    }
    if (id) {
      handleSubmitCustom(updateData, data, "Updated");
    } else {
      handleSubmitCustom(addData, data, "Added");
    }
  };

  const deleteData = async () => {
    if (id) {
      if (!window.confirm("Are you sure to delete...?")) {
        return;
      }
      try {
        const deldata = await removeData(id).unwrap();
        if (deldata?.statusCode == 1) {
          toast.error(deldata?.message);
          setForm(false);
          return;
        }
        setId("");
        toast.success("Deleted Successfully");
        setForm(false);
      } catch (error) {
        toast.error("something went wrong");
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
    setReadOnly(false);
    setForm(true);
    setSearchValue("");
    setPayfrequency("");
    setActive(true);
    setFinYearId("")
    setStartDate("")
    setEndDate("")
  };

  function onDataClick(id) {
    setId(id);
    setForm(true);
  }
  const handleView = (id) => {
    setId(id);
    setForm(true);
    setReadOnly(true);
    console.log("view");
  };
  const handleEdit = (id) => {
    setId(id);
    setForm(true);
    setReadOnly(false);
    console.log("Edit");
  };
  const ACTIVE = (
    <div className="bg-gradient-to-r from-green-200 to-green-500 inline-flex items-center justify-center rounded-full border-2 w-6 border-green-500 shadow-lg text-white hover:scale-110 transition-transform duration-300">
      <Power size={10} />
    </div>
  );
  const INACTIVE = (
    <div className="bg-gradient-to-r from-red-200 to-red-500 inline-flex items-center justify-center rounded-full border-2 w-6 border-red-500 shadow-lg text-white hover:scale-110 transition-transform duration-300">
      <Power size={10} />
    </div>
  );
  const columns = [
    {
      header: "S.No",
      accessor: (item, index) => index + 1,
      className: "font-medium text-gray-900 w-12  text-center",
    },

    {
      header: "Shift Name",
      accessor: (item) => item?.name,
      //   cellClass: () => "font-medium  text-gray-900",
      className: "font-medium text-gray-900 text-center uppercase w-32",
    },

    {
      header: "Status",
      accessor: (item) => (item.active ? ACTIVE : INACTIVE),
      //   cellClass: () => "font-medium text-gray-900",
      className: "font-medium text-gray-900 text-center uppercase w-16",
    },
    {
      header: "",
      accessor: (item) => "",
      //   cellClass: () => "font-medium text-gray-900",
      className: "font-medium text-gray-900 uppercase w-[75%]",
    },
  ];
  // const tableHeaders = [
  //   "S.NO",
  //   "Code",
  //   "Name",
  //   "Status",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  // ];
  // const tableDataNames = [
  //   "index+1",
  //   "dataObj.code",
  //   "dataObj.name",
  //   "dataObj.active ? ACTIVE : INACTIVE",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  //   " ",
  // ];
  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            PayFrequency Master
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setForm(true);
                onNew();
              }}
              className="bg-white border  border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white text-sm px-4 py-1 rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              + Add New PayFrequency
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
            widthClass={"w-[55%]  h-[70%]"}
            onClose={() => {
              setForm(false);
              setErrors({});
            }}
          >
            <div className="h-full flex flex-col bg-[f1f1f0]">
              <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg px-2 py-0.5 font-semibold  text-gray-800">
                    {id
                      ? !readOnly
                        ? "Edit PayFrequency Master"
                        : "PayFrequency Master"
                      : "Add New PayFrequency"}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <div>
                    {readOnly && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm(false);
                          setSearchValue("");
                          setId(false);
                        }}
                        className="px-3 py-1 text-red-600 hover:bg-red-600 hover:text-white border border-red-600 text-xs rounded"
                      >
                        Cancel
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
                      <div className="space-y-4  w-[90%]">
                        <div className="flex gap-x-12">
                          <label className="block text-xs text-black mb-1">
                            Choose Finyear
                            <span className="text-red-500">*</span>
                            <select
                              value={finYearId}
                              onChange={handleFinYearChange}
                              required
                              className="w-full border p-1 rounded"
                            >
                              <option value="">-- Select Finyear --</option>

                              {finYear?.data?.map((fin) => (
                                <option key={fin?.id} value={fin?.id}>
                                  {fin?.code}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="text-xs text-black mb-1">
                            Start Date
                            <input
                              type="date"
                              value={startDate}
                              readOnly
                              className="block border p-1 rounded"
                            />{" "}
                          </label>

                          <label className=" text-xs text-black mb-1">
                            End Date
                            <input
                              type="date"
                              value={endDate}
                              readOnly
                              className="block border p-1 rounded"
                            />{" "}
                          </label>
                        </div>

                        {/* <div>
                            <label className="block text-xs text-black mb-1">
                              Pay Frequency{" "}
                              <span className="text-red-500">*</span>
                              <select
                                value={payfrequency}
                                onChange={(e) =>
                                  setPayfrequency(e.target.value)
                                }
                                required
                                className="w-full border p-1 rounded"
                              >
                                <option value="">
                                  -- Select Pay Frequency --
                                </option>
                                <option value="biWeekly">Biweekly</option>
                                <option value="weekly">Weekly</option>
                                <option value="semiWeekly">Semi Weekly</option>
                                <option value="semiMonthly">
                                  Semi Monthly
                                </option>

                                <option value="monthly">Monthly</option>
                              </select>
                            </label>
                          </div> */}
                        <div className="mb-3">
                          <ToggleButton
                            name="Status"
                            options={statusDropdown}
                            value={active}
                            setActive={setActive}
                            required={true}
                            readOnly={readOnly}
                          />
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

export default PayFrequency;
