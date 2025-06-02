/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import Tag from '../components/common/Tag';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { useLocation } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { StatusTag } from './style';

const imgBaseUrl = process.env.REACT_APP_S3_BASE_URL;

export const CustomFlexBox = (props) => {
  const { children, alignItems, sx } = props;

  let style = {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  };

  return <Box sx={{ ...style, alignItems, ...sx }}>{children}</Box>;
};

CustomFlexBox.prototype = {
  children: PropTypes.func,
  alignItems: PropTypes.object
};

export const ErrorText = (props) => {
  const { message, padding } = props;
  return <ErrorContent padding={padding}>{message}</ErrorContent>;
};

const ErrorContent = styled.div`
  font-weight: 400;
  font-size: 0.75rem;
  color: #d32f2f;
  padding: ${(props) => (props.padding ? props.padding : '5px 0 0 20px')};
`;

export const useWindowWide = (size) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWidth]);

  return width > size;
};

export const checkActiveTab = (path) => {
  if (path === '/dashboard') return 'Dashboard';
  else if (path === '/project') return 'Projects';
  else if (path === '/billingIds') return 'Billing Ids';
  else if (path === '/reporting') return 'Reporting';
  else if (path?.includes('/view-report')) return 'Reporting';
  else if (path === '/employee') return 'Employees';
  else if (path?.includes('/view-employee')) return 'Employees';
  else if (path === '/profile') return 'Profile';
  else if (path === '/employee-doc') return 'Employees';
  else if (path === '/view-salary') return 'Employees';
  else if (path === '/remarks') return 'Employees';
  else if (path?.includes('/sub-admin')) return 'Sub-Admin';
  else if (path?.includes('/lms')) return 'LMS';
  else if (path === '/notification') return 'Notifications';
  else if (path?.includes('/roles')) return 'Role Management';
  else if (path.includes('/clients')) return 'Clients';
  else if (path?.includes('/view-attendance')) return 'Attendance';
  else if (path === '/update-admin-password') return 'Update Password';
  else if (path?.includes('/my-profile')) return 'My Profile';
  else if (path?.includes('/requests')) return 'Leave Request';
  else if (path?.includes('/hms')) return 'HMS';
  else return 'Projects';
};

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options).replace(',', '');
};

export function transformPermissions(role, permissions) {
  let modules = {};

  Object.entries(permissions).forEach(([key, value]) => {
    // Extract module name and permission type dynamically
    const match = key.match(/(.*?)(Read|Update|Create|Delete|FullAccess)$/);
    if (!match) return;

    const [, moduleName, permissionType] = match;

    // Ensure module exists in modules object
    if (!modules[moduleName]) {
      modules[moduleName] = {
        module: moduleName,
        read: false,
        update: false,
        create: false,
        del: false
      };
    }

    // Assign permissions based on type
    if (permissionType === 'Read') modules[moduleName].read = value;
    if (permissionType === 'Update') modules[moduleName].update = value;
    if (permissionType === 'Create') modules[moduleName].create = value;
    if (permissionType === 'Delete') modules[moduleName].del = value;
    if (permissionType === 'FullAccess') {
      modules[moduleName].read = true;
      modules[moduleName].update = true;
      modules[moduleName].create = true;
      modules[moduleName].del = true;
    }
  });

  return {
    role: role,
    module: Object.values(modules)
  };
}
export const getFullName = (first, middle, last) => {
  if (first && middle && last) {
    return `${first} ${middle} ${last}`;
  } else if (first && last) {
    return `${first} ${last}`;
  } else if (first && middle) {
    return `${first} ${middle}`;
  } else if (first) {
    return first;
  } else {
    return '';
  }
};

export const checkPermission = (module, action, permissions) => {
  if (!permissions) return false; // If no permissions are found, return false

  const modulePermission = permissions.find(
    (perm) => perm.module.toLowerCase() === module.toLowerCase()
  );

  return modulePermission ? !!modulePermission[action] : false; // Return true/false based on the action permission
};

export const debounce = (func, timeOut = 400) => {
  let timer;
  return (...args) => {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, timeOut);
  };
};

