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

export default function Dashboard({ user, journal }) {
  const router = useRouter();
  if (!user) {
    signOut();
    router.push("/auth/signIn");
  }
  return (
    <DefaultLayout user={user} pageName={`Journals for ${journal.date}`}>
      <button
        className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 absolute right-10 top-4 "
        onClick={async () => {
          const text = document.querySelector("#journal-box").value;
          console.log({
            content: text,
            date: getCurrentDateFormatted(),
            user: user.id,
          });
          axios
            .put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/journals/${journal.id}`, {
              data: {
                content: text,
              },
            })
            .then(() => {
              window.open("/journal", "_self");
            });
        }}
      >
        Update
      </button>
      <button
        className="inline-flex items-center justify-center rounded-full bg-danger px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 absolute right-50 top-4 "
        onClick={async () => {
          const text = document.querySelector("#journal-box").value;
          console.log({
            content: text,
            date: getCurrentDateFormatted(),
            user: user.id,
          });
          axios.delete(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/journals/${journal.id}`).then(() => {
            window.open("/journal", "_self");
          });
        }}
      >
        Delete
      </button>
      <textarea rows={35} id="journal-box" placeholder="Your memories are safe with us" className="w-full rounded-lg border-[1.5px]  bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white" defaultValue={journal.content}></textarea>
    </DefaultLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session === null && ctx.res) redirect(ctx.res, 307, "/auth/signIn");
  let user = await getPopulatedUsers(session?.id);
  const journal = user?.journals?.find((j) => j.id == ctx.query.journalId);
  return {
    props: {
      user: user,
      journal,
    },
  };
};
