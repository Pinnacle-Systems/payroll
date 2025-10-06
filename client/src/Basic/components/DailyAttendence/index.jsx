import { useEffect, useState, useRef } from "react";

import { ReusableTable, DateInput, customSelectStyles } from "../../../Inputs";
import Select from "react-select";
import { useGetEmployeeCategoryQuery } from "../../../redux/services/EmployeeCategoryMasterService";
import { useLazyGetAttendenceGenerationQuery } from "../../../redux/services/AttenedenceGeneration";
import Modal from "../../../UiComponents/Modal";
import { GroupBy } from "../../../Utils/DropdownData";
import { getCommonParams } from "../../../Utils/helper";
import Swal from "sweetalert2";
import moment from "moment-timezone";
const Form = () => {
  const [date, setDate] = useState("");
  const [employeeCategoryId, setEmployeeCategoryId] = useState("");

  const [form, setForm] = useState(true);
  const childRecord = useRef(0);
  const params = getCommonParams();
  const [groupBy, setGroupBy] = useState("");
  const designationRef = useRef(null);

  const [triggerReport, { data: allData, isFetching }] =
    useLazyGetAttendenceGenerationQuery();
  const { data: employeeCategory } = useGetEmployeeCategoryQuery({ params });

  useEffect(() => {
    if (form && designationRef.current) {
      designationRef.current.focus();
    }
  }, [form]);

  const handleKeyDown = (event) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === "s") {
      event.preventDefault();
    }
  };

  console.log(allData);
  const columns = [
    {
      header: "S.No",
      accessor: (item, index) => index + 1,
      className: " text-gray-900 w-4  text-center",
    },
    {
      header: "UID",
      accessor: (item) => item?.uid,
      className: " text-gray-900 w-4  text-center",
    },

    // {
    //   header: "ID Card",
    //   accessor: (item) => item?.Employee?.idNumber,
    //   //   cellClass: () => "  text-gray-900",
    //   className: " text-gray-900 text-left pl-2 uppercase w-30",
    // },

    // {
    //   header: "EMP Name",
    //   accessor: (item) => item?.Employee?.firstName,
    //   //   cellClass: () => " text-gray-900",
    //   className: " text-gray-900 text-left pl-2 uppercase w-36",
    // },
    // {
    //   header: "EMP Category",
    //   accessor: (item) => item?.Employee?.EmployeeCategory?.name,
    //   //   cellClass: () => " text-gray-900",
    //   className: " text-gray-900 text-left pl-2 uppercase w-40",
    // },
    // {
    //   header: "Department",
    //   accessor: (item) => item?.Employee?.department?.name,
    //   className: " text-gray-900 text-left pl-2 uppercase w-40",
    // },
    // {
    //   header: "Designation",
    //   accessor: (item) => item?.Employee?.designation?.name,
    //   className: " text-gray-900 text-left pl-2 uppercase w-40",
    // },
    // // {
    // //   header: "Shift",
    // //   accessor: (item) => item?.Employee?.shiftCommonTemplate?.name,
    // //   className: " text-gray-900 text-left pl-2 uppercase w-40",
    // // },

    // {
    //   header: "In Date",
    //   accessor: (item) =>
    //     item.inDate ? new Date(item.inDate).toLocaleDateString() : "-",
    //   className: " text-gray-900 text-left pl-2 uppercase w-30",
    // },
    // {
    //   header: "In Time",
    //   accessor: (item) =>
    //     item.inTime ? new Date(item.inTime).toLocaleTimeString() : "-",
    //   className: " text-gray-900 text-left pl-2 uppercase w-30",
    // },
    // {
    //   header: "Out Date",
    //   accessor: (item) =>
    //     item.outDate ? new Date(item.outDate).toLocaleDateString() : "-",
    //   className: " text-gray-900 text-left pl-2 uppercase w-30",
    // },
    // {
    //   header: "Out Time",
    //   accessor: (item) =>
    //     item.outTime ? new Date(item.outTime).toLocaleTimeString() : "-",
    //   className: " text-gray-900 text-left pl-2 uppercase w-30",
    // },
    {
      header: "In Date",
      accessor: (item) =>
        item.inTime ? moment.utc(item.inTime).format("YYYY-MM-DD") : "-",
      className: " text-gray-900   text-center",
    },
    {
      header: "In Time",
      accessor: (item) =>
        item.inTime ? moment.utc(item.inTime).format("HH:mm:ss") : "-",
      className: " text-gray-900 w-8  text-center",
    },
    {
      header: "Morning Break Out",
      accessor: (item) =>
        item.firstBreakOut
          ? moment.utc(item.firstBreakOut).format("HH:mm:ss")
          : "-",
      className: " text-gray-900 w-32 text-center",
    },
    {
      header: "Morning Break In",
      accessor: (item) =>
        item.firstBreakIn
          ? moment.utc(item.firstBreakIn).format("HH:mm:ss")
          : "-",
      className: " text-gray-900  text-center",
    },
    {
      header: "Evening Break Out",
      accessor: (item) =>
        item.eveningBreakOut
          ? moment.utc(item.eveningBreakOut).format("HH:mm:ss")
          : "-",
      className: " text-gray-900  text-center",
    },
    {
      header: "Evening Break In",
      accessor: (item) =>
        item.eveningBreakIn
          ? moment.utc(item.eveningBreakIn).format("HH:mm:ss")
          : "-",
      className: " text-gray-900  text-center",
    },

    {
      header: "Out Date",
      accessor: (item) =>
        item.outTime ? moment.utc(item.outTime).format("YYYY-MM-DD") : "-",
      className: " text-gray-900  text-center",
    },
    {
      header: "Out Time",
      accessor: (item) =>
        item.outTime ? moment.utc(item.outTime).format("HH:mm:ss") : "-",
      className: " text-gray-900  text-center",
    },
  ];
  const EmployeeOptions = employeeCategory?.data?.map((val) => ({
    value: val?.id,
    label: val?.name,
  }));
  const OnNew = () => {
    setDate("");
    setEmployeeCategoryId("");
    setGroupBy("");
  };
  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">
        <div className="w-full flex bg-white p-1 justify-between  items-center">
          <h1 className="master-header">Attendence Generation</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setForm(true);
                OnNew();
              }}
              className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
            >
              + Generate
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-3">
          <ReusableTable
            columns={columns}
            data={allData?.data}
            itemsPerPage={10}
            rowActions={false}
          />
        </div>
        {form === true && (
          <Modal
            isOpen={form}
            form={form}
            widthClass={"w-[30%]  h-[55%]"}
            onClose={() => {
              setForm(false);
            }}
          >
            <div className="h-full flex flex-col bg-gray-100">
              <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10 bg-white">
                <div className="flex items-center gap-2">
                  <h2 className=" -ml-2   py-0.5 master-header-modal">
                    ATTENDENCE GENERATION
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-3">
                <div className="grid grid-cols-1  gap-3  h-full">
                  <div className="lg:col-span- space-y-3">
                    <div className="bg-white p-3 rounded-md border border-gray-200 h-full">
                      <div className="space-y-4 ">
                        <div className="flex flex-wrap gap-x-7">
                          <div className="mb-3 ">
                            <DateInput
                              name="DOC Date"
                              value={date}
                              setValue={setDate}
                              required={true}
                              disabled={childRecord.current > 0}
                              ref={designationRef}
                            />
                          </div>
                          {console.log(date, "sendDate")}
                          {/* <div className="w-52">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Employee Category
                              <span className="text-red-500">*</span>
                            </label>
                            <Select
                              options={EmployeeOptions}
                              value={
                                EmployeeOptions?.find(
                                  (opt) => opt.value === employeeCategoryId
                                ) || null
                              }
                              onChange={(selected) =>
                                setEmployeeCategoryId(selected?.value || "")
                              }
                              placeholder="Select Employee Category"
                              isClearable={false} // same as required
                              isSearchable
                              menuShouldScrollIntoView={false}
                              maxMenuHeight={150} // <-- Reduce height here
                              onInputChange={(value) => value.toUpperCase()}
                              className="w-full px-1 text-[12px] text-black -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                              styles={customSelectStyles}
                            />
                          </div> */}
                          {/* <div className="mb-3">
                            {" "}
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              {" "}
                              Group By{" "}
                            </label>{" "}
                            <select
                              value={groupBy}
                              className="w-full px-1 py-0.5 text-xs text-[12px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 shadow-sm"
                              onChange={(e) => setGroupBy(e.target.value)}
                            >
                              {" "}
                              <option value="">Select</option>{" "}
                              {GroupBy?.map((val, index) => (
                                <option key={index} value={val?.value}>
                                  {" "}
                                  {val?.show}{" "}
                                </option>
                              ))}{" "}
                            </select>{" "}
                          </div> */}
                          <div>
                            <button
                              onClick={() => {
                                if (!date) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Submission error",
                                    text: "Please fill all required fields...!",
                                  });
                                  return;
                                }

                                triggerReport({
                                  searchParams: {
                                    date,
                                  },
                                });

                                setForm(false);
                              }}
                              className="px-3 py-1.5 font-sans hover:bg-green-600 h-6 mt-5 hover:text-white rounded text-green-600 
                          border border-green-600 flex items-center gap-1 text-xs"
                              type="button"
                            >
                              Generate Report
                            </button>
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

export default Form;
