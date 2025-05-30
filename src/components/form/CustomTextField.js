import { Box, IconButton, TextField } from '@mui/material';
import colors from '../../theme/colors';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { HideDataIcon, VisibleDataIcon } from '../../theme/SvgIcons';
import { useState } from 'react';
export const FieldStyle = styled(TextField)(({ hasError, width }) => ({
  background: colors.white,
  width: width || '100%',
  border: `1px solid ${hasError ? colors.redError : colors.Gray90}`,
  borderRadius: '8px',
  height: '47px',

  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      border: '0px solid transparent'
    },
    '&.Mui-focused fieldset': {
      borderColor: `${hasError ? colors.redError : colors.blue92}`,
      borderWidth: `${hasError ? '0px' : '2px'}`
    },
    '& input': {
      padding: '12px',
      height: '21px',
      fontSize: '16px'
    }
  }
}));

const CustomTextField = (props) => {
  const { value, onChange, name, type, placeholder, width, error, helperText, register } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((pre) => !pre);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <FieldStyle
        {...register}
        name={name}
        sx={{
          width: '100%',
          borderRadius: '8px', // Rounded corners
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc' // Default border color
            },
            '&:hover fieldset': {
              borderColor: '#888' // Border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2', // Blue border on focus
              borderWidth: '2px'
            }
          },
          '& .MuiInputBase-input': {
            padding: '10px 14px', // Adjust text padding
            fontSize: '16px' // Increase font size
          }
        }}
        placeholder={placeholder}
        type={type !== 'password' ? type : showPassword ? 'text' : 'password'}
        value={value}
        hasError={error}
        error={error ? error : false}
        width={width}
        helperText={helperText ? helperText : ''}
        onChange={onChange}
      />
      {type === 'password' && (
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          sx={{
            position: 'absolute',
            right: 56,
            top: showPassword ? -20 : -21,
            padding: 0,
            borderRadius: 0
          }}>
          {showPassword ? <VisibleDataIcon /> : <HideDataIcon />}
        </IconButton>
      )}
      {type === 'password' && (
        <p
          onClick={handleClickShowPassword}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: 10,
            top: -40,
            color: '#9F9F9F',
            fontSize: '16px'
          }}>
          {' '}
          {showPassword ? 'Show' : 'Hide'}
        </p>
      )}
    </Box>
  );
};

CustomTextField.propTypes = {
  name: PropTypes.string,
  inputProps: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
  sx: PropTypes.object,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  register: PropTypes.object
};

export default CustomTextField;
