import DefaultLayout from "@/Components/DefaultLayout";
import { getCurrentDateFormatted } from "@/pages/questioner";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useState } from "react";

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

export default function Dashboard({ user }) {
  const [tasks, updateTasks] = useState(user.tasks);
  const [isLoading, toggleLoading] = useState(false);
  const router = useRouter();
  if (!user) {
    signOut();
    router.push("/auth/signIn");
  }
  const toggleTask = (idx, status) => {
    updateTasks((tasks) => [
      ...tasks.map((t, i) => {
        if (i === idx) t.status = status;
        return t;
      }),
    ]);
  };
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
                <tr key={key}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{task.brief}</h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{task.instructions}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div>
                      <label htmlFor="toggle3" className="flex cursor-pointer select-none items-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="toggle3"
                            className="sr-only"
                            onChange={() => {
                              if (isLoading) return;
                              toggleLoading(true);
                              if (!task.status) {
                                axios
                                  .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/task-progresses`, {
                                    data: { executionDate: getCurrentDateFormatted(), task_id: task.id, task: task.id, user: user.id },
                                  })
                                  .then(({ data }) => {
                                    toggleTask(key, data.data);
                                    toggleLoading(false);
                                  });
                              } else {
                                axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/task-progresses/${task.status.id}`).then(() => {
                                  toggleTask(key, undefined);
                                  toggleLoading(false);
                                });
                              }
                            }}
                          />
                          <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                          <div className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${task.status && "!right-1 !translate-x-full !bg-primary dark:!bg-white"}`}>
                            <span className={`hidden ${task.status && "!block"}`}>
                              <svg className="fill-white dark:fill-black" width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z" fill="" stroke="" strokeWidth="0.4"></path>
                              </svg>
                            </span>
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
