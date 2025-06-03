/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { Button, DatePicker, Form, Input, InputNumber, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import { toast } from 'react-toastify';
import { addEmployeeSalaryApi, updateEmployeeSalaryApi } from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { dateFormat } from '../../../../utils/common_functions';

const AddSalaryInfo = ({ open, onClose, editDetails, handleList }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const formatNumber = (value) =>
    value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

  const parseNumber = (value) => value?.replace(/,/g, '') || '';

  const handleAddOrUpdate = async (values) => {
    try {
      values = {
        ...values,
        effective_date: dateFormat(values?.effective_date),
        next_review_date: dateFormat(values?.next_review_date),
        last_salary_date: dateFormat(values?.last_salary_date)
      };
      setLoading(true);
      let res;
      if (editDetails?.id) {
        res = await updateEmployeeSalaryApi(editDetails?.id, values);
      } else {
        res = await addEmployeeSalaryApi(id, values);
      }
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully saved');
        onClose();
        handleList();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (editDetails) {
      const {
        basic_salary,
        last_ctc,
        effective_date,
        next_review_date,
        last_salary_date,
        inhand_salary,
        last_salary_hike
      } = editDetails;
      form.setFieldsValue({
        basic_salary,
        last_ctc,
        effective_date: effective_date ? dayjs(effective_date) : null,
        next_review_date: next_review_date ? dayjs(next_review_date) : null,
        last_salary_date: last_salary_date ? dayjs(last_salary_date) : null,
        inhand_salary,
        last_salary_hike
      });
    }
  }, [editDetails]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={480}
      centered
      closeIcon={false}
      footer={null}>
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentBox>
        <h4>Salary Info</h4>

        <Form form={form} onFinish={handleAddOrUpdate} layout="vertical">
          <>
            <FieldBox>
              <label htmlFor="basic_salary">
                Basic Salary (INR) <span>*</span>
              </label>
              <Form.Item
                name="basic_salary"
                rules={[
                  { required: true, message: 'Basic Salary is required' },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      const digitsOnly = value.replace(/,/g, '');

                      if (!/^\d+$/.test(digitsOnly)) {
                        return Promise.reject(new Error('Must be a whole number'));
                      }

                      if (digitsOnly.length < 4) {
                        return Promise.reject(new Error('Salary must be at least 4 digits'));
                      }

                      if (/^0\d+/.test(digitsOnly)) {
                        return Promise.reject(new Error('Value should not contain leading zeros'));
                      }

                      return Promise.resolve();
                    }
                  }
                ]}
                normalize={parseNumber}>
                <Input
                  prefixCls="form-input"
                  placeholder="Enter Basic Salary"
                  onBlur={(e) => {
                    const value = parseNumber(e.target.value);
                    form.setFieldsValue({ basic_salary: formatNumber(value) });
                  }}
                />
              </Form.Item>
            </FieldBox>

            <FlexWrapper wrap="unset" gap="10px" align="flex-start">
              <FieldBox style={{ width: '100%' }}>
                <label htmlFor="effective_date">Effective Date</label>
                <Form.Item name="effective_date">
                  <DatePicker
                    prefixCls="form-datepicker"
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </FieldBox>

              <FieldBox style={{ width: '100%' }}>
                <label htmlFor="next_review_date">Next Review Date</label>
                <Form.Item
                  name="next_review_date"
                  dependencies={['effective_date']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const eff = getFieldValue('effective_date');
                        if (!value || !eff || dayjs(value).isAfter(dayjs(eff))) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Next review must be after effective date')
                        );
                      }
                    })
                  ]}>
                  <DatePicker
                    prefixCls="form-datepicker"
                    onChange={(val) => form.setFieldsValue({ next_review_date: val })}
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </FieldBox>
            </FlexWrapper>

            {/* Last CTC */}
            <FieldBox>
              <label htmlFor="last_ctc">Last CTC</label>
              <Form.Item
                name="last_ctc"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      const digitsOnly = value.replace(/,/g, '');

                      if (!/^\d+$/.test(digitsOnly)) {
                        return Promise.reject(new Error('Must be a whole number'));
                      }

                      if (digitsOnly.length < 4) {
                        return Promise.reject(new Error('CTC must be at least 4 digits'));
                      }

                      if (/^0\d+/.test(digitsOnly)) {
                        return Promise.reject(new Error('Value should not contain leading zeros'));
                      }

                      return Promise.resolve();
                    }
                  }
                ]}
                normalize={parseNumber}>
                <Input
                  prefixCls="form-input"
                  placeholder="Enter Last CTC"
                  onBlur={(e) => {
                    const value = parseNumber(e.target.value);
                    form.setFieldsValue({ last_ctc: formatNumber(value) });
                  }}
                />
              </Form.Item>
            </FieldBox>

            <FieldBox>
              <label htmlFor="inhand_salary">In Hand Salary</label>
              <Form.Item
                name="inhand_salary"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      const digitsOnly = value.replace(/,/g, '');

                      if (!/^\d+$/.test(digitsOnly)) {
                        return Promise.reject(new Error('Must be a whole number'));
                      }

                      if (digitsOnly.length < 4) {
                        return Promise.reject(new Error('Salary must be at least 4 digits'));
                      }

                      if (/^0\d+/.test(digitsOnly)) {
                        return Promise.reject(new Error('Value should not contain leading zeros'));
                      }

                      return Promise.resolve();
                    }
                  }
                ]}
                normalize={parseNumber}>
                <Input
                  prefixCls="form-input"
                  placeholder="Enter In Hand Salary"
                  onBlur={(e) => {
                    const value = parseNumber(e.target.value);
                    form.setFieldsValue({ inhand_salary: formatNumber(value) });
                  }}
                />
              </Form.Item>
            </FieldBox>

            <FieldBox>
              <label htmlFor="last_salary_date">Last Salary Review Date</label>
              <Form.Item name="last_salary_date">
                <DatePicker
                  prefixCls="form-datepicker"
                  onChange={(val) => form.setFieldsValue({ last_salary_date: val })}
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </FieldBox>

            <FieldBox>
              <label htmlFor="last_salary_hike">Hike on Last Salary</label>
              <Form.Item
                name="last_salary_hike"
                getValueFromEvent={(value) =>
                  value !== undefined && value !== null ? String(value) : value
                }
                rules={[
                  {
                    validator: (_, value) => {
                      if (value === undefined || value === null || value === '') {
                        return Promise.resolve();
                      }

                      if (!/^\d+$/.test(value)) {
                        return Promise.reject(new Error('Percentage must be a whole number'));
                      }

                      if (value < 1 || value > 100) {
                        return Promise.reject(new Error('Percentage must be between 1 and 100'));
                      }

                      if (/^0\d+/.test(value.toString())) {
                        return Promise.reject(new Error('Value should not start with 0'));
                      }

                      return Promise.resolve();
                    }
                  }
                ]}>
                <InputNumber
                  max={100}
                  prefixCls="form-input-number"
                  placeholder="Enter Hike on Last Salary"
                  style={{ width: '100%' }}
                  formatter={(value) => (value !== undefined && value !== '' ? `${value}%` : '')}
                  parser={(value) => value?.replace('%', '')}
                />
              </Form.Item>
            </FieldBox>

            <FlexWrapper justify="end" style={{ marginTop: 20 }}>
              <Button
                onClick={() => form.submit()}
                loading={loading}
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

export default AddSalaryInfo;

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
