import { Button, Checkbox, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addEmployeeAddress } from '../../../../../services/api_collection';
import { FieldBox, FlexWrapper, GridBox } from '../../../../../theme/common_style';
import { DropdownIconNew } from '../../../../../theme/SvgIcons';
import { CreateFormWrapper } from '../../../EmployeesStyle';
import { capitalizeFirstLetter } from '../../../../../utils/common_functions';

const StepTwo = ({
  current,
  setCurrent,
  states,
  pStates,
  countries,
  handleCountryChange,
  employeeId
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [loader, setLoader] = useState(false);

  const handleComplete = async (values) => {
    if (employeeId) {
      setLoader(true);

      if (values?.isSameAddress) {
        values.P_address_line_one = values?.cu_address_line_one;
        values.P_address_line_two = values?.cu_address_line_two;
        values.P_city = values?.cu_city;
        values.P_country = values?.cu_country;
        values.P_state = values?.cu_state;
        values.P_postalcode = values?.cu_postalcode;
      }

      let req = {
        current: {
          address_line_one: values?.cu_address_line_one,
          address_line_two: values?.cu_address_line_two,
          city: values?.cu_city,
          country: values?.cu_country,
          state: values?.cu_state,
          postalcode: values?.cu_postalcode
        },
        permanent: {
          address_line_one: values?.P_address_line_one,
          address_line_two: values?.P_address_line_two,
          city: values?.P_city,
          country: values?.P_country,
          state: values?.P_state,
          postalcode: values?.P_postalcode
        },
        isSameAddress: values?.isSameAddress,
        employee_id: employeeId
      };
      let res = await addEmployeeAddress(req);
      if (res.statusCode === 200) {
        setLoader(false);
        toast.success(res?.message);
        setCurrent(current + 1);
      } else {
        setLoader(false);
        toast.error(
          res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
        );
      }
    }
  };

  const handleChange = (countryName, type, statesKey, countryNames) => {
    let allCountries = countryNames || countries;
    const selectedCountry = allCountries.find((c) => c.name === countryName);
    if (selectedCountry) {
      if (statesKey) {
        form.setFieldsValue({ [statesKey]: undefined });
      }
    }
  };

  useEffect(() => {
    const defaultCountry = 'India';
    form.setFieldsValue({
      cu_country: defaultCountry,
      P_country: defaultCountry
    });
  }, []);
  return (
    <CreateFormWrapper>
      <div className="skip-section">
        <h4 className="address-title">Current Address</h4>
        <p onClick={() => setCurrent(current + 1)}>(Skip)</p>
      </div>
      <Form form={form} onFinish={handleComplete}>
        {(values) => (
          <>
            <GridBox cols={2}>
              <FieldBox>
                <label htmlFor="cu_address_line_one">
                  Address
                  <span>*</span>
                </label>
                <Form.Item
                  name="cu_address_line_one"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your current address'
                    },
                    {
                      max: 80,
                      message: 'Address cannot be more than 100 characters'
                    }
                  ]}
                  normalize={capitalizeFirstLetter}>
                  <Input
                    prefixCls="form-input"
                    placeholder="Enter Current Address"
                    maxLength={80}
                  />
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label htmlFor="cu_address_line_two">Address Line 2</label>
                <Form.Item
                  name="cu_address_line_two"
                  rules={[
                    {
                      max: 80,
                      message: 'Address cannot be more than 100 characters'
                    }
                  ]}
                  normalize={capitalizeFirstLetter}>
                  <Input prefixCls="form-input" placeholder="Enter Address Line 2" maxLength={80} />
                </Form.Item>
              </FieldBox>
            </GridBox>
            <GridBox cols={4}>
              <FieldBox>
                <label htmlFor="cu_country">
                  Country<span>*</span>
                </label>
                <Form.Item
                  name="cu_country"
                  rules={[
                    {
                      required: true,
                      message: 'Please select your country'
                    }
                  ]}>
                  <Select
                    prefixCls="form-select"
                    allowClear
                    showSearch
                    onChange={(countryName) => {
                      handleCountryChange(countryName, 'cur', 'cu_state', null);
                      handleChange(countryName, 'cur', 'cu_state', null);
                    }}
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<DropdownIconNew />}
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
                <label htmlFor="cu_state">
                  State<span>*</span>
                </label>
                <Form.Item
                  name="cu_state"
                  rules={[
                    {
                      required: true,
                      message: 'Please select your state'
                    }
                  ]}>
                  <Select
                    prefixCls="form-select"
                    allowClear
                    showSearch
                    disabled={!states?.length}
                    style={{ marginBottom: '10px' }}
                    suffixIcon={<DropdownIconNew />}
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
                <label htmlFor="cu_city">
                  City<span>*</span>
                </label>
                <Form.Item
                  name="cu_city"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your city'
                    }
                  ]}
                  normalize={capitalizeFirstLetter}>
                  <Input prefixCls="form-input" placeholder="Enter City" maxLength={30} />
                </Form.Item>
              </FieldBox>
              <FieldBox>
                <label htmlFor="cu_postalcode">
                  Pincode<span>*</span>
                </label>
                <Form.Item
                  name="cu_postalcode"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter your pincode'
                    },
                    {
                      pattern: /^[1-9][0-9]{5}$/,
                      message: 'Please enter a valid 6-digit pincode'
                    }
                  ]}>
                  <Input prefixCls="form-input" placeholder="Enter Pincode" maxLength={6} />
                </Form.Item>
              </FieldBox>
            </GridBox>
            <FlexWrapper justify={'start'} align={'center'} gap={'12px'}>
              <label
                htmlFor="isSameAddress"
                style={{ margin: '20px 0', fontWeight: 500 }}
                className="address-title">
                Permanent Address
              </label>
              <Form.Item
                name="isSameAddress"
                valuePropName="checked"
                style={{ margin: 0, marginTop: 3 }}>
                <Checkbox>Use same as Current Address</Checkbox>
              </Form.Item>
            </FlexWrapper>
            {!form.getFieldValue('isSameAddress') && (
              <>
                <GridBox cols={2}>
                  <FieldBox>
                    <label htmlFor="P_address_line_one">
                      Address <span>*</span>
                    </label>
                    <Form.Item
                      name="P_address_line_one"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your current address'
                        },
                        {
                          max: 80,
                          message: 'Address cannot be more than 100 characters'
                        }
                      ]}
                      normalize={capitalizeFirstLetter}>
                      <Input
                        disabled={values?.isSameAddress}
                        prefixCls="form-input"
                        placeholder="Enter Permanent Address"
                        maxLength={80}
                      />
                    </Form.Item>
                  </FieldBox>
                  <FieldBox>
                    <label htmlFor="P_address_line_two">Address Line 2</label>
                    <Form.Item
                      name="P_address_line_two"
                      rules={[
                        {
                          max: 80,
                          message: 'Address cannot be more than 100 characters'
                        }
                      ]}
                      normalize={capitalizeFirstLetter}>
                      <Input
                        disabled={values?.isSameAddress}
                        prefixCls="form-input"
                        placeholder="Enter Address Line 2"
                        maxLength={80}
                      />
                    </Form.Item>
                  </FieldBox>
                </GridBox>
                <GridBox cols={4}>
                  <FieldBox>
                    <label htmlFor="P_country">
                      Country<span>*</span>
                    </label>
                    <Form.Item
                      name="P_country"
                      rules={[
                        {
                          required: true,
                          message: 'Please select your permanent country'
                        }
                      ]}>
                      <Select
                        disabled={values?.isSameAddress}
                        prefixCls="form-select"
                        allowClear
                        showSearch
                        onChange={(countryName) => {
                          handleCountryChange(countryName, 'per', 'P_state', null);
                          handleChange(countryName, 'per', 'P_state', null);
                        }}
                        style={{ marginBottom: '10px' }}
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--">
                        {countries?.map((item, index) => (
                          <Option
                            key={index}
                            value={item.name}
                            style={{ textTransform: 'capitalize' }}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </FieldBox>
                  <FieldBox>
                    <label htmlFor="P_state">
                      State<span>*</span>
                    </label>
                    <Form.Item
                      name="P_state"
                      rules={[
                        {
                          required: true,
                          message: 'Please select your permanent state'
                        }
                      ]}>
                      <Select
                        disabled={values?.isSameAddress || !pStates?.length}
                        prefixCls="form-select"
                        allowClear
                        showSearch
                        style={{ marginBottom: '10px' }}
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--">
                        {pStates?.map((item, index) => (
                          <Option
                            key={index}
                            value={item.name}
                            style={{ textTransform: 'capitalize' }}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </FieldBox>
                  <FieldBox>
                    <label htmlFor="P_city">
                      City<span>*</span>
                    </label>
                    <Form.Item
                      name="P_city"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your permanent city'
                        }
                      ]}
                      normalize={capitalizeFirstLetter}>
                      <Input
                        disabled={values?.isSameAddress}
                        prefixCls="form-input"
                        placeholder="Enter City"
                        maxLength={30}
                      />
                    </Form.Item>
                  </FieldBox>
                  <FieldBox>
                    <label htmlFor="P_postalcode">
                      Pincode<span>*</span>
                    </label>
                    <Form.Item
                      name="P_postalcode"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your pincode'
                        },
                        {
                          pattern: /^[1-9][0-9]{5}$/,
                          message: 'Please enter a valid 6-digit pincode'
                        }
                      ]}>
                      <Input
                        disabled={values?.isSameAddress}
                        prefixCls="form-input"
                        placeholder="Enter Pincode"
                        maxLength={6}
                      />
                    </Form.Item>
                  </FieldBox>
                </GridBox>
              </>
            )}
            <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }}>
              <Button
                style={{ width: '140px' }}
                prefixCls="antCustomBtn"
                onClick={form.submit}
                loading={loader}>
                Next
              </Button>
            </FlexWrapper>
          </>
        )}
      </Form>
    </CreateFormWrapper>
  );
};

export default StepTwo;

StepTwo.propTypes = {
  current: PropTypes.number,
  setCurrent: PropTypes.func,
  states: PropTypes.array,
  pStates: PropTypes.array,
  countries: PropTypes.array,
  handleCountryChange: PropTypes.func,
  employeeId: PropTypes.any
};