export function isImageValid(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

export const getStatusTag = (status, cursor = 'default') => {
  const statusStyles = {
    Pending: 'warning',
    Occupied: 'warning',
    Approved: 'success',
    Available: 'success',
    Declined: 'danger'
  };
  const tagVariant = statusStyles[status] || 'default';
  const TagVariant = Tag[tagVariant];

  return <TagVariant style={{ cursor: cursor }}>{status}</TagVariant>;
};

export const getCategory = (category) => {
  const statusStyles = {
    FD: 'Full-Day Leave',
    HD: 'Half-Day Leave',
    SL: 'Short-Duration Leave'
  };

  return statusStyles[category] || 'N/A';
};

export const getSlot = (slot) => {
  const statusStyles = {
    FH: 'First-Half Leave',
    SH: 'Second-Half Leave'
  };

  return statusStyles[slot] || 'N/A';
};

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function downloadImageMedia(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadDocMedia(url, filename) {
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(blobUrl); // Clean up
}

export function Description({ htmlString }) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}

export function ClampedDescription({ htmlString }) {
  const plainText = htmlString.replace(/<[^>]+>/g, '');
  return <div className="clamped-content">{plainText}</div>;
}

export const AmountInPattern = (value) => {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

export function getTimeAgo(string) {
  const inputDate = new Date(string);
  const now = new Date();

  const diffMs = now - inputDate;
  const diffSeconds = diffMs / 1000;
  const diffMinutes = diffSeconds / 60;
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;

  if (Math.abs(diffSeconds) < 60) {
    const roundedSeconds = Math.round(diffSeconds);
    const unit = Math.abs(roundedSeconds) === 1 ? 'second' : 'seconds';
    return `${roundedSeconds} ${unit}`;
  } else if (Math.abs(diffMinutes) < 60) {
    const roundedMinutes = Math.round(diffMinutes);
    const unit = Math.abs(roundedMinutes) === 1 ? 'minute' : 'minutes';
    return `${roundedMinutes} ${unit}`;
  } else if (Math.abs(diffHours) < 12) {
    const roundedHours = Math.round(diffHours);
    const unit = Math.abs(roundedHours) === 1 ? 'hour' : 'hours';
    return `${roundedHours} ${unit}`;
  } else {
    const roundedDays = Math.round(diffDays);
    const unit = Math.abs(roundedDays) === 1 ? 'day' : 'days';
    return `${roundedDays} ${unit}`;
  }
}

export const formatPhone = (code, number) => {
  if (!code || !number) return 'N/A';

  const countryCode = code.replace('+', '');
  const cleanedNumber = number.startsWith(countryCode) ? number.slice(countryCode.length) : number;

  if (countryCode === '91') {
    const formattedIndianNumber = cleanedNumber.replace(/(\d{5})(\d{5})/, '$1-$2');
    return `(+91) - ${formattedIndianNumber}`;
  }

  return `(${countryCode}) - ${cleanedNumber}`;
};

export function formatMobileNumber(number) {
  const digits = number?.replace(/\D/g, '');

  if (digits?.length === 10) {
    // Indian number format: 5 + 5
    return digits.replace(/^(\d{5})(\d{5})$/, '$1 $2');
  } else if (digits?.length > 10) {
    // Break into chunks of 3 except the last 4 digits (if possible)
    const mainPart = digits.slice(0, -4);
    const lastFour = digits.slice(-4);

    // Split main part into groups of 3
    const chunks = mainPart.match(/\d{1,3}/g) || [];

    return chunks.join(' ') + ' ' + lastFour;
  } else {
    // Less than 10 digits - just return as is
    return number;
  }
}

const phoneUtil = PhoneNumberUtil.getInstance();
export function getRegionFromDialCode(phoneNumber) {
  if (!phoneNumber) return null;
  let num = phoneNumber?.replace('+', '');
  try {
    const number = phoneUtil.parse(`+${num}`);
    const region = phoneUtil.getRegionCodeForNumber(number);
    return region;
  } catch (error) {
    return null;
  }
}

export const currentModule = () => {
  let location = useLocation();
  let currentPath = location?.pathname;

  if (currentPath.includes('my-profile')) {
    return 'my-profile';
  }

  let obj = {
    project: 'Projects',
    employee: 'Employee',
    hms: 'HMS',
    notification: 'Notifications',
    report: 'Reporting',
    lms: 'LMS',
    billingids: 'Billing Ids'
  };
  let routes = ['project', 'employee', 'hms', 'billingids', 'lms', 'notification', 'report'];
  let result = routes?.find((path) => currentPath?.includes(path?.toLowerCase()));
  return result ? obj[result] : false;
};

export const decryptToken = (encryptedToken) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.REACT_APP_CRYPTO_SECRET_KEY);

    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    if (!decrypted) throw new Error('Invalid decryption or wrong key');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    return null;
  }
};

export function capitalizeFirstLetter(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getColorForProfileCompletion = (percentage) => {
  const value = Number(percentage);

  if (isNaN(value)) return 'gray';
  if (value <= 50) return 'red';
  if (value <= 99) return '#FFC023';
  return '#4CAF50';
};

export const generateEmployeeImgUrl = (urlPath, isUrl) => {
  if (!urlPath) return '';

  if (isUrl) {
    return `${imgBaseUrl + urlPath}`;
  }

  return `${imgBaseUrl}employee/profileImg/${urlPath}.jpg`;
};

export const hexToRgba = (hex, alpha = 0.2) => {
  const r = parseInt(hex?.slice(1, 3), 16);
  const g = parseInt(hex?.slice(3, 5), 16);
  const b = parseInt(hex?.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const activeStatusTag = (option, key, status) => {
  let result = option?.find((el) => el?.[key] === status);
  return (
    <StatusTag bgColor={hexToRgba(result?.color, 0.2)} color={result?.color}>
      {result?.name}
    </StatusTag>
  );
};
