/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Switch, Upload } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { CreateFormWrapper, CreateModalWrapper, ModalCloseBox } from '../employees/EmployeesStyle';
import AvatarImage from '../../components/common/AvatarImage';
import { DropdownIconNew, ModalCloseIcon } from '../../theme/SvgIcons';
import { FieldBox, FlexWrapper, GridBox } from '../../theme/common_style';
import { clientAddApi, clientUpdateApi } from '../../services/api_collection';
import { toast } from 'react-toastify';
import uploadFileToS3, { deleteS3Object } from '../../utils/uploadS3Bucket';
import { Country, State } from 'country-state-city';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { getRegionFromDialCode } from '../../utils/common_functions';

const { Option } = Select;

const AddClient = ({ open, onClose, editDetails, handleGetList }) => {
  const [form] = Form.useForm();
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [countries, setCountries] = useState([]);
  const [contactCountryCode, setContactCountryCode] = useState(null);
  const [states, setStates] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const image_baseurl = process.env.REACT_APP_S3_BASE_URL;
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      let uploadPath;
      const values = form.getFieldsValue();
      if (profileImage && values?.profile_image) {
        const timestamp = Date.now();
        uploadPath = `clients/profileImg/${timestamp}.jpg`;
        try {
          if (editDetails?.profile_image) {
            await deleteS3Object(editDetails?.profile_image);
          }

          await uploadFileToS3(values?.profile_image, uploadPath);
        } catch (err) {
          console.error('S3 image update failed:', err);
        }
      }
      const payload = { ...values, profile_image: uploadPath };
      let res;
      if (editDetails) {
        res = await clientUpdateApi({ ...payload, clientId: editDetails?.id });
      } else {
        res = await clientAddApi(payload);
      }
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Client added successfully');
        handleGetList();
        onClose();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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

  const handleCountryChange = (countryName, statesKey, initialCountries) => {
    setStates([]);
    form.setFieldValue(statesKey, null);
    const allCountries = countries?.length > 0 ? countries : initialCountries;
    const selectedCountry = allCountries?.find((c) => c?.name === countryName);
    if (selectedCountry) {
      const selectedStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(selectedStates);
    }
  };

  useEffect(() => {
    setContactCountryCode(null);
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);

    if (editDetails) {
      handleCountryChange(editDetails?.country, 'state', allCountries);
      let region = getRegionFromDialCode(editDetails?.country_code + editDetails?.contact);
      setContactCountryCode({
        countryCode: region.toLocaleLowerCase(),
        dialCode: editDetails?.country_code
      });

      form.setFieldsValue({
        country: editDetails.country || undefined,
        city: editDetails.city || undefined,
        state: editDetails.state || undefined,
        name: editDetails.name || '',
        email: editDetails.email || '',
        skype_id: editDetails.skype_id || '',
        slack_id: editDetails.slack_id || '',
        address: editDetails.address || '',
        contact: editDetails.contact || '',
        country_code: editDetails.country_code || '',
        contact_number: editDetails.country_code + editDetails.contact,
        client_status:
          typeof editDetails.client_status === 'boolean' ? editDetails.client_status : false
      });
    } else {
      form.resetFields();
      setProfileImage(null);
      form.setFieldsValue({ client_status: true });
    }
  }, [editDetails]);

  return (
    <Modal
      open={open}
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
          <h2>{editDetails ? 'Edit' : 'Add New'} Client</h2>
        </div>

        <Form autoComplete="off" form={form} onFinish={handleCreate}>
          <CreateFormWrapper>
            <div className="upload-image">
              <AvatarImage
                style={{ width: '100px', height: '100px' }}
                image={image_baseurl + editDetails?.profile_image}
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
              <Form.Item name="profile_image" noStyle>
                <Input type="hidden" />
              </Form.Item>
            </div>

            <GridBox cols={2}>
              <FieldBox>
                <label>
                  Name <span>*</span>
                </label>
                <Form.Item
                  name="name"
                  validateFirst={true}
                  rules={[
                    { required: true, message: 'Name is required' },
                    {
                      validator: (_, value) =>
                        value && value.trim().length >= 2
                          ? Promise.resolve()
                          : Promise.reject(new Error('Name must be at least 2 characters'))
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter Your Name" />
                </Form.Item>
              </FieldBox>

              <FieldBox>
                <label>
                  Email <span>*</span>
                </label>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Email is required' },
                    {
                      type: 'email',
                      message: 'Please enter a valid email!'
                    }
                  ]}>
                  <Input prefixCls="form-input" type="email" placeholder="Enter Your Email" />
                </Form.Item>
              </FieldBox>
            </GridBox>

            <GridBox cols={3}>
              <FieldBox>
                <label>
                  Country <span>*</span>
                </label>
                <Form.Item
                  name="country"
                  rules={[{ required: true, message: 'Country is required' }]}>
                  <Select
                    prefixCls="form-select"
                    showSearch
                    suffixIcon={<DropdownIconNew />}
                    onChange={(countryName) => handleCountryChange(countryName, 'state')}
                    placeholder="--Select Option--">
                    {countries?.map((item, index) => (
                      <Option key={index} value={item.name} style={{ textTransform: 'capitalize' }}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label>State</label>
                <Form.Item name="state">
                  <Select
                    disabled={!states?.length}
                    prefixCls="form-select"
                    suffixIcon={<DropdownIconNew />}
                    showSearch
                    placeholder="--Select Option--">
                    {states?.map((item, index) => (
                      <Option key={index} value={item.name} style={{ textTransform: 'capitalize' }}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label>City</label>
                <Form.Item name="city">
                  <Input prefixCls="form-input" placeholder="Enter City" />
                </Form.Item>
              </FieldBox>
            </GridBox>
            <Form.Item name="country_code" noStyle>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="contact" noStyle>
              <Input type="hidden" />
            </Form.Item>

            <Form.Item name="profile_image" noStyle>
              <Input type="hidden" />
            </Form.Item>

            <GridBox cols={2}>
              <FieldBox>
                <label>Address</label>
                <Form.Item name="address">
                  <Input prefixCls="form-input" placeholder="Enter Your Address" />
                </Form.Item>
              </FieldBox>

              <FieldBox>
                <label>
                  Contact Number <span>*</span>
                </label>
                <Form.Item
                  name="contact_number"
                  validateFirst={true}
                  rules={[
                    { required: true, message: 'Contact Number is required' },
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
                            return Promise.reject('Invalid phone number for selected country');
                          }

                          if (regionCode === 'IN') {
                            const digitsOnly = value.replace(/\D/g, '');
                            let num = digitsOnly;
                            if (digitsOnly.startsWith('91')) {
                              num = digitsOnly.slice(2);
                            }
                            if (num.length !== 10) {
                              return Promise.reject('Invalid phone number for selected country');
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
                    country={'us'}
                    inputStyle={{
                      width: '100%',
                      height: '56px',
                      borderRadius: '6px',
                      border: '1px solid #dcdcdc',
                      fontSize: '14px',
                      paddingLeft: '48px'
                    }}
                    buttonStyle={{
                      border: 'none',
                      background: 'transparent'
                    }}
                    placeholder="Enter Your Contact Number"
                    onChange={(phone, data) => {
                      form.setFieldValue('contact', phone?.replace(data?.dialCode, ''));
                      form.setFieldValue('country_code', data?.dialCode);
                      setContactCountryCode(data);
                    }}
                    value={form.getFieldValue('country_code') + form.getFieldValue('contact')}
                  />
                </Form.Item>
              </FieldBox>
            </GridBox>

            <GridBox cols={2}>
              <FieldBox>
                <label>Communication ID</label>
                <Form.Item
                  name="skype_id"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(
                            new Error('Communication ID must contain only numbers')
                          );
                        }
                        if (value.length < 4 || value.length > 12) {
                          return Promise.reject(
                            new Error('Communication ID must be between 4 and 12 digits')
                          );
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter Your Communication ID" />
                </Form.Item>
              </FieldBox>

              <FieldBox>
                <label>Slack ID</label>
                <Form.Item
                  name="slack_id"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(new Error('Slack ID must contain only numbers'));
                        }
                        if (value.length < 4 || value.length > 12) {
                          return Promise.reject(
                            new Error('Slack ID must be between 4 and 12 digits')
                          );
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter Your Slack ID" />
                </Form.Item>
              </FieldBox>
            </GridBox>

            <GridBox cols={1}>
              <FieldBox>
                <label>Status</label>
                <Form.Item name="client_status">
                  <Switch
                    prefixCls="antdCustomSwitch"
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>
              </FieldBox>
            </GridBox>
          </CreateFormWrapper>

          <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }} cursor="default">
            <Button
              loading={loading}
              onClick={form.submit}
              style={{ width: '140px' }}
              prefixCls="antCustomBtn">
              Save
            </Button>
          </FlexWrapper>
        </Form>
      </CreateModalWrapper>
    </Modal>
  );
};

export default AddClient;
