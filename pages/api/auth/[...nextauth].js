//for this to work, you need to go on github -> Profile -> Settings -> Developer Settings ->
//OAuth Apps -> When giving the link, set it to http://localhost:3000/ when developing, and the actual link when deploying


//for google Google cloud -> console -> api service -> credentials -> config consent screen -> credentials -> add url
import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import GithubProviders from "next-auth/providers/github";
import GoogleProviders from "next-auth/providers/google";

const uri = process.env.DB_URL;

if (!uri) {
  throw new Error('Missing environment variable: "DB_URL"');
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
    console.log("MongoDB client connected");
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  console.log("MongoDB client connected");
}

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
  adapter: MongoDBAdapter(clientPromise),
  session: {
    jwt: true,
  },
  jwt: {
    secret: 'fewoh4i3th$IOG#GI',
  }
});
