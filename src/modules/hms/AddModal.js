import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import {
  ClickWrapper,
  FieldBox,
  FlexWrapper,
  GreyText,
  PurpleText
} from '../../theme/common_style';
import { DropdownIconNew, HideDataIcon, LmsIcon, VisibleDataIcon } from '../../theme/SvgIcons';
import PropTypes from 'prop-types';
import {
  assignDevice,
  editDevice,
  getAllEmployees,
  getDeviceListing,
  hmsAddDevice
} from '../../services/api_collection';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import {
  devicesContainSpecification,
  deviceTypes,
  graphicsOptions,
  HmsSectionStepMap,
  hmsTabEnum,
  osOptions,
  ramOptions,
  storageOptions
} from '../../utils/constant';

const AddModal = ({ open, onClose, editing, handleGetDeviceListing, handleCount, data }) => {
  const activeTab = useSelector((state) => state?.HmsSlice?.HmsTab);
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [employeeListing, setEmployeeListing] = useState([]);
  const [employeeLoader, setEmployeeLoader] = useState(false);
  const [deviceListing, setDeviceListing] = useState([]);
  const [addDevice, setAddDevice] = useState(false);
  const [createData, setCreateData] = useState(null);
  const [current, setCurrent] = useState(HmsSectionStepMap[editing] || 1);

  const [form] = Form.useForm();

  const totalSteps = editing
    ? 1
    : devicesContainSpecification?.includes(form.getFieldValue('device_type'))
    ? 3
    : 2;

  const handleKeyPress = (e) => {
    const { key } = e;
    const isDigit = /\d/.test(key);
    const isDot = key === '.';
    const inputValue = e.currentTarget.value;

    if (isDot && inputValue.includes('.')) {
      e.preventDefault();
      return;
    }

    if (!isDigit && !isDot) {
      e.preventDefault();
    }
  };

  const parseValue = (value) => {
    if (!value) return '';
    const cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return `${parts[0]}.${parts.slice(1).join('')}`;
    }
    return cleaned;
  };

  const formatValue = (value) => {
    if (value === '' || value === undefined || value === null) return '';
    const [intPart, decimalPart] = String(value).split('.');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      if (activeTab === hmsTabEnum?.ASSIGNEE) {
        let res = await assignDevice(values?.assignee, values?.device_id);
        if (res?.statusCode === 200) {
          toast.success(res?.message);
          onClose();
          handleGetDeviceListing();
          handleCount();
        } else {
          toast.error(
            res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
          );
        }
      } else {
        setCreateData((prevData) => ({
          ...prevData,
          ...values
        }));
        if (current != totalSteps && editing == undefined) {
          setCurrent((prev) => prev + 1);
        } else {
          let res = editing
            ? await editDevice(
                {
                  ...createData,
                  ...values
                },
                data?.id
              )
            : await hmsAddDevice({
                ...createData,
                ...values
              });
          if (res.statusCode === 200) {
            toast.success(res?.message);
            onClose();
            handleGetDeviceListing();
            handleCount();
          } else {
            toast.error(
              res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
            );
          }
        }
      }
    } catch (error) {
      toast.error(error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllEmployee = async () => {
    setEmployeeLoader(true);
    let res = await getAllEmployees();
    if (res?.statusCode === 200) {
      setEmployeeLoader(false);
      setEmployeeListing(
        res?.data?.map((val) => ({
          label: val?.first_name,
          value: val?.id
        }))
      );
    } else {
      setEmployeeLoader(false);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
    }
  };

  const handleAllGetDeviceListing = async () => {
    let params = new URLSearchParams();
    params.append('limit', 200);
    params.append('pageNumber', 1);
    let res = await getDeviceListing(params);
    if (res?.statusCode === 200) {
      setDeviceListing(
        res?.data
          ?.filter((val) => val?.status === 'available')
          ?.map((item) => ({
            label: `${item?.device_type} - ${item?.device_id}`,
            value: item?.id
          }))
      );
    } else {
      setDeviceListing([]);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
    }
  };

  function getTitleByStep(step) {
    if (step === 1) return 'Basic Information';
    if (step === 2) return 'Procurement & Warranty';
    if (step === 3) return 'Specifications';
    return '';
  }

  useEffect(() => {
    if (editing && data) {
      const transformedData = {
        ...data,
        purchase_date: data?.purchase_date ? dayjs(data.purchase_date) : null,
        warranty_start_date: data?.warranty_start_date ? dayjs(data.warranty_start_date) : null,
        warranty_end_date: data?.warranty_end_date ? dayjs(data.warranty_end_date) : null
      };

      form.setFieldsValue(transformedData);
    }
  }, [editing, data]);

  useEffect(() => {
    handleGetAllEmployee();
    handleAllGetDeviceListing();
  }, []);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={500}
      footer={null}
      prefixCls="antCustomModal">
      <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
        {activeTab === hmsTabEnum?.INVENTORY
          ? editing
            ? editing
            : 'Add Hardware'
          : activeTab === hmsTabEnum?.ASSIGNEE && 'Assign Device'}
      </Title>

      {activeTab === hmsTabEnum?.INVENTORY && totalSteps > 1 && (
        <div className="steps">
          <div className="flex-between">
            <p>{getTitleByStep(current)}</p>
            <p>
              Step {current} of {totalSteps}
            </p>
          </div>
          <div className="flex-between">
            <p className="lines" style={{ background: current > 1 && '#7c71ff' }}></p>
            {totalSteps === 3 && (
              <p className="lines" style={{ background: current > 2 && '#7c71ff' }}></p>
            )}
            <p className="lines"></p>
          </div>
        </div>
      )}

      <Form form={form} onFinish={onFinish} style={{ margin: '28px 0' }}>
        {activeTab === hmsTabEnum?.ASSIGNEE ? (
          <>
            <FieldBox>
              <label htmlFor="assignee">
                Assign To <span>*</span>
              </label>
              <Form.Item
                name="assignee"
                rules={[{ required: true, message: 'Assignee is required' }]}>
                <Select
                  prefixCls="form-select"
                  allowClear
                  loading={employeeLoader}
                  showSearch
                  style={{ marginBottom: '10px' }}
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--"
                  options={employeeListing}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="device_id">
                Device Name <span>*</span>
              </label>
              <Form.Item
                name="device_id"
                rules={[{ required: true, message: 'Device Name is required' }]}>
                <Select
                  prefixCls="form-select"
                  allowClear
                  showSearch
                  style={{ marginBottom: '10px' }}
                  notFoundContent={'No Device Available'}
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--"
                  options={deviceListing}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </FieldBox>
          </>
        ) : activeTab === hmsTabEnum?.INVENTORY && current === 1 ? (
          <>
            <FieldBox>
              <label htmlFor="device_id">
                Device Name <span>*</span>
              </label>
              <Form.Item
                name="device_id"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || !value.trim()) {
                        return Promise.reject(new Error('Device Name is required'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}>
                <Input prefixCls="form-input" placeholder="Enter device name" maxLength={15} />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <FlexWrapper justify="space-between">
                <label htmlFor="device_type">
                  Device Type <span>*</span>
                </label>
                <ClickWrapper
                  onClick={() => {
                    form.setFieldValue('device_type', null);
                    setAddDevice(!addDevice);
                  }}>
                  <PurpleText>{addDevice ? '- Remove' : '+ Add'}</PurpleText>
                </ClickWrapper>
              </FlexWrapper>
              <Form.Item
                name="device_type"
                rules={[{ required: true, message: 'Device Type is required' }]}>
                {addDevice ? (
                  <Input
                    prefixCls="form-input"
                    placeholder="Enter your Device Type"
                    maxLength={25}
                  />
                ) : (
                  <Select
                    prefixCls="form-select"
                    allowClear
                    showSearch
                    onChange={() => setRendering(!rendering)}
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--"
                    options={deviceTypes}
                  />
                )}
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="brand">
                Brand <span>*</span>
              </label>
              <Form.Item
                name="brand"
                type="text"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || !value.trim()) {
                        return Promise.reject(new Error('Brand is required'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}>
                <Input prefixCls="form-input" placeholder="Enter Brand" maxLength={35} />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="model">
                Model <span>*</span>
              </label>
              <Form.Item
                name="model"
                type="text"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || !value.trim()) {
                        return Promise.reject(new Error('Model is required'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}>
                <Input prefixCls="form-input" placeholder="Enter Model" maxLength={35} />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="serial_number">
                Serial Number <span>*</span>
              </label>
              <Form.Item
                name="serial_number"
                type="text"
                validateFirst
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || !value.trim()) {
                        return Promise.reject(new Error('Serial Number is required'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}>
                <Input prefixCls="form-input" placeholder="Enter Serial Number" maxLength={30} />
              </Form.Item>
            </FieldBox>
          </>
        ) : current === 2 ? (
          <>
            {editing !== 'Warranty Info' && (
              <>
                <FieldBox>
                  <label htmlFor="purchase_date">
                    Purchase Date <span>*</span>
                  </label>
                  <Form.Item
                    name="purchase_date"
                    validateFirst={true}
                    rules={[{ required: true, message: 'Purchase Date is required' }]}>
                    <DatePicker
                      prefixCls="form-datepicker"
                      suffixIcon={<LmsIcon />}
                      format="DD/MM/YYYY"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </FieldBox>
                <FieldBox>
                  <label htmlFor="vendor_name">
                    Vendor Name <span>*</span>
                  </label>
                  <Form.Item
                    name="vendor_name"
                    type="text"
                    rules={[
                      { required: true, message: 'Vendor Name is required' },
                      { min: 2, message: 'Vendor Name must be at least 2 characters' },
                      { max: 50, message: 'Vendor Name must be at most 50 characters' }
                    ]}>
                    <Input prefixCls="form-input" placeholder="Enter Vendor Name" maxLength={50} />
                  </Form.Item>
                </FieldBox>
                <FieldBox style={{ margin: '20px 10px !important' }}>
                  <label htmlFor="invoice_number">
                    Invoice Number <span>*</span>
                  </label>
                  <Form.Item
                    name="invoice_number"
                    type="text"
                    rules={[
                      { required: true, message: 'Invoice Number is required' },
                      { min: 3, message: 'Invoice Number must be at least 3 characters' },
                      { max: 30, message: 'Invoice Number must be at most 30 characters' }
                    ]}>
                    <Input
                      prefixCls="form-input"
                      placeholder="Enter Invoice Number"
                      maxLength={30}
                    />
                  </Form.Item>
                </FieldBox>
              </>
            )}
            {editing !== 'Procurement Info' && (
              <>
                <FieldBox>
                  <div style={{ fontWeight: 600 }}>Warranty Period</div>
                </FieldBox>
                <FlexWrapper gap="10px" wrap="nowrap" width="100%">
                  <FieldBox style={{ width: '100%' }}>
                    <label htmlFor="warranty_start_date">Start Date</label>
                    <Form.Item name="warranty_start_date">
                      <DatePicker
                        prefixCls="form-datepicker"
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        suffixIcon={<LmsIcon />}
                      />
                    </Form.Item>
                  </FieldBox>
                  <FieldBox style={{ width: '100%' }}>
                    <label htmlFor="warranty_end_date">End Date</label>
                    <Form.Item
                      name="warranty_end_date"
                      dependencies={['warranty_start_date']}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const startDate = getFieldValue('warranty_start_date');
                            if (!value || !startDate) return Promise.resolve();
                            if (dayjs(value)?.isBefore(dayjs(startDate), 'day')) {
                              return Promise.reject(
                                new Error('End Date cannot be before Start Date')
                              );
                            }
                            return Promise.resolve();
                          }
                        })
                      ]}>
                      <DatePicker
                        prefixCls="form-datepicker"
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        suffixIcon={<LmsIcon />}
                      />
                    </Form.Item>
                  </FieldBox>
                </FlexWrapper>
                <FieldBox>
                  <label htmlFor="purchase_cost">
                    Purchase Cost <span>*</span>
                  </label>
                  <Form.Item
                    name="purchase_cost"
                    rules={[{ required: true, message: 'Purchase Cost is required' }]}
                    getValueFromEvent={(value) => (value == null ? '' : String(value))}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Enter Cost"
                      addonAfter={'₹'}
                      maxLength={20}
                      min={0}
                      prefixCls="form-input-number"
                      controls={false}
                      onKeyPress={handleKeyPress}
                      formatter={(value) => `${formatValue(value)}`}
                      parser={parseValue}
                    />
                  </Form.Item>
                </FieldBox>
              </>
            )}
          </>
        ) : (
          current == 3 && (
            <>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label htmlFor="cpu">
                  CPU <span>*</span>
                </label>
                <Form.Item
                  name="cpu"
                  type="text"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value || !value.trim()) {
                          return Promise.reject(new Error('CPU is required'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter CPU" maxLength={50} />
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label htmlFor="ram">
                  RAM <span>*</span>
                </label>
                <Form.Item
                  name="ram"
                  type="text"
                  rules={[{ required: true, message: 'RAM is required' }]}>
                  <Select
                    prefixCls="form-select"
                    allowClear
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--"
                    options={ramOptions}
                  />
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label htmlFor="storage">
                  Storage <span>*</span>
                </label>
                <Form.Item
                  name="storage"
                  type="text"
                  rules={[{ required: true, message: 'Storage is required' }]}>
                  <Select
                    prefixCls="form-select"
                    allowClear
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--"
                    options={storageOptions}
                  />
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label htmlFor="graphics">
                  Graphics <span>*</span>
                </label>
                <Form.Item
                  name="graphics"
                  type="text"
                  rules={[{ required: true, message: 'Graphics is required' }]}>
                  <Select
                    prefixCls="form-select"
                    allowClear
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--"
                    options={graphicsOptions}
                  />
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label htmlFor="operating_system">
                  Operating System <span>*</span>
                </label>
                <Form.Item
                  name="operating_system"
                  rules={[{ required: true, message: 'Operating System is required' }]}>
                  <Select
                    prefixCls="form-select"
                    allowClear
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<DropdownIconNew />}
                    placeholder="--Select Option--"
                    options={osOptions}
                  />
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label htmlFor="macORip_address">
                  MAC Address <span>*</span>
                </label>
                <Form.Item
                  name="macORip_address"
                  type="text"
                  rules={[
                    { required: true, message: 'MAC Address is required' },
                    {
                      pattern:
                        /^(([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2}))|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                      message:
                        'Please enter a valid MAC address (e.g., 00:1A:2B:3C:4D:5E) or IP address (e.g., 192.168.1.1)'
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter MAC Address" maxLength={30} />
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label htmlFor="user_name">
                  Username <span>*</span>
                </label>
                <Form.Item
                  name="user_name"
                  type="text"
                  rules={[
                    { required: true, message: 'Username is required' },
                    { min: 3, message: 'Username must be at least 3 characters' },
                    { max: 30, message: 'Username must be at most 30 characters' },
                    {
                      pattern: /^[A-Za-z0-9_-]+$/,
                      message:
                        'Username can only contain letters, numbers, underscores, and hyphens'
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter Username" maxLength={30} />
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <FlexWrapper justify="space-between">
                  <label htmlFor="password">
                    Password <span>*</span>
                  </label>
                  <ClickWrapper type="text" onClick={() => setPasswordVisible((prev) => !prev)}>
                    {passwordVisible ? (
                      <FlexWrapper gap="6px">
                        <VisibleDataIcon />
                        <GreyText>Hide</GreyText>
                      </FlexWrapper>
                    ) : (
                      <FlexWrapper gap="6px">
                        <HideDataIcon />
                        <GreyText>View</GreyText>
                      </FlexWrapper>
                    )}
                  </ClickWrapper>
                </FlexWrapper>
                <Form.Item
                  name="password"
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
                  <Input
                    prefixCls="form-input"
                    placeholder="Enter Password"
                    autoComplete="off"
                    visibilityToggle={false}
                    type={passwordVisible ? 'text' : 'password'}
                  />
                </Form.Item>
              </FieldBox>
            </>
          )
        )}
        <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }}>
          {current > 1 && !editing && (
            <Button
              style={{
                width: '140px',
                padding: '18px',
                borderRadius: '10px',
                border: '1px solid #111111'
              }}
              onClick={() => setCurrent(current - 1)}>
              Back
            </Button>
          )}
          {activeTab === hmsTabEnum?.INVENTORY && current < totalSteps ? (
            <Button style={{ width: '140px' }} prefixCls="antCustomBtn" onClick={form.submit}>
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
          )}
        </FlexWrapper>
      </Form>
    </Modal>
  );
};

AddModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  editing: PropTypes.string,
  handleGetDeviceListing: PropTypes.func,
  data: PropTypes.any,
  handleCount: PropTypes.func
};

export default AddModal;
