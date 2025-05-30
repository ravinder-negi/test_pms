import { Button, Card, Typography } from '@mui/material';
import colors from '../theme/colors';

function DataNotFound(prop) {
  const { label, path, text, showButton = true } = prop;
  return (
    <NotFoundCard>
      <Typography sx={textStyle()}>
        {text ? text : 'No project created Yet Kindly create project first'}
      </Typography>
      {showButton && (
        <Button
          onClick={() => path()}
          variant="contained"
          sx={{ background: colors.darkSkyBlue, marginTop: '15px' }}>
          {label}
        </Button>
      )}
    </NotFoundCard>
  );
}

export default DataNotFound;

export const NotFoundCard = styled(Card)({
  marginTop: '30px',
  height: '300px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
});

export const textStyle = () => {
  const style = {
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontSize: '16px',
    color: colors.grayLight,
    width: '180px'
  };
  return style;
};
