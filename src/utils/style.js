import styled from '@emotion/styled';

export const StickyBox = styled.div`
  width: ${({ width }) => width || '100%'};
  position: sticky;
  top: ${({ top }) => top || 0};
  z-index: ${({ index }) => index || 99};
  background-color: ${({ bg }) => bg || '#f3f6fc'};
  padding: ${({ padding }) => padding || '12px 0 16px'};
`;
