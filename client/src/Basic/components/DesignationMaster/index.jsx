import React, { useEffect, useState, useRef, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  useGetDepartmentQuery,
 
} from "../../../redux/services/DepartmentMasterService";
import FormHeader from "../FormHeader";
import FormReport from "../FormReportTemplate";
import { toast } from "react-toastify";
import { TextInput, CheckBox, ToggleButton, Modal } from "../../../Inputs";
import ReportTemplate from "../ReportTemplate";
import Mastertable from "../MasterTable/Mastertable";
import MastersForm from "../MastersForm/MastersForm";
import { statusDropdown } from "../../../Utils/DropdownData";
import { useAdddesignMutation, useGetdesignByIdQuery, useGetdesignQuery, useUpdatedesignMutation } from "../../../redux/uniformService/DesignMasterServices";
import { useAdddesignationMutation, useDeletedesignationMutation, useGetdesignationByIdQuery, useGetdesignationQuery, useUpdatedesignationMutation } from "../../../redux/services/DesignationMasterService";

const Designation = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const MODEL = "DESIGNATION";
  console.log(form, "form");
  const params = {
    companyId: secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "userCompanyId"
    ),
  };
  const {
    data: department,
  
  } = useGetDepartmentQuery({ params, searchParams: searchValue });

  const {
    data:allData,isLoading,
    isFetching,
  } = useGetdesignationQuery({ params, searchParams: searchValue })
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
        setName("");
        setCode("");
        setActive(id ? data?.active ?? true : false);
      } else {
        setReadOnly(true);
        setName(data?.name || "");
        setCode(data?.code || "");
        setActive(id ? data?.active ?? false : true);
        setDepartmentId(data?.departmentId)
      }
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    name,
    code,
    active,
    companyId: secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "userCompanyId"
    ),
    id,
    departmentId
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
    setDepartmentId("")
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
          <h1 className="text-2xl font-bold text-gray-800">Designation Master</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setForm(true);
                onNew();
              }}
     className="bg-white border  border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white text-sm px-4 py-1 rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              +Add New Designation
            </button>
          </div>
        </div>
        <div className="w-full flex items-start">
          <Mastertable
            header={"Designation list"}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onDataClick={onDataClick}
            // setOpenTable={setOpenTable}
            tableHeaders={tableHeaders}
            tableDataNames={tableDataNames}
            data={allData?.data}
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
                      Department <span className="text-red-500">*</span>
                      <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        required
                        className="w-full border p-1 rounded"
                      >
                        <option value="">-- Select Department --</option>
                        {department?.data?.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="mb-3 ml-5 w-[32%]">
                      <TextInput
                        name="Designation Name"
                        type="text"
                        value={name}
                        setValue={setName}
                        required={true}
                        readOnly={readOnly}
                        disabled={childRecord.current > 0}
                      />
                    </div>
                      <div className="mb-3 w-[20%] ml-6">
                      <TextInput
                        name="Code"
                        type="text"
                        value={code}
                        setValue={setCode}
                        required={true}
                        readOnly={readOnly}
                        disabled={childRecord.current > 0}
                      />
                    </div>
                  
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

export default Designation;
