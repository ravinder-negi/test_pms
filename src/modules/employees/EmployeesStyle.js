import styled from '@emotion/styled';

export const CreateModalWrapper = styled.div`
  width: 100%;
  padding: 20px;
  position: relative;
  background: #ffffff;
  border-radius: 20px;

  .title {
    width: 100%;
    display: flex;
    justify-content: center;

    h2 {
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 24px;
      color: #0e0e0e;
      text-align: center;
      margin: 0;
    }
  }

  .steps {
    width: 100%;
    margin-top: 20px;

    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 5px;

      p {
        margin: 0;
        font-weight: 500;
      }
      .lines {
        width: 100%;
        height: 3px;
        background: #e3e3e3;
        margin-top: 10px;
      }
    }
  }
`;

export const ModalCloseBox = styled.button`
  position: absolute;
  right: -12px;
  top: -14px;
  cursor: pointer;
  width: 27px;
  height: 27px;
  background: #7c71ff;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CreateFormWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .skip-section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      font-weight: 500;
      font-size: 16px;
      margin: 0px;
      cursor: pointer;
    }
    .address-title {
      font-family: 'Plus Jakarta Sans';
      font-weight: 500;
      font-size: 20px;
      color: #0e0e0e;
      margin: 0;
    }
  }

  .upload-image {
    display: flex;
    align-items: center;
    gap: 12px;

    p {
      margin: 0;
      font-family: 'Plus Jakarta Sans';
      font-weight: 600;
      font-size: 14px;
      text-decoration: underline;
      color: #7c71ff;
      cursor: pointer;
    }
  }
`;

export const GridBox = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, 1fr)`};
  gap: 16px;
`;

export const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 15px;

  * {
    margin-bottom: 0px !important;
  }

  label {
    span {
      color: red;
    }
  }
`;
