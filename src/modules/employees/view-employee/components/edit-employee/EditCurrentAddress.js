import { Button, Form, Input, Modal, Select } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FieldBox, FlexWrapper, GridBox } from '../../../../../theme/common_style';
import { DropdownIconNew } from '../../../../../theme/SvgIcons';
import { countriesOptions } from '../../../../../utils/constant';
import styled from '@emotion/styled';
import { Country, State } from 'country-state-city';
import { updateEmployeeAddress } from '../../../../../services/api_collection';
import { toast } from 'react-toastify';
import { capitalizeFirstLetter } from '../../../../../utils/common_functions';

const EditCurrentAddress = ({
  isCurrentAddressOpen,
  handleCancelAddressOpen,
  isCurrentAddress,
  data,
  id,
  handleList
}) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const [states, setStates] = useState([]);
  const [loader, setLoader] = useState(false);
  const [countries, setCountries] = useState([]);

  const handleSubmit = async (values) => {
    setLoader(true);
    let req = {
      address_line_one: values?.cu_address_line_one,
      address_line_two: values?.cu_address_line_two,
      city: values?.cu_city,
      country: values?.cu_country,
      state: values?.cu_state,
      postalcode: values?.cu_postalcode,
      employee_id: id,
      address_type: isCurrentAddress ? 'Local' : 'Permanent'
    };
    let res = await updateEmployeeAddress(req);
    if (res.statusCode === 200) {
      toast.success(res?.message);
      setLoader(false);
      handleCancelAddressOpen();
      handleList();
    } else {
      setLoader(false);
      toast.error(
        res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
      );
    }
  };
  const handleCountryChange = (countryName, statesKey, countryNames) => {
    if (!countryName) return setStates([]);
    let allCountries = countryNames || countries;
    const selectedCountry = allCountries.find((c) => c.name === countryName);
    if (selectedCountry) {
      const selectedStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(selectedStates);
      if (statesKey) {
        form.setFieldsValue({ [statesKey]: undefined });
      }
    } else {
      setStates([]);
      form.setFieldValue('cu_state', null);
    }
  };

  useEffect(() => {
    const defaultCountry = 'India';

    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    handleCountryChange(data ? data.country : defaultCountry, null, allCountries);
  }, []);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        cu_address_line_one: data?.address_line_one,
        cu_address_line_two: data.address_line_two || '',
        cu_country: data.country,
        cu_state: data.state,
        cu_city: data.city,
        cu_postalcode: data.postalcode
      });
    } else {
      form.setFieldValue('cu_country', 'India');
    }
  }, [data]);

  return (
    <Modal
      title=""
      open={isCurrentAddressOpen}
      onOk={handleCancelAddressOpen}
      onCancel={handleCancelAddressOpen}
      footer={false}>
      <Wrapper>
        <h2 className="main-heading">{isCurrentAddress ? 'Current' : 'Permanent'} Address Info</h2>
        <Form form={form} onFinish={handleSubmit}>
          <GridBox cols={2}>
            <FieldBox>
              <label htmlFor="cu_address_line_one">
                Address<span>*</span>
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
                <Input prefixCls="form-input" placeholder="Enter Current Address" maxLength={80} />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="cu_address_line_two">Address Line 2</label>
              <Form.Item
                name="cu_address_line_two"
                rules={[
                  {
                    max: 80,
                    message: 'Address line 2 cannot be more than 100 characters'
                  }
                ]}
                normalize={capitalizeFirstLetter}>
                <Input prefixCls="form-input" placeholder="Enter Address Line 2" maxLength={80} />
              </Form.Item>
            </FieldBox>
          </GridBox>
          <GridBox cols={2}>
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
                  onChange={(countryName) => handleCountryChange(countryName, 'cu_state', null)}
                  style={{ marginBottom: '10px', width: '228px' }}
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--">
                  {countriesOptions?.map((item, index) => (
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
                  style={{ marginBottom: '10px', width: '228px' }}
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
          </GridBox>
          <GridBox cols={2}>
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
          <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }}>
            <Button
              style={{ width: '140px' }}
              prefixCls="antCustomBtn"
              onClick={form.submit}
              loading={loader}>
              Update
            </Button>
          </FlexWrapper>
        </Form>
      </Wrapper>
    </Modal>
  );
};

export default EditCurrentAddress;

const Wrapper = styled.div`
  .main-heading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

EditCurrentAddress.propTypes = {
  isCurrentAddressOpen: PropTypes.bool,
  handleCancelAddressOpen: PropTypes.func,
  isCurrentAddress: PropTypes.bool,
  data: PropTypes.any,
  id: PropTypes.string,
  handleList: PropTypes.any
};
