import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const fontFamilys = {
  poppinsFont: 'Poppins'
};

export const EllipsisText = styled.div`
  width: ${(props) => props.width || '150px'};
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
`;

export const FlexWrapper = styled.div`
  width: ${(props) => props.width};
  display: flex;
  flex-wrap: ${(props) => props.wrap || 'wrap'};
  flex-direction: ${(props) => props.direction || 'row'};
  justify-content: ${(props) => props.justify || 'center'};
  align-items: ${(props) => props.align || 'center'};
  gap: ${(props) => props.gap || '0px'};
  cursor: ${(props) => props.cursor || 'auto'};
  margin: ${(props) => props.margin || '0px'};

  .hms-remark {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

export const LinkStyled = styled(Link)(({ display }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: display && display
}));

export const PaginationBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const ViewIconBox = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  background: #7c71ff;
  border-radius: 50%;
  cursor: pointer;
`;
export const DeleteIconBox = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  background: ${({ canDelete }) => (!canDelete ? '#cecece' : '#fb4a49')};
  cursor: ${({ canDelete }) => (!canDelete ? 'not-allowed' : 'pointer')};
  border-radius: 50%;
`;

export const UpdateKeyIconBox = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  background: ${({ canUpdate }) => (!canUpdate ? '#cecece' : '#5F3A6B')};
  cursor: ${({ canUpdate }) => (!canUpdate ? 'not-allowed' : 'pointer')};
  border-radius: 50%;
`;

export const EditIconBox = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  background: ${({ canUpdate }) => (!canUpdate ? '#cecece' : '#65beee')};
  cursor: ${({ canUpdate }) => (!canUpdate ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ canUpdate }) => (!canUpdate ? 'none' : 'auto')};
  border-radius: 50%;
`;

export const PurpleText = styled.p`
  color: #7c71ff;
  font-size: ${({ size }) => size || '14px'};
  margin: 0;
  font-family: Plus Jakarta Sans;
  font-weight: 500;
`;

export const SkyText = styled.p`
  color: #65beee;
  font-size: ${({ size }) => size || '14px'};
  margin: 0;
  font-weight: 500;
  font-family: Plus Jakarta Sans;
`;

export const GreyText = styled.p`
  color: #9f9f9f !important;
  font-size: ${({ size }) => size || '12px'};
  margin: ${({ margin }) => margin || '0'};
  font-family: Plus Jakarta Sans;
  text-wrap: wrap;
`;

export const DarkText = styled.p`
  color: #0e0e0e !important;
  font-size: ${({ size }) => size || '14px'};
  font-weight: ${({ weight }) => weight || '500'};
  margin: ${({ margin }) => margin || '0'};
  font-family: Plus Jakarta Sans;
`;

export const Title = styled.h2`
  font-family: 'Plus Jakarta Sans';
  margin: 0;
  font-weight: 700;
  font-size: 20px;
  text-transform: capitalize;
`;

export const ApplyDate = styled.div`
  font-family: 'Plus Jakarta Sans';
  color: #7c71ff;
  font-size: 14px;
  font-weight: 500;
`;
export const CardContent = styled.div`
  font-size: 12px;
  margin: 0px !important;
  color: '#7A7B7A';
`;

export const FieldBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;

  .addition-div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      margin: 0px;
      color: #7c71ff;
      cursor: pointer;
    }
  }

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

export const InfoWrapper = styled(FlexWrapper)`
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: ${({ gap }) => gap || '4px'};
  text-align: left;

  span {
    font-size: 14px !important;
    font-weight: 500;
    color: #9f9f9f !important;
    margin: 0 !important;
    font-family: Plus Jakarta Sans !important;
  }

  p {
    font-size: 16px !important;
    font-weight: 500;
    color: #0e0e0e !important;
    margin: 0 !important;
    font-family: Plus Jakarta Sans !important;
  }
`;
