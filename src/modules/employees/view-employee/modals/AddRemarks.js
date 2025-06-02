/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import TextArea from 'antd/es/input/TextArea';
import { addEmployeeRemarksApi, updateEmployeeRemarks } from '../../../../redux/employee/apiRoute';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { capitalizeFirstLetter } from '../../../../utils/common_functions';

const AddRemarks = ({ open, onClose, editDetails, handleList }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleAddOrUpdate = async (values) => {
    setLoading(true);
    try {
      let res;
      if (editDetails?.id) {
        res = await updateEmployeeRemarks(values, editDetails.id);
      } else {
        res = await addEmployeeRemarksApi(id, values);
      }

      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully saved');
        onClose();
        handleList();
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
      const { title, remarks } = editDetails;

      form.setFieldsValue({
        title,
        remarks
      });
    } else {
      form.resetFields();
    }
  }, [editDetails, form, open]);
  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={600}
      centered
      closeIcon={false}
      footer={null}>
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentBox>
        <h4>{editDetails?.title ? 'Edit Remarks' : 'Add Remark'}</h4>

        <Form form={form} onFinish={handleAddOrUpdate}>
          <>
            <FieldBox>
              <label htmlFor="title">
                Title <span>*</span>
              </label>
              <Form.Item
                name="title"
                type="text"
                rules={[
                  {
                    validator: (_, value) =>
                      value && value.trim()
                        ? Promise.resolve()
                        : Promise.reject('Title cannot be empty or only spaces')
                  }
                ]}
                normalize={capitalizeFirstLetter}>
                <Input prefixCls="form-input" placeholder="Enter Title" />
              </Form.Item>
            </FieldBox>

            <FieldBox>
              <label htmlFor="remarks">
                Remarks <span>*</span>
              </label>
              <Form.Item
                name="remarks"
                rules={[
                  {
                    validator: (_, value) =>
                      value && value.trim()
                        ? Promise.resolve()
                        : Promise.reject('Remark cannot be empty or only spaces')
                  }
                ]}>
                <TextArea
                  style={{
                    height: 120,
                    resize: 'none',
                    border: '1px solid #C8C8C8',
                    borderRadius: 8,
                    padding: 10
                  }}
                  placeholder="Enter Remarks"
                />
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

export default AddRemarks;

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
