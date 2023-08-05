import connectMongoDB from "@/libs/mongodb";
import { comments } from "../../../data/comments";
import Topic from "@/models/mongoComments";
import { getSession } from "next-auth/react";

let commentCounter = comments.length + 1;

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { user } = await getSession({ req });
      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      await connectMongoDB();
      const userComments = await Topic.find({ userId: user.id });

      res.status(200).json(userComments);
      console.log(userComments);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const { commentData } = req.body;
    const { comment, now, userID } = commentData;
    const newComment = {
      id: Date.now(),
      text: comment,
      date: {
        month: now.temp_month,
        day: now.temp_day,
        hour: now.temp_hour,
        minute: now.temp_minute,
        seconds: now.temp_seconds,
      },
    };
    commentCounter++;
    comments.push(newComment);

    await connectMongoDB();
    await Topic.create({
      userId: userID,
      id: Date.now(),
      text: comment,
      date: {
        month: now.temp_month,
        day: now.temp_day,
        hour: now.temp_hour,
        minute: now.temp_minute,
        seconds: now.temp_seconds,
      },
    });
    res.status(201).json({ message: "Topic Created", comment: newComment });
  } else {
    res.status(405).json({ error: "Method not programmed" });
  }
}
