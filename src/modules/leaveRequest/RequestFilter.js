import styled from '@emotion/styled';
import { Button, DatePicker, Drawer, Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { DropdownIconNew } from '../../theme/SvgIcons';
import { FieldBox } from '../../theme/common_style';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { leave_type, leaveOptions, leaveStatus } from '../../utils/constant';

const RequestFilter = ({ open, onClose, activeTab, filterData, setFilterData }) => {
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    const payload = { ...values };

    if (payload.date) {
      payload.date = dayjs(payload.date).format('YYYY-MM-DD');
    }

    setFilterData(payload);
    onClose();
  };

  const onReset = () => {
    form.resetFields();
    setFilterData({});
    onClose();
  };

  useEffect(() => {
    if (filterData) {
      const newFilter = { ...filterData };

      if (newFilter.date) {
        newFilter.date = dayjs(newFilter.date);
      }

      form.setFieldsValue(newFilter);
    }
  }, [filterData]);

  return (
    <Drawer
      width={400}
      title="Filters"
      placement="right"
      closable={true}
      prefixCls="activityCustomDrawer"
      onClose={onClose}
      open={open}
      key="right">
      <ContainerStyle>
        <Form style={{ height: '100%' }} form={form} onFinish={onSubmit}>
          {() => (
            <div className="filter-flex">
              <div>
                <FieldBox>
                  <label>Filter by Leave Type</label>
                  <Form.Item name="leave_type">
                    <Select
                      prefixCls="form-select"
                      allowClear
                      suffixIcon={<DropdownIconNew />}
                      placeholder="--Select Option--"
                      options={leave_type}
                    />
                  </Form.Item>
                </FieldBox>
                <FieldBox>
                  <label>Filter by Leave Category</label>
                  <Form.Item name="leave_category">
                    <Select
                      prefixCls="form-select"
                      allowClear
                      suffixIcon={<DropdownIconNew />}
                      placeholder="--Select Option--"
                      options={leaveOptions}
                    />
                  </Form.Item>
                </FieldBox>
                <FieldBox>
                  <label>Filter by Status</label>
                  <Form.Item name="leave_status">
                    <Select
                      prefixCls="form-select"
                      allowClear
                      suffixIcon={<DropdownIconNew />}
                      placeholder="--Select Option--"
                      options={leaveStatus}
                    />
                  </Form.Item>
                </FieldBox>
                <FieldBox>
                  <label>Filter by Start Date</label>
                  <Form.Item name="leave_date">
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      prefixCls="form-datepicker"
                      format="DD/MM/YYYY"
                      style={{ width: '100%' }}
                      disabledDate={(current) => {
                        const today = new Date();
                        const currentDate = current;
                        const todayDate = new Date(today.setHours(0, 0, 0, 0));

                        return activeTab === 'past'
                          ? currentDate > todayDate
                          : currentDate < todayDate;
                      }}
                    />
                  </Form.Item>
                </FieldBox>
              </div>

              <div style={{ paddingBottom: '20px' }}>
                <ButtonWrapper>
                  <button className="reset" onClick={onReset}>
                    Reset
                  </button>
                  <Button prefixCls="antCustomBtn" style={{ width: '100%' }} htmlType="submit">
                    Apply
                  </Button>
                </ButtonWrapper>
              </div>
            </div>
          )}
        </Form>
      </ContainerStyle>
    </Drawer>
  );
};

export default RequestFilter;

RequestFilter.propTypes = {
  open: PropTypes.bool,
  activeTab: PropTypes.string,
  onClose: PropTypes.func,
  filterData: PropTypes.object,
  setFilterData: PropTypes.func
};

const ContainerStyle = styled.div`
  width: 100%;
  padding: 10px 25px;
  height: 100%;

  .filter-flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-bottom: 20px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 24px;
  gap: 12px;

  .reset {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #0e0e0e;
    color: #0e0e0e;
    background: transparent;
    cursor: pointer;
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
  }
`;
