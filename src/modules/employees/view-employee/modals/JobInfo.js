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
  console.log(matchDepartment, 'aaaamatchDepartment', matchedDesignations);
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
      // if (!payload.date_of_leaving) {
      //   delete payload.date_of_leaving;
      // }
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

  // const handleCreate = async () => {
  //   try {
  //     setLoading(true);

  //       try {
  //         // Delete previous image
  //         // await deleteS3Object(editDetails?.profile_image);
  //         // Upload new image
  //         await uploadFileToS3(profile_image, uploadPath);
  //       } catch (err) {
  //         console.error('S3 image update failed:', err);
  //         // alert('Failed to update profile image. Please try again.');
  //       }
  //     }
  //     const payload = { ...finalData, profile_image: uploadPath };
  //     if (editDetails) {
  //       payload.id = editDetails?.id;
  //     }
  //     let res;
  //     if (editDetails) {
  //       res = await updateEmployeeApi(payload);
  //     } else {
  //       res = await createEmployeeApi(payload);
  //     }
  //     if (res?.statusCode === 200) {
  //       toast.success(res?.message);
  //       handleGetAllEmployees();
  //       onClose();
  //     } else {
  //       toast.error(res?.message || 'Something went wrong');
  //     }
  //   } catch (errorInfo) {
  //     console.log(errorInfo, 'errorInfo');
  //     toast.error(errorInfo?.message || 'Something went wrong');
  //     if (errorInfo.errorFields.length > 0) {
  //       form.scrollToField(errorInfo.errorFields[0].name);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  console.log();

  const fetchDesignation = async () => {
    console.log('hello', editDetails?.department, departmentOptions, 'washdsfh');
    const id = departmentOptions?.find(
      (el) => el?.label === form.getFieldValue('department')
    )?.value;
    console.log(id);
    if (id) {
      const res = await useDesignationOptions(id);
      console.log(res, 'res');
      setDesignationOptions(res);
    }
  };

  useEffect(() => {
    if (editDetails) {
      const { id, technologies } = editDetails;
      console.log('editDetails', editDetails);

      form.setFieldsValue({
        id,
        date_of_joining: editDetails?.date_of_joining ? dayjs(editDetails?.date_of_joining) : null,
        // date_of_leaving: editDetails?.date_of_leaving ? dayjs(editDetails?.date_of_leaving) : null,
        // job_status: editDetails?.job_status,
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
            console.log(changedValues, 'changedValues');
            if (changedValues?.department) {
              if (changedValues?.department) {
                form.resetFields(['designation']);
                fetchDesignation();
              }
            }
          }}>
          <>
            {/* <FieldBox>
              <label>
                Employee ID <span>*</span>
              </label>
              <Form.Item
                name="id"
                type="text"
                rules={[{ required: true, message: 'Employee ID is required' }]}>
                <Input disabled prefixCls="form-input" placeholder="Enter Employee ID" />
              </Form.Item>
            </FieldBox> */}
            <FieldBox>
              <label>
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
            {/* <FieldBox>
              <label>
                Job Status <span>*</span>
              </label>
              <Form.Item
                name="job_status"
                rules={[{ required: true, message: 'Job Status is required' }]}>
                <Select
                  prefixCls="form-select"
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--">
                  {jobStatusOption?.map((el) => (
                    <Option key={el?.id} value={el?.id}>
                      {el?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </FieldBox> */}
            <FieldBox>
              <label>
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
              <label>
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
              <label>Technology</label>
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
            {/* {form.getFieldValue('job_status') != 1 && (
              <FieldBox>
                <label>Relieving Date</label>
                <Form.Item name="date_of_leaving">
                  <DatePicker
                    prefixCls="form-datepicker"
                    value={
                      dayjs(form.getFieldValue('date_of_leaving'))
                        ? dayjs(form.getFieldValue('date_of_leaving'))
                        : null
                    }
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </FieldBox>
            )} */}
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
