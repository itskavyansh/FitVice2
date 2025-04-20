import React, { useState } from 'react';
import { Card, Box, Typography, IconButton, CardContent, CardActions, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import WorkoutModel from '../ThreeDModels/WorkoutModel';

// Animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
export const StatsCard = styled(Card)(({ theme, color }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  background: `linear-gradient(135deg, ${theme.palette[color || 'primary'].main} 0%, ${theme.palette[color || 'primary'].dark} 100%)`,
  color: theme.palette.common.white,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px ${theme.palette[color || 'primary'].light}`,
    '& .stats-icon': {
      animation: `${rotateAnimation} 2s linear infinite`,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle at top right, ${theme.palette[color || 'primary'].light}22, transparent 70%)`,
  },
}));

export const ChartCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)',
    '& .chart-card-decoration': {
      transform: 'rotate(45deg) scale(1.2)',
      opacity: 0.2,
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
  }
}));

export const WorkoutCard = styled(Card)(({ theme, active }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  background: active ? 
    `linear-gradient(135deg, ${theme.palette.primary.light}22, ${theme.palette.primary.main}11)` : 
    theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: active ? 
      `0 15px 35px rgba(33, 150, 243, 0.2), 0 0 10px ${theme.palette.primary.main}66, 0 0 0 1px ${theme.palette.primary.main}22` : 
      '0 10px 20px rgba(0, 0, 0, 0.1)',
    '& .workout-icon': {
      animation: `${floatAnimation} 2s ease-in-out infinite`,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at bottom right, rgba(33, 150, 243, 0.1), transparent 70%)',
    opacity: active ? 1 : 0,
    transition: 'opacity 0.3s ease',
  },
  ...(active && {
    animation: `${pulse} 2s infinite`,
  }),
}));

// Interactive Components
export const ThreeDStatsCard = ({ icon, title, count, color = "primary", onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <StatsCard 
      color={color}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="button" color="white" fontWeight="medium" mb={1} textTransform="uppercase">
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {count}
            </Typography>
          </Box>
          <Box 
            className="stats-icon"
            sx={{ 
              height: 60, 
              width: 60, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              transform: hovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <Icon sx={{ fontSize: 30 }}>{icon}</Icon>
          </Box>
        </Box>
      </CardContent>
    </StatsCard>
  );
};

export const ThreeDWorkoutCard = ({ title, subtitle, description, modelType, color, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <WorkoutCard 
      active={active}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      sx={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <CardContent>
        <Box height={200} mb={2} className="workout-icon">
          <WorkoutModel type={modelType} color={color} interactive={true} />
        </Box>
        <Typography variant="h5" fontWeight="bold" component="div">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {subtitle}
          </Typography>
        )}
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
      {onClick && (
        <CardActions sx={{ 
          justifyContent: 'flex-end',
          background: hovered ? 
            `linear-gradient(to right, transparent, ${color}22)` : 
            'transparent',
          transition: 'all 0.3s ease'
        }}>
          <Button size="small" color="primary">
            Start
          </Button>
        </CardActions>
      )}
    </WorkoutCard>
  );
};

export const ThreeDChartCard = ({ children, ...props }) => {
  return (
    <ChartCard {...props}>
      <Box 
        className="chart-card-decoration"
        sx={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1), transparent 70%)',
          transition: 'all 0.5s ease',
          zIndex: 0
        }}
      />
      {children}
    </ChartCard>
  );
}; 