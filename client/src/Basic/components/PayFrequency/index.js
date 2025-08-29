import React, { useEffect, useState, useRef, useCallback } from "react";
import secureLocalStorage from "react-secure-storage";

import { toast } from "react-toastify";
import {
    TextInput,

    ToggleButton,
    ReusableTable,
    TextAreaInput,
    DropdownInput,
} from "../../../Inputs";

import { common, commonNew, statusDropdown } from "../../../Utils/DropdownData";



import { useGetCompanyQuery } from "../../../redux/services/CompanyMasterService";
import Modal from "../../../UiComponents/Modal";
import { Check, Power } from "lucide-react";

import { getCommonParams } from "../../../Utils/helper";
import { useAddShiftTemplateMasterMutation, useDeleteShiftTemplateMasterMutation, useGetShiftTemplateMasterByIdQuery, useGetShiftTemplateMasterQuery, useUpdateShiftTemplateMasterMutation } from "../../../redux/services/ShiftTemplateMaster";
import { useGetShiftCommonTemplateQuery } from "../../../redux/services/ShiftCommonTemplate.service";
import { useGetshiftMasterQuery } from "../../../redux/services/ShiftMasterService";
import TemplateItems from "./templateItems";


const ShiftTemplateMaster = () => {
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
    const [ShiftTemplateItems, setShiftTemplateItems] = useState([])
    const [categoryId, setCategoryId] = useState("")



    const params = getCommonParams();


    const { branchId } = params

    const { data: company } = useGetCompanyQuery({ params });
    const [companyCode, setCompanyCode] = useState(company?.data[0].code);



    const { data: allData } = useGetShiftTemplateMasterQuery({ params, searchParams: searchValue });

        const {
        data: singleData,
        isFetching: isSingleFetching,
        isLoading: isSingleLoading,
    } = useGetShiftTemplateMasterByIdQuery(id, { skip: !id });

     const [addData] = useAddShiftTemplateMasterMutation();
    const [updateData] = useUpdateShiftTemplateMasterMutation();
    const [removeData] = useDeleteShiftTemplateMasterMutation();


    const { data: shiftData } = useGetshiftMasterQuery({ params, searchParams: searchValue });
    const { data: ShitCommonData } = useGetShiftCommonTemplateQuery({ params, searchParams: searchValue });




    useEffect(() => {
        if (company?.data?.length > 0) {
            // setCompanyName(company.data[0].name);
            setCompanyCode(company.data[0].code);
        }
    }, [company]);

   
    const getNextDocId = useCallback(() => {
        if (id) return;
        if (allData?.nextDocId) {
            setDocId(allData?.nextDocId);
        }
    }, [allData, id]);

    useEffect(getNextDocId, [getNextDocId]);


    useEffect(() => {
        if (ShiftTemplateItems?.length >= 1) return
        setShiftTemplateItems(prev => {
            let newArray = Array.from({ length: 1 - prev.length }, i => {
                return { templateId: "" };
            })
            return [...prev, ...newArray]
        }
        )
    }, [])


    const syncFormWithDb = useCallback(
        (data) => {
            if (!id) {
                // setReadOnly(false);
                setName("");
                setDescription("")
                setActive(true);
                // setCompanyName(company?.data[0].name);
                setCompanyCode(company?.data[0].code);
            } else {
                // setReadOnly(true);
                setName(data?.name || "");
                setDocId(data?.docId || "")
                setDescription(data?.description || "");
                setActive(id ? data?.active ?? false : true);
                setShiftTemplateItems(data?.ShiftTemplateItems ? data?.ShiftTemplateItems : undefined)
            }
        },
        [id, company]
    );

    useEffect(() => {
        syncFormWithDb(singleData?.data);
    }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

    const data = {
        name,
        description,
        docId,
        active,
        companyId: secureLocalStorage.getItem(
            sessionStorage.getItem("sessionId") + "userCompanyId"
        ),
        id,
        branchId,
        ShiftTemplateItems,
    };

    console.log(ShiftTemplateItems, "ShiftTemplateItems  ")

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
        // if (!validateData(data)) {
        //   toast.error("Please fill all required fields...!", {
        //     position: "top-center",
        //   });
        //   return;
        // }
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
            // saveData();
        }
    };

    // const onNew = () => {
    //     setId("");
    //     setReadOnly(false);
    //     setForm(true);
    //     setSearchValue("");
    //     // setCompanyName(company.data[0].name);
    //     setCompanyCode(company?.data[0]?.code);

    // };
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
            header: "Common Template Name",
            accessor: (item) => item?.name,
            //   cellClass: () => "font-medium  text-gray-900",
            className: "font-medium text-gray-900 text-center uppercase w-72",
        },

        {
            header: "Status",
            accessor: (item) => (item.active ? ACTIVE : INACTIVE),
            //   cellClass: () => "font-medium text-gray-900",
            className: "font-medium text-gray-900 text-center uppercase w-36",
        },
        {
            header: "",
            accessor: (item) => "",
            //   cellClass: () => "font-medium text-gray-900",
            className: "font-medium text-gray-900 uppercase w-[65%]",
        },
    ];
    function onDataClick(id) {
        setId(id);
        setForm(true);
    }

    const handleInputChange = (value, index, field) => {
        const newBlend = structuredClone(ShiftTemplateItems);
        newBlend[index][field] = value;

        setShiftTemplateItems(newBlend);
    };

    return (
        <div>
            <div onKeyDown={handleKeyDown} className="p-1 ">
                {form === true ? (
                    <TemplateItems saveData={saveData} setForm={setForm} ShitCommonData={ShitCommonData} shiftData={shiftData} readOnly={readOnly} ShiftTemplateItems={ShiftTemplateItems} setShiftTemplateItems={setShiftTemplateItems} id={id}
                        companyCode={companyCode} setCompanyCode={setCompanyCode} docId={docId} setDocId={setDocId} categoryId={categoryId} setCategoryId={setCategoryId} childRecord={childRecord} />

                )
                    :
                    (
                        <>
                            <div className="w-full flex bg-white p-1 justify-between  items-center">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Shift Template Master
                                </h1>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setForm(true);
                                            // onNew();
                                        }}
                                        className="bg-white border  border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white text-sm px-4 py-1 rounded-md shadow transition-colors duration-200 flex items-center gap-2"
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
                    )
                }

                {/* {form === true && (
                    <Modal
                        isOpen={form}
                        form={form}
                        widthClass={"w-[98%]  h-[95%]"}
                        onClose={() => {
                            setForm(false);
                            setErrors({});
                        }}
                    >
                        <div className="h-full flex flex-col bg-[f1f1f0] overflow-x-auto">
                            <div className="border-b py-2 px-4 mx-3 flex mt-4 justify-between items-center sticky top-0 z-10  bg-white ">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg px-2 py-0.5 font-semibold  text-gray-800">
                                        {id
                                            ? !readOnly
                                                ? "Edit Shift  Template Master"
                                                : "Shift  Template Master"
                                            : "Add New  Shift Template"}
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

                            <div className="flex-1 overflow-auto p-3 ">
                                <div className="grid grid-cols-1  gap-3  h-full ">
                                    <div className="lg:col-span- space-y-3">
                                        <div className="bg-white p-3 rounded-md border border-gray-200 h-full w-full overflow-x-auto">
                                            <div className="space-y-4 w-full">
                                                <div className="flex  gap-x-8">


                                                    <TextInput
                                                        name="Company Code"
                                                        type="text"
                                                        value={companyCode}
                                                        setValue={setCompanyCode}
                                                        required={true}
                                                        // readOnly={readOnly}
                                                        disabled={true}
                                                    />
                                                    <div className="w-72">
                                                        <TextInput
                                                            name="Doc Id"
                                                            type="text"
                                                            value={docId}
                                                            setValue={setDocId}
                                                            required={true}
                                                            // readOnly={readOnly}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    <div className="w-42">
                                                        <TextInput
                                                            name="Category"
                                                            type="text"
                                                            value={docId}
                                                            setValue={setDocId}
                                                            required={true}
                                                            readOnly={readOnly}
                                                            disabled={childRecord.current > 0}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={`w-full `}>
                                                        <table className="w-full border-collapse table-fixed ">
                                                            <thead className="bg-gray-200 text-gray-800">
                                                                <tr>
                                                                    <th
                                                                        className={`w-12 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        S.No
                                                                    </th>
                                                                    <th
                                                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Applied On
                                                                    </th>
                                                                    <th

                                                                        className={`w-32 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Shift Common Template
                                                                    </th>
                                                                    <th

                                                                        className={`w-32 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Shift
                                                                    </th>
                                                                    <th

                                                                        className={`w-20 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        In Next day
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Tolerance Before Start
                                                                    </th>

                                                                    <th

                                                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Start Time
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Tolerance After End

                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        FB OUT
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        FB IN
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-4 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Lunch B.ST
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        LB.SNDay
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Lunch B.ET
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        LB.ENDay
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        SBOut
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        SBIn
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Tolerance Before Start
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        End Time
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Tolerance After Start
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Out Next Day
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Shift Time Hrs
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        OT Hrs
                                                                    </th>
                                                                    <th

                                                                        className={`w-28 px-3 py-2 text-center font-medium text-[13px] `}
                                                                    >
                                                                        Quater(Y/N)
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {ShiftTemplateItems?.map((item, index) => (

                                                                    <tr className="w-full table-row">
                                                                        <td className="table-data  w-2 text-left px-1">
                                                                            {index + 1}
                                                                        </td>

                                                                        <td className=' border border-gray-500'>
                                                                            <input type="date" />
                                                                        </td>
                                                                        <td className=' border border-gray-500'>
                                                                            <select
                                                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                                disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                                value={item.TemplateId}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "TemplateId")}
                                                                            // onBlur={(e) => {
                                                                            //     handleInputChange(e.target.value, index, "accessoryGroupId")
                                                                            // }
                                                                            // }
                                                                            >
                                                                                <option>
                                                                                </option>
                                                                                {(id ? (ShitCommonData?.data || []) : ShitCommonData?.data.filter(item => item.active) || []).map((blend) =>
                                                                                    <option value={blend.id} key={blend.id}>
                                                                                        {blend.employeeCategory?.name}
                                                                                    </option>
                                                                                )}
                                                                            </select>
                                                                        </td>


                                                                        <td className=' border border-gray-500'>
                                                                            <select
                                                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                                disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                                value={item.shiftId}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "shiftId")}
                                                                            // onBlur={(e) => {
                                                                            //     handleInputChange(e.target.value, index, "accessoryGroupId")
                                                                            // }
                                                                            // }


                                                                            >
                                                                                <option>
                                                                                </option>
                                                                                {(id ? (shiftData?.data || []) : shiftData?.data.filter(item => item.active) || []).map((blend) =>
                                                                                    <option value={blend.id} key={blend.id}>
                                                                                        {blend?.name}
                                                                                    </option>
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className=' border border-gray-500'>
                                                                            <select
                                                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                                disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                                value={item.nextDay}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "nextDay")}
                                                                            // onBlur={(e) => {
                                                                            //     handleInputChange(e.target.value, index, "accessoryGroupId")
                                                                            // }
                                                                            // }


                                                                            >
                                                                                <option>
                                                                                </option>
                                                                                {(commonNew).map((blend) =>
                                                                                    <option value={blend.value} key={blend.value}>
                                                                                        {blend?.show}
                                                                                    </option>
                                                                                )}
                                                                            </select>
                                                                        </td>




                                                                        <td className='table-data'>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.toleranceBeforeStart}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "toleranceBeforeStart")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>


                                                                        <td className='table-data'>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.startTime}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "startTime")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>
                                                                        <td className='table-data'>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.toleranceAfterEnd}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "toleranceAfterEnd")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />

                                                                        </td>
                                                                        <td className='table-data'>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.fbOut}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "fbOut")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>
                                                                        <td className='table-data '>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.fbIn}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "fbIn")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>


                                                                        <td className='table-data '>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.lunchBst}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "lunchBst")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>
                                                                        <td className='table-data '>
                                                                            <select
                                                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                                disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                                value={item.lBSnDay}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "lBSnDay")}

                                                                            >
                                                                                <option>
                                                                                </option>
                                                                                {(commonNew).map((blend) =>
                                                                                    <option value={blend.value} key={blend.value}>
                                                                                        {blend?.show}
                                                                                    </option>
                                                                                )}
                                                                            </select>
                                                                        </td>



                                                                        <td className='table-data '>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.lunchBET}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "lunchBET")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>



                                                                        <td className='table-data '>
                                                                            <select
                                                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                                disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                                value={item.LBenday}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "LBenday")}

                                                                            >
                                                                                <option>
                                                                                </option>
                                                                                {(commonNew).map((blend) =>
                                                                                    <option value={blend.value} key={blend.value}>
                                                                                        {blend?.show}
                                                                                    </option>
                                                                                )}
                                                                            </select>
                                                                        </td>

                                                                        <td className='table-data '>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.SBOut}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "SBOut")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>
                                                                        <td className='table-data '>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.SBIn}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "SBIn")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>

                                                                        <td className='table-data '>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.toleranceBeforeStart}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "toleranceBeforeStart")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>
                                                                        <td className='table-data '>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.endTime}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "endTime")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>
                                                                        <td className='table-data '>
                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.toleranceAfterStart}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "toleranceAfterStart")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />
                                                                        </td>
                                                                        <td className='table-data '>
                                                                            <select
                                                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                                disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                                value={item.outNxtDay}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "outNxtDay")}

                                                                            >
                                                                                <option>
                                                                                </option>
                                                                                {(commonNew).map((blend) =>
                                                                                    <option value={blend.value} key={blend.value}>
                                                                                        {blend?.show}
                                                                                    </option>
                                                                                )}
                                                                            </select>
                                                                        </td>
                                                                        <td className='table-data '>

                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.shiftTimeHrs}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "shiftTimeHrs")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />

                                                                        </td>
                                                                        <td className='table-data '>

                                                                            <input
                                                                                min={"0"}
                                                                                type="number"
                                                                                value={item?.otHrs}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "otHrs")}
                                                                                className="text-right rounded py-1 px-1 w-full table-data-input"
                                                                                disabled={readOnly}
                                                                            />

                                                                        </td>
                                                                        <td className='table-data '>

                                                                            <select
                                                                                // onKeyDown={e => { if (e.key === "Delete") { handleInputChange("", index, "accessoryGroupId") } }}
                                                                                disabled={readOnly} className='text-left w-full rounded py-1 table-data-input'
                                                                                value={item.outNxtDay}
                                                                                onChange={(e) => handleInputChange(e.target.value, index, "outNxtDay")}

                                                                            >
                                                                                <option>
                                                                                </option>
                                                                                {(common).map((blend) =>
                                                                                    <option value={blend.value} key={blend.value}>
                                                                                        {blend?.show}
                                                                                    </option>
                                                                                )}
                                                                            </select>

                                                                        </td>
                                                                    </tr>
                                                                ))}

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )} */}

            </div>
        </div>
    );
};

export default ShiftTemplateMaster;
