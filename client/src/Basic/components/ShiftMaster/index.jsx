import React, { useEffect, useState, useRef, useCallback } from "react";

import { TextInput, ToggleButton, ReusableTable } from "../../../Inputs";

import { statusDropdown } from "../../../Utils/DropdownData";

import Modal from "../../../UiComponents/Modal";
import { Check, Power } from "lucide-react";
import {
  useAddshiftMasterMutation,
  useDeleteshiftMasterMutation,
  useGetshiftMasterByIdQuery,
  useGetshiftMasterQuery,
  useUpdateshiftMasterMutation,
} from "../../../redux/services/ShiftMasterService";
import { getCommonParams } from "../../../Utils/helper";
import Swal from "sweetalert2";

const ShiftMaster = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [docId, setDocId] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const shiftRef = useRef(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const params = getCommonParams();

  const { branchId, companyId } = params;

  const {
    data: allData,
    isLoading,
    isFetching,
  } = useGetshiftMasterQuery({ params, searchParams: searchValue });
  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetshiftMasterByIdQuery(id, { skip: !id });

  useEffect(() => {
    if (form && !readOnly && shiftRef.current) {
      shiftRef.current.focus();
    }
  }, [form, readOnly]);

  const [addData] = useAddshiftMasterMutation();
  const [updateData] = useUpdateshiftMasterMutation();
  const [removeData] = useDeleteshiftMasterMutation();

  const syncFormWithDb = useCallback(
    (data) => {
      setName(data?.name || "");
      setDocId(data?.docId || "");
      setDescription(data?.description || "");
      setActive(id ? data?.active ?? false : true);
      setFrom(data?.from || "");
      setTo(data?.to || "");
      childRecord.current = data?.childRecord ? data?.childRecord : 0;
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    name,
    description,
    docId,
    from,
    to,
    active,
    companyId,
    id,
    branchId,
  };

  const validateData = (data) => {
    if (!data?.name) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Please fill all required fields...!",
      });
      return false;
    }
    const isDuplicate = allData?.data?.some(
      (item) => item?.name === data?.name && item?.id !== data?.id
    );

    console.log(isDuplicate, "isDuplicate");

    if (isDuplicate) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Duplicate Value Found... !",
      });
      return false;
    }

    return true;
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
        },
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
    setReadOnly(false);
    setForm(true);
    setActive(true);
    setFrom("");
    setTo("");
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
  const getNextDocId = useCallback(() => {
    if (id) return;
    if (allData?.nextDocId) {
      setDocId(allData?.nextDocId);
    }
  }, [allData, id]);

  useEffect(getNextDocId, [getNextDocId]);
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
      className: "text-gray-900 w-12  text-center",
    },

    {
      header: "Shift Name",
      accessor: (item) => item?.name,
      //   cellClass: () => " text-gray-900",
      className: "text-gray-900 text-left pl-2 uppercase w-60",
    },

    {
      header: "Status",
      accessor: (item) => (item.active ? ACTIVE : INACTIVE),
      //   cellClass: () => "text-gray-900",
      className: "text-gray-900 text-center uppercase w-16",
    },
  ];

  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="master-header">Template Master</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setForm(true);
                onNew();
              }}
              className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              + Add New Template
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
            widthClass={"w-[55%]  h-[45%]"}
            onClose={() => {
              setForm(false);
              setErrors({});
              setId("");
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center gap-2">
                  <h2 className=" -ml-2   py-0.5 master-header-modal">
                    Template Master
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
                      <div className="space-y-4">
                        <div className="flex gap-x-6">
                          {/* <TextInput
                          name="Company Code"
                          type="text"
                          value={companyCode}
                          setValue={setCompanyCode}
                          required={true}
                          // readOnly={readOnly}
                          disabled={true}
                        /> */}

                          <div className="w-42">
                            <TextInput
                              name="Template Code"
                              type="text"
                              value={docId}
                              // setValue={setDocId}
                              required={true}
                              readOnly={readOnly}
                              disabled={
                                childRecord.current > 0 ? true : undefined
                              }
                            />
                          </div>

                          <TextInput
                            name="Template Name"
                            type="text"
                            value={name}
                            setValue={setName}
                            required={true}
                            readOnly={readOnly}
                            disabled={
                              childRecord.current > 0 ? true : undefined
                            }
                            ref={shiftRef}
                          />
                          <div className="w-20">
                            <TextInput
                              name="From"
                              type="text"
                              value={from}
                              setValue={setFrom}
                              // required={true}
                              readOnly={readOnly}
                              disabled={
                                childRecord.current > 0 ? true : undefined
                              }
                            />
                          </div>
                          <div className="w-20">
                            <TextInput
                              name="To"
                              type="text"
                              value={to}
                              setValue={setTo}
                              // required={true}
                              readOnly={readOnly}
                              disabled={
                                childRecord.current > 0 ? true : undefined
                              }
                            />
                          </div>
                        </div>

                        <div className="flex gap-x-6"></div>
                        <div className="mt-5">
                          <ToggleButton
                            name="Status"
                            options={statusDropdown}
                            value={active}
                            setActive={setActive}
                            required={true}
                            readOnly={readOnly}
                          />
                        </div>
                        {/* <input type="time"/> */}
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

export default ShiftMaster;
