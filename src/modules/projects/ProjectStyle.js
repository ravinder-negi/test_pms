import styled from '@emotion/styled/macro';

export const CreateModalWrapper = styled.div`
  width: 100%;
  padding: 20px;
  position: relative;
  background: #ffffff;
  border-radius: 20px;

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

export const CreateFormWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .team-title {
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 20px;
    color: #0e0e0e;
    margin: 0;
  }

  .team-sub-title {
    font-family: 'Plus Jakarta Sans';
    font-weight: 400;
    font-size: 16px;
    color: #0e0e0e;
    margin: 0;
  }
`;

export const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;

  * {
    margin-bottom: 0px !important;
  }

  label {
    span {
      color: red;
    }
  }
`;

export const GridBox = styled.div`
  display: grid;
  grid-template-columns: ${({ cols }) => `repeat(${cols}, 1fr)`};
  gap: 16px;
`;
