/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Upload } from 'antd';
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
import { capitalizeFirstLetter, dateFormat } from '../../utils/common_functions';

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

  const [form] = Form.useForm();
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { options: departmentOptions, loading: loadingDepartments } = useDepartmentOptions();
  const [designationOptions, setDesignationOptions] = useState([]);
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

  const handleCreate = async () => {
    try {
      setLoading(true);
      const profile_image = await form.getFieldValue('profile_image');
      const values = await form.validateFields();

      const countryCode = (number, countryCode) => (number ? `+${countryCode?.dialCode}` : '');

      const payload = {
        ...values,
        date_of_birth: dateFormat(values?.date_of_birth),
        date_of_joining: dateFormat(values?.date_of_joining),
        contact_number: contactNumberValue,
        contact_number_country_code: '+' + contactCountryCode?.dialCode,
        emergency_contact_number: emergencyNumberValue || '',
        emergency_contact_number_country_code: countryCode(
          emergencyNumberValue,
          emergencyCountryCode
        ),
        whatsapp_number: whatsAppNumberValue || '',
        whatsapp_number_country_code: countryCode(whatsAppNumberValue, whatsAppCountryCode),
        udid: values?.udid ? values?.udid?.toString() : '',
        profile_image: '',
        ...(editDetails && { id: editDetails?.id })
      };

      const apiCall = editDetails ? updateEmployeeApi : createEmployeeApi;
      const res = await apiCall(payload);

      if (res?.statusCode === 200) {
        if (profileImage && res?.data?.emp_id) {
          const uploadPath = `employee/profileImg/${res?.data?.emp_id}.jpg`;
          try {
            await uploadFileToS3(profile_image, uploadPath);
          } catch (err) {
            console.error('S3 image update failed:', err);
          }
        }
        toast.success(res?.message);
        setEmployeeId(res?.data?.emp_id);
        handleGetAllEmployees();
        res?.data?.emp_id ? setCurrent(current + 1) : onClose();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (errorInfo) {
      toast.error(errorInfo?.message || 'Something went wrong');
      if (errorInfo?.errorFields?.length > 0) {
        form.scrollToField(errorInfo?.errorFields[0]?.name);
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

  const fetchDesignation = async () => {
    const id = form.getFieldValue('department');
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
        date_of_birth,
        date_of_joining,
        contact_number,
        emergency_contact_number,
        whatsapp_number,
        id,
        contact_number_country_code,
        emergency_contact_number_country_code,
        whatsapp_number_country_code
      } = editDetails;

      const contactWithCode = contact_number_country_code + contact_number;
      setContactCountryCode({
        dialCode: contact_number_country_code?.replace('+', ''),
        countryCode: getRegionFromDialCode(contactWithCode)
      });
      setContactNumberValue(contact_number);

      const emergencyWithCode = emergency_contact_number_country_code + emergency_contact_number;
      if (emergency_contact_number) {
        setEmergencyCountryCode({
          dialCode: emergency_contact_number_country_code?.replace('+', ''),
          countryCode: getRegionFromDialCode(emergencyWithCode)
        });
        setEmergencyNumberValue(emergency_contact_number);
      }

      const whatsappWithCode = whatsapp_number_country_code + whatsapp_number;
      if (whatsapp_number) {
        setWhatsAppCountryCode({
          dialCode: whatsapp_number_country_code?.replace('+', ''),
          countryCode: getRegionFromDialCode(whatsappWithCode)
        });
        setWhatsAppNumberValue(whatsapp_number);
      }

      form.setFieldsValue({
        ...editDetails,
        date_of_joining: dayjs(date_of_joining),
        contact_number: contactWithCode,
        date_of_birth: dayjs(date_of_birth),
        emergency_contact_number: emergency_contact_number ? emergencyWithCode : '',
        whatsapp_number: whatsapp_number ? whatsappWithCode : '',
        emp_id: id
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
                        <label htmlFor="first_name">
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
                        <label htmlFor="middle_name">Middle Name</label>
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
                        <label htmlFor="last_name">Last Name</label>
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
                        <label htmlFor="date_of_birth">
                          Date of Birth <span>*</span>
                        </label>
                        <Form.Item
                          name="date_of_birth"
                          rules={[{ required: true, message: 'Date of Birth is required' }]}>
                          <DatePicker
                            prefixCls="form-datepicker"
                            format="DD/MM/YYYY"
                            placeholder="DD/MM/YYYY"
                            style={{ width: '100%' }}
                            defaultPickerValue={dayjs().subtract(14, 'year')}
                            disabledDate={(current) =>
                              current && current.isAfter(dayjs().subtract(14, 'year'), 'day')
                            }
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label htmlFor="gender">
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
                        <label htmlFor="blood_group">Blood Group</label>
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
                        <label htmlFor="martial_status">Marital Status</label>
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
                        <label htmlFor="date_of_joining">
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
                        <label htmlFor="old_id">Old Employee Code (if exist)</label>
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
                        <label htmlFor="contact_number">
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
                                setContactNumberValue(nationalNumber);
                                setContactCountryCode(data);
                                form.validateFields(['emergency_contact_number']);
                              } catch (e) {
                                setContactNumberValue('');
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
                        <label htmlFor="emergency_contact_number">Emergency Contact Number</label>
                        <Form.Item
                          name="emergency_contact_number"
                          validateFirst={true}
                          rules={[
                            {
                              validator: (_, value) => {
                                const dialCode = emergencyCountryCode?.dialCode || '';
                                const isOnlyDialCode = value === dialCode;
                                if (!value || isOnlyDialCode) {
                                  return Promise.resolve();
                                }

                                if (!emergencyCountryCode?.countryCode) {
                                  return Promise.reject(
                                    'Please select a valid country and enter phone number'
                                  );
                                }

                                try {
                                  const regionCode = emergencyCountryCode.countryCode.toUpperCase();
                                  const parsedNumber = phoneUtil.parse(value, regionCode);

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
                                  const trimmedEmergency = emergencyNumberValue?.replace(/\D/g, '');
                                  const trimmedContact = contactNumberValue?.replace(/\D/g, '');

                                  if (trimmedEmergency && trimmedEmergency === trimmedContact) {
                                    return Promise.reject(
                                      'Contact number and emergency number must be different.'
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
                                if (nationalNumber == data?.dialCode) {
                                  setEmergencyNumberValue('');
                                } else {
                                  setEmergencyNumberValue(nationalNumber);
                                }
                                setEmergencyCountryCode(data);
                                form.validateFields(['contact_number']);
                              } catch (e) {
                                setEmergencyNumberValue('');
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
                        <label htmlFor="whatsapp_number">WhatsApp Number</label>
                        <Form.Item
                          name="whatsapp_number"
                          validateFirst={true}
                          rules={[
                            {
                              validator: (_, value) => {
                                const dialCode = whatsAppCountryCode?.dialCode || '';
                                const isOnlyDialCode = value === dialCode;

                                if (!value || isOnlyDialCode) {
                                  return Promise.resolve();
                                }

                                if (!whatsAppCountryCode?.countryCode) {
                                  return Promise.reject(
                                    'Please select a valid country and enter phone number'
                                  );
                                }

                                try {
                                  const regionCode = whatsAppCountryCode.countryCode.toUpperCase();
                                  const parsedNumber = phoneUtil.parse(value, regionCode);

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

                                if (nationalNumber == data?.dialCode) {
                                  setWhatsAppNumberValue('');
                                } else {
                                  setWhatsAppNumberValue(nationalNumber);
                                }
                                setWhatsAppCountryCode(data);
                              } catch (e) {
                                setWhatsAppNumberValue('');
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
                        <label htmlFor="email">
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
                        <label htmlFor="personal_email">
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
                        <label htmlFor="udid">UIDAI</label>
                        <Form.Item
                          name="udid"
                          rules={[
                            {
                              pattern: /^\d+$/,
                              message: 'UIDAI number should contain only numbers'
                            },
                            {
                              validator: (_, value) => {
                                if (!value) {
                                  return Promise.resolve();
                                }
                                const digits = (value ?? '').toString().replace(/\D/g, '');
                                if (digits.length < 12) {
                                  return Promise.reject(new Error('Maximum 12 digits allowed'));
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}>
                          <InputNumber
                            controls={false}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                            }}
                            prefixCls="form-input-number"
                            style={{ width: 500 }}
                            formatter={(value) => {
                              return (value ?? '')
                                .toString()
                                .replace(/\D/g, '')
                                .replace(/(\d{4})(?=\d)/g, '$1 ');
                            }}
                            parser={(value) => (value ?? '').toString().replace(/\D/g, '')}
                            maxLength={14}
                            placeholder="Enter UIDAI"
                          />
                        </Form.Item>
                      </FieldBox>
                      <FieldBox>
                        <label htmlFor="pan_no">PAN No.</label>
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
                          <label htmlFor="department">
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
                                    value={el?.value}
                                    style={{ textTransform: 'capitalize' }}>
                                    {el?.label}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </FieldBox>
                        <FieldBox>
                          <label htmlFor="designation">
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
                                    value={el?.id}
                                    style={{ textTransform: 'capitalize' }}>
                                    {el?.designation}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </FieldBox>

                        <FieldBox>
                          <label htmlFor="technologies">Technologies</label>
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
                          <label htmlFor="password">
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
                        loading={loading}>
                        {' '}
                        {editDetails ? 'Save' : 'Next'}
                      </Button>
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
