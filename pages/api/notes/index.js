import connectMongoDB from "@/libs/mongodb";
import TopicNote from "@/models/mongoNotes";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { user } = await getSession({ req });
      if (!user) {
        return res.status(401).json({ error: "User is not authenticated" });
      }
      await connectMongoDB();
      const userNotes = await TopicNote.find({ userId: user.id });

      res.status(200).json(userNotes);
      console.log(userNotes);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const { noteData } = req.body;
    const { noteTitle, noteText, userID } = noteData;
    await connectMongoDB();
    await TopicNote.create({
      userId: userID,
      id: Date.now(),
      title: noteTitle,
      text: noteText,
    });
    res.status(201).json({messgae: "Note Create", comment: noteData});
  } else {
    res.status(405).json({error: "Method not programmed"});
  }
}
