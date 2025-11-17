import { useCallback, useEffect, useState } from "react"
import {
    useGetshiftTypeQuery,
    useGetshiftTypeByIdQuery,

    useAddshiftTypeMutation,
    useUpdateshiftTypeMutation,
    useDeleteshiftTypeMutation,
} from "../../../redux/uniformService/shiftTYpeService";

import { getCommonParams } from "../../../Utils/helper";
import toast from "react-hot-toast";

import {
    ShiftType
} from "../../../Utils/DropdownData";

import Swal from "sweetalert2";
import { useDispatch } from "react-redux";


export default function Approval() {
    const params = getCommonParams();
    const { branchId, companyId, finYearId, userId } = params;
    const [id, setId] = useState("")
    const dispatch = useDispatch();



    const { data: allData } = useGetshiftTypeQuery({ params });
    console.log(allData, 'allData');




    const [selectedShiftType, setSelectedShiftType] = useState('');

    const { data: singleData, isFetching: isSingleFetching, isLoading: isSingleLoading } = useGetshiftTypeByIdQuery(id, { skip: !id });

    const [addData] = useAddshiftTypeMutation();
    const [updateData] = useUpdateshiftTypeMutation();


    const syncFormWithDb = useCallback(
        (data) => {
            if (id) {
            }
        }, [id])


    useEffect(() => {
        syncFormWithDb(singleData?.data);
    }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData])

    useEffect(() => {
        if (allData?.data?.length) {
            setId(allData?.data[0]?.id);
            setSelectedShiftType(allData?.data[0]?.selectedShiftType);
        }
    }, [allData]);


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
            dispatch({
                type: `ShiftTemplateMaster/invalidateTags`,
                payload: ["ShiftTemplateMaster"],
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Submission error",
                text: error.data?.message || "Something went wrong!",
            });
        }
    }




    const data = {
        selectedShiftType, id, companyId, branchId, userId
    }
    const saveData = () => {




        if (id) {
            handleSubmitCustom(updateData, data, "Updated")
        } else {
            handleSubmitCustom(addData, data, "Created")
        }
    }



    const handleChange = (shiftType) => {
        setSelectedShiftType(shiftType.value);

    }


    return (
        <>

            <div className="mt-3 ml-3">
                <div className=' flex justify-between mb-2 items-center px-0.5 text-[14px] font-semibold'>
                    <h5 className='my-1 bg-gray-300 px-1 rounded'>Select Attendence Type</h5>

                </div>

                <div className=" flex flex-col   items-start gap-3 ">
                    <div className="p-4 w-[20rem] bg-white rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Attendence Type</h2>
                        <form>
                            {ShiftType?.map((shiftType, index) => (
                                <>

                                    <label key={index} className="flex  mb-2 cursor-pointer">

                                        <input
                                            type="radio"
                                            name="shiftType"
                                            // value={shiftType.name}
                                            checked={selectedShiftType === shiftType.value}
                                            onChange={() => handleChange(shiftType)}
                                            className="form-radio text-blue-600 mr-2"
                                        />
                                        <span className="text-gray-700">{shiftType.value}</span>
                                    </label> </>
                            ))}
                        </form>
                        {selectedShiftType && (
                            <div className="w-full flex pr-1">
                                <span>     Selected Attendence Type: </span>
                                <p className=" text-green-600 font-medium px-1">
                                    {selectedShiftType}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className='flex items-center'>
                        <button onClick={() => saveData()} className='bg-green-500 text-white px-3 py-1 button rounded shadow-md'>Save</button>
                    </div>
                </div>

            </div>
        </>
    )


}