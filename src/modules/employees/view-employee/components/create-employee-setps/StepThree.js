import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import React, { useState } from 'react';
import { FieldBox, FlexWrapper } from '../../../../../theme/common_style';
import { DropdownIconNew, LmsIcon } from '../../../../../theme/SvgIcons';
import { educationType, qualifications } from '../../../../../utils/constant';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { employeeEducationApi } from '../../../../../redux/employee/apiRoute';
import { toast } from 'react-toastify';
import { capitalizeFirstLetter } from '../../../../../utils/common_functions';

const StepThree = ({ current, setCurrent, employeeId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isQualificatioCustom, setIsQualificationCustom] = useState(false);

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

  const handleSubmit = async (values) => {
    if (employeeId) {
      setLoading(true);
      try {
        const res = await employeeEducationApi(values, employeeId);

        if (res?.statusCode === 200) {
          toast.success(res?.message || 'Successfully saved');
          setCurrent(current + 1);
        } else {
          toast.error(res?.message || 'Something went wrong');
        }
      } catch (error) {
        toast.error(error?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <Wrapper>
      <div className="about-step">
        <h1>Education</h1>
        <p onClick={() => setCurrent(current + 1)}>(Skip)</p>
      </div>
      <Form form={form} onFinish={handleSubmit}>
        <FieldBox>
          <div className="addition-div">
            <label htmlFor="qualification">
              Qualification <span>*</span>
            </label>
            <p
              onClick={() => {
                setIsQualificationCustom(!isQualificatioCustom);
              }}>
              {isQualificatioCustom ? '- Remove' : '+ Add'}
            </p>
          </div>
          <Form.Item
            name="qualification"
            rules={[{ required: true, message: 'Highest Qualification is required' }]}
            normalize={capitalizeFirstLetter}>
            {isQualificatioCustom ? (
              <Input prefixCls="form-input" placeholder="Enter your Qualification" />
            ) : (
              <Select
                prefixCls="form-select"
                suffixIcon={<DropdownIconNew />}
                placeholder="--Select Option--"
                showSearch
                optionFilterProp="children">
                {qualifications?.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </FieldBox>
        <FieldBox>
          <label htmlFor="completion_year">
            Completion Year <span>*</span>
          </label>
          <Form.Item
            name="completion_year"
            rules={[{ required: true, message: 'Completion Year is required' }]}>
            <DatePicker
              picker="year"
              format="YYYY"
              suffixIcon={<LmsIcon />}
              prefixCls="form-datepicker"
              value={dayjs(form.getFieldValue('completion_year'))}
              style={{ width: '100%' }}
              allowClear={false}
            />
          </Form.Item>
        </FieldBox>
        <FieldBox>
          <label htmlFor="education_type">
            Type <span>*</span>
          </label>
          <Form.Item
            name="education_type"
            rules={[{ required: true, message: 'Type is required' }]}>
            <Select
              prefixCls="form-select"
              suffixIcon={<DropdownIconNew />}
              placeholder="--Select Option--"
              showSearch
              optionFilterProp="children">
              {educationType?.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </FieldBox>
        <FieldBox>
          <label htmlFor="result">
            Percentage % <span>*</span>
          </label>
          <Form.Item
            name="result"
            rules={[
              {
                required: true,
                message: 'Percentage is required'
              },
              {
                type: 'number',
                min: 0,
                max: 100,
                message: 'Percentage must be between 0 and 100'
              }
            ]}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter Result"
              maxLength={5}
              min={0}
              max={100}
              precision={2}
              prefixCls="form-input-number"
              controls={false}
              onKeyPress={handleKeyPress}
              formatter={parseValue}
              parser={parseValue}
            />
          </Form.Item>
        </FieldBox>
        <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }}>
          <Button
            style={{ width: '140px' }}
            prefixCls="antCustomBtn"
            onClick={form.submit}
            // onClick={() => setCurrent(current + 1)}
            loading={loading}>
            Next
          </Button>
        </FlexWrapper>
      </Form>
    </Wrapper>
  );
};

export default StepThree;

const Wrapper = styled.div`
  .about-step {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-weight: 500;
      font-size: 18px;
    }
    p {
      font-weight: 500;
      font-size: 16px;
      cursor: pointer;
    }
  }
`;

StepThree.propTypes = {
  current: PropTypes.number,
  setCurrent: PropTypes.func,
  employeeId: PropTypes.any
};
