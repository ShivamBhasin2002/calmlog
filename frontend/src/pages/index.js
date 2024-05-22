import { getSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { Router } from "next/router";

const Index = () => {
  return null;
};

Index.getInitialProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session === null && ctx.res) redirect(ctx.res, 307, "/auth/signIn");
  else if(ctx.res) redirect(ctx.res, 307, "/dashboard");
  return {
    props: {},
  };
};

export default Index;
