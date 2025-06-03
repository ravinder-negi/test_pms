import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'antd/es/form/Form';
import Title from 'antd/es/typography/Title';
import Dragger from 'antd/es/upload/Dragger';
import TextArea from 'antd/es/input/TextArea';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import { DeleteAttach, DropdownIconNew, UploadDocumentIcon } from '../../../theme/SvgIcons';
import { FlexWrapper, GreyText, PurpleText } from '../../../theme/common_style';
import { FieldBox, GridBox } from '../ProjectStyle';
import { toast } from 'react-toastify';
import { addMilestoneApi, updateMilestoneApi } from '../../../redux/project/apiRoute';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import uploadFileToS3 from '../../../utils/uploadS3Bucket';
import { milestoneStatusOption, projectPhase } from '../../../utils/constant';
import useProjectMemberOptions from '../../../hooks/useProjectMembers';
import { capitalizeFirstLetter, dateFormat } from '../../../utils/common_functions';

const MAX_FILE_SIZE_MB = 25;
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

const CreateMilestone = ({ open, onCancel, editDetails, handleListing }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const uploadData = useRef(null);
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const { loading: employeeLoading, options: employeeOption } = useProjectMemberOptions(id);

  useEffect(() => {
    if (editDetails) {
      form.setFieldsValue({
        name: editDetails.name || '',
        milestone_detail: editDetails.milestone_detail || '',
        due_date: editDetails.due_date ? dayjs(editDetails.due_date) : null,
        start_date: editDetails.start_date ? dayjs(editDetails.start_date) : null,
        assignees:
          editDetails?.project_milestone_assignee?.map((assignee) => assignee.assignee_id) || [],
        links: editDetails.projectMilestone?.map((link) => link.link_url || '') || [{}],
        project_phase_id: editDetails.project_phase_id?.toString() || '',
        status: editDetails.status
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        links: ['']
      });
    }
  }, [editDetails]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const documentUrl = await uploadDocument(file, id);
      const payload = createPayload(values, id, documentUrl, editDetails?.id);
      const apiCall = editDetails?.id ? updateMilestoneApi : addMilestoneApi;
      const res = await apiCall(payload, editDetails?.id || null);

      if (res?.statusCode === 200) {
        toast.success('Request submitted successfully!');
        form.resetFields();
        handleListing();
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

  const uploadDocument = async (file, projectId) => {
    if (!file) return '';
    const timestamp = Date.now();
    const uploadPath = `projectDoc/${projectId}/${timestamp}/${file.name}`;
    uploadData.current = { path: uploadPath };
    await uploadFileToS3(file, uploadPath);
    return uploadPath;
  };

  const createPayload = (values, projectId, documentUrl, milestoneId) => {
    const payload = {
      ...values,
      due_date: dateFormat(values?.due_date),
      start_date: dateFormat(values?.start_date),
      project_id: +projectId
    };
    if (documentUrl) {
      payload.documents = [documentUrl];
    }
    return payload;
  };

  const renderLinks = (fields, add, remove) => (
    <FlexWrapper direction="column" gap="10px" margin="0 0 20px" align="start">
      <FlexWrapper justify="space-between" width="100%">
        <Title level={5} style={{ margin: 0 }}>
          Links
        </Title>
        <PurpleText onClick={() => add()}>+ Add Link</PurpleText>
      </FlexWrapper>
      {fields.map((field) => (
        <FlexWrapper
          width="100%"
          wrap="nowrap"
          gap="10px"
          key={field.key}
          align="center">
          <Form.Item
            name={field.name}
            rules={[{ required: false }]}
            style={{ width: '100%', margin: 0 }}>
            <Input prefixCls="form-input" placeholder="Enter link url" />
          </Form.Item>
          {field.name > 0 && (
            <div onClick={() => remove(field.name)}>
              <DeleteAttach style={{ height: '40px', width: '40px' }} />
            </div>
          )}
        </FlexWrapper>
      ))}
    </FlexWrapper>
  );

  const uploadProps = {
    name: 'file',
    accept: ALLOWED_FILE_TYPES.join(','),
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isAllowed = ALLOWED_FILE_TYPES.includes(file.type);
      if (!isAllowed) {
        alert('Only PDF and image files are allowed!');
        return Upload.LIST_IGNORE;
      }

      if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
        alert(`File must be smaller than ${MAX_FILE_SIZE_MB}MB!`);
        return Upload.LIST_IGNORE;
      }

      setFile(file);
      return false;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="antCustomModal"
      width={700}
      footer={false}>
      <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
        {editDetails ? 'Edit Milestone' : 'Create New Milestone'}
      </Title>
      <Form autoComplete="off" form={form} onFinish={handleFinish} style={{ margin: '20px 0' }}>
        <>
          <FieldBox>
            <label>
              Title <span>*</span>
            </label>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Title is required' }]}
              normalize={capitalizeFirstLetter}>
              <Input prefixCls="form-input" placeholder="Enter Title" />
            </Form.Item>
          </FieldBox>

          <FieldBox>
            <FlexWrapper justify="space-between" width="100%">
              <label>
                Milestone Details <span>*</span>
              </label>
              <GreyText>Max 1000 characters</GreyText>
            </FlexWrapper>
            <Form.Item
              name="milestone_detail"
              rules={[{ required: true, message: 'Details are required' }]}>
              <TextArea rows={5} maxLength={1000} placeholder="Write Details here" />
            </Form.Item>
          </FieldBox>

          <GridBox cols={2}>
            <FieldBox>
              <label>Assignee</label>
              <Form.Item name="assignees" style={{ width: '100%' }}>
                <Select
                  mode="multiple"
                  prefixCls="antMultipleSelector"
                  style={{ width: '100%' }}
                  loading={employeeLoading}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  maxTagCount={1}
                  placeholder="Select assignee"
                  options={employeeOption}
                />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label>
                Priority Level <span>*</span>
              </label>
              <Form.Item
                name="status"
                rules={[{ required: true, message: 'Please select priority' }]}
                style={{ width: '100%' }}>
                <Select
                  prefixCls="form-select"
                  style={{ width: '100%' }}
                  maxTagCount={2}
                  placeholder="Select Priority">
                  {milestoneStatusOption.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </FieldBox>
          </GridBox>

          <GridBox cols={3}>
            <FieldBox>
              <label>
                Project Phase <span>*</span>
              </label>
              <Form.Item
                name="project_phase_id"
                rules={[{ required: true, message: 'Project Phase is required' }]}>
                <Select
                  prefixCls="form-select"
                  allowClear
                  style={{ marginBottom: '10px' }}
                  suffixIcon={<DropdownIconNew />}
                  placeholder="--Select Option--"
                  options={projectPhase}
                />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label>
                Start Date <span>*</span>
              </label>
              <Form.Item
                name="start_date"
                rules={[{ required: true, message: 'Start Date is required' }]}>
                <DatePicker
                  prefixCls="form-datepicker"
                  format="DD/MM/YYYY"
                  placeholder="DD/MM/YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </FieldBox>
            <FieldBox>
              <label>
                Due Date <span>*</span>
              </label>
              <Form.Item
                name="due_date"
                rules={[{ required: true, message: 'Due Date is required' }]}>
                <DatePicker
                  prefixCls="form-datepicker"
                  format="DD/MM/YYYY"
                  placeholder="DD/MM/YYYY"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </FieldBox>
          </GridBox>

          <FieldBox>
            <Form.List name="links">{renderLinks}</Form.List>
          </FieldBox>

          <FieldBox name="document">
            <FlexWrapper direction="column" align="start">
              <Title level={5} style={{ margin: '10px 0' }}>
                Document
              </Title>
              <Dragger prefixCls="antCustomDragger" {...uploadProps}>
                <UploadDocumentIcon />
                <PurpleText>Upload Documents</PurpleText>
                <GreyText margin="5px 0">(Max. File size: {MAX_FILE_SIZE_MB} MB)</GreyText>
              </Dragger>
              {file && (
                <div className="file-info">
                  <strong>Selected File:</strong> {file.name}
                </div>
              )}
            </FlexWrapper>
          </FieldBox>

          <Form.Item>
            <FlexWrapper justify="end" margin="20px 0 0">
              <Button
                loading={loading}
                htmlType="submit"
                style={{ width: '140px' }}
                prefixCls="antCustomBtn">
                Save
              </Button>
            </FlexWrapper>
          </Form.Item>
        </>
      </Form>
    </Modal>
  );
};

CreateMilestone.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  editDetails: PropTypes.object,
  handleListing: PropTypes.func
};

export default CreateMilestone;
