import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

import {
  useGetEmpQuery,
  useCreateEmpMutation,
} from "../../../redux/services/preEmployee";
import EmployeeIdSelector from "./EmployeeIdSelector";

import Swal from "sweetalert2";
// import { stateCityData } from "./StateCityArray";
// import { getCommonParams } from "../../../Utils/helper";
// import { useGetCityQuery } from "../../../redux/services/CityMasterService";
// import { useGetStateQuery } from "../../../redux/services/StateMasterService";
// import { useGetCountriesQuery } from "../../../redux/services/CountryMasterService";
import {
  // customSelectStyles,
  DateInput,
  DropdownInput,
  TextArea,
  TextInput,
} from "../../../Inputs";
import { genderList, married } from "../../../Utils/DropdownData";
import moment from "moment";

const EmployeeForm = () => {
  // const params = getCommonParams();

  const [firstName, setFirstName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [email, setEmail] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");

  const [presentAddress, setPresentAddress] = useState({
    address: "",
    // cityId: "",
    // village: "",
    // stateId: "",
    // countryId: "",
    // pincode: "",
    // mobile: "",
  });
  const data = {
    firstName,
    dob,
    gender,
    aadharNo,
    panNo,
    maritalStatus,
    email,
    mobileNumber,
    presentAddress,
  };
  const { data: employees, refetch: refetchEmployees } = useGetEmpQuery();

  // const { data: cityList } = useGetCityQuery();

  // const { data: stateList } = useGetStateQuery();

  // const { data: countryList } = useGetCountriesQuery({ params });
  // const CountryOptions = countryList?.data?.map((val) => ({
  //   value: val?.id,
  //   label: val?.name,
  // }));

  function clearForm() {
    setEmail("");
    setAadharNo("");
    setMobileNumber("");
    setFirstName("");
    setDob("");
    setGender("");
    setMaritalStatus("");
    setPanNo("");
    setPresentAddress({
      address: "",
    });
  }
  const validateData = (data) => {
    if (
      data?.aadharNo &&
      data?.mobileNumber &&
      data?.firstName &&
      data?.dob &&
      data?.gender &&
      data?.email
      // data?.presentAddress.stateId &&
      // data?.presentAddress.countryId
    ) {
      return true;
    }

    return false;
  };
  // const getFilteredStates = (countryId) =>
  //   stateList?.data
  //     ?.filter((s) => s.countryId === countryId)
  //     ?.map((s) => ({ value: s.id, label: s.name }));

  // const getFilteredCities = (stateId) =>
  //   cityList?.data
  //     ?.filter((c) => c.stateId === stateId)
  //     ?.map((c) => ({ value: c.id, label: c.name }));

  const [addData] = useCreateEmpMutation();
  const handleSubmitCustom = async (callback, data) => {
    try {
      let returnData;

      // Submit the data
      returnData = await callback(data).unwrap();

      // Show success
      Swal.fire({
        icon: "success",
        title: `Saved Successfully`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Clear the form
      clearForm();

      return returnData;
    } catch (error) {
      // Show error
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.data?.message || "Something went wrong!",
      });
      console.log("handle");
    } finally {
      // Always refetch the employee list after saving (success or fail)
      refetchEmployees();
    }
  };
  const saveData = async () => {
    if (!validateData(data)) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Please fill all required fields...!",
      });
      return;
    }

    let response;

    response = await handleSubmitCustom(addData, data);

    if (
      response?.statusCode === 1 &&
      response?.message === "EMAIL Already exists"
    ) {
      Swal.fire({
        icon: "error",
        title: "Submission error",
        text: "Email already exists. Please use a different email.",
      });

      return;
    }
  };

  const handlePresentChange = (field, value) => {
    setPresentAddress((prev) => {
      const updated = { ...prev, [field]: value };

      return updated;
    });
  };
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      employeeId: "",
      fullName: "",
      dob: "",
      gender: "",
      aadhaar: "",
      pan: "",
      marriedStatus: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",

      state: "",
      postalCode: "",
      country: "",
    },
  });

  const [employeeId, setEmployeeId] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const employeeData = employees?.data || [];

  const filteredEmployees =
    searchPhone.length >= 3 // or exact 10 digits
      ? employeeData.filter((emp) => emp.mobileNumber?.includes(searchPhone))
      : [];

  const handlePhoneSearch = (value) => {
    const cleanedValue = value.replace(/\D/g, "").slice(0, 10);
    setSearchPhone(cleanedValue);
    if (cleanedValue.length !== 10) {
      setEmployeeId("");
      reset();
    }
  };

  const handleEmployeeSelect = (docId) => {
    setValue("employeeId", docId);
    const selectedEmployee = employeeData.find((emp) => emp.docId === docId);
    if (selectedEmployee) {
      setFirstName(selectedEmployee?.firstName || "");
      setAadharNo(selectedEmployee?.aadharNo || "");
      setMobileNumber(selectedEmployee?.mobileNumber || "");
      setDob(moment.utc(selectedEmployee?.dob).format("YYYY-MM-DD") || "");
      setGender(selectedEmployee?.gender || "");
      setMaritalStatus(selectedEmployee?.maritalStatus || "");
      setPanNo(selectedEmployee?.panNo || "");
      setEmail(selectedEmployee?.email || "");
      setMobileNumber(selectedEmployee?.mobileNumber || "");
      setPresentAddress((prev) => ({
        ...prev,
        address: selectedEmployee?.presentAddress || "",
      }));
    }
    setEmployeeId(docId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 px-4 py-3">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {/* NOBLE CLOTHING COMPANY{' '} */}
                <span className="block text-sm font-normal text-gray-300">
                  Employee Registration Form
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex items-center bg-white/20 rounded-lg overflow-hidden w-full sm:w-56">
                  <FaPhone className="w-4 h-4 text-white ml-2" />
                  <input
                    type="tel"
                    value={searchPhone}
                    onChange={(e) => handlePhoneSearch(e.target.value)}
                    placeholder="Search by Phone"
                    className="w-full bg-transparent text-white placeholder-white/70 py-1 px-2 text-sm focus:outline-none"
                    maxLength="10"
                  />
                </div>
                <EmployeeIdSelector
                  employeeId={employeeId}
                  employees={filteredEmployees}
                  onChange={handleEmployeeSelect}
                  className="bg-indigo-400 text-gray-800 hover:bg-indigo-500 w-full sm:w-40 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Personal Information Section */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold flex items-center gap-1 text-gray-800">
                <FaUser className="w-4 h-4 text-indigo-500" />
                Personal Information
              </legend>
              <div className="flex gap-3 gap-x-8">
                <div className="w-30">
                  <TextInput
                    name="Adhaar No"
                    value={aadharNo}
                    setValue={setAadharNo}
                    required={true}
                    type="number"
                  />
                </div>
                <div className="w-">
                  <TextInput
                    name="Name"
                    value={firstName}
                    setValue={setFirstName}
                    required={true}
                  />
                </div>
                <div className="w-">
                  <DateInput
                    name="Date of Birth"
                    value={dob}
                    setValue={setDob}
                    required={true}
                  />
                </div>
                <div className="w-">
                  <DropdownInput
                    name="Gender"
                    value={gender}
                    setValue={setGender}
                    options={genderList}
                    required={true}
                  />
                </div>

                <div className="w-">
                  <TextInput name="Pan No" value={panNo} setValue={setPanNo} />
                </div>
                <div className="w-">
                  <DropdownInput
                    name="Marital Status"
                    value={maritalStatus}
                    setValue={setMaritalStatus}
                    // required={true}
                    options={married}
                  />
                </div>
              </div>
            </fieldset>

            {/* Contact Information Section */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold flex items-center gap-1 text-gray-800">
                <FaEnvelope className="w-4 h-4 text-indigo-500" />
                Contact Information
              </legend>
              <div className="flex gap-x-8 gap-3">
                <div className="w-72">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm  
          "
                  />
                </div>

                <TextInput
                  name="Mobile Number"
                  value={mobileNumber}
                  type="number"
                  setValue={setMobileNumber}
                  required={true}
                />
              </div>
            </fieldset>

            {/* Address Information Section */}
            <fieldset className="space-y-4">
              <legend className="text-lg font-semibold flex items-center gap-1 text-gray-800">
                <FaMapMarkerAlt className="w-4 h-4 text-indigo-500" />
                Address Information
              </legend>
              <div className="flex gap-x-6 flex-wrap">
                <div className="w-72">
                  <TextArea
                    inputClass="h-12"
                    name="Address"
                    value={presentAddress?.address}
                    setValue={(val) => handlePresentChange("address", val)}
                  />
                  {errors.address && (
                    <span className="text-red-500 text-xs ml-1">
                      {errors.address}
                    </span>
                  )}
                </div>
                {/* <div className="w-[250px]">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={CountryOptions}
                    value={
                      CountryOptions?.find(
                        (opt) => opt.value === presentAddress?.countryId
                      ) || null
                    }
                    onChange={(selected) =>
                      handlePresentChange("countryId", selected?.value || "")
                    }
                    placeholder="Select Country"
                    isClearable={false} // same as required
                    isSearchable
                    menuShouldScrollIntoView={false}
                    maxMenuHeight={150} // <-- Reduce height here
                    onInputChange={(value) => value.toUpperCase()}
                    className="w-full px-1 -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                    styles={customSelectStyles}
                  />
                </div>
                <div className="col-span-1 w-[250px] mb-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={getFilteredStates(presentAddress?.countryId)}
                    value={
                      getFilteredStates(presentAddress?.countryId)?.find(
                        (opt) => opt.value === presentAddress?.stateId
                      ) || null
                    }
                    onChange={(selected) =>
                      handlePresentChange("stateId", selected?.value || "")
                    }
                    placeholder="Select State"
                    isClearable={false} // same as required
                    isSearchable
                    menuShouldScrollIntoView={false}
                    maxMenuHeight={150} // <-- Reduce height here
                    onInputChange={(value) => value.toUpperCase()}
                    className="w-full px-1 -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                    styles={customSelectStyles}
                  />
                </div>

                <div className="w-[250px]">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <Select
                    options={getFilteredCities(presentAddress?.stateId)}
                    value={
                      getFilteredCities(presentAddress?.stateId)?.find(
                        (opt) => opt.value === presentAddress?.cityId
                      ) || null
                    }
                    onChange={(selected) =>
                      handlePresentChange("cityId", selected?.value || "")
                    }
                    placeholder="Select City"
                    isClearable={false} // same as required
                    isSearchable
                    menuShouldScrollIntoView={false}
                    maxMenuHeight={150} // <-- Reduce height here
                    onInputChange={(value) => value.toUpperCase()}
                    className="w-full px-1 -ml-1 text-xs rounded-lg
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-150 shadow-sm"
                    styles={customSelectStyles}
                  />
                </div> */}
                {/* <div className="w-60">
                  <TextInput
                    name="Village"
                    value={presentAddress?.village}
                    setValue={(val) => handlePresentChange("village", val)}
                  />
                </div>

                <div className="w-30">
                  <TextInput
                    name="Pincode"
                    value={presentAddress?.pincode}
                    setValue={(val) => handlePresentChange("pincode", val)}
                  />
                </div> */}
              </div>
            </fieldset>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                onClick={saveData}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors duration-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
