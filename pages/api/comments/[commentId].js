import { comments } from "../../../data/comments";

export default function handler(req, res) {
  const { commentId } = req.query;
  const { text, index, currentDate } = req.body;

  if (req.method === "GET") {
    const comment = comments.find(
      (comment) => comment.id === parseInt(commentId)
    );
    res.status(200).json(comment);
  } else if (req.method === "DELETE") {
    const deletedComment = comments.find(
      (comment) => comment.id === parseInt(commentId)
    );
    const deletedIndex = comments.findIndex(
      (comment) => comment.id === parseInt(commentId)
    );
    comments.splice(deletedIndex, 1);
    res.status(200).json(deletedComment);
  } else if (req.method === "PUT") {
    const commentToUpdate = comments[index];
    if (!commentToUpdate) {
      res.status(404).json({ error: "Comment not found." });
    } else {
      commentToUpdate.text = text;
      commentToUpdate.date = currentDate;
      res.status(200).json(commentToUpdate);
    }
  }
}
