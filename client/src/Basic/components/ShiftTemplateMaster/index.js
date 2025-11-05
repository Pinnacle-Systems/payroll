import React, { useEffect, useState, useRef, useCallback } from "react";
import { ReusableTable } from "../../../Inputs";
import { getCommonParams } from "../../../Utils/helper";
import {
  useAddShiftTemplateMasterMutation,
  useDeleteShiftTemplateMasterMutation,
  useGetShiftTemplateMasterByIdQuery,
  useGetShiftTemplateMasterQuery,
  useUpdateShiftTemplateMasterMutation,
} from "../../../redux/services/ShiftTemplateMaster";
import { useGetShiftCommonTemplateQuery } from "../../../redux/services/ShiftCommonTemplate.service";
import { useGetshiftMasterQuery } from "../../../redux/services/ShiftMasterService";
import { useGetOTMasterQuery } from "../../../redux/services/OTMaster.service";
import TemplateItems from "./templateItems";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  useGetshiftTypeQuery,
  useGetshiftTypeByIdQuery,
} from "../../../redux/uniformService/shiftTYpeService";
import Loader from "../Loader";

const ShiftTemplateMaster = () => {
  const today = Date();
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [docId, setDocId] = useState("New");
  const [active, setActive] = useState(true);
  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const [ShiftTemplateItems, setShiftTemplateItems] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(null);
  const params = getCommonParams();
  const [shiftId, setshiftId] = useState("");

  const { branchId, companyId, finYearId } = params;

  const dispatch = useDispatch();

  const { data: allData, isLoading,
    isFetching, refetch } = useGetShiftTemplateMasterQuery({
      params,
      searchParams: searchValue,

    });

  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetShiftTemplateMasterByIdQuery(id, { skip: !id });

  const [addData] = useAddShiftTemplateMasterMutation();
  const [updateData] = useUpdateShiftTemplateMasterMutation();
  const [removeData] = useDeleteShiftTemplateMasterMutation();

  const { data: shiftData } = useGetshiftMasterQuery({
    params,
    searchParams: searchValue,
  });
  const { data: ShitCommonData } = useGetShiftCommonTemplateQuery({
    params,
    searchParams: searchValue,
  });

  const { data: shiftTypeData } = useGetshiftTypeQuery({ params })

  const { data: OTData } = useGetOTMasterQuery({ params });

  useEffect(() => {
    if (ShiftTemplateItems?.length >= 1) return;
    setShiftTemplateItems((prev) => {
      let newArray = Array?.from({ length: 1 - prev?.length }, () => {
        return {
          shiftCommonTemplateId: "",
          quarterDetails: [
            {
              oTDetailsId: "",
              day: "",

              ftMins: "",
              from: "",
              to: "",
              ttMins: "",
              endTime: "",
              nextDay: "",
              checkHrs: "",
              total: "",
              pickFrom: "",
              formula: "",
            },
          ],
        };
      });
      return [...prev, ...newArray];
    });
  }, [setShiftTemplateItems, ShiftTemplateItems]);

  const syncFormWithDb = useCallback(
    (data) => {
      setName(data?.name || "");
      setDocId(data?.docId || "New");

      setDescription(data?.description || "");
      setActive(id ? data?.active ?? false : true);

      const mappedGrid = data?.ShiftTemplateItems?.map((val) => ({
        ...val,
        date: val?.date
          ? new Date(val?.date).toISOString().split("T")[0]
          : null,
        quarterDetails:
          val?.QuarterDetails?.map((qd) => ({
            ...qd,
            from: qd?.from || "",
            to: qd?.to || "",
          })) || [],
      }));

      setShiftTemplateItems(mappedGrid ? mappedGrid : []);
      setCategoryId(data?.category ? data?.category : "");
      childRecord.current = data?.childRecord ? data?.childRecord : 0;
    },
    [id]
  );

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    name,
    date,
    description,
    docId,
    active,
    companyId,
    id,
    branchId,
    ShiftTemplateItems: ShiftTemplateItems?.filter(
      (item) => item.shiftCommonTemplateId
    ),
    categoryId,
    finYearId
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
        type: `shiftMaster/invalidateTags`,
        payload: ["shiftMaster"],
      });
      dispatch({
        type: `ShiftCommonTemplateMaster/invalidateTags`,
        payload: ["ShiftCommonTemplate"],
      });
      dispatch({
        type: `oTMAster/invalidateTags`,
        payload: ["oTMAster"],
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: error.data?.message || "Something went wrong!",
      });
    }
  };

  const validateData = (data) => {
    if (!categoryId) {
      // toast.info("Category is Missing");
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Category is Missing",
      });
      return false;
    }
    if (ShiftTemplateItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "ShiftTemplateItems  should have atleast One Item...!!!",
      });
      return false;
    }
    if (
      ShiftTemplateItems?.some(
        (i) => !i.shiftCommonTemplateId || i.shiftCommonTemplateId === ""
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Shift Common Template  Is Missing...!!!",
      });
      return;
    }
    if (ShiftTemplateItems?.some((i) => !i.shiftId || i.shiftId === "")) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "shift  Is Missing...!!!",
      });
      return;
    }

    return true;
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

  console.log(id, "id");

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
          type: `shiftMaster/invalidateTags`,
          payload: ["shiftMaster"],
        });
        dispatch({
          type: `ShiftCommonTemplateMaster/invalidateTags`,
          payload: ["ShiftCommonTemplate"],
        });
        dispatch({
          type: `oTMAster/invalidateTags`,
          payload: ["oTMAster"],
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
      // saveData();
    }
  };

  // const getNextDocId = useCallback(() => {
  //   if (id) return;
  //   if (allData?.nextDocId) {
  //     setDocId(allData?.nextDocId);
  //   }
  // }, [allData, id]);

  // useEffect(getNextDocId, [getNextDocId]);
  const onNew = () => {
    setId("");

    setReadOnly(false);
    setSearchValue("");
    setShiftTemplateItems([]);
    setCategoryId("");
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
      className: " text-gray-900 w-12  text-center",
    },

    {
      header: "Doc Id",
      accessor: (item) => item?.docId,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-left pl-2 uppercase w-32",
    },
    {
      header: "Category",
      accessor: (item) => item?.category,
      //   cellClass: () => "  text-gray-900",
      className: " text-gray-900 text-center uppercase w-32",
    },
  ];
  if (isLoading || isFetching) return <Loader />;

  return (
    <div>
      <div onKeyDown={handleKeyDown} className="p-1 ">
        {form === true ? (
          <TemplateItems
            saveData={saveData}
            setForm={setForm}
            setReadOnly={setReadOnly}
            setId={setId}
            ShitCommonData={ShitCommonData}
            shiftData={shiftData}
            shiftTypeData={shiftTypeData}
            readOnly={readOnly}
            ShiftTemplateItems={ShiftTemplateItems}
            setShiftTemplateItems={setShiftTemplateItems}
            id={id}
            OTData={OTData}
            docId={docId}
            setDate={setDate}
            setshiftId={setshiftId}
            shiftId={shiftId}
            date={date}
            setDocId={setDocId}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            childRecord={childRecord}
            onClose={() => {
              setForm(false);
              onNew();
            }}
            onNew={onNew}
            refetch={refetch}
            today={today}
          />
        ) : (
          <>
            <div className="w-full flex bg-white p-1 justify-between  items-center">
              <h1 className="master-header">Shift Template Master</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setForm(true);
                    onNew();
                  }}
                  className="bg-white border   border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                >
                  + Add Shift Template Master
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

export default ShiftTemplateMaster;
