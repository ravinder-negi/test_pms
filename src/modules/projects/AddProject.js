import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { FlexWrapper, GreyText } from '../../theme/common_style';
import { CreateFormWrapper, CreateModalWrapper, FieldBox, GridBox } from './ProjectStyle';
import { createProjectApi, updateProjectApi } from '../../redux/project/apiRoute';
import { toast } from 'react-toastify';
import useClientOptions from '../../hooks/useClientOptions';
import useEmployeeOptions from '../../hooks/useEmployeeOptions';
import dayjs from 'dayjs';
import useProjectSourced from '../../hooks/useProjectSourced';
import {
  projectBillingType,
  projectCondition,
  projectPhase,
  ProjectSource,
  projectStatusOption
} from '../../utils/constant';
import { AvatarSelect, AvatarMultiSelect } from '../../components/common/AvatarSelect';
import useTechnologyOptions from '../../hooks/useTechnologyOptions';
import styled from '@emotion/styled';
import { capitalizeFirstLetter, capitalizeWords } from '../../utils/common_functions';

const AddProject = ({ open, close, handleProjectList, editDetails }) => {
  const [current, setCurrent] = useState(1);
  const [step1Data, setStep1Data] = useState({});
  const [step2Data, setStep2Data] = useState({});
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const Option = Select.Option;
  const { loading: clientOptionLoading, options: clientOptions } = useClientOptions();
  const { loading: platformsLoading, options: technologyOptions } = useTechnologyOptions();
  const { loading: employeeLoading, options: employeeOption } = useEmployeeOptions();

  const [type, setType] = useState('');
  const { loading: projectSourcedLoading, options: projectSourced } = useProjectSourced({ type });

  const onCancel = () => {
    setCurrent(1);
    form.resetFields();
    close();
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      if (current === 1) {
        setStep1Data(values);
        setCurrent(2);
      } else {
        setStep2Data(values);
        setCurrent(3);
      }
    } catch (errorInfo) {
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const formattedStep1 = {
        ...step1Data,
        ...step2Data,
        client_id: +step1Data.client_id
      };
      const step2Values = await form.validateFields();
      const finalData = { ...formattedStep1, ...step2Values };
      const payload = { ...finalData };
      let res;
      if (editDetails) {
        res = await updateProjectApi({ ...payload, id: editDetails?.id });
      } else {
        res = await createProjectApi({ ...payload, status: 1 });
      }
      if (res?.statusCode === 200) {
        toast.success(res?.message);
        handleProjectList();
        close();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (errorInfo) {
      toast.error(errorInfo?.message || 'Something went wrong');
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editDetails) {
      setType(editDetails?.sourced_from);
      const project_incharge_members = editDetails?.project_Assignee
        .filter((assignee) => assignee.role === 'Project Incharge')
        .map((assignee) => assignee.employee);

      const employee_members = editDetails?.project_Assignee
        .filter((assignee) => assignee.role === 'Developer')
        .map((assignee) => assignee.employee);

      const project_manager = editDetails?.project_Assignee?.find(
        (assignee) => assignee.role === 'Project Manager'
      );

      const project_manager_members = project_manager?.emp_id?.id;

      const hiredId = editDetails?.hired?.map((val) => val?.id);

      form.setFieldsValue({
        name: editDetails?.name,
        client_id: editDetails?.client_id || null,
        project_phase: editDetails?.project_phase || null,
        project_type: editDetails?.project_type || null,
        platform: editDetails?.project_platform || null,
        project_condition: editDetails?.project_condition || null,
        sourced_from: editDetails?.sourced_from || null,
        start_date: editDetails?.start_date ? dayjs(editDetails?.start_date) : null,
        deadline: editDetails?.deadline ? dayjs(editDetails?.deadline) : null,
        project_incharge_members,
        employee_members,
        project_manager_members,
        notes: editDetails?.notes,
        url: editDetails?.url,
        hired_id: hiredId,
        no_of_hours: editDetails?.no_of_hours,
        app_name: editDetails?.app_name,
        budget: editDetails?.budget,
        status: editDetails?.status || null
      });
    } else {
      form.resetFields();
    }
  }, [editDetails]);

  const handleOptionListing = (empOptions, str1, str2) => {
    if (!form) return;
    let listing = empOptions?.filter(
      (item) =>
        !form?.getFieldValue(str1)?.includes(item?.value) &&
        !form?.getFieldValue(str2)?.includes(item?.value)
    );
    return listing || [];
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="antCustomModal"
      width={1000}
      footer={null}>
      <CreateModalWrapper>
        <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
          {editDetails ? 'Edit' : 'Add New'} Project
        </Title>

        <div className="steps">
          <div className="flex-between">
            <p>
              {current === 1
                ? 'Project Information'
                : current === 2
                ? 'Project Billing Details'
                : 'Project Team Details'}
            </p>
            <p>
              Step {current} of 3{' '}
              {current > 1 && current < 3 && (
                <SkipButton onClick={() => setCurrent((pre) => pre + 1)}>( Skip )</SkipButton>
              )}
            </p>
          </div>
          <div className="flex-between">
            <p className="lines" style={{ background: current > 1 && '#7c71ff' }}></p>
            <p className="lines" style={{ background: current > 2 && '#7c71ff' }}></p>
            <p className="lines"></p>
          </div>
        </div>

        <Form autoComplete="off" form={form} onFinish={current === 3 ? handleCreate : handleNext}>
          {(values) => (
            <>
              {current === 1 && (
                <CreateFormWrapper>
                  <FieldBox>
                    <label>
                      Project Name <span>*</span>
                    </label>
                    <Form.Item
                      name="name"
                      type="text"
                      rules={[{ required: true, message: 'Project Name is required' }]}
                      normalize={capitalizeFirstLetter}>
                      <Input placeholder="Enter project name" prefixCls="form-input" />
                    </Form.Item>
                  </FieldBox>
                  <GridBox cols="3">
                    <FieldBox>
                      <label>
                        Client Name <span>*</span>
                      </label>
                      <Form.Item
                        name="client_id"
                        type="text"
                        rules={[{ required: true, message: 'Client is required' }]}>
                        <AvatarSelect
                          options={clientOptions}
                          placeholder={'--Select Option--'}
                          loading={clientOptionLoading}
                        />
                      </Form.Item>
                    </FieldBox>
                    <FieldBox>
                      <label>
                        Project Type <span>*</span>
                      </label>
                      <Form.Item
                        name="project_type"
                        rules={[{ required: true, message: 'Project Type is required' }]}>
                        <Select
                          prefixCls="form-select"
                          allowClear
                          style={{ marginBottom: '10px' }}
                          suffixIcon={<DropdownIconNew />}
                          placeholder="--Select Option--">
                          {projectBillingType?.map((el, index) => (
                            <Option
                              key={index}
                              value={el?.value}
                              style={{ textTransform: 'capitalize' }}>
                              {el?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </FieldBox>
                    <FieldBox>
                      <label>
                        Project Condition <span>*</span>
                      </label>
                      <Form.Item
                        name="project_condition"
                        rules={[{ required: true, message: 'Project Condition is required' }]}>
                        <Select
                          prefixCls="form-select"
                          allowClear
                          style={{ marginBottom: '10px' }}
                          suffixIcon={<DropdownIconNew />}
                          placeholder="--Select Option--">
                          {projectCondition?.map((role, index) => (
                            <Option
                              key={index}
                              value={role.value}
                              style={{ textTransform: 'capitalize' }}>
                              {capitalizeWords(role.label)}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </FieldBox>
                  </GridBox>
                  <GridBox cols="3">
                    <FieldBox>
                      <label>
                        Project Phase <span>*</span>
                      </label>
                      <Form.Item
                        name="project_phase"
                        rules={[{ required: true, message: 'Project Phase is required' }]}>
                        <Select
                          prefixCls="form-select"
                          allowClear
                          style={{ marginBottom: '10px' }}
                          suffixIcon={<DropdownIconNew />}
                          placeholder="--Select Option--">
                          {projectPhase?.map((role, index) => (
                            <Option
                              key={index}
                              value={role.value}
                              style={{ textTransform: 'capitalize' }}>
                              {role.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </FieldBox>
                    <FieldBox>
                      <label>
                        Start Date <span>*</span>
                      </label>
                      <Form.Item
                        name="start_date"
                        rules={[
                          { required: true, message: 'Start Date is required' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const deadline = getFieldValue('deadline');
                              if (!value || !deadline) return Promise.resolve();

                              const startTimestamp = new Date(value).valueOf();
                              const endTimestamp = new Date(deadline).valueOf();

                              if (startTimestamp <= endTimestamp) {
                                return Promise.resolve();
                              }

                              return Promise.reject(
                                new Error('Start Date must be on or before Deadline')
                              );
                            }
                          })
                        ]}
                        dependencies={['deadline']}>
                        <DatePicker
                          prefixCls="form-datepicker"
                          format="YYYY-MM-DD"
                          placeholder="YYYY-MM-DD"
                          style={{ width: '100%' }}
                          disabledDate={(current) => {
                            const deadline = form.getFieldValue('deadline');
                            return (
                              deadline &&
                              current &&
                              current > dayjs(deadline, 'YYYY-MM-DD').endOf('day')
                            );
                          }}
                        />
                      </Form.Item>
                    </FieldBox>
                    <FieldBox>
                      <label>
                        Deadline <span>*</span>
                      </label>
                      <Form.Item
                        name="deadline"
                        rules={[
                          { required: true, message: 'Deadline is required' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const startDate = getFieldValue('start_date');
                              if (!value || !startDate) return Promise.resolve();

                              const endTimestamp = new Date(value).valueOf();
                              const startTimestamp = new Date(startDate).valueOf();

                              if (endTimestamp >= startTimestamp) {
                                return Promise.resolve();
                              }

                              return Promise.reject(
                                new Error('Deadline must be on or after Start Date')
                              );
                            }
                          })
                        ]}
                        dependencies={['start_date']}>
                        <DatePicker
                          prefixCls="form-datepicker"
                          format="YYYY-MM-DD"
                          placeholder="YYYY-MM-DD"
                          style={{ width: '100%' }}
                          disabledDate={(current) => {
                            const startDate = form.getFieldValue('start_date');
                            return (
                              (current && current < dayjs().startOf('day')) ||
                              (startDate && current < dayjs(startDate, 'YYYY-MM-DD').startOf('day'))
                            );
                          }}
                        />
                      </Form.Item>
                    </FieldBox>
                  </GridBox>
                  <GridBox cols="3">
                    <FieldBox style={{ gridColumn: 'span 2' }}>
                      <label>
                        Project Platform <span>*</span>
                      </label>
                      <Form.Item
                        name="platform"
                        rules={[{ required: true, message: 'Project Platform is required' }]}>
                        <Select
                          allowClear
                          mode="multiple"
                          maxTagCount={3}
                          style={{ marginBottom: '10px' }}
                          prefixCls="antMultipleSelector"
                          suffixIcon={<DropdownIconNew />}
                          loading={platformsLoading}
                          filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          placeholder="--Select Option--">
                          {technologyOptions?.map((el, index) => (
                            <Option
                              key={index}
                              value={el?.value}
                              style={{ textTransform: 'capitalize' }}>
                              {capitalizeWords(el?.label)}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </FieldBox>
                    {editDetails && (
                      <FieldBox>
                        <label>
                          Status <span>*</span>
                        </label>
                        <Form.Item
                          name="status"
                          rules={[{ required: true, message: 'Status is required' }]}>
                          <Select
                            prefixCls="form-select"
                            allowClear
                            style={{ marginBottom: '10px' }}
                            suffixIcon={<DropdownIconNew />}
                            loading={platformsLoading}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            placeholder="--Select Option--">
                            {projectStatusOption?.map((role) => (
                              <Option
                                key={role.id}
                                value={role.value}
                                style={{ textTransform: 'capitalize' }}>
                                {role.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </FieldBox>
                    )}
                  </GridBox>
                  <FieldBox>
                    <FlexWrapper justify="space-between">
                      <label>Note</label>
                      <GreyText>Max 1000 characters</GreyText>
                    </FlexWrapper>
                    <Form.Item name="notes" type="text" rules={[{ required: false }]}>
                      <Input.TextArea
                        style={{ resize: 'none' }}
                        maxLength={1000}
                        placeholder="Write a note here"
                        rows={5}
                      />
                    </Form.Item>
                  </FieldBox>
                </CreateFormWrapper>
              )}
              {current === 2 && (
                <CreateFormWrapper>
                  <GridBox cols="2">
                    <FieldBox>
                      <label>Project Source</label>
                      <Form.Item name="sourced_from" type="text" rules={[{ required: false }]}>
                        <Select
                          prefixCls="form-select"
                          allowClear
                          style={{ marginBottom: '10px' }}
                          suffixIcon={<DropdownIconNew />}
                          placeholder="--Select Option--"
                          onChange={(val) => {
                            setType(val);
                            form.setFieldValue('hired_id', null);
                          }}>
                          {ProjectSource?.map((role, index) => (
                            <Option
                              key={index}
                              value={role.value}
                              style={{ textTransform: 'capitalize' }}>
                              {role.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </FieldBox>
                    <FieldBox>
                      <label>Hired ID</label>
                      <Form.Item
                        name="hired_id"
                        type="text"
                        dependencies={['sourced_from']}
                        rules={[
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const sourceSelected = getFieldValue('sourced_from');
                              if (sourceSelected && (!value || value?.length === 0)) {
                                return Promise.reject(
                                  new Error('Hired ID is required when Project Source is selected')
                                );
                              }
                              return Promise.resolve();
                            }
                          })
                        ]}>
                        <Select
                          disabled={!values?.sourced_from}
                          prefixCls="antMultipleSelector"
                          allowClear
                          maxTagCount={2}
                          mode="multiple"
                          style={{ marginBottom: '10px' }}
                          suffixIcon={<DropdownIconNew />}
                          placeholder="--Select Option--"
                          loading={projectSourcedLoading}>
                          {projectSourced?.map((role, index) => (
                            <Option
                              key={index}
                              value={role.value}
                              style={{ textTransform: 'capitalize' }}>
                              {role.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </FieldBox>
                  </GridBox>
                  <GridBox cols="2">
                    <FieldBox>
                      <label>No. of Hours</label>
                      <Form.Item
                        name="no_of_hours"
                        type="text"
                        validateFirst={true}
                        rules={[
                          { required: false },
                          {
                            pattern: /^\d+(\.\d+)?$/,
                            message: 'Please enter a valid number'
                          }
                        ]}>
                        <Input placeholder="Enter hours" prefixCls="form-input" />
                      </Form.Item>
                    </FieldBox>
                    <FieldBox>
                      <label>Project Budget(IN $)</label>
                      <Form.Item
                        name="budget"
                        type="text"
                        rules={[
                          { required: false },
                          {
                            pattern: /^\d+(\.\d{1,2})?$/,
                            message: 'Enter a valid amount (e.g. 1000 or 1000.50)'
                          }
                        ]}>
                        <InputNumber
                          prefixCls="form-input-number"
                          placeholder="Enter budget"
                          min={0}
                          precision={2}
                          style={{ width: '100%' }}
                          stringMode
                          controls={false}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => value?.replace(/[^0-9.]/g, '') || ''}
                          prefix="$"
                        />
                      </Form.Item>
                    </FieldBox>
                  </GridBox>
                </CreateFormWrapper>
              )}

              {current === 3 && (
                <CreateFormWrapper>
                  <GridBox cols="2">
                    <FieldBox>
                      <label>Project Manager</label>
                      <Form.Item name={'project_manager_members'}>
                        <AvatarSelect
                          options={handleOptionListing(
                            employeeOption,
                            'employee_members',
                            'project_incharge_members'
                          )}
                          placeholder="Select Project Manager"
                          loading={employeeLoading}
                          isEmp={true}
                        />
                      </Form.Item>
                    </FieldBox>
                    <FieldBox>
                      <label>Project Incharge</label>
                      <Form.Item name={'project_incharge_members'}>
                        <AvatarMultiSelect
                          options={handleOptionListing(
                            employeeOption,
                            'employee_members',
                            'project_manager_members'
                          )}
                          placeholder={'Select Project Incharge'}
                          loading={employeeLoading}
                          isEmp={true}
                        />
                      </Form.Item>
                    </FieldBox>
                  </GridBox>
                  <FieldBox>
                    <label>Team</label>
                    <Form.Item name={'employee_members'}>
                      <AvatarMultiSelect
                        options={handleOptionListing(
                          employeeOption,
                          'project_incharge_members',
                          'project_manager_members'
                        )}
                        placeholder={'Select Team'}
                        loading={employeeLoading}
                        maxTagCount={3}
                        isEmp={true}
                      />
                    </Form.Item>
                  </FieldBox>
                </CreateFormWrapper>
              )}

              <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }}>
                {current > 1 && (
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
                {current < 3 ? (
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
            </>
          )}
        </Form>
      </CreateModalWrapper>
    </Modal>
  );
};

export default AddProject;

AddProject.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  handleProjectList: PropTypes.func,
  editDetails: PropTypes.object
};

const SkipButton = styled(Button)`
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  height: fit-content;
`;
