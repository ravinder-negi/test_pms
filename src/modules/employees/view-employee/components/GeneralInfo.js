/* eslint-disable react/prop-types */
import React from 'react';
import { GeneralInfoStyle } from '../ViewEmployeeStyle';
import PersonalInfo from './PersonalInfo';
import OfficialIds from './OfficialIds';
import WorkExperience from './WorkExperience';
import Education from './Education';

const GeneralInfo = ({ loading, details, handleList }) => {
  return (
    <GeneralInfoStyle>
      <PersonalInfo loading={loading} details={details} handleList={handleList} />
      <OfficialIds handleList={handleList} />
      <WorkExperience handleList={handleList} />
      <Education handleList={handleList} />
    </GeneralInfoStyle>
  );
};

export default GeneralInfo;
