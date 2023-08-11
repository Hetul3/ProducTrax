import { comments } from "../../../data/comments";
import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/mongoComments";

export default async function handler(req, res) {
  const { commentId } = req.query;
  const { text, date } = req.body; // Rename 'currentDate' to 'updatedDate'
  // if (req.method === "GET") {
  //   const comment = comments.find(
  //     (comment) => comment.id === parseInt(commentId)
  //   );
  //   res.status(200).json(comment);

  //   try {
  //     await connectMongoDB();
  //     const 
  //   }

  // } 
  // else 
  if (req.method === "DELETE") {
    // const commentId = parseInt(req.params.commentId);

    // const deletedIndex = comments.findIndex(
    //   (comment) => comment.id === commentId
    // );

    // if (deletedIndex === -1) {
    //   return res.status(404).json({ error: "Comment not found" });
    // }

    // const deletedComment = comments.splice(deletedIndex, 1)[0];

    try {
      await connectMongoDB();
      await Topic.deleteOne({ id: commentId }); // Delete the comment from MongoDB
      res.status(200).json({ message: "Comment deleted from MongoDB" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error when deleting" });
    }
  } else if (req.method === "PUT") {
    try {
      await connectMongoDB();

      const updatedComment = await Topic.findOneAndUpdate(
        { id: parseInt(commentId) },
        {
          $set: {
            text: text,
            date: {
              month: date.month,
              day: date.day,
              hour: date.hour,
              minute: date.minute,
              seconds: date.seconds,
            },
          },
        },
        { new: true } // Return the updated document
      );

      res.status(200).json(updatedComment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error when updating" });
    }
  }
}
