import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { LayeredDarkPanelless } from "survey-core/themes/layered-dark-panelless";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";

import dynamic from "next/dynamic";
const DefaultLayout = dynamic(() => import("@/Components/DefaultLayout"), { ssr: false });

export function getCurrentDateFormatted() {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

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

const Questioner = ({ questions, user }) => {
  const session = useSession();
  const surveyJson = {
    pages: [
      {
        elements: [
          {
            type: "html",
            html: "<h4>In this survey, we will ask you a couple questions about you, which will help us asses your mental health.</h4>",
          },
        ],
      },

      ...questions.map(({ id, attributes }) => {
        if (attributes.type === "preference")
          return {
            elements: [
              {
                name: `Q${id}`,
                title: attributes.question,
                type: "radiogroup",
                choices: [
                  { value: 1, text: "Did not apply to me at all " },
                  { value: 2, text: "Applied to me to some degree, or some of the time" },
                  { value: 3, text: "Applied to me to a considerable degree, or a good part of the time" },
                  { value: 4, text: "Applied to me very much, or most of the time" },
                ],
                isRequired: true,
              },
            ],
          };
      }),
    ],
    pageNextText: "Forward",
    completeText: "Submit",
    showPrevButton: true,
    firstPageIsStarted: true,
    startSurveyText: "Take the Survey",
    completedHtml: "Thank you for your answering!",
    showPreviewBeforeComplete: "showAnsweredQuestions",
  };
  const survey = new Model(surveyJson);
  survey.applyTheme(LayeredDarkPanelless);
  survey.onComplete.add(async (res) => {
    const mentalHealthScore = (await axios.post("/api/getMetnalHealthScore", { ans: res.data })).data.mentalHealthScore;
    const lastQuestionare = getCurrentDateFormatted();
    let tasks = [];
    if (mentalHealthScore === 2) tasks = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    else if (mentalHealthScore === 3) tasks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    else if (mentalHealthScore === 1) tasks = [19];
    await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${session.data.id}`, { mentalHealthScore, lastQuestionare, tasks });
    window.open("/dashboard", "_self");
  });
  return (
    <DefaultLayout user={user} pageName="Questioner">
      <div className="min-h-screen bg-[#262933]">
        <Survey model={survey} />
      </div>
    </DefaultLayout>
  );
};

Questioner.getInitialProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session == null) {
    return {
      redirect: {
        destination: "/auth/not-authenticated",
        permanent: true,
      },
    };
  }
  let questions = (await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/questions`)).data.data;
  if (ctx.query.questions) questions = questions.slice(0, ctx.query.questions);
  let user = await getPopulatedUsers(session?.id);
  return {
    questions,
    user,
  };
};

export default Questioner;
