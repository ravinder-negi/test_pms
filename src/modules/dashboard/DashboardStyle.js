import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { fontFamilys } from '../../theme/common_style';
import colors from '../../theme/colors';

export const ContainerStyled = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 2px 11.3px 0px #0d0a2c14;
  padding: 20px;
  width: ${(props) => props.width || '100%'};
`;

export const CardStyle = styled.div`
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  overflow: hidden;
  min-height: 100px;
  background-color: white;
  padding: ${(props) => (props.padding ? props.padding : '0')};
`;

export const CardDataNotFound = styled(Typography)`
  text-align: left;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-shadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 1px 3px 0px rgba(0, 0, 0, 0.12)';
`;

export const StylePanel = styled.div`
  height: 50px;
  margin: ${(props) => (props.margin ? props.margin : '0 15px')};
  display: flex;
  text-align: left;
  width: 100%;
  .serial-no {
    width: 24%;
  }
  .uid {
    width: 21%;
  }
  .name {
    width: 28%;
  }
  .date {
    width: 25%;
  }
  .text {
    color: #000000;
    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
  }

  .name-leave {
    display: flex;
    // width: 26%;
    flex: 1;
    text-align: left;
  }
  .serialNumber {
    // width: 15%;
    flex: 0.6;
    text-align: left;
  }
  .uid-leave {
    // width: 13%;
    flex: 0.6;
    text-align: left;
  }
  .date-leave {
    // width: 18%;
    flex: 1;
    text-align: center;
  }
  .date1 {
    // width: 21%;
    flex: 1;
    text-align: center;
  }
  .to {
    width: 4%;
    text-transform: none;
  }
`;
export const SectionTitle = styled(Typography)`
  font-family: ${fontFamilys.poppinsFont};
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  text-align: start;
  color: ${colors.black};
  line-height: 22px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

export const ContainerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
