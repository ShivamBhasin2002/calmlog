"use client";
import Calendar from "@/Components/Calendar";
import { getCurrentDateFormatted } from "@/pages/questioner";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
const DefaultLayout = dynamic(() => import("@/Components/DefaultLayout", { ssr: false }));
const ChartOne = dynamic(() => import("@/Components/Chart", { ssr: false }));
const DonutChart = dynamic(() => import("@/Components/DonutChart", { ssr: false }));

export const getPopulatedUsers = async (user_id) => {
  let user = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user_id}/?populate=*`);
  if (!user) return null;
  user = user.data;
  user = {
    ...user,
    tasks: user.tasks.map((task) => {
      const status = user.task_progresses.find((t) => t.executionDate === getCurrentDateFormatted() && t.task_id === task.id);
      if (status) return { ...task, status };
      else return { ...task };
    }),
  };
  return user;
};

function groupByExecutionDate(data) {
  const result = {};

  data.forEach((item) => {
    const date = new Date(item.executionDate);
    const day = date.getDate();

    if (!result[day]) {
      result[day] = [];
    }

    result[day].push(item.id);
  });

  return result;
}

export default function Dashboard({ user }) {
  const router = useRouter();
  if (!user) {
    signOut();
    router.push("/auth/signIn");
  }
  const tasksVsDate = groupByExecutionDate(user.task_progresses);
  return (
    <DefaultLayout user={user} pageName="Daily Tasks">
      <Calendar tasksVsDate={tasksVsDate} user={user} />
      <div className="flex">
        <ChartOne tasksVsDate={tasksVsDate} />
        <DonutChart mentalHealthScore={user.mentalHealthScore} />
      </div>
    </DefaultLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session === null && ctx.res) redirect(ctx.res, 307, "/auth/signIn");
  let user = await getPopulatedUsers(session?.id);
  return {
    props: {
      user: user,
    },
  };
};
