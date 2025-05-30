import React, { memo, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import styled from '@emotion/styled/macro';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { AddNotificationApi, EditDraftNotification } from '../../redux/notification/apiRoute';
import { FieldBox, FlexWrapper, GreyText } from '../../theme/common_style';
import { DropdownIconNew } from '../../theme/SvgIcons';
import useDepartmentOptions from '../../hooks/useDepartmentOptions';
import useEmployeeOptions from '../../hooks/useEmployeeOptions';
import { notificationSendToEnums } from '../../utils/constant';

const SendNotification = ({ open, onCancel, fetchData, editData, editId }) => {
  const [form] = Form.useForm();
  const [rendering, setRendering] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const { options } = useDepartmentOptions();
  const { options: employeeOption, loading: employeeLoading } = useEmployeeOptions();
  const quillRef = useRef(null);

  const handleCreate = async (isDraft) => {
    try {
      isDraft ? setDraftLoading(true) : setSendLoading(true);
      const finalData = await form.validateFields();
      finalData.is_draft = isDraft || false;

      const res = await AddNotificationApi(finalData);
      if (res.statusCode === 200) {
        toast.success(res?.message);
        form.resetFields();
        onCancel();
        fetchData();
      } else {
        toast.warning(res?.message);
      }
    } catch (errorInfo) {
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    } finally {
      isDraft ? setDraftLoading(false) : setSendLoading(false);
    }
  };

  const handleEdit = async (isDraft) => {
    try {
      isDraft ? setDraftLoading(true) : setSendLoading(true);
      const payload = await form.validateFields();
      payload.is_draft = isDraft || false;
      editId && (payload.id = editId);

      const res = await EditDraftNotification(payload);
      if (res.statusCode === 200) {
        fetchData();
      } else {
        toast.warning(res?.message);
      }
    } catch (errorInfo) {
      console.log(errorInfo);
    } finally {
      isDraft ? setDraftLoading(false) : setSendLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData)?.length > 0) {
      form.setFieldsValue({
        title: editData?.title,
        description: editData?.description,
        sendTo: editData?.sendTo,
        departments: editData?.departments?.map((item) => item?.id),
        employees: editData?.employees?.map((item) => item?.id)
      });
    }
  }, []);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="antCustomModal"
      width={900}
      footer={false}>
      <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
        Create Notification
      </Title>
      <Form form={form} style={{ margin: '30px 0 0px' }}>
        <FieldBox>
          <label>
            Title <Star>*</Star>
          </label>
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Notification title is required' }]}>
            <Input className="customHeight" placeholder="Enter notification title" />
          </Form.Item>
        </FieldBox>

        <FieldBox>
          <FlexWrapper justify="space-between" width="100%">
            <label>
              Description <Star>*</Star>
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

        <FieldBox style={{ width: '100%' }}>
          <label>
            Send To <Star>*</Star>
          </label>
          <Form.Item
            name="sendTo"
            style={{ width: 'fit-content' }}
            rules={[{ required: true, message: 'Select any one' }]}>
            <Radio.Group
              prefixCls="antCustomRadio"
              onChange={(e) => {
                form.setFieldValue('send_to', e.target.value);
                form.setFieldValue('people', null);
                setRendering(!rendering);
              }}
              options={[
                { value: notificationSendToEnums.ALL, label: notificationSendToEnums.ALL },
                {
                  value: notificationSendToEnums.DEPARTMENT,
                  label: notificationSendToEnums.DEPARTMENT
                },
                { value: notificationSendToEnums.EMPLOYEE, label: notificationSendToEnums.EMPLOYEE }
              ]}
            />
          </Form.Item>
        </FieldBox>

        {form.getFieldValue('sendTo') === notificationSendToEnums.DEPARTMENT && (
          <FieldBox>
            <Form.Item
              name="departments"
              rules={[{ required: true, message: 'Atleast Select 1 Department' }]}>
              <Select
                mode="multiple"
                showSearch
                allowClear
                maxTagCount="responsive"
                prefixCls="antCustomMultipleSelector"
                suffixIcon={<DropdownIconNew />}
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
                placeholder={'Select Departments'}>
                {options?.map((el) => (
                  <Select.Option key={el?.label} value={el?.value}>
                    {el?.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </FieldBox>
        )}
        {form.getFieldValue('sendTo') === notificationSendToEnums.EMPLOYEE && (
          <FieldBox>
            <Form.Item
              name="employees"
              rules={[{ required: true, message: 'Atleast select 1 Employee' }]}>
              <Select
                mode="multiple"
                showSearch
                allowClear
                maxTagCount={'responsive'}
                prefixCls="antCustomMultipleSelector"
                suffixIcon={<DropdownIconNew />}
                loading={employeeLoading}
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                placeholder={'Select Employees'}
                options={employeeOption}
              />
            </Form.Item>
          </FieldBox>
        )}

        <FlexWrapper justify="end" gap="10px" margin="10px 0 0">
          <Form.Item>
            <Button
              htmlType="submit"
              style={{ height: '37.6px' }}
              prefixCls="transparentBtn"
              onClick={() => (editData ? handleEdit(true) : handleCreate(true))}
              loading={draftLoading}>
              Save as Draft
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              style={{ width: '140px' }}
              onClick={() => (editData ? handleEdit(false) : handleCreate(false))}
              prefixCls="antCustomBtn"
              loading={sendLoading}>
              Send
            </Button>
          </Form.Item>
        </FlexWrapper>
      </Form>
    </Modal>
  );
};

export default memo(SendNotification);

SendNotification.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  fetchData: PropTypes.func,
  editData: PropTypes.object,
  editId: PropTypes.number
};

const Star = styled.span`
  color: red;
`;
