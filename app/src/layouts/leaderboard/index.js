import React from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
} from '@mui/material';
import MDBox from 'components/MDBox';

// Example data - replace with actual data from your backend
const leaderboardData = [
  {
    rank: 1,
    name: "John Doe",
    points: 1200,
    avatar: null,
    level: "Expert"
  },
  {
    rank: 2,
    name: "Jane Smith",
    points: 1100,
    avatar: null,
    level: "Advanced"
  },
  {
    rank: 3,
    name: "Mike Johnson",
    points: 900,
    avatar: null,
    level: "Intermediate"
  },
  // Add more users as needed
];

function Leaderboard() {
  return (
    <Box
      sx={{
        position: 'relative',
        marginLeft: { sm: '250px' },
        width: { sm: 'calc(100% - 250px)' },
        p: 3
      }}
    >
      <Card>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
        >
          <Typography variant="h6">Fitness Leaderboard</Typography>
        </MDBox>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Level</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData.map((user) => (
                <TableRow key={user.rank}>
                  <TableCell>#{user.rank}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.avatar}>
                        {user.name[0]}
                      </Avatar>
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.level}</TableCell>
                  <TableCell align="right">{user.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default Leaderboard; 