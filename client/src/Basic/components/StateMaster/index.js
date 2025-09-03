import React, { useEffect, useState, useRef, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  useGetStateQuery,
  useGetStateByIdQuery,
  useAddStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
} from "../../../redux/services/StateMasterService";
import { useGetCountriesQuery } from "../../../redux/services/CountryMasterService";

import FormHeader from "../FormHeader";
import FormReport from "../FormReportTemplate";
import { toast } from "react-toastify";
import {
  TextInput,
  CheckBox,
  DropdownInput,
  ToggleButton,
  ReusableTable,
} from "../../../Inputs";
import ReportTemplate from "../ReportTemplate";
import { dropDownListObject } from "../../../Utils/contructObject";
import { useDispatch } from "react-redux";
import Mastertable from "../MasterTable/Mastertable";
import MastersForm from "../MastersForm/MastersForm";
import Modal from "../../../UiComponents/Modal";
import { Check, Power } from "lucide-react";
import Swal from "sweetalert2";

const MODEL = "State Master";

export default function Form() {
  const [form, setForm] = useState(false);
  const [errors, setErrors] = useState({});

  const [openTable, setOpenTable] = useState(false);

  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(true);
  const [country, setCountry] = useState("");
  const [gstNo, setGstNo] = useState("");

  const [searchValue, setSearchValue] = useState("");

  const childRecord = useRef(0);
  const dispatch = useDispatch();

  const params = {
    companyId: secureLocalStorage.getItem(
      sessionStorage.getItem("sessionId") + "userCompanyId"
    ),
  };
  const {
    data: countriesList,
    isLoading: isCountryLoading,
    isFetching: isCountryFetching,
  } = useGetCountriesQuery({ params });

  const {
    data: allData,
    isLoading,
    isFetching,
  } = useGetStateQuery({ params, searchParams: searchValue });

  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetStateByIdQuery(id, { skip: !id });

  const [addData] = useAddStateMutation();
  const [updateData] = useUpdateStateMutation();
  const [removeData] = useDeleteStateMutation();

  const syncFormWithDb = useCallback(
    (data) => {
      setName(data?.name || "");
      setCode(data?.code || "");
      setActive(id ? data?.active ?? false : true);
      setCountry(data?.countryId ? data?.countryId : "");
      setGstNo(data?.gstNo || "");
      childRecord.current = data?.childRecord ? data?.childRecord : 0;
    },
    [id]
  );

  console.log(childRecord.current);

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    name,
    code,
    active,
    country,
    gstNo,
    id,
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
      Swal.fire({
        title: text + "  " + "Successfully",
        icon: "success",
        draggable: true,
        timer: 1000,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      setForm(false);
      dispatch({
        type: `countryMaster/invalidateTags`,
        payload: ["Countries"],
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Submission error',
        text: error.data?.message || 'Something went wrong!',
      });
    }
  };

  const saveData = () => {
    if (!validateData(data)) {
      Swal.fire({
        icon: 'error',
        title: 'Submission error',
        text: 'Please fill all required fields...!',
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

  const deleteData = async (id) => {
    if (id) {
      if (!window.confirm("Are you sure to delete...?")) {
        return;
      }
      try {
        await removeData(id);
        setId("");
        dispatch({
          type: `countryMaster/invalidateTags`,
          payload: ["Countries"],
        });
        Swal.fire({
          title: "Deleted Successfully",
          icon: "success",
          timer: 1000,

        }); setForm(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Submission error',
          text: error.data?.message || 'Something went wrong!',
        });
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
    setActive(true);
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
      header: "State Name",
      accessor: (item) => item?.name,
      //   cellClass: () => "font-medium  text-gray-900",
      className: "font-medium text-gray-900 text-center uppercase w-72",
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
      className: "font-medium text-gray-900 uppercase w-[65%]",
    },
  ];
  const tableHeaders = [
    "S.NO",
    "Code",
    "Name",
    "Country",
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
  ];
  const tableDataNames = [
    "index+1",
    "dataObj.code",
    "dataObj.name",
    "dataObj.country.name",
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
  ];
  console.log(country, "check");

  return (
    <div onKeyDown={handleKeyDown} className="p-1">
      <div className="w-full flex bg-white p-1 justify-between  items-center">
        <h5 className="text-2xl font-bold text-gray-800">State Master</h5>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setForm(true);
              onNew();
            }}
            className="bg-white border  border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white text-sm px-4 py-1 rounded-md shadow transition-colors duration-200 flex items-center gap-2"
          >
            + Add New State
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

      <div>
        {form === true && (
          <Modal
            isOpen={form}
            form={form}
            widthClass={"w-[40%] h-[60%]"}
            onClose={() => {
              setForm(false);
              setErrors({});
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg px-2 py-0.5 font-semibold  text-gray-800">
                    {id
                      ? !readOnly
                        ? "Edit State Master"
                        : "State Master"
                      : "Add New State"}
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
                      <div className="space-y-4 ">
                        <div className="flex">
                          <div className="mb-3 w-[200px]">
                            <TextInput
                              name="State Name"
                              type="text"
                              value={name}
                              setValue={setName}
                              required={true}
                              readOnly={readOnly}
                              disabled={childRecord.current > 0}
                            />
                          </div>
                          <div className="mb-3 ms-3">
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

                        <div className="flex">
                          {/* <div className="mb-3 w-[200px]">
                            <TextInput
                              name="GST No"
                              type="text"
                              value={gstNo}
                              setValue={setGstNo}
                              readOnly={readOnly}
                              disabled={childRecord.current > 0}
                              width={"w-[200px]"}
                            />
                          </div> */}
                          {console.log(country, "countrycehck")}

                          <div className="w-[200px] mb-3 ">
                            <DropdownInput
                              name="Country"
                              options={dropDownListObject(
                                id
                                  ? countriesList?.data
                                  : countriesList?.data?.filter(
                                    (item) => item.active
                                  ),
                                "name",
                                "id"
                              )}
                              value={country}
                              setValue={setCountry}
                              required={true}
                              readOnly={readOnly}
                              className={`w-[150px]`}
                            />


                          </div>
                        </div>


                        <div>
                          <ToggleButton
                            name="Status"
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
}
