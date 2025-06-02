/* eslint-disable react/prop-types */
import { Button, DatePicker, Form, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { DropdownIconNew, ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import dayjs from 'dayjs';
import { updateEmployeeApi } from '../../../../redux/employee/apiRoute';
import { toast } from 'react-toastify';
import useDepartmentOptions from '../../../../hooks/useDepartmentOptions';
import useDesignationOptions from '../../../../hooks/useDesignationOptions';
import useTechnologyOptions from '../../../../hooks/useTechnologyOptions';
const { Option } = Select;

const JobInfo = ({
  open,
  onClose,
  editDetails,
  handleList,
  matchDepartment,
  matchedDesignations
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { options: departmentOptions } = useDepartmentOptions();
  const { options: technologyOptions } = useTechnologyOptions();
  const [designationOptions, setDesignationOptions] = useState([]);

  const handleUpdateJobDetails = async (values) => {
    const matchDepartment = departmentOptions?.find((val) => val?.label == values?.department);
    const matchedUpdateDesignation = designationOptions.find(
      (item) => item?.designation === values?.designation
    );
    let payload = {
      ...values,
      id: editDetails?.id,
      department: matchDepartment?.value,
      designation: matchedUpdateDesignation?.id || ''
    };
    try {
      setLoading(true);
      let res = await updateEmployeeApi(payload);
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully updated');
        handleList();
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

  const fetchDesignation = async () => {
    const id = departmentOptions?.find(
      (el) => el?.label === form.getFieldValue('department')
    )?.value;
    if (id) {
      const res = await useDesignationOptions(id);
      setDesignationOptions(res);
    }
  };

  useEffect(() => {
    if (editDetails) {
      const { id, technologies } = editDetails;

      form.setFieldsValue({
        id,
        date_of_joining: editDetails?.date_of_joining ? dayjs(editDetails?.date_of_joining) : null,
        department: matchDepartment?.label,
        designation: matchedDesignations?.designation,
        technologies: technologies
      });
    }
  }, []);

  useEffect(() => {
    if (editDetails?.department) {
      fetchDesignation();
    }
  }, [departmentOptions]);

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
        <h4>Job Info</h4>

        <Form
          form={form}
          onFinish={handleUpdateJobDetails}
          onValuesChange={(changedValues) => {
            if (changedValues?.department) {
              if (changedValues?.department) {
                form.resetFields(['designation']);
                fetchDesignation();
              }
            }
          }}>
          <>
            <FieldBox>
              <label htmlFor="date_of_joining">
                Date of Joining <span>*</span>
              </label>
              <Form.Item
                name="date_of_joining"
                rules={[{ required: true, message: 'Date of Joining is required' }]}>
                <DatePicker
                  prefixCls="form-datepicker"
                  value={
                    form.getFieldValue('date_of_joining')
                      ? dayjs(form.getFieldValue('date_of_joining'))
                      : null
                  }
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="department">
                Department <span>*</span>
              </label>
              <Form.Item
                name="department"
                rules={[{ required: true, message: 'Department is required' }]}>
                <Select
                  prefixCls="form-select"
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--">
                  {Array.isArray(departmentOptions) &&
                    departmentOptions.map((el, index) => (
                      <Option key={index} value={el?.label} style={{ textTransform: 'capitalize' }}>
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
                rules={[{ required: true, message: 'Designation is required' }]}>
                <Select
                  prefixCls="form-select"
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--">
                  {Array.isArray(designationOptions) &&
                    designationOptions.map((el, index) => (
                      <Option
                        key={index}
                        value={el?.designation}
                        style={{ textTransform: 'capitalize' }}>
                        {el?.designation}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label htmlFor="technologies">Technology</label>
              <Form.Item name="technologies">
                <Select
                  mode="multiple"
                  maxTagCount={2}
                  prefixCls="antMultipleSelector"
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--">
                  {technologyOptions?.map((el, index) => (
                    <Option key={index} value={el?.label} style={{ textTransform: 'capitalize' }}>
                      {el?.label}
                    </Option>
                  ))}
                </Select>
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

export default JobInfo;

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
