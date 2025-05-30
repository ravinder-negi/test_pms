import React from 'react';
import { TabBtnStyled, TabNavStyled } from './EmpDocStyle';
import PropTypes from 'prop-types';

const TabNav = ({ list, activeTab = 1, setActiveTab }) => {
  return (
    <TabNavStyled>
      {list?.map((item, index) => (
        <TabBtnStyled
          isActive={activeTab === index + 1}
          key={index}
          onClick={() => setActiveTab(index + 1)}>
          <div className="name">{item?.name}</div>
          <div className="line" />
        </TabBtnStyled>
      ))}
    </TabNavStyled>
  );
};

export default TabNav;

TabNav.propTypes = {
  list: PropTypes.array,
  activeTab: PropTypes.number,
  setActiveTab: PropTypes.func
};
