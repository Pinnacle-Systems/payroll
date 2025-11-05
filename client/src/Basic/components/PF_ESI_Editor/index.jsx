import { useEffect, useState, useRef, useCallback } from "react";

import { ReusableTable } from "../../../Inputs";

import { findFromList, getCommonParams } from "../../../Utils/helper";
import { useGetCompanyPayCodeQuery } from "../../../redux/services/CompanyPayCodeService";
import {
  useAddPFEsiEditorMutation,
  useDeletePFEsiEditorMutation,
  useGetPFEsiEditorByIdQuery,
  useGetPFEsiEditorQuery,
  useUpdatePFEsiEditorMutation,
} from "../../../redux/services/PFEsiEditorService";

import TemplateItems from "./TemplateItems";
import Swal from "sweetalert2";

import moment from "moment";
import { useDispatch } from "react-redux";
import Loader from "../Loader";

import secureLocalStorage from "react-secure-storage";

const PFEsiEditor = () => {
  const today = new Date();
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [payDetailsId, setPayDetailsId] = useState("");
  const [pickFrom, setPickFrom] = useState("");
  const [docId, setDocId] = useState("");

  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const [pfEsiGrid, setPfEsiGrid] = useState([]);
  const [payCodeType, setPayCodeType] = useState("");
  const [date, setDate] = useState(moment.utc(today).format("YYYY-MM-DD"));
  const dispatch = useDispatch();


  const params = getCommonParams();

  const { branchId, companyId } = params;

  const { data: allData, isLoading,
    isFetching, refetch } = useGetPFEsiEditorQuery({
      params,
      searchParams: searchValue,
    });

  const { data: companyPayCode } = useGetCompanyPayCodeQuery({
    params,
    searchParams: searchValue,
  });
  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetPFEsiEditorByIdQuery(id, { skip: !id });

  const [addData] = useAddPFEsiEditorMutation();
  const [updateData] = useUpdatePFEsiEditorMutation();
  const [removeData] = useDeletePFEsiEditorMutation();

  useEffect(() => {
    if (pfEsiGrid?.length >= 1) return;
    setPfEsiGrid((prev) => {
      let newArray = Array?.from({ length: 1 - prev?.length }, () => {
        return {
          fromValue: "",
          toValue: "",
          percentage: "",
        };
      });
      return [...prev, ...newArray];
    });
  }, [pfEsiGrid, setPfEsiGrid]);

  const syncFormWithDb = useCallback(
    (data) => {
      setDocId(data?.docId);
      setDate(
        data?.date
          ? moment.utc(data?.date).format("YYYY-MM-DD")
          : moment.utc(today).format("YYYY-MM-DD")
      );
      setPayDetailsId(data?.payDetailsId || "");

      const pfEsiPayDetails = companyPayCode?.data?.flatMap(
        (cp) => cp?.PayDetails || []
      );
      setPickFrom(
        findFromList(data?.payDetailsId, pfEsiPayDetails, "pickFrom")
      );
      const fullDetail = pfEsiPayDetails?.find(
        (pd) => pd.id === data?.payDetailsId
      );
      setPayCodeType(fullDetail?.payComponent?.payCode?.toUpperCase() || "");

      // setPfEsiGrid(data?.PfEsiGrid || []);
      setPfEsiGrid(
        (data?.PfEsiGrid || []).map((item) => ({
          ...item,
          fromValue: item.fromValue ? Number(item.fromValue).toFixed(2) : "",
          toValue: item.toValue ? Number(item.toValue).toFixed(2) : "",
          percentage: item.percentage ? Number(item.percentage).toFixed(2) : "",
        }))
      );

    },
    [id]
  );
  console.log(singleData, "singleData");

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    date,
    docId,
    payDetailsId,
    id,
    branchId,
    pfEsiGrid,
    companyId
  };

  const validateData = (data) => {


    if (
      data?.payDetailsId

    ) {
      return true;
    }
    return false;
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
      dispatch({
        type: `companyPayCode/invalidateTags`,
        payload: ["companyPayCode"],
      });
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
        const deldata = await removeData(id).unwrap();
        if (deldata?.statusCode == 1) {
          Swal.fire({
            icon: "error",
            title: "Submission error",
            text: deldata?.data?.message || "Something went wrong!",
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
        dispatch({
          type: `companyPayCode/invalidateTags`,
          payload: ["companyPayCode"],
        });
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
      // saveData();
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
    setPayDetailsId("");
    setPickFrom("");
    setPayCodeType('')
    setReadOnly(false);
    setSearchValue("");
    // setCompanyCode(company?.data[0]?.code);
    setPfEsiGrid([]);
    setDate(moment.utc(new Date(today)).format("YYYY-MM-DD"));

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
      header: "Doc Id",
      accessor: (item) => item?.docId,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-32",
    },
    {
      header: "Date",
      accessor: (item) => new Date(item?.date).toISOString().split("T")[0],
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-center uppercase w-32",
    },
  ];
  if (isLoading || isFetching) return <Loader />;

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
              pfEsiGrid={pfEsiGrid}
              setPfEsiGrid={setPfEsiGrid}
              id={id}
              docId={docId}
              setDate={setDate}
              date={date}
              setDocId={setDocId}
              childRecord={childRecord}
              companyPayCode={companyPayCode}
              setPickFrom={setPickFrom}
              pickFrom={pickFrom}
              setPayDetailsId={setPayDetailsId}
              payDetailsId={payDetailsId}
              onClose={() => {
                setForm(false);
                onNew();
              }}
              onNew={onNew}
              form={form}
              setPayCodeType={setPayCodeType}
              refetch={refetch}
              payCodeType={payCodeType}
            />
          ) : (
            <>
              <div className="w-full flex bg-white p-1 justify-between  items-center">
                <h1 className="master-header">
                  PF and ESI Rate Editor
                </h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setForm(true);
                      onNew();
                    }}
                    className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                  >
                    + Add New PF and ESI Rate Editor
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

export default PFEsiEditor;
