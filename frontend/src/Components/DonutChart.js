import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const options = {
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "donut",
  },
  colors: ["#3C50E0", "#6577F3", "#8FD0EF"],
  labels: ["Low stress", "Medium stress", "High stress "],
  legend: {
    show: false,
    position: "bottom",
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const DonutChart = ({ mentalHealthScore }) => {
  const [showChart, toggleChart] = useState(false);
  const getMentalHealthScores = () => {
    if (mentalHealthScore === 3) return [100, 0, 0];
    if (mentalHealthScore === 2) return [0, 100, 0];
    if (mentalHealthScore === 1) return [0, 0, 100];
  };

  const [state, setState] = useState({
    series: getMentalHealthScores(),
  });

  useEffect(() => {
    toggleChart(true);
    if (window.location.href.includes("test")) setState({ series: [85, 10, 5] });
  }, []);

  if (!showChart) return;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5 w-[30%]">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">Stress Analytics</h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="DonutChart" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={state.series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> High stress </span>
              <span> {state.series[2]}% </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Medium stress </span>
              <span> {state.series[1]}% </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Low stress </span>
              <span> {state.series[0]}% </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
