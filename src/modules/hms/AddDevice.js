import { Button, Form, Input, Modal } from 'antd';
import Title from 'antd/es/typography/Title';
import PropTypes from 'prop-types';
import React from 'react';
import { FieldBox, FlexWrapper } from '../../theme/common_style';

const AddDevice = ({ open, onClose }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="antCustomModal"
      width={376}
      centered
      footer={null}>
      <Title level={4} style={{ margin: 0, textAlign: 'center' }}>
        Add Device Type
      </Title>

      <Form form={form} onFinish={onClose}>
        <FieldBox>
          <label>
            Title <span>*</span>
          </label>
          <Form.Item
            name="bank_account"
            type="text"
            validateFirst
            rules={[{ required: true, message: 'Title is required' }]}>
            <Input prefixCls="form-input" placeholder="Enter Title" />
          </Form.Item>
        </FieldBox>
        <FlexWrapper justify="end" style={{ marginTop: '20px' }}>
          <Button onClick={() => form.submit()} style={{ width: '140px' }} prefixCls="antCustomBtn">
            Save
          </Button>
        </FlexWrapper>
      </Form>
    </Modal>
  );
};

AddDevice.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default AddDevice;
