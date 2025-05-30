import styled from '@emotion/styled';
import { Button, Drawer, Form } from 'antd';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const FilterDrawer = ({ open, onClose, filterData, setFilterData }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setFilterData(values);
    onClose();
  };

  const onReset = () => {
    setFilterData({});
    form.resetFields();
  };

  useEffect(() => {
    if (filterData) {
      form.setFieldsValue(filterData);
    }
  }, []);

  return (
    <Drawer
      width={490}
      title={<Title clear={onReset} />}
      placement="right"
      closable={false}
      prefixCls="activityCustomDrawer"
      onClose={onClose}
      open={open}
      key="right">
      <FilterWrapper>
        <Form style={{ height: '100%' }} form={form} layout="vertical" onFinish={onFinish}>
          <div>
            <div>Filters</div>
            <ButtonWrapper>
              <button className="reset" onClick={onClose}>
                Close
              </button>
              <Button prefixCls="antCustomBtn" style={{ width: '100%' }} htmlType="submit">
                Apply
              </Button>
            </ButtonWrapper>
          </div>
        </Form>
      </FilterWrapper>
    </Drawer>
  );
};

FilterDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  filterData: PropTypes.object,
  setFilterData: PropTypes.func
};

export default FilterDrawer;

const Title = ({ clear }) => {
  return (
    <ModalTitle>
      <h2>Filters</h2>
      <button onClick={clear}>Clear Filters</button>
    </ModalTitle>
  );
};

Title.propTypes = {
  clear: PropTypes.func
};

const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 0;
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 24px;
    line-height: 120%;
    color: #242424;
  }
  button {
    font-family: 'Plus Jakarta Sans';
    font-weight: 600;
    font-size: 14px;
    line-height: 120%;
    text-decoration: underline;
    color: #fb4a49;
    background-color: transparent;
    padding: 0;
    margin: 0;
    border: none;
    cursor: pointer;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  padding-top: 24px;
  justify-content: end;
  border-top: 1px solid #c8c8c8;

  button {
    width: 150px !important;
  }

  .reset {
    width: 100px;
    border-radius: 10px;
    border: transparent;
    color: #0e0e0e;
    background: transparent;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
  }
`;

const FilterWrapper = styled.div`
  width: 100%;
  padding: 34px;
  height: 100%;
  position: relative;

  .filter-flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-bottom: 20px;
  }

  .section {
    width: 100%;

    .singleCheck {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 14px;
      line-height: 150%;
      display: flex;
      align-items: center;
      color: #0e0e0e;
      gap: 6px;
      margin: 0;
    }

    h2 {
      color: #818b9a;
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 12px;
      line-height: 140%;
      margin: 0 0 6px 0;
    }
  }
`;
