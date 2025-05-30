import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Form, Input, Select } from 'antd';
import { FieldBox, FlexWrapper } from '../../../../../theme/common_style';
import { addEmployeeBank } from '../../../../../services/api_collection';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { DropdownIconNew } from '../../../../../theme/SvgIcons';
import { bankOptions } from '../../../../../utils/constant';
import { capitalizeFirstLetter } from '../../../../../utils/common_functions';

const { Option } = Select;

const StepFour = ({ employeeId, onClose }) => {
  const [form] = Form.useForm();
  const [loader, seatLoader] = useState(false);
  const [branchName, setBranchName] = useState(false);

  const handleSubmit = async (values) => {
    if (employeeId) {
      seatLoader(true);
      let req = {
        bank_account: values?.accountNumber,
        branch_name: values?.branchName,
        ifsc_code: values?.ifscCode
      };
      let res = await addEmployeeBank(req, employeeId);
      if (res.statusCode === 200) {
        seatLoader(false);
        toast.success(res?.message);
        onClose();
      } else {
        seatLoader(false);
        toast.error(
          res?.response?.data?.message || res?.error || res?.message || 'Something went wrong'
        );
      }
    }
  };
  return (
    <Wrapper>
      <p className="head-skip" onClick={() => onClose()}>
        (Skip)
      </p>
      <Form form={form} onFinish={handleSubmit}>
        <FieldBox>
          <FlexWrapper width="100%" justify="space-between">
            <label>
              Bank Name<span>*</span>
            </label>
            <p
              style={{ cursor: 'pointer', margin: 0, color: '#7C71FF' }}
              onClick={() => {
                setBranchName(!branchName);
              }}>
              {branchName ? '- Remove' : '+ Add'}
            </p>
          </FlexWrapper>
          <Form.Item
            name="branchName"
            rules={[
              {
                required: true,
                message: 'Please enter your bank name'
              },
              {
                min: 3,
                max: 40,
                message: 'Bank Name must be between 3 and 40 characters'
              }
            ]}
            normalize={capitalizeFirstLetter}>
            {branchName ? (
              <Input prefixCls="form-input" placeholder="Enter your Bank name" />
            ) : (
              <Select
                showSearch
                prefixCls="form-select"
                suffixIcon={<DropdownIconNew />}
                placeholder="--Select Option--"
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }>
                {bankOptions?.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </FieldBox>
        <FieldBox>
          <label>
            IFSC Code<span>*</span>
          </label>
          <Form.Item
            name="ifscCode"
            rules={[
              {
                required: true,
                message: 'Please enter your IFSC code'
              },
              {
                pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                message:
                  'IFSC code must be in the format: 4 letters, 0, followed by 6 letters or digits (e.g., ABCD0123456)'
              }
            ]}>
            <Input
              prefixCls="form-input"
              placeholder="Enter your ifsc code"
              autoComplete="off"
              maxLength={11}
            />
          </Form.Item>
        </FieldBox>
        <FieldBox>
          <label>
            Account Number<span>*</span>
          </label>
          <Form.Item
            name="accountNumber"
            validateFirst
            rules={[
              {
                required: true,
                message: 'Please enter your account number'
              },
              {
                pattern: /^[0-9]*$/,
                message: 'Account number must contain numbers only'
              },
              {
                min: 9,
                max: 18,
                message: 'Account number must be between 9 and 18 digits'
              }
            ]}>
            <Input prefixCls="form-input" placeholder="Enter your account number" maxLength={18} />
          </Form.Item>
        </FieldBox>
        <FlexWrapper justify={'end'} gap={'10px'} style={{ marginTop: '20px' }}>
          <Button
            loading={loader}
            onClick={form.submit}
            style={{ width: '140px' }}
            prefixCls="antCustomBtn">
            Save
          </Button>
        </FlexWrapper>
      </Form>
    </Wrapper>
  );
};

export default StepFour;

const Wrapper = styled.div`
  .head-skip {
    display: flex;
    align-items: center;
    justify-content: end;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
  }
`;

StepFour.propTypes = {
  employeeId: PropTypes.any,
  onClose: PropTypes.any
};
