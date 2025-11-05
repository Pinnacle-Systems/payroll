import { useEffect, useState, useRef, useCallback } from "react";


import {

  ReusableTable,
  
} from "../../../Inputs";



import { useGetCompanyQuery } from "../../../redux/services/CompanyMasterService";


import { getCommonParams } from "../../../Utils/helper";
import {
  useAddCompanyPayCodeMutation,
  useDeleteCompanyPayCodeMutation,
  useGetCompanyPayCodeByIdQuery,
  useGetCompanyPayCodeQuery,
  useUpdateCompanyPayCodeMutation,
} from "../../../redux/services/CompanyPayCodeService";
import {
  useAddPayStructureMutation,
  useDeletePayStructureMutation,
  useGetPayStructureByIdQuery,
useGetPayStructureQuery,
useUpdatePayStructureMutation,

} from "../../../redux/services/PayStructureService";

import TemplateItems from "./TemplateItems";
import Swal from "sweetalert2";
import { useGetPayComponentQuery } from "../../../redux/services/PayComponentsService";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useGetEmployeeCategoryQuery } from "../../../redux/services/EmployeeCategoryMasterService";
import secureLocalStorage from "react-secure-storage";
import Loader from "../Loader";

const PayStructure = () => {
  const today = new Date();
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("");
  const [payDetailsId, setPayDetailsId] = useState("");

  const [docId, setDocId] = useState("New");

  const [form, setForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const childRecord = useRef(0);
  const [payStructure, setPayStructure] = useState([]);
  const[category,setCategory] = useState('')
  const [employeeCategoryId, setEmployeeCategoryId] = useState("");
  const [date, setDate] = useState(moment.utc(today).format("YYYY-MM-DD"));
  const dispatch = useDispatch();

  const params = getCommonParams();

  const { branchId ,companyId,finYearId} = params;

  const { data: company } = useGetCompanyQuery({ params });
  const [companyCode, setCompanyCode] = useState(company?.data[0].code);

  const { data: allData, isLoading,
    isFetching,  refetch } = useGetPayStructureQuery({
    params,
    searchParams: searchValue,
  });
    const { data: employeeCategoryList } = useGetEmployeeCategoryQuery({
      params
    });

  const { data: companyPayCode } = useGetCompanyPayCodeQuery({
    params,
    searchParams: searchValue,
  });
  const {
    data: singleData,
    isFetching: isSingleFetching,
    isLoading: isSingleLoading,
  } = useGetPayStructureByIdQuery(id, { skip: !id });

  const [addData] = useAddPayStructureMutation();
  const [updateData] = useUpdatePayStructureMutation();
  const [removeData] = useDeletePayStructureMutation();

  

 

  useEffect(() => {
    if (payStructure?.length >= 1) return;
    setPayStructure((prev) => {
      let newArray = Array?.from({ length: 1 - prev?.length }, () => {
        return {
          payDetailsId:''
        };
      });
      return [...prev, ...newArray];
    });
  }, [payStructure,setPayStructure ]);

const syncFormWithDb = useCallback(
  (data) => {
    setDocId(data?.docId || "New");
    setDate(
      data?.date
        ? moment.utc(data.date).format("YYYY-MM-DD")
        : moment.utc(today).format("YYYY-MM-DD")
    );
    setEmployeeCategoryId(data?.employeeCategoryId);
    setCategory(data?.category || "");

    // Map PayStructure to include payDescription and pickFrom
    const enrichedPayStructure = data?.PayStructure?.map((ps) => ({
      ...ps,
      
      payDescription: ps?.PayDetails?.payComponent?.payDescription || "",
      pickFrom: ps?.PayDetails?.pickFrom || "",
    })) || [];

    setPayStructure(enrichedPayStructure);
  },
  [id]
);


  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

  const data = {
    date,
    docId,
    category,
    employeeCategoryId,
    finYearId,
    id,
    branchId,
    payStructure,
     companyId,
  };

  
const validateData = (data) => {
  if (!data?.employeeCategoryId || !data?.category) {
    Swal.fire({
      icon: "error",
      title: "Submission error",
      text: "Employee Category and category are required",
    });
    return false;
  }

  if (payStructure?.some((i) => !i.payDetailsId || i.payDetailsId === "")) {
    Swal.fire({
      icon: "error",
      title: "Submission error",
      text: "Pay Details is missing in one or more rows",
    });
    return false;
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

  // const getNextDocId = useCallback(() => {
  //   if (id) return;
  //   if (allData?.nextDocId) {
  //     setDocId(allData?.nextDocId);
  //   }
  // }, [allData, id]);

  // useEffect(getNextDocId, [getNextDocId]);
  console.log(allData, "alldata");
  const onNew = () => {
   
    setId("");
    setEmployeeCategoryId('')
    setCategory('')
    setReadOnly(false);
    setSearchValue("");
    // setCompanyCode(company?.data[0]?.code);
    setPayStructure([]);
      setDate(moment.utc(new Date(today)).format("YYYY-MM-DD"));
    
    refetch();
  };
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
              setCategory={setCategory}
              category={category}
              
              readOnly={readOnly}
              payStructure={payStructure}
              setPayStructure={setPayStructure}
              id={id}
              companyCode={companyCode}
              setCompanyCode={setCompanyCode}
              docId={docId}
              setDate={setDate}
              date={date}
              setDocId={setDocId}
              employeeCategoryId={employeeCategoryId}
              setEmployeeCategoryId={setEmployeeCategoryId}
              childRecord={childRecord}
              companyPayCode = {companyPayCode}
              setPayDetailsId={setPayDetailsId}
              payDetailsId={payDetailsId}
              onClose={() => {
                setForm(false);
                onNew();
              }}
              onNew={onNew}
              refetch={refetch}
              employeeCategoryList={employeeCategoryList}
              form={form}
            />
          ) : (
            <>
              <div className="w-full flex bg-white p-1 justify-between  items-center">
                <h1 className="master-header">
                  Pay Structure
                </h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setForm(true);
                      onNew();
                    }}
                    className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                  >
                    + Add New Pay Structure
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

export default PayStructure;
