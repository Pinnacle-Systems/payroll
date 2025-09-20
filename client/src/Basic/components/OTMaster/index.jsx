import { useEffect, useState, useRef, useCallback } from "react";

import { ReusableTable } from "../../../Inputs";

import { getCommonParams } from "../../../Utils/helper";
import {
  useAddOTMasterMutation,
  useDeleteOTMasterMutation,
  useGetOTMasterByIdQuery,
  useGetOTMasterQuery,
  useUpdateOTMasterMutation,
} from "../../../redux/services/OTMaster.service";

import TemplateItems from "./templateItems";
import Swal from "sweetalert2";

import moment from "moment";
import { useDispatch } from "react-redux";

const OTMaster = () => {
  const today = new Date();
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");

  const [docId, setDocId] = useState("");

  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const [oTDetails, setOTDetails] = useState([]);
  const [date, setDate] = useState(moment.utc(today).format("YYYY-MM-DD"));

  const params = getCommonParams();

  const { branchId, companyId } = params;

  const { data: allData, refetch } = useGetOTMasterQuery({
    params,
    searchParams: searchValue,
  });

  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetOTMasterByIdQuery(id, { skip: !id });

  const [addData] = useAddOTMasterMutation();
  const [updateData] = useUpdateOTMasterMutation();
  const [removeData] = useDeleteOTMasterMutation();

  useEffect(() => {
    if (oTDetails?.length >= 1) return;
    setOTDetails((prev) => {
      let newArray = Array?.from({ length: 1 - prev?.length }, () => {
        return {};
      });
      return [...prev, ...newArray];
    });
  }, [setOTDetails, oTDetails]);

  const syncFormWithDb = useCallback(
    (data) => {
      setDate(
        data?.date
          ? moment.utc(data.date).format("YYYY-MM-DD")
          : moment.utc(today).format("YYYY-MM-DD")
      );

      const OTDetailsWithChild =
        data?.OTDetails?.map((item) => ({
          ...item,
          childRecord: item._count?.PayStructure || 0,
        })) || [];

      setOTDetails(OTDetailsWithChild);
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    date,


    companyId,
    id,
    branchId,
    oTDetails,
  };

  const validateData = (data) => {
    if (oTDetails?.some((i) => !i.payCode || i.payCode === "")) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Pay Code is Missing",
      });
      return;
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
            title: "Data cannot be Deleted",
            text: deldata?.data?.message || "Child Record Exits",
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
    }
  };

  console.log(allData, "alldata");

  const getNextDocId = useCallback(() => {
    if (id) return;
    if (allData?.nextDocId) {
      setDocId(allData?.nextDocId);
    }
  }, [allData, id]);

  useEffect(getNextDocId, [getNextDocId]);
  console.log(allData, "alldata");
  const onNew = () => {
    setId("");
    setDate(moment.utc(new Date(today)).format("YYYY-MM-DD"));

    setReadOnly(false);
    setSearchValue("");
    setOTDetails([]);

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
      header: "Date",
      accessor: (item) => new Date(item?.date).toISOString().split("T")[0],
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-center uppercase w-32",
    },
  ];

  return (
    <>
      <div>
        <div onKeyDown={handleKeyDown} className="p-1 ">
          {form === true ? (
            <TemplateItems
              saveData={saveData}
              setForm={setForm}
              setReadOnly={setReadOnly}
              setId={setId}
              readOnly={readOnly}
              oTDetails={oTDetails}
              setOTDetails={setOTDetails}
              id={id}
              docId={docId}
              setDate={setDate}
              date={date}
              setDocId={setDocId}
              childRecord={childRecord}
              onClose={() => {
                setForm(false);
                onNew();
              }}
              onNew={onNew}
              form={form}
              refetch={refetch}
            />
          ) : (
            <>
              <div className="w-full flex bg-white p-1 justify-between  items-center">
                <h1 className="master-header">OT MASTER</h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setForm(true);
                      onNew();
                    }}
                    className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                  >
                    + Add New OT
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

export default OTMaster;
