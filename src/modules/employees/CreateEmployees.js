/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, Upload } from 'antd';
import { CreateFormWrapper, CreateModalWrapper, ModalCloseBox } from './EmployeesStyle';
import { DropdownIconNew, ModalCloseIcon } from '../../theme/SvgIcons';
import AvatarImage from '../../components/common/AvatarImage';
import { FieldBox, FlexWrapper, GridBox } from '../../theme/common_style';
import { toast } from 'react-toastify';
import uploadFileToS3 from '../../utils/uploadS3Bucket';
import { createEmployeeApi, updateEmployeeApi } from '../../redux/employee/apiRoute';
import dayjs from 'dayjs';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
const { Option } = Select;
import PhoneInput from 'react-phone-input-2';
import { Country, State } from 'country-state-city';
import useTechnologyOptions from '../../hooks/useTechnologyOptions';
import useDesignationOptions from '../../hooks/useDesignationOptions';
import StepThree from './view-employee/components/create-employee-setps/StepThree';
import StepTwo from './view-employee/components/create-employee-setps/StepTwo';
import StepFour from './view-employee/components/create-employee-setps/StepFour';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { capitalizeFirstLetter } from '../../utils/common_functions';

const CreateEmployees = ({ open, onClose, handleGetAllEmployees, editDetails }) => {
  const [current, setCurrent] = useState(1);
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [profileImage, setProfileImage] = useState(null);
  const [contactNumberValue, setContactNumberValue] = useState('');
  const [contactCountryCode, setContactCountryCode] = useState(null);
  const [emergencyNumberValue, setEmergencyNumberValue] = useState('');
  const [emergencyCountryCode, setEmergencyCountryCode] = useState(null);
  const [whatsAppNumberValue, setWhatsAppNumberValue] = useState('');
  const [whatsAppCountryCode, setWhatsAppCountryCode] = useState(null);
  console.log(whatsAppCountryCode, 'whatsAppCountryCode');
  const [form] = Form.useForm();
  // const [step1Data, setStep1Data] = useState({}); // Store Step 1 data
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { options: departmentOptions, loading: loadingDepartments } = useDepartmentOptions();
  const [designationOptions, setDesignationOptions] = useState([]);
  console.log(designationOptions, 'designationOptions');
  const image_baseurl = process.env.REACT_APP_S3_BASE_URL;
  const { options: technologyOptions } = useTechnologyOptions();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [pStates, setPStates] = useState([]);

  const handleImageUpload = (info) => {
    if (info.file.originFileObj) {
      setProfileImage(URL.createObjectURL(info.file.originFileObj));
      form.setFieldsValue({ profile_image: info.file.originFileObj });
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Only image files (PNG, JPEG, JPG) are allowed!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // const handleNext = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     setStep1Data(values); // Save Step 1 data in state
  //   } catch (errorInfo) {
  //     if (errorInfo.errorFields.length > 0) {
  //       form.scrollToField(errorInfo.errorFields[0].name);
  //     }
  //   }
  // };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const step2Values = await form.validateFields();
      const profile_image = await form.getFieldValue('profile_image');
      // let encryptedPan;
      // if (step1Data?.pan_no) {
      //   encryptedPan = CryptoJS.AES.encrypt(
      //     step1Data?.pan_no,
      //     process.env.REACT_APP_CRYPTO_SECRET_KEY
      //   ).toString();
      // }

      if (step2Values?.isSameAddress) {
        step2Values.P_address_line_one = step2Values?.cu_address_line_one;
        step2Values.P_address_line_two = step2Values?.cu_address_line_two;
        step2Values.P_city = step2Values?.cu_city;
        step2Values.P_country = step2Values?.cu_country;
        step2Values.P_state = step2Values?.cu_state;
        step2Values.P_postalcode = step2Values?.cu_postalcode;
      }
      // const finalData = { ...step1Data, ...step2Values, pan_no: encryptedPan };
      const values = await form.validateFields();

      const matchDepartment = departmentOptions?.find((val) => val?.label == values?.department);
      const matchedDesignation = designationOptions.find(
        (item) => item?.designation === values?.designation
      );

      const req = {
        ...values,
        department: matchDepartment?.value,
        designation: matchedDesignation?.id
      };
      let uploadPath;
      const payload = {
        ...req,
        profile_image: uploadPath,
        contact_number: form
          .getFieldValue('contact_number')
          .replace(`+${contactCountryCode?.dialCode}`, '')
          .trim()
          .replace(/\s/g, ''),
        emergency_contact_number: form
          .getFieldValue('emergency_contact_number')
          .replace(`+${emergencyCountryCode?.dialCode}`, '')
          .trim()
          .replace(/\s/g, ''),
        whatsapp_number: form
          .getFieldValue('whatsapp_number')
          .replace(`+${whatsAppCountryCode?.dialCode}`, '')
          .trim()
          .replace(/\s/g, ''),
        contact_number_country_code: '+' + contactCountryCode?.dialCode,
        emergency_contact_number_country_code: '+' + emergencyCountryCode?.dialCode,
        whatsapp_number_country_code: '+' + whatsAppCountryCode?.dialCode
      };
      if (editDetails) {
        payload.id = editDetails?.id;
      }
      let res;
      if (editDetails) {
        res = await updateEmployeeApi(payload);
      } else {
        res = await createEmployeeApi(payload);
      }
      if (res?.statusCode === 200) {
        if (profileImage && res?.data?.emp_id) {
          uploadPath = `employee/profileImg/${res?.data?.emp_id}.jpg`;
          try {
            // Delete previous image
            // await deleteS3Object(editDetails?.profile_image);
            // Upload new image
            await uploadFileToS3(profile_image, uploadPath);
          } catch (err) {
            console.error('S3 image update failed:', err);
            // alert('Failed to update profile image. Please try again.');
          }
        }
        toast.success(res?.message);
        setEmployeeId(res?.data?.emp_id);
        handleGetAllEmployees();
        if (res?.data?.emp_id) {
          setCurrent(current + 1);
        } else {
          onClose();
        }
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (errorInfo) {
      toast.error(errorInfo?.message || 'Something went wrong');
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    } finally {
      setLoading(false);
    }
  };

  function getRegionFromDialCode(phoneNumber) {
    if (!phoneNumber) return null;
    let num = phoneNumber.replace('+', '');
    try {
      const number = phoneUtil.parse(`+${num}`);
      const region = phoneUtil.getRegionCodeForNumber(number);
      return region;
    } catch (error) {
      return null;
    }
  }

  // const formatIndianPhoneNumber = (value) => {
  //   if (!value) return '';
  //   const digits = value?.replace(/\D/g, ''); // Remove non-digit characters
  //   const withCountryCode = digits?.startsWith('91') ? digits : `91${digits}`;
  //   const trimmed = withCountryCode?.slice(0, 12); // 91 + 10 digits

  //   const formatted = trimmed?.replace(
  //     /^(\d{2})(\d{5})(\d{0,5})$/,
  //     (_, cc, part1, part2) => `+${cc} ${part1}${part2 ? ' ' + part2 : ''}`
  //   );

  //   return formatted;
  // };

  const fetchDesignation = async () => {
    const id = departmentOptions?.find(
      (el) => el?.label === form.getFieldValue('department')
    )?.value;
    const res = await useDesignationOptions(id);
    setDesignationOptions(res);
  };

  const handleCountryChange = (countryName, type, statesKey, countryNames) => {
    let allCountries = countryNames || countries;
    const selectedCountry = allCountries.find((c) => c.name === countryName);
    if (selectedCountry) {
      const selectedStates = State.getStatesOfCountry(selectedCountry.isoCode);
      if (type === 'cur') {
        setStates(selectedStates);
      } else {
        setPStates(selectedStates);
      }
      if (statesKey) {
        form.setFieldsValue({ [statesKey]: undefined });
      }
    }
  };

  const getImage = (id) => {
    if (!profileImage) {
      return `${image_baseurl}employee/profileImg/${id}.jpg`;
    }
    return profileImage;
  };

  useEffect(() => {
    const defaultCountry = 'India';
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);

    handleCountryChange(
      editDetails ? editDetails?.currentAddress?.country : defaultCountry,
      'cur',
      null,
      allCountries
    );
    handleCountryChange(
      editDetails ? editDetails?.permanentAddress?.country : defaultCountry,
      'per',
      null,
      allCountries
    );

    if (editDetails) {
      const {
        first_name,
        last_name,
        middle_name,
        date_of_joining,
        email,
        contact_number,
        martial_status,
        pan_no,
        old_id,
        blood_group,
        date_of_birth,
        emergency_contact_number,
        gender,
        profile_image,
        currentAddress,
        isSameAddress,
        whatsapp_number,
        personal_email,
        id,
        permanentAddress,
        designation,
        department,
        technologies,
        contact_number_country_code,
        emergency_contact_number_country_code,
        whatsapp_number_country_code,
        udid
      } = editDetails;

      setContactCountryCode({
        dialCode: contact_number_country_code?.replace('+', ''),
        countryCode: getRegionFromDialCode(contact_number)
      });
      setEmergencyCountryCode({
        dialCode: emergency_contact_number_country_code?.replace('+', ''),
        countryCode: getRegionFromDialCode(emergency_contact_number)
      });
      console.log(contact_number, 'whatsapp_number', emergency_contact_number);
      setWhatsAppCountryCode({
        dialCode: whatsapp_number_country_code?.replace('+', ''),
        countryCode: getRegionFromDialCode(whatsapp_number)
      });
      let cValue = contact_number_country_code?.replace('+', '');
      let eValue = emergency_contact_number_country_code?.replace('+', '');
      let contact = contact_number?.slice(cValue?.length);
      let emergency = emergency_contact_number?.slice(eValue?.length);
      setContactNumberValue(contact);
      setEmergencyNumberValue(emergency);

      form.setFieldsValue({
        first_name,
        last_name,
        date_of_joining: dayjs(date_of_joining),
        email,
        contact_number: contact_number,
        // role_id: role?.id,
        profile_image,
        cu_address_line_one: currentAddress?.address_line_one,
        cu_address_line_two: currentAddress?.address_line_two,
        cu_city: currentAddress?.city,
        cu_country: currentAddress?.country,
        cu_state: currentAddress?.state,
        cu_postalcode: currentAddress?.postalcode,
        isSameAddress: isSameAddress?.isSameAddress,
        middle_name,
        martial_status,
        pan_no: pan_no || '',
        old_id,
        blood_group,
        date_of_birth: dayjs(date_of_birth),
        emergency_contact_number: emergency_contact_number ? emergency_contact_number : null,
        whatsapp_number: whatsapp_number,
        gender,
        emp_id: id,
        personal_email: personal_email,
        P_address_line_one: permanentAddress?.address_line_one,
        P_address_line_two: permanentAddress?.address_line_two,
        P_city: permanentAddress?.city,
        P_country: permanentAddress?.country,
        P_state: permanentAddress?.state,
        P_postalcode: permanentAddress?.postalcode,
        department: department,
        designation: designation,
        technologies: technologies?.map((el) => el?.label),
        udid: udid || ''
      });
    } else {
      form.setFieldsValue({
        cu_country: defaultCountry,
        P_country: defaultCountry
      });
    }
  }, [editDetails]);

  return (
    <Modal
      open={open}
      maskClosable={false}
      onCancel={onClose}
      centered
      width={1000}
      footer={null}
      prefixCls="create-employees"
      closeIcon={false}>
      <CreateModalWrapper>
        <ModalCloseBox onClick={onClose}>
          <ModalCloseIcon />
        </ModalCloseBox>
        <div className="title">
          <h2>{editDetails ? 'Edit' : 'Add New'} Employee</h2>
        </div>
        {!editDetails && (
          <div className="steps">
            <div className="flex-between">
              <p>
                {current === 1
                  ? 'Basic Information'
                  : current === 2
                  ? 'Address'
                  : current === 3
                  ? 'Education'
                  : 'Bank Details'}
              </p>
              <p>Step {current} of 4</p>
            </div>
            <div className="flex-between">
              <p className="lines" style={{ background: current > 1 && '#7c71ff' }}></p>
              <p className="lines" style={{ background: current > 2 && '#7c71ff' }}></p>
              <p className="lines" style={{ background: current > 3 && '#7c71ff' }}></p>
              <p className="lines"></p>
            </div>
          </div>
        )}
        <>
          {current === 1 && (
            <CreateFormWrapper>
              <Form
                autoComplete="off"
                form={form}
                onFinish={handleCreate}
                onValuesChange={(changedValues) => {
                  if (changedValues?.department) {
                    form.resetFields(['designation']);
                    fetchDesignation();
                  }
                }}>
                {() => (
                  <>
                    <div className="upload-image">
                      <AvatarImage
                        style={{ width: '100px', height: '100px' }}
                        image={getImage(editDetails?.id)}
                        name={false}
                        preview={profileImage}
                      />
                      <Upload
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleImageUpload}>
                        <p>Upload Profile Photo</p>
                        <input type="file" style={{ display: 'none' }} />
                      </Upload>
                    </div>
                    <GridBox cols={3}>
                      <FieldBox>
                        <label>
                          First Name <span>*</span>
                        </label>
                        <Form.Item
                          name="first_name"
                          type="text"
                          rules={[
                            { required: true, message: 'First Name is required' },
                            { min: 2, message: 'First Name must be at least 2 characters' },
                            { max: 30, message: 'First Name cannot be more than 30 characters' }
                          ]}
                          normalize={capitalizeFirstLetter}>
                          <Input
                            prefixCls="form-input"
                            placeholder="Enter First Name"
                            maxLength={30}
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>Middle Name</label>
                        <Form.Item
                          name="middle_name"
                          type="text"
                          rules={[
                            { min: 2, message: 'Middle Name must be at least 2 characters' },
                            { max: 30, message: 'Middle Name cannot be more than 30 characters' }
                          ]}>
                          <Input
                            prefixCls="form-input"
                            placeholder="Enter Middle Name"
                            maxLength={30}
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>Last Name</label>
                        <Form.Item
                          name="last_name"
                          type="text"
                          rules={[
                            { min: 2, message: 'Last Name must be at least 2 characters' },
                            { max: 30, message: 'Last Name cannot be more than 30 characters' }
                          ]}>
                          <Input
                            prefixCls="form-input"
                            placeholder="Enter Last Name"
                            maxLength={30}
                          />
                        </Form.Item>
                      </FieldBox>
                    </GridBox>
                    <GridBox cols={4}>
                      <FieldBox>
                        <label>
                          Date of Birth <span>*</span>
                        </label>
                        <Form.Item
                          name="date_of_birth"
                          rules={[{ required: true, message: 'Date of Birth is required' }]}>
                          <DatePicker
                            prefixCls="form-datepicker"
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                            defaultPickerValue={dayjs().subtract(14, 'year')}
                            disabledDate={(current) =>
                              current && current.isAfter(dayjs().subtract(14, 'year'), 'day')
                            }
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>
                          Gender <span>*</span>
                        </label>
                        <Form.Item
                          name="gender"
                          rules={[{ required: true, message: 'Gender is required' }]}>
                          <Select
                            prefixCls="form-select"
                            suffixIcon={<DropdownIconNew />}
                            placeholder="--Select Option--">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                          </Select>
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>Blood Group</label>
                        <Form.Item name="blood_group">
                          <Select
                            prefixCls="form-select"
                            suffixIcon={<DropdownIconNew />}
                            placeholder="--Select Option--">
                            <Option value="A+">A+</Option>
                            <Option value="A-">A-</Option>
                            <Option value="B+">B+</Option>
                            <Option value="B-">B-</Option>
                            <Option value="O+">O+</Option>
                            <Option value="O-">O-</Option>
                            <Option value="AB+">AB+</Option>
                            <Option value="AB-">AB-</Option>
                          </Select>
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>Marital Status</label>
                        <Form.Item name="martial_status">
                          <Select
                            prefixCls="form-select"
                            suffixIcon={<DropdownIconNew />}
                            placeholder="--Select Option--">
                            <Option value="single">Single</Option>
                            <Option value="married">Married</Option>
                          </Select>
                        </Form.Item>
                      </FieldBox>
                    </GridBox>
                    <GridBox cols={2}>
                      <FieldBox>
                        <label>
                          Date of Joining <span>*</span>
                        </label>
                        <Form.Item
                          name="date_of_joining"
                          validateFirst={true}
                          rules={[{ required: true, message: 'Date of Joining is required' }]}>
                          <DatePicker
                            prefixCls="form-datepicker"
                            format="DD/MM/YYYY"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>Old Employee Code (if exist)</label>
                        <Form.Item
                          name="old_id"
                          validateFirst={true}
                          rules={[
                            {
                              pattern: /^[0-9]{1,3}$/,
                              message: 'Employee ID must be between 1 and 3 digits'
                            }
                          ]}>
                          <Input
                            prefixCls="form-input"
                            placeholder="Enter Old Employee ID"
                            maxLength={3}
                          />
                        </Form.Item>
                      </FieldBox>
                    </GridBox>
                    <GridBox cols={3}>
                      <FieldBox>
                        <label>
                          Contact Number <span>*</span>
                        </label>
                        <Form.Item
                          name="contact_number"
                          validateFirst
                          rules={[
                            {
                              required: true,
                              message: 'Contact number is required'
                            },
                            {
                              validator: (_, value) => {
                                if (!value || !contactCountryCode?.countryCode) {
                                  return Promise.reject(
                                    'Please select a valid country and enter phone number'
                                  );
                                }

                                try {
                                  const regionCode = contactCountryCode.countryCode.toUpperCase();
                                  const parsedNumber = phoneUtil.parse(value, regionCode);

                                  // ✅ Strict region-based validation (fixes your issue)
                                  if (!phoneUtil.isValidNumberForRegion(parsedNumber, regionCode)) {
                                    return Promise.reject(
                                      'Invalid phone number for selected country'
                                    );
                                  }
                                  if (regionCode === 'IN') {
                                    const digitsOnly = value.replace(/\D/g, '');
                                    let num = digitsOnly;
                                    if (digitsOnly.startsWith('91')) {
                                      num = digitsOnly.slice(2);
                                    }
                                    if (num.length !== 10) {
                                      return Promise.reject(
                                        'Invalid phone number for selected country'
                                      );
                                    }
                                  }

                                  if (emergencyNumberValue === contactNumberValue) {
                                    return Promise.reject(
                                      `Contact number and emergency number must be different.`
                                    );
                                  }

                                  return Promise.resolve();
                                } catch (e) {
                                  return Promise.reject('Invalid phone number format');
                                }
                              }
                            }
                          ]}>
                          <PhoneInput
                            enableSearch
                            country={'in'}
                            inputStyle={{
                              width: '100%',
                              height: '52px',
                              borderRadius: '6px',
                              border: '1px solid #dcdcdc',
                              fontSize: '14px',
                              paddingLeft: '48px'
                            }}
                            value={contactNumberValue}
                            onChange={(value, data) => {
                              try {
                                const regionCode = data.countryCode?.toUpperCase();
                                const parsedNumber = phoneUtil.parse(value, regionCode);

                                const nationalNumber = parsedNumber.getNationalNumber().toString();
                                setContactNumberValue(nationalNumber); // This is WITHOUT country code
                                setContactCountryCode(data);
                                form.validateFields(['emergency_contact_number']);
                              } catch (e) {
                                setContactNumberValue(''); // fallback for invalid input
                                setContactCountryCode(data);
                              }
                            }}
                            buttonStyle={{
                              border: 'none',
                              background: 'transparent'
                            }}
                            inputProps={{
                              onKeyDown: (e) => {
                                const input = e.target;
                                const cursorPos = input.selectionStart;

                                // Block editing near the start (where country code is shown)
                                if (
                                  cursorPos <= 3 &&
                                  (e.key === 'Backspace' || e.key === 'Delete')
                                ) {
                                  e.preventDefault();
                                }
                              }
                            }}
                            placeholder="+91 98765 43210"
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>
                          Emergency Contact Number <span>*</span>
                        </label>
                        <Form.Item
                          name="emergency_contact_number"
                          validateFirst={true}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter emergency contact number'
                            },
                            {
                              validator: (_, value) => {
                                if (!value || !emergencyCountryCode?.countryCode) {
                                  return Promise.reject(
                                    'Please select a valid country and enter phone number'
                                  );
                                }

                                try {
                                  const regionCode = emergencyCountryCode.countryCode.toUpperCase();
                                  const parsedNumber = phoneUtil.parse(value, regionCode);

                                  // ✅ Strict region-based validation (fixes your issue)
                                  if (!phoneUtil.isValidNumberForRegion(parsedNumber, regionCode)) {
                                    return Promise.reject(
                                      'Invalid phone number for selected country'
                                    );
                                  }
                                  if (regionCode === 'IN') {
                                    const digitsOnly = value.replace(/\D/g, '');
                                    let num = digitsOnly;
                                    if (digitsOnly.startsWith('91')) {
                                      num = digitsOnly.slice(2);
                                    }
                                    if (num.length !== 10) {
                                      return Promise.reject(
                                        'Invalid phone number for selected country'
                                      );
                                    }
                                  }

                                  if (emergencyNumberValue === contactNumberValue) {
                                    return Promise.reject(
                                      `Contact number and emergency number must be different.`
                                    );
                                  }

                                  return Promise.resolve();
                                } catch (e) {
                                  return Promise.reject('Invalid phone number format');
                                }
                              }
                            }
                          ]}>
                          <PhoneInput
                            enableSearch
                            country={'in'}
                            inputStyle={{
                              width: '100%',
                              height: '52px',
                              borderRadius: '6px',
                              border: '1px solid #dcdcdc',
                              fontSize: '14px',
                              paddingLeft: '48px'
                            }}
                            value={emergencyNumberValue}
                            onChange={(value, data) => {
                              try {
                                const regionCode = data.countryCode?.toUpperCase();
                                const parsedNumber = phoneUtil.parse(value, regionCode);

                                const nationalNumber = parsedNumber.getNationalNumber().toString();
                                setEmergencyNumberValue(nationalNumber); // This is WITHOUT country code
                                setEmergencyCountryCode(data);
                                form.validateFields(['contact_number']);
                              } catch (e) {
                                setEmergencyNumberValue(''); // fallback for invalid input
                                setEmergencyCountryCode(data);
                              }
                            }}
                            buttonStyle={{
                              border: 'none',
                              background: 'transparent'
                            }}
                            inputProps={{
                              onKeyDown: (e) => {
                                const input = e.target;
                                const cursorPos = input.selectionStart;

                                // Block editing near the start (where country code is shown)
                                if (
                                  cursorPos <= 3 &&
                                  (e.key === 'Backspace' || e.key === 'Delete')
                                ) {
                                  e.preventDefault();
                                }
                              }
                            }}
                            placeholder="+91 98765 43210"
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>
                          WhatsApp Number <span>*</span>
                        </label>
                        <Form.Item
                          name="whatsapp_number"
                          validateFirst={true}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter whatsapp number'
                            },
                            {
                              validator: (_, value) => {
                                if (!value || !whatsAppCountryCode?.countryCode) {
                                  return Promise.reject(
                                    'Please select a valid country and enter phone number'
                                  );
                                }

                                try {
                                  const regionCode = whatsAppCountryCode.countryCode.toUpperCase();
                                  const parsedNumber = phoneUtil.parse(value, regionCode);

                                  console.log(regionCode, 'regionCode', parsedNumber);

                                  // ✅ Strict region-based validation (fixes your issue)
                                  if (!phoneUtil.isValidNumberForRegion(parsedNumber, regionCode)) {
                                    return Promise.reject(
                                      'Invalid phone number for selected country'
                                    );
                                  }

                                  if (regionCode === 'IN') {
                                    const digitsOnly = value.replace(/\D/g, '');
                                    let num = digitsOnly;
                                    if (digitsOnly.startsWith('91')) {
                                      num = digitsOnly.slice(2);
                                    }
                                    if (num.length !== 10) {
                                      return Promise.reject(
                                        'Invalid phone number for selected country'
                                      );
                                    }
                                  }

                                  return Promise.resolve();
                                } catch (e) {
                                  return Promise.reject('Invalid phone number format');
                                }
                              }
                            }
                          ]}>
                          <PhoneInput
                            enableSearch
                            country={'in'}
                            inputStyle={{
                              width: '100%',
                              height: '52px',
                              borderRadius: '6px',
                              border: '1px solid #dcdcdc',
                              fontSize: '14px',
                              paddingLeft: '48px'
                            }}
                            value={whatsAppNumberValue}
                            onChange={(value, data) => {
                              try {
                                const regionCode = data.countryCode?.toUpperCase();
                                const parsedNumber = phoneUtil.parse(value, regionCode);

                                const nationalNumber = parsedNumber.getNationalNumber().toString();
                                setWhatsAppNumberValue(nationalNumber); // 👉 This is WITHOUT country code
                                setWhatsAppCountryCode(data);
                              } catch (e) {
                                setWhatsAppNumberValue(''); // fallback for invalid input
                                setWhatsAppCountryCode(data);
                              }
                            }}
                            buttonStyle={{
                              border: 'none',
                              background: 'transparent'
                            }}
                            inputProps={{
                              onKeyDown: (e) => {
                                const input = e.target;
                                const cursorPos = input.selectionStart;

                                // Block editing near the start (where country code is shown)
                                if (
                                  cursorPos <= 3 &&
                                  (e.key === 'Backspace' || e.key === 'Delete')
                                ) {
                                  e.preventDefault();
                                }
                              }
                            }}
                            placeholder="+91 98765 43210"
                          />
                        </Form.Item>
                      </FieldBox>
                    </GridBox>
                    <GridBox cols={2}>
                      <FieldBox>
                        <label>
                          Email (Official) <span>*</span>
                        </label>
                        <Form.Item
                          name="email"
                          validateFirst={true}
                          rules={[
                            { required: true, message: 'Official Email is required' },
                            {
                              type: 'email',
                              message: 'Please enter a valid email!',
                              required: true
                            }
                          ]}>
                          <Input prefixCls="form-input" placeholder="Enter Official Email" />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>
                          Email (Personal) <span>*</span>
                        </label>
                        <Form.Item
                          name="personal_email"
                          validateFirst={true}
                          rules={[
                            { required: true, message: 'Personal Email is required' },
                            {
                              type: 'email',
                              message: 'Please enter a valid email!',
                              required: true
                            }
                          ]}>
                          <Input prefixCls="form-input" placeholder="Enter Personal Email" />
                        </Form.Item>
                      </FieldBox>
                    </GridBox>
                    <GridBox cols={2}>
                      <FieldBox>
                        <label>UIDAI</label>
                        <Form.Item
                          name="udid"
                          rules={[
                            {
                              pattern: /^\d+$/,
                              message: 'UIDAI number should contain only numbers'
                            },
                            {
                              min: 12,
                              max: 12,
                              message: 'UIDAI must be exactly 12 digits'
                            }
                          ]}>
                          <Input prefixCls="form-input" placeholder="Enter UIDAI" maxLength={12} />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label>PAN No.</label>
                        <Form.Item
                          name="pan_no"
                          rules={[
                            {
                              pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                              message:
                                'PAN number must be in format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)'
                            }
                          ]}>
                          <Input
                            prefixCls="form-input"
                            placeholder="Enter PAN no."
                            autoComplete="off"
                            maxLength={10}
                          />
                        </Form.Item>
                      </FieldBox>
                    </GridBox>
                    {!editDetails && (
                      <GridBox cols={3}>
                        <FieldBox>
                          <label>
                            Department <span>*</span>
                          </label>
                          <Form.Item
                            name="department"
                            rules={[{ required: true, message: 'Please select a department' }]}>
                            <Select
                              prefixCls="form-select"
                              suffixIcon={<DropdownIconNew />}
                              loading={loadingDepartments}
                              placeholder="--Select Option--">
                              {Array.isArray(departmentOptions) &&
                                departmentOptions?.map((el, index) => (
                                  <Option
                                    key={index}
                                    value={el?.label}
                                    style={{ textTransform: 'capitalize' }}>
                                    {el?.label}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </FieldBox>
                        <FieldBox>
                          <label>
                            Designation <span>*</span>
                          </label>
                          <Form.Item
                            name="designation"
                            rules={[{ required: true, message: 'Please select a designation' }]}>
                            <Select
                              prefixCls="form-select"
                              suffixIcon={<DropdownIconNew />}
                              placeholder="--Select Option--">
                              {Array.isArray(designationOptions) &&
                                designationOptions.map((el, index) => (
                                  <Option
                                    key={index}
                                    value={el?.designation}
                                    style={{ textTransform: 'capitalize' }}>
                                    {el?.designation}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </FieldBox>

                        <FieldBox>
                          <label>Technologies</label>
                          <Form.Item name="technologies">
                            <Select
                              mode="multiple"
                              maxTagCount={1}
                              prefixCls="antMultipleSelector"
                              suffixIcon={<DropdownIconNew />}
                              placeholder="--Select Option--">
                              {technologyOptions?.map((el, index) => (
                                <Option
                                  key={index}
                                  value={el?.label}
                                  style={{ textTransform: 'capitalize' }}>
                                  {el?.label}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </FieldBox>
                      </GridBox>
                    )}
                    <GridBox cols={1}>
                      {!editDetails && (
                        <FieldBox>
                          <label>
                            Password <span>*</span>
                          </label>
                          <Form.Item
                            name="password"
                            validateFirst={true}
                            rules={[
                              { required: true, message: 'Password is required' },
                              {
                                min: 8,
                                message: 'Password must be at least 8 characters'
                              },
                              {
                                pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                                message: 'Password must contain a number and a special character'
                              }
                            ]}>
                            <Input.Password
                              prefixCls="form-input"
                              placeholder="Enter Password"
                              autoComplete="off"
                            />
                          </Form.Item>
                        </FieldBox>
                      )}
                    </GridBox>
                    <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }}>
                      <Button
                        style={{ width: '140px' }}
                        prefixCls="antCustomBtn"
                        onClick={form.submit}
                        // onClick={() => setCurrent(current + 1)}
                        loading={loading}>
                        {' '}
                        {editDetails ? 'Save' : 'Next'}
                      </Button>
                      {/* {current < 4 ? (
              <Button
                style={{ width: '140px' }}
                prefixCls="antCustomBtn"
                Next
              </Button>
            ) : (
              <Button
                loading={loading}
                onClick={form.submit}
                style={{ width: '140px' }}
                prefixCls="antCustomBtn">
                Save
              </Button>
            )} */}
                    </FlexWrapper>
                  </>
                )}
              </Form>
            </CreateFormWrapper>
          )}
          {current === 2 && (
            <StepTwo
              current={current}
              setCurrent={setCurrent}
              states={states}
              pStates={pStates}
              countries={countries}
              handleCountryChange={handleCountryChange}
              employeeId={employeeId}
              editDetails={editDetails}
            />
          )}
          {current === 3 && (
            <StepThree current={current} setCurrent={setCurrent} employeeId={employeeId} />
          )}
          {current === 4 && <StepFour employeeId={employeeId} onClose={onClose} />}
        </>
      </CreateModalWrapper>
    </Modal>
  );
};

export default CreateEmployees;
