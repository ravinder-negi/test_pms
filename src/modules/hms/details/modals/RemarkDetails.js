import { Modal } from 'antd';
import React from 'react';
import RemarkCard from '../components/RemarkCard';
import PropTypes from 'prop-types';

const RemarkDetails = ({ open, onClose, title, remarks, createdAt }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      prefixCls="antCustomModal"
      width={376}
      centered
      footer={null}>
      <div style={{ height: 'fit-content' }}>
        <RemarkCard viewing={true} title={title} remarks={remarks} createdAt={createdAt} />
      </div>
    </Modal>
  );
};

RemarkDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  val: PropTypes.any,
  title: PropTypes.string,
  remarks: PropTypes.string,
  createdAt: PropTypes.string
};

export default RemarkDetails;
