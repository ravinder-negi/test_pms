import React, { useRef, useState } from 'react';
import { Button, DatePicker, Form, Modal, Select } from 'antd';
import { CreateFormWrapper, CreateModalWrapper, ModalCloseBox } from '../employees/EmployeesStyle';
import { DropdownIconNew, ModalCloseIcon } from '../../theme/SvgIcons';
import { FieldBox, FlexWrapper, GridBox } from '../../theme/common_style';
import { useSelector } from 'react-redux';
import { ApplyLeaveApi } from '../../redux/lms/apiRoute';
import { toast } from 'react-toastify';
import useReportingOptions from '../../hooks/useReportingOptions';
import PropTypes from 'prop-types';
import { halfDayOptions, leave_type, leaveOptions } from '../../utils/constant';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddLeave = ({ open, onClose, fetchData, updateGraph }) => {
  const [form] = Form.useForm();
  const { data } = useSelector((e) => e.userInfo);
  const [loading, setLoading] = useState(false);
  const { options } = useReportingOptions(data?.user_details?.id);
  const quillRef = useRef(null);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const finalData = await form.validateFields();
      finalData.start_date = finalData.start_date.format('YYYY-MM-DD');
      finalData.reporting = [finalData.reporting];
      if (
        form.getFieldValue('leave_category') === 'HD' ||
        form.getFieldValue('leave_category') === 'SL'
      ) {
        finalData['end_date'] = finalData.start_date;
      } else {
        finalData.end_date = finalData.end_date?.format('YYYY-MM-DD');
      }
      const res = await ApplyLeaveApi({
        ...finalData,

        ['employee_id']: data?.user_details?.id,
        ['leave_status']: 'pending'
      });
      if (res.statusCode === 200) {
        toast.success(res?.message);
        form.resetFields();
        onClose();
        fetchData();
        updateGraph();
      } else {
        toast.warning(res?.message);
      }
    } catch (errorInfo) {
      if (errorInfo.errorFields.length > 0) {
        form.scrollToField(errorInfo.errorFields[0].name);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={1000}
      footer={null}
      prefixCls="create-employees"
      closeIcon={false}>
      <CreateModalWrapper>
        <ModalCloseBox onClick={onClose}>
          <ModalCloseIcon />
        </ModalCloseBox>
        <div className="title">
          <h2>Add Leave</h2>
        </div>

        <Form autoComplete="off" form={form} onFinish={handleCreate}>
          {() => (
            <>
              <CreateFormWrapper>
                <GridBox cols={2}>
                  <FieldBox>
                    <label htmlFor="leave_type">
                      Leave Type <span>*</span>
                    </label>
                    <Form.Item
                      name="leave_type"
                      rules={[{ required: true, message: 'leave type is required' }]}>
                      <Select
                        prefixCls="form-select"
                        allowClear
                        style={{ marginBottom: '10px' }}
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--"
                        options={leave_type}
                      />
                    </Form.Item>
                  </FieldBox>
                  <FieldBox>
                    <label htmlFor="leave_category">
                      Leave Category <span>*</span>
                    </label>
                    <Form.Item
                      name="leave_category"
                      rules={[{ required: true, message: 'leave category is required' }]}>
                      <Select
                        prefixCls="form-select"
                        allowClear
                        style={{ marginBottom: '10px' }}
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--"
                        options={leaveOptions}
                      />
                    </Form.Item>
                  </FieldBox>
                </GridBox>
                <GridBox cols={2}>
                  <FieldBox>
                    <label htmlFor="start_date">
                      Start Date <span>*</span>
                    </label>
                    <Form.Item
                      name="start_date"
                      rules={[{ required: true, message: 'start Date is required' }]}>
                      <DatePicker
                        placeholder="DD/MM/YYYY"
                        prefixCls="form-datepicker"
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </FieldBox>
                  {form?.getFieldValue('leave_category') === 'HD' ||
                  form?.getFieldValue('leave_category') === 'SL' ? (
                    <FieldBox>
                      <label htmlFor="leave_slot">
                        Leave Slot <span>*</span>
                      </label>
                      <Form.Item
                        name="leave_slot"
                        rules={[{ required: true, message: 'leave slot is required' }]}>
                        <Select
                          prefixCls="form-select"
                          allowClear
                          style={{ marginBottom: '10px' }}
                          suffixIcon={<DropdownIconNew />}
                          placeholder="--Select Option--"
                          options={halfDayOptions}
                        />
                      </Form.Item>
                    </FieldBox>
                  ) : (
                    <FieldBox>
                      <label htmlFor="end_date">
                        End Date <span>*</span>
                      </label>
                      <Form.Item
                        name="end_date"
                        rules={[{ required: true, message: 'end date is required' }]}>
                        <DatePicker
                          placeholder="DD/MM/YYYY"
                          prefixCls="form-datepicker"
                          format="DD/MM/YYYY"
                          style={{ width: '100%' }}
                          disabledDate={(current) => {
                            const startDate = form.getFieldValue('start_date');
                            return current && (!startDate || current < startDate.startOf('day'));
                          }}
                        />
                      </Form.Item>
                    </FieldBox>
                  )}
                </GridBox>
                <GridBox>
                  <FieldBox>
                    <label htmlFor="reporting">
                      Reporting <span>*</span>
                    </label>
                    <Form.Item
                      name="reporting"
                      rules={[{ required: true, message: 'reporting is required' }]}>
                      <Select
                        prefixCls="form-select"
                        suffixIcon={<DropdownIconNew />}
                        placeholder="--Select Option--">
                        {options?.map((el) => (
                          <Select.Option key={el?.id} value={el?.id}>
                            {el?.name} {el?.lastName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </FieldBox>
                </GridBox>
                <FieldBox>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                    <label htmlFor="reason">
                      Reason <span>*</span>
                    </label>
                    <span style={{ color: '#9F9F9F', fontSize: '12px', fontWeight: '400' }}>
                      Max 1000 Characters
                    </span>
                  </div>
                  <Form.Item
                    name="reason"
                    rules={[
                      {
                        validator: () => {
                          const editor = quillRef.current?.getEditor();
                          const plainText = editor?.getText().trim();

                          if (!plainText) {
                            return Promise.reject(new Error('Reason is required'));
                          }

                          if (plainText.length > 1000) {
                            return Promise.reject(new Error('Max 1000 Characters only.'));
                          }

                          return Promise.resolve();
                        }
                      }
                    ]}>
                    <ReactQuill
                      placeholder="Write your reason here"
                      ref={quillRef}
                      style={{
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px'
                      }}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ color: [] }, { background: [] }],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['clean']
                        ]
                      }}
                      className="custom-quill"
                    />
                  </Form.Item>
                </FieldBox>
              </CreateFormWrapper>

              <FlexWrapper
                justify={'end'}
                gap={'10px'}
                style={{ marginTop: '20px' }}
                cursor="default">
                <Button
                  loading={loading}
                  onClick={form.submit}
                  style={{ width: '140px' }}
                  prefixCls="antCustomBtn">
                  Send
                </Button>
              </FlexWrapper>
            </>
          )}
        </Form>
      </CreateModalWrapper>
    </Modal>
  );
};

export default AddLeave;

AddLeave.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  updateGraph: PropTypes.func.isRequired
};
