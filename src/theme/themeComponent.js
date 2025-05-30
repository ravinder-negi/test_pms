import { createTheme } from '@mui/material/styles';
import colors from './colors';

export const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'editBtn' },
          style: {
            fontWeight: `${500}`,
            fontSize: '14px',
            border: `1px solid ${colors.darkSkyBlue}`,
            color: colors.darkSkyBlue
          }
        },
        {
          props: { variant: 'submitPrimary' },
          style: {
            fontWeight: `${500}`,
            fontSize: '14px',
            borderRadius: '4px',
            color: colors.white,
            background: colors.darkSkyBlue
          }
        }
      ]
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: 'body1_medium' },
          style: {
            fontSize: '12px',
            fontWeight: 500
          }
        },
        {
          props: { variant: 'subtitle' },
          style: {
            fontSize: '14px',
            fontWeight: 700
          }
        },
        {
          props: { variant: 'title_1' },
          style: {
            fontSize: '14px',
            fontWeight: 400,
            color: colors.grayLight
          }
        },
        {
          props: { variant: 'body_2' },
          style: {
            fontSize: '22px',
            fontWeight: 700,
            color: colors.nero
          }
        },
        {
          props: { variant: 'body_1' },
          style: {
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '16px',
            color: colors.nero
          }
        },
        {
          props: { variant: 'title_2' },
          style: {
            fontSize: '12px',
            fontWeight: 400,
            color: colors.nero
          }
        },
        {
          props: { variant: 'title_blue' },
          style: {
            fontSize: '14px',
            fontWeight: 500,
            color: colors.darkSkyBlue
          }
        }
      ]
    }
  }
});
