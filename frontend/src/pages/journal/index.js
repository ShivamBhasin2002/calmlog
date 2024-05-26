import dynamic from "next/dynamic";
const DefaultLayout = dynamic(() => import("@/Components/DefaultLayout"), { ssr: false });
import { getCurrentDateFormatted } from "@/pages/questionnaire";
import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const router = useRouter();
  if (!user) {
    signOut();
    router.push("/auth/signIn");
  }
  return (
    <DefaultLayout user={user} pageName="Journals">
      <Link href="/journal/new" className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mb-4">
        Create new entry
      </Link>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">S.No</th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Journal date</th>
              </tr>
            </thead>
            <tbody>
              {user.journals.map(({ date, id }, key) => (
                <tr
                  key={key}
                  className="hover:bg-white/5 cursor-pointer"
                  onClick={() => {
                    router.push(`/journal/${id}`);
                  }}
                >
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{key + 1}</h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{date}</p>
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
