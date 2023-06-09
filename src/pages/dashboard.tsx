import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, Grid, Title as Heading} from '@mantine/core';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import BarChart from '../../components/BarChart';
import DoughnutChart from '../../components/DoghnutChart';
import PieChart from '../../components/PieChart';
import RadarChart from '../../components/RadarChart';
import PolarChart from '../../components/PolarChart';
import LineChart from '../../components/LineChart';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: 'Dataset 3',
      data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      backgroundColor: 'rgb(53, 162, 235)',
    },
  ],
};

export default function Dashboard() {
  return <>
   <Heading>Dashboard</Heading>
    <Grid>
      <Card w={'25%'} m={5}><PieChart/></Card>
      <Card w={'45%'} m={5}><BarChart/></Card>
      <Card w={'25%'} m={5}><RadarChart/></Card>
    </Grid>
    <Grid>
      <Card w={'25%'} m={5}><DoughnutChart/></Card>
      <Card w={'45%'} m={5}><LineChart/></Card>
      <Card w={'25%'} m={5}><PolarChart/></Card>
    </Grid>
  </>;
}
