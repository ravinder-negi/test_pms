import React, { useEffect, useState } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, Modal, Radio, Select } from 'antd';
import styled from '@emotion/styled/macro';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import dayjs from 'dayjs';
import useProjectOptions from '../../hooks/useProjectOptions';
import { FieldBox, FlexWrapper, GreyText, Title } from '../../theme/common_style';
import { createReportApi, updateReportApi } from '../../services/api_collection';
import { DropdownIconNew, LmsIcon } from '../../theme/SvgIcons';
import { reportingDonePoints } from '../../utils/constant';

const CreateReport = ({ open, onCancel, editDetails, handleList }) => {
  const [form] = Form.useForm();
  const { user_details } = useSelector((state) => state?.userInfo?.data);
  const { options, loading: projectLoading } = useProjectOptions(user_details?.id);
  const [loading, setLoading] = useState(false);
  const quillRef = React.useRef(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let payload = {
        ...values,
        project_id: +values?.project_id,
        emp_id: user_details?.id
      };

      if (values?.reporting_date)
        payload.reporting_date = dayjs(values?.reporting_date).format('YYYY-MM-DD');

      let res;
      if (editDetails) {
        let filteredPayload = { ...payload, id: +editDetails?.id };
        res = await updateReportApi(filteredPayload);
      } else {
        res = await createReportApi(payload);
      }
      if (res?.statusCode === 200) {
        toast.success(editDetails ? 'Report updated successfully!' : 'Report added successfully!');
        handleList && handleList();
        onCancel();
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
      form.setFieldsValue({
        project_id: editDetails?.project_id,
        description: editDetails?.description,
        checklists: editDetails?.checklists,
        billable: editDetails?.billable,
        billable_hours: editDetails?.billable_hours || undefined
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ billable: true });
    }
  }, [editDetails, open]);

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      centered
      destroyOnClose
      prefixCls="antCustomModal"
      width={800}
      footer={false}>
      <Title style={{ textAlign: 'center' }}>Add New Report</Title>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          billable: true,
          reporting_date: dayjs()
        }}>
        {() => (
          <>
            <CreateFormWrapper>
              <FlexWrapper gap="10px" width="100%" wrap="nowrap">
                <FieldBox style={{ width: '70%' }}>
                  <label>
                    Project <span>*</span>
                  </label>
                  <Form.Item
                    name="project_id"
                    type="text"
                    rules={[{ required: true, message: 'Project is required' }]}>
                    <Select
                      className="customHeight"
                      allowClear
                      suffixIcon={<DropdownIconNew />}
                      placeholder="Select Option"
                      loading={projectLoading}
                      options={options}
                    />
                  </Form.Item>
                </FieldBox>
                <FieldBox style={{ width: '30%' }}>
                  <label>
                    Date <span>*</span>
                  </label>
                  <Form.Item
                    name="reporting_date"
                    type="text"
                    rules={[{ required: true, message: 'Reporting Date is required' }]}>
                    <DatePicker
                      className="customHeight"
                      format="DD MMM, YYYY"
                      placeholder="Select Date"
                      style={{ width: '100%' }}
                      suffixIcon={<LmsIcon />}
                      disabledDate={(current) => {
                        return (
                          !current.isSame(dayjs(), 'day') &&
                          !current.isSame(dayjs().subtract(1, 'day'), 'day')
                        );
                      }}
                    />
                  </Form.Item>
                </FieldBox>
              </FlexWrapper>
              <FlexWrapper justify="start" gap="16px">
                <label>Billable:</label>
                <Form.Item name="billable" rules={[{ required: false }]} style={{ margin: 0 }}>
                  <Radio.Group
                    prefixCls="antCustomRadio"
                    options={[
                      { value: true, label: 'Yes' },
                      { value: false, label: 'No' }
                    ]}
                  />
                </Form.Item>
              </FlexWrapper>
              <FieldBox>
                <label>Billing (in Hrs)</label>
                <Form.Item
                  name="billable_hours"
                  dependencies={['billable']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const isBillable = getFieldValue('billable') == true;
                        if (!isBillable || (value !== undefined && value !== '')) {
                          if (/^\d*\.?\d*$/.test(value) || value === undefined || value === '') {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Only numeric values are allowed'));
                        }
                        return Promise.reject(new Error('Billing hours are required'));
                      }
                    })
                  ]}>
                  <Input
                    className="customHeight"
                    placeholder="Enter Billing"
                    disabled={!form?.getFieldValue('billable')}
                  />
                </Form.Item>
              </FieldBox>

              <FieldBox>
                <FlexWrapper justify="space-between" width="100%">
                  <label>
                    Description <span>*</span>
                  </label>
                  <GreyText>Max 1000 characters </GreyText>
                </FlexWrapper>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      validator: () => {
                        const editor = quillRef.current?.getEditor();
                        const plainText = editor?.getText().trim();

                        if (!plainText) {
                          return Promise.reject(new Error('Description is required'));
                        }

                        return Promise.resolve();
                      }
                    }
                  ]}>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={form.getFieldValue('description')}
                    className="custom-quill"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    onChange={(val) => form.setFieldValue('description', val)}
                    placeholder="Write Description here"
                  />
                </Form.Item>
              </FieldBox>

              <FlexWrapper direction="column" align="start" gap="10px">
                <label className="points-title">Done Points</label>
                <Form.Item
                  name="checklists"
                  rules={[{ required: false }]}
                  style={{ width: '100%' }}>
                  <Checkbox.Group
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '4px 10px',
                      width: '100%'
                    }}
                    prefixCls="antCustomCheckbox"
                    options={reportingDonePoints}></Checkbox.Group>
                </Form.Item>
              </FlexWrapper>
              <FlexWrapper justify="end">
                <Button
                  loading={loading}
                  prefixCls="antCustomBtn"
                  htmlType="submit"
                  style={{ width: '150px', height: '42px' }}>
                  {editDetails ? 'Save' : 'Add'}
                </Button>
              </FlexWrapper>
            </CreateFormWrapper>
          </>
        )}
      </Form>
    </Modal>
  );
};

CreateReport.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  editDetails: PropTypes.object,
  handleList: PropTypes.func
};

export default CreateReport;

const CreateFormWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .points-title {
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 16px;
    color: #0e0e0e;
    margin: 0;
  }

  .team-sub-title {
    font-family: 'Plus Jakarta Sans';
    font-weight: 400;
    font-size: 16px;
    color: #0e0e0e;
    margin: 0;
  }
`;
