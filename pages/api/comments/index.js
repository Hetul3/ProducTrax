import { comments } from "../../../data/comments";

let commentCounter = comments.length + 1;

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(comments);
  } else if (req.method === "POST") {
    const comment = req.body.comment;
    const newComment = {
      id: commentCounter,
      text: comment,
    };
    commentCounter++;
    comments.push(newComment);
    res.status(201).json(newComment);
  } else {
    res.status(405).json({ error: "Method not programmed" });
  }
}

