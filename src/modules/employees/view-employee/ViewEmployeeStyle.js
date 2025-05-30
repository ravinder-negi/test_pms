import styled from '@emotion/styled';

export const BasicInfoStyle = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  margin: 12px 0 16px;

  .avatar-box {
    width: 30%;
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;

    h2 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 18px;
      color: #111111;
      margin: 0;
    }
    p {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 14px;
      text-align: center;
      margin: 0;
      margin-top: 3px;
    }
    .edit-profile {
      background: #65beee;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 4px;
      right: 1px;
      cursor: pointer;
    }
    .profile-img {
      position: relative;
    }
  }
  .info-box {
    width: 70%;
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;

    h5 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 20px;
      color: #0e0e0e;
      text-align: start;
      margin: 0;
    }
  }

  .content {
    display: flex;
    margin-top: 5px;

    p {
      text-align: start;
      margin: 0;
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 16px;
      color: #0e0e0e;
    }
    .title {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 14px;
      color: #9f9f9f;
    }

    .contact {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .department {
      width: 100%;
    }
  }
`;

export const GeneralInfoStyle = styled.div`
  width: 100%;
`;

export const ProfileBox = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
`;

export const PersonalInfoStyle = styled.div`
  width: 100%;
  h5 {
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 20px;
    color: #0e0e0e;
    text-align: start;
    margin: 0;
  }

  .add-title {
    color: #7c71ff;
    font-family: 'Plus Jakarta Sans';
    font-weight: 600;
    font-size: 16px;
    margin: 0;
    cursor: pointer;
  }

  .edit-profile {
    background: #65beee;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e3e3;
    padding-bottom: 10px;
  }

  .details {
    display: flex;
    align-items: center;

    .line {
      width: 1px;
      background: #c8c8c8;
      height: 156px;
    }

    .names {
      width: 35%;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 14px;

      p {
        font-family: 'Plus Jakarta Sans';
        font-weight: 500;
        font-size: 14px;
        color: #767676;
        margin: 0;
        text-align: left;
        min-width: 150px;
      }
      .values {
        font-family: 'Plus Jakarta Sans';
        font-weight: 400;
        font-size: 14px;
        color: #767676;
        text-align: left;
        min-width: 150px;
        text-transform: capitalize;
      }
      .tooltip {
        white-space: nowrap;
        width: 100%;
        max-width: 68%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .contacts {
      width: 64%;
      padding-left: 20px;
      height: 100%;
    }
  }

  .job-details {
    margin-top: 10px;
    p {
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 14px;
      color: #767676;
      margin: 0;
      text-align: left;
      min-width: 150px;
    }

    h5 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 16px;
      color: #0e0e0e;
      min-width: 150px;
      text-align: left;
      margin: 0;
      margin-top: 3px;
    }
  }
`;

export const OfficialIdsStyle = styled.div`
  width: 100%;
  margin-top: 20px;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-bottom: 5px;

    h5 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 20px;
      color: #0e0e0e;
      text-align: start;
      margin: 0;
    }

    p {
      font-family: 'Plus Jakarta Sans';
      font-weight: 600;
      font-size: 16px;
      color: #7c71ff;
      margin: 0;
      cursor: pointer;
    }
  }

  .official-ids-table {
    padding-left: 0 !important;
  }
`;

export const DocumentStyle = styled.div`
  width: 100%;
  margin-top: 20px;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-bottom: 10px;

    h5 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 20px;
      color: #0e0e0e;
      text-align: start;
      margin: 0;
    }

    p {
      font-family: 'Plus Jakarta Sans';
      font-weight: 600;
      font-size: 16px;
      color: #7c71ff;
      margin: 0;
      cursor: pointer;
    }
  }
`;

export const DocumentCard = styled.div`
  width: 100%;
  padding: 17px;
  margin-top: 6px;
  border: 1px solid #c8c8c8;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: start;
  background: #ffffff;

  .document-details {
    display: flex;
    gap: 12px;
    align-items: start;
  }

  .delete-icon {
    cursor: pointer;
  }

  .document-name {
    h6 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 14px;
      color: #0e0e0e;
      margin: 0;
      text-align: left;
    }
    p {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 12px;
      color: #767676;
      margin: 0;
      text-align: left;
    }
    h4 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 14px;
      color: #7c71ff;
      margin: 0;
      text-align: left;
    }
  }
`;

export const RemarkGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 16px;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .card {
    width: 100%;
    padding: 15px;
    background: #ffffff;
    border-radius: 6px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .name {
      h5 {
        font-family: 'Plus Jakarta Sans';
        font-weight: 700;
        font-size: 18px;
        color: #111111;
        margin: 0;
        text-align: left;
      }
      p {
        font-family: 'Plus Jakarta Sans';
        font-weight: 600;
        font-size: 14px;
        color: #7c71ff;
        margin: 0;
        text-align: left;
        margin-top: 4px;
      }
    }
  }

  .textarea {
    margin-top: 16px;
  }
`;
