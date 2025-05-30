import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useEffect, useState } from 'react';
import { FieldBox, FlexWrapper, GreyText, PurpleText } from '../../theme/common_style';
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

const AddModal = ({
  open,
  onClose,
  activeTab,
  editing,
  handleGetDeviceListing,
  handleCount,
  data
}) => {
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [employeeListing, setEmployeeListing] = useState([]);
  const [employeeLoader, setEmployeeLoader] = useState(false);
  const [deviceListing, setDeviceListing] = useState([]);
  const [addDevice, setAddDevice] = useState(false);
  const [createData, setCreateData] = useState(null);
  const [current, setCurrent] = useState(
    editing === 'Basic Info'
      ? 1
      : ['Procurement Info', 'Warranty Info']?.includes(editing)
      ? 2
      : editing === 'Specifications'
      ? 3
      : 1
  );

  const Option = Select.Option;
  const [form] = Form.useForm();

  const totalSteps = editing
    ? 1
    : ['Desktop', 'Mac', 'Laptop']?.includes(form.getFieldValue('device_type'))
    ? 3
    : 2;

  const deviceTypes = [
    { label: 'Desktop', value: 'Desktop' },
    { label: 'Mac', value: 'Mac' },
    { label: 'Laptop', value: 'Laptop' },
    { label: 'Tablet', value: 'Tablet' },
    { label: 'iPhone', value: 'iPhone' },
    { label: 'Android', value: 'Android' },
    { label: 'Keyboard', value: 'Keyboard' },
    { label: 'Mouse', value: 'Mouse' },
    { label: 'Monitor', value: 'Monitor' },
    { label: 'Headphones', value: 'Headphones' }
  ];

  const ramOptions = [
    { label: '2 GB', value: '2 GB' },
    { label: '4 GB', value: '4 GB' },
    { label: '8 GB', value: '8 GB' },
    { label: '16 GB', value: '16 GB' },
    { label: '32 GB', value: '32 GB' },
    { label: '64 GB', value: '64 GB' },
    { label: '128 GB', value: '128 GB' },
    { label: '256 GB', value: '256 GB' }
  ];

  const storageOptions = [
    { label: '16 GB', value: '16 GB' },
    { label: '32 GB', value: '32 GB' },
    { label: '64 GB', value: '64 GB' },
    { label: '128 GB', value: '128 GB' },
    { label: '256 GB', value: '256 GB' },
    { label: '512 GB', value: '512 GB' },
    { label: '1 TB', value: '1 TB' },
    { label: '2 TB', value: '2 TB' },
    { label: '4 TB', value: '4 TB' },
    { label: '8 TB', value: '8 TB' }
  ];

  const graphicsOptions = [
    { label: 'Integrated Graphics', value: 'Integrated Graphics' },
    { label: 'Intel Iris Xe', value: 'Intel Iris Xe' },
    { label: 'Intel UHD Graphics', value: 'Intel UHD Graphics' },
    { label: 'AMD Radeon Graphics', value: 'AMD Radeon Graphics' },
    { label: 'AMD Radeon Pro', value: 'AMD Radeon Pro' },
    { label: 'Apple M1 GPU', value: 'Apple M1 GPU' },
    { label: 'Apple M2 GPU', value: 'Apple M2 GPU' },
    { label: 'Apple M3 GPU', value: 'Apple M3 GPU' },
    { label: 'NVIDIA GeForce GTX 1650', value: 'NVIDIA GeForce GTX 1650' },
    { label: 'NVIDIA GeForce RTX 3050', value: 'NVIDIA GeForce RTX 3050' },
    { label: 'NVIDIA GeForce RTX 3060', value: 'NVIDIA GeForce RTX 3060' },
    { label: 'NVIDIA GeForce RTX 3070', value: 'NVIDIA GeForce RTX 3070' },
    { label: 'NVIDIA GeForce RTX 3080', value: 'NVIDIA GeForce RTX 3080' },
    { label: 'NVIDIA GeForce RTX 4060', value: 'NVIDIA GeForce RTX 4060' },
    { label: 'NVIDIA GeForce RTX 4070', value: 'NVIDIA GeForce RTX 4070' },
    { label: 'NVIDIA GeForce RTX 4080', value: 'NVIDIA GeForce RTX 4080' },
    { label: 'NVIDIA GeForce RTX 4090', value: 'NVIDIA GeForce RTX 4090' },
    { label: 'NVIDIA Quadro', value: 'NVIDIA Quadro' }
  ];

  const osOptions = [
    { label: 'Windows 11', value: 'Windows 11' },
    { label: 'Windows 10', value: 'Windows 10' },
    { label: 'Windows 8.1', value: 'Windows 8.1' },
    { label: 'macOS Sonoma', value: 'macOS Sonoma' },
    { label: 'macOS Ventura', value: 'macOS Ventura' },
    { label: 'macOS Monterey', value: 'macOS Monterey' },
    { label: 'macOS Big Sur', value: 'macOS Big Sur' },
    { label: 'Ubuntu', value: 'Ubuntu' },
    { label: 'Fedora', value: 'Fedora' },
    { label: 'Debian', value: 'Debian' },
    { label: 'Linux Mint', value: 'Linux Mint' },
    { label: 'Arch Linux', value: 'Arch Linux' },
    { label: 'Pop!_OS', value: 'Pop!_OS' },
    { label: 'Other', value: 'Other' }
  ];

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

      if (activeTab === 'Assignee') {
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
                // purchase_cost: String(createData?.purchase_cost)
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
      {/* {addDevice && <AddDevice open={addDevice} onClose={() => setAddDevice(false)} />} */}
      <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
        {activeTab === 'Inventory'
          ? editing
            ? editing
            : 'Add Hardware'
          : activeTab === 'Assignee' && 'Assign Device'}
      </Title>

      {activeTab === 'Inventory' && totalSteps > 1 && (
        <div className="steps">
          <div className="flex-between">
            <p>
              {current === 1
                ? 'Basic Information'
                : current === 2
                ? 'Procurement & Warranty'
                : 'Specifications'}
            </p>
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
        {activeTab === 'Assignee' ? (
          <>
            <FieldBox>
              <label>
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
              <label>
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
        ) : activeTab === 'Inventory' && current === 1 ? (
          <>
            <FieldBox>
              <label>
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
                <label>
                  Device Type <span>*</span>
                </label>
                <PurpleText
                  onClick={() => {
                    form.setFieldValue('device_type', null);
                    setAddDevice(!addDevice);
                  }}>
                  {addDevice ? '- Remove' : '+ Add'}
                </PurpleText>
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
                    placeholder="--Select Option--">
                    {deviceTypes?.map((option, index) => (
                      <Option
                        key={index}
                        value={option.value}
                        style={{ textTransform: 'capitalize' }}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label>
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
              <label>
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
              <label>
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
                  <label>
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
                  <label>
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
                  <label>
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
                  <label style={{ fontWeight: 600 }}>Warranty Period</label>
                </FieldBox>
                <FlexWrapper gap="10px" wrap="nowrap" width="100%">
                  <FieldBox style={{ width: '100%' }}>
                    <label>Start Date</label>
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
                    <label>End Date</label>
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
                  <label>
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
                <label>
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
                <label>
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
                    placeholder="--Select Option--">
                    {ramOptions?.map((option, index) => (
                      <Option
                        key={index}
                        value={option.value}
                        style={{ textTransform: 'capitalize' }}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label>
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
                    placeholder="--Select Option--">
                    {storageOptions?.map((option, index) => (
                      <Option
                        key={index}
                        value={option.value}
                        style={{ textTransform: 'capitalize' }}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label>
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
                    placeholder="--Select Option--">
                    {graphicsOptions?.map((option, index) => (
                      <Option
                        key={index}
                        value={option.value}
                        style={{ textTransform: 'capitalize' }}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label>
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
                    placeholder="--Select Option--">
                    {osOptions?.map((option, index) => (
                      <Option
                        key={index}
                        value={option.value}
                        style={{ textTransform: 'capitalize' }}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ margin: '20px 10px !important' }}>
                <label>
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
                <label>
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
                  <label>
                    Password <span>*</span>
                  </label>
                  <div onClick={() => setPasswordVisible((prev) => !prev)}>
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
                  </div>
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
          {activeTab === 'Inventory' && current < totalSteps ? (
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
  activeTab: PropTypes.string,
  editing: PropTypes.string,
  handleGetDeviceListing: PropTypes.func,
  data: PropTypes.any,
  handleCount: PropTypes.func
};

export default AddModal;
