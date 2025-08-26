import React, { useCallback, useEffect, useRef, useState } from 'react'
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import {
  useAddCountryMutation, useDeleteCountryMutation,
  useGetCountriesQuery, useGetCountryByIdQuery,
  useUpdateCountryMutation
} from '../../../redux/services/CountryMasterService';

import { TextInput, ToggleButton } from '../../../Inputs';
import { statusDropdown } from '../../../Utils/DropdownData';
import Modal from '../../../UiComponents/Modal';
import e from 'cors';
import Mastertable from '../MasterTable/Mastertable';
import MasterForm from '../MastersForm/MastersForm';
import { push } from '../../../redux/features/opentabs';
import { useDispatch, useSelector } from 'react-redux';



const MODEL = "Country Master";

export default function Form() {

  const openTabs = useSelector((state) => state.openTabs);


  const [form, setForm] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [id, setId] = useState("")
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(false);
  const [errors, setErrors] = useState({});

  const [searchValue, setSearchValue] = useState("");

  const childRecord = useRef(0);

  const params = { companyId: secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "userCompanyId") }
  const { data: allData, isLoading, isFetching } = useGetCountriesQuery({ params, searchParams: searchValue });
  const { data: singleData, isFetching: isSingleFetching, isLoading: isSingleLoading } = useGetCountryByIdQuery(id, { skip: !id });

  const [addData] = useAddCountryMutation();
  const [updateData] = useUpdateCountryMutation();
  const [removeData] = useDeleteCountryMutation();


  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(push({ name: "COUNTRY MASTER" }))
 
  // }, [ dispatch,openTabs])

  const syncFormWithDb = useCallback((data) => {

    if (!id) {
      setReadOnly(false);

      setName("");
      setCode("");
      setActive(id ? (data?.active ?? true) : false);

      return;
    } else {
      setReadOnly(true)
      setName(data?.name || "");
      setCode(data?.code || "");
      setActive(id ? (data?.active ?? false) : true);
      childRecord.current = data?.childRecord ? data?.childRecord : 0;
    }
  }, [id])
  console.log(childRecord.current, "childRecord")

  useEffect(() => {
    syncFormWithDb(singleData?.data);
  }, [isSingleFetching, isSingleLoading, id, syncFormWithDb, singleData])


  const data = {
    name, code, companyId: secureLocalStorage.getItem(sessionStorage.getItem("sessionId") + "userCompanyId"), active, id
  }

  const validateData = (data) => {
    if (data.name && data.code) {
      return true;
    }
    return false;
  }

  const handleSubmitCustom = async (callback, data, text) => {
    try {
      let returnData = await callback(data).unwrap();
      setId(returnData.data.id)
      toast.success(text + "Successfully");

    } catch (error) {
      console.log("handle")
    }
  }

  const saveData = () => {
    console.log("saveData hit")
    if (!validateData(data)) {
      toast.error("Please fill all required fields...!", { position: "top-center" })
      return
    }
    if (!window.confirm("Are you sure save the details ...?")) {
      return
    }
    if (id) {
      handleSubmitCustom(updateData, data, "Updated")
      console.log("updateData hit")
    } else {
      handleSubmitCustom(addData, data, "Added");
    }
  }

  const deleteData = async () => {
    if (id) {
      if (!window.confirm("Are you sure to delete...?")) {
        return
      }
      try {
        let deldata = await removeData(id).unwrap();
        if (deldata?.statusCode == 1) {
          toast.error(deldata?.message)
          return
        }
        setId("");
        toast.success("Deleted Successfully");
        setForm(false);
      } catch (error) {
        toast.error("something went wrong")
        setForm(false);
      }
      ;
    }
  }

  const handleKeyDown = (event) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();
      saveData();
    }
  }

  const onNew = () => {
    setId("");
    setReadOnly(false);
    setForm(true);
    setSearchValue("");
  };

  function onDataClick(id) {
    setId(id);
    setForm(true);
  }
  const tableHeaders = [
    "S.NO", "Code", "Name", "Status", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "
  ]
  const tableDataNames = ["index+1", "dataObj.code", "dataObj.name", 'dataObj.active ? ACTIVE : INACTIVE', " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "]



  return (
    <div onKeyDown={handleKeyDown} className='px-5'>
      <div className='w-full flex justify-between mb-2 items-center px-0.5'>
        <h5 className='my-1 text-xl'>Country Master</h5>
        <div className='flex items-center'>
          <button onClick={() => { setForm(true); onNew() }} className='bg-green-500 text-white px-3 py-1 button rounded shadow-md'>+ New</button>
        </div>
      </div>
      <div className='w-full flex items-start'>

        <Mastertable
          header={'Countries list'}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onDataClick={onDataClick}
          // setOpenTable={setOpenTable}
          tableHeaders={tableHeaders}
          tableDataNames={tableDataNames}
          data={allData?.data}
          loading={
            isLoading || isFetching
          } />

        <div>
          {form === true && <Modal isOpen={form} form={form} widthClass={"w-[40%] h-[40%]"} onClose={() => { setForm(false); setErrors({}); }}>
            <MasterForm
              onNew={onNew}
              onClose={() => {
                setForm(false);
                setSearchValue("");
                setId(false);
              }}
              model={MODEL}
              childRecord={childRecord.current}
              saveData={saveData}
              setReadOnly={setReadOnly}
              deleteData={deleteData}
              readOnly={readOnly}
              emptyErrors={() => setErrors({})}
            >

              <fieldset className=' rounded '>

                <div className='p-2'>
                  <div className='flex'>
                    <div className='mb-3 w-[48%]'>
                      <TextInput name="Country Name" type="text" value={name} setValue={setName} required={true} readOnly={readOnly} />

                    </div>
                    <div className='mb-3 ml-5 w-[20%]'>
                      <TextInput name="Code" type="text" value={code} setValue={setCode} required={true} readOnly={readOnly} />
                    </div>
                  </div>
                  <ToggleButton name="Status" options={statusDropdown} value={active} setActive={setActive} required={true} readOnly={readOnly} />
                </div>
              </fieldset>
            </MasterForm>
          </Modal>}

        </div>
      </div>
    </div>
  )
}


