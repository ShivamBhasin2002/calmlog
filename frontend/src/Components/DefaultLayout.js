import Sidebar from "@/Components/Sidebar";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DefaultLayout = ({ children, user, pageName }) => {
  const [showQuestion, toggleQuestion] = useState(false);

  useEffect(() => {
    const forceQuestionare = (!user.lastQuestionare || new Date().setHours(0, 0, 0, 0) - new Date(user.lastQuestionare).setHours(0, 0, 0, 0) >= 30 * 24 * 60 * 60 * 1000) && !window.location.pathname.includes("questioner");
    toggleQuestion(forceQuestionare);
  }, []);

  if (showQuestion)
    return (
      <div className="flex h-screen overflow-hidden">
        <Head>
          <title>{pageName}</title>
        </Head>
        <Sidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 pl-[306px] w-full min-h-screen md:p-6 2xl:p-10 dark:bg-boxdark-2 dark:text-bodydark">
              <h2 className="text-title-md2 font-semibold text-black dark:text-white mb-8">Lets take a mental health quiz</h2>
              <Link href="/questioner" className="inline-flex items-center justify-center rounded-lg bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 mt-10">
                Take the quiz
              </Link>
            </div>
          </main>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen overflow-hidden">
      <Head>
        <title>{pageName}</title>
      </Head>
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 pl-[306px] w-full min-h-screen md:p-6 2xl:p-10 dark:bg-boxdark-2 dark:text-bodydark">
            <h2 className="text-title-md2 font-semibold text-black dark:text-white mb-8">{pageName}</h2>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
