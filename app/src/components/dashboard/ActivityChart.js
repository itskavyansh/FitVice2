// Activity Chart Component
// Visualizes workout and activity data over time using Recharts

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Sample data for the chart
const data = [
  { name: 'Day 1', workout: 30, activity: 50 },
  { name: 'Day 2', workout: 45, activity: 60 },
  { name: 'Day 3', workout: 20, activity: 40 },
  { name: 'Day 4', workout: 50, activity: 70 },
  { name: 'Day 5', workout: 35, activity: 55 },
];

// ActivityChart component definition
const ActivityChart = () => {
  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="workout" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="activity" stroke="#82ca9d" />
    </LineChart>
  );
};

export default ActivityChart;
