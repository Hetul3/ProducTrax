import { comments } from "../../../data/comments";

let commentCounter = comments.length + 1;

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(comments);
  } else if (req.method === "POST") {
    const { commentData } = req.body; 
    const { comment, now } = commentData; 
    const newComment = {
      id: commentCounter,
      text: comment,
      date: {
        month: now.temp_month,
      day: now.temp_day,
      hour: now.temp_hour,
      minute: now.temp_minute,
      seconds: now.temp_seconds,
      }
    };
    commentCounter++;
    comments.push(newComment);
    res.status(201).json(newComment);
  } else {
    res.status(405).json({ error: "Method not programmed" });
  }
}