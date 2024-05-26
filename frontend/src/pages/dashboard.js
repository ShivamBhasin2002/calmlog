import dynamic from "next/dynamic";
const DefaultLayout = dynamic(() => import("@/Components/DefaultLayout"), { ssr: false });
import { getCurrentDateFormatted } from "@/pages/questioner";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

const Task = ({ task, toggleTask, toggleLoading, isLoading, user }) => (
  <tr>
    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
      <h5 className="font-medium text-black dark:text-white">{task.brief}</h5>
    </td>
    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
      <p className="text-black dark:text-white">{task.instructions}</p>
    </td>
    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
      <div>
        <label className="flex cursor-pointer select-none items-center">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              onClick={() => {
                if (isLoading) return;
                toggleLoading(true);
                if (!task.status) {
                  axios
                    .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/task-progresses`, {
                      data: { executionDate: getCurrentDateFormatted(), task_id: task.id, task: task.id, user: user.id },
                    })
                    .then(({ data }) => {
                      toggleTask(task.id, data.data);
                      toggleLoading(false);
                    });
                } else {
                  axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/task-progresses/${task.status.id}`).then(() => {
                    toggleTask(task.id, undefined);
                    toggleLoading(false);
                  });
                }
              }}
            />
            <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-meta-4"></div>
            <div className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-bodydark transition ${task.status && "!right-1 !translate-x-full !bg-primary dark:!bg-bodydark"}`}>
              <span className={`${task.status && "hidden"}`}>
                <svg className="h-4 w-4 stroke-current" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </span>
            </div>
          </div>
        </label>
      </div>
    </td>
  </tr>
);

export default function Dashboard({ user }) {
  const [tasks, updateTasks] = useState(user.tasks);
  const [isLoading, toggleLoading] = useState(false);
  const router = useRouter();
  if (!user) {
    signOut();
    router.push("/auth/signIn");
  }
  const toggleTask = (idx, status) => {
    console.log(idx);
    updateTasks((tasks) => [
      ...tasks.map((t) => {
        if (t.id === idx) t.status = status;
        return t;
      }),
    ]);
  };

  useEffect(() => {
    Array.from({ length: 31 }, (_, i) => i + 1).map((i) => {
      axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/task-progresses`, {
        data: { executionDate: `2024-05-${i < 10 ? `0${i}` : i}`, task_id: 1, task: 1, user: user.id },
      });
      axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/task-progresses`, {
        data: { executionDate: `2024-05-${i < 10 ? `0${i}` : i}`, task_id: 2, task: 2, user: user.id },
      });
      if (i % 2 == 0) {
        axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/task-progresses`, {
          data: { executionDate: `2024-05-${i < 10 ? `0${i}` : i}`, task_id: 3, task: 3, user: user.id },
        });
        axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/task-progresses`, {
          data: { executionDate: `2024-05-${i < 10 ? `0${i}` : i}`, task_id: 4, task: 4, user: user.id },
        });
      }
    });
    ["Deep Breathing for 5 minutes", "Yoga for 15 minutes (Suryanamaskara and pranayama suggested)", "Walking for 10 mins", "Listen to Music that calms you", "Journaling (Write 5 positive things about today)", "Progressive Muscle Relaxation ", "Read for 30 mins or read at least 5 pages", "engage in a hobby you like and haven't done in a while", "spend an 15 minutes with a friend or family", "Intense workout such as running or swimming ", "engaging in organisational activities such as deep cleaning or organising digital files", "engage in coloring or crafts", "set 3 specific goals to complete in a day and finish them", "write positive affirmations of yourself and read them aloud", "perform visualization exercises (relax and imagine a peaceful place or outcome)", "Go to the nearest park and observe your surroundings", "Watch a movie you have been putting off", "Engage in Self-Care Practices(Prioritize self-care activities)"].map((task) => {
      axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tasks`, {
        data: { brief: task },
      });
    });
  }, []);

  return (
    <DefaultLayout user={user} pageName="Daily Tasks">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-6 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Task</th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Brief</th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks?.map((task, key) => (
                <Task key={key} task={task} toggleLoading={toggleLoading} toggleTask={toggleTask} isLoading={isLoading} user={user} />
              ))}
            </tbody>
          </table>
        </div>
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
