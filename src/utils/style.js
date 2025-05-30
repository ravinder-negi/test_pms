import styled from '@emotion/styled';

export const StickyBox = styled.div`
  width: ${({ width }) => width || '100%'};
  position: sticky;
  top: ${({ top }) => top || 0};
  z-index: ${({ index }) => index || 99};
  background-color: ${({ bg }) => bg || '#f3f6fc'};
  padding: ${({ padding }) => padding || '12px 0 16px'};
`;

export const StatusTag = styled.div`
  width: max-content;
  min-width: 80px;
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ bgColor }) => bgColor};
  color: ${({ color }) => color};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;
