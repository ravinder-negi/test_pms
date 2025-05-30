/* eslint-disable react/prop-types */
import styled from '@emotion/styled';
import { Button, Form, Modal } from 'antd';
import React, { useState } from 'react';
import { FieldBox } from '../../theme/common_style';
import { UpdateLeaveStatusApi } from '../../redux/lms/apiRoute';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DeclineLeaveModal = ({
  open,
  onCancel,
  title,
  description,
  getDetails,
  id,
  icon,
  iconBG
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = await UpdateLeaveStatusApi({
        leave_id: id,
        leave_status: 'Declined',
        reason: values.reason
      });

      if (res.statusCode === 200) {
        toast.success(res?.message);
        getDetails();
      } else {
        toast.warning(res?.message);
      }
      onCancel();
    } catch (error) {
      if (error?.errorFields?.length > 0) {
        form.scrollToField(error.errorFields[0].name);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      prefixCls="confirmation-modal"
      width={600}
      footer={null}>
      <ConfirmationModalStyled>
        <Form form={form} autoComplete="off">
          <div className="img" style={{ backgroundColor: iconBG }}>
            {icon}
          </div>
          <div className="title">
            <h4 style={{ textAlign: 'center' }}>{title}</h4>
            <p>{description}</p>
          </div>
          <FieldBox>
            <label
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <div>Reason</div>
              <span style={{ color: '#9F9F9F', fontSize: '12px', fontWeight: '400' }}>
                Max 1000 Characters
              </span>
            </label>
            <Form.Item name="reason">
              {/* <Input.TextArea
                placeholder="Enter reason"
                maxLength={1000}
                rows={10}
                prefixCls="form-textarea"
              /> */}
              <ReactQuill
                value={value}
                onChange={setValue}
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
          <div className="btns">
            <Button type="text" onClick={onCancel}>
              No
            </Button>
            <Button
              loading={loading}
              className="submit"
              style={{ background: iconBG }}
              onClick={onSubmit}>
              Yes
            </Button>
          </div>
        </Form>
      </ConfirmationModalStyled>
    </Modal>
  );
};

export default DeclineLeaveModal;

const ConfirmationModalStyled = styled.div`
  width: 100%;
  padding: 10px;

  .img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 10px;
  }

  .title {
    display: flex;
    flex-direction: column;

    h4 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 24px;
      color: #0e0e0e;
      text-align: center;
      margin: 0;
    }
    p {
      margin: 0;
      font-family: Plus Jakarta Sans;
      font-weight: 400;
      font-size: 16px;
      text-align: center;
      color: #696969;
    }
  }
  .btns {
    width: 100%;
    display: flex;
    gap: 8px;
    margin-top: 20px;

    button {
      width: 100%;
      height: 42px;
      border: 1px solid #696969;
      border-radius: 10px;
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      background: transparent;
    }
    .submit {
      border: none;
      color: #fff;

      &:hover {
        color: #fff !important;
      }
    }
  }
`;
