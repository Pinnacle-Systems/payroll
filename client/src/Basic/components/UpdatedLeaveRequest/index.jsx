import { useEffect, useState, useRef, useCallback } from "react";
import Modal from "../../../UiComponents/Modal";
import { ReusableTable } from "../../../Inputs";

import { getCommonParams } from "../../../Utils/helper";
import {
    useGetLeaveRequestQuery,
    useGetLeaveRequestByIdQuery,
    useAddLeaveRequestMutation,
    useUpdateLeaveRequestMutation,
    useDeleteLeaveRequestMutation,
    useGetEmployeeLeaveCountQuery
} from "../../../redux/services/LeaveRequestService";

import Table from "./Table";
import Swal from "sweetalert2";
import moment from "moment";
import { useDispatch } from "react-redux";
import Loader from "../Loader";
import { useGetEmployeeQuery } from "../../../redux/services/EmployeeMasterService";
import { useGetLeaveCodeQuery } from "../../../redux/services/LeaveCode.servive";

const LeaveRequest = () => {
    const today = new Date();
    const [readOnly, setReadOnly] = useState(false);
    const [id, setId] = useState("");
    const [docId, setDocId] = useState("New");
    const [form, setForm] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const childRecord = useRef(0);
    const [leaveDetails, setLeaveDetails] = useState([]);
    const [date, setDate] = useState(moment.utc(today).format("YYYY-MM-DD"));
    const [employeeId, setEmployeeId] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [designation, setDesignation] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [totalDays, setTotalDays] = useState('')
    const [leaveSummary, setLeaveSummary] = useState([])
    const dispatch = useDispatch();


    const params = getCommonParams();
    const { branchId, companyId, finYearId, userId } = params;
    const { data: allData, isLoading, isFetching, refetch } = useGetLeaveRequestQuery({ params, searchParams: searchValue, });
    const { data: employeeLeaveCount } = useGetEmployeeLeaveCountQuery(employeeId, { skip: !employeeId })

    const { data: employee } = useGetEmployeeQuery({ params });
    const { data: LeaveType } = useGetLeaveCodeQuery({ params });


    const {
        data: singleData,
        isFetching: isSingleFetching,
        isLoading: isSingleLoading,
    } = useGetLeaveRequestByIdQuery(id, { skip: !id });

    const [addData] = useAddLeaveRequestMutation();
    const [updateData] = useUpdateLeaveRequestMutation();
    const [removeData] = useDeleteLeaveRequestMutation();


    const generateLeaveRows = (from, to) => {
        if (!from || !to) return;

        const start = new Date(from);
        const end = new Date(to);

        if (end < start) return;

        let temp = [];
        let current = new Date(start);

        while (current <= end) {
            temp.push({
                startDate: current.toISOString().split("T")[0],
                leaveId: "",
            });

            current.setDate(current.getDate() + 1);
        }
        const totalDays = temp.length;
        setLeaveDetails(temp);
        setTotalDays(String(totalDays));

    };
    useEffect(() => {
        if (employeeId) {
            // When employeeId changes and is valid, update state from API response
            if (employeeLeaveCount?.data) {
                setLeaveSummary(employeeLeaveCount.data || []);
            } else {
                setLeaveSummary([]);
            }
        } else {
            setLeaveSummary([]);
        }
    }, [employeeId, employeeLeaveCount]);


    const syncFormWithDb = useCallback(
        (data) => {
            setDocId(data?.docId || "New");
            setDate(
                data?.date
                    ? moment.utc(data.date).format("YYYY-MM-DD")
                    : moment.utc(today).format("YYYY-MM-DD")
            );
            setEmployeeId(data?.employee.id)
            setEmployeeName(data?.employee.firstName)
            setDepartment(data?.employee.department?.name)
            setDesignation(data?.employee.designation.name)
            setFromDate(data?.fromDate
                ? moment.utc(data.fromDate).format("YYYY-MM-DD")
                : moment.utc(today).format("YYYY-MM-DD"))
            setToDate(data?.toDate
                ? moment.utc(data.toDate).format("YYYY-MM-DD")
                : moment.utc(today).format("YYYY-MM-DD"))
            setTotalDays(data?.totalDays || '')
            const formatted = data?.leaveDetails?.map((val) => ({
                leaveId: val?.leaveId,
                date: val?.date ? moment.utc(val?.date).format("YYYY-MM-DD") : null,
                shiftTime: val?.shiftTime || '',
                notes: val?.notes || '',
                count: val?.count || 0,
                isApproved: val?.isApproved === true ? "Approved" : val?.isApproved === false ? "Rejected" : "Pending",

            }))
            setLeaveDetails(formatted);
            console.log(leaveDetails,"hafhnasklfasl");
            
            // const leaveAvailable = data?.leaveSummary?.map((val) => ({
            //   leaveName: val?.leaveName,
            //   totalCount: val?.totalCount
            // }))
            // setLeaveSummary(leaveAvailable)
        },
        [id]
    );


    useEffect(() => {
        syncFormWithDb(singleData?.data);
    }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData]);

    const data = {
        date,
        docId,
        finYearId,
        id,
        branchId,
        userId,
        leaveDetails,
        companyId,
        employeeId,
        fromDate,
        toDate,
        totalDays
    };


    const validateData = (data) => {
        if (!data?.employeeId ) {
            Swal.fire({
                icon: "error",
                title: "Submission error",
                text: "choose Employee ",
            });
            return false;
        }

        if (leaveDetails?.some((i) => !i.leaveId || i.leaveId === "")) {
            Swal.fire({
                icon: "error",
                title: "Submission error",
                text: "Leave Details is missing in one or more rows",
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
                title: "Request Submitted Successfully",
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


console.log(leaveDetails,"chekcing`");

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

    const onNew = () => {
        setEmployeeId('')
        setId("");
        setEmployeeName('')
        setDesignation('')
        setDepartment('')
        setMobileNumber('')
        setReadOnly(false);
        setSearchValue("");
        setLeaveDetails([]);
        setLeaveSummary([])
        setDate(moment.utc(new Date(today)).format("YYYY-MM-DD"));
        setFromDate('')
        setToDate('')
        setTotalDays('')
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
        {
            header: "Emp Name",
            accessor: (item) => item?.employee.firstName,
            //   cellClass: () => "  text-gray-900",
            className: " text-gray-900 text-left pl-2 uppercase w-44",
        },
        {
            header: "Emp Id Card No",
            accessor: (item) => item?.employee.idNumber,
            //   cellClass: () => "  text-gray-900",
            className: " text-gray-900 text-left pl-2 uppercase w-44",
        },
    ];
    if (isLoading || isFetching) return <Loader />;

    return (
        <>
            <div>
                <div onKeyDown={handleKeyDown} className="p-1 ">
                    {form === true ? (
                     
                            <Table
                                saveData={saveData} employeeName={employeeName}
                                setForm={setForm} setEmployeeName={setEmployeeName}
                                setReadOnly={setReadOnly} designation={designation}
                                setId={setId} setDesignation={setDesignation}
                                mobileNumber={mobileNumber} totalDays={totalDays} setTotalDays={setTotalDays}
                                setMobileNumber={setMobileNumber}
                                employee={employee} department={department}
                                readOnly={readOnly} setDepartment={setDepartment}
                                leaveDetails={leaveDetails}
                                setLeaveDetails={setLeaveDetails}
                                id={id} LeaveType={LeaveType} setToDate={setToDate}
                                fromDate={fromDate} setFromDate={setFromDate} toDate={toDate}
                                docId={docId} leaveSummary={leaveSummary}
                                setDate={setDate}
                                date={date}
                                setDocId={setDocId}
                                generateLeaveRows={generateLeaveRows}
                                childRecord={childRecord}
                               


                                onClose={() => {
                                    setForm(false);
                                    onNew();
                                }}
                                onNew={onNew}
                                refetch={refetch}

                                form={form}
                                employeeId={employeeId}
                                setEmployeeId={setEmployeeId}
                            />



                        

                    ) : (
                        <>
                            <div className="w-full flex bg-white p-1 justify-between  items-center">
                                <h1 className="master-header">
                                    Leave Request
                                </h1>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setForm(true);
                                            onNew();
                                        }}
                                        className="bg-white border  border-green-600 text-green-600 hover:bg-green-700 hover:text-white text-sm px-2  rounded-md shadow transition-colors duration-200 flex items-center gap-2"
                                    >
                                        +  New Leave Request
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





export default LeaveRequest 