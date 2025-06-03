/* eslint-disable react/prop-types */
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { DropdownIconNew, LmsIcon, ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import {
  employeeEducationApi,
  updateEmployeeEducationApi
} from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { educationType, qualifications } from '../../../../utils/constant';
import { capitalizeFirstLetter, dateFormat } from '../../../../utils/common_functions';

const AddEducation = ({ open, onClose, editDetails, handleList, handleGetEmployeeDetails }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isQualificatioCustom, setIsQualificationCustom] = useState(false);
  const { id } = useParams();

  const handleAddOrUpdate = async (values) => {
    setLoading(true);
    let req = {
      ...values,
      result: String(values?.result),
      completion_year: dateFormat(values?.completion_year)
    };
    try {
      const eduId = editDetails?.id || id;
      const apiCall = editDetails?.id ? updateEmployeeEducationApi : employeeEducationApi;
      const res = await apiCall(req, eduId);

      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully saved');
        onClose();
        handleList();
        handleGetEmployeeDetails();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (editDetails) {
      const { qualification, completion_year, education_type, result } = editDetails;
      let toatalPercentage = String(result);

      form.setFieldsValue({
        qualification,
        completion_year: dayjs(completion_year),
        education_type,
        result: toatalPercentage
      });
    } else {
      form.resetFields();
    }
  }, [editDetails, form, open]);
  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={376}
      centered
      closeIcon={false}
      footer={null}>
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentBox>
        <h4>Education</h4>

        <Form form={form} onFinish={handleAddOrUpdate}>
          <>
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
                rules={[{ required: true, message: 'Percentage is required' }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter Result"
                  precision={2}
                  maxLength={5}
                  min={0}
                  max={100}
                  prefixCls="form-input-number"
                  controls={false}
                  onKeyPress={handleKeyPress}
                  formatter={parseValue}
                  parser={parseValue}
                />
              </Form.Item>
            </FieldBox>

            <FlexWrapper justify="end" style={{ marginTop: 20 }}>
              <Button
                loading={loading}
                onClick={() => form.submit()}
                style={{ width: 140 }}
                prefixCls="antCustomBtn">
                Save
              </Button>
            </FlexWrapper>
          </>
        </Form>
      </ContentBox>
    </Modal>
  );
};

export default AddEducation;

const ContentBox = styled.div`
  width: 100%;
  padding: 24px;

  h4 {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 24px;
    color: #0e0e0e;
    margin: 0;
    text-align: center;
  }
`;
