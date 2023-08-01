//for this to work, you need to go on github -> Profile -> Settings -> Developer Settings ->
//OAuth Apps -> When giving the link, set it to http://localhost:3000/ when developing, and the actual link when deploying


//for google Google cloud -> console -> api service -> credentials -> config consent screen -> credentials -> add url
import NextAuth from "next-auth";

import GithubProviders from "next-auth/providers/github";
import GoogleProviders from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GithubProviders({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProviders({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
});
