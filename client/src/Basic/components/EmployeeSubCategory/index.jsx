import { useCallback, useEffect, useRef, useState } from "react";
import { useGetEmployeeCategoryQuery } from "../../../redux/services/EmployeeCategoryMasterService";
import { getCommonParams } from "../../../Utils/helper";
import {
  useAddemployeeSubCategoryMutation,
  useDeleteemployeeSubCategoryMutation,
  useGetemployeeSubCategoryByIdQuery,
  useGetemployeeSubCategoryQuery,
  useUpdateemployeeSubCategoryMutation,
} from "../../../redux/services/EmployeeSubCategoryservice";
import Select from "react-select";

import Modal from "../../../UiComponents/Modal";
import { Check, Power } from "lucide-react";
import {
  TextInput,
  ToggleButton,
  ReusableTable,
  customSelectStyles,
} from "../../../Inputs";
import { statusDropdown } from "../../../Utils/DropdownData";
import Swal from "sweetalert2";
import Loader from "../Loader";

const EmployeeSubCategory = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");

  const [gradeName, setGradeName] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const [employeeCategoryId, setEmployeeCategoryId] = useState("");
  const params = getCommonParams();
  const employeeRef = useRef(null);

  const { branchId, companyId } = params;

 
  const { data: allData ,isLoading,
    isFetching, } = useGetemployeeSubCategoryQuery({
    params,
    searchParams: searchValue,
  });
  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetemployeeSubCategoryByIdQuery(id, { skip: !id });

  const { data: employeeCategory } = useGetEmployeeCategoryQuery({ params });

  const [addData] = useAddemployeeSubCategoryMutation();
  const [updateData] = useUpdateemployeeSubCategoryMutation();
  const [removeData] = useDeleteemployeeSubCategoryMutation();

  const syncFormWithDb = useCallback(
    (data) => {
      setGradeName(data?.gradeName || "");
      setEmployeeCategoryId(data?.employeeCategoryId || "");
      setActive(id ? data?.active ?? false : true);
      childRecord.current = data?.childRecord ? data?.childRecord : 0;
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    gradeName,
    employeeCategoryId,
    active,
    companyId,
    id,
    branchId,
  };

  // const validateData = (data) => {
  //   if (data?.gradeName && data?.employeeCategoryId) {
  //     return true;
  //   }
  //   return false;
  // };
   const validateData = (data) => {
      if (!data?.employeeCategoryId &&  !data?.gradeName ) {
        Swal.fire({
          icon: "error",
          title: "Submission error",
          text: "Please fill all required fields...!",
        });
        return false;
      }
      const isDuplicate = allData?.data?.some(
        (item) => item?.gradeName  === data?.gradeName &&  item?.employeeCategoryId === data?.employeeCategoryId && item?.id !== data?.id
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
    }
  useEffect(() => {
    if (form && !readOnly && employeeRef.current) {
      employeeRef.current.focus();
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
    setEmployeeCategoryId("");
    setGradeName("");
    setReadOnly(false);
    setActive(true);
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
      className: " text-gray-900 w-12  text-center",
    },

    {
      header: "Employee Category Name",
      accessor: (item) => item?.employeeCategory?.name,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-72",
    },
    {
      header: "Grade Name",
      accessor: (item) => item?.gradeName,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-44",
    },

    {
      header: "Status",
      accessor: (item) => (item.active ? ACTIVE : INACTIVE),
      //   cellClass: () => " text-gray-900",
      className: " text-gray-900 text-center uppercase w-36",
    },
  ];
  const EmployeeOptions = employeeCategory?.data?.map((val) => ({
    value: val?.id,
    label: val?.name,
  }));

      if (isLoading || isFetching) return <Loader />;

  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="master-header">
            Employee Sub Category Master
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setForm(true);
                onNew();
              }}
              className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              + Add New Employee Sub Category
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
            widthClass={"w-[40%]  h-[55%]"}
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
                    Employee Sub Category Master
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

              <div className="flex-1  p-3">
                <div className="grid grid-cols-1  gap-3  h-full">
                  <div className="lg:col-span- space-y-3">
                    <div className="bg-white p-3 rounded-md border border-gray-200 h-full">
                      <div className="space-y-4 ">
                        <div className="flex gap-x-8">
                          <div className="w-52">
                            <label className="block text-xs  font-bold text-slate-700 mb-1">
                              Employee Category
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              options={EmployeeOptions}
                              value={
                                EmployeeOptions.find(
                                  (opt) => opt.value === employeeCategoryId
                                ) || null
                              }
                              onChange={(selected) =>
                                setEmployeeCategoryId(selected?.value || "")
                              }
                              placeholder="Select Employee Category"
                              isClearable={false} // same as required
                              isDisabled={readOnly || childRecord.current > 0}
                              isSearchable
                              menuShouldScrollIntoView={false}
                              maxMenuHeight={150} // <-- Reduce height here
                              onInputChange={(value) => value.toUpperCase()}
                              className="w-full px-1 text-[12px] text-black -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                              styles={customSelectStyles}
                            />
                          </div>

                          <div className="w-42">
                            <TextInput
                              name="Grade Name"
                              type="text"
                              value={gradeName}
                              setValue={setGradeName}
                              required={true}
                              readOnly={readOnly}
                              disabled={childRecord.current > 0}
                            />
                          </div>
                        </div>
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

export default EmployeeSubCategory;
