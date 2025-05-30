/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import { toast } from 'react-toastify';
import {
  createWorkExperienceApi,
  updateWorkExperienceApi
} from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import useAllDesignation from '../../../../hooks/useAllDesignation';
import { DropdownIconNew } from '../../../../theme/SvgIcons';
import { capitalizeFirstLetter } from '../../../../utils/common_functions';

const { Option } = Select;

const AddWorkExperience = ({
  open,
  onClose,
  editDetails,
  handleList,
  handleGetEmployeeDetails
}) => {
  console.log(editDetails);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { options, loading: designationLoading } = useAllDesignation();

  const handleAddOrUpdate = async (values) => {
    try {
      setLoading(true);
      let res;
      if (editDetails?.id) {
        res = await updateWorkExperienceApi(values, editDetails.id);
      } else {
        res = await createWorkExperienceApi(values, id);
      }
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

  useEffect(() => {
    if (editDetails) {
      const { company_name, job_title, start_date, end_date, total_work_experience } = editDetails;
      console.log(dayjs(end_date), 'dayjs(end_date)', end_date);
      form.setFieldsValue({
        company_name,
        job_title,
        start_date: dayjs(start_date),
        end_date: end_date ? dayjs(end_date) : null,
        total_work_experience
      });
    }
  }, [editDetails]);

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
        <h4>Work Experience</h4>

        <Form form={form} onFinish={handleAddOrUpdate}>
          <>
            <FieldBox>
              <label>
                Company Name <span>*</span>
              </label>
              <Form.Item
                name="company_name"
                type="text"
                rules={[
                  { required: true, message: 'Previous Company is required' },
                  { min: 2, message: 'Company Name must be at least 2 characters' },
                  { max: 50, message: 'Company Name cannot be more than 50 characters' }
                ]}
                normalize={capitalizeFirstLetter}>
                <Input prefixCls="form-input" placeholder="Enter Previous Company" maxLength={50} />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label>
                Job Title <span>*</span>
              </label>
              <Form.Item
                name="job_title"
                type="text"
                rules={[
                  { required: true, message: 'Job Title is required' },
                  { min: 2, message: 'Job Title must be at least 2 characters' },
                  { max: 30, message: 'Job Title cannot be more than 30 characters' }
                ]}>
                {/* <Input prefixCls="form-input" placeholder="Enter Job Title" maxLength={30} /> */}
                <Select
                  showSearch
                  prefixCls="form-select"
                  loading={designationLoading}
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--"
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }>
                  {options?.map((option) => (
                    <Option key={option.label} value={option.label}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </FieldBox>
            <FlexWrapper wrap="unset" gap="10px" style={{ alignItems: 'baseline' }}>
              <FieldBox style={{ width: '100%' }}>
                <label>
                  From <span>*</span>
                </label>
                <Form.Item
                  name="start_date"
                  rules={[{ required: true, message: 'From date is required' }]}>
                  <DatePicker
                    prefixCls="form-datepicker"
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                    value={
                      form.getFieldValue('start_date') &&
                      dayjs(form.getFieldValue('start_date')).isValid()
                        ? dayjs(form.getFieldValue('start_date'))
                        : null
                    }
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </FieldBox>
              <FieldBox style={{ width: '100%' }}>
                <label>
                  To <span>*</span>
                </label>
                <Form.Item
                  name="end_date"
                  dependencies={['start_date']}
                  rules={[
                    {
                      required: true,
                      message: 'End date is required'
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue('start_date');

                        if (!value || !startDate) {
                          return Promise.resolve(); // Required rule will catch empty case
                        }

                        const start = dayjs(startDate).startOf('day');
                        const end = dayjs(value).startOf('day');

                        if (end.isBefore(start)) {
                          return Promise.reject(new Error('End date cannot be before start date'));
                        }

                        if (end.isSame(start)) {
                          return Promise.reject(
                            new Error('End date cannot be the same as start date')
                          );
                        }

                        return Promise.resolve();
                      }
                    })
                  ]}>
                  <DatePicker
                    prefixCls="form-datepicker"
                    disabledDate={(current) => {
                      const startDate = form.getFieldValue('start_date');
                      const today = dayjs().endOf('day');

                      return (
                        (startDate && current < dayjs(startDate).startOf('day')) || current > today
                      );
                    }}
                    // value={
                    //   form.getFieldValue('end_date') &&
                    //   dayjs(form.getFieldValue('end_date')).isValid()
                    //     ? dayjs(form.getFieldValue('end_date'))
                    //     : null
                    // }
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </FieldBox>
            </FlexWrapper>

            {/* <FieldBox>
              <label>
                Total Work Experience <span>*</span>
              </label>
              <Form.Item
                name="total_work_experience"
                type="text"
                validateFirst={true}
                rules={[
                  { required: true, message: 'Total Work Experience is required' },
                  {
                    pattern: /^\d+(\.\d{1,2})?$/,
                    message: 'Only numeric values allowed (e.g., 2 or 2.5)'
                  }
                ]}>
                <Input prefixCls="form-input" placeholder="Enter Total Work Experience" />
              </Form.Item>
            </FieldBox> */}

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

export default AddWorkExperience;

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
