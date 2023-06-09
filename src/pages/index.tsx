import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Grid, Title as Heading } from "@mantine/core";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import BarChart from "../../components/BarChart";
import DoughnutChart from "../../components/DoghnutChart";
import PieChart from "../../components/PieChart";
import RadarChart from "../../components/RadarChart";
import PolarChart from "../../components/PolarChart";
import LineChart from "../../components/LineChart";
import { Head } from "next/document";
import AppShellDemo from "components/Shell";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>SIDCL Admin Dashboard</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading>Dashboard</Heading>
      <AppShellDemo children={undefined}/>
      {/* <Grid>
        <Card w={"25%"} m={5}>
          <PieChart />
        </Card>
        <Card w={"45%"} m={5}>
          <BarChart />
        </Card>
        <Card w={"25%"} m={5}>
          <RadarChart />
        </Card>
      </Grid>
      <Grid>
        <Card w={"25%"} m={5}>
          <DoughnutChart />
        </Card>
        <Card w={"45%"} m={5}>
          <LineChart />
        </Card>
        <Card w={"25%"} m={5}>
          <PolarChart />
        </Card>
      </Grid> */}
    </>
  );
}
