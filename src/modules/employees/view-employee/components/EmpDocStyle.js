import styled from '@emotion/styled';

export const TabNavStyled = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  gap: 8px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0px 4px 18px 0px #141e490d;
  padding: 16px 0px 0px;
`;

export const TabBtnStyled = styled.div`
  width: fit-content;
  height: 40px;
  font-family: 'Plus Jakarta Sans';
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0%;
  color: ${({ isActive }) => (isActive ? '#7C71FF' : '#0E0E0E')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  cursor: pointer;
  margin: 0px 6px;

  .name {
    padding: 0px 10px;
    margin-bottom: 8px;
  }

  .line {
    width: 100%;
    height: 4px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: ${({ isActive }) => (isActive ? '#7C71FF' : '#ffffff')};
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const DocCardStyle = styled.div`
  /* width: 248px; */
  height: 204px;
  border-radius: 12px;
  padding: 8px;
  background: #ffffff;
  box-shadow: ${({ checkbox }) =>
    checkbox ? '0px 0px 0px 2px #4040f5' : '0px 0px 0px 2px transparent'};

  :hover {
    box-shadow: 0px 0px 0px 2px #4040f5;
  }

  .upper-container {
    width: 100%;
    height: 140px;
    background: #fafafa;
    border-radius: 12px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .action {
      display: none;
    }
    .checkbox {
      display: ${({ checkbox }) => (checkbox ? 'block' : 'none')};
    }

    :hover .action {
      display: flex;
      transition: all 0.5s ease-in-out;
    }
    :hover .checkbox {
      display: block;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
    }
  }

  .lower-container {
    width: 100%;
    height: fit-content;
    background: #ffffff;
    margin-top: 8px;

    .text {
      width: 200px;
      font-family: 'Plus Jakarta Sans';
      font-weight: 700;
      font-size: 14px;
      line-height: 150%;
      color: #0e0e0e;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .info {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 10px;
      line-height: 150%;
      letter-spacing: 0%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;

      .date {
        display: flex;
        align-items: center;
        color: #818b9a;
      }

      i {
        cursor: pointer;
        color: #7b7f91;
      }

      .dot {
        width: 4px;
        height: 4px;
        background: #c9c9d1;
        border-radius: 50%;
        margin: 0px 8px;
      }
    }
  }
`;

export const CheckBoxStyled = styled.input`
  position: absolute;
  top: 6px;
  left: 6px;
  accent-color: #7c71ff;
  width: 16px;
  height: 16px;
  border: 1px solid #b8b8b8;
`;

export const ActionTabStyled = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 24px;
  padding: 4px;
  width: fit-content;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);

  i {
    width: 16px;
    height: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: #ffffff;
    }
  }

  .line {
    width: 1px;
    height: 16px;
    background: #ffffff;
    opacity: 0.5;
    border-radius: 2px;
  }
`;

export const AllDocsStyle = styled.div`
  width: 100%;
  height: fit-content;

  .selected-docs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    height: 24px;

    .row {
      display: flex;
      align-items: center;
      gap: 8px;

      div {
        height: 24px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .selected-text {
        font-family: 'Plus Jakarta Sans';
        font-weight: 400;
        font-size: 16px;
        line-height: 150%;
        color: #111111;
      }
    }
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 24px;
    padding: 4px;
    width: fit-content;

    svg {
      cursor: pointer;
    }

    .line {
      width: 1px;
      height: 18px;
      background: #3c3c3c;
      opacity: 0.5;
      border-radius: 2px;
    }
  }
`;

export const CollectionStyle = styled.div`
  width: 100%;
  height: fit-content;
`;

export const AddCardStyle = styled.div`
  height: 132px;
  border-radius: 16px;
  padding-top: 30px 23px;
  border: 1px dashed #d2d4de;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  background-color: #ffffff;

  .text {
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    color: #0e0e0e;
  }
`;

export const CardStyle = styled.div`
  height: 132px;
  border-radius: 12px;
  border: 1px solid #d2d4de;
  padding: 10px;
  background-color: #ffffff;
  cursor: pointer;

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      cursor: pointer;
      color: #7b7f91;
    }

    .files {
      font-family: 'Plus Jakarta Sans';
      font-weight: 400;
      font-size: 12px;
      line-height: 140%;
      color: #7b7f91;
    }
  }

  .text {
    font-family: 'Plus Jakarta Sans';
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    color: #242424;
    margin: 17px 0 8px;
    text-align: left;
  }
`;

export const ContentStyle = styled.div`
  display: flex;
  gap: 8px;

  > div {
    cursor: pointer;
  }
`;
