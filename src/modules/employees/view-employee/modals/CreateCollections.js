/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { ModalCloseBox } from '../../EmployeesStyle';
import { ModalCloseIcon } from '../../../../theme/SvgIcons';
import styled from '@emotion/styled';
import { FieldBox, FlexWrapper } from '../../../../theme/common_style';
import { createCollectionApi, editCollectionApi } from '../../../../redux/employee/apiRoute';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { KeysObj } from '../../../../utils/constant';
import { capitalizeFirstLetter } from '../../../../utils/common_functions';

const CreateCollections = ({ open, onClose, edit = false, handleListing, apiPath }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let res;
      if (edit?.id) {
        let payload = {
          collection_name: values?.name
        };
        res = await editCollectionApi(edit?.id, payload, apiPath);
      } else {
        let payload = {
          collection_name: values?.name
        };

        payload[KeysObj[apiPath]] = id;

        res = await createCollectionApi(apiPath, payload);
      }
      if (res?.statusCode === 200) {
        toast.success(res?.message || 'Successfully created');
        handleListing();
        onClose();
      } else {
        toast.error(res?.message || 'Something went wrong');
      }
    } catch (err) {
      console.log(err, 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (edit?.id) {
      form.setFieldsValue({
        name: edit?.collection_name
      });
    }
  }, [edit]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="create-employees"
      width={422}
      centered
      closeIcon={false}
      footer={null}>
      <ModalCloseBox onClick={onClose}>
        <ModalCloseIcon />
      </ModalCloseBox>
      <ContentBox>
        <h4>{edit ? 'Edit' : 'Create'} Collection</h4>

        <Form form={form} onFinish={handleSubmit}>
          <>
            <FieldBox>
              <label htmlFor="name">
                Name<span>*</span>
              </label>
              <Form.Item
                name="name"
                type="text"
                rules={[{ required: true, message: 'Please enter name' }]}
                normalize={capitalizeFirstLetter}>
                <Input prefixCls="form-input" placeholder="Enter name" />
              </Form.Item>
            </FieldBox>
            <FlexWrapper justify="end" style={{ marginTop: 20 }}>
              <Button
                loading={loading}
                onClick={() => form.submit()}
                style={{ width: 140 }}
                prefixCls="antCustomBtn">
                {edit ? 'Edit' : 'Create'}
              </Button>
            </FlexWrapper>
          </>
        </Form>
      </ContentBox>
    </Modal>
  );
};

export default CreateCollections;

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
