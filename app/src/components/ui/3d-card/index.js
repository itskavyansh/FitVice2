import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const CardContainer = styled(Box)(({ theme }) => ({
  perspective: '1000px',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
}));

export const CardBody = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transition: 'all 0.3s ease-out',
  transformStyle: 'preserve-3d',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  padding: '24px',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
}));

export const CardItem = styled(Box)(({ theme, translateZ = 0 }) => ({
  transform: `translateZ(${translateZ}px)`,
  transition: 'all 0.3s ease-out',
}));
