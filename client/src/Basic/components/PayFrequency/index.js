import React, { useEffect, useState, useRef, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import { useGetDepartmentQuery } from "../../../redux/services/DepartmentMasterService";

import { toast } from "react-toastify";
import { TextInput, ToggleButton, Modal } from "../../../Inputs";

import Mastertable from "../MasterTable/Mastertable";
import MastersForm from "../MastersForm/MastersForm";
import { statusDropdown } from "../../../Utils/DropdownData";

import {
  useAdddesignationMutation,
  useDeletedesignationMutation,
  useGetdesignationByIdQuery,
  useGetdesignationQuery,
  useUpdatedesignationMutation,
} from "../../../redux/services/DesignationMasterService";

const PayFrequency = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [payfrequency, setPayfrequency] = useState("");


  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
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

  const [addData] = useAdddesignationMutation();
  const [updateData] = useUpdatedesignationMutation();
  const [removeData] = useDeletedesignationMutation();

  const syncFormWithDb = useCallback(
    (data) => {
      if (!id) {
        setReadOnly(false);

        
        setActive(id ? data?.active ?? true : false);
      } else {
        setReadOnly(true);

        setActive(id ? data?.active ?? false : true);
        setPayfrequency(data?.payId);
      }
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
  };

  function onDataClick(id) {
    setId(id);
    setForm(true);
  }

  const tableHeaders = [
    "S.NO",
    "Code",
    "Name",
    "Status",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
  ];
  const tableDataNames = [
    "index+1",
    "dataObj.code",
    "dataObj.name",
    "dataObj.active ? ACTIVE : INACTIVE",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
  ];
  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="text-2xl font-bold text-gray-800">PayFrequency Master</h1>
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
        <div className="w-full flex items-start">
          <Mastertable
            header={"PayFrequency list"}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onDataClick={onDataClick}
            // setOpenTable={setOpenTable}
            tableHeaders={tableHeaders}
            tableDataNames={tableDataNames}
            // data={allData?.data}
            loading={isLoading || isFetching}
            setReadOnly={setReadOnly}
          />
        </div>
        {form === true && (
          <Modal
            isOpen={form}
            form={form}
            widthClass={"w-[55%]  h-[40%]"}
            onClose={() => {
              setForm(false);
              setErrors({});
            }}
          >
            <MastersForm
              onNew={onNew}
              onClose={() => {
                setForm(false);
                setSearchValue("");
                setId(false);
              }}
              model={MODEL}
              childRecord={childRecord.current}
              saveData={saveData}
              setReadOnly={setReadOnly}
              deleteData={deleteData}
              readOnly={readOnly}
              emptyErrors={() => setErrors({})}
            >
              <fieldset className=" rounded mt-2">
                <div className="">
                  <div className="flex flex-wrap">
                    <label className="block text-xs text-black mb-1">
                      Pay Frequency <span className="text-red-500">*</span>
                      <select
                        value={payfrequency}
                        onChange={(e) => setPayfrequency(e.target.value)}
                        required
                        className="w-full border p-1 rounded"
                      >
                        <option value="">-- Select Pay Frequency --</option>
                        <option value="biWeekly">Biweekly</option>
                        <option value="weekly">Weekly</option>
                        <option value="semiWeekly">Semi Weekly</option>
                        <option value="semiMonthly">Semi Monthly</option>

                        <option value="monthly">Monthly</option>
                      </select>
                    </label>

                 
                  </div>
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
              </fieldset>
            </MastersForm>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PayFrequency;
